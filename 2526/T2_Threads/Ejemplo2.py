import threading
import time
import random

def tarea_personalizada(nombre, tiempo_espera):
    print(f"Hola, soy el hilo {nombre} y voy a dormir {tiempo_espera} segundos.")
    time.sleep(tiempo_espera)
    print(f"Hilo {nombre} ha despertado y finalizado.")

# Creamos una lista para guardar nuestros hilos
lista_hilos = []

# Creamos 3 hilos con argumentos diferentes
for i in range(3):
    tiempo = random.randint(1, 5)
    # OJO: args debe ser una tupla. Si es un solo elemento pon una coma: (i,)
    hilo = threading.Thread(target=tarea_personalizada, args=(f"Robot-{i}", tiempo))
    lista_hilos.append(hilo)
    hilo.start()

print(f"Total de hilos activos lanzados: {threading.active_count() - 1}") # -1 por el hilo principal
