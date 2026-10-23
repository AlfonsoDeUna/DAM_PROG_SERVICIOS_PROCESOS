import { missions } from './missions.js?v=20261023-simple2';
import { manualLessons } from './manual-lessons.js?v=20261023-simple2';
import { checkOutput } from './checks.js';
import { freshState, normaliseState, recordOutput } from './state.js';
import { buildManualNotebookHtml, buildManualNotebookPdf, manualNotebookFilename } from './manual-notebook.js?v=20261023-simple1';

const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STORAGE_KEY = 'pool-lab-classroom-v2';
let storageWorks = true;
let loadNotice = '';
function restore(raw) {
  const clean = normaliseState(raw, missions);
  // El manual permite consultar todos los apartados, sin la progresión del juego.
  if (Number.isInteger(raw.current) && raw.current >= 0 && raw.current < missions.length) clean.current = raw.current;
  return clean;
}
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('pool-lab-progress-v1');
    if (!raw) return freshState(missions);
    const recovered = restore(JSON.parse(raw));
    try {
      if (!localStorage.getItem('pool-lab-before-manual-v2')) localStorage.setItem('pool-lab-before-manual-v2', raw);
    } catch { /* Un navegador lleno no debe impedir recuperar el trabajo. */ }
    return recovered;
  } catch {
    loadNotice = 'No se pudo recuperar el guardado. Descarga una copia de tu trabajo antes de cerrar.';
    return freshState(missions);
  }
}
let state = load();
let pendingImport = null;
let notebookSnapshot = null;
let pdfURL = null;
let notebookGeneration = 0;
let toastTimer;
const currentMission = () => missions[state.current];
const currentSession = () => state.sessions[currentMission().id];
function save() {
  state.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    storageWorks = true;
  } catch { storageWorks = false; }
  $('save-status').textContent = storageWorks ? (loadNotice || 'Tu trabajo se guarda en este navegador.') : 'No se puede guardar aquí. Descarga tu cuaderno o una copia JSON antes de cerrar.';
}
function toast(message) {
  clearTimeout(toastTimer);
  $('toast').textContent = message;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => { $('toast').hidden = true; }, 3500);
}
function highlightPython(code) {
  const pattern = /#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:from|import|def|return|for|in|if|with|as|True|False|None|else)\b|\b(?:print|range|len|sum|list)\b|\b\d[\d_]*(?:\.\d+)?\b/g;
  let html = '', last = 0;
  for (const match of code.matchAll(pattern)) {
    const value = match[0];
    const type = value.startsWith('#') ? 'comment' : /^["']/.test(value) ? 'string' : /^\d/.test(value) ? 'number' : /^(print|range|len|sum|list)$/.test(value) ? 'built' : 'keyword';
    html += esc(code.slice(last, match.index)) + `<span class="tok-${type}">${esc(value)}</span>`;
    last = match.index + value.length;
  }
  return html + esc(code.slice(last));
}
function manualMessage(value) {
  return String(value || '')
    .replace('Puedes copiar este error con el botón de revisión y traerlo al chat.', 'Si necesitas ayuda, enseña al profesor el mensaje de error completo.')
    .replace('Lee la última línea del error o copia la revisión para que lo resolvamos en el chat.', 'Lee la última línea del error. Si necesitas ayuda, enseña al profesor el mensaje completo.')
    .replace('Comprueba el cambio pedido', 'Comprueba los datos indicados en este apartado')
    .replaceAll('estas misiones', 'estos ejemplos').replaceAll('esta misión', 'este apartado');
}
function renderNav() {
  $('lesson-nav').innerHTML = missions.map((m, i) => `${i === 7 ? '<p class="nav-label">Para ampliar · opcional</p>' : ''}<button class="lesson-link${i === state.current ? ' active' : ''}${state.sessions[m.id].verdicts.base?.ok ? ' checked' : ''}" data-lesson="${i}"${i === state.current ? ' aria-current="page"' : ''}><span class="number">${String(i + 1).padStart(2, '0')}</span><strong>${esc(m.shortTitle)}</strong>${state.sessions[m.id].verdicts.base?.ok ? '<span aria-label="Prueba comprobada">✓</span>' : ''}</button>`).join('');
}
function renderFeedback() {
  const verdict = currentSession().verdicts.base;
  const box = $('output-feedback');
  box.hidden = !verdict;
  if (!verdict) { box.innerHTML = ''; return; }
  box.classList.toggle('success', verdict.ok);
  box.innerHTML = `<strong>${esc(verdict.title)}</strong><p>${esc(manualMessage(verdict.message))}</p>${verdict.details?.length ? `<ul>${verdict.details.map(d => `<li>${esc(manualMessage(d))}</li>`).join('')}</ul>` : ''}`;
}
function renderHistory() {
  const items = currentSession().outputHistory.filter(x => x.trial === 'base');
  $('attempt-history').hidden = !items.length;
  $('history-title').textContent = `Mis intentos (${items.length})`;
  $('history-content').innerHTML = (items.length > 10 ? '<p>Se muestran los 10 más recientes. El cuaderno conserva todos tus intentos.</p>' : '') + items.slice(-10).map((item, i) => `<article><strong>Intento ${Math.max(0, items.length - 10) + i + 1} · ${item.ok ? 'La salida coincide' : 'Para revisar'}</strong><p>${esc(manualMessage(item.message))}</p><pre>${esc(item.output)}</pre></article>`).join('');
}
function renderLesson() {
  const m = currentMission(), s = currentSession(), lesson = manualLessons[m.id];
  renderNav();
  $('student-name').value = state.profile.name;
  $('lesson-number').textContent = `APARTADO ${String(state.current + 1).padStart(2, '0')} · ${lesson.optional || 'PYTHON PASO A PASO'}`;
  $('lesson-title').textContent = m.shortTitle;
  $('lesson-intro').textContent = lesson.intro;
  $('lesson-points').innerHTML = lesson.points.map(point => `<li>${esc(point)}</li>`).join('');
  const challenge = m.codeMode === 'challenge';
  $('code-panel').hidden = challenge;
  $('code-actions').hidden = challenge;
  $('code-challenge').hidden = !challenge;
  $('program-title').textContent = challenge ? 'Ahora escribe tu programa' : m.id === 'final' ? 'El código que vas a adaptar' : 'El código, comentado';
  $('lesson-code').innerHTML = highlightPython(m.code || '');
  $('code-filename').textContent = m.fileName;
  $('challenge-instruction').textContent = challenge ? 'Mide el recorrido completo de las ocho llamadas y guarda sus resultados.' : '';
  $('challenge-format').textContent = m.challenge?.outputFormat?.join('\n') || '';
  $('practice-instruction').textContent = lesson.instruction;
  $('run-command').textContent = m.command;
  $('lesson-observe').textContent = lesson.observe;
  $('output-input').value = s.outputs.base;
  $('notes-input').value = s.note;
  $('actual-code-input').value = s.actualCode;
  $('previous-button').disabled = state.current === 0;
  $('next-button').textContent = state.current === missions.length - 1 ? 'Ver mi cuaderno ↓' : 'Siguiente →';
  $('page-position').textContent = `${state.current + 1} de ${missions.length}`;
  $('attempt-history').open = false;
  document.querySelector('.notes').open = false;
  document.querySelector('.help').open = false;
  renderFeedback();
  renderHistory();
  document.title = `${m.shortTitle} · Pool Lab`;
}
function toggleMenu(open) {
  $('sidebar').classList.toggle('open', open);
  $('menu-toggle').setAttribute('aria-expanded', String(open));
  $('menu-backdrop').hidden = !open;
}
function navigate(index) {
  if (!Number.isInteger(index) || index < 0 || index >= missions.length) return;
  state.current = index;
  save(); renderLesson(); toggleMenu(false);
  window.scrollTo({top:0, behavior:'instant'});
  $('lesson').focus({preventScroll:true});
}
$('lesson-nav').addEventListener('click', event => {
  const button = event.target.closest('[data-lesson]');
  if (button) navigate(Number(button.dataset.lesson));
});
$('previous-button').addEventListener('click', () => navigate(state.current - 1));
$('next-button').addEventListener('click', () => state.current === missions.length - 1 ? openNotebook() : navigate(state.current + 1));
$('menu-toggle').addEventListener('click', () => toggleMenu($('menu-toggle').getAttribute('aria-expanded') !== 'true'));
$('menu-backdrop').addEventListener('click', () => { toggleMenu(false); $('menu-toggle').focus(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') toggleMenu(false); });
$('student-name').addEventListener('input', () => {
  state.profile.name = $('student-name').value;
  if (state.profile.name.trim() && !state.profile.startedAt) state.profile.startedAt = new Date().toISOString();
  save();
});
$('output-input').addEventListener('input', () => {
  currentSession().outputs.base = $('output-input').value;
  delete currentSession().verdicts.base;
  save(); renderFeedback(); renderNav();
});
$('notes-input').addEventListener('input', () => { currentSession().note = $('notes-input').value; save(); });
$('actual-code-input').addEventListener('input', () => { currentSession().actualCode = $('actual-code-input').value; save(); });
$('check-button').addEventListener('click', () => {
  const raw = $('output-input').value;
  const verdict = checkOutput(currentMission().trials[0].check, raw);
  recordOutput(currentSession(), 'base', raw, verdict);
  save(); renderFeedback(); renderHistory(); renderNav();
  $('output-feedback').scrollIntoView({block:'nearest', behavior:'smooth'});
});
async function copy(value) {
  try {
    await navigator.clipboard.writeText(value);
    toast('Copiado.');
  } catch {
    const field = document.createElement('textarea');
    field.value = value; field.style.position = 'fixed'; field.style.opacity = '0';
    document.body.append(field); field.select();
    const copied = document.execCommand('copy'); field.remove();
    toast(copied ? 'Copiado.' : 'Selecciona el texto y usa Ctrl + C para copiarlo.');
  }
}
function download(content, fileName, type) {
  const url = URL.createObjectURL(new Blob([content], {type}));
  const a = document.createElement('a'); a.href = url; a.download = fileName;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
$('copy-code').addEventListener('click', () => copy(currentMission().code));
$('copy-command').addEventListener('click', () => copy(currentMission().command));
$('download-code').addEventListener('click', () => download(currentMission().code, currentMission().fileName, 'text/x-python;charset=utf-8'));
function resetImport() {
  pendingImport = null;
  $('import-progress').value = '';
  $('import-status').textContent = '';
  $('import-confirmation').hidden = true;
}
function clearPdf() {
  if (pdfURL) URL.revokeObjectURL(pdfURL);
  pdfURL = null;
  $('pdf-download').removeAttribute('href');
  $('pdf-download').removeAttribute('download');
  $('pdf-download').classList.add('disabled');
  $('pdf-download').setAttribute('aria-disabled', 'true');
}
async function openNotebook() {
  save();
  notebookSnapshot = structuredClone(state);
  const generation = ++notebookGeneration;
  resetImport(); clearPdf();
  const used = missions.filter(m => notebookSnapshot.sessions[m.id].outputs.base.trim()).length;
  $('notebook-intro').textContent = `${notebookSnapshot.profile.name.trim() || 'Aún no has escrito tu nombre'} · Has añadido pruebas en ${used} de ${missions.length} apartados.`;
  $('pdf-download').textContent = 'Preparando PDF…';
  $('pdf-status').textContent = 'Se prepara aquí, en tu navegador.';
  $('notebook-dialog').showModal();
  try {
    if (!globalThis.PDFLib) throw new Error('PDF no disponible');
    const bytes = await buildManualNotebookPdf(notebookSnapshot, missions, globalThis.PDFLib);
    if (generation !== notebookGeneration || !$('notebook-dialog').open) return;
    pdfURL = URL.createObjectURL(new Blob([bytes], {type:'application/pdf'}));
    $('pdf-download').href = pdfURL;
    $('pdf-download').download = manualNotebookFilename(notebookSnapshot, 'pdf');
    $('pdf-download').classList.remove('disabled');
    $('pdf-download').setAttribute('aria-disabled', 'false');
    $('pdf-download').textContent = 'Descargar PDF';
    $('pdf-status').textContent = 'Tu cuaderno está listo para descargar.';
  } catch {
    if (generation !== notebookGeneration || !$('notebook-dialog').open) return;
    $('pdf-download').textContent = 'PDF no disponible';
    $('pdf-status').textContent = 'Puedes descargar el HTML y usar Imprimir → Guardar como PDF en tu navegador.';
  }
}
$('notebook-button').addEventListener('click', openNotebook);
$('close-notebook').addEventListener('click', () => $('notebook-dialog').close());
$('notebook-dialog').addEventListener('close', () => { notebookGeneration++; clearPdf(); resetImport(); });
$('pdf-download').addEventListener('click', event => { if (!pdfURL) event.preventDefault(); });
$('html-download').addEventListener('click', () => download(buildManualNotebookHtml(notebookSnapshot, missions), manualNotebookFilename(notebookSnapshot, 'html'), 'text/html;charset=utf-8'));
$('export-progress').addEventListener('click', () => download(JSON.stringify({app:'Pool Lab',...notebookSnapshot}, null, 2), manualNotebookFilename(notebookSnapshot,'html').replace(/\.html$/,'.json'), 'application/json'));
$('import-progress').addEventListener('change', async () => {
  const file = $('import-progress').files[0];
  const generation = notebookGeneration;
  pendingImport = null; $('import-confirmation').hidden = true;
  if (!file) return;
  try {
    if (file.size > 20 * 1024 * 1024) throw new Error('La copia supera los 20 MB.');
    const raw = JSON.parse(await file.text());
    const imported = restore(raw);
    if (generation !== notebookGeneration || !$('notebook-dialog').open || $('import-progress').files[0] !== file) return;
    pendingImport = imported;
    $('import-status').textContent = `Copia de ${imported.profile.name || 'alumno sin nombre'}. Sustituirá el trabajo de este navegador. Guarda antes tu copia actual si quieres conservarla.`;
    $('import-confirmation').hidden = false;
  } catch (error) {
    if (generation === notebookGeneration && $('notebook-dialog').open) $('import-status').textContent = `No se pudo leer esta copia. ${error instanceof SyntaxError ? 'Selecciona un JSON exportado por Pool Lab.' : error.message}`;
  }
});
$('confirm-import').addEventListener('click', () => {
  if (!pendingImport) return;
  state = pendingImport; loadNotice = ''; save(); renderLesson();
  $('notebook-dialog').close();
  window.scrollTo({top:0, behavior:'instant'});
  toast('Copia recuperada. Puedes continuar.');
});
$('cancel-import').addEventListener('click', resetImport);
window.addEventListener('pagehide', save);
renderLesson(); save();
