"""Ejemplo deliberadamente incorrecto: se pueden perder incrementos."""

from threading import Thread
from time import sleep

completados = 0


def registrar(cantidad):
    global completados
    for _ in range(cantidad):
        anterior = completados
        # Pausa artificial para facilitar que otro hilo lea el mismo valor.
        # No garantiza una intercalación ni un resultado concretos.
        sleep(0.001)
        completados = anterior + 1


def main():
    global completados
    completados = 0
    cantidad = 50
    hilos = [Thread(target=registrar, args=(cantidad,)) for _ in range(2)]
    for hilo in hilos:
        hilo.start()
    for hilo in hilos:
        hilo.join()

    print(f"Total esperado: {2 * cantidad}")
    print(f"Total registrado: {completados}")
    print("Repite la ejecución: el resultado puede variar.")
    print("Una ejecución correcta por casualidad no demuestra sincronización.")


if __name__ == "__main__":
    main()
