(function(){
  'use strict';
  const U=window.HilosUI,$=id=>document.getElementById(id),bank=window.HILOS_QUESTIONS.questions;
  let api,active=null,state=null,blockId='',fingerprint='';
  let sending=false,joining=false,refreshing=false,refreshQueued=false,forceQueued=false,scopeVersion=0;
  const sendMessages=new Map();
  const draftKey=sessionId=>`hilos-drafts-${sessionId||active?.session?.id||''}`;
  const drafts=sessionId=>U.getStored(draftKey(sessionId),{});
  function saveDraft(id,value,sessionId){const d=drafts(sessionId);d[id]=value;U.store(draftKey(sessionId),d);}
  function eraseSentDraft(id,value,sessionId){
    const d=drafts(sessionId);
    if(JSON.stringify(d[id])===JSON.stringify(value)){delete d[id];U.store(draftKey(sessionId),d);}
  }
  function messageKey(id,sessionId=active?.session?.id){return `${sessionId}|${id}`;}
  function showJoin(message=''){
    $('join-view').hidden=false;$('activity-view').hidden=true;
    U.notice($('join-message'),message,message?'error':'');
  }
  function chosenAnswers(){return new Map((state?.answers||[]).map(a=>[a.question_id,a]));}
  function choiceFromForm(form,q){
    const fd=new FormData(form);
    if(q.type==='mcq')return {choice:fd.get('choice')||''};
    if(q.type==='blank')return {values:Object.fromEntries(q.blanks.map(b=>[b.id,String(fd.get(b.id)||'')]))};
    return {text:String(fd.get('text')||'')};
  }
  function isQuestionOpen(q,block){
    return Boolean(state?.session?.is_active&&block?.is_open&&!block.reveal_answers&&!(block.closed_questions||[]).includes(q.id));
  }
  function lockForms(){
    $('change-session').disabled=sending||joining;
    $('questions').querySelectorAll('form[data-question]').forEach(form=>{
      const q=bank.find(item=>item.id===form.dataset.question);
      const block=state?.blocks?.find(item=>item.id===q?.block);
      const disabled=sending||joining||!isQuestionOpen(q||{},block);
      const fieldset=form.querySelector('fieldset');if(fieldset)fieldset.disabled=disabled;
      const button=form.querySelector('button[type=submit]');if(button)button.disabled=disabled;
    });
  }
  function renderQuestions(){
    const block=(state?.blocks||[]).find(b=>b.id===blockId);
    if(!block){$('block-description').innerHTML='';$('questions').innerHTML='';return;}
    const own=chosenAnswers(),local=drafts(),questions=bank.filter(q=>q.block===blockId);
    const blockOpen=Boolean(block.is_open&&state.session?.is_active&&!block.reveal_answers);
    $('block-description').innerHTML=`<div class="row between"><h2>${U.esc(block.title)}</h2><span class="pill ${blockOpen?'ok':''}">${block.reveal_answers?'Soluciones disponibles':blockOpen?'Abierto para responder':'Cerrado'}</span></div>`;
    if(!blockOpen&&!block.reveal_answers&&!questions.some(q=>own.has(q.id)||local[q.id])){
      $('questions').innerHTML='<div class="panel empty">Espera a que el profesor abra este bloque.</div>';return;
    }
    const focused=document.activeElement;
    const focusedForm=focused?.closest?.('form[data-question]');
    const focusSnapshot=focusedForm&&focused.name?{question:focusedForm.dataset.question,name:focused.name,start:focused.selectionStart,end:focused.selectionEnd}:null;
    $('questions').innerHTML=questions.map((q,index)=>{
      const record=own.get(q.id),draft=local[q.id],canAnswer=isQuestionOpen(q,block);
      // Cuando se cierra, la respuesta visible es exactamente la que se corrigió.
      const answer=(canAnswer?draft||record?.answer:record?.answer)||{};
      const disabled=canAnswer?'':'disabled';
      const formDisabled=canAnswer&&!sending&&!joining?'':'disabled';
      let fields='';
      if(q.type==='mcq')fields=q.options.map(o=>`<label class="option"><input type="radio" name="choice" value="${U.esc(o.id)}" ${answer.choice===o.id?'checked':''} ${disabled} required><span class="letter">${U.esc(o.id.toUpperCase())}.</span><span>${U.text(o.text)}</span></label>`).join('');
      else if(q.type==='blank')fields=`<div class="blank-fields">${q.blanks.map(b=>`<div class="field"><label for="${q.id}-${b.id}">${U.esc(b.label)}</label><input id="${q.id}-${b.id}" name="${U.esc(b.id)}" value="${U.esc(answer.values?.[b.id]||'')}" maxlength="500" autocomplete="off" spellcheck="false" ${disabled} required></div>`).join('')}</div>`;
      else fields=`<textarea name="text" maxlength="2000" ${disabled} required>${U.esc(answer.text||'')}</textarea>`;
      const key=record?.solution;
      let feedback='';
      if(block.reveal_answers&&record&&record.score!==undefined){
        const full=Number(record.score)>=Number(record.max_points??q.maxPoints);
        feedback=`<div class="feedback ${full?'':'incorrect'}"><strong>${full?'Correcta':'Para revisar'} · ${U.scoreLabel(record.score,record.max_points??q.maxPoints)}</strong><p>Corrección de tu respuesta registrada.</p>${key?`<p>${U.text(U.solutionText(q,key))}</p><p>${U.text(key.explanation||'')}</p>`:''}</div>`;
      }
      const pendingDraft=!canAnswer&&draft?`<div class="banner"><strong>Borrador local pendiente</strong><p>${U.text(U.answerText(q,draft))}</p><p>Este borrador no sustituye a la respuesta registrada que aparece arriba. Se conserva en este navegador y podrás retomarlo si el profesor reabre la pregunta.</p></div>`:'';
      const savedMessage=sendMessages.get(messageKey(q.id));
      const status=savedMessage?.error?savedMessage.text:canAnswer&&draft?'Cambios pendientes de enviar':savedMessage?.text||(record?'Registrada · '+U.formatDate(record.submitted_at):'Todavía sin respuesta registrada');
      const individuallyClosed=(block.closed_questions||[]).includes(q.id);
      const closedNote=!canAnswer?`<p class="small-text muted">${individuallyClosed?'El profesor ha cerrado esta pregunta.':'El bloque está cerrado.'} ${record?'Se muestra tu respuesta registrada.':'Todavía no consta una respuesta registrada.'}</p>`:'';
      return `<form class="question" data-question="${q.id}"><div class="question-number">${U.esc(blockId.toUpperCase())} · Pregunta ${index+1} de ${questions.length} · ${q.type==='blank'?'Completar huecos':'Tipo test'}</div><h3>${U.text(q.prompt)}</h3>${q.context?`<p class="context">${U.text(q.context)}</p>`:''}${U.questionCode(q)}${closedNote}<fieldset style="border:0;padding:0;margin:0" ${formDisabled}><legend class="sr-only">Tu respuesta</legend>${fields}</fieldset><div class="question-actions">${canAnswer?`<button type="submit" class="primary" ${sending||joining?'disabled':''}>Guardar respuesta</button>`:''}<span class="status" data-save-status role="status" ${savedMessage?.error?'style="color:var(--red)"':''}>${U.esc(status)}</span></div>${feedback}${pendingDraft}</form>`;
    }).join('');
    if(focusSnapshot){
      const form=Array.from($('questions').querySelectorAll('form[data-question]')).find(f=>f.dataset.question===focusSnapshot.question);
      const field=form&&Array.from(form.elements).find(f=>f.name===focusSnapshot.name&&!f.disabled&&f.type!=='radio');
      if(field){field.focus({preventScroll:true});if(typeof field.setSelectionRange==='function'&&focusSnapshot.start!==null){field.setSelectionRange(focusSnapshot.start,focusSnapshot.end);}}
    }
    lockForms();
  }
  function render(){
    if(!active||!state)return;
    $('join-view').hidden=true;$('activity-view').hidden=false;
    $('student-greeting').textContent=`${active.student.display_name} · ${active.student.group_name}`;
    $('activity-title').textContent=state.session?.label||active.session.label;
    $('change-session').disabled=sending||joining;
    if(!state.session?.is_active){
      U.notice($('activity-message'),'Esta sesión ha terminado. Entra con el código de la siguiente sesión. Los borradores locales se conservan en este navegador.');
      $('block-tabs').innerHTML='';$('block-description').innerHTML='';
      $('questions').innerHTML='<div class="panel empty">La sesión está cerrada. Pulsa «Cambiar de sesión» para continuar con otra clase.</div>';
      return;
    }
    U.notice($('activity-message'),'');
    if(!state.blocks.some(b=>b.id===blockId))blockId=state.blocks.find(b=>b.is_open)?.id||state.blocks[0]?.id||'';
    $('block-tabs').innerHTML=state.blocks.map((b,i)=>`<button class="${b.id===blockId?'active':''}" data-block="${b.id}" aria-pressed="${b.id===blockId}">${String(i+1).padStart(2,'0')} ${U.esc(b.title)} ${b.is_open?'●':''}</button>`).join('');
    renderQuestions();
  }
  function drainRefresh(){
    if(refreshQueued&&!refreshing&&!sending&&!joining&&active&&!document.hidden){
      const force=forceQueued;refreshQueued=false;forceQueued=false;void refresh(force);
    }
  }
  async function refresh(force=false){
    if(!active||document.hidden)return;
    if(refreshing||sending||joining){refreshQueued=true;forceQueued=forceQueued||force;return;}
    refreshing=true;
    const requestedSession=active.session.id,requestedVersion=scopeVersion;
    try{
      const next=await api.rpc('hilos_student_state',{p_session_id:requestedSession});
      if(!active||active.session.id!==requestedSession||scopeVersion!==requestedVersion||sending||joining){refreshQueued=Boolean(active);forceQueued=true;return;}
      if(next?.session?.id!==requestedSession)throw new Error('La actualización no corresponde a la sesión actual.');
      const nextFingerprint=JSON.stringify(next);state=next;
      if(force||fingerprint!==nextFingerprint){fingerprint=nextFingerprint;render();}
      $('connection-status').textContent='Conectado · Actualizado a las '+new Date().toLocaleTimeString('es-ES');$('connection-status').style.color='';
    }catch(e){
      if(active?.session?.id===requestedSession&&scopeVersion===requestedVersion){
        $('connection-status').textContent='No se puede actualizar ahora. Tus borradores siguen aquí. '+e.message;$('connection-status').style.color='var(--red)';
        if(!state||$('activity-view').hidden)showJoin(e.message);
      }
    }finally{refreshing=false;drainRefresh();}
  }
  $('join-form').addEventListener('submit',async e=>{
    e.preventDefault();if(joining||sending)return;
    const button=$('join-button'),requestVersion=++scopeVersion;
    joining=true;button.disabled=true;U.notice($('join-message'),'Conectando…');
    try{
      api=api||window.HilosAPI.create('student');await api.ensureStudent();
      const joined=await api.rpc('hilos_join_session',{p_code:$('session-code').value.trim().toUpperCase(),p_name:$('student-name').value.trim(),p_group:$('student-group').value.trim()});
      if(scopeVersion!==requestVersion)return;
      active=joined;U.store('hilos-student-active',active);blockId='';fingerprint='';
      const next=await api.rpc('hilos_student_state',{p_session_id:joined.session.id});
      if(scopeVersion!==requestVersion||active?.session?.id!==joined.session.id)return;
      state=next;fingerprint=JSON.stringify(next);render();
      $('connection-status').textContent='Conectado';
    }catch(error){if(scopeVersion===requestVersion)showJoin(error.message);}
    finally{joining=false;button.disabled=false;lockForms();drainRefresh();}
  });
  $('block-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-block]');if(b){blockId=b.dataset.block;render();}});
  $('questions').addEventListener('input',e=>{
    const form=e.target.closest('form[data-question]');if(!form||sending||joining||!active)return;
    const q=bank.find(q=>q.id===form.dataset.question);if(!q)return;
    saveDraft(q.id,choiceFromForm(form,q));sendMessages.delete(messageKey(q.id));
    const status=form.querySelector('[data-save-status]');status.textContent='Cambios pendientes de enviar';status.style.color='';
  });
  $('questions').addEventListener('submit',async e=>{
    const form=e.target.closest('form[data-question]');if(!form)return;e.preventDefault();
    if(sending||joining||!active)return;
    const q=bank.find(q=>q.id===form.dataset.question),block=state?.blocks?.find(b=>b.id===q?.block);
    if(!q||!isQuestionOpen(q,block)){renderQuestions();return;}
    const requestedSession=active.session.id,payload=choiceFromForm(form,q),status=form.querySelector('[data-save-status]');
    saveDraft(q.id,payload,requestedSession);
    sending=true;++scopeVersion;lockForms();status.textContent='Guardando…';status.style.color='';
    try{
      const result=await api.rpc('hilos_submit_answer',{p_session_id:requestedSession,p_question_id:q.id,p_answer:payload});
      if(!result?.saved)throw new Error('El servidor no ha confirmado que la respuesta esté guardada.');
      eraseSentDraft(q.id,payload,requestedSession);
      sendMessages.set(messageKey(q.id,requestedSession),{text:'Respuesta registrada · '+U.formatDate(result.submitted_at),error:false});
      if(active?.session?.id===requestedSession&&state){
        const saved={question_id:q.id,answer:payload,submitted_at:result.submitted_at};
        state.answers=[...(state.answers||[]).filter(a=>a.question_id!==q.id),saved];fingerprint='';
      }
    }catch(error){sendMessages.set(messageKey(q.id,requestedSession),{text:'No se ha confirmado el envío: '+error.message,error:true});}
    finally{
      sending=false;lockForms();
      if(active?.session?.id===requestedSession&&state)renderQuestions();
      await refresh(true);drainRefresh();
    }
  });
  $('change-session').addEventListener('click',()=>{
    if(sending||joining)return;
    ++scopeVersion;active=null;state=null;blockId='';fingerprint='';refreshQueued=false;forceQueued=false;
    U.store('hilos-student-active',null);showJoin();
  });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  const code=new URLSearchParams(location.search).get('codigo');if(code)$('session-code').value=code;
  (async()=>{
    try{
      api=window.HilosAPI.create('student');const previous=U.getStored('hilos-student-active'),startupVersion=scopeVersion;
      const authSession=await api.session();
      if(previous&&authSession&&scopeVersion===startupVersion&&!joining&&!active){active=previous;++scopeVersion;await refresh(true);}
    }catch(error){showJoin(error.message);}
  })();
  setInterval(()=>refresh(),window.HILOS_CONFIG?.pollMs||6000);
})();
