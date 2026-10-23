// Exportaciones del manual: no exigen completar apartados ni escriben en el estado.
// El código exportado es el aportado por el alumno, no el ejemplo del manual.
const text = value => value == null ? '' : String(value);
const hasText = value => typeof value === 'string' && value.trim().length > 0;
const array = value => Array.isArray(value) ? value : [];
const records = value => array(value).filter(item => item && typeof item === 'object');
const esc = value => text(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const sessionFor = (state, mission) => state?.sessions?.[mission.id] || {};

function dateValue(value) {
  if (!hasText(value)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
function formatDate(value) {
  const date = dateValue(value);
  return date ? new Intl.DateTimeFormat('es-ES', {timeZone:'Europe/Madrid',dateStyle:'medium',timeStyle:'short'}).format(date) : 'Sin fecha registrada';
}
function dateForFilename(state) {
  const date = dateValue(state?.updatedAt) || dateValue(state?.profile?.startedAt);
  if (!date) return 'sin-fecha';
  const parts = new Intl.DateTimeFormat('es-ES', {timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
  return ['year','month','day'].map(type => parts.find(part => part.type === type)?.value || '').join('-');
}
export function manualNotebookFilename(state, ext = 'html') {
  const name = text(state?.profile?.name).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').slice(0,80).replace(/^-+|-+$/g,'') || 'alumno';
  return `Pool-Lab_Cuaderno_${name}_${dateForFilename(state)}.${ext === 'pdf' ? 'pdf' : 'html'}`;
}

const p = value => ({kind:'p',text:text(value)});
const h = value => ({kind:'h',text:text(value)});
const pre = (value, empty) => hasText(value) ? {kind:'pre',text:value} : {kind:'empty',text:empty};
function resultBlocks(verdict, subject = 'salida') {
  if (!verdict || typeof verdict !== 'object') return [{kind:'result',text:'Pendiente de comprobar.',ok:null}];
  const status = verdict.ok === true ? subject === 'respuesta' ? 'Respuesta correcta.' : 'La salida coincide.' : verdict.ok === false ? 'Hay algo que revisar.' : 'Pendiente de comprobar.';
  const details = array(verdict.details).filter(hasText);
  return [{kind:'result',ok:typeof verdict.ok === 'boolean' ? verdict.ok : null,
    text:[status,verdict.title,verdict.message,...details].filter(hasText).join('\n')}];
}
function choiceText(mission, choice) {
  if (!Number.isInteger(choice) || choice < 0) return 'Sin respuesta registrada';
  const option = mission.reflection?.options?.[choice];
  return `${String.fromCharCode(65 + choice)}. ${typeof option === 'string' ? option : `Opción ${choice + 1}`}`;
}
function historyBlocks(history, label) {
  return history.flatMap((item,index) => [h(`${label} ${index + 1} · ${formatDate(item.at)}`),
    pre(item.output,'No se guardó el texto de esta salida.'),...resultBlocks(item)]);
}
function legacyBlocks(mission, s) {
  const blocks = [];
  if (hasText(s.prediction)) {
    blocks.push(h('Predicción del formato anterior'));
    const question = s.predictionQuestion || mission.previousPredictionPrompt || mission.predictionPrompt;
    if (question) blocks.push(p(question));
    blocks.push(p(s.prediction));
    if (s.predictionSavedAt) blocks.push(p(`Registrada: ${formatDate(s.predictionSavedAt)}${s.predictionTiming === 'after' ? ' · añadida después de comprobar' : s.predictionTiming === 'before' ? ' · antes de comprobar' : ''}.`));
  }
  if (hasText(s.outputs?.variant) || s.verdicts?.variant) {
    blocks.push(h('Experimento del formato anterior'));
    const trial = array(mission.trials).find(item => item.id === 'variant');
    if (trial?.prompt) blocks.push(p(trial.prompt));
    blocks.push(pre(s.outputs?.variant,'Sin salida añadida.'),...resultBlocks(s.verdicts?.variant));
  }
  blocks.push(...historyBlocks(records(s.outputHistory).filter(item => item.trial === 'variant'),'Intento del experimento anterior'));
  if (Number.isInteger(s.reflectionChoice) && s.reflectionChoice >= 0) {
    blocks.push(h('Respuesta del formato anterior'));
    if (mission.reflection?.question) blocks.push(p(mission.reflection.question));
    blocks.push(p(choiceText(mission,s.reflectionChoice)));
    if (s.reflectionChecked) {
      const feedback = mission.reflection?.feedback?.[s.reflectionChoice];
      blocks.push(p(feedback || 'Respuesta comprobada en el formato anterior.'));
    } else blocks.push(p('Esta selección no se llegó a comprobar.'));
  }
  for (const [index,item] of records(s.ideaHistory).entries()) {
    blocks.push(h(`Intento de respuesta anterior ${index + 1} · ${formatDate(item.at)}`),p(choiceText(mission,item.choice)));
    blocks.push(...resultBlocks({ok:item.ok,message:item.feedback},'respuesta'));
  }
  for (const [index,item] of records(s.simulationHistory).entries()) {
    blocks.push(h(`Exploración del simulador ${index + 1} · ${formatDate(item.at)}`),
      p(`Trabajadores: ${text(item.workers)}. Tareas: ${text(item.tasks)}. Pasos del modelo: ${text(item.steps)}.`),
      p(`Orden de finalización: ${array(item.completionOrder).map(text).join(', ')}.`),
      p(`Resultados en el orden de entrada: ${array(item.results).map(text).join(', ')}.`));
  }
  const evidence = s.completionEvidence;
  if (evidence && (hasText(evidence.outputs?.base) || hasText(evidence.outputs?.variant))) {
    blocks.push(h('Pruebas conservadas al finalizar el formato anterior'),p(formatDate(evidence.at || s.completedAt)));
    for (const [key,label] of [['base','Prueba inicial'],['variant','Experimento']]) {
      if (hasText(evidence.outputs?.[key])) blocks.push(p(label),pre(evidence.outputs[key],''));
    }
    if (Number.isInteger(evidence.reflectionChoice)) blocks.push(p(`Respuesta entonces registrada: ${choiceText(mission,evidence.reflectionChoice)}`));
  }
  const hints = array(mission.hints).slice(0,Math.max(0,Math.floor(Number(s.hints) || 0)));
  if (hints.length) blocks.push(h('Pistas consultadas anteriormente'),...hints.map(p));
  return blocks;
}
function sectionsFor(state, missions) {
  const sections = array(missions).map((mission,index) => {
    const s = sessionFor(state,mission), history = records(s.outputHistory).filter(item => item.trial !== 'variant');
    const blocks = [];
    if (mission.goal) blocks.push(p(mission.goal));
    blocks.push(h('Mi prueba'),pre(s.outputs?.base,'Todavía no he añadido una salida.'),...resultBlocks(s.verdicts?.base));
    if (history.length) blocks.push(h('Mis intentos y correcciones'),...historyBlocks(history,'Intento'));
    blocks.push(h('Mis notas'),hasText(s.note) ? p(s.note) : {kind:'empty',text:'Todavía no he añadido notas.'},h('Mi código aportado'));
    if (hasText(s.actualCode) && mission.fileName) blocks.push(p(`Archivo: ${mission.fileName}`));
    blocks.push(pre(s.actualCode,'No he adjuntado código propio en este apartado.'));
    return {title:`Apartado ${Number.isInteger(mission.number) ? mission.number : index + 1} · ${mission.shortTitle || mission.title || 'Sin título'}`,blocks,legacy:legacyBlocks(mission,s)};
  });
  const labels = {explanation:'Cómo funciona Pool',evidence:'Evidencias de mis pruebas',limits:'Errores, cambios de idea y límites',transfer:'Aplicación a otros problemas'};
  const finalNotes = Object.entries(state?.finalReflection || {}).filter(([,value]) => hasText(value));
  if (finalNotes.length) sections.push({title:'Notas finales conservadas del formato anterior',blocks:finalNotes.flatMap(([key,value]) => [h(labels[key] || key),p(value)]),legacy:[]});
  return sections;
}
function blockHtml(block) {
  if (block.kind === 'h') return `<h3>${esc(block.text)}</h3>`;
  if (block.kind === 'pre') return `<pre>${esc(block.text)}</pre>`;
  if (block.kind === 'result') return `<div class="result ${block.ok === true ? 'ok' : block.ok === false ? 'review' : 'pending'}">${esc(block.text)}</div>`;
  return `<p${block.kind === 'empty' ? ' class="empty"' : ''}>${esc(block.text)}</p>`;
}
export function buildManualNotebookHtml(state, missions = []) {
  const profile = state?.profile || {}, learner = hasText(profile.name) ? profile.name.trim() : 'Sin nombre';
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Cuaderno Pool Lab · ${esc(learner)}</title><style>
  *{box-sizing:border-box}body{margin:0;background:#f4f5ee;color:#24352b;font:14px/1.65 system-ui,-apple-system,Segoe UI,sans-serif}main{max-width:850px;margin:28px auto;padding:40px 48px;background:white;border:1px solid #dde3d6}header{padding-bottom:24px;border-bottom:2px solid #b7c99c}header .eyebrow{margin:0;color:#536c44;font-size:11px;letter-spacing:.13em;text-transform:uppercase}h1{margin:8px 0 12px;font-size:32px;line-height:1.2}h2{font-size:23px;line-height:1.3;margin:30px 0 14px}h3{font-size:15px;line-height:1.4;margin:22px 0 8px}p{margin:8px 0;white-space:pre-wrap;overflow-wrap:anywhere}.meta{margin:15px 0;color:#52604e}.part{padding-bottom:24px;border-bottom:1px solid #dfe5d8}.empty{font-style:italic;color:#6b7565}pre{margin:10px 0 14px;padding:15px;border:1px solid #dce3d5;border-radius:6px;background:#f6f8f1;font:12px/1.6 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere;tab-size:4}.result{margin:12px 0;padding:12px 14px;border-left:3px solid #9ca792;background:#f1f3ed;white-space:pre-wrap;overflow-wrap:anywhere}.result.ok{border-color:#62864e;background:#eff5e8}.result.review{border-color:#b18142;background:#fbf4e8}.legacy{margin:26px 0 0;padding:18px 22px;border:1px solid #dad6e3;border-radius:7px;background:#fcfbfe}.legacy>h3{margin-top:0;color:#685573;font-size:17px}.legacy .intro{color:#74687a;font-size:12px}footer{margin-top:25px;color:#6b7565;font-size:12px}h1,h2,h3{break-after:avoid}p,pre{orphans:2;widows:2}@page{size:A4;margin:18mm}@media print{body{background:white;font-size:10pt}main{max-width:none;margin:0;padding:0;border:0}h1{font-size:24pt}h2{font-size:17pt}h3{font-size:11pt}pre{font-size:8.5pt;border-color:#ddd}.part,.legacy,pre{break-inside:auto}.result{break-inside:avoid}.screen-only{display:none}}@media(max-width:600px){main{margin:0;padding:26px 20px;border:0}.legacy{padding:15px}h1{font-size:28px}}
  </style></head><body><main><header><p class="eyebrow">Python · Pool de procesos</p><h1>Mi cuaderno del laboratorio</h1><div class="meta"><p><strong>Alumno/a:</strong> ${esc(learner)}</p><p><strong>Grupo:</strong> ${esc(hasText(profile.group) ? profile.group.trim() : 'No indicado')}</p><p><strong>Trabajo guardado:</strong> ${esc(formatDate(state?.updatedAt || profile.startedAt))}</p></div><p>Este cuaderno reúne las pruebas, sus correcciones, mis notas y el código que he aportado. Refleja el trabajo registrado hasta ahora y se puede guardar en cualquier momento.</p><p class="screen-only">Para imprimir o guardar como PDF, utiliza la opción Imprimir de tu navegador.</p></header>
  ${sectionsFor(state,missions).map(section => `<section class="part"><h2>${esc(section.title)}</h2>${section.blocks.map(blockHtml).join('')}${section.legacy.length ? `<section class="legacy"><h3>Trabajo anterior conservado</h3><p class="intro">Estas respuestas proceden del formato anterior del laboratorio. Se conservan como parte de mi trabajo.</p>${section.legacy.map(blockHtml).join('')}</section>` : ''}</section>`).join('')}
  <footer>Pool Lab · Cuaderno personal para la tarea indicada por el profesor.</footer></main></body></html>`;
}

// PDF local con pdf-lib. El HTML conserva el Unicode original; los caracteres
// que no admite WinAnsi se representan mediante su código [U+XXXX] en el PDF.
export async function buildManualNotebookPdf(state, missions = [], PDFLib) {
  if (!PDFLib?.PDFDocument || !PDFLib?.StandardFonts || !PDFLib?.rgb) throw new Error('No se ha cargado el generador PDF. Descarga el cuaderno HTML y usa Imprimir / Guardar PDF.');
  const {PDFDocument,StandardFonts,rgb} = PDFLib, pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica), bold = await pdf.embedFont(StandardFonts.HelveticaBold), mono = await pdf.embedFont(StandardFonts.Courier), italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const profile = state?.profile || {}, learner = hasText(profile.name) ? profile.name.trim() : 'Sin nombre';
  pdf.setTitle(`Cuaderno Pool Lab - ${learner}`); pdf.setAuthor(learner); pdf.setSubject('Pruebas y notas de Python multiprocessing.Pool'); pdf.setCreator('Pool Lab');
  const saved = dateValue(state?.updatedAt); if (saved) {pdf.setCreationDate(saved);pdf.setModificationDate(saved);}
  const W=595.28,H=841.89,margin=48,width=W-margin*2,bottom=57;
  const ink=rgb(.11,.17,.15),muted=rgb(.35,.41,.37),green=rgb(.20,.36,.23),warning=rgb(.49,.30,.10),rule=rgb(.82,.87,.81);
  let page,y,usedFallback=false;
  const replacements=new Map([['→','->'],['←','<-'],['↔','<->'],['⇒','=>'],['≥','>='],['≤','<='],['≠','!='],['−','-'],['–','-'],['—','-'],['‑','-'],['✓','[OK]'],['✔','[OK]'],['✗','[X]'],['✘','[X]'],['⚠','[Aviso]'],[' ',' ']]);
  function safe(value,font=regular) {
    let output='';
    for (const char of text(value).replace(/\r\n?/g,'\n').replace(/\t/g,'    ')) {
      if (char==='\n') {output+=char;continue;}
      if (replacements.has(char)) {output+=replacements.get(char);continue;}
      try {font.encodeText(char);output+=char;}
      catch {usedFallback=true;output+=`[U+${char.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')}]`;}
    }
    return output;
  }
  function wrap(value,font,size,maxWidth=width,preserveSpaces=false) {
    const lines=[];
    for (const source of safe(value,font).split('\n')) {
      let current='';
      for (const char of source) {
        if (current && font.widthOfTextAtSize(current+char,size)>maxWidth) {
          const split=preserveSpaces?-1:current.lastIndexOf(' ');
          if (split>Math.floor(current.length/2)) {lines.push(current.slice(0,split));current=current.slice(split+1)+char;}
          else {lines.push(current);current=char;}
        } else current+=char;
      }
      lines.push(current);
    }
    return lines;
  }
  function newPage() {
    page=pdf.addPage([W,H]);y=H-61;
    page.drawText('POOL LAB / CUADERNO DEL LABORATORIO',{x:margin,y:H-29,size:7,font:bold,color:muted});
    page.drawLine({start:{x:margin,y:H-38},end:{x:W-margin,y:H-38},thickness:.6,color:rule});
  }
  function ensure(height) {if(!page || y-height<bottom)newPage();}
  function paragraph(value,{font=regular,size=9.5,color=ink,leading=size*1.48,after=7,indent=0,preserveSpaces=false}={}) {
    const lines=wrap(value,font,size,width-indent,preserveSpaces);ensure(Math.min(lines.length,2)*leading);
    for(const line of lines) {ensure(leading);if(line)page.drawText(line,{x:margin+indent,y,size,font,color});y-=leading;}
    y-=after;
  }
  function heading(value,level=2) {
    const size=level===1?25:level===2?17:11.5;ensure(size*1.5+42);
    if(level>1)y-=10;
    paragraph(value,{font:bold,size,leading:size*1.25,after:level===1?13:8,color:level===3?green:ink});
  }
  function renderBlock(block) {
    if(block.kind==='h')heading(block.text,3);
    else if(block.kind==='pre')paragraph(block.text,{font:mono,size:7.9,leading:11.3,indent:8,after:11,preserveSpaces:true});
    else if(block.kind==='result')paragraph(block.text,{size:9,color:block.ok===true?green:block.ok===false?warning:muted});
    else paragraph(block.text,block.kind==='empty'?{font:italic,color:muted}:{});
  }
  newPage();heading('Mi cuaderno del laboratorio',1);paragraph('Python · Pool de procesos',{size:13,color:muted,after:16});
  paragraph(`Alumno/a: ${learner}\nGrupo: ${hasText(profile.group)?profile.group.trim():'No indicado'}\nTrabajo guardado: ${formatDate(state?.updatedAt || profile.startedAt)}`,{size:10,after:13});
  paragraph('Este cuaderno reúne las pruebas, sus correcciones, mis notas y el código que he aportado. Refleja el trabajo registrado hasta ahora y se puede guardar en cualquier momento.');
  for(const section of sectionsFor(state,missions)) {
    heading(section.title,2);section.blocks.forEach(renderBlock);
    if(section.legacy.length) {
      heading('Trabajo anterior conservado',3);
      paragraph('Estas respuestas proceden del formato anterior del laboratorio. Se conservan como parte de mi trabajo.',{font:italic,size:8.5,color:muted});
      section.legacy.forEach(renderBlock);
    }
  }
  if(usedFallback)paragraph('Nota de representación: algunos caracteres aparecen como [U+XXXX] porque no forman parte de esta fuente. El cuaderno HTML y la copia JSON conservan el texto original.',{font:italic,size:8,color:muted});
  const pages=pdf.getPages();
  for(const [index,target] of pages.entries()) {
    target.drawLine({start:{x:margin,y:39},end:{x:W-margin,y:39},thickness:.5,color:rule});
    const label=`${index+1} / ${pages.length}`;
    target.drawText(label,{x:W-margin-regular.widthOfTextAtSize(label,8),y:25,font:regular,size:8,color:muted});
    target.drawText(wrap(`${learner} - Pool Lab`,regular,7,width-62)[0] || 'Pool Lab',{x:margin,y:25,font:regular,size:7,color:muted});
  }
  return pdf.save();
}
