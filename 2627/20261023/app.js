import { missions } from './missions.js';
import { checkOutput } from './checks.js';
import { freshState as createState, normaliseState as restoreState, recordOutput, recordIdea } from './state.js';
import { buildNotebookHtml, buildNotebookPdf, notebookFilename, notebookReadiness } from './notebook.js';
import { challengeHtml, poolLessonHtml, notebookPanelHtml, readinessHtml, outputHistoryHtml, ideaHistoryHtml } from './classroom-ui.js';
import { mountPoolExplainer } from './pool-explainer.js';

const STORAGE_KEY = 'pool-lab-classroom-v2';
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = (name, extra = '') => `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const short = (value, max = 50000) => typeof value === 'string' ? value.slice(0, max) : '';
let storageAvailable = true;
let saveTimer;
let toastTimer;
let lastDialogTrigger;
let pendingImport = null;
let disposePool = null;

function freshState() { return createState(missions); }
function normaliseState(input) { return restoreState(input,missions); }
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('pool-lab-progress-v1');
    return raw ? normaliseState(JSON.parse(raw)) : freshState();
  } catch {
    try { localStorage.setItem('pool-lab-storage-check', 'ok'); localStorage.removeItem('pool-lab-storage-check'); }
    catch { storageAvailable = false; }
    return freshState();
  }
}
let state = loadState();
const mission = () => missions[state.current];
const session = () => state.sessions[mission().id];
const completedCount = () => missions.filter(m => state.sessions[m.id].completed).length;
const unlockedIndex = () => { const i = missions.findIndex(m => !state.sessions[m.id].completed); return i === -1 ? missions.length - 1 : i; };
function saveState() {
  clearTimeout(saveTimer);
  state.updatedAt = new Date().toISOString();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageAvailable = true; }
  catch { storageAvailable = false; }
  $('save-label').innerHTML = `<span class="status-dot${storageAvailable ? '' : ' warning'}"></span>${storageAvailable ? 'Guardado en este navegador' : 'Guarda una copia en Mi progreso'}`;
}
function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(saveState, 300); }

function highlightPython(source) {
  const pattern = /#[^\n]*|(?:f|r)?"(?:\\.|[^"\\])*"|(?:f|r)?'(?:\\.|[^'\\])*'|\b(?:def|return|for|in|if|from|import|with|as|True|False|None|else)\b|\b(?:print|range|len|Pool|perf_counter|sleep)\b|\b\d[\d_]*(?:\.\d+)?\b/g;
  let html = '', cursor = 0;
  for (const match of source.matchAll(pattern)) {
    html += esc(source.slice(cursor, match.index));
    const token = match[0];
    const type = token.startsWith('#') ? 'comment' : /^(?:f|r)?["']/.test(token) ? 'string' : /^\d/.test(token) ? 'number' : /^(print|range|len|Pool|perf_counter|sleep)$/.test(token) ? 'built' : 'keyword';
    html += `<span class="tok-${type}">${esc(token)}</span>`;
    cursor = match.index + token.length;
  }
  return html + esc(source.slice(cursor));
}
function renderPrediction() {
  const s=session(), m=mission(), locked=Boolean(s.predictionSavedAt);
  $('prediction-label').textContent=m.predictionPrompt || '¿Qué crees que va a ocurrir? ¿Por qué?';
  $('prediction-input').value=s.prediction;
  $('prediction-input').readOnly=locked;
  $('prediction-button').disabled=locked;
  $('prediction-button').textContent=locked?'Predicción guardada':'Guardar mi predicción';
  $('prediction-status').textContent=locked?(s.predictionTiming==='after'?'Registrada después de una prueba':'Conservamos tu idea inicial'):'Tu primera hipótesis';
}
function renderHistories() {
  const s=session(),m=mission();
  $('output-history').hidden=!s.outputHistory.length;
  $('output-history-count').textContent=`(${s.outputHistory.length})`;
  $('output-history-content').innerHTML=outputHistoryHtml(s,m);
  $('idea-history').hidden=!s.ideaHistory.length;
  $('idea-history-count').textContent=`(${s.ideaHistory.length})`;
  $('idea-history-content').innerHTML=ideaHistoryHtml(s,m);
}
function showCover() {
  $('lab-app').hidden=true; $('welcome-screen').hidden=false;
  $('student-name').value=state.profile.name;
  $('student-group').value=state.profile.group;
  $('start-button').innerHTML=`${state.profile.name?'Continuar mi laboratorio':'Iniciar laboratorio'} <span aria-hidden="true">↗</span>`;
  $('welcome-status').textContent=state.profile.name?`${completedCount()}/8 misiones guardadas para ${state.profile.name}.`:'Tu nombre aparecerá en el cuaderno que entregarás.';
  $('new-student-button').hidden=!state.profile.name;
  document.title='Pool Lab · Entra en el laboratorio';
  window.scrollTo({top:0,behavior:'auto'});
}
async function downloadNotebookPdf(button) {
  const status=$('pdf-status'), dialog=$('app-dialog');
  if(!status || !dialog?.open) return;
  button.disabled=true;
  if(status.dataset.pdfUrl) {
    URL.revokeObjectURL(status.dataset.pdfUrl);
    delete status.dataset.pdfUrl;
  }
  status.textContent='Preparando todas tus evidencias en PDF…';
  try {
    saveState();
    if(!window.PDFLib) throw new Error('La biblioteca PDF no ha terminado de cargar. Espera unos segundos y vuelve a intentarlo.');
    const snapshot=structuredClone(state);
    const bytes=await buildNotebookPdf(snapshot,missions,window.PDFLib);
    // La generación es asíncrona: la descarga necesita un nuevo clic directo.
    // Conservamos un enlace real para no depender de la activación ya caducada.
    if(!status.isConnected || !dialog.open) return;
    const filename=notebookFilename(snapshot,missions,'pdf');
    const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
    status.dataset.pdfUrl=url;
    const link=document.createElement('a');
    link.id='prepared-pdf-link';
    link.className='button button-dark';
    link.href=url;
    link.download=filename;
    link.textContent='Guardar PDF preparado';
    const name=document.createElement('small');
    name.textContent=filename;
    status.replaceChildren(
      document.createTextNode('PDF preparado. Pulsa el enlace para guardarlo; después ábrelo y revisa tu entrega.'),
      document.createElement('br'), link, document.createElement('br'), name
    );
    dialog.addEventListener('close',()=>{
      URL.revokeObjectURL(url);
      if(status.dataset.pdfUrl===url) delete status.dataset.pdfUrl;
    },{once:true});
    toast('Cuaderno PDF preparado. Pulsa «Guardar PDF preparado» para descargarlo.');
  } catch(error) {
    if(status.isConnected)status.textContent=`No se pudo generar el PDF: ${error.message}. Puedes descargar la versión HTML y usar Imprimir → Guardar como PDF.`;
  } finally {button.disabled=false;}
}
function renderMap() {
  const count = completedCount(), unlocked = unlockedIndex();
  $('learner-name').textContent = state.profile.name || 'Mi cuaderno';
  $('route-count').textContent = `${count} / ${missions.length}`;
  $('xp-label').textContent = `${count * 100} XP`;
  $('overall-fill').style.width = `${count / missions.length * 100}%`;
  $('overall-progress').setAttribute('aria-valuenow', count);
  const rank = count === 8 ? 'Piloto de procesos' : count >= 6 ? 'Investigador' : count >= 4 ? 'Constructor' : count >= 2 ? 'Analista' : 'Explorador';
  $('rank-label').textContent = rank;
  $('level-label').textContent = String(Math.min(count + 1, 8)).padStart(2, '0');
  $('mission-map').innerHTML = missions.map((m, i) => {
    const done = state.sessions[m.id].completed, locked = i > unlocked, current = i === state.current;
    return `<button class="mission-item${current ? ' current' : ''}${done ? ' completed' : ''}${locked ? ' locked' : ''}" data-mission="${i}" ${locked ? 'disabled' : ''} ${current ? 'aria-current="step"' : ''} aria-label="Misión ${m.number}: ${esc(m.shortTitle)}${done ? ', superada' : locked ? ', bloqueada' : ''}"><span class="mission-node">${done ? icon('check') : String(m.number).padStart(2,'0')}</span><span class="mission-item-copy"><strong>${esc(m.shortTitle)}</strong><small>${esc(m.category)}</small></span>${locked ? icon('lock','nav-status') : current ? icon('arrow','nav-status') : ''}</button>`;
  }).join('');
}
function showFeedback(element, data, extra = '') {
  if (!data) { element.hidden = true; element.replaceChildren(); return; }
  element.hidden = false;
  element.className = `feedback ${data.ok ? 'success' : data.info ? 'info' : 'error'}`;
  element.innerHTML = `<strong>${data.ok ? icon('check') : icon('hint')}${esc(data.title)}</strong><p>${esc(data.message)}</p>${data.details?.length ? `<ul>${data.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}${extra}`;
}
function renderTrial() {
  const m = mission(), s = session(), t = m.trials.find(t => t.id === s.activeTrial);
  for (const item of m.trials) {
    const active = item.id === t.id, passed = s.verdicts[item.id]?.ok;
    const tab = $(`trial-${item.id}`);
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', active);
    tab.tabIndex = active ? 0 : -1;
    $(`status-${item.id}`).classList.toggle('passed', Boolean(passed));
    $(`status-${item.id}`).innerHTML = passed ? icon('check') : item.id === 'base' ? '1' : '2';
  }
  $('trial-panel').setAttribute('aria-labelledby', `trial-${t.id}`);
  $('trial-prompt').textContent = t.prompt;
  $('output-input').value = s.outputs[t.id];
  $('output-input').setAttribute('aria-label', `Salida de tu terminal: ${t.label}`);
  $('output-input').placeholder = ['pids','timer','benchmark','dual_list'].includes(t.check.kind) ? 'Pega la salida completa de esta ejecución…' : 'Pega aquí lo que ha impreso Python…';
  $('experiment-card').classList.toggle('active', t.id === 'variant');
  const verdict = s.verdicts[t.id];
  const extra = verdict?.ok && t.id === 'base' && !s.verdicts.variant?.ok ? '<button class="feedback-action" data-action="experiment">Ir al experimento →</button>' : '';
  showFeedback($('output-feedback'), verdict?.ok ? {...verdict, message: t.success + ' ' + verdict.message} : verdict, extra);
  renderMeasurements(verdict);
  renderHistories();
}
function renderMeasurements(verdict) {
  const el = $('measurements'), metrics = verdict?.ok ? verdict.metrics : null;
  if (!metrics || metrics.pool == null) { el.hidden = true; el.replaceChildren(); return; }
  el.hidden = false;
  const max = Math.max(metrics.sequential, metrics.pool, 0.0001);
  const format = n => Number(n).toLocaleString('es-ES', n > 0 && n < 0.01 ? {maximumSignificantDigits: 3} : {maximumFractionDigits: 4}) + ' s';
  el.innerHTML = `<span class="eyebrow">TUS MEDIDAS</span>${[['Secuencial',metrics.sequential],['Con Pool',metrics.pool]].map(([label,n]) => `<div class="measurement-row"><span>${label}</span><div class="measurement-track"><i style="width:${Math.max(n === 0 ? 0 : 2, n / max * 100)}%"></i></div><strong class="measurement-number">${format(n)}</strong></div>`).join('')}<p>${metrics.sequential === 0 || metrics.pool === 0 ? 'Hay tiempos redondeados a cero. Más decimales te darán una comparación más precisa.' : metrics.pool < metrics.sequential ? 'En esta ejecución, Pool ha empleado menos tiempo.' : metrics.pool > metrics.sequential ? 'En esta ejecución, el trabajo secuencial ha empleado menos tiempo. También es un resultado válido.' : 'Los tiempos mostrados coinciden en esta ejecución.'}</p>`;
}
function renderReflection() {
  const m = mission(), s = session(), r = m.reflection;
  $('reflection-question').textContent = r.question;
  $('reflection-options').innerHTML = '<legend class="sr-only">Elige tu explicación</legend>' + r.options.map((option, i) => {
    const selected = s.reflectionChoice === i, checked = s.reflectionChecked && selected;
    return `<label class="option${selected ? ' selected' : ''}${checked ? i === r.correct ? ' right' : ' wrong' : ''}"><input type="radio" name="reflection" value="${i}" ${selected ? 'checked' : ''}><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${esc(option)}</span></label>`;
  }).join('');
  if (s.reflectionChecked) {
    const ok = s.reflectionChoice === r.correct;
    showFeedback($('idea-feedback'), {ok, title: ok ? 'Esa es la conexión' : 'Vamos a localizar la confusión', message: r.feedback?.[s.reflectionChoice] || r.explanation});
  } else showFeedback($('idea-feedback'), null);
  $('notes-input').value = s.note;
  $('evidence-prompt').textContent = m.evidencePrompt || 'Explica qué ha ocurrido y qué dato te permite afirmarlo.';
  renderHistories();
}
function renderHints() {
  const s = session(), m = mission();
  $('hint-list').hidden = !s.hints;
  $('hint-list').innerHTML = m.hints.slice(0,s.hints).map(text => `<li>${esc(text)}</li>`).join('');
  $('hint-button').textContent = s.hints >= 3 ? 'Las 3 pistas están abiertas' : `Abrir pista ${s.hints + 1} de 3`;
  $('hint-button').disabled = s.hints >= 3;
}
function renderCompletion() {
  const m = mission(), s = session();
  $('completion-card').hidden = !s.completed;
  $('completion-takeaway').textContent = m.takeaway;
  $('next-button').disabled = !s.completed;
  $('next-button').innerHTML = s.completed ? `<span>${state.current === missions.length - 1 ? 'Preparar mi cuaderno para entregar' : 'Siguiente misión'}</span>${icon('arrow')}` : `<span>Completa las dos pruebas y la idea</span>${icon('lock')}`;
}
function renderMission({focus = false} = {}) {
  const m = mission(), s = session();
  disposePool?.(); disposePool = null;
  document.title = `${m.shortTitle} · Pool Lab`;
  $('mission-number').textContent = `MISIÓN ${String(m.number).padStart(2,'0')} / 08`;
  $('mission-time').textContent = m.minutes;
  $('mission-title').innerHTML = esc(m.title) + '<span class="title-dot">.</span>';
  $('mission-narrative').textContent = m.narrative;
  $('mission-goal').textContent = m.goal;
  $('concepts').innerHTML = m.concepts.map(c => `<div><strong>${esc(c.term)}</strong><p>${esc(c.text)}</p></div>`).join('');
  $('walkthrough').innerHTML = m.walkthrough.map(text => `<li><p>${esc(text)}</p></li>`).join('');
  $('code-filename').textContent = m.fileName;
  $('starter-code-panel').hidden = m.codeMode === 'challenge';
  $('mission-code').innerHTML = m.codeMode === 'challenge' ? '' : highlightPython(m.code);
  $('code-challenge').hidden = !m.challenge;
  $('code-challenge').innerHTML = m.challenge ? challengeHtml(m.challenge) : '';
  $('pool-lesson').hidden = !m.poolLesson;
  $('pool-lesson').innerHTML = m.poolLesson ? poolLessonHtml(m.poolLesson) : '';
  $('pool-explainer').hidden = !m.poolLesson;
  if (m.poolLesson) disposePool = mountPoolExplainer($('pool-explainer'),{onComplete:run=>{state.sessions[m.id].simulationHistory.push(run); saveState(); toast('Exploración guardada en tu cuaderno como modelo didáctico.');}});
  else $('pool-explainer').replaceChildren();
  $('actual-code-input').value = s.actualCode;
  $('own-code-requirement').textContent = ['timer','final'].includes(m.id) ? 'necesario para entregar' : 'opcional';
  $('own-code-card').open = ['timer','final'].includes(m.id);
  renderPrediction();
  $('run-command').textContent = m.command;
  $('experiment-prompt').textContent = m.trials[1].prompt;
  $('experiment-change').textContent = m.trials[1].change || 'Sigue las indicaciones del experimento.';
  renderMap(); renderTrial(); renderReflection(); renderHints(); renderCompletion();
  if (focus) {
    $('concept-card').open = false;
    $('mission-title').tabIndex = -1;
    $('mission-title').focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'auto'});
  }
}
function selectMission(index) {
  if (!Number.isInteger(index) || index < 0 || index > unlockedIndex()) return;
  state.current = index;
  closeMap();
  renderMission({focus:true}); saveState();
}
function selectTrial(id, focus = false) {
  session().activeTrial = id === 'variant' ? 'variant' : 'base';
  renderTrial(); saveState();
  if (focus) { $('check-station').scrollIntoView({behavior:'auto',block:'start'}); $('output-input').focus({preventScroll:true}); }
}
function maybeComplete() {
  const s = session(), m = mission();
  if (s.completed || !s.predictionSavedAt || !m.trials.every(t => s.verdicts[t.id]?.ok) || !s.reflectionChecked || s.reflectionChoice !== m.reflection.correct) return;
  s.completed = true;
  s.completedAt = new Date().toISOString();
  s.completionEvidence = {outputs:{...s.outputs},reflectionChoice:s.reflectionChoice,at:s.completedAt};
  celebrate();
  toast(`¡Misión ${m.number} superada! +${m.xp} XP`);
}
function celebrate() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const container = $('celebration');
  container.replaceChildren();
  for (let i=0;i<26;i++) {
    const piece = document.createElement('i');
    piece.className = 'confetti';
    piece.style.left = `${20 + Math.random()*65}%`;
    piece.style.background = ['#cbe781','#a695c6','#e4ad6d','#728b70'][i%4];
    piece.style.animationDelay = `${Math.random()*0.3}s`;
    piece.style.setProperty('--drift',`${Math.random()*200-100}px`);
    piece.style.setProperty('--rotation',`${Math.random()*720}deg`);
    container.append(piece);
  }
  setTimeout(() => container.replaceChildren(), 1800);
}
function toast(message) {
  clearTimeout(toastTimer);
  $('toast').textContent = message; $('toast').hidden = false;
  toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4200);
}
async function copyText(text, success = 'Copiado. Ya puedes pegarlo.') {
  try {
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(text); copied = true; } catch { /* La selección manual sigue disponible. */ }
    }
    if (!copied) {
      const previousFocus = document.activeElement;
      const area = document.createElement('textarea');
      area.value = text; area.style.position = 'fixed'; area.style.opacity = '0';
      ($('app-dialog').open ? $('app-dialog') : document.body).append(area); area.select();
      copied = document.execCommand('copy'); area.remove(); previousFocus?.focus();
      if (!copied) throw new Error('clipboard');
    }
    toast(success); return true;
  } catch {
    toast('No se pudo copiar automáticamente. Selecciona el texto y usa Ctrl+C o ⌘C.');
    return false;
  }
}
function downloadText(filename, text, type='text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text],{type}));
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url),3000);
}
function exportProgress() {
  saveState();
  downloadText(notebookFilename(state,missions,'json'), JSON.stringify({app:'Pool Lab',...state},null,2),'application/json');
  toast('Copia descargada. Podrás recuperarla en Mi progreso.');
}
function buildReport(m = mission()) {
  const s = state.sessions[m.id];
  const lines = [`ALUMNO: ${state.profile.name || 'Sin nombre'} — ${state.profile.group || 'Sin grupo'}`, 'Estoy aprendiendo multiprocessing.Pool en Pool Lab. Quiero que revises mis resultados y mi razonamiento paso a paso. Si hay un error, dame primero una pista concreta para que pueda corregirlo.', '', `MISIÓN ${m.number}/8: ${m.title} — ${m.shortTitle}`, `Objetivo: ${m.goal}`, `Archivo de partida: ${m.fileName}`, `Progreso del recorrido: ${completedCount()}/8 misiones`, ''];
  for (const t of m.trials) {
    lines.push(t.label.toUpperCase(), t.prompt, ...(t.change ? [`Cambio pedido: ${t.change}`] : []), 'Salida que he pegado:', s.outputs[t.id] || '(Todavía no he pegado una salida.)', `Comprobación automática: ${s.verdicts[t.id] ? s.verdicts[t.id].ok ? 'La salida coincide.' : s.verdicts[t.id].title + '. ' + s.verdicts[t.id].message : 'Pendiente.'}`, '');
  }
  lines.push('MI PREDICCIÓN',s.prediction || '(Pendiente.)','','MI RAZONAMIENTO',m.reflection.question,`He elegido: ${s.reflectionChoice === null ? '(Sin responder.)' : m.reflection.options[s.reflectionChoice]}`,`Mis observaciones o dudas: ${s.note || '(Sin anotaciones.)'}`,'','MI CÓDIGO');
  lines.push(s.actualCode || 'No he adjuntado el código que he ejecutado. Necesito incorporarlo para que puedas revisarlo.', '', 'Ayúdame a interpretar lo observado y dime qué cambio concreto puedo probar a continuación.');
  return lines.join('\n');
}
function openDialog(kind) {
  const dialog = $('app-dialog');
  if (!dialog.open) lastDialogTrigger = document.activeElement;
  const m = mission(), s = session(), count = completedCount();
  let html = '';
  if (kind === 'notebook' || kind === 'finish') {
    html = notebookPanelHtml(state,missions,notebookReadiness(state,missions));
  } else if (kind === 'how' || kind === 'setup') {
    html = `<h2 id="dialog-title">${kind === 'setup'?'Prepara tu laboratorio':'El resultado necesita una explicación'}</h2><p class="modal-intro">Python se ejecuta en tu equipo. La web acompaña el experimento y guarda las evidencias en tu cuaderno.</p><div class="modal-steps"><div class="modal-step"><b>1</b><h3>Predice</h3><p>Escribe qué crees que ocurrirá y por qué. Guarda esa primera idea antes de comprobar la salida.</p></div><div class="modal-step"><b>2</b><h3>Programa y ejecuta</h3><p>Usa archivos .py completos desde la terminal de VS Code. Comprueba <code>python --version</code>; también puedes usar <code>py</code> o <code>python3</code>. Los ejemplos no necesitan paquetes de pip.</p></div><div class="modal-step"><b>3</b><h3>Cambia y explica</h3><p>Pega la primera salida, realiza el experimento y comprueba la nueva. Responde la pregunta, lee la corrección y anota una observación respaldada por un dato.</p></div><div class="modal-step"><b>4</b><h3>Entrega tu cuaderno</h3><p>Completa la síntesis final en «Mi cuaderno», descarga el PDF y súbelo a Moodle. En las misiones 3 y 8 debes aportar tu código.</p></div></div><div class="modal-tip">Dos salidas comprobadas y una idea correcta desbloquean una misión. Los errores y las pistas no restan puntos. Los XP muestran recorrido; tu profesor valorará la comprensión y las evidencias.</div><div class="modal-actions"><button class="button button-dark" data-action="close-dialog">Volver al laboratorio ${icon('arrow')}</button></div>`;
  } else if (kind === 'mentor') {
    html = `<h2 id="dialog-title">Revisión con ChatGPT</h2><p class="modal-intro">Copia el informe y pégalo en tu conversación. Incluye esta misión, tus salidas, tu respuesta y tus anotaciones.</p><div class="modal-tip"><strong>1. Copia el informe. 2. Pégalo en el chat.</strong><p>La página no envía mensajes automáticamente. Esta ayuda no sustituye tu cuaderno de entrega ni la revisión docente.</p></div><details class="dialog-section"><summary>Añadir mi código ejecutado</summary><label for="mentor-code">Tu archivo Python</label><textarea class="code-input" id="mentor-code" maxlength="50000" spellcheck="false" rows="6">${esc(s.actualCode)}</textarea></details><label class="field-label" for="mentor-report">Informe listo para compartir</label><textarea class="report-textarea" id="mentor-report" readonly rows="11">${esc(buildReport())}</textarea><div class="modal-actions"><button class="button button-outline" data-action="download-report">Descargar informe</button><button class="button button-dark" data-action="copy-report">Copiar para ChatGPT</button></div>`;
  } else if (kind === 'progress') {
    const attempts=Object.values(state.sessions).reduce((a,s)=>a+s.attempts,0);
    const badges=[{label:'Primera señal',text:'Tu primera misión',unlocked:state.sessions.sum.completed},{label:'En equipo',text:'Has descubierto Pool',unlocked:state.sessions.pool.completed},{label:'Con evidencia',text:'Has comparado tiempos',unlocked:state.sessions.benchmark.completed},{label:'Piloto de procesos',text:'Recorrido completo',unlocked:count===8}];
    html = `<h2 id="dialog-title">Tu recorrido, ${esc(state.profile.name || 'explorador')}</h2><p class="modal-intro">Tus intentos y descubrimientos forman parte del aprendizaje. Puedes volver a las misiones y recuperar una copia de otro equipo.</p><div class="metric-grid"><div class="metric"><strong>${count}<small>/8</small></strong><span>Misiones superadas</span></div><div class="metric"><strong>${count*100}</strong><span>XP · no son una nota</span></div><div class="metric"><strong>${attempts}</strong><span>Comprobaciones</span></div></div><div class="badge-grid">${badges.map(b=>`<div class="badge ${b.unlocked?'unlocked':'pending'}">${icon(b.unlocked?'award':'lock')}<strong>${b.label}</strong><span>${b.text}</span></div>`).join('')}</div><div class="progress-missions">${missions.map((item,i)=>`<button class="progress-mission" data-jump="${i}" ${i>unlockedIndex()?'disabled':''}><span>${String(item.number).padStart(2,'0')}</span><strong>${esc(item.shortTitle)}</strong>${icon(state.sessions[item.id].completed?'check':i>unlockedIndex()?'lock':'arrow')}</button>`).join('')}</div><div class="modal-tip">Guarda una copia JSON al terminar la sesión. Así podrás recuperar el cuaderno si cambias de ordenador o se borran los datos del navegador.</div><div class="modal-actions"><button class="button button-dark" data-action="notebook">Preparar mi entrega</button><button class="button button-outline" data-action="export-progress">Guardar copia JSON</button><button class="button button-outline" data-action="choose-import">Recuperar copia</button><input type="file" accept=".json,application/json" id="import-file" class="sr-only" tabindex="-1"></div><div id="import-result" aria-live="polite"></div><button class="danger-button" data-action="reset-dialog">Otro alumno / nuevo cuaderno</button>`;
  } else if (kind === 'reset') {
    html = `<h2 id="dialog-title">Empezar otro cuaderno</h2><p class="modal-intro">El nuevo cuaderno empezará sin las respuestas, el nombre y las notas actuales. Descarga una copia antes si quieres conservar este trabajo.</p><div class="modal-actions"><button class="button button-outline" data-action="export-progress">Guardar copia JSON</button><button class="button button-outline" data-action="close-dialog">Cancelar</button><button class="button button-dark" data-action="confirm-reset">Empezar un cuaderno nuevo</button></div>`;
  } else if (kind === 'resources') {
    html = `<h2 id="dialog-title">Tu caja de herramientas</h2><p class="modal-intro">Cada misión con ejemplo permite descargar su archivo Python. La misión 3 es un encargo de programación propia: sus requisitos son el punto de partida.</p><div class="dialog-section"><h3>Referencias y guía docente</h3><ul class="source-list"><li><a href="./readme.md" target="_blank">Guía para el profesor y criterios de entrega ↗</a></li><li><a href="https://www.youtube.com/watch?v=u2jTn-Gj2Xw" target="_blank" rel="noopener noreferrer">Multiprocessing in Python: Pool · LucidProgramming ↗</a></li><li><a href="https://docs.python.org/3/library/multiprocessing.html" target="_blank" rel="noopener noreferrer">Python: Pool, map, starmap y procesos ↗</a></li><li><a href="https://docs.python.org/3/library/time.html" target="_blank" rel="noopener noreferrer">Python: perf_counter y sleep ↗</a></li></ul></div><p class="field-help">Adaptación didáctica original sobre el tema del vídeo. La portada toma como referencia el lenguaje visual retro de Omarchy. El simulador es un modelo; tus tiempos reales proceden de Python.</p>`;
  }
  $('dialog-content').innerHTML=html; dialog.dataset.kind=kind;
  if(!dialog.open) dialog.showModal();
  $('close-dialog').focus();
}
function closeDialog() { $('app-dialog').close(); }
function closeMap() { $('sidebar').classList.remove('open'); $('map-scrim').hidden = true; $('map-toggle').setAttribute('aria-expanded','false'); }

