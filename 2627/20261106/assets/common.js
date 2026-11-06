/* Utilidades compartidas. Ninguna clave de corrección se incluye aquí. */
(function(){
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function text(v){return esc(v).replace(/`([^`]+)`/g,'<code>$1</code>');}
  function formatDate(v){return v?new Intl.DateTimeFormat('es-ES',{dateStyle:'short',timeStyle:'short'}).format(new Date(v)):'—';}
  function scoreLabel(score,max){return score===null||score===undefined?'Pendiente':`${Number(score).toLocaleString('es-ES',{maximumFractionDigits:2})} / ${Number(max).toLocaleString('es-ES')}`;}
  function answerText(q,answer){
    if(!answer)return 'Sin respuesta';
    if(q?.type==='mcq'){const o=q.options?.find(o=>o.id===answer.choice);return o?`${o.id.toUpperCase()}. ${o.text}`:String(answer.choice??'');}
    if(q?.type==='blank')return (q.blanks||[]).map(b=>`${b.label}: ${answer.values?.[b.id]??'—'}`).join(' · ');
    return String(answer.text??'');
  }
  function solutionText(q,key){
    if(!key)return '';
    if(q.type==='mcq'){const opt=q.options?.find(o=>o.id===key.correctOption);return opt?`${opt.id.toUpperCase()}. ${opt.text}`:'';}
    if(q.type==='blank')return (q.blanks||[]).map(b=>`${b.label}: ${(key.accepted?.[b.id]||[]).join(' / ')}`).join(' · ');
    return key.modelAnswer||'';
  }
  function csvCell(value){let s=String(value??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
  function downloadCSV(name,rows){const csv='\uFEFF'+rows.map(r=>r.map(csvCell).join(';')).join('\r\n');download(name,new Blob([csv],{type:'text/csv;charset=utf-8'}));}
  function download(name,blob){const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);}
  function getStored(key,fallback=null){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
  function store(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
  function notice(el,message,kind=''){el.textContent=message;el.className=message?`banner ${kind}`:'hidden';}
  function questionCode(q){return q.code?'<pre><code>'+esc(q.code.replace(/\{\{(\w+)\}\}/g,(_,id)=>`[${id}] ________`))+'</code></pre>':'';}
  window.HilosUI={esc,text,formatDate,scoreLabel,answerText,solutionText,downloadCSV,getStored,store,notice,questionCode};
})();
