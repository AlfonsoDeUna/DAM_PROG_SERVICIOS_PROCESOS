import { missions } from './missions.js';
import { checkOutput } from './checks.js';
import { freshState as createState, normaliseState as restoreState, recordOutput, recordIdea } from './state.js';
import { buildNotebookHtml, buildNotebookPdf, notebookFilename, notebookReadiness } from './notebook.js';
import { challengeHtml, poolLessonHtml, notebookPanelHtml, readinessHtml, outputHistoryHtml, ideaHistoryHtml, learningContextHtml, readingGuideHtml } from './classroom-ui.js';
import { mountPoolExplainer } from './pool-explainer.js';
import { ADMIN_ACCOUNT, verifyAdminToken } from './admin-access.js?v=20261023-access2';

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
let reviewSession = null;
let studentSnapshot = null;
let adminExpiryTimer;

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
const hasInitialTrial = s => Boolean(s.verdicts.base?.ok || s.outputHistory.some(h=>h.trial==='base' && h.ok) || s.completionEvidence);
const completedCount = () => missions.filter(m => state.sessions[m.id].completed).length;
const inReview = () => reviewSession !== null;
const unlockedIndex = () => { if (inReview()) return missions.length - 1; const i = missions.findIndex(m => !state.sessions[m.id].completed); return i === -1 ? missions.length - 1 : i; };
function saveState() {
  clearTimeout(saveTimer);
  if (inReview()) {
    $('save-label').innerHTML = '<span class="status-dot"></span>Revisión temporal · no se guarda al cerrar';
    return;
  }
  state.updatedAt = new Date().toISOString();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageAvailable = true; }
  catch { storageAvailable = false; }
  $('save-label').innerHTML = `<span class="status-dot${storageAvailable ? '' : ' warning'}"></span>${storageAvailable ? 'Guardado en este navegador' : 'Guarda una copia en Mi progreso'}`;
}
function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(saveState, 300); }

