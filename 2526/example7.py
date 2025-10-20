import multiprocessing

class MyWorker():
    def __init__(self, x):
        self.x = x

    def process(self):
        pname = multiprocessing.current_process().name
        # Traducido de: 'Starting process %s for number %i...'
        print('Iniciando proceso %s para el número %i...' % (pname, self.x))

def work(q):
    """Función que será ejecutada por el proceso hijo (consumidor)."""
    # q.get() es bloqueante: espera hasta que haya un elemento en la cola.
    worker = q.get()
    worker.process()

if __name__ == '__main__':
    # Creamos una cola para comunicar el proceso principal con el hijo.
    my_queue = multiprocessing.Queue()

    # Creamos el proceso hijo (consumidor). Su tarea es ejecutar la función 'work'.
    # Le pasamos la cola como argumento para que pueda acceder a ella.
    p = multiprocessing.Process(target=work, args=(my_queue,))
    p.start()

    # El proceso principal (productor) crea un objeto 'MyWorker' y lo pone en la cola.
    my_queue.put(MyWorker(10))

    # Señalamos que no se añadirán más elementos a la cola.
    my_queue.close()

    # Esperamos a que el hilo de fondo de la cola termine (buena práctica).
    my_queue.join_thread()

    # Esperamos a que el proceso hijo termine su trabajo.
    p.join()

    # Traducido de: 'Done.'
    print('Hecho.')
