// Modelo didáctico de Pool.map. No ejecuta Python ni mide rendimiento real.
const INPUTS = Object.freeze([3, 5, 10, 2, 4, 6]);
const VALUES = Object.freeze([14, 55, 385, 5, 30, 91]);
const DURATIONS = Object.freeze([3, 1, 2, 1, 3, 1]);

export function createPoolModel({workers = 2, tasks = 6} = {}) {
  if (![1, 2, 4].includes(workers) || ![1, 6].includes(tasks)) throw new Error('Configuración no admitida por este modelo.');
  return {
    workers, taskCount: tasks, steps: 0, status: 'ready',
    queue: Array.from({length: tasks}, (_, i) => i),
    slots: Array.from({length: workers}, (_, i) => ({worker: i + 1, task: null, remaining: 0})),
    results: Array(tasks).fill(null), completionOrder: [], finishedAt: Array(tasks).fill(null),
    events: ['Elige cuántas llamadas y trabajadores tendrá el experimento. Antes de empezar, predice cuántos trabajadores podrán trabajar a la vez.']
  };
}

function copyModel(state) {
  return {...state, queue: [...state.queue], slots: state.slots.map(s => ({...s})), results: [...state.results], completionOrder: [...state.completionOrder], finishedAt: [...state.finishedAt], events: []};
}

function distribute(state) {
  for (const slot of state.slots) {
    if (slot.task !== null || state.queue.length === 0) continue;
    slot.task = state.queue.shift();
    slot.remaining = DURATIONS[slot.task];
    state.events.push(`El trabajador ${slot.worker} recibe la tarea ${slot.task + 1}: suma_cuadrados(${INPUTS[slot.task]}).`);
  }
}

export function startPoolModel(state) {
  if (state.status !== 'ready') return state;
  const next = copyModel(state);
  next.status = 'running';
  distribute(next);
  const idle = next.slots.filter(s => s.task === null).length;
  if (idle) next.events.push(`${idle} ${idle === 1 ? 'trabajador queda libre' : 'trabajadores quedan libres'}: no hay suficientes llamadas para ocuparlos. El bucle de una llamada no se divide entre ellos.`);
  else next.events.push('Cada trabajador hace una llamada completa. Las llamadas restantes esperan en la cola.');
  return next;
}

export function stepPoolModel(state) {
  if (state.status !== 'running') return state;
  const next = copyModel(state);
  next.steps += 1;
  for (const slot of next.slots) {
    if (slot.task === null) continue;
    slot.remaining -= 1;
    if (slot.remaining === 0) {
      const task = slot.task;
      next.results[task] = VALUES[task];
      next.finishedAt[task] = next.steps;
      next.completionOrder.push(task + 1);
      next.events.push(`Termina la tarea ${task + 1} en el trabajador ${slot.worker}. Su resultado ${VALUES[task]} se coloca en la posición ${task + 1}.`);
      slot.task = null;
    }
  }
  if (next.results.every(result => result !== null)) {
    next.status = 'done';
    next.events.push(`Todas las llamadas han terminado. Ahora map devuelve la lista completa: [${next.results.join(', ')}].`);
  } else {
    distribute(next);
    if (next.events.length === 0) next.events.push('Las llamadas en curso siguen trabajando. map todavía espera: quedan resultados por reunir.');
  }
  return next;
}

const taskLabel = index => `T${index + 1}`;
let modelCount = 0;

