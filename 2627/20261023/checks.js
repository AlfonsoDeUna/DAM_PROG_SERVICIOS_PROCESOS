/**
 * Comprobaciones de salidas pegadas. No ejecuta Python ni interpreta código.
 * Los enteros se comparan como cadenas normalizadas mediante BigInt para
 * conservar cifras que no caben con precisión en un Number de JavaScript.
 */

const MAX_OUTPUT = 50_000;
const INTEGER = /^[+-]?\d+$/;

function fail(title, message, details) {
  return { ok: false, title, message, ...(details?.length ? { details } : {}) };
}

function pass(message, metrics) {
  return { ok: true, title: "La salida encaja", message, ...(metrics ? { metrics } : {}) };
}

function integer(value) {
  const text = String(value ?? "").trim();
  if (!INTEGER.test(text) || text.length > 1_024) return null;
  try {
    return BigInt(text).toString();
  } catch {
    return null;
  }
}

function expectedList(values) {
  if (!Array.isArray(values)) return null;
  const result = values.map(integer);
  return result.includes(null) ? null : result;
}

function parseList(literal) {
  const content = literal.trim().slice(1, -1).trim();
  if (!content) return [];
  const entries = content.split(",");
  if (entries.at(-1).trim() === "") entries.pop();
  if (entries.some((entry) => entry.trim() === "")) return null;
  const result = entries.map(integer);
  return result.includes(null) ? null : result;
}

