SINCRONIZACIÓN DE HILOS EN PYTHON
Ejemplos originales para Programación de Servicios y Procesos

REQUISITOS Y EJECUCIÓN

Python 3.10 o posterior. Solo se usa la biblioteca estándar.
Descomprime la carpeta completa, ábrela en VS Code y abre una terminal allí.
En Windows, por ejemplo:

    py 01_hilos.py
    py 03_lock.py

Si tu instalación usa el comando python o python3, úsalo en lugar de py.
Ejecuta los programas como archivos. No hace falta copiar bloques al intérprete.
No llames a tus archivos threading.py, queue.py, urllib.py ni random.py:
podrían ocultar los módulos de Python del mismo nombre.

Todos los programas tienen un cierre previsto. No necesitan paquetes externos.
Los mensajes de distintos hilos pueden intercalarse; no compares su orden con
una única salida de referencia. Un hilo bloqueado al esperar no está terminado.

RECORRIDO

01_hilos.py
  Compara Thread(target=...) con una subclase de Thread que define run().
  start() arranca un hilo nuevo. Llamar a run() directamente no lo hace.
  Se arrancan ambos hilos antes de hacer join() sobre ellos.
  Los seis trabajos terminan, pero su orden y el tiempo exacto pueden variar.

01a_compartir_archivo.py
  Explica el contexto de self.salida = salida antes de introducir concurrencia.
  Un solo open crea el objeto de archivo y dos objetos Escritor lo reciben.
  archivo es el nombre usado al llamar; salida, el parámetro del constructor;
  self.salida, el atributo que conserva esa referencia en cada escritor.
  La comparación con is muestra True y ambos mensajes aparecen en
  registro_compartido.txt. Las llamadas son secuenciales y no hay hilos aquí.
  El modo w reemplaza el archivo de demostración en cada ejecución.
  Actividad: renombrar el parámetro a fichero y cambiar self.salida = fichero.

01b_join_paso_a_paso.py
  Muestra completo el programa al que se refiere la pregunta sobre join.
  T1 hace dos pasos; T2 hace cuatro. El principal arranca ambos y espera a T1.
  t1.join() hace esperar al hilo que lo llama si T1 todavía no ha terminado.
  T2 puede avanzar durante esa espera. Después, el principal espera a T2.
  La pausa hace la ejecución observable; no garantiza tiempos ni orden exacto.
  Actividad: colocar t1.join() antes de t2.start() y explicar por qué, en esa
  variante, T2 no puede arrancar hasta que termina T1.

02_carrera.py
  Ejemplo incorrecto a propósito. Dos hilos deberían registrar 100 trabajos.
  Entre la lectura y la escritura se introduce una pausa artificial para que
  sea fácil observar incrementos perdidos. A menudo aparece un total menor.
  No se garantiza que falle en cada ejecución ni que produzca un total fijo.
  La pausa no es una técnica de sincronización. Incluso con GIL puede fallar.

03_lock.py
  Ambos hilos comparten el mismo Lock y protegen la lectura y la escritura
  del contador juntas. El total final es 100 en una ejecución sin errores.
  El trabajo simulado está fuera de la sección crítica para permitir solaparlo.
  with adquiere el bloqueo y lo libera al salir, también ante una excepción.
  Una sola salida correcta sin Lock nunca demostraría ausencia de carreras.

04_rlock.py
  anotar_lote() adquiere un RLock y llama a anotar(), que lo vuelve a adquirir.
  El mismo hilo puede entrar de nuevo. Otro hilo sigue teniendo que esperar.
  Al terminar cada with se compensa una adquisición; el RLock queda disponible
  para otros hilos cuando el nivel de anidación vuelve a cero.
  Cambiarlo por Lock provoca autobloqueo en este diseño: razona la traza antes
  de probarlo. También se podría rediseñar para adquirir un Lock una sola vez.
  A1 y A2 aparecen juntas, y B1 y B2 juntas; los lotes pueden cambiar de orden.

05_condition.py
  La condición lógica es «hay un trabajo pendiente o ya terminó el productor».
  Se revisa bajo el bloqueo asociado a Condition. Si no se cumple, wait()
  libera temporalmente ese bloqueo y espera; antes de retornar lo recupera.
  Tras despertar hay que revisar de nuevo el estado con while.
  notify() avisa a un consumidor; no libera el bloqueo por sí mismo.
  Al cerrar, terminado=True y notify_all() permiten salir a quienes esperan.
  Se procesan cuatro trabajos y ambos hilos terminan.
  deque con popleft mantiene FIFO. list.pop() sin índice sería LIFO.

06_semaphore.py
  Un Semaphore(2) permite como máximo dos trabajos simultáneos en el bloque.
  Se crean seis hilos. El pequeño Lock adicional solo protege la medición.
  El máximo observado nunca debe superar 2; no se exige un orden de acceso.
  El semáforo no cuenta peticiones por segundo ni elige una impresora concreta.
  Se puede sustituir Semaphore por BoundedSemaphore si se quiere detectar una
  liberación que haga superar la capacidad inicial. Con with cada adquisición
  correcta se compensa al salir del bloque.

