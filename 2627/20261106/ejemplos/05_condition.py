"""Un consumidor espera hasta que haya trabajos o termine el productor."""

from collections import deque
from threading import Condition, Thread
from time import sleep

pendientes = deque()
condicion = Condition()
terminado = False


def producir():
    global terminado
    for trabajo in range(1, 5):
        sleep(0.08)  # La preparación sucede fuera del bloqueo.
        with condicion:
            pendientes.append(trabajo)
            print(f"Productor: añade el trabajo {trabajo}")
            condicion.notify()

    with condicion:
        terminado = True
        # Despertar también a quien espere cuando ya no quedan trabajos.
        condicion.notify_all()


def consumir():
    while True:
        with condicion:
            while not pendientes and not terminado:
                print("Consumidor: no hay trabajos; espero")
                condicion.wait()  # Libera el lock y lo recupera al despertar.

            if not pendientes and terminado:
                return
            trabajo = pendientes.popleft()

        # Procesar fuera permite al productor seguir añadiendo trabajos.
        sleep(0.12)
        print(f"Consumidor: trabajo {trabajo} terminado")


def main():
    global terminado
    terminado = False
    pendientes.clear()
    productor = Thread(target=producir, name="Productor")
    consumidor = Thread(target=consumir, name="Consumidor")
    consumidor.start()
    productor.start()
    productor.join()
    consumidor.join()
    print("Productor y consumidor finalizados")


if __name__ == "__main__":
    main()