function enterReview(identity) {
  if (inReview()) return;
  saveState();
  let stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch {}
  studentSnapshot = {state:structuredClone(state),cover:!$('welcome-screen').hidden,stored};
  closeDialog();
  pendingImport = null;
  reviewSession = identity;
  state = freshState();
  state.profile = {name:'REVISIÓN DOCENTE · muestra',group:identity.login};
  $('welcome-screen').hidden = true;
  $('lab-app').hidden = false;
  renderMission({focus:true});
  saveState();
  clearTimeout(adminExpiryTimer);
  adminExpiryTimer = setTimeout(()=>exitReview(true),Math.max(0,identity.expiresAt-Date.now()));
  toast('Cuenta verificada. Puedes revisar todas las misiones con pruebas temporales.');
}
function exitReview(expired=false) {
  if (!inReview() || !studentSnapshot) return;
  clearTimeout(saveTimer);
  clearTimeout(adminExpiryTimer);
  pendingImport = null;
  closeDialog();
  const previous = studentSnapshot;
  reviewSession = null;
  studentSnapshot = null;
  state = previous.state;
  // Si otro tab ha guardado avances durante la revisión, conserva esa copia más reciente.
  try { const current = localStorage.getItem(STORAGE_KEY); if (current && current !== previous.stored) state = normaliseState(JSON.parse(current)); } catch {}
  renderMission({focus:!previous.cover});
  $('save-label').innerHTML = `<span class="status-dot${storageAvailable?'':' warning'}"></span>${storageAvailable?'Guardado en este navegador':'Guarda una copia en Mi progreso'}`;
  if (previous.cover) showCover();
  else { $('welcome-screen').hidden=true; $('lab-app').hidden=false; }
  toast(expired?'La sesión docente ha caducado. Tu cuaderno habitual está disponible.':'Revisión cerrada. Has vuelto a tu cuaderno habitual.');
}
function checkReviewExpiry() {
  if (inReview() && Date.now() >= reviewSession.expiresAt) exitReview(true);
}
async function submitAdminAccess(form) {
  const input = form.querySelector('input'), button=form.querySelector('button[type="submit"]'), status=$('admin-access-status');
  if (!input || !status || inReview() || form.dataset.verifying==='true') return;
  if (window.location.protocol!=='https:') { status.dataset.state='error'; status.textContent='La verificación docente solo está disponible en la versión HTTPS publicada.'; return; }
  const buttonLabel=button.textContent;
  button.disabled=true;
  button.textContent='Verificando con GitHub…';
  input.disabled=true;
  input.setAttribute('aria-invalid','false');
  form.dataset.verifying='true';
  status.dataset.state='pending';
  status.textContent='Comprobando tu identidad con GitHub…';
  // El valor solo llega al endpoint HTTPS de GitHub y se retira del formulario enseguida.
  const verification = verifyAdminToken(input.value);
  input.value='';
  try {
    const identity = await verification;
    if (form.isConnected && $('app-dialog').open && $('app-dialog').dataset.kind==='admin') enterReview(identity);
  } catch(error) {
    if (form.isConnected && $('app-dialog').open && $('app-dialog').dataset.kind==='admin') {
      status.dataset.state='error';
      status.textContent=error.message;
      input.setAttribute('aria-invalid',String(['invalid_format','unauthorized_token','wrong_account'].includes(error.code)));
      input.disabled=false;
      input.focus();
    }
  } finally {
    input.value=''; input.disabled=false; delete form.dataset.verifying;
    if (button.isConnected) { button.disabled=false; button.textContent=buttonLabel; }
  }
}

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
  $('prediction-label').textContent=s.predictionQuestion || m.predictionPrompt || '¿Qué crees que va a ocurrir en la primera prueba? ¿Por qué?';
  $('prediction-input').value=s.prediction;
  $('prediction-input').readOnly=locked;
  $('prediction-button').disabled=locked;
  $('prediction-button').textContent=locked?'Predicción guardada':'Guardar mi predicción';
  const earlierQuestion = s.predictionQuestion && s.predictionQuestion !== m.predictionPrompt;
  $('prediction-eyebrow').textContent=earlierQuestion?'TU PREDICCIÓN CONSERVADA':'ANTES DE TU PRIMERA PRUEBA';
  $('prediction-status').textContent=earlierQuestion?'Conservamos la pregunta de tu cuaderno':locked?(s.predictionTiming==='after'?'Registrada después de una prueba':'Conservamos tu idea inicial'):'¿Qué crees que ocurrirá?';
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
  $('route-count').textContent = inReview() ? '8 disponibles' : `${count} / ${missions.length}`;
  $('xp-label').textContent = inReview() ? 'Vista de prueba' : `${count * 100} XP`;
  $('overall-fill').style.width = `${count / missions.length * 100}%`;
  $('overall-progress').setAttribute('aria-valuenow', count);
  const rank = count === 8 ? 'Piloto de procesos' : count >= 6 ? 'Investigador' : count >= 4 ? 'Constructor' : count >= 2 ? 'Analista' : 'Explorador';
  $('rank-label').textContent = inReview() ? 'Revisión docente' : rank;
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
  const m = mission(), s = session(), initialDone = inReview() || hasInitialTrial(s);
  if (!initialDone && s.activeTrial === 'variant') s.activeTrial = 'base';
  const t = m.trials.find(t => t.id === s.activeTrial);
  $('trial-variant').disabled = !initialDone;
  $('trial-variant').title = initialDone ? 'Comprueba la segunda ejecución, después del cambio indicado.' : 'Primero comprueba la salida de la prueba inicial.';
  $('experiment-body').hidden = !initialDone;
  $('experiment-status').textContent = inReview() ? 'Disponible para revisión docente. En el recorrido del alumno se abre tras comprobar la prueba inicial.' : initialDone ? 'La prueba inicial ya está comprobada. Ahora observa qué ocurre al modificar solo lo indicado.' : 'Primero comprueba la prueba inicial. Después se abrirá el cambio que vas a investigar.';
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
  $('evidence-requirement').hidden = !['pool','pids','benchmark'].includes(m.id);
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
  $('next-button').disabled = !inReview() && !s.completed;
  $('next-button').innerHTML = inReview() ? `<span>${state.current === missions.length - 1 ? 'Revisar el cuaderno de prueba' : 'Revisar la siguiente misión'}</span>${icon('arrow')}` : s.completed ? `<span>${state.current === missions.length - 1 ? 'Preparar mi cuaderno para entregar' : 'Siguiente misión'}</span>${icon('arrow')}` : `<span>Completa las dos pruebas y la idea</span>${icon('lock')}`;
}
function renderMission({focus = false} = {}) {
  const m = mission(), s = session();
  $('admin-banner').hidden = !inReview();
  $('admin-account-label').textContent = inReview() ? `${reviewSession.login} · sesión de 30 minutos` : '';
  $('admin-lab-button').textContent = inReview() ? 'Panel de revisión docente' : 'Acceso docente';
  disposePool?.(); disposePool = null;
  document.title = `${m.shortTitle} · Pool Lab`;
  $('mission-number').textContent = `MISIÓN ${String(m.number).padStart(2,'0')} / 08`;
  $('mission-time').textContent = m.minutes;
  $('mission-title').innerHTML = esc(m.title) + '<span class="title-dot">.</span>';
  $('mission-narrative').textContent = m.narrative;
  $('mission-goal').textContent = m.goal;
  $('learning-context').innerHTML = learningContextHtml(m.learningContext);
  $('learning-context').hidden = !m.learningContext;
  $('reading-guide').innerHTML = readingGuideHtml(m.learningContext,m.codeMode==='challenge');
  $('reading-guide').hidden = !m.learningContext;
  $('read-program-title').textContent = m.codeMode==='challenge' ? 'Lee el encargo antes de programar' : 'Lee el programa con una guía';
  $('first-run-context').textContent = m.learningContext?.firstRun || m.trials[0].prompt;
  $('experiment-context').textContent = m.learningContext?.experiment || '';
  $('lab-orientation').open = m.number === 1 && !s.completed;
  $('concepts').innerHTML = m.concepts.map(c => `<div><strong>${esc(c.term)}</strong><p>${esc(c.text)}</p></div>`).join('');
  $('walkthrough').innerHTML = m.walkthrough.map(text => `<li><p>${esc(text)}</p></li>`).join('');
  $('code-filename').textContent = m.fileName;
  $('starter-code-panel').hidden = m.codeMode === 'challenge';
  $('mission-code').innerHTML = m.codeMode === 'challenge' ? '' : highlightPython(m.code);
  $('code-challenge').hidden = !m.challenge;
  $('code-challenge').innerHTML = m.challenge ? challengeHtml(m.challenge) : '';
  $('pool-lesson').hidden = !m.poolLesson;
  $('pool-deep-dive').hidden = !m.poolLesson;
  $('pool-deep-dive').open = false;
  $('pool-lesson').innerHTML = m.poolLesson ? poolLessonHtml(m.poolLesson) : '';
  $('pool-explainer').hidden = !m.poolLesson;
  if (m.poolLesson) disposePool = mountPoolExplainer($('pool-explainer'),{onComplete:run=>{state.sessions[m.id].simulationHistory.push(run); saveState(); toast('Exploración guardada en tu cuaderno como modelo didáctico.');}});
  else $('pool-explainer').replaceChildren();
  $('actual-code-input').value = s.actualCode;
  $('own-code-requirement').textContent = ['timer','final'].includes(m.id) ? 'necesario para entregar' : 'opcional';
  $('own-code-card').open = ['timer','final'].includes(m.id);
  renderPrediction();
  $('run-command').textContent = m.command;
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
  if (id === 'variant' && !inReview() && !hasInitialTrial(session())) {
    toast('Comprueba primero la salida de la prueba inicial. Después abriremos el experimento.');
    return;
  }
  session().activeTrial = id === 'variant' ? 'variant' : 'base';
  renderTrial(); saveState();
  if (focus) { $('check-station').scrollIntoView({behavior:'auto',block:'start'}); $('output-input').focus({preventScroll:true}); }
}
function maybeComplete() {
  if (inReview()) return;
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
  lines.push('MI PREDICCIÓN',s.predictionQuestion || m.predictionPrompt,s.prediction || '(Pendiente.)','','MI RAZONAMIENTO',m.reflection.question,`He elegido: ${s.reflectionChoice === null ? '(Sin responder.)' : m.reflection.options[s.reflectionChoice]}`,`Mis observaciones o dudas: ${s.note || '(Sin anotaciones.)'}`,'','MI CÓDIGO');
  lines.push(s.actualCode || 'No he adjuntado el código que he ejecutado. Necesito incorporarlo para que puedas revisarlo.', '', 'Ayúdame a interpretar lo observado y dime qué cambio concreto puedo probar a continuación.');
  return lines.join('\n');
}
function openDialog(kind) {
  const dialog = $('app-dialog');
  if (inReview() && ['progress','reset'].includes(kind)) kind='admin';
  if (!dialog.open) lastDialogTrigger = document.activeElement;
  const m = mission(), s = session(), count = completedCount();
  let html = '';
  if (kind === 'notebook' || kind === 'finish') {
    html = notebookPanelHtml(state,missions,notebookReadiness(state,missions),{review:inReview()});
  } else if (kind === 'map') {
    const unlocked=unlockedIndex();
    html = `<h2 id="dialog-title">Las 8 misiones del laboratorio</h2><p class="modal-intro">${inReview()?'Estás en revisión docente: puedes abrir cualquiera de las ocho misiones.':'Este es el recorrido completo. Las misiones se abren en orden al completar las dos pruebas y la idea de la anterior.'}</p><div class="mission-overview">${missions.map((item,i)=>{
      const locked=i>unlocked,done=state.sessions[item.id].completed;
      return `<button class="overview-mission${i===state.current?' current':''}" data-jump="${i}" ${locked?'disabled':''}><span class="overview-number">${String(item.number).padStart(2,'0')}</span><span><strong>${esc(item.shortTitle)}</strong><small>${esc(item.category)}</small><em>${inReview()?'Disponible para revisar':done?'Superada':locked?`Se abre tras la misión ${i}`:'Disponible para empezar'}</em></span>${icon(locked?'lock':'arrow')}</button>`;
    }).join('')}</div><div class="modal-actions"><button class="button button-outline" data-action="close-dialog">Volver al laboratorio</button><button class="button button-dark" data-action="admin">${inReview()?'Panel de revisión docente':'Acceso docente'}</button></div>`;
  } else if (kind === 'admin') {
    const secureAdminOrigin=window.location.protocol==='https:';
    if (inReview()) {
      html = `<h2 id="dialog-title">Panel de revisión docente</h2><p class="modal-intro">Cuenta verificada: <strong>${esc(reviewSession.login)}</strong>. Elige cualquier misión sin completar las anteriores. Puedes probar los mensajes de error, abrir las pistas y revisar el cuaderno.</p><div class="progress-missions">${missions.map((m,i)=>`<button class="progress-mission" data-jump="${i}"><span>${String(m.number).padStart(2,'0')}</span><strong>${esc(m.shortTitle)}</strong>${icon('arrow')}</button>`).join('')}</div><div class="modal-tip"><strong>Sesión temporal de revisión</strong><p>Los intentos de esta sesión se descartan al salir o recargar. Tu cuaderno habitual se recupera al salir. La sesión termina a las ${esc(new Date(reviewSession.expiresAt).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}))}.</p></div><div class="modal-actions"><button class="button button-outline" data-action="notebook">Revisar cuaderno de prueba</button><button class="button button-outline" data-action="admin-restart">Vaciar pruebas de esta revisión</button><button class="button button-dark" data-action="admin-exit">Salir de administración</button></div><p class="field-help"><a href="https://github.com/AlfonsoDeUna/DAM_PROG_SERVICIOS_PROCESOS/tree/main/2627/20261023" target="_blank" rel="noopener noreferrer">Abrir los archivos del laboratorio en GitHub ↗</a></p>`;
    } else {
      html = `<h2 id="dialog-title">Acceso docente</h2>
        <p class="modal-intro">Verifica la cuenta <strong>${esc(ADMIN_ACCOUNT.login)}</strong> para abrir todas las misiones, probar los comprobadores y revisar el cuaderno. Tener GitHub abierto en otra pestaña no inicia esta sesión.</p>
        <section class="admin-setup-card" aria-labelledby="admin-setup-title">
          <h3 id="admin-setup-title">1. Prepara tu acceso, solo la primera vez</h3>
          <p>Necesitas un <strong>token personal de GitHub</strong>: una clave que identifica tu cuenta. Crea uno específico para este laboratorio y sin permisos adicionales.</p>
          <a class="button button-outline button-small" href="https://github.com/settings/personal-access-tokens/new?name=Pool%20Lab%20revision&target_name=AlfonsoDeUna&expires_in=30" target="_blank" rel="noopener noreferrer">Crear mi token en GitHub ↗</a>
          <details class="admin-instructions"><summary>Qué opciones elegir en GitHub</summary><ol>
            <li>Entra con <strong>${esc(ADMIN_ACCOUNT.login)}</strong>. En el formulario de <strong>Fine-grained tokens</strong>, pon el nombre <strong>Pool Lab · revisión</strong>, una caducidad breve y tu cuenta como <strong>Resource owner</strong>.</li>
            <li>En <strong>Repository access</strong>, selecciona <strong>Public repositories (read-only)</strong>. Deja vacíos los permisos adicionales: esta verificación no los necesita.</li>
            <li>Genera el token y cópialo completo. GitHub solo muestra ese valor al crearlo. Consérvalo de forma privada para volver a utilizarlo; no lo incluyas en el repositorio ni en el cuaderno.</li>
            <li>Vuelve a esta ventana, pégalo debajo y pulsa <strong>Verificar cuenta y entrar</strong>.</li>
          </ol><p><a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank" rel="noopener noreferrer">Ayuda de GitHub sobre tokens ↗</a></p></details>
        </section>
        <form id="admin-access-form" class="admin-access-form">
          <h3>2. Verifica tu cuenta y entra</h3>
          <label for="admin-token">Token personal de GitHub</label>
          <input type="password" id="admin-token" name="admin-token" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="2000" required ${secureAdminOrigin?'':'disabled'} placeholder="github_pat_… o ghp_…" aria-describedby="admin-token-help admin-access-status">
          <p id="admin-token-help">Admite tokens fine-grained (<code>github_pat_</code>) y clásicos (<code>ghp_</code>). Pega el token completo, no tu contraseña de GitHub. Se envía únicamente a GitHub y se borra del campo al comprobarlo.</p>
          <button type="submit" class="button button-dark" ${secureAdminOrigin?'':'disabled'}>Verificar cuenta y entrar</button>
          <p id="admin-access-status" class="admin-access-status" role="status" aria-live="polite" aria-atomic="true" ${secureAdminOrigin?'':'data-state="error"'}>${secureAdminOrigin?'':'La verificación docente solo está disponible en la versión HTTPS publicada.'}</p>
          ${secureAdminOrigin?'':'<a href="https://alfonsodeuna.github.io/DAM_PROG_SERVICIOS_PROCESOS/2627/20261023/" target="_blank" rel="noopener noreferrer">Abrir el laboratorio publicado con HTTPS ↗</a>'}
        </form>
        <details class="dialog-section admin-instructions"><summary>Sesión y alcance del acceso</summary><p>La sesión dura 30 minutos y termina al salir o recargar. No se guarda el token. Las pruebas docentes son temporales y tu cuaderno habitual se recupera al salir.</p><p>GitHub verifica tu identidad para activar la vista docente. Las lecciones y su código son públicos: este modo no convierte GitHub Pages en un área privada ni impide modificar una copia local. No concede permisos para editar el repositorio.</p></details>`;
    }
  } else if (kind === 'setup') {
    html = `<h2 id="dialog-title">Prepara el archivo y la terminal</h2><p class="modal-intro">Trabajarás con Python 3 y un editor como VS Code. La web te guía; el archivo se ejecuta en tu ordenador.</p><div class="modal-steps"><div class="modal-step"><b>1</b><h3>Comprueba Python</h3><p>En una terminal, escribe <code>python --version</code>. Debe aparecer Python 3. Según la instalación, puedes usar <code>py --version</code> en Windows o <code>python3 --version</code>. Si ninguno se reconoce, pide ayuda al profesor para preparar Python.</p></div><div class="modal-step"><b>2</b><h3>Crea tu carpeta y tu archivo</h3><p>En VS Code, usa <strong>Archivo → Abrir carpeta</strong> y elige una carpeta para el laboratorio. Dentro, crea un archivo llamado <code>${esc(m.fileName)}</code>. Conserva la extensión <code>.py</code>.</p></div><div class="modal-step"><b>3</b><h3>Prepara y guarda el código</h3><p>${m.codeMode==='challenge'?'Escribe tu programa siguiendo los requisitos del encargo. Esta misión no proporciona una solución para copiar.':'Escribe o copia el código de partida en ese archivo; conserva los espacios al comienzo de cada línea.'} Guarda con Ctrl+S, o Cmd+S en Mac. Lee la guía y guarda tu predicción antes de ejecutar.</p></div><div class="modal-step"><b>4</b><h3>Abre una terminal en esa carpeta</h3><p>Usa <strong>Terminal → Nueva terminal</strong>. La carpeta que muestra la terminal debe contener <code>${esc(m.fileName)}</code>. Si ves <code>&gt;&gt;&gt;</code>, estás dentro de Python: escribe <code>exit()</code> para volver a la terminal.</p></div><div class="modal-step"><b>5</b><h3>Ejecuta el archivo completo</h3><p>Escribe <code>${esc(m.command)}</code> y pulsa Intro. Si en el primer paso funcionó <code>py</code> o <code>python3</code>, úsalo en lugar de <code>python</code>. Espera a que termine el programa.</p></div><div class="modal-step"><b>6</b><h3>Copia lo que ha mostrado Python</h3><p>La <strong>salida</strong> es el texto que aparece debajo del comando. Pégalo en «Prueba inicial» y compruébalo. Si aparece un error, también puedes pegar su mensaje. Cuando la primera salida coincida, se abrirá el experimento.</p></div></div><div class="modal-tip"><strong>Tres cosas diferentes:</strong> el código se escribe en el archivo .py; el comando se escribe en la terminal para ejecutarlo; la salida es lo que imprime el programa y pegas en la web.</div><div class="modal-actions"><button class="button button-dark" data-action="close-dialog">Volver a la misión ${icon('arrow')}</button></div>`;
  } else if (kind === 'how') {
    html = `<h2 id="dialog-title">Así se completa una misión</h2><p class="modal-intro">Empieza por entender el ejemplo. Después podrás comprobarlo y hacer tu propio experimento.</p><div class="modal-steps"><div class="modal-step"><b>1</b><h3>Lee y sitúate</h3><p>El bloque «¿Qué vamos a hacer y para qué?» explica los datos, el trabajo y la salida. La guía de lectura te ayuda a encontrar cada parte del programa.</p></div><div class="modal-step"><b>2</b><h3>Predice la primera ejecución</h3><p>Prepara el archivo y escribe qué crees que mostrará y por qué. Guarda tu predicción antes de ejecutar. No hace falta acertar: la compararás con lo observado.</p></div><div class="modal-step"><b>3</b><h3>Ejecuta y comprueba</h3><p>Guarda el archivo, ejecútalo en tu terminal y pega su salida en «Prueba inicial». Si algo falla, lee la explicación, revisa tu programa y vuelve a probar.</p></div><div class="modal-step"><b>4</b><h3>Cambia una cosa y compara</h3><p>Después de comprobar la primera salida se abre el experimento. Localiza el cambio indicado, piensa qué debería ocurrir y guarda y ejecuta otra vez. Pega la nueva salida en «Experimento».</p></div><div class="modal-step"><b>5</b><h3>Explica y guarda tu evidencia</h3><p>Responde «Comprobar mi idea» y anota tu descubrimiento con una línea, un valor o una medida de tu ejecución. Los errores y las correcciones también forman parte del cuaderno.</p></div><div class="modal-step"><b>6</b><h3>Prepara la entrega</h3><p>En «Mi cuaderno», completa la síntesis y revisa lo pendiente. En las misiones 3 y 8 debes aportar tu código; en la 4, 5 y 6, tus observaciones. Prepara el PDF, guárdalo y ábrelo antes de subirlo a la tarea.</p></div></div><div class="modal-tip">Dos salidas comprobadas y una idea correcta desbloquean una misión. Los errores y las pistas no restan puntos. Los XP muestran recorrido; tu profesor valorará la comprensión y las evidencias.</div><div class="modal-actions"><button class="button button-outline" data-action="setup">Cómo preparar mi equipo</button><button class="button button-dark" data-action="close-dialog">Volver al laboratorio ${icon('arrow')}</button></div>`;
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
function openAdminDialog() {
  if ($('sidebar').classList.contains('open')) {
    closeMap();
    $('map-toggle').focus();
    if ($('app-dialog').open) lastDialogTrigger=$('map-toggle');
  }
  openDialog('admin');
}

$('mission-map').addEventListener('click', (e) => { const b = e.target.closest('[data-mission]'); if (b) selectMission(Number(b.dataset.mission)); });
$('map-toggle').addEventListener('click', () => { const open = !$('sidebar').classList.contains('open'); $('sidebar').classList.toggle('open',open); $('map-scrim').hidden = !open; $('map-toggle').setAttribute('aria-expanded',open); });
$('map-scrim').addEventListener('click',closeMap);
$('pool-continue').addEventListener('click',()=>{ $('pool-deep-dive').open=false; $('first-run-title').tabIndex=-1; $('first-run-title').focus({preventScroll:true}); $('first-run-title').scrollIntoView({behavior:'smooth',block:'start'}); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMap(); });
for (const id of ['base','variant']) $(`trial-${id}`).addEventListener('click',() => selectTrial(id));
document.querySelector('.trial-tabs').addEventListener('keydown',e => {
  if (['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) { e.preventDefault(); const id = e.key === 'Home' ? 'base' : e.key === 'End' ? 'variant' : session().activeTrial === 'base' ? 'variant' : 'base'; if (!$(`trial-${id}`).disabled) { selectTrial(id); $(`trial-${id}`).focus(); } }
});
$('output-input').addEventListener('input', () => {
  const s = session(); s.outputs[s.activeTrial] = $('output-input').value; delete s.verdicts[s.activeTrial];
  showFeedback($('output-feedback'),null); $('measurements').hidden = true;
  $(`status-${s.activeTrial}`).classList.remove('passed'); $(`status-${s.activeTrial}`).textContent = s.activeTrial === 'base' ? '1' : '2'; saveSoon();
});
$('check-button').addEventListener('click', () => {
  const s = session(), t = mission().trials.find(t => t.id === s.activeTrial);
  if (!inReview() && !s.predictionSavedAt) { showFeedback($('output-feedback'),{ok:false,info:true,title:'Guarda primero tu predicción',message:'Tras leer el contexto y la guía del programa, escribe qué crees que ocurrirá en «Prepara la prueba inicial» y pulsa «Guardar mi predicción». No necesitas acertar para continuar.'}); $('prediction-input').focus(); return; }
  const output=$('output-input').value;
  recordOutput(s,t.id,output,checkOutput(t.check,output));
  maybeComplete(); renderTrial(); renderCompletion(); renderMap(); saveState();
});
$('output-feedback').addEventListener('click',e => { if (e.target.closest('[data-action="experiment"]')) { selectTrial('variant'); $('experiment-card').scrollIntoView({behavior:'auto',block:'start'}); } });
$('check-initial-button').addEventListener('click',()=>selectTrial('base',true));
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
$('next-button').addEventListener('click',() => { if (!inReview() && !session().completed) return; if (state.current === missions.length-1) openDialog('finish'); else selectMission(state.current+1); });
for (const [id,kind] of [['how-button','how'],['setup-button','setup'],['progress-button','progress'],['mentor-button','mentor'],['mission-mentor-button','mentor'],['resources-button','resources'],['notebook-button','notebook'],['sidebar-notebook','notebook'],['all-missions-button','map']]) $(id).addEventListener('click',() => openDialog(kind));
$('close-dialog').addEventListener('click',closeDialog);
$('app-dialog').addEventListener('close',() => { pendingImport = null; const token=$('admin-token'); if(token) token.value=''; if (lastDialogTrigger?.isConnected) lastDialogTrigger.focus(); });
$('app-dialog').addEventListener('click',e => {
  const target = e.target.closest('[data-action],[data-jump]');
  if (!target) return;
  if (target.dataset.jump != null) { closeDialog(); selectMission(Number(target.dataset.jump)); return; }
  const action = target.dataset.action;
  if (inReview() && ['choose-import','confirm-import','cancel-import','reset-dialog','confirm-reset','export-progress'].includes(action)) return;
  if (action === 'admin-exit') { exitReview(); return; }
  if (action === 'admin-restart' && inReview()) { const current=state.current; state=freshState(); state.current=current; state.profile={name:'REVISIÓN DOCENTE · muestra',group:reviewSession.login}; closeDialog(); renderMission({focus:true}); saveState(); toast('Pruebas temporales vaciadas. Puedes revisar de nuevo.'); return; }
  if (action === 'close-dialog') closeDialog();
  if (action === 'admin') openAdminDialog();
  if (action === 'copy-report') copyText($('mentor-report').value,'Informe copiado. Vuelve a esta conversación y pégalo para revisarlo juntos.');
  if (action === 'download-report') downloadText(`pool-lab-mision-${mission().number}.txt`,buildReport());
  if (action === 'export-progress') exportProgress();
  if (action === 'choose-import') $('import-file').click();
  if (action === 'reset-dialog') openDialog('reset');
  if (action === 'progress') openDialog('progress');
  if (action === 'setup') openDialog('setup');
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
  if (inReview() || e.target.id !== 'import-file' || !e.target.files[0]) return;
  const file = e.target.files[0], input=e.target, importState=state;
  const importStillCurrent=()=>!inReview() && state===importState && input.isConnected && $('app-dialog').open && $('app-dialog').dataset.kind==='progress';
  try {
    if (file.size > 20_000_000) throw new Error('La copia es demasiado grande. Elige un archivo exportado desde Pool Lab.');
    const contents=await file.text();
    if (!importStillCurrent()) return;
    pendingImport = normaliseState(JSON.parse(contents));
    const count = missions.filter(m => pendingImport.sessions[m.id].completed).length;
    $('import-result').innerHTML = `<div class="modal-tip"><strong>Copia de ${esc(pendingImport.profile.name || "alumno sin identificar")}: ${count}/8 misiones superadas.</strong><p>Al recuperarla se reemplaza el progreso actual de este navegador.</p><div class="modal-actions"><button class="button button-outline" data-action="cancel-import">Cancelar</button><button class="button button-dark" data-action="confirm-import">Recuperar esta copia</button></div></div>`;
  } catch(error) {
    if (!importStillCurrent()) return;
    pendingImport = null;
    $('import-result').innerHTML = `<div class="feedback error"><strong>No se ha cambiado tu progreso</strong><p>${esc(error instanceof SyntaxError ? 'El archivo no contiene un JSON válido de Pool Lab.' : error.message)}</p></div>`;
  }
});
$('welcome-form').addEventListener('submit',e=>{
  e.preventDefault();
  if (inReview()) return;
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
$('profile-button').addEventListener('click',()=>inReview()?openDialog('admin'):showCover());
$('prediction-input').addEventListener('input',()=>{ if(!session().predictionSavedAt) {session().prediction=$('prediction-input').value;session().predictionQuestion ||= mission().predictionPrompt;saveSoon();} });
$('prediction-button').addEventListener('click',()=>{
  const s=session();
  if(!s.prediction.trim()) { toast('Escribe una frase: qué crees que pasará y por qué.'); $('prediction-input').focus(); return; }
  s.predictionQuestion ||= mission().predictionPrompt;
  s.predictionSavedAt=new Date().toISOString();
  s.predictionTiming=s.outputHistory.length || s.attempts ? 'after' : 'before';
  renderPrediction(); renderTrial(); maybeComplete(); renderCompletion(); renderMap(); saveState();
  toast('Predicción guardada. Ahora ejecútalo y busca una evidencia.');
});
$('actual-code-input').addEventListener('input',()=>{session().actualCode=$('actual-code-input').value; saveSoon();});
for (const id of ['admin-cover-button','admin-lab-button','admin-panel-button','admin-sidebar-button']) $(id).addEventListener('click',openAdminDialog);
$('admin-exit-button').addEventListener('click',()=>exitReview());
$('app-dialog').addEventListener('submit',e=>{ if (e.target.id==='admin-access-form') { e.preventDefault(); submitAdminAccess(e.target); } });
window.addEventListener('focus',checkReviewExpiry);
window.addEventListener('pageshow',checkReviewExpiry);
document.addEventListener('visibilitychange',()=>{if (!document.hidden) checkReviewExpiry();});
window.addEventListener('pagehide',saveState);
renderMission();
saveState();
showCover();
