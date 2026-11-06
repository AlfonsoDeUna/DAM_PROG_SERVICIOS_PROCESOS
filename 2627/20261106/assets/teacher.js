(function(){
  'use strict';
  const U=window.HilosUI,$=id=>document.getElementById(id),questions=window.HILOS_QUESTIONS.questions;
  let api,sessionId='',data=null,blockId='b01',sessions=[],view='students',authorized=false;
  let fetching=false,mutating=false,refreshQueued=false,scopeVersion=0,sessionsRequest=0,transientMessage=false;
  const questionById=new Map(questions.map(q=>[q.id,q]));
  function filteredStudents(){
    const group=$('group-filter').value,name=$('name-filter').value.trim().toLocaleLowerCase('es');
    return(data?.students||[]).filter(s=>(!group||s.group_name===group)&&(!name||s.display_name.toLocaleLowerCase('es').includes(name)));
  }
  function scopedQuestions(){return questions.filter(q=>q.block===blockId);}
  function relevantResponses(){
    const ids=new Set(filteredStudents().map(s=>s.user_id)),qids=new Set(scopedQuestions().map(q=>q.id));
    return(data?.responses||[]).filter(r=>ids.has(r.user_id)&&qids.has(r.question_id));
  }
  function badge(r){
    if(!r)return'<span class="pill">Sin responder</span>';
    const full=Number(r.score)>=Number(r.max_points);
    return `<span class="pill ${full?'ok':Number(r.score)>0?'partial':'bad'}">${full?'✓':Number(r.score)>0?'◐':'✕'} ${U.scoreLabel(r.score,r.max_points)}</span>`;
  }
  function dashboardNotice(message,kind='',transient=false){
    transientMessage=transient;U.notice($('dashboard-message'),message,kind);
  }
  function activeError(error,prefix=''){
    const target=$('dashboard-view').hidden?$('login-message'):$('dashboard-message');
    if(target===$('dashboard-message'))dashboardNotice(prefix+error.message,'error');
    else U.notice(target,prefix+error.message,'error');
  }
  function syncMutationControls(){
    $('session-select').disabled=mutating;
    $('new-session').disabled=mutating;
    $('copy-student-link').disabled=!data||data.session.id!==sessionId;
    $('export-csv').disabled=!data||data.session.id!==sessionId;
  }
  function clearSessionView(){
    const selected=sessions.find(s=>s.id===sessionId);
    $('teacher-session-code').textContent=selected?.code||'—';
    $('session-meta').textContent=sessionId?'Cargando la sesión seleccionada…':'Todavía no hay sesiones';
    $('refresh-status').textContent='';
    for(const id of ['block-controls','stats','teacher-blocks','students-panel','questions-panel'])$(id).innerHTML='';
    $('group-filter').innerHTML='<option value="">Todos los grupos</option>';
    syncMutationControls();
  }
  function renderStats(){
    const st=filteredStudents(),rs=relevantResponses(),q=scopedQuestions(),full=rs.filter(r=>Number(r.score)>=Number(r.max_points)).length;
    const answered=new Set(rs.map(r=>r.user_id)).size;
    const values=[[st.length,'Alumnos inscritos'],[answered,'Han respondido'],[`${rs.length} / ${st.length*q.length}`,'Respuestas registradas'],[rs.length?Math.round(full/rs.length*100)+'%':'—','Respuestas completas correctas']];
    $('stats').innerHTML=values.map(([v,label])=>`<div class="stat"><strong>${U.esc(v)}</strong><span>${label}</span></div>`).join('');
  }
  function renderStudents(){
    const st=filteredStudents(),qs=scopedQuestions(),rs=relevantResponses(),map=new Map(rs.map(r=>[r.user_id+'|'+r.question_id,r]));
    if(!st.length){$('students-panel').innerHTML='<div class="panel empty">Todavía no hay alumnado en esta vista.</div>';return;}
    $('students-panel').innerHTML=`<div class="table-wrap"><table><thead><tr><th>Alumno/a</th><th>Grupo</th>${qs.map((q,i)=>`<th title="${U.esc(q.prompt)}">P${i+1}</th>`).join('')}<th>Total</th></tr></thead><tbody>${st.map(s=>{
      const result=qs.map(q=>map.get(s.user_id+'|'+q.id));
      const total=result.reduce((sum,r)=>sum+Number(r?.score||0),0);
      return `<tr><td><button class="name-button" data-student="${s.user_id}">${U.esc(s.display_name)}</button></td><td>${U.esc(s.group_name)}</td>${result.map(r=>`<td>${badge(r)}</td>`).join('')}<td><strong>${U.scoreLabel(total,qs.reduce((n,q)=>n+q.maxPoints,0))}</strong></td></tr>`;
    }).join('')}</tbody></table></div><p class="small-text muted">Pulsa un nombre para ver lo que escribió. Los huecos admiten puntuación parcial.</p>`;
  }
  function renderQuestions(){
    if(!data){$('questions-panel').innerHTML='';return;}
    const students=filteredStudents(),rs=relevantResponses(),keys=new Map((data.keys||[]).map(k=>[k.question_id,k]));
    const block=data.blocks.find(b=>b.id===blockId);
    const openedSolutions=new Set(Array.from($('questions-panel').querySelectorAll('details[open]')).map(el=>el.dataset.solution));
    $('questions-panel').innerHTML=scopedQuestions().map((q,i)=>{
      const answers=rs.filter(r=>r.question_id===q.id),key=keys.get(q.id);
      const individuallyClosed=(block?.closed_questions||[]).includes(q.id);
      const mayReopen=Boolean(!mutating&&data.session.is_active&&data.session.id===sessionId&&block?.is_open&&!block.reveal_answers&&individuallyClosed);
      let distribution='';
      if(q.type==='mcq'){
        distribution=q.options.map(o=>{const count=answers.filter(r=>r.answer.choice===o.id).length;return `<div class="metric-row"><span>${U.esc(o.id.toUpperCase())}. ${U.text(o.text)}</span><div class="bar-track"><div class="bar-fill ${key?.correctOption===o.id?'correct':''}" style="width:${answers.length?count/answers.length*100:0}%"></div></div><strong>${count}</strong></div>`;}).join('');
      }else{
        const rows=new Map();answers.forEach(r=>{const label=U.answerText(q,r.answer);rows.set(label,(rows.get(label)||0)+1);});
        distribution=[...rows].sort((a,b)=>b[1]-a[1]).map(([answer,count])=>`<div class="row between"><code class="answer-text">${U.esc(answer)}</code><span class="pill">${count}</span></div>`).join('')||'<p class="muted">Sin respuestas todavía.</p>';
      }
      const questionState=individuallyClosed?'Pregunta cerrada':block?.is_open&&!block.reveal_answers&&data.session.is_active?'Admite respuestas':'Bloque cerrado';
      return `<article class="panel"><div class="row between"><div class="eyebrow">Pregunta ${i+1} · ${answers.length} de ${students.length} respuestas</div><div class="row"><span class="pill">${questionState}</span><button class="small" data-reopen-question="${q.id}" ${mayReopen?'':'disabled'}>Reabrir pregunta</button></div></div><h3>${U.text(q.prompt)}</h3>${q.context?`<p class="muted">${U.text(q.context)}</p>`:''}${U.questionCode(q)}${distribution}${key?`<details data-solution="${q.id}" style="margin-top:1rem" ${openedSolutions.has(q.id)?'open':''}><summary>Ver solución y explicación</summary><p><strong>${U.text(U.solutionText(q,key))}</strong></p><p>${U.text(key.explanation)}</p></details>`:''}<div class="table-wrap" style="margin-top:1rem"><table><thead><tr><th>Alumno/a</th><th>Respuesta</th><th>Resultado</th></tr></thead><tbody>${students.map(s=>{
        const r=answers.find(r=>r.user_id===s.user_id);
        return `<tr><td>${U.esc(s.display_name)}</td><td class="answer-text">${U.text(U.answerText(q,r?.answer))}</td><td>${badge(r)}</td></tr>`;
      }).join('')}</tbody></table></div></article>`;
    }).join('');
  }
  function renderControls(){
    if(!data){$('block-controls').innerHTML='';return;}
    const b=data.blocks.find(b=>b.id===blockId);if(!b){$('block-controls').innerHTML='';return;}
    const unavailable=mutating||!data.session.is_active||data.session.id!==sessionId;
    $('block-controls').innerHTML=`<div class="row between"><div><h2>${U.esc(b.title)}</h2><span class="pill ${b.is_open?'ok':''}">${b.reveal_answers?'Cerrado · Soluciones visibles':b.is_open?'Abierto para responder':'Cerrado'}</span></div><div class="row"><button data-control="open" ${unavailable?'disabled':''}>Abrir bloque</button><button data-control="close" ${unavailable?'disabled':''}>Cerrar bloque</button><button data-control="reveal" ${unavailable?'disabled':''}>Cerrar y mostrar soluciones</button></div></div><p class="small-text muted" style="margin-top:1rem">En la presentación, cada pregunta va seguida de sus resultados. Mostrar soluciones permite que el alumnado consulte también su corrección.</p>`;
  }
  function render(){
    if(!data||data.session.id!==sessionId)return;
    $('teacher-session-code').textContent=data.session.code;
    $('session-meta').textContent=(data.session.is_active?'Sesión activa':'Historial · Sesión cerrada')+' · '+U.formatDate(data.session.created_at);
    const group=$('group-filter').value,groups=[...new Set(data.students.map(s=>s.group_name))].sort();
    $('group-filter').innerHTML='<option value="">Todos los grupos</option>'+groups.map(g=>`<option value="${U.esc(g)}">${U.esc(g)}</option>`).join('');
    $('group-filter').value=groups.includes(group)?group:'';
    if(!data.blocks.some(b=>b.id===blockId))blockId=data.blocks[0]?.id||'';
    $('teacher-blocks').innerHTML=data.blocks.map((b,i)=>`<button data-block="${b.id}" class="${b.id===blockId?'active':''}" aria-pressed="${b.id===blockId}">${String(i+1).padStart(2,'0')} ${U.esc(b.title)}</button>`).join('');
    renderControls();renderStats();renderStudents();renderQuestions();syncMutationControls();
  }
  function drainRefresh(){
    if(refreshQueued&&!fetching&&!mutating&&authorized&&sessionId&&!document.hidden){refreshQueued=false;void refresh();}
  }
  async function refresh(){
    if(!authorized||!sessionId||document.hidden)return;
    if(fetching||mutating){refreshQueued=true;return;}
    fetching=true;
    const requestedSession=sessionId,requestedVersion=scopeVersion;
    try{
      const next=await api.rpc('hilos_teacher_dashboard',{p_session_id:requestedSession});
      if(!authorized||sessionId!==requestedSession||scopeVersion!==requestedVersion||mutating){refreshQueued=Boolean(authorized&&sessionId);return;}
      if(next?.session?.id!==requestedSession)throw new Error('La actualización no corresponde a la sesión seleccionada.');
      data=next;render();
      $('refresh-status').textContent='Actualizado a las '+new Date().toLocaleTimeString('es-ES')+' · Actualización automática';
      if(transientMessage)dashboardNotice('');
    }catch(error){
      if(authorized&&sessionId===requestedSession&&scopeVersion===requestedVersion)dashboardNotice('No se ha podido actualizar. '+(data?'Se conserva la última vista de esta sesión. ':'Pulsa «Actualizar» para volver a intentarlo. ')+error.message,'error',true);
    }finally{fetching=false;drainRefresh();}
  }
  function renderSessionOptions(){
    $('session-select').innerHTML=sessions.map(s=>`<option value="${s.id}">${U.esc(s.label)}${s.is_active?' · Activa':''}</option>`).join('');
    $('session-select').value=sessionId;
  }
  function selectSession(nextId){
    ++scopeVersion;sessionId=nextId||'';data=null;
    U.store('hilos-projection-session',sessionId);$('session-select').value=sessionId;clearSessionView();
  }
  async function loadSessions(preferred=''){
    const request=++sessionsRequest;
    const next=await api.rpc('hilos_teacher_sessions');
    if(!authorized||request!==sessionsRequest)return;
    sessions=next;
    const chosen=(sessions.find(s=>s.id===preferred)||sessions.find(s=>s.is_active)||sessions[0])?.id||'';
    selectSession(chosen);renderSessionOptions();
    if(!sessionId)dashboardNotice('Crea una sesión para obtener el código y empezar a recoger respuestas.');
    else await refresh();
  }
  async function enter(){
    authorized=await api.rpc('hilos_am_teacher');if(!authorized)throw new Error('Esta cuenta no tiene autorización docente.');
    $('login-view').hidden=true;$('dashboard-view').hidden=false;$('logout').hidden=false;
    dashboardNotice('Cargando tus sesiones…','',true);
    await loadSessions(U.getStored('hilos-projection-session',''));
  }
  function startMutation(){
    if(mutating){dashboardNotice('Hay una operación en curso. Espera a que termine.');return false;}
    mutating=true;++scopeVersion;dashboardNotice('Aplicando el cambio…','',true);renderControls();renderQuestions();syncMutationControls();return true;
  }
  async function finishMutation(){
    mutating=false;renderControls();renderQuestions();syncMutationControls();
    await refresh();drainRefresh();
  }
  $('login-form').addEventListener('submit',async e=>{
    e.preventDefault();$('login-button').disabled=true;U.notice($('login-message'),'Entrando…');
    try{api=api||HilosAPI.create('teacher');await api.teacherLogin($('teacher-email').value.trim(),$('teacher-password').value);$('teacher-password').value='';await enter();}
    catch(error){activeError(error);}finally{$('login-button').disabled=false;}
  });
  $('logout').addEventListener('click',async()=>{
    authorized=false;++scopeVersion;++sessionsRequest;
    $('dashboard-view').hidden=true;$('login-view').hidden=false;
    try{await api.client.auth.signOut();location.reload();}catch(error){U.notice($('login-message'),error.message,'error');}
  });
  $('session-select').addEventListener('change',()=>{
    if(mutating)return;
    ++sessionsRequest;selectSession($('session-select').value);void refresh();
  });
  $('teacher-blocks').addEventListener('click',e=>{const b=e.target.closest('[data-block]');if(b){blockId=b.dataset.block;render();}});
  $('block-controls').addEventListener('click',async e=>{
    const button=e.target.closest('[data-control]');if(!button||button.disabled||!data||data.session.id!==sessionId||!data.session.is_active)return;
    const action=button.dataset.control,requestedSession=sessionId,requestedBlock=blockId;
    if(!startMutation())return;
    try{
      const changed=await api.rpc('hilos_set_block',{p_session_id:requestedSession,p_block_id:requestedBlock,p_is_open:action==='open',p_reveal:action==='reveal'});
      if(data?.session?.id===requestedSession&&changed?.id){data.blocks=data.blocks.map(b=>b.id===changed.id?{...b,...changed}:b);render();}
    }catch(error){activeError(error);}
    finally{await finishMutation();}
  });
  $('questions-panel').addEventListener('click',async e=>{
    const button=e.target.closest('[data-reopen-question]');if(!button||button.disabled||!data||data.session.id!==sessionId)return;
    const question=questionById.get(button.dataset.reopenQuestion),block=data.blocks.find(b=>b.id===question?.block);
    if(!question||!data.session.is_active||!block?.is_open||block.reveal_answers)return;
    const requestedSession=sessionId;if(!startMutation())return;
    try{
      await api.rpc('hilos_set_question',{p_session_id:requestedSession,p_question_id:question.id,p_is_open:true});
      if(data?.session?.id===requestedSession){
        const current=data.blocks.find(b=>b.id===question.block);
        if(current)current.closed_questions=(current.closed_questions||[]).filter(id=>id!==question.id);
        render();
      }
    }catch(error){activeError(error);}finally{await finishMutation();}
  });
  $('group-filter').addEventListener('change',()=>{if(data){renderStats();renderStudents();renderQuestions();}});
  $('name-filter').addEventListener('input',()=>{if(data){renderStats();renderStudents();renderQuestions();}});
  for(const tab of ['students','questions'])$('tab-'+tab).addEventListener('click',()=>{
    view=tab;$('students-panel').hidden=tab!=='students';$('questions-panel').hidden=tab!=='questions';
    $('tab-students').setAttribute('aria-selected',String(tab==='students'));$('tab-questions').setAttribute('aria-selected',String(tab==='questions'));
  });
  $('students-panel').addEventListener('click',e=>{
    const button=e.target.closest('[data-student]');if(!button||!data)return;
    const s=data.students.find(s=>s.user_id===button.dataset.student);if(!s)return;
    const rows=data.responses.filter(r=>r.user_id===s.user_id);
    $('student-detail-content').innerHTML=`<div class="eyebrow">${U.esc(s.group_name)}</div><h2>${U.esc(s.display_name)}</h2><div class="table-wrap"><table><thead><tr><th>Pregunta</th><th>Respuesta</th><th>Resultado</th></tr></thead><tbody>${questions.map(q=>{
      const r=rows.find(r=>r.question_id===q.id);return `<tr><td>${U.esc(q.id)}<br>${U.text(q.prompt)}</td><td class="answer-text">${U.text(U.answerText(q,r?.answer))}</td><td>${badge(r)}</td></tr>`;
    }).join('')}</tbody></table></div>`;$('student-detail').showModal();
  });
  $('close-detail').addEventListener('click',()=>$('student-detail').close());
  $('new-session').addEventListener('click',()=>{if(mutating)return;$('new-session-label').value='2.º DAM · Hilos · '+new Date().toLocaleDateString('es-ES');U.notice($('new-session-message'),'');$('new-session-dialog').showModal();});
  $('cancel-new').addEventListener('click',()=>{if(!mutating)$('new-session-dialog').close();});
  $('new-session-form').addEventListener('submit',async e=>{
    e.preventDefault();if(!startMutation())return;
    const button=e.target.querySelector('button[type=submit]');button.disabled=true;$('cancel-new').disabled=true;
    let created=null;
    try{
      created=await api.rpc('hilos_create_session',{p_label:$('new-session-label').value.trim()});
      // La creación ya está confirmada, aunque una consulta posterior falle.
      sessions=[created,...sessions.filter(s=>s.id!==created.id).map(s=>({...s,is_active:false}))];
      selectSession(created.id);renderSessionOptions();$('new-session-dialog').close();
      dashboardNotice('Sesión creada. Comparte el código y abre el primer bloque.','success');
      try{await loadSessions(created.id);}catch(error){activeError(error,'La sesión se ha creado, pero no se ha podido actualizar la lista. ');}
    }catch(error){
      if(created||!$('new-session-dialog').open)activeError(error);
      else U.notice($('new-session-message'),error.message,'error');
    }finally{button.disabled=false;$('cancel-new').disabled=false;await finishMutation();}
  });
  $('copy-student-link').addEventListener('click',async()=>{
    if(!data||data.session.id!==sessionId)return;
    const url=new URL('alumnado.html',location.href);url.searchParams.set('codigo',data.session.code);
    try{await navigator.clipboard.writeText(url.href);dashboardNotice('Enlace de alumnado copiado.','success');}
    catch{dashboardNotice('Enlace de alumnado: '+url.href);}
  });
  $('export-csv').addEventListener('click',()=>{
    if(!data||data.session.id!==sessionId)return;
    const selected=new Map(filteredStudents().map(s=>[s.user_id,s]));
    const rows=[['Sesión','Código','Alumno','Grupo','Bloque','Pregunta','Enunciado','Respuesta','Puntos','Máximo','Registrada']];
    for(const r of data.responses){
      const s=selected.get(r.user_id),q=questionById.get(r.question_id);if(!s||!q)continue;
      rows.push([data.session.label,data.session.code,s.display_name,s.group_name,q.block,q.id,q.prompt,U.answerText(q,r.answer),r.score,r.max_points,r.submitted_at]);
    }
    U.downloadCSV('respuestas_hilos_'+data.session.code+'.csv',rows);
  });
  $('refresh').addEventListener('click',async()=>{
    if(!authorized)return;
    try{await loadSessions(sessionId||U.getStored('hilos-projection-session',''));}
    catch(error){activeError(error);}
  });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  (async()=>{try{api=HilosAPI.create('teacher');if(await api.session())await enter();}catch(error){activeError(error);}})();
  setInterval(refresh,10000);
})();
