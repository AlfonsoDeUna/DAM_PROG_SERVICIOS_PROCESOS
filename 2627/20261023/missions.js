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
    "narrative": "Vas a seguir un programa pequeño desde el dato que recibe hasta el número que muestra. Ese cálculo será la tarea que aprenderás a repetir y, más adelante, a repartir entre procesos.",
    "goal": "Comprender qué recibe una función, cómo acumula un resultado y qué devuelve.",
    "concepts": [
      {
        "term": "Llamada y argumento",
        "text": "Llamar a una función es pedirle que trabaje. En suma_cuadrados(5), el 5 es el argumento: el dato que recibe como numero."
      },
      {
        "term": "Un acumulador",
        "text": "total conserva la suma que llevamos. Empieza en cero y cada vuelta añade un producto nuevo."
      },
      {
        "term": "Devolver y mostrar",
        "text": "return entrega el resultado al programa. print lo escribe en la terminal para que puedas verlo."
      }
    ],
    "walkthrough": [
      "Crea una carpeta para tus archivos del laboratorio. Dentro, crea 01_funcion.py en VS Code y escribe o copia el código de partida.",
      "Lee el programa con la guía de arriba y guarda una predicción para la primera llamada, suma_cuadrados(5).",
      "Guarda el archivo. Abre Terminal → Nueva terminal en VS Code, sitúate en esa carpeta y ejecuta el comando indicado. Pega el número impreso en «Prueba inicial».",
      "Cuando la primera salida esté comprobada, realiza el cambio del apartado «Experimento». Guarda otra vez, ejecuta y pega la nueva salida en la segunda prueba."
    ],
    "code": "def suma_cuadrados(numero):\n    # Esta variable pertenece a esta llamada de la función.\n    total = 0\n\n    # El extremo final de range no se incluye: +1 permite llegar a numero.\n    for valor in range(1, numero + 1):\n        total = total + valor * valor\n\n    # Devolvemos el resultado para que quien nos llamó pueda utilizarlo.\n    return total\n\n\n# Este bloque solo se ejecuta cuando lanzas el archivo desde la terminal.\n# Ahora es opcional, pero con Pool será obligatorio (lo verás en la misión 4).\nif __name__ == \"__main__\":\n    resultado = suma_cuadrados(5)\n    print(resultado)\n",
    "fileName": "01_funcion.py",
    "command": "python 01_funcion.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Primera ejecución: conserva la línea resultado = suma_cuadrados(5). Guarda 01_funcion.py, ejecútalo y pega el número que muestra print(resultado). Todavía no cambies el 5.",
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
        "prompt": "Después de la prueba inicial, localiza resultado = suma_cuadrados(5), al final del archivo. Cambia solo ese 5 por 3; deja igual la función. Guarda, ejecuta y pega el nuevo número.",
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
    "predictionPrompt": "En la primera ejecución usamos suma_cuadrados(5). ¿Qué número crees que mostrará print(resultado)? Explica cómo lo obtienes sumando los cuadrados del 1 al 5; todavía no cambies la llamada.",
    "evidencePrompt": "Compara la llamada inicial suma_cuadrados(5) con la del experimento suma_cuadrados(3). Anota ambas salidas y explica qué significa ese dato, qué hace return y qué hace print.",
    "previousPredictionPrompt": "Antes de cambiar 5 por 3, ¿esperas un resultado mayor o menor? Explica qué vueltas dejará de hacer la función.",
    "learningContext": {
      "bridge": "Empezamos por una función: un bloque de instrucciones al que damos un dato y que nos devuelve un resultado.",
      "scenario": "Usaremos siempre un cálculo fácil de reconocer para observar después cómo cambia la forma de ejecutarlo. Sumar cuadrados significa multiplicar cada número por sí mismo y sumar esos productos.",
      "input": "La llamada suma_cuadrados(5) entrega el número 5 a la función. Ese 5 es el límite del recorrido: vamos a utilizar 1, 2, 3, 4 y 5.",
      "process": "La función calcula 1 × 1, 2 × 2, 3 × 3, 4 × 4 y 5 × 5. La variable total empieza en cero y va acumulando esos productos.",
      "output": "La función devuelve un único número. El programa lo guarda en resultado y print(resultado) lo muestra en la terminal.",
      "reading": [
        {
          "anchor": "def suma_cuadrados(numero):",
          "explanation": "Define qué hará la función. numero es el nombre que recibe dentro de ella el dato que le pasemos; definirla todavía no ejecuta el cálculo."
        },
        {
          "anchor": "for valor in range(1, numero + 1):",
          "explanation": "Repite el bloque con valor igual a 1, luego 2 y así hasta numero. El + 1 permite incluir el límite, porque range excluye su extremo final."
        },
        {
          "anchor": "total = total + valor * valor",
          "explanation": "Añade el cuadrado actual al total que ya llevamos. Por eso total se prepara con cero antes de empezar el bucle."
        },
        {
          "anchor": "resultado = suma_cuadrados(5)",
          "explanation": "Esta línea sí pide el cálculo. Está bajo if __name__ == \"__main__\", el bloque de arranque al ejecutar el archivo. De momento conserva esa protección."
        },
        {
          "anchor": "return total",
          "explanation": "return entrega el número a quien llamó a la función. print muestra ese número; son dos acciones distintas."
        }
      ],
      "firstRun": "Crea 01_funcion.py con el código de partida y conserva suma_cuadrados(5). Tu primera prueba consiste en ejecutarlo así, sin cambiar todavía ningún dato.",
      "experiment": "Después de comprobar la primera salida, localiza resultado = suma_cuadrados(5), cerca del final. Sustituye solo el 5 de esa llamada por 3. La función y print se mantienen iguales.",
      "checkpoint": "Antes de seguir, localiza estas tres cosas: dónde entra el dato, dónde se calcula y dónde aparece el resultado en pantalla."
    }
  },
  {
    "id": "sequence",
    "number": 2,
    "title": "Una detrás de otra",
    "shortTitle": "Varias tareas",
    "category": "Fundamentos",
    "minutes": "8–12 min",
    "xp": 100,
    "narrative": "Ya has pedido un cálculo a la función. Ahora vas a pedirle tres cálculos distintos y guardar sus respuestas en una lista, ejecutándolos uno detrás de otro.",
    "goal": "Reconocer una ejecución secuencial y relacionar cada dato con su resultado.",
    "concepts": [
      {
        "term": "Una lista de peticiones",
        "text": "Cada número de datos se entrega por separado a suma_cuadrados. Tres elementos originan tres llamadas."
      },
      {
        "term": "Secuencial",
        "text": "Cada llamada termina antes de empezar la siguiente. Un único proceso recorre toda la lista, en ese orden."
      },
      {
        "term": "Dos bucles distintos",
        "text": "El bucle exterior decide qué dato calcular. El interior, dentro de suma_cuadrados, realiza la suma para ese dato."
      }
    ],
    "walkthrough": [
      "Crea 02_secuencial.py con el código de partida. Localiza la lista datos, el bucle exterior y la función de la misión anterior.",
      "Relaciona cada elemento de [3, 5, 10] con su llamada y guarda tu predicción de la primera salida.",
      "Guarda y ejecuta el archivo completo. Copia la lista impresa, incluidos los corchetes, en «Prueba inicial».",
      "Después cambia únicamente la lista datos como indica «Experimento». Ejecuta de nuevo y comprueba la segunda salida."
    ],
    "code": "def suma_cuadrados(numero):\n    total = 0\n    for valor in range(1, numero + 1):\n        total = total + valor * valor\n    return total\n\n\nif __name__ == \"__main__\":\n    # Cada elemento representa una llamada independiente a la función.\n    datos = [3, 5, 10]\n    resultados = []\n\n    for numero in datos:\n        # Esta llamada termina antes de empezar la siguiente vuelta del for.\n        resultado = suma_cuadrados(numero)\n        resultados.append(resultado)\n\n    print(resultados)\n",
    "fileName": "02_secuencial.py",
    "command": "python 02_secuencial.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Primera ejecución de 02_secuencial.py: conserva datos = [3, 5, 10]. Guarda, ejecuta y pega la lista completa que imprime resultados.",
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
        "prompt": "Tras comprobar la primera lista, localiza datos = [3, 5, 10] y sustitúyela por datos = [10, 3, 5]. No cambies la función ni el bucle. Guarda, ejecuta y pega la lista nueva.",
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
    "predictionPrompt": "En la primera prueba, datos contiene [3, 5, 10]. ¿Qué crees que mostrará print(resultados): un número o una lista? Explica a qué llamada corresponderá cada posición.",
    "evidencePrompt": "Relaciona cada dato de [3, 5, 10] y de [10, 3, 5] con su resultado. Explica qué cambió al reordenar la entrada y distingue las llamadas completas de las vueltas de sus bucles.",
    "previousPredictionPrompt": "Si cambias el orden de los datos, ¿cambiarán los valores calculados, su posición o ambas cosas? Justifica tu predicción.",
    "learningContext": {
      "bridge": "Recuperamos suma_cuadrados de la misión 1. Su cálculo no cambia; cambia cuántas veces la llamamos.",
      "scenario": "Imagina que llegan tres peticiones de cálculo. Vamos a automatizar su recorrido para tener una versión secuencial que después podamos comparar con Pool.",
      "input": "datos = [3, 5, 10] es una lista de tres límites. Cada elemento pedirá una llamada completa: una hasta 3, otra hasta 5 y otra hasta 10.",
      "process": "El bucle que está fuera de la función toma un dato, llama a suma_cuadrados y guarda la respuesta. Solo después pasa al siguiente dato.",
      "output": "print(resultados) muestra una lista con una respuesta por llamada. Cada posición corresponde a la misma posición de la lista datos.",
      "reading": [
        {
          "anchor": "datos = [3, 5, 10]",
          "explanation": "Estos son los datos que vamos a entregar a la función. No indican trabajadores: todavía usamos un solo proceso."
        },
        {
          "anchor": "resultados = []",
          "explanation": "Prepara una lista vacía. Aquí guardaremos las respuestas conforme estén calculadas."
        },
        {
          "anchor": "for numero in datos:",
          "explanation": "Este bucle exterior recorre las tres peticiones. Es distinto del bucle interior que suma los cuadrados de una petición."
        },
        {
          "anchor": "resultado = suma_cuadrados(numero)",
          "explanation": "Realiza una llamada con el dato de esta vuelta. El programa espera a que termine para continuar."
        },
        {
          "anchor": "resultados.append(resultado)",
          "explanation": "append añade la respuesta al final de la lista. No reemplaza las respuestas que ya estaban guardadas."
        }
      ],
      "firstRun": "Crea 02_secuencial.py y ejecuta el código original con datos = [3, 5, 10]. La prueba inicial pide la lista completa que aparece en la terminal.",
      "experiment": "Después de comprobar esa lista, cambia solo la línea datos = [3, 5, 10] por datos = [10, 3, 5]. Mantén la función y el bucle iguales para estudiar el efecto del orden.",
      "checkpoint": "¿Puedes señalar una llamada completa y distinguirla de una vuelta del bucle que calcula sus cuadrados?"
    }
  },
  {
    "id": "timer",
    "number": 3,
    "title": "Toma el tiempo",
    "shortTitle": "Medir duraciones",
    "category": "Observación",
    "minutes": "10–15 min",
    "xp": 100,
    "narrative": "Ya sabes ejecutar varias llamadas una detrás de otra. Ahora escribirás tu propio programa para medir cuánto tarda ese trabajo y obtener una referencia antes de introducir Pool.",
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
      "Lee el encargo y guarda una predicción para la primera prueba: ocho cálculos iguales hasta un millón.",
      "Crea 03_cronometro.py. Reutiliza la función anterior y programa tú el recorrido secuencial, la medición y las tres líneas de salida.",
      "Guarda y ejecuta el archivo. Espera a que termine y pega las tres líneas en «Prueba inicial». Añade tu código al cuaderno.",
      "Después duplica solo la cantidad de llamadas, ejecuta de nuevo y comprueba la salida en «Experimento». Compara las dos duraciones."
    ],
    "code": "",
    "fileName": "03_cronometro.py",
    "command": "python 03_cronometro.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Ejecuta tu 03_cronometro.py con ocho llamadas, cada una con límite de un millón. Pega sus tres líneas: Cantidad de resultados, Primer resultado y Tiempo secuencial.",
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
        "prompt": "Después de la primera medida, cambia de ocho a dieciséis la cantidad de datos. Cada dato sigue valiendo un millón. Guarda, ejecuta y pega las tres líneas nuevas, manteniendo el mismo bloque cronometrado.",
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
    "predictionPrompt": "En tu primera prueba habrá ocho llamadas con el mismo dato: un millón. ¿Esperas que sus resultados sean iguales o diferentes? Explica qué trabajo completo debe quedar dentro de la medición.",
    "evidencePrompt": "Incluye tu código y explica dónde tomas las dos lecturas del reloj. Anota las duraciones con ocho y dieciséis tareas, qué variable cambiaste y por qué el primer resultado se mantiene.",
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
        "Las expresiones entre < > del formato son huecos: sustitúyelos por los valores que calcule tu programa. No imprimas literalmente <cantidad>, <valor obtenido> ni <duración>.",
        "Para crear una lista con un mismo valor repetido puedes multiplicar una lista: [7] * 3 produce [7, 7, 7].",
        "Un millón de vueltas por tarea es trabajo real: según el equipo, la ejecución puede tardar varios segundos. Espera a que aparezcan las tres líneas.",
        "Puedes consultar la documentación de time.perf_counter para recordar qué devuelve.",
        "Piensa qué instrucciones forman el trabajo que quieres medir antes de colocar el reloj.",
        "Muestra suficientes decimales para distinguir duraciones breves. El comprobador no exige un tiempo concreto."
      ]
    },
    "previousPredictionPrompt": "Si duplicas el número de tareas y mantienes el trabajo de cada una, ¿qué esperas del primer resultado y de la duración total? Separa ambas predicciones.",
    "learningContext": {
      "bridge": "La misión 2 guardaba varias respuestas en una lista. Aquí reutilizas esa idea y añades una medición del tiempo que tarda el recorrido completo.",
      "scenario": "Con cálculos muy pequeños cuesta apreciar las duraciones. Por eso pediremos varias sumas de cuadrados grandes; así tendremos un trabajo que medir y comparar más adelante.",
      "input": "La primera prueba tiene ocho datos iguales. Cada dato vale un millón: hay ocho llamadas, y cada una suma cuadrados desde 1 hasta 1 000 000.",
      "process": "Tu programa debe ejecutar las ocho llamadas de forma secuencial. Dos lecturas de perf_counter, una antes del trabajo y otra después, permiten calcular cuánto tiempo ha transcurrido.",
      "output": "Imprime la cantidad de respuestas, la primera respuesta y la duración. En el formato del encargo, <cantidad>, <valor obtenido> y <duración> son huecos que tu programa sustituirá por valores; conserva las etiquetas.",
      "reading": [
        {
          "anchor": "Preparar los datos",
          "explanation": "Decide cómo representar ocho peticiones iguales. La cantidad de peticiones y el límite de cada suma son dos decisiones diferentes."
        },
        {
          "anchor": "Reutilizar la función",
          "explanation": "Conserva el bucle de suma de cuadrados de las misiones anteriores. No necesitas inventar un cálculo nuevo ni crear procesos."
        },
        {
          "anchor": "Delimitar la medición",
          "explanation": "El intervalo debe incluir todas las llamadas. La creación de los datos y la impresión de las líneas quedan fuera de ese intervalo."
        },
        {
          "anchor": "Tiempo secuencial",
          "explanation": "Una lectura del reloj es un instante. La diferencia entre el instante final y el inicial es la duración en segundos que debes mostrar."
        }
      ],
      "firstRun": "Crea y programa 03_cronometro.py siguiendo el encargo. La prueba inicial usa ocho llamadas con límite de un millón y pide las tres líneas de salida.",
      "experiment": "Tras comprobar la primera salida, cambia la cantidad de datos de ocho a dieciséis. Cada dato debe seguir valiendo un millón; conserva la función y el bloque que estás midiendo.",
      "checkpoint": "¿Qué representa el ocho y qué representa el millón? Explica esa diferencia antes de escribir el cronómetro."
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
    "narrative": "Hasta ahora un proceso realizaba todas las llamadas. Vas a entregar varias llamadas a un equipo de procesos trabajadores y observar qué organiza Pool por ti.",
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
      "Lee el contexto, la explicación de Pool y el código de 04_pool.py. Distingue los tres datos de los dos trabajadores antes de guardar tu predicción.",
      "Explora el simulador paso a paso para ver el reparto. Sus pasos son un modelo didáctico; las pruebas que pegarás proceden de tu ejecución real en Python.",
      "Crea y ejecuta 04_pool.py con sus valores originales. Pega la lista en «Prueba inicial» y compárala con la de la misión 2.",
      "Después reordena solo datos como indica «Experimento», comprueba la segunda lista y explica el orden que mantiene map.",
      "Para ampliar, realiza la pregunta «¿Cuatro trabajadores para una sola tarea?» y registra tu explicación en el cuaderno."
    ],
    "code": "from multiprocessing import Pool\n\n\n# La función queda al nivel del archivo: los trabajadores pueden localizarla.\ndef suma_cuadrados(numero):\n    total = 0\n    for valor in range(1, numero + 1):\n        total = total + valor * valor\n    return total\n\n\n# Esta protección evita lanzar otro Pool al importar el archivo en un hijo.\nif __name__ == \"__main__\":\n    # Tres datos = tres llamadas completas. No son tres procesos.\n    datos = [3, 5, 10]\n\n    # Un equipo de dos trabajadores, que puede atender más de dos tareas.\n    # Pool administra su creación y reutilización. No reserva núcleos.\n    with Pool(processes=2) as pool:\n        # Pasamos la función SIN llamarla aquí: los trabajadores la ejecutarán.\n        # map espera todos los resultados y conserva el orden de datos.\n        resultados = pool.map(suma_cuadrados, datos)\n\n    # Esta línea se alcanza después de terminar map y salir del Pool.\n    print(resultados)\n",
    "fileName": "04_pool.py",
    "command": "python 04_pool.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Primera ejecución de 04_pool.py: conserva Pool(processes=2) y datos = [3, 5, 10]. Ejecuta el archivo completo y pega la lista de resultados.",
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
        "prompt": "Tras comprobar la primera ejecución, cambia solo datos = [3, 5, 10] por datos = [10, 3, 5]. Mantén los dos trabajadores y la misma función. Guarda, ejecuta y pega la lista nueva.",
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
    "predictionPrompt": "La primera ejecución usa tres datos, [3, 5, 10], y dos trabajadores. ¿Cuántas respuestas esperas recibir? ¿Crees que cambiará el cálculo respecto al programa secuencial de la misión 2? Explica por qué.",
    "evidencePrompt": "Explica con un ejemplo la diferencia entre tarea, trabajador y núcleo. Describe qué entrega el principal a map, cuándo continúa y cómo se relaciona el orden de la lista final con los datos de entrada.",
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
    },
    "previousPredictionPrompt": "Con tres datos y dos trabajadores, ¿cuántas llamadas completas habrá? ¿Qué cambiaría si hubiera un solo dato y cuatro trabajadores?",
    "learningContext": {
      "bridge": "Volvemos a los datos pequeños de la misión 2 para reconocer las respuestas. La función suma_cuadrados se mantiene; ahora cambia la forma de repartir sus llamadas.",
      "scenario": "Cuando hay tareas independientes, un trabajador no necesita el resultado de otro para empezar. Pool permite mantener un equipo de procesos y encargarles muchas llamadas sin crear manualmente un proceso para cada dato.",
      "input": "datos = [3, 5, 10] describe tres llamadas. Pool(processes=2) crea un equipo de dos trabajadores. Tres datos y dos trabajadores son cantidades distintas.",
      "process": "El proceso principal prepara los datos y llama a map. Los trabajadores ejecutan la función con los datos recibidos; uno puede terminar una llamada y atender otra. El principal espera a que map reúna todas las respuestas.",
      "output": "Recibes una lista con una respuesta por dato, en el orden de entrada. Esta lista comprueba el cálculo, pero por sí sola no identifica qué trabajador realizó cada llamada.",
      "reading": [
        {
          "anchor": "from multiprocessing import Pool",
          "explanation": "Importa la herramienta que administra el grupo de procesos. No cambia el cálculo de suma_cuadrados."
        },
        {
          "anchor": "if __name__ == \"__main__\":",
          "explanation": "Protege el arranque del programa. Mantén la creación del Pool dentro de este bloque y ejecuta el archivo .py completo desde la terminal."
        },
        {
          "anchor": "with Pool(processes=2) as pool:",
          "explanation": "Crea dos procesos trabajadores y permite utilizar el grupo con el nombre pool. Al salir de este bloque se liberan sus recursos."
        },
        {
          "anchor": "pool.map(suma_cuadrados, datos)",
          "explanation": "Entrega la función y la lista de datos. Escribe el nombre de la función sin llamarla aquí: cada llamada la ejecutará un trabajador."
        },
        {
          "anchor": "print(resultados)",
          "explanation": "Esta línea llega después de obtener todas las respuestas. El orden de la lista final corresponde al de datos, aunque las llamadas terminen en otro orden."
        }
      ],
      "firstRun": "Abre «Cómo funciona Pool por dentro» para recorrer la explicación y el simulador. Después pliégalo y prepara la primera ejecución: crea 04_pool.py con dos trabajadores y datos = [3, 5, 10], guarda tu predicción y ejecuta el programa original.",
      "experiment": "Cuando la prueba inicial sea correcta, cambia solo datos a [10, 3, 5]. Conserva processes=2 y la misma función. Comprobarás qué orden aparece en la lista devuelta.",
      "checkpoint": "Señala en el programa quién prepara el trabajo, qué define una tarea completa y dónde se decide cuántos trabajadores habrá."
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
    "narrative": "Ya has obtenido resultados con Pool. Ahora vas a leer mensajes de cada proceso para averiguar quién atiende las tareas y cómo se reutilizan los trabajadores.",
    "goal": "Leer una ejecución concurrente sin confundir el orden de los mensajes con el de los resultados.",
    "concepts": [
      {
        "term": "PID: identidad del proceso",
        "text": "os.getpid() devuelve un número que permite reconocer al proceso durante esa ejecución. No es su posición en la lista ni un número de núcleo."
      },
      {
        "term": "Solapamiento",
        "text": "Dos tareas se solapan cuando una empieza antes de que la otra termine. sleep(1) facilita verlo porque introduce una espera visible."
      },
      {
        "term": "Trabajadores reutilizados",
        "text": "Un mismo PID puede aparecer en varias tareas. chunksize=1 envía cada dato como un lote de una tarea; sin ese ajuste, map agrupa datos automáticamente."
      }
    ],
    "walkthrough": [
      "Crea 05_observar.py con el código de partida. Localiza el PID principal, los mensajes INICIO y FIN y la pausa de un segundo.",
      "Guarda tu predicción para la ejecución inicial con seis datos y procesos = 2.",
      "Guarda, ejecuta y espera a que aparezca Tiempo total. Copia toda esa ejecución en «Prueba inicial»; los mensajes intermedios son parte de la prueba.",
      "Después cambia solo procesos a 1, ejecuta y pega el registro nuevo en «Experimento». Compara la reutilización de los PID y los tiempos."
    ],
    "code": "import os\nfrom multiprocessing import Pool\nfrom time import perf_counter, sleep\n\n\ndef suma_cuadrados(numero):\n    # PID significa identificador del proceso que ejecuta esta llamada.\n    pid = os.getpid()\n    print(f\"INICIO: dato {numero}, proceso {pid}\", flush=True)\n\n    # Pausa didáctica: permite ver cómo se solapan varias tareas.\n    sleep(1)\n\n    total = 0\n    for valor in range(1, numero + 1):\n        total = total + valor * valor\n\n    # flush=True pide que el mensaje se envíe a la salida inmediatamente.\n    print(f\"FIN: dato {numero}, proceso {pid}, resultado {total}\", flush=True)\n    return total\n\n\nif __name__ == \"__main__\":\n    datos = [1, 2, 3, 4, 5, 6]\n    procesos = 2\n\n    print(\"PID del proceso principal:\", os.getpid(), flush=True)\n    inicio = perf_counter()\n\n    with Pool(processes=procesos) as pool:\n        print(\"Antes de map: entrego las tareas.\", flush=True)\n        # chunksize=1 envía cada dato como un lote de una sola tarea.\n        resultados = pool.map(suma_cuadrados, datos, chunksize=1)\n        print(\"Después de map: todos los resultados están disponibles.\", flush=True)\n\n    duracion = perf_counter() - inicio\n    print(\"Resultados:\", resultados)\n    print(f\"Tiempo total: {duracion:.2f} segundos\")\n",
    "fileName": "05_observar.py",
    "command": "python 05_observar.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Primera ejecución de 05_observar.py: conserva procesos = 2 y los seis datos originales. Pega toda la salida, desde PID del proceso principal hasta Tiempo total, incluidos los mensajes INICIO y FIN.",
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
        "prompt": "Después de comprobar el registro inicial, cambia solo la línea procesos = 2 por procesos = 1. Conserva los seis datos y sleep(1). Guarda, ejecuta y pega el registro completo de esta segunda ejecución.",
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
    "predictionPrompt": "La primera prueba tiene seis tareas y dos trabajadores. ¿Esperas encontrar un PID de trabajador distinto para cada tarea o algún PID repetido? ¿Podrá aparecer otro INICIO antes del primer FIN? Razona tu predicción.",
    "evidencePrompt": "Cita dos líneas de tu salida que muestren la reutilización de un trabajador. Compara las pruebas con dos y con un trabajador. Explica cuándo aparece «Después de map» y qué diferencia hay entre el orden de los mensajes y el de la lista final.",
    "previousPredictionPrompt": "Al pasar de dos trabajadores a uno, ¿qué esperas que ocurra con los PID, el solapamiento de las tareas y la lista final?",
    "learningContext": {
      "bridge": "La lista final de la misión 4 no nos decía quién había calculado cada dato. Añadiremos información a la salida para seguir a los procesos durante el trabajo.",
      "scenario": "Cada proceso tiene un identificador llamado PID. Si anotas ese número al empezar y terminar una tarea, puedes reconocer al trabajador y comprobar si atiende más de una llamada.",
      "input": "El programa recibe seis datos, [1, 2, 3, 4, 5, 6], y prepara dos trabajadores. Cada dato sigue siendo el límite de una suma de cuadrados.",
      "process": "Cada trabajador imprime INICIO con su PID, espera un segundo, calcula y muestra FIN con el mismo PID. La pausa hace más fácil observar tareas que coinciden en el tiempo.",
      "output": "La terminal mostrará el PID principal, mensajes de las tareas, la lista de resultados y una duración. El orden de los mensajes y los números PID pueden variar entre ejecuciones.",
      "reading": [
        {
          "anchor": "pid = os.getpid()",
          "explanation": "Obtiene el identificador del proceso que ejecuta esta llamada. Es un número asignado por el sistema operativo; no indica un núcleo de CPU."
        },
        {
          "anchor": "print(f\"INICIO: dato {numero}, proceso {pid}\", flush=True)",
          "explanation": "Relaciona un dato con su trabajador. flush=True pide enviar el mensaje a la salida sin dejarlo esperando en el búfer."
        },
        {
          "anchor": "sleep(1)",
          "explanation": "Añade una espera didáctica de un segundo a cada tarea. Durante esa pausa el trabajador no está haciendo el cálculo."
        },
        {
          "anchor": "pool.map(suma_cuadrados, datos, chunksize=1)",
          "explanation": "Cada lote contiene un dato. Esto facilita seguir el reparto entre los trabajadores; si omites chunksize, map calcula automáticamente el tamaño de los lotes."
        },
        {
          "anchor": "Después de map: todos los resultados están disponibles.",
          "explanation": "Este mensaje lo imprime el principal después de que map haya reunido las respuestas. Busca en qué posición aparece respecto a los mensajes FIN."
        }
      ],
      "firstRun": "Crea 05_observar.py y conserva procesos = 2, los seis datos y sleep(1). Pega toda la ejecución, desde el PID principal hasta Tiempo total.",
      "experiment": "Después de comprobar la salida inicial, localiza procesos = 2 y cambia solo ese valor a 1. Mantén los seis datos, la pausa y chunksize=1 para comparar el reparto.",
      "checkpoint": "Busca en el código qué mensaje saldrá del principal y cuáles saldrán de los trabajadores. ¿Cómo podrás distinguirlos?"
    }
  },
  {
    "id": "benchmark",
    "number": 6,
    "title": "Ponlos a prueba",
    "shortTitle": "Comparar tiempos",
    "category": "Experimento",
    "minutes": "12–18 min",
    "xp": 100,
    "narrative": "Ya has visto a los trabajadores actuar. Ahora medirás una ejecución secuencial y otra con Pool usando exactamente el mismo cálculo, para decidir cuándo compensa repartirlo.",
    "goal": "Comparar resultados y tiempos, incluyendo el coste de crear y coordinar el Pool.",
    "concepts": [
      {
        "term": "Una comparación justa",
        "text": "Ambas versiones reciben los mismos datos y usan la misma función. Comprueba primero «Resultados iguales: True» y después estudia las duraciones."
      },
      {
        "term": "Coste completo",
        "text": "El cronómetro del Pool incluye crearlo, repartir llamadas, recoger respuestas y salir del bloque with. Esa organización también consume tiempo."
      },
      {
        "term": "El factor y el equipo",
        "text": "El factor divide tiempo secuencial entre tiempo con Pool. Su resultado depende del trabajo y del equipo. os.cpu_count() muestra núcleos lógicos detectados; no mide cuántos están libres ni garantiza una aceleración."
      }
    ],
    "walkthrough": [
      "Crea 06_comparar.py y localiza las dos mediciones. Comprueba que ambas usan la misma función y los mismos ocho datos de un millón.",
      "Guarda tu predicción para esta primera comparación con procesos = 2.",
      "Guarda y ejecuta el archivo completo. Espera a que termine y pega todas sus líneas en «Prueba inicial». Revisa primero la igualdad y después los tiempos.",
      "A continuación cambia solo el tamaño de cada tarea a 100 como indica «Experimento». Mantén ocho tareas y dos trabajadores y compara la salida nueva."
    ],
    "code": "import os\nfrom multiprocessing import Pool\nfrom time import perf_counter\n\n\ndef suma_cuadrados(numero):\n    # Aquí no usamos print ni sleep: queremos medir el trabajo de cálculo.\n    total = 0\n    for valor in range(1, numero + 1):\n        total = total + valor * valor\n    return total\n\n\nif __name__ == \"__main__\":\n    # Cambia una variable cada vez para poder interpretar el experimento.\n    datos = [1_000_000] * 8\n    procesos = 2\n\n    # Primera medición: un proceso hace todas las tareas una tras otra.\n    inicio = perf_counter()\n    secuencial = []\n    for numero in datos:\n        secuencial.append(suma_cuadrados(numero))\n    tiempo_secuencial = perf_counter() - inicio\n\n    # Segunda medición: los mismos datos y la misma función con Pool.\n    # Empezamos a medir ANTES de crear los procesos.\n    inicio = perf_counter()\n    with Pool(processes=procesos) as pool:\n        paralelo = pool.map(suma_cuadrados, datos)\n    # Paramos DESPUÉS de salir del bloque with.\n    tiempo_pool = perf_counter() - inicio\n\n    print(\"Número de tareas:\", len(datos))\n    print(\"Procesos trabajadores:\", procesos)\n    # Núcleos lógicos que ve el sistema operativo: limitan cuánto puede mejorar Pool.\n    print(\"Núcleos lógicos del equipo:\", os.cpu_count())\n    print(\"Resultados iguales:\", secuencial == paralelo)\n    print(\"Primer resultado:\", paralelo[0])\n    # Seis decimales: las tareas pequeñas tardan microsegundos.\n    print(f\"Tiempo secuencial: {tiempo_secuencial:.6f} segundos\")\n    print(f\"Tiempo con Pool: {tiempo_pool:.6f} segundos\")\n\n    # >1: Pool fue más rápido; <1: la versión secuencial fue más rápida.\n    factor = tiempo_secuencial / tiempo_pool\n    print(f\"Factor secuencial/Pool: {factor:.4f}\")\n",
    "fileName": "06_comparar.py",
    "command": "python 06_comparar.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Primera ejecución de 06_comparar.py: conserva datos = [1_000_000] * 8 y procesos = 2. El programa mide ambas versiones. Pega toda la salida, incluidos Resultados iguales, las dos duraciones y el factor.",
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
        "prompt": "Después de registrar la comparación inicial, cambia solo datos = [1_000_000] * 8 por datos = [100] * 8. Mantén procesos = 2: siguen siendo ocho tareas, ahora más pequeñas. Guarda, ejecuta y pega toda la salida.",
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
    "predictionPrompt": "En la primera comparación, ambas versiones realizan ocho cálculos hasta un millón y Pool tiene dos trabajadores. ¿Esperas resultados iguales? ¿Cuál crees que tardará menos y por qué? No necesitas adivinar una duración exacta.",
    "evidencePrompt": "Compara los tiempos y factores de las pruebas con límite de un millón y con límite de 100. Repite una configuración tres veces y anota las medidas. Explica qué puedes concluir de tu equipo y qué no puedes generalizar.",
    "previousPredictionPrompt": "Al hacer las ocho tareas mucho más pequeñas, ¿crees que se mantendrá la ventaja de repartirlas? Razona qué costes siguen existiendo.",
    "learningContext": {
      "bridge": "La misión 3 enseñó a medir duraciones y la 5 hizo visible el reparto con una pausa. Aquí recuperamos la medición y quitamos las pausas y mensajes del cálculo para comparar trabajo real.",
      "scenario": "Organizar los procesos también cuesta tiempo. Vamos a medir la versión secuencial y la versión con Pool dentro del mismo programa, sin dar por hecho cuál será más rápida.",
      "input": "datos = [1_000_000] * 8 crea ocho datos iguales: ocho llamadas que calculan hasta un millón. procesos = 2 fija los trabajadores de la versión con Pool.",
      "process": "Primero se ejecutan y miden todas las llamadas una detrás de otra. Después se repiten las mismas llamadas con Pool, midiendo también la creación y el cierre del grupo.",
      "output": "La salida indica si ambas listas coinciden, sus duraciones y el factor secuencial/Pool. También muestra los núcleos lógicos detectados por os.cpu_count(); esa cifra no dice cuántos están libres.",
      "reading": [
        {
          "anchor": "datos = [1_000_000] * 8",
          "explanation": "Los guiones bajos hacen legible el número un millón. Multiplicar la lista por 8 repite el dato ocho veces; no multiplica su valor."
        },
        {
          "anchor": "procesos = 2",
          "explanation": "Esta variable controla el número de trabajadores de Pool. La versión secuencial sigue utilizando el proceso principal."
        },
        {
          "anchor": "inicio = perf_counter()",
          "explanation": "Marca el comienzo de cada medición. Revisa qué instrucciones quedan entre ese comienzo y el cálculo de cada duración."
        },
        {
          "anchor": "secuencial == paralelo",
          "explanation": "Compara las listas de resultados. True indica que coinciden y False que hay una diferencia que debes investigar antes de comparar velocidades."
        },
        {
          "anchor": "factor = tiempo_secuencial / tiempo_pool",
          "explanation": "Es una razón entre duraciones. Un valor mayor que 1 favorece al Pool; uno menor que 1 indica que el secuencial tardó menos en esa ejecución."
        }
      ],
      "firstRun": "Crea 06_comparar.py y conserva [1_000_000] * 8 y procesos = 2. Ejecuta el archivo completo y pega todas sus líneas, incluidas la igualdad de resultados y las dos duraciones.",
      "experiment": "Después cambia solo datos = [1_000_000] * 8 por datos = [100] * 8. Siguen siendo ocho tareas y dos trabajadores; reduces el trabajo de cada llamada, no su cantidad.",
      "checkpoint": "¿Estás comparando las mismas llamadas? Localiza también el tiempo de crear el Pool: debe formar parte de su coste."
    }
  },
  {
    "id": "starmap",
    "number": 7,
    "title": "Trabajo en pareja",
    "shortTitle": "Varios argumentos",
    "category": "Ampliación",
    "minutes": "8–12 min",
    "xp": 100,
    "narrative": "Hasta ahora cada llamada recibía un número. Ahora usarás una función que necesita dos números y aprenderás a entregar ambos a cada trabajador.",
    "goal": "Repartir llamadas a una función con dos argumentos mediante starmap.",
    "concepts": [
      {
        "term": "Argumento y parámetro",
        "text": "En multiplicar(2, 3), los argumentos son 2 y 3. Dentro de la función, los parámetros a y b reciben esos valores."
      },
      {
        "term": "Una pareja por tarea",
        "text": "(2, 3) es una tupla de dos valores. La lista agrupa varias tuplas y cada una describe una llamada completa."
      },
      {
        "term": "starmap",
        "text": "Separa los elementos de cada pareja y los pasa como argumentos de una llamada. Con map, esta función recibiría un solo argumento y Python mostraría un TypeError por faltar b."
      }
    ],
    "walkthrough": [
      "Crea 07_starmap.py con el código de partida. Identifica la función multiplicar y relaciona cada pareja con sus dos parámetros.",
      "Guarda una predicción para las tres parejas originales, antes de ejecutar el programa.",
      "Guarda, ejecuta y pega la lista obtenida en «Prueba inicial».",
      "Después añade (8, 9) al final de parejas, como indica «Experimento». Ejecuta otra vez y pega la lista completa con la respuesta añadida."
    ],
    "code": "from multiprocessing import Pool\n\n\ndef multiplicar(a, b):\n    return a * b\n\n\nif __name__ == \"__main__\":\n    # Cada pareja contiene los argumentos de una llamada a multiplicar.\n    parejas = [(2, 3), (4, 5), (6, 7)]\n\n    with Pool(processes=2) as pool:\n        # Equivale a repartir multiplicar(2, 3), multiplicar(4, 5), etc.\n        resultados = pool.starmap(multiplicar, parejas)\n\n    print(resultados)\n",
    "fileName": "07_starmap.py",
    "command": "python 07_starmap.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Primera ejecución de 07_starmap.py: conserva parejas = [(2, 3), (4, 5), (6, 7)]. Guarda, ejecuta y pega la lista completa de resultados.",
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
        "prompt": "Tras comprobar la primera lista, localiza parejas y añade (8, 9) al final, conservando las tres parejas anteriores. Mantén dos trabajadores y starmap. Guarda, ejecuta y pega la lista completa.",
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
    "predictionPrompt": "La primera ejecución usa las parejas (2, 3), (4, 5) y (6, 7). ¿Qué operación realizará cada llamada y cuántas respuestas esperas? Explica cómo llegan los dos números a multiplicar.",
    "evidencePrompt": "Escribe la llamada que representa una pareja de tu lista. Explica por qué usas starmap y qué argumento faltaría al usar map con esta función. Describe qué cambió al añadir la cuarta pareja.",
    "previousPredictionPrompt": "Al añadir una pareja a la entrada, ¿cuántas llamadas habrá y cuántos argumentos recibirá cada una? ¿Necesitas crear otro trabajador?",
    "learningContext": {
      "bridge": "Ya sabes repartir llamadas con map. Vamos a cambiar de función para introducir una necesidad nueva: pasar dos argumentos en una misma llamada.",
      "scenario": "Usaremos multiplicar(a, b), una operación breve para centrar la atención en cómo llegan los datos. El objetivo de esta misión es comprender starmap, no medir una mejora de velocidad.",
      "input": "parejas contiene (2, 3), (4, 5) y (6, 7). Cada pareja, escrita entre paréntesis, es una tupla: un grupo con los dos valores de una tarea.",
      "process": "starmap toma una pareja y entrega su primer valor al parámetro a y el segundo a b. Un trabajador ejecuta esa multiplicación y devuelve un resultado.",
      "output": "La terminal muestra una lista con una respuesta por pareja, conservando su orden. El equipo sigue teniendo dos trabajadores, aunque haya tres llamadas.",
      "reading": [
        {
          "anchor": "def multiplicar(a, b):",
          "explanation": "La función tiene dos parámetros. Para realizar una llamada necesitamos proporcionar dos valores."
        },
        {
          "anchor": "return a * b",
          "explanation": "Devuelve el producto de esos dos valores. Aquí no hay un bucle de suma de cuadrados."
        },
        {
          "anchor": "parejas = [(2, 3), (4, 5), (6, 7)]",
          "explanation": "Los corchetes delimitan la lista de tareas. Cada pareja de paréntesis agrupa los dos argumentos de una llamada."
        },
        {
          "anchor": "with Pool(processes=2) as pool:",
          "explanation": "Mantiene un equipo de dos trabajadores que puede atender todas las parejas, reutilizando procesos."
        },
        {
          "anchor": "pool.starmap(multiplicar, parejas)",
          "explanation": "Separa cada pareja para llamar a multiplicar con dos argumentos. map entregaría la pareja entera como un solo argumento y, con esta función, faltaría b."
        }
      ],
      "firstRun": "Crea 07_starmap.py y conserva las tres parejas originales y los dos trabajadores. Ejecuta el programa y pega la lista completa en la prueba inicial.",
      "experiment": "Después añade la pareja (8, 9) al final de la lista parejas. Mantén las tres anteriores, la función multiplicar y el número de trabajadores.",
      "checkpoint": "Expresa la primera pareja como una llamada: ¿qué valor recibirá a y cuál recibirá b?"
    }
  },
  {
    "id": "final",
    "number": 8,
    "title": "Toma el mando",
    "shortTitle": "Reto de cubos",
    "category": "Misión final",
    "minutes": "12–18 min",
    "xp": 100,
    "narrative": "Vas a adaptar el programa a un cálculo nuevo: la suma de cubos. Tendrás que corregir la operación y demostrar, con un caso que puedas revisar a mano, que ambas versiones calculan lo pedido.",
    "goal": "Completar una función de suma de cubos y verificar su resultado por dos caminos.",
    "concepts": [
      {
        "term": "Un código por completar",
        "text": "TODO significa que hay trabajo pendiente. La línea marcada aún suma cuadrados; debes adaptarla para sumar cubos."
      },
      {
        "term": "Sumar cubos",
        "text": "El cubo de un número es ese número multiplicado por sí mismo tres veces. Para una entrada de 3 queremos sumar 1³, 2³ y 3³."
      },
      {
        "term": "Dos comprobaciones",
        "text": "Las versiones deben coincidir entre sí y producir los cubos correctos. Revisa un caso a mano para comprobar también el cálculo."
      }
    ],
    "walkthrough": [
      "Crea 08_reto_cubos.py con el código de partida. Lee qué cálculo se solicita y localiza el TODO: el programa todavía está por completar.",
      "Guarda tu predicción antes de la primera ejecución. Después completa la operación y revisa a mano un caso pequeño.",
      "Guarda y ejecuta con datos = [2, 3, 4]. Pega las tres líneas en «Prueba inicial» y añade tu código corregido al cuaderno.",
      "Cuando la primera prueba esté comprobada, amplía solo datos a [1, 2, 3, 4, 5]. Ejecuta y comprueba las tres líneas del experimento."
    ],
    "code": "from multiprocessing import Pool\n\n\ndef suma_cubos(numero):\n    total = 0\n\n    for valor in range(1, numero + 1):\n        # TODO: cambia esta operación para sumar CUBOS.\n        # Esta línea aún calcula cuadrados: tu misión es completarla.\n        total = total + valor * valor\n\n    return total\n\n\nif __name__ == \"__main__\":\n    datos = [2, 3, 4]\n\n    # Comprobamos la misma función de las dos formas.\n    secuencial = []\n    for numero in datos:\n        secuencial.append(suma_cubos(numero))\n\n    with Pool(processes=2) as pool:\n        paralelo = pool.map(suma_cubos, datos)\n\n    print(\"Secuencial:\", secuencial)\n    print(\"Pool:\", paralelo)\n    print(\"Resultados iguales:\", secuencial == paralelo)\n",
    "fileName": "08_reto_cubos.py",
    "command": "python 08_reto_cubos.py",
    "trials": [
      {
        "id": "base",
        "label": "Prueba inicial",
        "prompt": "Primera prueba: completa el TODO de 08_reto_cubos.py para sumar cubos y conserva datos = [2, 3, 4]. Ejecuta y pega las tres líneas: Secuencial, Pool y Resultados iguales.",
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
        "prompt": "Después de comprobar la función corregida, sustituye solo datos = [2, 3, 4] por datos = [1, 2, 3, 4, 5]. Guarda, ejecuta y pega las tres líneas nuevas.",
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
      "Un cubo es el producto de tres factores iguales. Piensa qué operación necesita cada término antes de sumarlo al total y cómo expresarla en Python. Mantén el acumulador y el return.",
      "Comprueba a mano el caso de entrada 2: debes sumar el cubo de 1 y el cubo de 2. Usa ese caso para revisar la operación del bucle antes de ampliar los datos."
    ],
    "takeaway": "Puedes cambiar el cálculo manteniendo el reparto. Comprobar resultados forma parte de programar.",
    "predictionPrompt": "Antes de ejecutar por primera vez, piensa en el TODO que vas a corregir. Si ambas versiones conservaran por error la operación de cuadrados, ¿podría aparecer «Resultados iguales: True»? Explica qué caso pequeño usarás para comprobar que realmente calculan cubos.",
    "evidencePrompt": "Incluye tu código final. Explica qué cambiaste en el TODO y comprueba a mano un caso pequeño. Propón un trabajo real con varias tareas independientes donde valorarías usar Pool e indica qué medirías para decidir si compensa.",
    "previousPredictionPrompt": "Si dejas por error el cálculo de cuadrados en ambas versiones, ¿podrían coincidir sus listas? ¿Cómo detectarías que todavía no calculan cubos?",
    "learningContext": {
      "bridge": "Ya has preparado datos, repartido llamadas y comprobado resultados. El reto final reúne esas decisiones cambiando la operación que realiza cada tarea.",
      "scenario": "El código de partida contiene una línea incompleta marcada TODO. La función se llama suma_cubos, pero todavía calcula cuadrados: el nombre no cambia lo que hacen sus instrucciones.",
      "input": "datos = [2, 3, 4] pide tres cálculos. Para cada dato n queremos sumar los cubos de los enteros desde 1 hasta n; por ejemplo, con 3 la operación es 1³ + 2³ + 3³.",
      "process": "Completa la operación dentro del bucle sin cambiar la estructura del recorrido. El programa probará esa misma función de forma secuencial y mediante un Pool de dos trabajadores.",
      "output": "Aparecerán las listas «Secuencial» y «Pool» y la comparación «Resultados iguales». Dos listas iguales pueden contener el mismo error; también necesitas comprobar que los números sean sumas de cubos.",
      "reading": [
        {
          "anchor": "def suma_cubos(numero):",
          "explanation": "El nombre expresa lo que queremos calcular. Revisa las instrucciones del cuerpo para comprobar que realmente lo hace."
        },
        {
          "anchor": "# TODO: cambia esta operación para sumar CUBOS.",
          "explanation": "TODO señala una tarea pendiente. Un cubo multiplica un número por sí mismo tres veces; decide cómo adaptar la operación del bucle."
        },
        {
          "anchor": "for numero in datos:",
          "explanation": "La versión secuencial llama a la función una vez por dato y guarda cada respuesta."
        },
        {
          "anchor": "pool.map(suma_cubos, datos)",
          "explanation": "La versión con Pool reparte llamadas a esa misma función. Si la función tiene un error, ambas versiones pueden repetirlo."
        },
        {
          "anchor": "secuencial == paralelo",
          "explanation": "Comprueba que las dos listas coinciden. Completa esa comprobación calculando a mano un caso pequeño y contrastándolo con la salida."
        }
      ],
      "firstRun": "Crea 08_reto_cubos.py, guarda tu predicción y resuelve el TODO. La primera prueba pide el programa ya corregido con datos = [2, 3, 4] y sus tres líneas de salida.",
      "experiment": "Cuando hayas comprobado la primera prueba, cambia solo datos a [1, 2, 3, 4, 5]. Conserva la operación corregida y los dos trabajadores para comprobar más entradas.",
      "checkpoint": "¿Qué caso pequeño puedes resolver a mano para distinguir una suma de cuadrados de una suma de cubos?"
    }
  }
];
