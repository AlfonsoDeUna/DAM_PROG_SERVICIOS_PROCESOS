import random
import threading
import time
from concurrent.futures import ThreadPoolExecutor

# Semáforo con un máximo de 2 recursos disponibles (cajeros)
semaforo_cajeros = threading.Semaphore(2)

def hora_actual():
    return time.strftime("%H:%M:%S")

def atender_cliente(nombre):
    print(f"{hora_actual()}: {nombre} está esperando a un cajero.")

    with semaforo_cajeros:
        print(f"{hora_actual()}: {nombre} está siendo atendido.")

        # Simulamos el tiempo que tarda el cajero en atender al cliente
        time.sleep(random.randint(1, 3))

        print(f"{hora_actual()}: {nombre} ha terminado de ser atendido.")

clientes = [
    "Cliente 1",
    "Cliente 2",
    "Cliente 3",
    "Cliente 4",
    "Cliente 5",
]

with ThreadPoolExecutor(max_workers=5) as ejecutor:
    for nombre_cliente in clientes:
        ejecutor.submit(atender_cliente, nombre_cliente)

print(f"{hora_actual()}: Todos los clientes han sido atendidos.")
