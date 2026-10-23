import { checkOutput } from './checks.js';

const text = (value, max = 50000) => typeof value === 'string' ? value.slice(0, max) : '';
const date = value => typeof value === 'string' && Number.isFinite(Date.parse(value)) ? value : null;
export function freshSession() {
  return { outputs:{base:'',variant:''}, verdicts:{}, activeTrial:'base', reflectionChoice:null, reflectionChecked:false,
    note:'', actualCode:'', prediction:'', predictionQuestion:'', predictionSavedAt:null, predictionTiming:null, hints:0, attempts:0,
    completed:false, completedAt:null, completionEvidence:null, outputHistory:[], ideaHistory:[], simulationHistory:[] };
}
export function freshState(missions) {
  return {version:2,profile:{name:'',group:'',startedAt:null},current:0,updatedAt:new Date().toISOString(),
    finalReflection:{explanation:'',evidence:'',limits:'',transfer:''},
    sessions:Object.fromEntries(missions.map(m=>[m.id,freshSession()]))};
}
export function normaliseState(input, missions) {
  if (!input || ![1,2].includes(input.version) || !input.sessions || typeof input.sessions !== 'object') throw new Error('Esta copia no es un progreso de Pool Lab compatible.');
  const result = freshState(missions);
  result.profile = {name:text(input.profile?.name,80).trim(),group:text(input.profile?.group,80).trim(),startedAt:date(input.profile?.startedAt)};
  result.updatedAt = date(input.updatedAt) || result.updatedAt;
  for (const key of Object.keys(result.finalReflection)) result.finalReflection[key] = text(input.finalReflection?.[key],6000);
  for (const m of missions) {
    const source = input.sessions[m.id];
    if (!source || typeof source !== 'object') continue;
    const s = result.sessions[m.id];
    for (const t of m.trials) {
      s.outputs[t.id] = text(source.outputs?.[t.id]);
      if (source.verdicts?.[t.id] && s.outputs[t.id]) s.verdicts[t.id] = checkOutput(t.check,s.outputs[t.id]);
    }
    s.activeTrial = source.activeTrial === 'variant' ? 'variant' : 'base';
    s.reflectionChoice = Number.isInteger(source.reflectionChoice) && source.reflectionChoice >= 0 && source.reflectionChoice < m.reflection.options.length ? source.reflectionChoice : null;
    s.reflectionChecked = Boolean(source.reflectionChecked && s.reflectionChoice !== null);
    for (const key of ['note','prediction']) s[key] = text(source[key],5000);
    s.predictionQuestion = text(source.predictionQuestion,5000) || (s.prediction.trim() ? text(m.previousPredictionPrompt || m.predictionPrompt,5000) : '');
    s.actualCode = text(source.actualCode);
    s.predictionSavedAt = date(source.predictionSavedAt);
    s.predictionTiming = ['before','after'].includes(source.predictionTiming) ? source.predictionTiming : null;
    s.hints = Math.max(0,Math.min(3,Math.floor(Number(source.hints)||0)));
    s.outputHistory = (Array.isArray(source.outputHistory)?source.outputHistory:[]).filter(x=>x && ['base','variant'].includes(x.trial)).map(x=>{
      const output=text(x.output), verdict=checkOutput(m.trials.find(t=>t.id===x.trial).check,output);
      return {at:date(x.at),trial:x.trial,output,ok:verdict.ok,title:verdict.title,message:verdict.message};
    });
    s.ideaHistory = (Array.isArray(source.ideaHistory)?source.ideaHistory:[]).filter(x=>x && Number.isInteger(x.choice) && x.choice>=0 && x.choice<m.reflection.options.length).map(x=>({
      at:date(x.at),choice:x.choice,ok:x.choice===m.reflection.correct,feedback:m.reflection.feedback?.[x.choice] || m.reflection.explanation
    }));
    s.simulationHistory = (Array.isArray(source.simulationHistory)?source.simulationHistory:[]).filter(x=>x && [1,2,4].includes(x.workers) && [1,6].includes(x.tasks)).map(x=>({
      workers:x.workers,tasks:x.tasks,steps:Math.max(0,Math.min(100,Number(x.steps)||0)),
      completionOrder:Array.isArray(x.completionOrder)?x.completionOrder.slice(0,6).map(v=>typeof v==='number'?v:text(v,100)):[],
      results:Array.isArray(x.results)?x.results.slice(0,6).map(v=>typeof v==='number'?v:text(v,100)):[],at:date(x.at)
    }));
    s.attempts = Math.max(s.outputHistory.length,Math.max(0,Math.min(100000,Number(source.attempts)||0)));
    const latestCorrect = m.trials.every(t=>s.verdicts[t.id]?.ok) && s.reflectionChecked && s.reflectionChoice===m.reflection.correct;
    const pastEvidence = m.trials.every(t=>s.outputHistory.some(x=>x.trial===t.id && x.ok)) && s.ideaHistory.some(x=>x.ok);
    const earned = source.completionEvidence;
    const earnedValid = earned && earned.reflectionChoice===m.reflection.correct && m.trials.every(t=>checkOutput(t.check,text(earned.outputs?.[t.id])).ok);
    if (earnedValid) s.completionEvidence={outputs:Object.fromEntries(m.trials.map(t=>[t.id,text(earned.outputs[t.id])])),reflectionChoice:earned.reflectionChoice,at:date(earned.at)};
    // Preserve a verified milestone from older copies without inventing attempts.
    else if (source.completed===true && latestCorrect) s.completionEvidence={outputs:{...s.outputs},reflectionChoice:s.reflectionChoice,at:date(source.completedAt)};
    s.completed = source.completed === true && Boolean(latestCorrect || pastEvidence || earnedValid);
    s.completedAt = s.completed ? date(source.completedAt) : null;
  }
  const firstPending=missions.findIndex(m=>!result.sessions[m.id].completed);
  result.current=Math.max(0,Math.min(firstPending===-1?missions.length-1:firstPending,Number.isInteger(input.current)?input.current:0));
  return result;
}
export function recordOutput(s,trial,output,verdict) {
  s.outputs[trial]=output; s.verdicts[trial]=verdict;
  if (output.trim()) { s.attempts++; s.outputHistory.push({at:new Date().toISOString(),trial,output,ok:verdict.ok,title:verdict.title,message:verdict.message}); }
}
export function recordIdea(s,m) {
  s.reflectionChecked=true;
  const choice=s.reflectionChoice;
  s.ideaHistory.push({at:new Date().toISOString(),choice,ok:choice===m.reflection.correct,feedback:m.reflection.feedback?.[choice] || m.reflection.explanation});
}
