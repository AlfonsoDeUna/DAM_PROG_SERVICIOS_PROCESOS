# Pool Lab · Guía de uso en el aula

[Abrir el laboratorio](https://alfonsodeuna.github.io/DAM_PROG_SERVICIOS_PROCESOS/2627/20261023/)

**Módulo:** Programación de Servicios y Procesos · Python.  
**Material necesario:** Python 3, un editor y una terminal. Los programas se ejecutan como archivos `.py` en el equipo del alumno; la web recoge las salidas y organiza el cuaderno.

## Qué queremos que aprendan

Al terminar el trabajo, el alumnado debería poder:

- Distinguir una **tarea**, un **proceso trabajador** y un **núcleo de CPU**, usando un ejemplo propio.
- Explicar para qué sirve `Pool`, cómo reutiliza trabajadores y qué trabajo describe cada elemento de la entrada de `map`.
- Seguir una ejecución mediante los PID y diferenciar el orden de los mensajes del orden de los resultados.
- Comparar una ejecución secuencial con otra mediante Pool, manteniendo el mismo trabajo y considerando el coste de coordinación.
- Comprobar la corrección de una función y justificar cuándo tendría sentido repartir sus llamadas.

La evidencia principal es la relación entre **predicción, ejecución y explicación**. Acertar una opción es un paso del recorrido; la explicación propia permite valorar lo comprendido.

## Organización orientativa: dos sesiones de 55 minutos

Los tiempos son una referencia para un grupo que ya conoce funciones, bucles y listas. Conviene detenerse en las misiones 4 y 5 si aparecen confusiones. No es necesario completar las ocho misiones en 110 minutos.

| Sesión | Tiempo orientativo | Trabajo y decisión docente |
| --- | --- | --- |
| 1 | 5 min | Portada, nombre y propósito: «¿Qué trabajo podemos repartir y cómo sabremos quién lo ha hecho?» |
| 1 | 10 min | Misiones 1–2 como recuperación de conocimientos: una llamada, varias llamadas y resultados en orden. |
| 1 | 15 min | Misión 3: programación propia del cronómetro. Revisar qué bloque ha decidido medir cada alumno. |
| 1 | 20 min | Misión 4: explicación de Pool, trabajadores y `map`; predicción y pruebas. Priorizar la comprensión frente a avanzar. |
| 1 | 5 min | Anotar una evidencia y una duda. Guardar copia del progreso. |
| 2 | 5 min | Recuperar la diferencia entre tarea, trabajador y núcleo. Contrastar dos explicaciones del grupo. |
| 2 | 20 min | Misión 5: observar PID, reutilización y espera de `map`. Usar líneas concretas de la salida como pruebas. |
| 2 | 15 min | Misión 6: comparar tiempos; cambiar una variable y discutir el resultado, gane la versión que gane. |
| 2 | 10 min | Completar explicaciones del cuaderno y realizar una defensa breve con el profesor o con un compañero. |
| 2 | 5 min | Descargar el cuaderno alcanzado y comprobar que se abre correctamente. |

**Continuación:** la misión 7 amplía a funciones con varios argumentos y la 8 propone una transferencia a un cálculo nuevo. En la aplicación, el recorrido completo conserva las ocho misiones en orden. Si se exige terminarlo, reservar tiempo posterior para ambas; si la entrega corresponde al trabajo de estas dos sesiones, aceptar el cuaderno parcial con sus pendientes identificados. Un borrador no debe presentarse como recorrido completo.

## Cómo conducir el aprendizaje

1. **Predecir.** Antes de ejecutar, pedir una respuesta breve y una razón. Ejemplo: «Hay tres datos y dos trabajadores: ¿cuántas llamadas habrá?». Conservar la primera idea para poder revisarla después.
2. **Ejecutar.** Cambiar una variable cada vez, guardar el archivo y pegar la salida real. Si aparece un error, leer el mensaje y formular una hipótesis antes de volver a probar.
3. **Explicar.** Pedir que citen una línea, un PID, un valor o una medida que apoye su explicación. «Ha salido bien» resulta insuficiente.
4. **Transferir.** Proponer un cambio pequeño y pedir que lo justifiquen: más trabajadores con una sola tarea, tareas muy pequeñas o una función que necesita otro número de argumentos.

### Dos momentos clave

**Misión 3: autoría del programa.** No se proporciona el código del cronómetro. Las consignas delimitan el trabajo y el formato de salida. El alumno debe decidir cómo implementarlo y adjuntar su código al cuaderno. La ayuda puede consistir en revisar el bloque medido o consultar la documentación, sin entregar una solución completa.

**Misiones 4–5: el núcleo del laboratorio.** En la 4 se construye el modelo de funcionamiento; en la 5 se busca evidencia de ese modelo en una ejecución. Resulta útil contrastar primero las explicaciones por parejas y pedir después a cada alumno que escriba la suya. No exigir que todos observen los mismos PID, el mismo reparto o los mismos tiempos.

## Entrega en Moodle

**Título sugerido:** «Pool Lab: cuaderno de experimentos con procesos».

El alumno entrega el **PDF del cuaderno descargado desde el laboratorio**, correspondiente a las misiones que haya indicado el profesor. En **Mi cuaderno**, pulsa **Preparar cuaderno PDF** y después **Guardar PDF preparado**. Antes de subirlo debe abrirlo y comprobar:

- Que aparecen su nombre, la fecha y el avance real del recorrido.
- Que se incluyen sus predicciones, salidas de ambas pruebas y explicaciones propias.
- Que constan los intentos y las correcciones, cuando los haya. Equivocarse y justificar la revisión forma parte del aprendizaje.
- Que el código propio de la misión 3 y el código final de la misión 8 están incorporados cuando esas misiones formen parte de la entrega.
- Que los apartados aún pendientes están identificados. Una entrega parcial debe indicarlo expresamente.

El archivo **JSON es una copia para recuperar el progreso**, no sustituye al cuaderno que se entrega. Puede conservarlo el alumno y adjuntarlo solo si el profesor lo solicita. No es necesario entregar capturas de cada clic: las salidas y las explicaciones relevantes quedan reunidas en el cuaderno.

## Pauta de revisión docente

Marcar cada criterio como **evidencia suficiente**, **revisar** o **pendiente**. No hay una nota automática asociada a los puntos del juego.

| Qué revisar | Evidencia que conviene encontrar |
| --- | --- |
| 1. Modelo de Pool | Distingue tarea, trabajador y núcleo; explica reutilización y por qué una tarea única no se divide automáticamente. |
| 2. Programación y corrección | Presenta su implementación del cronómetro y, si procede, el reto final; puede explicar el código y verificar un caso pequeño. |
| 3. Lectura de una ejecución | Usa PID y mensajes para justificar qué ocurrió; distingue orden de finalización y orden de la lista. |
| 4. Comparación de tiempos | Mantiene el mismo trabajo, identifica qué cambia, interpreta las duraciones y reconoce los costes y la variabilidad. |
| 5. Revisión y transferencia | Contrasta predicción y observación, explica una corrección y propone otro caso donde valoraría utilizar Pool. |

Las salidas pegadas no demuestran por sí solas la autoría ni la comprensión. Los XP registran avance, **no son una calificación**. La revisión del profesor y una modificación breve en directo permiten contrastar el cuaderno con lo que sabe hacer el alumno.

## Errores que merece la pena discutir

- Contar las vueltas del bucle interior como si fueran llamadas independientes para `map`.
- Suponer que cada trabajador es un núcleo reservado o que hace exactamente una tarea.
- Interpretar los mensajes de terminal como si tuvieran que aparecer en el mismo orden que la lista final.
- Dar por hecho que más procesos siempre reducen el tiempo o que un Pool más lento está mal programado.
- Considerar suficiente que dos listas coincidan cuando ambas usan la misma función equivocada.

## Tres preguntas para una defensa breve

1. **Una tarea y cuatro trabajadores:** «Dibuja o describe lo que puede repartirse. ¿Qué tendría que cambiar para que hubiera más llamadas independientes?». Pedir una modificación pequeña del ejemplo y que prediga su efecto.
2. **Una huella de ejecución:** «Señala dos líneas de tu salida que apoyen que un trabajador se ha reutilizado. ¿Qué información adicional necesitarías para hablar del núcleo de CPU?». Pedir que distinga observación e inferencia.
3. **Una decisión con medidas:** «Elige una de tus comparaciones. ¿Por qué usarías o no usarías Pool aquí? ¿Qué mantendrías igual y qué repetirías para comprobarlo?». Pedir que cite sus tiempos y no una regla memorizada.

## Referencias

- [Python: grupos de procesos, `Pool`, `map` y `starmap`](https://docs.python.org/3/library/multiprocessing.html#module-multiprocessing.pool).
- [Python: pautas de programación con procesos](https://docs.python.org/3/library/multiprocessing.html#programming-guidelines).
- [Python: `time.perf_counter`](https://docs.python.org/3/library/time.html#time.perf_counter).

Las actividades son una adaptación didáctica original sobre `multiprocessing.Pool`.