$('mission-map').addEventListener('click', (e) => { const b = e.target.closest('[data-mission]'); if (b) selectMission(Number(b.dataset.mission)); });
$('map-toggle').addEventListener('click', () => { const open = !$('sidebar').classList.contains('open'); $('sidebar').classList.toggle('open',open); $('map-scrim').hidden = !open; $('map-toggle').setAttribute('aria-expanded',open); });
$('map-scrim').addEventListener('click',closeMap);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMap(); });
for (const id of ['base','variant']) $(`trial-${id}`).addEventListener('click',() => selectTrial(id));
document.querySelector('.trial-tabs').addEventListener('keydown',e => {
  if (['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) { e.preventDefault(); const id = e.key === 'Home' ? 'base' : e.key === 'End' ? 'variant' : session().activeTrial === 'base' ? 'variant' : 'base'; selectTrial(id); $(`trial-${id}`).focus(); }
});
$('output-input').addEventListener('input', () => {
  const s = session(); s.outputs[s.activeTrial] = $('output-input').value; delete s.verdicts[s.activeTrial];
  showFeedback($('output-feedback'),null); $('measurements').hidden = true;
  $(`status-${s.activeTrial}`).classList.remove('passed'); $(`status-${s.activeTrial}`).textContent = s.activeTrial === 'base' ? '1' : '2'; saveSoon();
});
$('check-button').addEventListener('click', () => {
  const s = session(), t = mission().trials.find(t => t.id === s.activeTrial);
  if (!s.predictionSavedAt) { showFeedback($('output-feedback'),{ok:false,info:true,title:'Guarda primero tu predicción',message:'Escribe qué crees que ocurrirá y por qué, en el bloque «Antes de ejecutar». Después comprobamos la salida.'}); $('prediction-input').focus(); return; }
  const output=$('output-input').value;
  recordOutput(s,t.id,output,checkOutput(t.check,output));
  maybeComplete(); renderTrial(); renderCompletion(); renderMap(); saveState();
});
$('output-feedback').addEventListener('click',e => { if (e.target.closest('[data-action="experiment"]')) selectTrial('variant',true); });
$('try-experiment').addEventListener('click',() => selectTrial('variant',true));
$('reflection-options').addEventListener('change',e => {
  if (e.target.name !== 'reflection') return;
  session().reflectionChoice = Number(e.target.value); session().reflectionChecked = false; renderReflection();
  document.querySelector(`input[name="reflection"][value="${session().reflectionChoice}"]`).focus(); saveState();
});
$('idea-button').addEventListener('click',() => {
  if (session().reflectionChoice === null) { showFeedback($('idea-feedback'),{ok:false,info:true,title:'Elige tu explicación',message:'Marca la opción que mejor explica lo que has observado.'}); return; }
  recordIdea(session(),mission()); maybeComplete(); renderReflection(); renderCompletion(); renderMap(); saveState();
});
$('notes-input').addEventListener('input',() => { session().note = $('notes-input').value; saveSoon(); });
$('hint-button').addEventListener('click',() => { session().hints = Math.min(session().hints+1,3); renderHints(); saveState(); });
$('copy-code').addEventListener('click',() => mission().code && copyText(mission().code,'Código copiado. Pégalo en tu archivo de Python.'));
$('download-code').addEventListener('click',() => mission().code && downloadText(mission().fileName,mission().code,'text/x-python;charset=utf-8'));
$('copy-command').addEventListener('click',() => copyText(mission().command,'Comando copiado para tu terminal.'));
$('next-button').addEventListener('click',() => { if (!session().completed) return; if (state.current === missions.length-1) openDialog('finish'); else selectMission(state.current+1); });
for (const [id,kind] of [['how-button','how'],['setup-button','setup'],['progress-button','progress'],['mentor-button','mentor'],['mission-mentor-button','mentor'],['resources-button','resources'],['notebook-button','notebook'],['sidebar-notebook','notebook']]) $(id).addEventListener('click',() => openDialog(kind));
$('close-dialog').addEventListener('click',closeDialog);
$('app-dialog').addEventListener('close',() => { pendingImport = null; if (lastDialogTrigger?.isConnected) lastDialogTrigger.focus(); });
$('app-dialog').addEventListener('click',e => {
  const target = e.target.closest('[data-action],[data-jump]');
  if (!target) return;
  if (target.dataset.jump != null) { closeDialog(); selectMission(Number(target.dataset.jump)); return; }
  const action = target.dataset.action;
  if (action === 'close-dialog') closeDialog();
  if (action === 'copy-report') copyText($('mentor-report').value,'Informe copiado. Vuelve a esta conversación y pégalo para revisarlo juntos.');
  if (action === 'download-report') downloadText(`pool-lab-mision-${mission().number}.txt`,buildReport());
  if (action === 'export-progress') exportProgress();
  if (action === 'choose-import') $('import-file').click();
  if (action === 'reset-dialog') openDialog('reset');
  if (action === 'progress') openDialog('progress');
  if (action === 'notebook') openDialog('notebook');
  if (action === 'download-notebook') { saveState(); downloadText(notebookFilename(state,missions,'html'),buildNotebookHtml(state,missions),'text/html;charset=utf-8'); }
  if (action === 'download-pdf') downloadNotebookPdf(target);
  if (action === 'confirm-reset') { state = freshState(); saveState(); closeDialog(); renderMission(); showCover(); toast('Cuaderno nuevo preparado. Escribe el nombre del alumno.'); }
  if (action === 'cancel-import') { pendingImport = null; $('import-result').replaceChildren(); $('import-file').value = ''; }
  if (action === 'confirm-import' && pendingImport) { state = pendingImport; pendingImport = null; saveState(); renderMission(); if (state.profile.name) { $('lab-app').hidden=false; $('welcome-screen').hidden=true; openDialog('progress'); } else { closeDialog(); showCover(); } toast('Progreso recuperado. Puedes continuar donde lo dejaste.'); }
});
$('app-dialog').addEventListener('input',e => {
  if (e.target.id === 'mentor-code') { session().actualCode = e.target.value; $('actual-code-input').value=e.target.value; $('mentor-report').value = buildReport(); saveSoon(); }
  if (e.target.dataset.final) { state.finalReflection[e.target.dataset.final]=e.target.value; $('notebook-readiness').innerHTML=readinessHtml(notebookReadiness(state,missions)); saveSoon(); }
});
$('app-dialog').addEventListener('change',async e => {
  if (e.target.id !== 'import-file' || !e.target.files[0]) return;
  const file = e.target.files[0];
  try {
    if (file.size > 20_000_000) throw new Error('La copia es demasiado grande. Elige un archivo exportado desde Pool Lab.');
    pendingImport = normaliseState(JSON.parse(await file.text()));
    const count = missions.filter(m => pendingImport.sessions[m.id].completed).length;
    $('import-result').innerHTML = `<div class="modal-tip"><strong>Copia de ${esc(pendingImport.profile.name || "alumno sin identificar")}: ${count}/8 misiones superadas.</strong><p>Al recuperarla se reemplaza el progreso actual de este navegador.</p><div class="modal-actions"><button class="button button-outline" data-action="cancel-import">Cancelar</button><button class="button button-dark" data-action="confirm-import">Recuperar esta copia</button></div></div>`;
  } catch(error) {
    pendingImport = null;
    $('import-result').innerHTML = `<div class="feedback error"><strong>No se ha cambiado tu progreso</strong><p>${esc(error instanceof SyntaxError ? 'El archivo no contiene un JSON válido de Pool Lab.' : error.message)}</p></div>`;
  }
});
$('welcome-form').addEventListener('submit',e=>{
  e.preventDefault();
  const name=$('student-name').value.trim();
  if(!name) { $('student-name').setCustomValidity('Escribe tu nombre para identificar el cuaderno.'); $('student-name').reportValidity(); return; }
  $('student-name').setCustomValidity('');
  state.profile.name=name; state.profile.group=$('student-group').value.trim();
  state.profile.startedAt ||= new Date().toISOString();
  $('welcome-screen').hidden=true; $('lab-app').hidden=false;
  renderMission({focus:true}); saveState();
});
$('student-name').addEventListener('input',()=> $('student-name').setCustomValidity(''));
$('new-student-button').addEventListener('click',()=>openDialog('reset'));
$('profile-button').addEventListener('click',showCover);
$('prediction-input').addEventListener('input',()=>{ if(!session().predictionSavedAt) {session().prediction=$('prediction-input').value;saveSoon();} });
$('prediction-button').addEventListener('click',()=>{
  const s=session();
  if(!s.prediction.trim()) { toast('Escribe una frase: qué crees que pasará y por qué.'); $('prediction-input').focus(); return; }
  s.predictionSavedAt=new Date().toISOString();
  s.predictionTiming=s.outputHistory.length || s.attempts ? 'after' : 'before';
  renderPrediction(); renderTrial(); maybeComplete(); renderCompletion(); renderMap(); saveState();
  toast('Predicción guardada. Ahora ejecútalo y busca una evidencia.');
});
$('actual-code-input').addEventListener('input',()=>{session().actualCode=$('actual-code-input').value; saveSoon();});
window.addEventListener('pagehide',saveState);
renderMission();
saveState();
showCover();