07_event.py
  arranque.set() deja una señal activa; también la ve quien llega después.
  parada.set() solicita terminar. Cada hilo lo observa con wait(timeout).
  set() no mata ni interrumpe forzosamente el trabajo que esté haciendo un hilo.
  clear() desactiva la señal para futuras esperas; no vuelve a detener a los
  hilos que ya continuaron. No se usa set seguido de clear como si fuera un pulso.
  Un Event representa un estado booleano: varias llamadas a set no acumulan
  avisos. Si cada aviso contiene un trabajo que no debe perderse, usa Queue.

08_queue.py
  Queue(maxsize=3) almacena hasta tres trabajos pendientes, además de los que
  los consumidores ya hayan retirado y estén atendiendo.
  get() espera cuando no hay elementos; put() puede esperar si la cola se llena.
  Cada get() satisfactorio tiene exactamente un task_done(), incluso para FIN.
  cola.join() espera hasta que el contador de tareas sin finalizar llegue a cero.
  En esta práctica se termina de producir, incluidos los FIN, antes de llamarlo.
  No mata a los hilos. hilo.join() espera a que termine ese hilo concreto.
  Se añade un centinela FIN por consumidor y después de los trabajos reales.
  No se usa empty() para decidir si terminar: su resultado puede quedar obsoleto.
  FIFO describe la extracción, no el orden en que acabarán dos consumidores.
  Política ante un error de trabajo: se informa y se continúa. task_done marca
  el fin de ese intento, no su éxito. No se implementan reintentos automáticos.

09_descargas.py
  Descarga dos páginas de texto UTF-8 y escribe en descargas.txt.
  Este programa requiere acceso a las direcciones elegidas. Los demás funcionan
  sin Internet. Para elegir direcciones o el nombre del archivo:

    py 09_descargas.py https://www.python.org/ --salida paginas.txt

  Abre el archivo en modo w: sustituye el archivo de salida de una ejecución
  anterior. Cada hilo recibe una lista de URLs propia, el mismo archivo y el
  mismo Lock. La red se lee antes de adquirir el Lock; solo se protege el bloque
  de escrituras que forma un registro. El orden de esos registros puede variar.
  read() devuelve bytes; decode convierte a str. El ejemplo asume UTF-8 y usa
  errors="replace" para caracteres no decodificables. Para descargar archivos
  binarios sin alterarlos, se deben guardar bytes en modo wb, sin decode.
  HTTPError se trata antes que URLError, se cierra y se continúa con otra URL.
  También se atienden errores de conexión y de lectura de la respuesta.
  timeout=5 limita esperas de operaciones de red; no es un plazo total de cinco
  segundos para toda una descarga. No se fija un orden de éxito de las URLs.
  La ausencia de Lock no garantiza que se vea un archivo corrupto cada vez:
  el objetivo es garantizar que los registros no se mezclen, no confiar en suerte.

10_servicio_impresion.py
  Actividad final: seis pedidos, dos consumidores y registro_impresion.txt.
  Queue reparte los pedidos, Event permite arrancar y Lock agrupa las dos líneas
  de cada registro. La impresión simulada sucede fuera del Lock.
  Se permite el arranque antes de producir todos los pedidos: si se llenara una
  cola limitada mientras los consumidores esperasen una señal todavía no dada,
  el productor podría bloquearse sin llegar nunca a dar esa señal.
  Los seis pedidos se atienden una vez y los dos hilos terminan. Ante errores de
  trabajo se informa y se da el intento por atendido, sin reintento automático.
  El archivo se cierra después de join(). Se sustituye en cada ejecución.

VOCABULARIO PARA SEGUIR EL CÓDIGO

  target=funcion        Pasa la función, sin ejecutarla en ese momento.
  args=(dato,)          Tupla de argumentos; con uno solo se necesita la coma.
  super().__init__()    Inicializa la parte de Thread de una clase hija.
  self                 El objeto concreto al que pertenece el método.
  with objeto          En estos bloqueos, adquirir y liberar automáticamente.
  global nombre        Permite reasignar una variable global desde una función.
  try/finally          Ejecuta finally aunque haya return o una excepción.
  append(x)            Añade al final de una colección compatible.
  popleft()            Extrae el primer elemento de un deque.
  is                   Comprueba identidad; se usa para reconocer el centinela.
  list.copy()          Crea una copia superficial de la lista.
  [::2] y [1::2]       Separan posiciones alternas para repartir las URLs.

FUENTES DE CONSULTA

https://docs.python.org/3/library/threading.html
https://docs.python.org/3/library/queue.html
https://docs.python.org/3/library/urllib.request.html
https://docs.python.org/3/library/urllib.error.html

Los ejemplos se han escrito para esta guía; no son una transcripción del blog.
