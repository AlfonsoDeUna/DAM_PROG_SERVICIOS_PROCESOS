// Contenido original en español para el laboratorio de multiprocessing.Pool.
// Los programas se ejecutan como archivos .py en el equipo de quien aprende.
export const missions = [
  {
    "id": "sum",
    "number": 1,
    "title": "La primera señal",
    "shortTitle": "Una función",
    "category": "Fundamentos",
    "minutes": "8–12 min",
    "xp": 100,
    "narrative": "El laboratorio necesita una tarea que podamos entender antes de repartirla. Empieza con un cálculo pequeño y observa cada paso.",
    "goal": "Comprender qué recibe una función, cómo acumula un resultado y qué devuelve.",
    "concepts": [
      {
        "term": "Una llamada, una tarea",
        "text": "suma_cuadrados(5) suma 1² + 2² + 3² + 4² + 5². El número indica hasta dónde llegar."
      },
      {
        "term": "Un acumulador",
        "text": "total empieza en cero. Cada vuelta añade el cuadrado del valor actual."
      },
      {
        "term": "return",
        "text": "Entrega una respuesta al código que llamó a la función. print la muestra en pantalla."
      }
    ],
    "walkthrough": [
      "Crea 01_funcion.py en VS Code y escribe o copia el código de partida.",
      "Guárdalo y ejecuta el comando en la terminal, dentro de esa carpeta.",
      "Pega la salida del programa en la prueba inicial. Después realiza el experimento."
    ],
    "code": "def suma_cuadrados(numero):\n    # Esta variable pertenece a esta llamada de la función.\n    total = 0\n\n    # El extremo final de range no se incluye: +1 permite llegar a numero.\n    for valor in range(1, numero + 1):\n        total = total + valor * valor\n\n    # Devolvemos el resultado para que quien nos llamó pueda utilizarlo.\n    return total\n\n\n# Este bloque solo se ejecuta cuando lanzas el archivo desde la terminal.\n# Ahora es opcional, pero con Pool será obligatorio (lo verás en la misión 4).\nif __name__ == \"__main__\":\n    resultado = suma_cuadrados(5)\n    print(resultado)\n",
    "fileName": "01_funcion.py",
    "command": "python 01_funcion.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Ejecuta la función con el valor 5. Pega el número que aparece en tu terminal.",
        "change": null,
        "check": {
          "kind": "scalar",
          "expected": "55"
        },
        "hint": "No calculas solo 5 × 5: sumas los cuadrados desde 1 hasta 5.",
        "success": "La salida coincide: tu función acumula todos los cuadrados del 1 al 5."
      },
      {
        "id": "variant",
        "label": "Experimento",
        "prompt": "Cambia únicamente el argumento de la llamada: de 5 a 3. Guarda, ejecuta y pega la nueva salida.",
        "change": "resultado = suma_cuadrados(3)",
        "check": {
          "kind": "scalar",
          "expected": "14"
        },
        "hint": "Recorre mentalmente tres vueltas: añade 1 × 1, después 2 × 2 y después 3 × 3.",
        "success": "Cambio comprobado. El argumento decide cuántas vueltas realiza esta tarea."
      }
    ],
    "reflection": {
      "question": "¿Qué entrega return total a quien llamó a la función?",
      "options": [
        "El valor calculado, que después puede guardarse o utilizarse.",
        "Una orden para imprimir todas las vueltas.",
        "El número de procesos del ordenador."
      ],
      "correct": 0,
      "explanation": "return entrega el valor calculado. La llamada puede guardarlo en resultado; print es quien lo muestra.",
      "feedback": [
        "Correcto: return devuelve el valor de total a la llamada. Puedes guardarlo, compararlo o usarlo en otro cálculo; print es una operación diferente.",
        "Has confundido devolver un valor con mostrarlo. return termina esta llamada y entrega total; no imprime las vueltas. Busca en el programa qué línea muestra resultado en la terminal.",
        "total contiene la suma que ha calculado el bucle. No consulta el hardware ni cuenta procesos. Sigue cómo cambia total para reconocer qué información devuelve."
      ]
    },
    "hints": [
      "Empieza por seguir el valor de total en cada vuelta.",
      "range(1, numero + 1) incluye el valor numero. Comprueba que mantienes ese + 1.",
      "Con 3, el acumulador pasa por 1, después 5 y finalmente 14. return debe estar fuera del bucle."
    ],
    "takeaway": "Una tarea completa es una llamada a la función con un dato concreto.",
    "predictionPrompt": "Antes de cambiar 5 por 3, ¿esperas un resultado mayor o menor? Explica qué vueltas dejará de hacer la función.",
    "evidencePrompt": "Describe qué cambiaste y qué resultado obtuviste. Explica con tus palabras qué hace return y qué hace print."
  },
  {
    "id": "sequence",
    "number": 2,
    "title": "Una detrás de otra",
    "shortTitle": "Varias tareas",
    "category": "Fundamentos",
    "minutes": "8–12 min",
    "xp": 100,
    "narrative": "La primera señal funciona. Ahora hay tres solicitudes en espera. Hazlas pasar por la misma función y conserva sus respuestas.",
    "goal": "Reconocer una ejecución secuencial y relacionar cada dato con su resultado.",
    "concepts": [
      {
        "term": "La lista de trabajo",
        "text": "Cada elemento de datos origina una llamada completa a suma_cuadrados."
      },
      {
        "term": "Secuencial",
        "text": "Cada llamada termina antes de que empiece la siguiente. Un único proceso hace todo el trabajo, en el orden de la lista."
      },
      {
        "term": "append",
        "text": "Añade cada respuesta al final de resultados y mantiene la secuencia del recorrido."
      }
    ],
    "walkthrough": [
      "Abre 02_secuencial.py y localiza datos, el for y resultados.append.",
      "Antes de ejecutarlo, relaciona cada dato con una llamada a suma_cuadrados.",
      "Ejecuta el archivo completo y pega la lista obtenida. Después cambia su orden."
    ],
    "code": "def suma_cuadrados(numero):\n    total = 0\n    for valor in range(1, numero + 1):\n        total = total + valor * valor\n    return total\n\n\nif __name__ == \"__main__\":\n    # Cada elemento representa una llamada independiente a la función.\n    datos = [3, 5, 10]\n    resultados = []\n\n    for numero in datos:\n        # Esta llamada termina antes de empezar la siguiente vuelta del for.\n        resultado = suma_cuadrados(numero)\n        resultados.append(resultado)\n\n    print(resultados)\n",
    "fileName": "02_secuencial.py",
    "command": "python 02_secuencial.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Ejecuta el programa con datos = [3, 5, 10] y pega su lista de resultados.",
        "change": null,
        "check": {
          "kind": "list",
          "expected": [
            "14",
            "55",
            "385"
          ]
        },
        "hint": "La primera respuesta corresponde a 3; la segunda, a 5; la tercera, a 10.",
        "success": "Las tres respuestas están en su sitio. Has resuelto tres tareas secuenciales."
      },
      {
        "id": "variant",
        "label": "Experimento",
        "prompt": "Reordena la entrada como [10, 3, 5]. Guarda, ejecuta y pega la lista nueva.",
        "change": "datos = [10, 3, 5]",
        "check": {
          "kind": "list",
          "expected": [
            "385",
            "14",
            "55"
          ]
        },
        "hint": "No cambies la función. La respuesta de 10 debe ocupar ahora la primera posición.",
        "success": "Orden comprobado. Al cambiar los datos de posición, sus respuestas también cambian de posición."
      }
    ],
    "reflection": {
      "question": "¿Cuántas tareas completas representa datos = [3, 5, 10]?",
      "options": [
        "Dieciocho: una por cada vuelta de los bucles interiores.",
        "Tres: una llamada a la función por cada elemento.",
        "Una: toda la lista se entrega como un solo número."
      ],
      "correct": 1,
      "explanation": "Son tres llamadas completas. Las 18 vueltas de los bucles son el trabajo interno que suman esas tareas.",
      "feedback": [
        "Has contado las vueltas internas como si fueran tareas del recorrido exterior. Aquí se realizan tres llamadas completas; sus bucles suman 18 vueltas en total. Una tarea puede contener muchas operaciones.",
        "Correcto: hay tres elementos y el bucle exterior hace una llamada por elemento. Dentro de cada llamada se realizan las vueltas necesarias para su dato.",
        "El bucle exterior recorre la lista y entrega un número distinto en cada llamada. La función no recibe toda la lista junta: comprueba qué valor toma numero en cada vuelta."
      ]
    },
    "hints": [
      "Separa dos ideas: la cantidad de elementos de la lista y las vueltas del cálculo.",
      "El for exterior decide qué llamada realizar. El for interior calcula una respuesta.",
      "Para [10, 3, 5], las llamadas son suma_cuadrados(10), suma_cuadrados(3) y suma_cuadrados(5)."
    ],
    "takeaway": "Una lista de tres datos ofrece tres tareas; las vueltas interiores pertenecen a cada tarea.",
    "predictionPrompt": "Si cambias el orden de los datos, ¿cambiarán los valores calculados, su posición o ambas cosas? Justifica tu predicción.",
    "evidencePrompt": "Relaciona cada dato con su resultado en las dos pruebas. Distingue el número de llamadas del número de vueltas que realizan sus bucles."
  },
  {
    "id": "timer",
    "number": 3,
    "title": "Toma el tiempo",
    "shortTitle": "Medir duraciones",
    "category": "Observación",
    "minutes": "10–15 min",
    "xp": 100,
    "narrative": "Ahora construyes tú el cronómetro. Parte de lo que ya sabes, decide dónde medir y consigue una referencia antes de repartir el trabajo.",
    "goal": "Programar una medición propia y distinguir cantidad de tareas, trabajo por tarea y duración.",
    "concepts": [
      {
        "term": "perf_counter",
        "text": "Dos lecturas de este reloj permiten medir una duración: resta la inicial a la final. El valor aislado no es el tiempo que ha tardado tu programa."
      },
      {
        "term": "Cantidad y tamaño",
        "text": "La prueba inicial tiene ocho llamadas. En cada una se suman los cuadrados desde uno hasta un millón. Son dos decisiones distintas: cuántas llamadas y cuánto calcula cada una."
      },
      {
        "term": "Comparación controlada",
        "text": "Mide el mismo bloque y cambia una variable cada vez. La carga del equipo introduce variación; repetir ayuda a interpretar las diferencias."
      }
    ],
    "walkthrough": [
      "Crea 03_cronometro.py y recupera la función de suma de cuadrados que ya has trabajado. En esta misión escribes tú el programa.",
      "Prepara ocho tareas iguales, ejecútalas secuencialmente y mide el recorrido completo siguiendo las especificaciones.",
      "Comprueba la primera salida. Después duplica solo la cantidad de tareas y explica qué se conserva y qué cambia."
    ],
    "code": "",
    "fileName": "03_cronometro.py",
    "command": "python 03_cronometro.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Ejecuta tu programa con ocho tareas, cada una hasta un millón. Pega las tres líneas con las etiquetas indicadas en el encargo.",
        "change": null,
        "check": {
          "kind": "timer",
          "count": 8,
          "first": "333333833333500000"
        },
        "hint": "Copia la salida completa. El tiempo puede variar; la cantidad y el resultado matemático deben coincidir.",
        "success": "Medida registrada. Tienes una referencia de ocho cálculos completos en secuencial."
      },
      {
        "id": "variant",
        "label": "Experimento",
        "prompt": "Duplica la cantidad de tareas: ahora deben ser dieciséis. Mantén un millón como límite de cada cálculo y pega las tres líneas nuevas.",
        "change": "Dieciséis llamadas. El mismo cálculo en cada una. El mismo bloque cronometrado.",
        "check": {
          "kind": "timer",
          "count": 16,
          "first": "333333833333500000"
        },
        "hint": "Ahora hay dieciséis tareas. El primer resultado debe mantenerse porque cada cálculo sigue llegando al mismo número.",
        "success": "Has duplicado las tareas sin cambiar el cálculo de cada una. Compara tus dos tiempos."
      }
    ],
    "reflection": {
      "question": "Al pasar de ocho a dieciséis tareas y conservar un millón como límite de cada cálculo, ¿qué cambia?",
      "options": [
        "Cada tarea suma hasta dieciséis millones.",
        "Se crean automáticamente dieciséis procesos.",
        "Se realizan dieciséis llamadas; cada una sigue llegando a un millón."
      ],
      "correct": 2,
      "explanation": "La repetición de la lista cambia la cantidad de llamadas. No modifica el límite de cada cálculo ni crea procesos.",
      "feedback": [
        "Has confundido cantidad de tareas con tamaño de cada tarea. Aumentar las llamadas de ocho a dieciséis no cambia el límite del cálculo: cada una sigue recorriendo un millón de valores.",
        "Cambiar el tamaño de una colección no crea procesos. Tu programa sigue realizando las llamadas de forma secuencial; todavía no has creado ningún Pool.",
        "Correcto: duplicas las llamadas, conservando el trabajo de cada una. Por eso esperas más trabajo total y el mismo primer resultado, aunque el tiempo no tenga que duplicarse exactamente."
      ]
    },
    "hints": [
      "Una lectura del reloj no es una duración. Necesitas una lectura anterior y otra posterior al trabajo que deseas medir.",
      "El contador de resultados mide cuántas llamadas has realizado. El primer elemento de esa lista permite comprobar que no has cambiado el cálculo.",
      "Revisa el alcance del cronómetro: incluye todas las llamadas, pero deja fuera la impresión de las tres líneas. En el experimento aumenta solo la cantidad de llamadas."
    ],
    "takeaway": "Para comparar cambios necesitas medir un trabajo bien definido y conservar sus resultados.",
    "predictionPrompt": "Si duplicas el número de tareas y mantienes el trabajo de cada una, ¿qué esperas del primer resultado y de la duración total? Separa ambas predicciones.",
    "evidencePrompt": "Incluye tu código y explica dónde tomas las dos lecturas del reloj. Anota los tiempos de ambas pruebas, qué variable cambiaste y por qué el primer resultado se mantiene.",
    "codeMode": "challenge",
    "challenge": {
      "title": "Tu encargo: construye el cronómetro",
      "requirements": [
        "Utiliza la función de suma de cuadrados de las misiones anteriores, conservando su bucle de cálculo.",
        "Prepara ocho datos iguales. Cada dato debe pedir un cálculo hasta un millón.",
        "Ejecuta una llamada por dato, de forma secuencial, y guarda todos los resultados en una lista.",
        "Usa perf_counter, del módulo time: toma una lectura antes del recorrido completo y otra después; calcula la diferencia.",
        "Mantén fuera del intervalo medido la preparación de los datos y la impresión de la salida. No añadas sleep ni mensajes dentro del bucle de cálculo.",
        "Muestra tres líneas con las etiquetas indicadas debajo: cantidad de resultados, primer resultado y tiempo secuencial en segundos.",
        "Conserva la protección del bloque principal y ejecuta el archivo completo desde la terminal. Guarda tu código en el cuaderno de esta misión."
      ],
      "outputFormat": [
        "Cantidad de resultados: <cantidad>",
        "Primer resultado: <valor obtenido>",
        "Tiempo secuencial: <duración> segundos"
      ],
      "tips": [
        "Para crear una lista con un mismo valor repetido puedes multiplicar una lista: [7] * 3 produce [7, 7, 7].",
        "Un millón de vueltas por tarea es trabajo real: según el equipo, la ejecución puede tardar varios segundos. Espera a que aparezcan las tres líneas.",
        "Puedes consultar la documentación de time.perf_counter para recordar qué devuelve.",
        "Piensa qué instrucciones forman el trabajo que quieres medir antes de colocar el reloj.",
        "Muestra suficientes decimales para distinguir duraciones breves. El comprobador no exige un tiempo concreto."
      ]
    }
  },
  {
    "id": "pool",
    "number": 4,
    "title": "Abre el equipo",
    "shortTitle": "Pool y map",
    "category": "Paralelismo",
    "minutes": "15–20 min",
    "xp": 100,
    "narrative": "Muchas tareas, un equipo limitado. Descubre qué organiza Pool, qué hace cada trabajador y qué decisiones siguen siendo tuyas.",
    "goal": "Explicar para qué sirve un Pool y seguir el camino dato → llamada → trabajador → resultado.",
    "concepts": [
      {
        "term": "Tarea y trabajador",
        "text": "Una tarea es una llamada con sus datos. Un trabajador es un proceso que puede ejecutar varias tareas, una tras otra. Dos trabajadores no significan solo dos tareas en total."
      },
      {
        "term": "map y el orden",
        "text": "map entrega trabajo, espera a que estén todos los resultados y los devuelve en el orden de la entrada. Las llamadas pueden terminar en otro orden."
      },
      {
        "term": "Proceso y núcleo",
        "text": "Un trabajador es software; un núcleo es hardware. El sistema operativo planifica los procesos: Pool no reserva un núcleo concreto para cada trabajador."
      }
    ],
    "walkthrough": [
      "Recorre la explicación de Pool. Antes de ejecutar, identifica cuántos datos, llamadas y trabajadores hay en el programa.",
      "Ejecuta 04_pool.py completo. Comprueba que el resultado matemático se conserva respecto a la versión secuencial.",
      "Reordena los datos, comprueba la segunda salida y explica qué orden promete map.",
      "Prueba la pregunta de transferencia con una sola tarea y varios trabajadores. Registra tu explicación en el cuaderno."
    ],
    "code": "from multiprocessing import Pool\n\n\n# La función queda al nivel del archivo: los trabajadores pueden localizarla.\ndef suma_cuadrados(numero):\n    total = 0\n    for valor in range(1, numero + 1):\n        total = total + valor * valor\n    return total\n\n\n# Esta protección evita lanzar otro Pool al importar el archivo en un hijo.\nif __name__ == \"__main__\":\n    # Tres datos = tres llamadas completas. No son tres procesos.\n    datos = [3, 5, 10]\n\n    # Un equipo de dos trabajadores, que puede atender más de dos tareas.\n    # Pool administra su creación y reutilización. No reserva núcleos.\n    with Pool(processes=2) as pool:\n        # Pasamos la función SIN llamarla aquí: los trabajadores la ejecutarán.\n        # map espera todos los resultados y conserva el orden de datos.\n        resultados = pool.map(suma_cuadrados, datos)\n\n    # Esta línea se alcanza después de terminar map y salir del Pool.\n    print(resultados)\n",
    "fileName": "04_pool.py",
    "command": "python 04_pool.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Ejecuta con dos trabajadores y datos = [3, 5, 10]. Pega la lista obtenida.",
        "change": null,
        "check": {
          "kind": "list",
          "expected": [
            "14",
            "55",
            "385"
          ]
        },
        "hint": "Los procesos cambian cómo se reparten las llamadas. El cálculo de cada respuesta sigue siendo el mismo.",
        "success": "Las respuestas coinciden. El Pool ha conservado el resultado de las tres tareas."
      },
      {
        "id": "variant",
        "label": "Experimento",
        "prompt": "Mantén los dos trabajadores y cambia el orden de datos a [10, 3, 5]. Pega la salida.",
        "change": "datos = [10, 3, 5]",
        "check": {
          "kind": "list",
          "expected": [
            "385",
            "14",
            "55"
          ]
        },
        "hint": "map coloca cada respuesta según la posición de su dato, aunque las tareas terminen en otro orden.",
        "success": "Orden comprobado: la lista refleja la entrada, no una carrera por terminar primero."
      }
    ],
    "reflection": {
      "question": "Si usas cuatro trabajadores y datos = [10], ¿qué trabajo puede repartir este programa?",
      "options": [
        "Una llamada completa a suma_cuadrados(10).",
        "Cuatro trozos automáticos del bucle de suma_cuadrados.",
        "Diez procesos, uno por cada valor de range."
      ],
      "correct": 0,
      "explanation": "Hay un único dato y, por tanto, una sola llamada. Pool no divide por su cuenta el bucle interior de la función.",
      "feedback": [
        "Correcto: un solo dato origina una llamada completa. Uno de los trabajadores la ejecutará; disponer de cuatro no divide automáticamente su bucle interior en cuatro partes.",
        "Has supuesto que Pool descompone el algoritmo de la función. map reparte llamadas a partir de los datos recibidos. Para repartir el cálculo interior tendrías que diseñar esas subtareas y combinar sus resultados.",
        "Has confundido vueltas del bucle con procesos. Los trabajadores se crean al construir el Pool; el valor 10 solo determina las vueltas que hace una llamada de suma_cuadrados."
      ]
    },
    "hints": [
      "En pool.map(suma_cuadrados, datos), la función se pasa sin paréntesis.",
      "Comprueba que el Pool está dentro de la protección __main__ y ejecuta el .py completo desde la terminal. En Windows y macOS cada trabajador importa tu archivo al arrancar: sin esa protección intentaría crear su propio Pool y Python muestra un RuntimeError.",
      "No añadas start() a cada tarea. Pool administra los trabajadores; map recoge sus respuestas."
    ],
    "takeaway": "Pool reparte llamadas completas. Para tener varias tareas, necesitas varios datos que procesar.",
    "predictionPrompt": "Con tres datos y dos trabajadores, ¿cuántas llamadas completas habrá? ¿Qué cambiaría si hubiera un solo dato y cuatro trabajadores?",
    "evidencePrompt": "Explica con un ejemplo la diferencia entre tarea, trabajador y núcleo. Describe qué envía el principal a map, cuándo continúa y por qué las respuestas mantienen el orden de los datos.",
    "poolLesson": {
      "intro": "Un Pool es un grupo de procesos trabajadores que el programa principal utiliza para atender muchas llamadas. Cada trabajador puede completar una llamada y recibir otra.",
      "why": "Sirve para repartir tareas independientes y reutilizar un número controlado de procesos. Organiza el envío del trabajo y la recogida de respuestas, evitando que tengas que gestionar manualmente un Process por cada dato.",
      "workers": "Con dos trabajadores puede haber hasta dos llamadas ejecutándose a la vez. Cada proceso tiene su propio estado de ejecución. El sistema operativo decide cuándo y en qué CPU se ejecuta cada uno.",
      "steps": [
        {
          "title": "1. Preparar el trabajo",
          "text": "El proceso principal define una función y una colección de datos. En este ejemplo, cada número describe una llamada completa a suma_cuadrados."
        },
        {
          "title": "2. Crear el equipo",
          "text": "Pool(processes=2) crea dos trabajadores. Estos procesos se mantienen disponibles para ir atendiendo el trabajo del Pool."
        },
        {
          "title": "3. Repartir llamadas",
          "text": "map recibe la función y los datos. Puede agrupar las llamadas en lotes para enviarlas a los trabajadores. El reparto concreto no tiene que ser equilibrado ni repetirse en cada ejecución."
        },
        {
          "title": "4. Calcular y devolver",
          "text": "Un trabajador ejecuta la función con el dato recibido y devuelve su resultado. Después puede atender otra llamada. El bucle interior de la función se ejecuta completo dentro de esa llamada."
        },
        {
          "title": "5. Reunir las respuestas",
          "text": "El principal permanece en la llamada a map hasta obtener todos los resultados. La lista se entrega en el orden de los datos; después continúa la siguiente instrucción. Al salir del bloque with se liberan los trabajadores de este Pool."
        }
      ],
      "example": "Tres datos, 3, 5 y 10, representan tres llamadas. Con dos trabajadores no necesitas crear un tercer proceso para atender la tercera llamada: un trabajador puede reutilizarse. Como estas tareas son muy breves, la salida por sí sola no demuestra que los dos hayan trabajado; seguirás sus PID en la misión 5.",
      "limits": "Pool puede aprovechar varios núcleos para cálculos independientes, pero arrancar procesos y comunicar datos añade coste. Una tarea única no se divide sola y las tareas pequeñas pueden tardar más con Pool. En la misión 6 lo decidirán tus medidas.",
      "transferExperiment": {
        "title": "¿Cuatro trabajadores para una sola tarea?",
        "prompt": "Conserva la función y prueba una entrada que contenga únicamente el dato 10. Ejecuta primero con un trabajador y después con cuatro. Predice cuántas llamadas habrá, observa cuántos resultados recibes y explica qué trabajo podrían repartirse. Después restaura los datos de las pruebas de la misión.",
        "evidence": "Anota tu explicación y las salidas en el cuaderno. Para investigar quién ejecutó cada llamada, puedes recuperar este experimento después de añadir los PID en la misión 5.",
        "caution": "La lista de resultados permite contar llamadas completadas; para identificar procesos necesitas observar sus PID. Esta prueba adicional no sustituye las dos comprobaciones de la misión."
      },
      "references": [
        {
          "title": "Documentación de Python: grupos de procesos, map y starmap",
          "url": "https://docs.python.org/3/library/multiprocessing.html#module-multiprocessing.pool"
        },
        {
          "title": "Documentación de Python: programación con procesos",
          "url": "https://docs.python.org/3/library/multiprocessing.html#programming-guidelines"
        }
      ]
    }
  },
  {
    "id": "pids",
    "number": 5,
    "title": "Sigue las huellas",
    "shortTitle": "Observar procesos",
    "category": "Observación",
    "minutes": "10–15 min",
    "xp": 100,
    "narrative": "Las respuestas son correctas, pero ¿quién hace cada tarea? Sigue los identificadores y encuentra cómo se reutilizan los trabajadores.",
    "goal": "Leer una ejecución concurrente sin confundir el orden de los mensajes con el de los resultados.",
    "concepts": [
      {
        "term": "PID",
        "text": "Identifica al proceso que ejecuta una línea. No es un número de núcleo del procesador."
      },
      {
        "term": "Pausa visible",
        "text": "sleep(1) ayuda a ver tareas solapadas. Durante esa pausa no se está calculando."
      },
      {
        "term": "Trabajadores reutilizados",
        "text": "Un mismo PID puede aparecer en varias tareas. Si no indicas chunksize, map agrupa los datos en lotes de tamaño automático; chunksize=1 entrega los datos de uno en uno y facilita observar el reparto."
      }
    ],
    "walkthrough": [
      "Abre 05_observar.py y conserva todos sus mensajes de inicio, fin y resultados.",
      "Ejecuta con dos trabajadores y pega toda la salida, desde el PID principal hasta el tiempo total.",
      "Después repite con un trabajador y compara los PID y los tiempos que observas."
    ],
    "code": "import os\nfrom multiprocessing import Pool\nfrom time import perf_counter, sleep\n\n\ndef suma_cuadrados(numero):\n    # PID significa identificador del proceso que ejecuta esta llamada.\n    pid = os.getpid()\n    print(f\"INICIO: dato {numero}, proceso {pid}\", flush=True)\n\n    # Pausa didáctica: permite ver cómo se solapan varias tareas.\n    sleep(1)\n\n    total = 0\n    for valor in range(1, numero + 1):\n        total = total + valor * valor\n\n    # flush=True pide que el mensaje se envíe a la salida inmediatamente.\n    print(f\"FIN: dato {numero}, proceso {pid}, resultado {total}\", flush=True)\n    return total\n\n\nif __name__ == \"__main__\":\n    datos = [1, 2, 3, 4, 5, 6]\n    procesos = 2\n\n    print(\"PID del proceso principal:\", os.getpid(), flush=True)\n    inicio = perf_counter()\n\n    with Pool(processes=procesos) as pool:\n        print(\"Antes de map: entrego las tareas.\", flush=True)\n        # chunksize=1 envía cada dato como un lote de una sola tarea.\n        resultados = pool.map(suma_cuadrados, datos, chunksize=1)\n        print(\"Después de map: todos los resultados están disponibles.\", flush=True)\n\n    duracion = perf_counter() - inicio\n    print(\"Resultados:\", resultados)\n    print(f\"Tiempo total: {duracion:.2f} segundos\")\n",
    "fileName": "05_observar.py",
    "command": "python 05_observar.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Ejecuta con procesos = 2. Pega toda la salida, incluidos INICIO, FIN, resultados y tiempo.",
        "change": null,
        "check": {
          "kind": "pids",
          "expected": [
            "1",
            "5",
            "14",
            "30",
            "55",
            "91"
          ],
          "workers": 2
        },
        "hint": "Tus PID y el orden de las líneas pueden ser distintos. Necesitamos la salida completa para seguir cada tarea.",
        "success": "Registro comprobado. Observa qué PID repite tareas y cuándo aparece «Después de map»."
      },
      {
        "id": "variant",
        "label": "Experimento",
        "prompt": "Cambia únicamente procesos = 2 por procesos = 1. Pega el registro completo de esa ejecución.",
        "change": "procesos = 1",
        "check": {
          "kind": "pids",
          "expected": [
            "1",
            "5",
            "14",
            "30",
            "55",
            "91"
          ],
          "workers": 1
        },
        "hint": "Con un trabajador, todas las tareas deben mostrar su mismo PID. El PID principal es otro proceso.",
        "success": "Un trabajador, varias tareas. La lista matemática se mantiene aunque cambie el reparto."
      }
    ],
    "reflection": {
      "question": "¿Qué puedes concluir si ves el mismo PID en las tareas 1 y 4?",
      "options": [
        "El programa ha reservado el mismo núcleo físico para ambas.",
        "El mismo proceso trabajador ha realizado ambas tareas.",
        "Las dos tareas tienen obligatoriamente el mismo resultado."
      ],
      "correct": 1,
      "explanation": "El PID identifica un proceso. Verlo repetido muestra que ese trabajador se reutiliza; no identifica el núcleo donde se ejecutó.",
      "feedback": [
        "El PID identifica un proceso, no un núcleo físico. El sistema operativo decide en qué CPU se ejecuta y puede cambiarlo; este registro no permite deducir una reserva de núcleo.",
        "Correcto: el mismo identificador en esas dos llamadas muestra que el trabajador se ha reutilizado. Un trabajador puede atender varias tareas a lo largo de la ejecución.",
        "Compartir trabajador no hace iguales los datos ni los resultados. La función calcula usando el dato de cada llamada; el PID solo informa de qué proceso la está ejecutando."
      ]
    },
    "hints": [
      "Busca un INICIO y un FIN para cada dato del 1 al 6.",
      "Compara el PID de una tarea al empezar y al terminar. Después busca ese PID en otras tareas.",
      "sleep permite observar esperas solapadas. Para medir aceleración de cálculo lo quitaremos en la misión siguiente."
    ],
    "takeaway": "El orden de los mensajes puede variar. Sigue los PID y comprueba aparte la lista final.",
    "predictionPrompt": "Al pasar de dos trabajadores a uno, ¿qué esperas que ocurra con los PID, el solapamiento de las tareas y la lista final?",
    "evidencePrompt": "Cita dos líneas de tu salida que muestren la reutilización de un trabajador. Explica cuándo aparece «Después de map» y por qué el orden de los mensajes puede diferir del orden de la lista."
  },
  {
    "id": "benchmark",
    "number": 6,
    "title": "Ponlos a prueba",
    "shortTitle": "Comparar tiempos",
    "category": "Experimento",
    "minutes": "12–18 min",
    "xp": 100,
    "narrative": "¿Más trabajadores significa menos tiempo? Enfrenta las dos versiones con el mismo trabajo y deja que tus medidas respondan.",
    "goal": "Comparar resultados y tiempos, incluyendo el coste de crear y coordinar el Pool.",
    "concepts": [
      {
        "term": "La misma tarea",
        "text": "Ambas versiones usan la misma función y la misma lista. Primero comprobamos que sus respuestas coincidan."
      },
      {
        "term": "Coste completo",
        "text": "El cronómetro del Pool empieza antes de crearlo y termina después de salir del bloque with."
      },
      {
        "term": "El factor",
        "text": "Tiempo secuencial dividido entre tiempo con Pool: mayor que 1 favorece al Pool; menor que 1 favorece al secuencial. Con dos trabajadores, el máximo teórico ronda 2, y solo si tu equipo tiene al menos dos núcleos libres: el programa muestra cuántos tiene."
      }
    ],
    "walkthrough": [
      "Abre 06_comparar.py. Mantén procesos = 2 para las dos pruebas de esta misión.",
      "Ejecuta el archivo y pega todas las líneas, incluidas la igualdad y las dos duraciones.",
      "Reduce el tamaño de cada tarea a 100 y compara qué ocurre con el coste del Pool."
    ],
    "code": "import os\nfrom multiprocessing import Pool\nfrom time import perf_counter\n\n\ndef suma_cuadrados(numero):\n    # Aquí no usamos print ni sleep: queremos medir el trabajo de cálculo.\n    total = 0\n    for valor in range(1, numero + 1):\n        total = total + valor * valor\n    return total\n\n\nif __name__ == \"__main__\":\n    # Cambia una variable cada vez para poder interpretar el experimento.\n    datos = [1_000_000] * 8\n    procesos = 2\n\n    # Primera medición: un proceso hace todas las tareas una tras otra.\n    inicio = perf_counter()\n    secuencial = []\n    for numero in datos:\n        secuencial.append(suma_cuadrados(numero))\n    tiempo_secuencial = perf_counter() - inicio\n\n    # Segunda medición: los mismos datos y la misma función con Pool.\n    # Empezamos a medir ANTES de crear los procesos.\n    inicio = perf_counter()\n    with Pool(processes=procesos) as pool:\n        paralelo = pool.map(suma_cuadrados, datos)\n    # Paramos DESPUÉS de salir del bloque with.\n    tiempo_pool = perf_counter() - inicio\n\n    print(\"Número de tareas:\", len(datos))\n    print(\"Procesos trabajadores:\", procesos)\n    # Núcleos lógicos que ve el sistema operativo: limitan cuánto puede mejorar Pool.\n    print(\"Núcleos lógicos del equipo:\", os.cpu_count())\n    print(\"Resultados iguales:\", secuencial == paralelo)\n    print(\"Primer resultado:\", paralelo[0])\n    # Seis decimales: las tareas pequeñas tardan microsegundos.\n    print(f\"Tiempo secuencial: {tiempo_secuencial:.6f} segundos\")\n    print(f\"Tiempo con Pool: {tiempo_pool:.6f} segundos\")\n\n    # >1: Pool fue más rápido; <1: la versión secuencial fue más rápida.\n    factor = tiempo_secuencial / tiempo_pool\n    print(f\"Factor secuencial/Pool: {factor:.4f}\")\n",
    "fileName": "06_comparar.py",
    "command": "python 06_comparar.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Compara ocho tareas de un millón con dos trabajadores. Pega toda la salida del programa.",
        "change": null,
        "check": {
          "kind": "benchmark",
          "count": 8,
          "workers": 2,
          "first": "333333833333500000"
        },
        "hint": "No buscamos que gane una versión concreta. Buscamos resultados iguales y una comparación de tiempos válida.",
        "success": "Comparación registrada. El factor describe esta ejecución concreta de tu equipo."
      },
      {
        "id": "variant",
        "label": "Experimento",
        "prompt": "Cambia solo los datos a [100] * 8. Conserva dos trabajadores y pega la salida completa.",
        "change": "datos = [100] * 8",
        "check": {
          "kind": "benchmark",
          "count": 8,
          "workers": 2,
          "first": "338350"
        },
        "hint": "Con tareas tan pequeñas, el tiempo secuencial puede ser de microsegundos (por ejemplo, 0.000030 segundos). Por eso el programa muestra seis decimales. Mantén todas las líneas de salida.",
        "success": "Experimento registrado. Comprueba si organizar los trabajadores compensa ahora que cada tarea es pequeña."
      }
    ],
    "reflection": {
      "question": "Si Pool tarda más con tareas muy pequeñas, ¿qué explicación es razonable?",
      "options": [
        "Los resultados matemáticos siempre están equivocados.",
        "Pool necesita cuatro trabajadores para poder funcionar.",
        "Crear procesos y comunicar tareas puede costar más que el cálculo que se reparte."
      ],
      "correct": 2,
      "explanation": "Pool añade coordinación. Si cada tarea es muy breve, ese coste puede superar el ahorro; obtener ese resultado no implica un fallo.",
      "feedback": [
        "La duración y la corrección son cuestiones diferentes. Primero comprueba que las respuestas sean iguales y correctas. Una versión puede calcular bien y tardar más por el coste de organizar el trabajo.",
        "Pool puede funcionar con un trabajador, dos o más. No existe un requisito de cuatro trabajadores. Elegir más tampoco garantiza mejorar: depende del trabajo, el equipo y los costes de coordinación.",
        "Correcto: iniciar trabajadores, enviar datos y recoger respuestas añade tiempo. Cuando el cálculo es muy pequeño, ese coste puede superar el ahorro. Tus medidas deben decidir qué ocurre en esta configuración."
      ]
    },
    "hints": [
      "Comprueba primero «Resultados iguales: True». Después interpreta las duraciones.",
      "La cantidad de trabajo y el número de procesos son variables distintas. Cambia una cada vez.",
      "Repite cada configuración tres veces. Un factor 2.00 significa que Pool tardó la mitad; 0.50, que tardó el doble; 0.0010, que tardó unas mil veces más."
    ],
    "takeaway": "La mejora se mide: más procesos no garantizan menos tiempo para cualquier trabajo.",
    "predictionPrompt": "Al hacer las ocho tareas mucho más pequeñas, ¿crees que se mantendrá la ventaja de repartirlas? Razona qué costes siguen existiendo.",
    "evidencePrompt": "Compara los tiempos y factores de ambas configuraciones. Repite una de ellas tres veces y anota tus medidas. Explica qué puedes concluir de tu equipo y qué no puedes generalizar."
  },
  {
    "id": "starmap",
    "number": 7,
    "title": "Trabajo en pareja",
    "shortTitle": "Varios argumentos",
    "category": "Ampliación",
    "minutes": "8–12 min",
    "xp": 100,
    "narrative": "Una nueva tarea necesita dos datos. Prepara las parejas y haz que cada trabajador reciba los argumentos que le corresponden.",
    "goal": "Repartir llamadas a una función con dos argumentos mediante starmap.",
    "concepts": [
      {
        "term": "Dos argumentos",
        "text": "multiplicar(a, b) necesita dos valores para cada llamada."
      },
      {
        "term": "Una pareja por tarea",
        "text": "(2, 3) representa los argumentos de multiplicar(2, 3)."
      },
      {
        "term": "starmap",
        "text": "Desempaqueta cada pareja como los argumentos de una llamada y reúne los resultados en orden. Con map, la función recibiría la tupla entera como un solo argumento y Python mostraría un TypeError por faltar b."
      }
    ],
    "walkthrough": [
      "Abre 07_starmap.py y relaciona cada pareja con una llamada a multiplicar.",
      "Ejecuta las tres tareas iniciales y pega la lista obtenida.",
      "Añade una cuarta pareja, ejecuta otra vez y comprueba el resultado añadido."
    ],
    "code": "from multiprocessing import Pool\n\n\ndef multiplicar(a, b):\n    return a * b\n\n\nif __name__ == \"__main__\":\n    # Cada pareja contiene los argumentos de una llamada a multiplicar.\n    parejas = [(2, 3), (4, 5), (6, 7)]\n\n    with Pool(processes=2) as pool:\n        # Equivale a repartir multiplicar(2, 3), multiplicar(4, 5), etc.\n        resultados = pool.starmap(multiplicar, parejas)\n\n    print(resultados)\n",
    "fileName": "07_starmap.py",
    "command": "python 07_starmap.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Ejecuta con las parejas (2, 3), (4, 5) y (6, 7). Pega la lista de resultados.",
        "change": null,
        "check": {
          "kind": "list",
          "expected": [
            "6",
            "20",
            "42"
          ]
        },
        "hint": "Haz una multiplicación por pareja, conservando el orden de la lista.",
        "success": "Tres parejas, tres llamadas. Los dos argumentos han llegado a cada tarea."
      },
      {
        "id": "variant",
        "label": "Experimento",
        "prompt": "Añade (8, 9) al final de parejas. Guarda, ejecuta y pega la lista completa.",
        "change": "parejas = [(2, 3), (4, 5), (6, 7), (8, 9)]",
        "check": {
          "kind": "list",
          "expected": [
            "6",
            "20",
            "42",
            "72"
          ]
        },
        "hint": "Las tres respuestas anteriores se mantienen. La cuarta corresponde a multiplicar(8, 9).",
        "success": "La nueva tarea está incorporada. El mismo grupo puede atender más parejas."
      }
    ],
    "reflection": {
      "question": "¿Qué llamada representa la pareja (4, 5) al usar starmap(multiplicar, parejas)?",
      "options": [
        "multiplicar(4, 5)",
        "multiplicar(9)",
        "multiplicar((4, 5)) con un único argumento"
      ],
      "correct": 0,
      "explanation": "starmap desempaqueta la pareja: su primer elemento pasa como a y el segundo como b.",
      "feedback": [
        "Correcto: starmap desempaqueta cada pareja y pasa sus dos elementos como argumentos separados. La función recibe a=4 y b=5 en esa llamada.",
        "starmap no suma los elementos antes de llamar a la función. Los distribuye entre sus parámetros. Entregar solo 9 dejaría sin valor el segundo argumento obligatorio.",
        "Esa expresión pasa una tupla como un solo argumento. starmap hace algo distinto: la desempaqueta para que multiplicar reciba dos argumentos. La forma de los datos debe encajar con la firma de la función."
      ]
    },
    "hints": [
      "Cuenta los parámetros de la función y los elementos de cada pareja.",
      "En esta misión usamos starmap, porque necesitamos pasar los dos elementos como argumentos separados.",
      "La cuarta pareja origina una cuarta llamada, multiplicar(8, 9). No hace falta cambiar el número de trabajadores: uno de los dos atenderá esa llamada cuando quede libre."
    ],
    "takeaway": "Con starmap, una pareja de datos se convierte en los argumentos de una llamada.",
    "predictionPrompt": "Al añadir una pareja a la entrada, ¿cuántas llamadas habrá y cuántos argumentos recibirá cada una? ¿Necesitas crear otro trabajador?",
    "evidencePrompt": "Escribe la llamada que representa una pareja de tu lista. Explica por qué aquí utilizas starmap y qué dificultad tendría pasar esa misma pareja como un único argumento."
  },
  {
    "id": "final",
    "number": 8,
    "title": "Toma el mando",
    "shortTitle": "Reto de cubos",
    "category": "Misión final",
    "minutes": "12–18 min",
    "xp": 100,
    "narrative": "El laboratorio queda en tus manos. Cambia el cálculo, conserva el reparto y demuestra que sabes comprobar una solución nueva.",
    "goal": "Completar una función de suma de cubos y verificar su resultado por dos caminos.",
    "concepts": [
      {
        "term": "Un código por completar",
        "text": "El TODO está puesto a propósito: la operación inicial aún suma cuadrados. Debes convertirla en suma de cubos."
      },
      {
        "term": "Nuevo cálculo",
        "text": "Para el dato 3 queremos 1³ + 2³ + 3³. Revisa la operación dentro del bucle."
      },
      {
        "term": "Dos comprobaciones",
        "text": "Las versiones deben coincidir entre sí y producir los cubos correctos. La igualdad por sí sola no basta."
      }
    ],
    "walkthrough": [
      "Crea 08_reto_cubos.py con el código de partida. Localiza la línea marcada TODO.",
      "Completa la operación para sumar cubos y ejecuta con [2, 3, 4]. Pega sus tres líneas.",
      "Amplía los datos a [1, 2, 3, 4, 5] y comprueba de nuevo ambas versiones."
    ],
    "code": "from multiprocessing import Pool\n\n\ndef suma_cubos(numero):\n    total = 0\n\n    for valor in range(1, numero + 1):\n        # TODO: cambia esta operación para sumar CUBOS.\n        # Esta línea aún calcula cuadrados: tu misión es completarla.\n        total = total + valor * valor\n\n    return total\n\n\nif __name__ == \"__main__\":\n    datos = [2, 3, 4]\n\n    # Comprobamos la misma función de las dos formas.\n    secuencial = []\n    for numero in datos:\n        secuencial.append(suma_cubos(numero))\n\n    with Pool(processes=2) as pool:\n        paralelo = pool.map(suma_cubos, datos)\n\n    print(\"Secuencial:\", secuencial)\n    print(\"Pool:\", paralelo)\n    print(\"Resultados iguales:\", secuencial == paralelo)\n",
    "fileName": "08_reto_cubos.py",
    "command": "python 08_reto_cubos.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Completa el TODO para sumar cubos. Ejecuta con [2, 3, 4] y pega Secuencial, Pool y Resultados iguales.",
        "change": null,
        "check": {
          "kind": "dual_list",
          "expected": [
            "9",
            "36",
            "100"
          ]
        },
        "hint": "Cambiar el nombre de la función no cambia la operación. Revisa cuántas veces multiplicas valor por sí mismo.",
        "success": "El nuevo cálculo es correcto y ambas versiones coinciden. Has adaptado el trabajo del laboratorio."
      },
      {
        "id": "variant",
        "label": "Experimento",
        "prompt": "Con la función ya corregida, usa datos = [1, 2, 3, 4, 5]. Pega las tres líneas nuevas.",
        "change": "datos = [1, 2, 3, 4, 5]",
        "check": {
          "kind": "dual_list",
          "expected": [
            "1",
            "9",
            "36",
            "100",
            "225"
          ]
        },
        "hint": "Cada posición acumula cubos desde 1 hasta su dato. Conserva la operación corregida del primer intento.",
        "success": "Comprobación final superada. Tu función acepta más tareas sin cambiar la estructura del Pool."
      }
    ],
    "reflection": {
      "question": "¿Basta con que aparezca «Resultados iguales: True» para afirmar que has calculado cubos correctamente?",
      "options": [
        "Sí: dos respuestas iguales siempre son matemáticamente correctas.",
        "No: ambas versiones podrían ejecutar la misma operación equivocada. Hay que comprobar también los valores.",
        "No: los cubos solo pueden calcularse con starmap."
      ],
      "correct": 1,
      "explanation": "Las dos versiones comparten la función. Si esta calcula cuadrados por error, coincidirán entre sí; por eso también verificamos los cubos esperados.",
      "feedback": [
        "Dos versiones pueden coincidir porque comparten el mismo error. Aquí ambas llaman a la misma función. Debes comparar también con un resultado calculado de forma independiente para un caso pequeño.",
        "Correcto: la igualdad detecta diferencias entre las versiones, pero no garantiza que la función haga el cálculo pedido. Por eso también verificas los cubos esperados.",
        "Elegir map o starmap depende de cómo se pasan los argumentos, no de si calculas cuadrados o cubos. Esta función necesita un solo número por llamada y puede utilizar map."
      ]
    },
    "hints": [
      "El nombre suma_cubos es una etiqueta. La operación del bucle decide qué se calcula.",
      "Un cubo es el producto de tres factores iguales: valor * valor * valor, o valor ** 3. Mantén el acumulador y el return.",
      "Comprueba a mano el caso de entrada 2: debes sumar el cubo de 1 y el cubo de 2. Usa ese caso para revisar la operación del bucle antes de ampliar los datos."
    ],
    "takeaway": "Puedes cambiar el cálculo manteniendo el reparto. Comprobar resultados forma parte de programar.",
    "predictionPrompt": "Si dejas por error el cálculo de cuadrados en ambas versiones, ¿podrían coincidir sus listas? ¿Cómo detectarías que todavía no calculan cubos?",
    "evidencePrompt": "Incluye tu código final. Explica qué cambiaste, calcula a mano un caso pequeño y describe un trabajo real con varias tareas independientes donde valorarías usar Pool. Indica qué medirías antes de recomendarlo."
  }
];
