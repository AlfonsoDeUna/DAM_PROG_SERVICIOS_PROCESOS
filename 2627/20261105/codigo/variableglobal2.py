import threading
import time

nombre_global = ""

def tarea(nombre):
    global nombre_global

    nombre_global = nombre
    time.sleep(1)
    print(f"Soy el hilo {nombre_global}")

hilo1 = threading.Thread(target=tarea, args=("Ana",))
hilo2 = threading.Thread(target=tarea, args=("Luis",))

hilo1.start()
hilo2.start()

hilo1.join()
hilo2.join()
