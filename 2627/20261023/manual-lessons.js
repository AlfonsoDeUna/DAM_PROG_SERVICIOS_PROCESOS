// Explicaciones breves para el manual. El código y el comprobador proceden de missions.js.
export const manualLessons = {
  sum: {
    intro: 'Empezamos con una suma de cuadrados. Para el dato 5, la función calcula 1² + 2² + 3² + 4² + 5².',
    points: [
      'def define la función suma_cuadrados. Su parámetro numero recibe el límite hasta el que vamos a calcular.',
      'range(1, numero + 1) recorre los enteros desde 1 hasta ese límite. valor es el número de cada vuelta y total acumula sus cuadrados.',
      'La línea resultado = suma_cuadrados(5) pide el cálculo con el límite 5 y guarda lo que devuelve la función.',
      'return entrega el resultado al programa; print(resultado) lo muestra en la terminal.'
    ],
    instruction: 'Guarda el código como 01_funcion.py y ejecútalo con la llamada suma_cuadrados(5). Pega el número que aparece en la terminal.',
    observe: 'El resultado reúne los cuadrados de todos los enteros del 1 al 5.'
  },
  sequence: {
    intro: 'Ahora pedimos tres cálculos completos y los hacemos uno detrás de otro. Eso significa ejecutar de forma secuencial.',
    points: [
      'datos = [3, 5, 10] contiene los límites de tres llamadas: una hasta 3, otra hasta 5 y otra hasta 10.',
      'El for exterior llama a suma_cuadrados con cada dato. Una llamada termina antes de empezar la siguiente.',
      'resultados empieza como una lista vacía. append añade cada respuesta al final y conserva el orden de datos.'
    ],
    instruction: 'Guarda y ejecuta 02_secuencial.py con datos = [3, 5, 10]. Pega la lista completa que imprime el programa.',
    observe: 'Las tres posiciones de la lista corresponden, en ese orden, a los límites 3, 5 y 10.'
  },
  timer: {
    intro: 'Escribe tu programa para medir cuánto tardan ocho llamadas a la función anterior. Cada llamada debe sumar los cuadrados del 1 al millón.',
    points: [
      'Reutiliza suma_cuadrados con su bucle de cálculo y conserva el bloque if __name__ == "__main__".',
      'Prepara ocho datos de un millón. Haz una llamada por dato, una tras otra, y guarda las respuestas en una lista.',
      'perf_counter() es un reloj del módulo time: toma una lectura antes de las ocho llamadas y otra después. La duración es la lectura final menos la inicial.',
      'Deja la preparación de los datos y la impresión fuera del intervalo medido. No añadas pausas ni mensajes dentro del cálculo.'
    ],
    instruction: 'Crea y ejecuta 03_cronometro.py. Imprime y pega tres líneas con estas etiquetas: «Cantidad de resultados:», «Primer resultado:» y «Tiempo secuencial:». Pon la longitud de tu lista, su primer elemento y la duración; añade «segundos» tras el tiempo.',
    observe: 'Se comprueban la cantidad y el cálculo. La duración depende de tu equipo y no tiene un valor obligatorio.'
  },
  pool: {
    intro: 'Pool reparte llamadas independientes entre varios procesos para aprovechar el equipo cuando hay suficiente trabajo. Es como un taller con dos trabajadores que atienden tres encargos.',
    points: [
      'datos = [3, 5, 10] describe tres tareas. processes=2 crea dos trabajadores; cada trabajador es un proceso que puede atender varias tareas.',
      'En pool.map(suma_cuadrados, datos), map entrega cada dato a la función como argumento. Escribimos suma_cuadrados sin paréntesis para que la llamen los trabajadores.',
      'map espera todas las respuestas y devuelve una lista en el orden de datos, aunque las tareas terminen en otro orden.',
      'with gestiona el Pool. El bloque if __name__ == "__main__" evita crear otro Pool cuando un proceso hijo importa el archivo.'
    ],
    instruction: 'Guarda y ejecuta el archivo completo 04_pool.py con dos trabajadores y datos = [3, 5, 10]. Pega la lista que imprime.',
    observe: 'Cada posición debe contener el mismo resultado que en la versión secuencial. Ahora las llamadas se reparten entre trabajadores.'
  },
  pids: {
    intro: 'Añadimos mensajes para ver qué proceso ejecuta cada llamada. Los seis datos se reparten entre dos trabajadores.',
    points: [
      'os.getpid() devuelve el PID: un número que identifica un proceso durante esa ejecución. El proceso principal también tiene su propio PID.',
      'Los mensajes INICIO y FIN indican el dato, el proceso y el resultado. Un mismo trabajador puede aparecer en varias tareas.',
      'sleep(1) introduce una pausa de un segundo para hacer visible el solapamiento. Esta pausa es una ayuda para observar, no trabajo de cálculo.',
      'chunksize=1 entrega los datos en lotes de una tarea. La línea «Después de map» se alcanza cuando están disponibles todos los resultados.'
    ],
    instruction: 'Ejecuta 05_observar.py con procesos = 2 y datos = [1, 2, 3, 4, 5, 6]. Pega toda la salida, desde «PID del proceso principal» hasta «Tiempo total», incluidos INICIO y FIN.',
    observe: 'Busca qué PID se repite en distintas tareas. Los números de PID y el orden de algunos mensajes pueden variar entre ejecuciones.'
  },
  benchmark: {
    intro: 'Este programa mide el mismo trabajo de dos formas: secuencial y con Pool. Así puedes comprobar si repartirlo compensa en tu equipo.',
    points: [
      'datos = [1_000_000] * 8 crea ocho entradas de un millón. Los guiones bajos solo facilitan leer el número.',
      'procesos = 2 fija dos trabajadores. os.cpu_count() muestra las CPU lógicas detectadas; no indica cuántas están libres.',
      'Ambas versiones usan la misma función y los mismos datos. El tiempo con Pool incluye crear los procesos, repartir el trabajo y recoger las respuestas.',
      'El factor divide el tiempo secuencial entre el tiempo con Pool: mayor que 1 significa que Pool fue más rápido; menor que 1, que fue más lento.'
    ],
    instruction: 'Ejecuta 06_comparar.py con ocho datos de un millón y dos trabajadores. Pega toda la salida, incluidas la igualdad de resultados, las dos duraciones y el factor.',
    observe: 'Los resultados deben coincidir. Cualquiera de las dos versiones puede tardar menos; crear y comunicar procesos también consume tiempo.'
  },
  starmap: {
    intro: 'Si una función necesita dos datos, starmap puede repartirlos por parejas. Aquí cada llamada multiplica dos números.',
    points: [
      'multiplicar(a, b) recibe dos argumentos. Por ejemplo, en multiplicar(2, 3), a recibe 2 y b recibe 3.',
      'parejas = [(2, 3), (4, 5), (6, 7)] contiene tres tareas. Cada pareja aporta los dos datos de una llamada.',
      'starmap separa cada pareja en argumentos y devuelve los productos en el orden de entrada. map pasaría la pareja como un único argumento.'
    ],
    instruction: 'Guarda y ejecuta 07_starmap.py con las tres parejas del ejemplo. Pega la lista completa que imprime.',
    observe: 'Hay un producto por pareja. Los trabajadores ejecutan la misma función con dos argumentos en cada llamada.',
    optional: 'Ampliación opcional'
  },
  final: {
    intro: 'Adapta la función para sumar cubos. Un cubo es el producto de tres factores iguales; con el límite 3 queremos sumar 1³ + 2³ + 3³.',
    points: [
      'La función se llama suma_cubos, pero la línea marcada TODO todavía calcula cuadrados. Cambia esa operación conservando el bucle y el acumulador.',
      'datos = [2, 3, 4] pide tres sumas: hasta 2, hasta 3 y hasta 4. El programa usa la misma función en secuencial y con dos trabajadores.',
      'Dos listas iguales pueden compartir un error. Revisa también un caso pequeño a mano para comprobar que realmente sumas cubos.'
    ],
    instruction: 'Completa el TODO de 08_reto_cubos.py y ejecútalo con datos = [2, 3, 4]. Pega las tres líneas: «Secuencial», «Pool» y «Resultados iguales».',
    observe: 'Las dos listas deben coincidir y contener las sumas de cubos correspondientes a cada límite.',
    optional: 'Ampliación opcional'
  }
};
