"""Una señal persistente inicia los hilos; otra pide una parada cooperativa."""

from threading import Event, Thread, current_thread
from time import sleep

arranque = Event()
parada = Event()


def vigilar():
    nombre = current_thread().name
    print(f"{nombre}: espera la señal de arranque")
    arranque.wait()
    print(f"{nombre}: comienza la vigilancia")

    # wait devuelve True si se activa la señal y False si vence el tiempo.
    while not parada.wait(timeout=0.15):
        print(f"{nombre}: revisa si llegan nuevos pedidos")
    print(f"{nombre}: termina de forma ordenada")


def main():
    arranque.clear()
    parada.clear()
    primero = Thread(target=vigilar, name="Vigilante 1")
    primero.start()
    arranque.set()

    # También continúa quien llega después de set: la señal sigue activa.
    segundo = Thread(target=vigilar, name="Vigilante 2")
    segundo.start()
    sleep(0.5)  # Deja la demostración funcionando medio segundo.
    parada.set()
    primero.join()
    segundo.join()

    arranque.clear()  # Afectaría a futuras llamadas a arranque.wait().
    print(f"Arranque activo: {arranque.is_set()}")
    print(f"Parada solicitada: {parada.is_set()}")


if __name__ == "__main__":
    main()
