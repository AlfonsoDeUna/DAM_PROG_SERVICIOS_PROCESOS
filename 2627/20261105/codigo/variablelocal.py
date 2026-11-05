
import threading
import time

# Creamos un objeto de almacenamiento local
datos = threading.local()

def tarea(nombre):
    datos.nombre = nombre
    time.sleep(1)
    print(f"Soy el hilo {datos.nombre}")

# Creamos dos hilos
hilo1 = threading.Thread(target=tarea, args=("Ana",))
hilo2 = threading.Thread(target=tarea, args=("Luis",))

hilo1.start()
hilo2.start()

hilo1.join()
hilo2.join()
