"""El principal espera en join; los dos trabajadores pueden seguir avanzando."""

import threading
from time import sleep


def tarea(nombre, pasos):
    for numero in range(1, pasos + 1):
        print(f"{nombre}: paso {numero}", flush=True)
        sleep(1)
    print(f"{nombre}: terminado", flush=True)


def main():
    t1 = threading.Thread(target=tarea, args=("T1", 2), name="T1")
    t2 = threading.Thread(target=tarea, args=("T2", 4), name="T2")

    t1.start()
    t2.start()

    print("PRINCIPAL: voy a esperar a T1", flush=True)
    t1.join()

    print("PRINCIPAL: T1 terminó; ahora espero a T2", flush=True)
    t2.join()

    print("PRINCIPAL: todos han terminado", flush=True)


if __name__ == "__main__":
    main()