function sameList(left, right) {
  return Boolean(left && right && left.length === right.length && left.every((value, i) => value === right[i]));
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findList(text, label = null) {
  const prefix = label
    ? `${escapeRegExp(label)}[ \\t]*:[ \\t]*`
    : "(?:Resultados?[ \\t]*:[ \\t]*)?";
  const pattern = new RegExp(`^[ \\t]*${prefix}(\\[[\\s\\d+,\\-]*\\])[ \\t]*(?=\\n|$)`, "gim");
  const matches = [...text.matchAll(pattern)];
  const last = matches.at(-1);
  return last ? { values: parseList(last[1]), index: last.index } : null;
}

function field(text, labelPattern) {
  const pattern = new RegExp(`^[ \\t]*${labelPattern}[ \\t]*:[ \\t]*(.*?)[ \\t]*$`, "gim");
  const match = [...text.matchAll(pattern)].at(-1);
  return match ? { value: match[1].trim(), index: match.index } : null;
}

function decimal(value) {
  if (value == null) return null;
  const match = String(value).match(/^([+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[+-]?\d+)?)[ \t]*(?:s|segundos?)?$/i);
  if (!match) return null;
  const number = Number(match[1].replace(",", "."));
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function prepare(raw) {
  if (typeof raw !== "string" || !raw.trim()) {
    return { error: fail("Falta tu salida", "Ejecuta el archivo en tu terminal y pega aquí lo que imprime. Puedes incluir el comando con el que lo has lanzado.") };
  }
  if (raw.length > MAX_OUTPUT) {
    return { error: fail("La salida es demasiado larga", "Pega solo la salida de una ejecución de esta prueba, hasta 50.000 caracteres.") };
  }
  const text = raw
    .replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .trim();
  if (/Traceback \(most recent call last\):|\b(?:RuntimeError|AttributeError|TypeError|NameError|SyntaxError|IndentationError|ModuleNotFoundError|ImportError|ValueError|PicklingError|NotImplementedError)\s*:/i.test(text)) {
    if (/bootstrapping|start a new process|__main__|freeze_support/i.test(text)) {
      return { error: fail("Vamos a revisar el arranque", "Python ha mostrado un error. Comprueba que la creación del Pool esté dentro de if __name__ == \"__main__\": y ejecuta el archivo .py completo desde la terminal.", ["Puedes copiar este error con el botón de revisión y traerlo al chat."]) };
    }
    if (/pickle|can't get attribute|cannot get attribute|local object/i.test(text)) {
      return { error: fail("La función no está accesible", "Define la función con def al nivel del archivo, fuera de otras funciones. Guarda el .py y ejecútalo completo desde la terminal.", ["Evita enviar una lambda al Pool en estas misiones."]) };
    }
    return { error: fail("Has encontrado un error de Python", "Este intento contiene un error, así que todavía no podemos comprobar el resultado. Lee la última línea del error o copia la revisión para que lo resolvamos en el chat.") };
  }
  if (/^[ \t]*(?:def[ \t]+\w+[ \t]*\(|from[ \t]+[\w.]+[ \t]+import\b|import[ \t]+[\w.]|if[ \t]+__name__|with[ \t]+(?:\w+\.)?Pool[ \t]*\(|(?:print|range)[ \t]*\()/m.test(text)) {
    return { error: fail("Aquí va la salida de la terminal", "Parece que has pegado código Python. Ejecútalo en tu equipo y pega los mensajes o números que aparecen debajo del comando.") };
  }
  if (/\bNone\b/.test(text)) {
    return { error: fail("La función no está devolviendo un valor", "Veo None en la salida. Comprueba que la función termina con return total: print muestra un mensaje, pero no devuelve ese resultado al programa.") };
  }
  return { text };
}

function checkScalar(check, text) {
  const wanted = integer(check.expected);
  if (wanted === null) return fail("Prueba no disponible", "Esta comprobación no tiene un resultado válido configurado.");
  const matches = [...text.matchAll(/^[ \t]*(?:Resultados?[ \t]*:[ \t]*)?([+-]?\d+)[ \t]*$/gim)];
  const found = matches.at(-1);
  if (!found) return fail("No encuentro el resultado numérico", "Pega la línea con el número que imprime el programa. Puede ir sola o detrás de «Resultado:».");
  if (integer(found[1]) !== wanted) {
    return fail("Todavía no coincide", "La última salida numérica no corresponde a esta prueba. Revisa el número de la llamada, el límite del range y cómo acumulas el resultado.", ["Pega la salida de tu último intento, después de guardar y ejecutar el archivo."]);
  }
  return pass("El resultado que has pegado coincide con el cálculo de esta prueba.");
}

function checkList(check, text) {
  const wanted = expectedList(check.expected);
  if (!wanted) return fail("Prueba no disponible", "Esta comprobación no tiene una lista válida configurada.");
  const found = findList(text);
  if (!found?.values) return fail("Falta la lista de resultados", "Pega la lista que imprime Python, con sus corchetes. También puedes pegar toda la salida de esa ejecución.");
  if (!sameList(found.values, wanted)) {
    return fail("Revisa los datos y su orden", "La última lista de resultados no coincide con esta prueba. Comprueba el cambio pedido y conserva el orden de los datos al comparar.", [`He leído ${found.values.length} resultado${found.values.length === 1 ? "" : "s"}.`]);
  }
  return pass("La lista coincide, tanto en sus valores como en su orden.");
}

function checkTimer(check, text) {
  const count = integer(field(text, "Cantidad de resultados")?.value);
  const first = integer(field(text, "Primer resultado")?.value);
  const elapsed = decimal(field(text, "Tiempo secuencial")?.value);
  const missing = [];
  if (count === null) missing.push("Cantidad de resultados: un entero.");
  if (first === null) missing.push("Primer resultado: un entero.");
  if (elapsed === null) missing.push("Tiempo secuencial: segundos iguales o mayores que cero.");
  if (missing.length) return fail("Pega la medición completa", "Necesito las tres líneas que imprime el programa del cronómetro.", missing);
  if (count !== integer(check.count)) return fail("Revisa cuántas tareas has creado", "La cantidad de resultados no corresponde al número de tareas pedido. Comprueba la repetición de la lista y vuelve a ejecutar.");
  if (first !== integer(check.first)) return fail("Revisa el cálculo de cada tarea", "La cantidad de tareas encaja, pero el primer resultado no corresponde al límite indicado en esta prueba.");
  return pass(elapsed === 0 ? "La cantidad y el cálculo coinciden. El tiempo se ha redondeado a cero; puedes mostrar más decimales para observarlo mejor." : "La cantidad de tareas, el cálculo y la duración tienen el formato esperado. Tu tiempo puede ser diferente en cada ejecución.", { sequential: elapsed, count: Number(count) });
}

function checkPids(check, text) {
  const wanted = expectedList(check.expected);
  const expectedWorkers = Number(check.workers);
  if (!wanted || !Number.isInteger(expectedWorkers) || expectedWorkers < 1) return fail("Prueba no disponible", "Esta comprobación de procesos no está configurada correctamente.");
  const result = findList(text, "Resultados");
  const main = integer(field(text, "PID del proceso principal")?.value);
  const elapsed = decimal(field(text, "Tiempo total")?.value);
  if (!result?.values || main === null || BigInt(main) <= 0n || elapsed === null) {
    return fail("Necesito la traza completa", "Pega desde el PID del proceso principal hasta la lista de resultados y el tiempo total, incluidas las líneas INICIO y FIN.");
  }
  if (!sameList(result.values, wanted)) return fail("La lista final necesita una revisión", "Comprueba los datos y el cálculo de la función. Los PID pueden cambiar, pero la lista final debe conservar los resultados en su orden.");
  const starts = [...text.matchAll(/^[ \t]*INICIO[ \t]*:[ \t]*dato[ \t]+([+-]?\d+)[ \t]*,[ \t]*proceso[ \t]+(\d+)[ \t]*$/gim)];
  const finishes = [...text.matchAll(/^[ \t]*FIN[ \t]*:[ \t]*dato[ \t]+([+-]?\d+)[ \t]*,[ \t]*proceso[ \t]+(\d+)[ \t]*,[ \t]*resultado[ \t]+([+-]?\d+)[ \t]*$/gim)];
  if (starts.length !== wanted.length || finishes.length !== wanted.length) {
    return fail("Faltan líneas de las tareas", "Necesito un INICIO y un FIN por cada dato. Pega la salida completa de una sola ejecución, sin mezclar varios intentos.", [`He leído ${starts.length} inicios y ${finishes.length} finales.`]);
  }
  const startByTask = new Map();
  const finishByTask = new Map();
  for (const match of starts) {
    const task = integer(match[1]);
    if (startByTask.has(task)) return fail("Hay una tarea repetida", "La traza contiene dos inicios para el mismo dato. Comprueba la lista de entrada y pega una sola ejecución.");
    startByTask.set(task, { pid: integer(match[2]), index: match.index });
  }
  for (const match of finishes) {
    const task = integer(match[1]);
    if (finishByTask.has(task)) return fail("Hay una tarea repetida", "La traza contiene dos finales para el mismo dato. Pega una sola ejecución completa.");
    finishByTask.set(task, { pid: integer(match[2]), value: integer(match[3]), index: match.index });
  }
  const workers = new Set();
  for (let i = 0; i < wanted.length; i += 1) {
    const task = String(i + 1);
    const start = startByTask.get(task);
    const finish = finishByTask.get(task);
    if (!start || !finish) return fail("Revisa los datos de entrada", "La traza debe contener una tarea para cada número de la lista indicada en esta misión.");
    if (start.pid !== finish.pid || !start.pid || BigInt(start.pid) <= 0n) return fail("Un PID no encaja", "Una llamada debe empezar y terminar en el mismo proceso. Revisa si has pegado líneas de distintas ejecuciones.");
    if (start.pid === main) return fail("Revisa dónde se ejecuta la tarea", "El PID del trabajador coincide con el principal. Comprueba que estás ejecutando la función mediante pool.map.");
    if (finish.index < start.index) return fail("La traza está incompleta o reordenada", "Para cada dato, su INICIO debe aparecer antes que su FIN. Pega la salida en el orden de la terminal.");
    if (finish.value !== wanted[i]) return fail("Un cálculo no coincide", `Revisa el resultado de la tarea con dato ${task}. Los mensajes deben mostrar la suma calculada para ese dato.`);
    workers.add(start.pid);
  }
  if (workers.size > expectedWorkers || (expectedWorkers === 1 && workers.size !== 1)) {
    return fail("Revisa el número de trabajadores", `En esta traza aparecen ${workers.size} PID de trabajadores. Comprueba el valor de procesos pedido para esta prueba y vuelve a ejecutar.`);
  }
  const after = [...text.matchAll(/^[ \t]*Despu[eé]s de map(?:[ \t]*:|[ \t]+).*$/gim)].at(-1);
  const lastFinish = Math.max(...[...finishByTask.values()].map((event) => event.index));
  if (!after || after.index <= lastFinish || result.index <= after.index) {
    return fail("Comprueba cuándo termina map", "El mensaje «Después de map» debe aparecer después de todos los FIN, y antes de mostrar la lista final.");
  }
  return pass(`La traza es coherente: ${wanted.length} tareas y ${workers.size} trabajador${workers.size === 1 ? " observado" : "es observados"}. Los PID y el reparto pueden variar; map ha entregado la lista en orden.`, { workers: workers.size, count: wanted.length, duration: elapsed });
}

function checkBenchmark(check, text) {
  const count = integer(field(text, "N[uú]mero de tareas")?.value);
  const workers = integer(field(text, "Procesos trabajadores")?.value);
  const first = integer(field(text, "Primer resultado")?.value);
  const equality = field(text, "Resultados iguales")?.value;
  const sequential = decimal(field(text, "Tiempo secuencial")?.value);
  const pool = decimal(field(text, "Tiempo con Pool")?.value);
  const factor = decimal(field(text, "Factor secuencial/Pool")?.value);
  if (equality && !/^true$/i.test(equality)) return fail("Primero deben coincidir las respuestas", "El programa no confirma que ambas versiones produzcan el mismo resultado. Revisa el cálculo y los datos antes de comparar tiempos.");
  const missing = [];
  if (count === null) missing.push("Número de tareas.");
  if (workers === null) missing.push("Procesos trabajadores.");
  if (first === null) missing.push("Primer resultado.");
  if (!equality) missing.push("Resultados iguales.");
  if (sequential === null) missing.push("Tiempo secuencial.");
  if (pool === null) missing.push("Tiempo con Pool.");
  if (factor === null) missing.push("Factor secuencial/Pool.");
  if (missing.length) return fail("Falta parte de la comparación", "Pega la salida completa del programa: necesitamos comprobar el trabajo y registrar tus medidas.", missing);
  if (count !== integer(check.count) || workers !== integer(check.workers)) return fail("Revisa la configuración del experimento", "El número de tareas o de trabajadores no coincide con el pedido en esta prueba. Guarda el cambio y vuelve a ejecutar.");
  if (first !== integer(check.first)) return fail("Revisa el tamaño de cada tarea", "El primer resultado indica un cálculo diferente al pedido. Comprueba el número de la lista datos.");
  const rounded = sequential === 0 || pool === 0 || factor === 0;
  const interpretation = rounded
    ? "Alguna medida se ha redondeado a cero; muestra más decimales (el programa de partida usa seis) para poder interpretarla."
    : factor > 1
      ? "En esta ejecución, el Pool ha empleado menos tiempo."
      : factor < 1
        ? `En esta ejecución, el Pool ha empleado más tiempo${factor < 0.5 ? ` (unas ${Math.round(pool / sequential).toLocaleString("es-ES")} veces el tiempo secuencial)` : ""}; es un resultado válido.`
        : "El factor mostrado es aproximadamente uno: las duraciones son parecidas.";
  return pass(`Los resultados coinciden y la configuración encaja. ${interpretation}`, { sequential, pool, factor, workers: Number(workers), count: Number(count) });
}

function checkDualList(check, text) {
  const wanted = expectedList(check.expected);
  const sequential = findList(text, "Secuencial");
  const pool = findList(text, "Pool");
  const equality = field(text, "Resultados iguales")?.value;
  if (!wanted) return fail("Prueba no disponible", "Esta comprobación no tiene una lista válida configurada.");
  if (!sequential?.values || !pool?.values || !equality) return fail("Necesito las dos versiones", "Pega las líneas «Secuencial: [...]», «Pool: [...]» y «Resultados iguales: True» que imprime el reto.");
  if (!sameList(sequential.values, pool.values) || !/^true$/i.test(equality)) return fail("Las dos versiones todavía no coinciden", "Comprueba que ambas llaman a la misma función y reciben los mismos datos.");
  if (!sameList(sequential.values, wanted)) return fail("Coinciden entre sí, pero revisa el reto", "Ambas versiones dan la misma lista, pero todavía no es el cálculo pedido. Revisa el TODO de la función y los datos de esta prueba.");
  return pass("La versión secuencial y el Pool producen la misma lista, y esa lista resuelve el reto.");
}

/** Validate one trial's pasted terminal output. */
export function checkOutput(check, raw) {
  const prepared = prepare(raw);
  if (prepared.error) return prepared.error;
  if (!check || typeof check !== "object") return fail("Prueba no disponible", "No se ha podido identificar esta comprobación.");
  switch (check.kind) {
    case "scalar": return checkScalar(check, prepared.text);
    case "list": return checkList(check, prepared.text);
    case "timer": return checkTimer(check, prepared.text);
    case "pids": return checkPids(check, prepared.text);
    case "benchmark": return checkBenchmark(check, prepared.text);
    case "dual_list": return checkDualList(check, prepared.text);
    default: return fail("Prueba no disponible", "No reconozco el tipo de comprobación de esta misión.");
  }
}
