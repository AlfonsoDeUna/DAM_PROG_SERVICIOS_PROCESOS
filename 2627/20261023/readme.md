# Pool Lab · Manual práctico de procesos

[Abrir el manual](https://alfonsodeuna.github.io/DAM_PROG_SERVICIOS_PROCESOS/2627/20261023/)

Un manual para aprender `multiprocessing.Pool` con ejemplos de Python, explicaciones y resultados que puedes comprobar. Los ocho apartados están disponibles desde el principio. El alumno y el profesor pueden abrir cualquiera sin iniciar sesión.

**Necesitas:** Python 3, un editor y una terminal. El programa se ejecuta en tu ordenador; en la web pegas su salida.

## Cómo trabajar

1. Abre un apartado y lee su explicación y los comentarios del código.
2. Prepara el archivo `.py` indicado. Guarda los cambios antes de ejecutarlo.
3. Ejecuta el comando que muestra el manual desde la carpeta del archivo.
4. Copia la salida de la terminal, pégala en la web y pulsa el botón para comprobarla.
5. Si aparece un error, lee la explicación, corrige tu archivo y vuelve a probar.

Cada apartado tiene **una prueba principal**. Puedes repetirla y pasar a otro apartado cuando quieras. No hay que completar cuestionarios, registrar predicciones ni conseguir puntos para continuar. Las notas y el código que añadas te ayudarán a recordar lo aprendido.

**Código, comando y salida son cosas distintas:** el código se escribe en el archivo; el comando lo ejecuta en la terminal; la salida son los mensajes o números que aparecen después. El comprobador necesita esa salida, no una copia del programa.

## Los ocho apartados

| Apartado | Qué vas a observar |
| --- | --- |
| 1. Una función | Qué dato recibe una función y qué resultado devuelve. |
| 2. Varias tareas | Cómo se resuelven varias llamadas una detrás de otra. |
| 3. Medir duraciones | Cómo medir el tiempo de ejecución con `perf_counter`. |
| 4. Pool y map | Cómo un equipo de procesos reparte las llamadas a una función. |
| 5. Observar procesos | Cómo los PID permiten seguir el trabajo de cada proceso. |
| 6. Comparar tiempos | Qué cambia al ejecutar el mismo trabajo en secuencial y con Pool. |
| 7. Varios argumentos | Cómo enviar parejas de argumentos mediante `starmap`. |
| 8. Reto de cubos | Cómo adaptar el cálculo y comprobar que las dos versiones dan el resultado correcto. |

Los apartados 1 a 7 forman el recorrido principal, incluido `starmap`. El apartado 8 es una ampliación opcional.

## La idea central: para qué sirve Pool

Un **Pool** crea un equipo de procesos trabajadores. El programa principal les entrega llamadas a una función. Cuando un trabajador termina una llamada, puede encargarse de otra: no necesitas crear un proceso nuevo para cada dato.

Con `pool.map(funcion, datos)`, cada elemento de `datos` sirve de entrada a una llamada. Si hay tres datos y dos trabajadores, hay tres tareas que repartir entre dos procesos. `map` espera los resultados y devuelve una lista en el orden de los datos de entrada. Las tareas pueden terminar en otro orden.

Crear procesos, enviar datos y reunir resultados también consume tiempo. Por eso Pool puede tardar más con trabajos pequeños. En el apartado 6 interesa comprobar que las respuestas coinciden y explicar los tiempos observados; no hay una duración única que todos deban obtener. [Referencia de Python sobre Pool](https://docs.python.org/3/library/multiprocessing.html#module-multiprocessing.pool).

## Guardar y entregar el cuaderno

Escribe tu nombre para identificar el trabajo. Los datos se guardan en este navegador. Descarga el cuaderno al terminar la sesión o antes de cambiar de equipo.

Puedes obtener el cuaderno en **PDF o HTML**, incluso si solo has trabajado algunos apartados. El HTML también permite usar **Imprimir → Guardar como PDF**. No hace falta completar el manual entero para descargar una entrega parcial.

Antes de subirlo a la tarea, abre el archivo y comprueba:

- Que aparece tu nombre.
- Que recoge las salidas y comprobaciones de los apartados que has trabajado.
- Que aparecen tus notas y tu código, si los has añadido.
- Que puedes explicar al profesor qué has ejecutado y qué observaste.

Los intentos anteriores forman parte del trabajo. Una salida que coincide demuestra que esa comprobación encaja; el profesor valorará también cómo explicas tu programa.

## Para el profesor

Puedes empezar directamente en el apartado que necesites y mostrarlo en clase. **No se necesita acceso docente ni un token para navegar por el manual.**

Pide una salida real y una explicación breve. En los apartados de Pool, comprueba que el alumno distingue una tarea de un trabajador. En la comparación de tiempos, pregunta qué trabajo se ha medido y por qué el resultado puede variar. Elige qué apartados debe incluir la entrega; se admite un cuaderno parcial.

## Referencias

- [Python: Pool, map y starmap](https://docs.python.org/3/library/multiprocessing.html#module-multiprocessing.pool).
- [Python: ejecución de programas con procesos](https://docs.python.org/3/library/multiprocessing.html#programming-guidelines).
- [Python: time.perf_counter](https://docs.python.org/3/library/time.html#time.perf_counter).

Las actividades son una adaptación didáctica original sobre `multiprocessing.Pool`.
