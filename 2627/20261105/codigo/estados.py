
import threading
import time

def tarea():
    print("Hilo iniciado")
    time.sleep(3)
    print("Hilo terminado")

hilo = threading.Thread(target=tarea)

# Antes de iniciarlo
print("Estado NEW:", hilo.is_alive())

hilo.start()

# Después de iniciarlo
print("Hilo activo:", hilo.is_alive())

time.sleep(1)

# Durante la espera
print("Durante sleep:", hilo.is_alive())

hilo.join()

# Después de terminar
print("Estado DEAD:", hilo.is_alive())


def consultar_estado(hilo):
    if hilo.ident is None:
        return "NEW"
    elif hilo.is_alive():
        return "ACTIVO"
    else:
        return "DEAD"

