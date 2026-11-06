"""Seis trabajos comparten una capacidad de dos impresoras."""

from threading import Lock, Semaphore, Thread
from time import sleep

CAPACIDAD = 2
plazas = Semaphore(CAPACIDAD)
medidas = Lock()
activos = 0
maximo = 0


def imprimir(trabajo):
    global activos, maximo
    with plazas:
        # Este Lock protege la medición, no determina la capacidad.
        with medidas:
            activos += 1
            maximo = max(maximo, activos)
            print(f"Entra {trabajo}; trabajos simultáneos: {activos}")
        try:
            sleep(0.12 + 0.03 * (trabajo % 2))
        finally:
            with medidas:
                activos -= 1
                print(f"Sale {trabajo}; trabajos simultáneos: {activos}")


def main():
    global activos, maximo
    activos = 0
    maximo = 0
    hilos = [Thread(target=imprimir, args=(n,)) for n in range(1, 7)]
    for hilo in hilos:
        hilo.start()
    for hilo in hilos:
        hilo.join()
    print(f"Máximo observado: {maximo}; capacidad: {CAPACIDAD}")
    print("Limita trabajos simultáneos, no trabajos por segundo.")


if __name__ == "__main__":
    main()