export function mountPoolExplainer(container, {onComplete} = {}) {
  if (!container || typeof container.replaceChildren !== 'function') throw new Error('El modelo necesita un contenedor HTML.');
  const prefix = `pool-model-${++modelCount}`;
  let state = createPoolModel();
  let disposed = false;

  container.innerHTML = `<section class="pool-model" aria-labelledby="${prefix}-title">
    <header class="pool-model__header"><span class="pool-model__eyebrow">OBSERVA EL REPARTO</span><h3 id="${prefix}-title">Una tarea entera. Un trabajador disponible.</h3><p>El proceso principal entrega llamadas al equipo. Recorre el modelo paso a paso y observa quién trabaja, quién espera y dónde queda cada respuesta.</p><p class="pool-model__small">Modelo didáctico · <code>chunksize=1</code> · duraciones inventadas. No ejecuta Python.</p></header>
    <div class="pool-model__controls">
      <label for="${prefix}-workers">Trabajadores<select id="${prefix}-workers" data-model="workers"><option value="1">1 trabajador</option><option value="2" selected>2 trabajadores</option><option value="4">4 trabajadores</option></select></label>
      <label for="${prefix}-tasks">Llamadas independientes<select id="${prefix}-tasks" data-model="tasks"><option value="1">1 tarea</option><option value="6" selected>6 tareas</option></select></label>
    </div>
    <div class="pool-model__actions"><button type="button" data-model-action="start" class="pool-model__primary">Iniciar reparto</button><button type="button" data-model-action="step">Avanzar un paso</button><button type="button" data-model-action="reset" class="pool-model__reset">Reiniciar</button></div>
    <div class="pool-model__counter"><span data-model="step-count">Paso 0</span><span data-model="finished-count">0 de 6 terminadas</span></div>
    <div class="pool-model__stage"><h4>1. Cola de llamadas</h4><p class="pool-model__small">Cada tarjeta representa una llamada completa a <code>suma_cuadrados</code>.</p><div class="pool-model__queue" data-model="queue"></div></div>
    <div class="pool-model__stage"><h4>2. Procesos trabajadores</h4><div class="pool-model__workers" data-model="slots"></div></div>
    <div class="pool-model__stage"><h4>3. Resultados en el orden de entrada</h4><div class="pool-model__results" data-model="results"></div><p class="pool-model__return" data-model="return-state"></p></div>
    <div class="pool-model__finishes"><strong>Orden de finalización</strong><div data-model="finishes"></div></div>
    <div class="pool-model__explanation" role="status" aria-live="polite" aria-atomic="true" data-model="events"></div>
    <details class="pool-model__note"><summary>Qué representa este modelo</summary><p>Es una simulación didáctica: no ejecuta Python. Los pasos y las duraciones son inventados, no segundos ni una predicción de velocidad. Representa un reparto con <code>chunksize=1</code>; Python también puede agrupar llamadas en lotes. Si varias tareas terminan en el mismo paso, aquí se enumeran por trabajador.</p><p>Un trabajador es un proceso, no un núcleo reservado. La aceleración real depende del trabajo, del equipo y del coste de crear procesos y comunicar datos.</p></details>
    <p class="pool-model__challenge"><strong>Compruébalo:</strong> prueba 4 trabajadores con 1 tarea. Después reinicia con 6 tareas. ¿Qué cambia y qué se mantiene?</p>
  </section>`;

  const root = container.querySelector('.pool-model');
  const find = key => root.querySelector(`[data-model="${key}"]`);
  const action = key => root.querySelector(`[data-model-action="${key}"]`);

  function render() {
    if (disposed) return;
    const started = state.status !== 'ready';
    const running = state.status === 'running';
    find('workers').disabled = running;
    find('tasks').disabled = running;
    action('start').disabled = started;
    action('step').disabled = !running;
    find('step-count').textContent = `Paso ${state.steps} · unidades simuladas`;
    find('finished-count').textContent = `${state.completionOrder.length} de ${state.taskCount} terminadas`;
    find('queue').innerHTML = state.queue.length ? state.queue.map(i => `<span class="pool-model__task"><b>${taskLabel(i)}</b><code>f(${INPUTS[i]})</code><small>${DURATIONS[i]} pasos</small></span>`).join('') : '<p class="pool-model__empty">La cola está vacía.</p>';
    find('slots').innerHTML = state.slots.map(slot => {
      const busy = slot.task !== null;
      const percent = busy ? ((DURATIONS[slot.task] - slot.remaining) / DURATIONS[slot.task]) * 100 : 0;
      return `<div class="pool-model__worker${busy ? ' is-busy' : ''}"><span class="pool-model__worker-name">Trabajador ${slot.worker}</span><strong>${busy ? `${taskLabel(slot.task)} · f(${INPUTS[slot.task]})` : 'Libre'}</strong><small>${busy ? `Quedan ${slot.remaining} ${slot.remaining === 1 ? 'paso' : 'pasos'}` : started ? 'Sin tarea asignada' : 'A la espera del reparto'}</small><div class="pool-model__meter" role="progressbar" aria-label="Avance de la tarea del trabajador ${slot.worker}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(percent)}"><i style="width:${percent}%"></i></div></div>`;
    }).join('');
    find('results').innerHTML = state.results.map((result, i) => `<div class="pool-model__result${result !== null ? ' is-ready' : ''}"><small>${taskLabel(i)} · dato ${INPUTS[i]}</small><strong>${result === null ? '…' : result}</strong><span>${result === null ? 'pendiente' : 'recibido'}</span></div>`).join('');
    find('return-state').textContent = state.status === 'done' ? `map devuelve [${state.results.join(', ')}]` : started ? 'Resultados reunidos hasta ahora. map espera a que terminen todas las llamadas.' : 'La posición de cada resultado corresponde a la posición de su dato.';
    find('finishes').innerHTML = state.completionOrder.length ? state.completionOrder.map(task => `<span class="pool-model__finish">T${task}<small>paso ${state.finishedAt[task - 1]}</small></span>`).join('') : '<span class="pool-model__empty">Todavía no ha terminado ninguna tarea.</span>';
    find('events').replaceChildren(...state.events.map(text => {const p = document.createElement('p'); p.textContent = text; return p;}));
  }

  function reset() {
    state = createPoolModel({workers: Number(find('workers').value), tasks: Number(find('tasks').value)});
    render();
  }
  function click(event) {
    const button = event.target.closest('[data-model-action]');
    if (!button || !root.contains(button) || button.disabled) return;
    if (button.dataset.modelAction === 'reset') {reset(); return;}
    if (button.dataset.modelAction === 'start') state = startPoolModel(state);
    if (button.dataset.modelAction === 'step') state = stepPoolModel(state);
    render();
    if (state.status === 'done' && typeof onComplete === 'function') {
      onComplete({workers: state.workers, tasks: state.taskCount, steps: state.steps, completionOrder: [...state.completionOrder], results: [...state.results], at: new Date().toISOString()});
    }
  }
  function change(event) {if (event.target.matches('select[data-model]')) reset();}
  root.addEventListener('click', click);
  root.addEventListener('change', change);
  render();
  return () => {disposed = true; root.removeEventListener('click', click); root.removeEventListener('change', change);};
}
