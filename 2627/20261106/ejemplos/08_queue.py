"""Queue reparte trabajos y permite esperar a que todos se atiendan."""

from queue import Queue
from threading import Thread, current_thread
from time import sleep

FIN = object()  # Un objeto que nunca se confundirá con un trabajo válido.


def consumir(cola):
    while True:
        trabajo = cola.get()
        try:
            if trabajo is FIN:
                print(f"{current_thread().name}: recibe FIN")
                return
            # Duraciones distintas: terminar no tiene que seguir orden FIFO.
            sleep(0.05 * (1 + trabajo % 3))
            print(f"{current_thread().name}: trabajo {trabajo} terminado")
        except Exception as error:
            # Política de esta práctica: informar del error y seguir.
            print(f"Error en el trabajo {trabajo}: {error}")
        finally:
            # También corresponde al centinela y a los intentos fallidos.
            cola.task_done()


def main():
    cola = Queue(maxsize=3)
    consumidores = [
        Thread(target=consumir, args=(cola,), name=f"Operario {n}")
        for n in range(1, 3)
    ]
    for hilo in consumidores:
        hilo.start()

    for trabajo in range(1, 7):
        cola.put(trabajo)
    for _ in consumidores:
        cola.put(FIN)  # Un centinela por consumidor, después de los trabajos.

    cola.join()  # Espera todos los task_done, incluidos los de FIN.
    for hilo in consumidores:
        hilo.join()  # Espera a que termine cada hilo.
    print("Todos los trabajos atendidos y todos los hilos finalizados")


if __name__ == "__main__":
    main()
