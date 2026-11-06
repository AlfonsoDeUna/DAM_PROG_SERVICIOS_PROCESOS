(function(){
 'use strict';
 const U=window.HilosUI,$=id=>document.getElementById(id),deck=window.HILOS_DECK,bank=window.HILOS_QUESTIONS.questions,qmap=new Map(bank.map(q=>[q.id,q]));
 const slides=[];for(const s of deck.slides){if(s.content.some(c=>c.type==='assessment')){for(const q of bank.filter(q=>q.block===s.block).sort((a,b)=>a.position-b.position)){slides.push({id:'question-'+q.id,block:s.block,phase:q.type==='blank'?'Actividad individual':'Pregunta individual',title:q.prompt,kind:'question',questionId:q.id});slides.push({id:'results-'+q.id,block:s.block,phase:'Comprobación de la clase',title:'Resultados de la pregunta '+q.position,kind:'results',questionId:q.id});}}else slides.push(s);}
 let index=0,api=null,teacher=false,sessionId='',sessions=[],snapshot=null,loading=false,loadAgain=false,projectionGroup='',revealed=new Set(),renderGeneration=0,mutation=false,dataVersion=0,refreshError='';
 const questionErrors=new Map();
 function questionKey(questionId,id=sessionId){return `${id}:${questionId}`;}
 function invalidateSnapshot(){dataVersion++;snapshot=null;}
 function switchSession(nextId){
  nextId=nextId||'';if(nextId===sessionId)return;
  sessionId=nextId;invalidateSnapshot();revealed.clear();projectionGroup='';questionErrors.clear();refreshError='';paintLive();
 }
 function questionErrorText(questionId,id=sessionId){const error=questionErrors.get(questionKey(questionId,id));return error?`No se pudo ${error.action==='open'?'abrir':'cerrar'} la pregunta: ${error.message}`:'';}
 function questionErrorHTML(q,data){const message=questionErrorText(q.id,data.session.id);return message?`<div class="banner error results-notice" role="alert">${U.esc(message)}</div>`:'';}
 function isQuestionClosed(q,data){
  if(!q||!data?.session)return false;
  const block=data.blocks?.find(b=>b.id===q.block);
  return data.session.is_active===false||Boolean(block&&(block.is_open===false||block.closed_questions?.includes(q.id)));
 }
 function closeRequiredHTML(q,data){return `${questionErrorHTML(q,data)}<div class="panel results-notice"><h2>Cierra esta pregunta para ver los resultados</h2><p>${U.esc(data.session.label)} · Código <strong>${U.esc(data.session.code)}</strong></p><p>Los resultados se mostrarán cuando se confirme el cierre de esta pregunta. Las demás preguntas del bloque conservarán su estado.</p><div class="row"><button class="primary" data-close-current ${mutation?'disabled':''}>Cerrar y ver resultados</button><button data-refresh-results>Actualizar</button></div></div>`;}
 async function closeQuestion(q){
  if(!q||!teacher||!sessionId||mutation)return false;
  const wanted=sessionId,key=questionKey(q.id,wanted);
  if(snapshot?.session.id===wanted&&snapshot.session.is_active===false){questionErrors.delete(key);return true;}
  mutation=true;dataVersion++;$('next-slide').disabled=true;paintLive();
  try{
   await api.rpc('hilos_set_question',{p_session_id:wanted,p_question_id:q.id,p_is_open:false});
   questionErrors.delete(key);
   if(sessionId!==wanted)return false;
   invalidateSnapshot();refreshError='';await refreshProjection();return true;
  }catch(error){if(sessionId===wanted)questionErrors.set(key,{action:'close',message:error.message});return false;}
  finally{mutation=false;$('next-slide').disabled=index===slides.length-1;paintLive();}
 }
 function blockTitle(id){return deck.blocks.find(b=>b.id===id)?.title||id;}
 function textElement(c){
  if(c.type==='p')return `<p>${U.text(c.text)}</p>`;
  if(c.type==='bullets')return `<ul>${c.items.map(t=>`<li>${U.text(t)}</li>`).join('')}</ul>`;
  if(c.type==='callout')return `<div class="callout"><strong>${U.esc(c.title)}</strong><p>${U.text(c.text)}</p></div>`;
  if(c.type==='table')return `<div class="table-wrap"><table><thead><tr>${c.headers.map(h=>`<th>${U.esc(h)}</th>`).join('')}</tr></thead><tbody>${c.rows.map(row=>`<tr>${row.map(v=>`<td>${U.text(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  if(c.type==='code')return `<div class="code-box"><button data-copy-code aria-label="Copiar código">Copiar</button><pre><code>${U.esc(c.text)}</code></pre></div>`;
  if(c.type==='figure')return figure(c.kind,c.caption);
  return '';
 }
 function figure(kind,caption){
  let body='';
  if(kind==='references')body='<div class="reference-grid"><div class="reference-node"><strong>escritor1</strong><br><code>self.salida</code></div><div class="reference-node"><strong>escritor2</strong><br><code>self.salida</code></div><div class="reference-arrow" aria-hidden="true">↘ &nbsp;&nbsp;&nbsp;&nbsp; ↙</div><div class="reference-node reference-target">Un mismo objeto de archivo<br><code>registro_compartido.txt</code></div></div>';
  if(kind==='join')body='<div class="table-wrap"><table class="lane-table"><thead><tr><th>Momento</th><th>Principal</th><th>T1</th><th>T2</th></tr></thead><tbody><tr><td>Arranque</td><td>start de T1 y T2</td><td>Puede trabajar</td><td>Puede trabajar</td></tr><tr><td>t1.join()</td><td>Espera a T1</td><td>Sigue trabajando</td><td>Puede seguir</td></tr><tr><td>T1 termina</td><td>Puede continuar</td><td>Terminado</td><td>Puede seguir o haber terminado</td></tr><tr><td>t2.join()</td><td>Espera si T2 sigue vivo</td><td>Terminado</td><td>Termina su trabajo</td></tr></tbody></table></div><p class="caption">Esquema conceptual. No fija el orden de los mensajes ni una duración exacta.</p>';
  if(kind==='race')body='<div data-race><div class="row between"><strong>Contador compartido</strong><label class="row small-text"><input type="checkbox" data-race-lock style="width:auto"> Proteger con Lock</label></div><div class="simulation-value" data-race-value>10</div><p class="simulation-message" data-race-message>Dos trabajadores quieren sumar uno. Sigue una intercalación posible.</p><div class="simulation-controls"><button data-race-next>Avanzar un paso</button><button data-race-reset>Reiniciar</button></div></div>';
  if(kind==='queue')body='<div data-queue><strong>Cola de trabajos</strong><div class="queue-pieces" data-queue-items><span class="job">A</span><span class="job">B</span><span class="job">C</span></div><p>En curso: <strong data-queue-working>ninguno</strong></p><p>Pendientes de confirmar: <strong data-queue-pending>3</strong></p><p class="simulation-message" data-queue-message>get() retira un elemento. task_done() confirma que se ha terminado.</p><div class="simulation-controls"><button data-queue-get>get()</button><button data-queue-done disabled>task_done()</button><button data-queue-reset>Reiniciar</button></div></div>';
  return `<div class="diagram">${body}${caption?`<p class="caption">${U.text(caption)}</p>`:''}</div>`;
 }
 function renderContent(s){const code=s.content.filter(c=>c.type==='code');const other=s.content.filter(c=>c.type!=='code');if(code.length===1&&other.length&&code[0].text.split('\n').length>=5&&Math.max(...code[0].text.split('\n').map(line=>line.length))<=56)return `<div class="slide-content with-code">${textElement(code[0])}<div class="explain-column">${other.map(textElement).join('')}</div></div>`;return `<div class="slide-content">${s.content.map(textElement).join('')}</div>`;}
 function renderQuestion(s){const q=qmap.get(s.questionId);const code=U.questionCode(q),twoColumns=Boolean(code)&&Math.max(...(q.code||'').split('\n').map(line=>line.length))<=52;let answers='';if(q.type==='mcq')answers=`<div class="projected-options">${q.options.map(o=>`<div class="projected-option"><b>${o.id.toUpperCase()}.</b><span>${U.text(o.text)}</span></div>`).join('')}</div>`;else answers=`<div class="callout"><strong>Completa ${q.blanks.length===1?'el hueco':'los '+q.blanks.length+' huecos'}</strong><p>Escribe el código que falta en tu página de actividades.</p><ul>${q.blanks.map(b=>`<li><code>${U.esc(b.id)}</code> · ${U.esc(b.label)}</li>`).join('')}</ul></div>`;return `${q.context?`<p class="projected-context">${U.text(q.context)}</p>`:''}<div class="${twoColumns?'question-grid':''}">${code?`<div>${code}</div>`:''}${answers}</div><div class="response-prompt"><span>Responde individualmente · Bloque ${q.block.slice(1)} · Pregunta ${q.position}</span><div class="row"><span id="question-live-status" class="question-live-status"></span><button id="open-question-block" class="small" hidden>Abrir bloque</button></div></div><div id="question-action-message" class="banner error results-notice" role="alert" hidden></div>`;}
 function render(){renderGeneration++;const s=slides[index];$('slide-area').innerHTML=`<article class="slide ${s.kind?'kind-'+s.kind:''} ${s.title.toLowerCase().includes('fuentes')?'source-slide':''}" aria-labelledby="slide-title"><div class="phase"><span class="block-number">${s.block.slice(1)}</span><span>${U.esc(s.phase)}</span></div><h1 id="slide-title">${U.text(s.title)}</h1>${s.kind==='question'?renderQuestion(s):s.kind==='results'?`<p class="result-prompt">${U.text(qmap.get(s.questionId).prompt)}</p><div id="live-results"><p class="loading">Preparando la vista de resultados…</p></div>`:renderContent(s)}</article>`;$('slide-counter').textContent=`${index+1} / ${slides.length}`;$('footer-topic').textContent=blockTitle(s.block);$('prev-slide').disabled=index===0;$('next-slide').disabled=index===slides.length-1;$('next-slide').textContent=s.kind==='question'?'Ver resultados':'Siguiente →';$('next-slide').title=s.kind==='question'?'Cerrar esta pregunta y ver quién ha acertado':'Diapositiva siguiente';$('deck-progress').style.width=((index+1)/slides.length*100)+'%';$('slide-area').scrollTop=0;document.title=`${index+1}. ${s.title} · Hilos Python`;history.replaceState(null,'',`#diapositiva-${index+1}`);initializeSimulations();if(s.kind==='question'||s.kind==='results'){paintLive();refreshProjection();}}
 async function go(n){
  n=Math.max(0,Math.min(slides.length-1,n));if(n===index||mutation)return;
  const origin=index,current=slides[index],next=slides[n],wanted=sessionId;
  if(current.kind==='question'&&next.kind==='results'&&next.questionId===current.questionId&&teacher&&sessionId){
   if(!await closeQuestion(qmap.get(current.questionId)))return;
   if(index!==origin||sessionId!==wanted)return;
  }
  index=n;render();
 }
 function resultHTML(q,data){
  if(!isQuestionClosed(q,data))return closeRequiredHTML(q,data);
  const groups=[...new Set(data.students.map(s=>s.group_name))].sort();
  if(projectionGroup&&!groups.includes(projectionGroup))projectionGroup='';
  const group=projectionGroup,students=data.students.filter(s=>!group||s.group_name===group);
  const rs=new Map(data.responses.filter(r=>r.question_id===q.id).map(r=>[r.user_id,r]));
  const lists={correct:[],incorrect:[],pending:[]};
  for(const student of students){const r=rs.get(student.user_id);lists[!r?'pending':Number(r.score)>=Number(r.max_points)?'correct':'incorrect'].push({student,r});}
  const count=students.length-lists.pending.length,key=data.keys.find(k=>k.question_id===q.id),revealKey=questionKey(q.id,data.session.id);
  const columns=[['correct','✓ Correctas',lists.correct],['incorrect','✕ Incorrectas o parciales',lists.incorrect],['pending','… Sin responder',lists.pending]];
  let solution='';
  if(revealed.has(revealKey)&&key){solution=`<div class="result-solution"><strong>Solución</strong><p>${U.text(U.solutionText(q,key))}</p><p>${U.text(key.explanation)}</p>${q.type==='blank'?`<pre><code>${U.esc(q.code.replace(/\{\{(\w+)\}\}/g,(_,id)=>key.accepted?.[id]?.[0]||'???'))}</code></pre>`:''}</div>`;}
  return `${questionErrorHTML(q,data)}<div class="result-tools"><span>${U.esc(data.session.label)} · Código <strong>${U.esc(data.session.code)}</strong> · Pregunta cerrada</span><div class="row"><label for="projection-group">Grupo</label><select id="projection-group"><option value="">Todos</option>${groups.map(g=>`<option value="${U.esc(g)}" ${g===group?'selected':''}>${U.esc(g)}</option>`).join('')}</select></div></div><div class="result-summary"><div class="stat"><strong>${count} / ${students.length}</strong><span>Han respondido</span></div><div class="stat"><strong>${lists.correct.length}</strong><span>Correctas completas</span></div><div class="stat"><strong>${lists.incorrect.length}</strong><span>Para revisar</span></div><div class="stat"><strong>${count?Math.round(lists.correct.length/count*100)+'%':'—'}</strong><span>Aciertos entre respuestas</span></div></div><div class="result-lists">${columns.map(([kind,title,entries])=>`<section class="result-list ${kind}"><h2>${title} <span class="pill">${entries.length}</span></h2><div class="names">${entries.length?entries.map(({student,r})=>`<div class="result-name">${U.esc(student.display_name)}${r?`<small>${U.esc(U.answerText(q,r.answer))}${q.type==='blank'?' · '+U.scoreLabel(r.score,r.max_points):''}</small>`:''}</div>`).join(''):'<div class="empty">'+(kind==='pending'?'Todos los inscritos han respondido.':'Sin alumnado en esta categoría.')+'</div>'}</div></section>`).join('')}</div>${!students.length?'<p class="banner results-notice">Aún no se ha inscrito alumnado en esta sesión o grupo. Comparte el código de sesión.</p>':''}<div class="result-tools"><span>Actualizado a las ${new Date().toLocaleTimeString('es-ES')} · Los pendientes se calculan sobre el alumnado inscrito.</span><div class="row"><button data-refresh-results>Actualizar</button><button class="primary" data-reveal-solution ${key?'':'disabled'}>${revealed.has(revealKey)?'Ocultar solución':'Mostrar solución'}</button></div></div>${solution}`;
 }
 function paintLive(){
  const s=slides[index];if(!['question','results'].includes(s.kind))return;
  const currentSnapshot=snapshot?.session.id===sessionId?snapshot:null;
  if(s.kind==='question'){
   const status=$('question-live-status'),button=$('open-question-block'),message=$('question-action-message');if(!status||!button)return;
   button.hidden=!teacher||!sessionId;button.disabled=true;
   const error=questionErrorText(s.questionId);if(message){message.hidden=!error;message.textContent=error;}
   const b=currentSnapshot?.blocks.find(b=>b.id===s.block);
   if(currentSnapshot&&teacher){
    const closed=b?.closed_questions?.includes(s.questionId);
    status.textContent=mutation?'Actualizando la pregunta…':`Código ${currentSnapshot.session.code} · ${!currentSnapshot.session.is_active?'Sesión archivada':closed?'Pregunta cerrada':b?.is_open?'Bloque abierto':'Bloque cerrado'}`;
    button.textContent=closed?'Reabrir pregunta':b?.is_open?'Bloque abierto':'Abrir bloque';
    button.disabled=mutation||!currentSnapshot.session.is_active||Boolean(b?.is_open&&!closed);
   }else status.textContent=refreshError?'Sin conexión a resultados':mutation?'Actualizando la pregunta…':teacher&&sessionId?'Cargando el estado de la pregunta…':'La siguiente diapositiva muestra los resultados de la clase.';
   return;
  }
  const container=$('live-results');if(!container)return;
  const notice=refreshError?`<div class="banner error results-notice" role="alert">No se ha podido actualizar: ${U.esc(refreshError)}. <button data-refresh-results>Reintentar</button></div>`:'';
  const show=html=>{container.innerHTML=notice+html;};
  if(!teacher){show('<div class="panel results-notice"><h2>Conecta tu sesión docente</h2><p>Esta diapositiva mostrará quién acertó, quién necesita revisar y quién no ha respondido.</p><button class="primary" data-connect>Conectar sesión</button><p class="auth-note">El acceso docente permite proyectar los resultados de tu clase.</p></div>');return;}
  if(!sessionId){show('<div class="panel results-notice"><h2>Selecciona una sesión de clase</h2><p>Crea una sesión en el panel y comparte su código con el alumnado.</p><div class="row"><a class="link-button" href="docente.html" target="_blank" rel="noopener">Abrir panel docente</a><button data-connect>Seleccionar sesión</button></div></div>');return;}
  if(mutation){show('<p class="loading">Actualizando el estado de la pregunta…</p>');return;}
  if(!currentSnapshot){show('<p class="loading">Cargando las respuestas de la sesión…</p>');return;}
  const q=qmap.get(s.questionId);
  if(!isQuestionClosed(q,currentSnapshot)){show(closeRequiredHTML(q,currentSnapshot));return;}
  show(resultHTML(q,currentSnapshot));
 }
 async function checkTeacher(){
  try{
   api=api||HilosAPI.create('teacher');const session=await api.session();teacher=Boolean(session&&await api.rpc('hilos_am_teacher'));
   if(!teacher){switchSession('');snapshot=null;revealed.clear();projectionGroup='';questionErrors.clear();sessions=[];$('session-indicator').textContent='';return;}
   sessions=await api.rpc('hilos_teacher_sessions');const preferred=U.getStored('hilos-projection-session','');
   switchSession((sessions.find(s=>s.id===preferred)||sessions.find(s=>s.is_active)||sessions[0])?.id||'');
   $('session-indicator').textContent=sessions.find(s=>s.id===sessionId)?.label||'Sin sesión de clase';
  }catch(e){teacher=false;switchSession('');snapshot=null;revealed.clear();projectionGroup='';questionErrors.clear();sessions=[];$('session-indicator').textContent='';throw e;}
 }
 async function refreshProjection(){
  if(loading){loadAgain=true;return;}loading=true;
  const generation=renderGeneration;let wanted='',requestVersion=dataVersion;
  try{
   await checkTeacher();
   if(teacher&&sessionId){
    wanted=sessionId;requestVersion=dataVersion;
    const response=await api.rpc('hilos_teacher_dashboard',{p_session_id:wanted});
    if(sessionId===wanted&&dataVersion===requestVersion&&teacher){snapshot=response;refreshError='';for(const q of bank){if(!isQuestionClosed(q,response))revealed.delete(questionKey(q.id,wanted));}}
   }else refreshError='';
   if(generation===renderGeneration)paintLive();
  }catch(e){
   if(!wanted||sessionId===wanted&&dataVersion===requestVersion){refreshError=e.message;paintLive();}
  }finally{loading=false;if(loadAgain){loadAgain=false;refreshProjection();}}
 }
 async function connectionDialog(){const d=$('connection-dialog');if(!d.open)d.showModal();U.notice($('connect-message'),'');try{await checkTeacher();$('connect-login').hidden=teacher;$('connect-session').hidden=!teacher;if(teacher){$('projection-session').innerHTML=sessions.map(s=>`<option value="${s.id}">${U.esc(s.label)}${s.is_active?' · Activa':''}</option>`).join('');$('projection-session').value=sessionId;$('select-session-button').disabled=!sessions.length;}}catch(e){U.notice($('connect-message'),e.message,'error');}}
 $('connect-form').addEventListener('submit',async e=>{e.preventDefault();const button=$('connect-login-button');button.disabled=true;try{api=api||HilosAPI.create('teacher');await api.teacherLogin($('connect-email').value.trim(),$('connect-password').value);$('connect-password').value='';await connectionDialog();await refreshProjection();}catch(error){U.notice($('connect-message'),error.message,'error');}finally{button.disabled=false;}});
 $('select-session-button').addEventListener('click',()=>{const selected=$('projection-session').value;U.store('hilos-projection-session',selected);switchSession(selected);$('connection-dialog').close();refreshProjection();});$('close-connect').addEventListener('click',()=>$('connection-dialog').close());$('connect-button').addEventListener('click',connectionDialog);
 $('prev-slide').addEventListener('click',()=>go(index-1));$('next-slide').addEventListener('click',()=>go(index+1));
 $('slide-area').addEventListener('click',async e=>{
  const copy=e.target.closest('[data-copy-code]');
  if(copy){try{await navigator.clipboard.writeText(copy.parentElement.querySelector('code').textContent);copy.textContent='Copiado';}catch{copy.textContent='Selecciona el código';}return;}
  if(e.target.closest('[data-connect]')){connectionDialog();return;}
  if(e.target.closest('[data-refresh-results]')){refreshProjection();return;}
  const q=qmap.get(slides[index].questionId);
  if(e.target.closest('[data-reveal-solution]')){
   if(!q||!teacher||!sessionId||mutation)return;
   const wanted=sessionId,key=questionKey(q.id,wanted);
   if(snapshot?.session.id!==wanted||!isQuestionClosed(q,snapshot)){
    if(!await closeQuestion(q))return;
    if(sessionId!==wanted||slides[index].questionId!==q.id)return;
   }
   revealed.has(key)?revealed.delete(key):revealed.add(key);paintLive();return;
  }
  if(e.target.closest('[data-close-current]')){await closeQuestion(q);return;}
  if(e.target.id==='open-question-block'&&q&&teacher&&sessionId&&!mutation){
   const wanted=sessionId,key=questionKey(q.id,wanted),b=snapshot?.session.id===wanted?snapshot.blocks.find(b=>b.id===q.block):null;
   if(!b){refreshProjection();return;}
   mutation=true;revealed.delete(key);questionErrors.delete(key);invalidateSnapshot();paintLive();
   try{
    if(!b.is_open)await api.rpc('hilos_set_block',{p_session_id:wanted,p_block_id:q.block,p_is_open:true,p_reveal:false});
    if(sessionId!==wanted)return;
    if(b.closed_questions?.includes(q.id))await api.rpc('hilos_set_question',{p_session_id:wanted,p_question_id:q.id,p_is_open:true});
    questionErrors.delete(key);
   }catch(error){if(sessionId===wanted)questionErrors.set(key,{action:'open',message:error.message});}
   finally{mutation=false;if(sessionId===wanted){invalidateSnapshot();paintLive();await refreshProjection();}else paintLive();}
  }
 });
 $('slide-area').addEventListener('change',e=>{if(e.target.id==='projection-group'){projectionGroup=e.target.value;paintLive();}});
 function renderIndex(){const needle=$('index-search').value.trim().toLowerCase();$('toc-list').innerHTML=deck.blocks.map(b=>{const matching=slides.map((s,i)=>({s,i})).filter(({s})=>s.block===b.id&&(!needle||(s.title+' '+b.title+' '+s.phase).toLowerCase().includes(needle)));return matching.length?`<section class="toc-block"><h3>${b.id.slice(1)} · ${U.esc(b.title)}</h3>${matching.map(({s,i})=>`<button data-goto="${i}" class="${i===index?'current':''}">${i+1}. ${U.esc(s.title)}${s.kind==='results'?' · Resultados':''}</button>`).join('')}</section>`:'';}).join('');}
 $('index-button').addEventListener('click',()=>{renderIndex();$('index-dialog').showModal();$('index-search').focus();});$('close-index').addEventListener('click',()=>$('index-dialog').close());$('index-search').addEventListener('input',renderIndex);$('toc-list').addEventListener('click',e=>{const b=e.target.closest('[data-goto]');if(b){$('index-dialog').close();go(Number(b.dataset.goto));}});
 $('fullscreen-button').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('fullscreen-button').textContent='Usa F11';}});
 document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.target.closest('input,textarea,select,button')||e.altKey||e.ctrlKey||e.metaKey)return;if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();go(index+1);}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(index-1);}if(e.key==='Home'){e.preventDefault();go(0);}if(e.key==='End'){e.preventDefault();go(slides.length-1);}});
 window.addEventListener('hashchange',()=>{const m=location.hash.match(/diapositiva-(\d+)/);if(m){index=Math.max(0,Math.min(slides.length-1,Number(m[1])-1));render();}});window.addEventListener('storage',e=>{if(e.key==='hilos-projection-session'){switchSession(U.getStored('hilos-projection-session',''));refreshProjection();}});document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshProjection();});
 function initializeSimulations(){const race=document.querySelector('[data-race]');if(race){let step=0;const unlocked=[[10,'A lee 10 y conserva su copia.'],[10,'B lee también 10, antes de que A escriba.'],[11,'A escribe su copia + 1: el contador queda en 11.'],[11,'B escribe su copia + 1: vuelve a escribir 11. Se ha perdido una actualización.']];const locked=[[10,'A adquiere el candado y lee 10. B espera para entrar.'],[11,'A escribe 11 y libera el candado.'],[11,'B adquiere el candado y lee el nuevo valor: 11.'],[12,'B escribe 12 y libera el candado. Se conservan las dos actualizaciones.']];const reset=()=>{step=0;race.querySelector('[data-race-value]').textContent='10';race.querySelector('[data-race-message]').textContent='Dos trabajadores quieren sumar uno. Sigue una intercalación posible.';race.querySelector('[data-race-next]').disabled=false;};race.querySelector('[data-race-lock]').addEventListener('change',reset);race.querySelector('[data-race-reset]').addEventListener('click',reset);race.querySelector('[data-race-next]').addEventListener('click',()=>{const rows=race.querySelector('[data-race-lock]').checked?locked:unlocked;const [value,message]=rows[step++];race.querySelector('[data-race-value]').textContent=value;race.querySelector('[data-race-message]').textContent=message;if(step===rows.length)race.querySelector('[data-race-next]').disabled=true;});}
 const queue=document.querySelector('[data-queue]');if(queue){let waiting=['A','B','C'],working=null,pending=3;const paint=msg=>{queue.querySelector('[data-queue-items]').innerHTML=waiting.map(x=>`<span class="job">${x}</span>`).join('')||'<span class="muted">Cola vacía</span>';queue.querySelector('[data-queue-working]').textContent=working||'ninguno';queue.querySelector('[data-queue-pending]').textContent=pending;queue.querySelector('[data-queue-message]').textContent=msg;queue.querySelector('[data-queue-get]').disabled=Boolean(working)||!waiting.length;queue.querySelector('[data-queue-done]').disabled=!working;};queue.querySelector('[data-queue-get]').addEventListener('click',()=>{working=waiting.shift();paint(waiting.length?'El trabajo sale de la cola. El contador de pendientes todavía no cambia.':'La cola está vacía, pero aún hay un trabajo en curso. queue.join() seguiría esperando.');});queue.querySelector('[data-queue-done]').addEventListener('click',()=>{working=null;pending--;paint(pending?'Trabajo confirmado: queda menos trabajo pendiente.':'Todos los trabajos tienen task_done(): queue.join() puede continuar.');});queue.querySelector('[data-queue-reset]').addEventListener('click',()=>{waiting=['A','B','C'];working=null;pending=3;paint('get() retira un elemento. task_done() confirma que se ha terminado.');});}}
 const m=location.hash.match(/diapositiva-(\d+)/);index=m?Math.max(0,Math.min(slides.length-1,Number(m[1])-1)):0;render();refreshProjection();setInterval(()=>{if(!document.hidden&&['question','results'].includes(slides[index].kind))refreshProjection();},6000);
 window.HilosDeckDebug={slideCount:slides.length,slides,renderResult:resultHTML};
})();
