// Cuaderno de evidencias: funciones puras, sin red, DOM ni dependencias.
// Solo exportamos el código que aporta el alumno; nunca sustituimos su trabajo
// por los programas de partida de las misiones.

export const NOTEBOOK_FINAL_PROMPTS = [
  {key:'explanation',title:'Explico cómo funciona Pool',prompt:'Explica con tus palabras qué recibe Pool.map, qué es una tarea, qué hace cada trabajador y cómo se reúnen los resultados.'},
  {key:'evidence',title:'Lo demuestro con mis pruebas',prompt:'Cita una salida o un PID concreto y dos tiempos de tus pruebas. ¿Qué conclusión permiten sacar esos datos?'},
  {key:'limits',title:'Reviso mis ideas y reconozco los límites',prompt:'Describe un error que hayas corregido o una predicción que hayas revisado. Explica también por qué más trabajadores no garantizan menos tiempo.'},
  {key:'transfer',title:'Lo aplico a otro problema',prompt:'Propón un problema que repartirías con Pool: indica la entrada, el trabajo de una llamada y su resultado. Añade otro caso en el que no te compensaría y justifica por qué.'}
];

const text = value => value == null ? '' : typeof value === 'string' ? value : String(value);
const hasText = value => typeof value === 'string' && value.trim().length > 0;
const esc = value => text(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const array = value => Array.isArray(value) ? value : [];
const count = value => Number.isFinite(Number(value)) ? Math.max(0, Math.trunc(Number(value))) : 0;
const sessionFor = (state, mission) => state?.sessions?.[mission.id] || {};
const numberFor = (mission, index) => Number.isInteger(mission.number) ? mission.number : index + 1;
const missionName = (mission, index) => `Misión ${numberFor(mission, index)} · ${mission.shortTitle || mission.title || 'Sin título'}`;
const namedChoice = (mission, choice) => Number.isInteger(choice) && typeof mission.reflection?.options?.[choice] === 'string' ? `${String.fromCharCode(65 + choice)}. ${mission.reflection.options[choice]}` : 'Sin respuesta registrada';
const hintsUsed = (mission, session) => Math.min(count(session.hints), array(mission.hints).length);
const predictionLabel = session => session.predictionTiming === 'after' ? 'Reflexión añadida después' : session.predictionTiming === 'before' ? 'Predicción previa' : 'Predicción registrada';

function dateValue(value) {
  if (!hasText(value)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
function formatDate(value) {
  const date = dateValue(value);
  return date ? new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', dateStyle: 'medium', timeStyle: 'short' }).format(date) : 'No registrada';
}
function filenameDate(state) {
  const date = dateValue(state?.updatedAt) || dateValue(state?.profile?.startedAt);
  if (!date) return 'sin-fecha';
  const parts = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const get = type => parts.find(part => part.type === type)?.value || '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function notebookFilename(state, _missions, extension = 'html') {
  const name = text(state?.profile?.name).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'alumno';
  const suffix = ['html', 'txt', 'pdf', 'json'].includes(extension) ? extension : 'html';
  return `Pool-Lab_Cuaderno_${name}_${filenameDate(state)}.${suffix}`;
}

export function notebookReadiness(state, missions = []) {
  const missing = [];
  const list = array(missions);
  if (!hasText(state?.profile?.name)) missing.push('Escribir el nombre y apellidos.');
  if (!list.length) missing.push('Cargar el recorrido de misiones.');
  list.forEach((mission, index) => {
    const s = sessionFor(state, mission);
    const label = missionName(mission, index);
    if (!s.completed) missing.push(`${label}: completar la misión.`);
    if (!hasText(s.prediction)) missing.push(`${label}: registrar una predicción.`);
    const trials = array(mission.trials);
    if (trials.some(trial => !hasText(s.outputs?.[trial.id]) || s.verdicts?.[trial.id]?.ok !== true)) missing.push(`${label}: comprobar las dos salidas actuales.`);
    if (!s.reflectionChecked || s.reflectionChoice !== mission.reflection?.correct) missing.push(`${label}: revisar la pregunta de la idea.`);
    if (['pool', 'pids', 'benchmark'].includes(mission.id) && !hasText(s.note)) missing.push(`${label}: explicar por escrito lo observado.`);
    if (['timer', 'final'].includes(mission.id) && !hasText(s.actualCode)) missing.push(`${label}: añadir el código que has escrito y ejecutado.`);
  });
  for (const item of NOTEBOOK_FINAL_PROMPTS) {
    if (!hasText(state?.finalReflection?.[item.key])) missing.push(`Síntesis final: ${item.title.toLowerCase()}.`);
  }
  const completed = list.filter(mission => sessionFor(state, mission).completed).length;
  const xp = list.reduce((total, mission) => total + (sessionFor(state, mission).completed ? count(mission.xp || 100) : 0), 0);
  return { ready: missing.length === 0, missing, completed, total: list.length, xp };
}

function currentIdea(mission, session) {
  if (!session.reflectionChecked) return { status: 'Pendiente de comprobar', feedback: 'La opción actual todavía no se ha comprobado.' };
  const ok = session.reflectionChoice === mission.reflection?.correct;
  const feedback = mission.reflection?.feedback?.[session.reflectionChoice];
  return {
    status: ok ? 'Idea comprendida' : 'Necesita revisión',
    feedback: typeof feedback === 'string' ? feedback : ok ? text(mission.reflection?.explanation) : 'Esta respuesta no coincide con la explicación de la misión. Consulta el historial de intentos y vuelve a revisar la idea.'
  };
}

function outputStatus(verdict) {
  return !verdict ? 'Pendiente de comprobar' : verdict.ok === true ? 'La salida coincide' : 'Necesita revisión';
}

function historyLabel(mission, trialId) {
  return array(mission.trials).find(trial => trial.id === trialId)?.label || text(trialId) || 'Prueba sin identificar';
}

const simulationValue = value => value == null ? 'No registrado' : typeof value === 'object' ? JSON.stringify(value) : text(value);
function simulationLines(session) {
  return array(session.simulationHistory).flatMap((simulation, index) => [
    `Simulación ${index + 1} · ${formatDate(simulation.at)}`,
    `Trabajadores: ${simulationValue(simulation.workers)}. Tareas: ${simulationValue(simulation.tasks)}.`,
    `Pasos del modelo: ${simulationValue(simulation.steps)}.`,
    `Orden de finalización: ${simulationValue(simulation.completionOrder)}.`,
    `Resultados en el orden de entrada: ${simulationValue(simulation.results)}.`,
    ''
  ]);
}

function summaryRows(state, missions) {
  return missions.map((mission, index) => {
    const s = sessionFor(state, mission);
    const outputChecks = array(s.outputHistory).length;
    const ideaChecks = array(s.ideaHistory).length;
    return {
      name: missionName(mission, index),
      completed: s.completed ? 'Superada' : 'En curso',
      outputChecks,
      ideaChecks,
      hints: hintsUsed(mission, s),
      errors: array(s.outputHistory).filter(item => item?.ok === false).length + array(s.ideaHistory).filter(item => item?.ok === false).length
    };
  });
}

export function buildNotebookText(state, missions = []) {
  const list = array(missions);
  const ready = notebookReadiness(state, list);
  const profile = state?.profile || {};
  const lines = [
    'POOL LAB · CUADERNO DE APRENDIZAJE',
    ready.ready ? 'CUADERNO PREPARADO PARA REVISIÓN DOCENTE' : 'BORRADOR · FALTAN EVIDENCIAS',
    '',
    `Alumno/a: ${hasText(profile.name) ? profile.name.trim() : 'Sin nombre'}`,
    `Grupo: ${hasText(profile.group) ? profile.group.trim() : 'No indicado'}`,
    `Inicio del recorrido: ${formatDate(profile.startedAt)}`,
    `Último guardado registrado: ${formatDate(state?.updatedAt)}`,
    'Horario: Europe/Madrid.',
    '',
    `Misiones superadas: ${ready.completed}/${ready.total}. Experiencia: ${ready.xp} XP.`,
    'Los XP registran el avance en el juego; no son una calificación.',
    'El cuaderno reúne las evidencias aportadas por el alumno y las comprobaciones automáticas del laboratorio. La valoración corresponde al docente.',
    '',
    'RESUMEN DEL RECORRIDO',
    ...summaryRows(state, list).map(row => `${row.name}: ${row.completed}. Comprobaciones de salida: ${row.outputChecks}; de idea: ${row.ideaChecks}; errores registrados: ${row.errors}; pistas abiertas: ${row.hints}.`),
    ''
  ];
  if (!ready.ready) lines.push('EVIDENCIAS PENDIENTES', ...ready.missing.map(item => `- ${item}`), '');
  for (const [index, mission] of list.entries()) {
    const s = sessionFor(state, mission);
    const idea = currentIdea(mission, s);
    lines.push(missionName(mission, index).toUpperCase(), `Objetivo: ${text(mission.goal)}`, `Estado del recorrido: ${s.completed ? 'Superada' : 'En curso'}`, `Finalización registrada: ${formatDate(s.completedAt)}`, '', predictionLabel(s).toUpperCase(), `Momento de registro: ${formatDate(s.predictionSavedAt)}`, text(mission.predictionPrompt), hasText(s.prediction) ? s.prediction : '(Sin predicción registrada.)', '');
    for (const trial of array(mission.trials)) {
      const verdict = s.verdicts?.[trial.id];
      lines.push(text(trial.label).toUpperCase(), text(trial.prompt));
      if (trial.change) lines.push(`Cambio pedido: ${trial.change}`);
      lines.push('Salida actual aportada:', hasText(s.outputs?.[trial.id]) ? s.outputs[trial.id] : '(Sin salida aportada.)', `Comprobación actual: ${outputStatus(verdict)}.`);
      if (verdict?.message) lines.push(text(verdict.message));
      lines.push('');
    }
    lines.push('HISTORIAL DE COMPROBACIONES DE SALIDA');
    const outputs = array(s.outputHistory);
    if (!outputs.length) lines.push(count(s.attempts) ? `Constan ${count(s.attempts)} comprobaciones anteriores sin historial detallado en esta copia.` : '(Todavía no hay intentos registrados.)');
    outputs.forEach((attempt, attemptIndex) => {
      lines.push(`Intento ${attemptIndex + 1} · ${historyLabel(mission, attempt.trial)} · ${formatDate(attempt.at)}`, `Resultado: ${attempt.ok === true ? 'Correcto' : 'Necesita revisión'}.`, text(attempt.title), text(attempt.message), 'Salida comprobada:', hasText(attempt.output) ? attempt.output : '(Salida vacía.)', '');
    });
    lines.push('QUE SE ME QUEDE LA IDEA', text(mission.reflection?.question), `Respuesta actual: ${namedChoice(mission, s.reflectionChoice)}`, `Estado: ${idea.status}.`, idea.feedback, '', 'HISTORIAL DE RESPUESTAS A LA IDEA');
    const ideas = array(s.ideaHistory);
    if (!ideas.length) lines.push('(No hay intentos de la idea registrados en esta copia.)');
    ideas.forEach((attempt, attemptIndex) => {
      lines.push(`Intento ${attemptIndex + 1} · ${formatDate(attempt.at)}`, `Elegí: ${namedChoice(mission, attempt.choice)}`, `Resultado: ${attempt.ok === true ? 'Correcto' : 'Necesita revisión'}.`, `Explicación: ${text(attempt.feedback) || 'Sin explicación guardada.'}`, '');
    });
    lines.push('MIS OBSERVACIONES Y CORRECCIONES', text(mission.evidencePrompt), hasText(s.note) ? s.note : '(Sin anotaciones aportadas.)', '');
    if (array(s.simulationHistory).length) lines.push('MODELO DIDÁCTICO (chunksize=1)', 'Estas simulaciones usan pasos y tiempos ficticios para comprender el reparto. No son medidas ni ejecuciones reales de Python.', ...simulationLines(s));
    lines.push('MI CÓDIGO APORTADO', hasText(s.actualCode) ? s.actualCode : '(No he adjuntado el código que ejecuté. El programa de partida no se considera una evidencia de mi código.)', '', `PISTAS CONSULTADAS: ${hintsUsed(mission, s)}/${array(mission.hints).length}`);
    array(mission.hints).slice(0, hintsUsed(mission, s)).forEach((hint, i) => lines.push(`${i + 1}. ${hint}`));
    lines.push('', 'IDEA CLAVE DE LA MISIÓN', text(mission.takeaway), '', '');
  }
  lines.push('SÍNTESIS FINAL · LO QUE HE APRENDIDO');
  for (const item of NOTEBOOK_FINAL_PROMPTS) lines.push('', item.title.toUpperCase(), item.prompt, hasText(state?.finalReflection?.[item.key]) ? state.finalReflection[item.key] : '(Sin respuesta aportada.)');
  lines.push('', 'ENTREGA', 'Revisa el nombre, las salidas, tu código y la síntesis. Entrega este cuaderno en la tarea que indique tu docente. Conserva también la copia JSON del progreso para seguir trabajando.', '', 'Pool Lab · Python multiprocessing.Pool · Versión del cuaderno 2');
  return lines.join('\n');
}

const styles = `
:root{color-scheme:light;--ink:#1d2c29;--muted:#5e6d66;--line:#d9e1d9;--paper:#fff;--pale:#f2f6ec;--green:#355b39;--lavender:#eee9f6;--warning:#85541a}
*{box-sizing:border-box}html{background:#e8ece6}body{margin:0;color:var(--ink);font:15px/1.65 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.document{max-width:1000px;margin:32px auto;background:var(--paper);padding:52px 62px;box-shadow:0 8px 40px #25372b15}.toolbar{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 24px;background:#1d2c29;color:#fff}.toolbar p{margin:0;font-size:13px;max-width:710px}.toolbar button{font:inherit;font-weight:700;color:#1d2c29;background:#d7ed8d;border:0;border-radius:8px;padding:11px 17px;cursor:pointer;white-space:nowrap}.toolbar button:focus-visible{outline:3px solid #fff;outline-offset:3px}
h1,h2,h3,h4{line-height:1.2;margin:0 0 14px}h1{font-size:42px;letter-spacing:-1.8px;max-width:700px}h2{font-size:27px;letter-spacing:-.7px}h3{font-size:18px;margin-top:25px}h4{font-size:15px;margin-top:20px}p{margin:9px 0 14px}a{color:var(--green);text-underline-offset:3px}.eyebrow{text-transform:uppercase;letter-spacing:.17em;font:700 11px/1.7 ui-monospace,SFMono-Regular,Consolas,monospace;color:var(--muted);margin-bottom:17px}.subtitle{font-size:17px;color:var(--muted);max-width:680px}.status{display:inline-block;margin:8px 0 19px;padding:6px 10px;border:1px solid #bdcfb1;border-radius:4px;background:#eff6e8;color:var(--green);font-size:12px;font-weight:750}.status.draft{background:#fff6e6;border-color:#ead2a7;color:var(--warning)}.identity{display:grid;grid-template-columns:1fr 1fr;gap:0 24px;border-top:2px solid var(--ink);border-bottom:1px solid var(--line);padding:18px 0;margin:18px 0}.identity div{padding:6px 0;overflow-wrap:anywhere}.identity dt{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:700}.identity dd{margin:3px 0;font-size:15px}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:24px 0}.stat{padding:18px;background:var(--pale);border:1px solid var(--line);border-radius:8px}.stat strong{display:block;font-size:26px;line-height:1.2}.stat span{font-size:12px;color:var(--muted)}.small,.fine{font-size:12px;color:var(--muted)}.fine{margin-top:20px}.notice{background:#f8f8f3;border-left:3px solid #a9bb89;padding:13px 17px;font-size:13px}.pending{border:1px solid #ead2a7;background:#fffaf0;border-radius:8px;padding:18px 22px;margin:24px 0}.pending h3{margin-top:0}.pending ul{padding-left:20px;font-size:13px;margin-bottom:0}
table{width:100%;border-collapse:collapse;margin:18px 0 25px;font-size:12px;line-height:1.5}th{text-align:left;font-weight:750;background:var(--pale)}td,th{padding:9px 10px;border-bottom:1px solid var(--line);vertical-align:top}th:first-child,td:first-child{padding-left:6px}.num{text-align:center;width:10%}.mission{margin:54px 0 0;padding-top:26px;border-top:2px solid var(--ink)}.mission-meta{display:flex;flex-wrap:wrap;gap:10px 20px;color:var(--muted);font-size:12px;margin:7px 0 19px}.goal{font-size:15px;border-left:3px solid #8da865;padding-left:14px}.question{font-size:13px;color:var(--muted);margin-bottom:10px}.answer{white-space:pre-wrap;overflow-wrap:anywhere;background:var(--pale);border:1px solid var(--line);border-radius:7px;padding:15px 17px;margin:11px 0;font-size:14px}.answer.empty{color:var(--muted);font-style:italic;background:#fafbf8}.trial{margin:23px 0;padding-top:1px}.trial h3{margin-top:0}.trial+.trial{border-top:1px dashed var(--line);padding-top:20px}.label{font-size:12px;font-weight:700;color:var(--muted);margin:11px 0 5px}.code,pre{font:12px/1.65 ui-monospace,SFMono-Regular,Consolas,"Liberation Mono",monospace;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;tab-size:4;border:1px solid var(--line);border-radius:7px;padding:14px 16px;background:#f6f8f3;margin:8px 0 13px}.check{font-size:13px;padding:9px 12px;border-left:3px solid #91ad68;background:#f4f8ec}.check.wrong{border-color:#c38757;background:#fff7ed}.check.pending-check{border-color:#b3bdaf;background:#f5f6f2}.check p{margin:3px 0}.history{border:1px solid var(--line);border-radius:7px;padding:14px 16px;margin:11px 0}.history-title{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:12px;margin-bottom:7px}.history time{color:var(--muted)}.result{font-weight:700;color:var(--green)}.result.wrong{color:var(--warning)}.history p{font-size:13px;margin:6px 0}.history pre{margin-bottom:0;font-size:11px}.takeaway{background:var(--lavender);border-left:3px solid #ab98c4;padding:13px 16px;font-size:13px;margin-top:22px}.hints{font-size:13px;padding-left:22px}.hints li{margin:7px 0}.final{border-top:2px solid var(--ink);padding-top:28px;margin-top:54px}.final-item{margin-top:28px}.footer{border-top:1px solid var(--line);padding-top:18px;margin-top:40px;font-size:11px;color:var(--muted)}
@media(max-width:700px){.document{margin:0;padding:28px 20px;box-shadow:none}.toolbar{align-items:flex-start;flex-direction:column;padding:16px 20px}.toolbar button{width:100%}h1{font-size:34px}.identity{grid-template-columns:1fr}.stats{gap:8px}.stat{padding:13px 10px}.stat strong{font-size:22px}.stat span{font-size:11px}table{font-size:10px}td,th{padding:7px 4px}.mission{margin-top:38px}h2{font-size:24px}}
@page{size:A4;margin:17mm 16mm 18mm}@media print{html,body{background:white;font-size:10pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}.toolbar{display:none!important}.document{max-width:none;margin:0;padding:0;box-shadow:none}.cover{break-after:page}.mission,.final{break-before:page;margin-top:0;padding-top:0;border-top:0}h1{font-size:30pt}h2{font-size:21pt}h3{font-size:13pt}h4{font-size:11pt}h1,h2,h3,h4,.label{break-after:avoid}p{orphans:3;widows:3}.identity,.stats,.takeaway,.check,.history-title{break-inside:avoid}.answer,pre,.history{break-inside:auto}.code,pre{font-size:8pt;line-height:1.5}.history pre{font-size:7.5pt}.answer{font-size:10pt}.subtitle{font-size:12pt}.small,.fine,.mission-meta{font-size:8pt}.history-title,.history p,.question,.check,.notice,.takeaway,.hints{font-size:9pt}table{font-size:8pt}thead{display:table-header-group}tr{break-inside:avoid}.pending{padding:12px 15px}.pending ul{font-size:9pt}a{text-decoration:none;color:inherit}.footer{font-size:8pt}}
`;

function answerHtml(value, empty = 'Sin respuesta aportada.') {
  return `<div class="answer${hasText(value) ? '' : ' empty'}">${esc(hasText(value) ? value : empty)}</div>`;
}
function outputHtml(value, empty = 'Sin salida aportada.') {
  return hasText(value) ? `<pre>${esc(value)}</pre>` : `<p class="small">${esc(empty)}</p>`;
}
function verdictHtml(verdict) {
  const kind = !verdict ? ' pending-check' : verdict.ok === true ? '' : ' wrong';
  return `<div class="check${kind}"><strong>${esc(outputStatus(verdict))}</strong>${verdict?.message ? `<p>${esc(verdict.message)}</p>` : ''}</div>`;
}
function outputHistoryHtml(mission, session) {
  const history = array(session.outputHistory);
  if (!history.length) return `<p class="small">${count(session.attempts) ? `Constan ${count(session.attempts)} comprobaciones anteriores sin historial detallado en esta copia.` : 'Todavía no hay intentos registrados.'}</p>`;
  return history.map((attempt, index) => `<article class="history"><div class="history-title"><strong>Intento ${index + 1} · ${esc(historyLabel(mission, attempt.trial))}</strong><time>${esc(formatDate(attempt.at))}</time></div><p class="result${attempt.ok === true ? '' : ' wrong'}">${attempt.ok === true ? 'La salida coincide' : 'Necesita revisión'}${attempt.title ? ` · ${esc(attempt.title)}` : ''}</p>${attempt.message ? `<p>${esc(attempt.message)}</p>` : ''}<p class="label">Salida comprobada</p>${outputHtml(attempt.output, 'Se comprobó una salida vacía.')}</article>`).join('');
}
function ideaHistoryHtml(mission, session) {
  const history = array(session.ideaHistory);
  if (!history.length) return '<p class="small">No hay intentos de la idea registrados en esta copia.</p>';
  return history.map((attempt, index) => `<article class="history"><div class="history-title"><strong>Intento ${index + 1}</strong><time>${esc(formatDate(attempt.at))}</time></div><p><strong>Elegí:</strong> ${esc(namedChoice(mission, attempt.choice))}</p><p class="result${attempt.ok === true ? '' : ' wrong'}">${attempt.ok === true ? 'Idea comprendida' : 'Necesita revisión'}</p><p>${esc(attempt.feedback || 'Sin explicación guardada.')}</p></article>`).join('');
}
function missionHtml(state, mission, index) {
  const s = sessionFor(state, mission);
  const idea = currentIdea(mission, s);
  const used = hintsUsed(mission, s);
  return `<section class="mission" id="mision-${index + 1}">
    <div class="eyebrow">Evidencia ${String(numberFor(mission, index)).padStart(2, '0')} · ${esc(mission.category || 'Laboratorio')}</div>
    <h2>${esc(mission.shortTitle || mission.title)}</h2>
    <div class="mission-meta"><span>${s.completed ? 'Misión superada' : 'Misión en curso'}</span><span>Finalización: ${esc(formatDate(s.completedAt))}</span></div>
    <p class="goal"><strong>Objetivo.</strong> ${esc(mission.goal)}</p>
    <h3>${esc(predictionLabel(s))}</h3><p class="small">Momento de registro: ${esc(formatDate(s.predictionSavedAt))}</p>${mission.predictionPrompt ? `<p class="question">${esc(mission.predictionPrompt)}</p>` : ''}${answerHtml(s.prediction, 'Sin predicción registrada.')}
    ${array(mission.trials).map(trial => `<section class="trial"><h3>${esc(trial.label)}</h3><p class="question">${esc(trial.prompt)}</p>${trial.change ? `<p class="question"><strong>Cambio pedido:</strong> ${esc(trial.change)}</p>` : ''}<p class="label">Salida actual aportada</p>${outputHtml(s.outputs?.[trial.id])}${verdictHtml(s.verdicts?.[trial.id])}</section>`).join('')}
    <h3>Historial de comprobaciones de salida</h3><p class="question">Conservo los intentos para mostrar qué he probado, qué falló y cómo he avanzado.</p>${outputHistoryHtml(mission, s)}
    <h3>Que se me quede la idea</h3><p>${esc(mission.reflection?.question)}</p><p><strong>Respuesta actual:</strong> ${esc(namedChoice(mission, s.reflectionChoice))}</p><div class="check${!s.reflectionChecked ? ' pending-check' : s.reflectionChoice === mission.reflection?.correct ? '' : ' wrong'}"><strong>${esc(idea.status)}</strong><p>${esc(idea.feedback)}</p></div>
    <h4>Mis respuestas y sus correcciones</h4>${ideaHistoryHtml(mission, s)}
    <h3>Mis observaciones y correcciones</h3>${mission.evidencePrompt ? `<p class="question">${esc(mission.evidencePrompt)}</p>` : ''}${answerHtml(s.note, 'Sin anotaciones aportadas.')}
    ${array(s.simulationHistory).length ? `<h3>Modelo didáctico (chunksize=1)</h3><p class="notice">Estas simulaciones usan pasos y tiempos ficticios para comprender el reparto. No son medidas ni ejecuciones reales de Python.</p><pre>${esc(simulationLines(s).join('\n'))}</pre>` : ''}
    <h3>Mi código aportado</h3>${hasText(s.actualCode) ? `<p class="question">Archivo: ${esc(mission.fileName || 'Programa de esta misión')}. Esta es la versión de código que he adjuntado.</p><pre class="code">${esc(s.actualCode)}</pre>` : '<p class="notice">No he adjuntado el código que ejecuté. El programa de partida no se considera una evidencia de mi código.</p>'}
    <h3>Pistas consultadas · ${used}/${array(mission.hints).length}</h3>${used ? `<ol class="hints">${array(mission.hints).slice(0, used).map(hint => `<li>${esc(hint)}</li>`).join('')}</ol>` : '<p class="small">No he abierto pistas en esta misión.</p>'}
    <div class="takeaway"><strong>Idea clave de la misión.</strong> ${esc(mission.takeaway)}</div>
  </section>`;
}

/**
 * Genera bytes PDF en el navegador. PDFLib se inyecta desde una copia local de
 * pdf-lib; no se descarga ninguna fuente ni se envía información al servidor.
 * HTML/TXT conservan siempre el Unicode original. El PDF representa los signos
 * fuera de WinAnsi como [U+XXXX], evitando errores o caracteres desaparecidos.
 */
export async function buildNotebookPdf(state, missions = [], PDFLib) {
  if (!PDFLib?.PDFDocument || !PDFLib?.StandardFonts || !PDFLib?.rgb) throw new Error('No se ha cargado el generador PDF. Puedes descargar el cuaderno HTML y usar Imprimir / Guardar PDF.');
  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const list = array(missions), ready = notebookReadiness(state, list), profile = state?.profile || {};
  const learner = hasText(profile.name) ? profile.name.trim() : 'Sin nombre';
  pdf.setTitle(`Cuaderno Pool Lab - ${learner}`);
  pdf.setAuthor(learner);
  pdf.setSubject('Evidencias de aprendizaje de Python multiprocessing.Pool');
  pdf.setCreator('Pool Lab');
  const savedDate = dateValue(state?.updatedAt);
  if (savedDate) { pdf.setCreationDate(savedDate); pdf.setModificationDate(savedDate); }
  const W = 595.28, H = 841.89, margin = 48, width = W - margin * 2, bottom = 57;
  const ink = rgb(.11, .17, .15), muted = rgb(.35, .41, .37), green = rgb(.20, .36, .23), warning = rgb(.49, .30, .10), lineColor = rgb(.82, .87, .81);
  let page, y, pageNumber = 0, usedFallback = false;
  const replacements = new Map([['→', '->'], ['←', '<-'], ['↔', '<->'], ['⇒', '=>'], ['≥', '>='], ['≤', '<='], ['≠', '!='], ['−', '-'], ['–', '-'], ['—', '-'], ['‑', '-'], ['✓', '[OK]'], ['✔', '[OK]'], ['✗', '[X]'], ['✘', '[X]'], ['⚠', '[Aviso]'], [' ', ' ']]);
  function safe(value, font = regular) {
    let output = '';
    for (const character of text(value).replace(/\r\n?/g, '\n').replace(/\t/g, '    ')) {
      if (character === '\n') { output += character; continue; }
      const replacement = replacements.get(character);
      if (replacement != null) { output += replacement; continue; }
      try { font.encodeText(character); output += character; }
      catch { usedFallback = true; output += `[U+${character.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}]`; }
    }
    return output;
  }
  function wrap(value, font, size, maxWidth = width) {
    const output = [];
    for (const sourceLine of safe(value, font).split('\n')) {
      if (!sourceLine) { output.push(''); continue; }
      let current = '';
      for (const character of sourceLine) {
        if (current && font.widthOfTextAtSize(current + character, size) > maxWidth) {
          const split = current.lastIndexOf(' ');
          if (split > Math.floor(current.length / 2)) {
            output.push(current.slice(0, split));
            current = current.slice(split + 1) + character;
          } else { output.push(current); current = character; }
        } else current += character;
      }
      output.push(current);
    }
    return output;
  }
  function newPage() {
    page = pdf.addPage([W, H]); pageNumber++; y = H - 61;
    page.drawText('POOL LAB  /  CUADERNO DE APRENDIZAJE', { x: margin, y: H - 29, size: 7, font: bold, color: muted });
    page.drawLine({ start: { x: margin, y: H - 38 }, end: { x: W - margin, y: H - 38 }, thickness: .6, color: lineColor });
  }
  function ensure(height) { if (!page || y - height < bottom) newPage(); }
  function space(height = 8) { y -= height; }
  function paragraph(value, { font = regular, size = 9.5, color = ink, leading = size * 1.48, after = 7, indent = 0 } = {}) {
    const lines = wrap(value, font, size, width - indent);
    ensure(Math.min(lines.length, 2) * leading);
    for (const line of lines) {
      ensure(leading);
      if (line) page.drawText(line, { x: margin + indent, y, size, font, color });
      y -= leading;
    }
    y -= after;
  }
  function heading(title, level = 2, fresh = false) {
    if (fresh && page) newPage();
    const size = level === 1 ? 26 : level === 2 ? 18 : 11.5;
    ensure(size * 1.5 + 38);
    if (level > 2) space(5);
    paragraph(title, { font: bold, size, leading: size * 1.25, after: level < 3 ? 13 : 6, color: level > 2 ? green : ink });
  }
  function ownAnswer(title, value, prompt = '') {
    heading(title, 3);
    if (prompt) paragraph(prompt, { size: 8.7, color: muted });
    paragraph(hasText(value) ? value : 'Sin respuesta aportada.', { font: hasText(value) ? regular : italic });
  }
  function code(value, empty = 'Sin salida aportada.') {
    if (hasText(value)) paragraph(value, { font: mono, size: 7.9, leading: 11.3, after: 10, indent: 9 });
    else paragraph(empty, { font: italic, color: muted });
  }
  function feedback(value, ok) { paragraph(value, { size: 8.8, color: ok ? green : warning, after: 9 }); }

  newPage();
  heading('Mi cuaderno de aprendizaje', 1);
  paragraph('Python multiprocessing.Pool', { size: 14, color: muted, after: 16 });
  paragraph(ready.ready ? 'PREPARADO PARA REVISIÓN DOCENTE' : 'BORRADOR - FALTAN EVIDENCIAS', { font: bold, size: 10, color: ready.ready ? green : warning, after: 17 });
  paragraph(`Alumno/a: ${learner}\nGrupo: ${hasText(profile.group) ? profile.group.trim() : 'No indicado'}\nInicio: ${formatDate(profile.startedAt)}\nÚltimo guardado: ${formatDate(state?.updatedAt)}\nHorario: Europe/Madrid.`, { size: 10, after: 16 });
  paragraph(`Misiones superadas: ${ready.completed}/${ready.total}  |  Experiencia del juego: ${ready.xp} XP`, { font: bold, size: 11 });
  paragraph('Los XP registran el avance; no son una calificación. Este cuaderno reúne las evidencias aportadas por el alumno y las comprobaciones automáticas del laboratorio. La valoración corresponde al docente.', { size: 9, color: muted, after: 15 });
  heading('Mi recorrido', 3);
  for (const row of summaryRows(state, list)) paragraph(`${row.name} - ${row.completed}\nPruebas: ${row.outputChecks}; ideas: ${row.ideaChecks}; errores registrados: ${row.errors}; pistas: ${row.hints}.`, { size: 8.5, leading: 12, after: 6 });
  if (!ready.ready) {
    heading('Evidencias pendientes', 3);
    for (const item of ready.missing) paragraph(`- ${item}`, { size: 8.5, color: warning, after: 3 });
  }

  for (const [index, mission] of list.entries()) {
    const s = sessionFor(state, mission), idea = currentIdea(mission, s);
    heading(missionName(mission, index), 2, true);
    paragraph(`Estado: ${s.completed ? 'Superada' : 'En curso'}  |  Finalización: ${formatDate(s.completedAt)}`, { size: 8.5, color: muted });
    paragraph(`Objetivo: ${text(mission.goal)}`, { size: 10, after: 13 });
    ownAnswer(predictionLabel(s), s.prediction, mission.predictionPrompt);
    paragraph(`Momento de registro: ${formatDate(s.predictionSavedAt)}`, { size: 8, color: muted });
    for (const trial of array(mission.trials)) {
      heading(trial.label, 3); paragraph(trial.prompt, { size: 8.8, color: muted });
      if (trial.change) paragraph(`Cambio pedido: ${trial.change}`, { size: 8.5, color: muted });
      paragraph('Salida actual aportada:', { font: bold, size: 8.5, after: 5 });
      code(s.outputs?.[trial.id]);
      const verdict = s.verdicts?.[trial.id];
      feedback(`${outputStatus(verdict)}.${verdict?.message ? ` ${verdict.message}` : ''}`, verdict?.ok === true);
    }
    ensure(100); heading('Historial de comprobaciones de salida', 3);
    const outputs = array(s.outputHistory);
    if (!outputs.length) paragraph(count(s.attempts) ? `Constan ${count(s.attempts)} comprobaciones anteriores sin historial detallado en esta copia.` : 'Todavía no hay intentos registrados.', { font: italic, size: 8.5, color: muted });
    for (const [attemptIndex, attempt] of outputs.entries()) {
      ensure(65);
      paragraph(`Intento ${attemptIndex + 1} - ${historyLabel(mission, attempt.trial)} - ${formatDate(attempt.at)}`, { font: bold, size: 8.7, after: 5 });
      feedback(`${attempt.ok === true ? 'Correcto' : 'Necesita revisión'}: ${text(attempt.title)}. ${text(attempt.message)}`, attempt.ok === true);
      code(attempt.output, 'Se comprobó una salida vacía.');
    }
    heading('Que se me quede la idea', 3);
    paragraph(mission.reflection?.question);
    paragraph(`Respuesta actual: ${namedChoice(mission, s.reflectionChoice)}`);
    feedback(`${idea.status}. ${idea.feedback}`, s.reflectionChecked && s.reflectionChoice === mission.reflection?.correct);
    ensure(100); heading('Mis respuestas y sus correcciones', 3);
    const ideas = array(s.ideaHistory);
    if (!ideas.length) paragraph('No hay intentos de la idea registrados en esta copia.', { font: italic, size: 8.5, color: muted });
    for (const [attemptIndex, attempt] of ideas.entries()) {
      ensure(65);
      paragraph(`Intento ${attemptIndex + 1} - ${formatDate(attempt.at)}`, { font: bold, size: 8.7, after: 5 });
      paragraph(`Elegí: ${namedChoice(mission, attempt.choice)}`, { size: 9 });
      feedback(`${attempt.ok === true ? 'Idea comprendida' : 'Necesita revisión'}. ${text(attempt.feedback) || 'Sin explicación guardada.'}`, attempt.ok === true);
    }
    ownAnswer('Mis observaciones y correcciones', s.note, mission.evidencePrompt);
    if (array(s.simulationHistory).length) {
      heading('Modelo didáctico (chunksize=1)', 3);
      paragraph('Estas simulaciones usan pasos y tiempos ficticios para comprender el reparto. No son medidas ni ejecuciones reales de Python.', { size: 8.8, color: muted });
      code(simulationLines(s).join('\n'));
    }
    heading('Mi código aportado', 3);
    if (hasText(s.actualCode)) paragraph(`Archivo: ${text(mission.fileName)}. Esta es la versión de código que he adjuntado.`, { size: 8.5, color: muted });
    code(s.actualCode, 'No he adjuntado el código que ejecuté. El programa de partida no se considera una evidencia de mi código.');
    const used = hintsUsed(mission, s);
    heading(`Pistas consultadas - ${used}/${array(mission.hints).length}`, 3);
    if (!used) paragraph('No he abierto pistas en esta misión.', { size: 8.5, color: muted });
    array(mission.hints).slice(0, used).forEach((hint, i) => paragraph(`${i + 1}. ${hint}`, { size: 8.8 }));
    heading('Idea clave de la misión', 3); paragraph(mission.takeaway, { font: italic, size: 9 });
  }
  heading('Lo que he aprendido', 2, true);
  paragraph('Síntesis final del laboratorio', { size: 11, color: muted, after: 14 });
  for (const item of NOTEBOOK_FINAL_PROMPTS) ownAnswer(item.title, state?.finalReflection?.[item.key], item.prompt);
  heading('Mi entrega', 3);
  paragraph('Reviso el nombre, las salidas, mi código y la síntesis. Entrego este cuaderno en la tarea indicada por mi docente. Conservo también la copia JSON del progreso para seguir trabajando.');
  if (usedFallback) paragraph('Nota de representación: algunos caracteres fuera del alfabeto de esta fuente aparecen como [U+XXXX]. El cuaderno HTML y la copia JSON conservan el texto original.', { font: italic, size: 8, color: muted });
  const pages = pdf.getPages();
  for (const [index, target] of pages.entries()) {
    target.drawLine({ start: { x: margin, y: 39 }, end: { x: W - margin, y: 39 }, thickness: .5, color: lineColor });
    const label = `${index + 1} / ${pages.length}`;
    target.drawText(label, { x: W - margin - regular.widthOfTextAtSize(label, 8), y: 25, font: regular, size: 8, color: muted });
    const foot = wrap(`${learner} - Pool Lab`, regular, 7, width - 62)[0] || 'Pool Lab';
    target.drawText(foot, { x: margin, y: 25, font: regular, size: 7, color: muted });
  }
  return pdf.save();
}

export function buildNotebookHtml(state, missions = []) {
  const list = array(missions);
  const profile = state?.profile || {};
  const ready = notebookReadiness(state, list);
  const rows = summaryRows(state, list);
  const totalChecks = rows.reduce((total, row) => total + row.outputChecks + row.ideaChecks, 0);
  const name = hasText(profile.name) ? profile.name.trim() : 'Sin nombre';
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'"><title>Cuaderno Pool Lab · ${esc(name)}</title><style>${styles}</style></head>
<body><div class="toolbar"><p>Tu cuaderno está guardado en este archivo. Puedes leerlo sin conexión o usar «Imprimir / Guardar PDF» y elegir «Guardar como PDF» para entregarlo en Moodle.</p><button type="button" onclick="window.print()">Imprimir / Guardar PDF</button></div><main class="document">
<header class="cover"><div class="eyebrow">Pool Lab · Python · Programación de servicios y procesos</div><h1>Mi cuaderno de aprendizaje</h1><p class="subtitle">De una tarea a un equipo de procesos. Predicciones, pruebas, errores y conclusiones de mi recorrido con <code>multiprocessing.Pool</code>.</p><div class="status${ready.ready ? '' : ' draft'}">${ready.ready ? 'PREPARADO PARA REVISIÓN DOCENTE' : 'BORRADOR · FALTAN EVIDENCIAS'}</div>
<dl class="identity"><div><dt>Alumno/a</dt><dd>${esc(name)}</dd></div><div><dt>Grupo</dt><dd>${esc(hasText(profile.group) ? profile.group.trim() : 'No indicado')}</dd></div><div><dt>Inicio del recorrido</dt><dd>${esc(formatDate(profile.startedAt))}</dd></div><div><dt>Último guardado registrado</dt><dd>${esc(formatDate(state?.updatedAt))}</dd></div></dl><p class="fine">Fechas en horario de Madrid (Europe/Madrid).</p>
<div class="stats"><div class="stat"><strong>${ready.completed}/${ready.total}</strong><span>Misiones superadas</span></div><div class="stat"><strong>${ready.xp} XP</strong><span>Experiencia del juego</span></div><div class="stat"><strong>${totalChecks}</strong><span>Intentos detallados</span></div></div><p class="notice">Los XP registran el avance en el juego; no son una calificación. El cuaderno reúne las evidencias aportadas por el alumno y las comprobaciones automáticas del laboratorio. La valoración corresponde al docente.</p>
<h3>Mi recorrido</h3><table><thead><tr><th>Misión</th><th>Estado</th><th class="num">Pruebas</th><th class="num">Ideas</th><th class="num">Errores</th><th class="num">Pistas</th></tr></thead><tbody>${rows.map((row, i) => `<tr><td><a href="#mision-${i + 1}">${esc(row.name)}</a></td><td>${esc(row.completed)}</td><td class="num">${row.outputChecks}</td><td class="num">${row.ideaChecks}</td><td class="num">${row.errors}</td><td class="num">${row.hints}</td></tr>`).join('')}</tbody></table><p class="small">Los errores son intentos registrados que necesitaron revisión. Se conservan como parte del aprendizaje.</p>
${ready.ready ? '<p class="small">Las evidencias requeridas están presentes. Revisa su contenido y la tarea del docente antes de entregar.</p>' : `<section class="pending"><h3>Evidencias pendientes</h3><ul>${ready.missing.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>`}</header>
${list.map((mission, index) => missionHtml(state, mission, index)).join('')}
<section class="final"><div class="eyebrow">Cierre del laboratorio</div><h2>Lo que he aprendido</h2><p class="subtitle">Conecto mis resultados con una explicación propia de cómo funciona Pool.</p>${NOTEBOOK_FINAL_PROMPTS.map(item => `<section class="final-item"><h3>${esc(item.title)}</h3><p class="question">${esc(item.prompt)}</p>${answerHtml(state?.finalReflection?.[item.key])}</section>`).join('')}<h3>Mi entrega</h3><p>Reviso el nombre, las salidas, mi código y la síntesis. Entrego este cuaderno en la tarea indicada por mi docente. Conservo también la copia JSON del progreso para seguir trabajando.</p></section>
<footer class="footer">Pool Lab · Cuaderno de aprendizaje · Versión 2 · ${esc(name)}<br>Este archivo contiene las evidencias guardadas al exportarlo. No envía datos ni depende de una conexión a Internet.</footer>
</main></body></html>`;
}
