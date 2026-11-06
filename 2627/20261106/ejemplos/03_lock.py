"""Lock protege la actualización completa de un contador compartido."""

from threading import Lock, Thread
from time import sleep

completados = 0
candado = Lock()


def registrar(cantidad):
    global completados
    for _ in range(cantidad):
        sleep(0.001)  # Trabajo simulado: no necesita el recurso compartido.
        with candado:
            anterior = completados
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

    print(f"Total esperado: {len(hilos) * cantidad}")
    print(f"Total registrado: {completados}")


if __name__ == "__main__":
    main()
