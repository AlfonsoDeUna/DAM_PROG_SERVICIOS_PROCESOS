import queue
import time
from concurrent.futures import ThreadPoolExecutor

cola = queue.Queue(maxsize=2)  # Como máximo dos pedidos esperando.

def productor():
    for numero in range(1, 6):
        time.sleep(0.2)  # Simula la preparación.
        pedido = f"Pedido {numero}"
        print(f"Productor: prepara {pedido}.")
        cola.put(pedido)  # Si la cola está llena, espera un hueco.

    cola.put(None)  # Señal de fin para nuestro único consumidor.

def consumidor():
    while True:
        pedido = cola.get()  # Si la cola está vacía, espera.

        try:
            if pedido is None:
                print("Consumidor: recibe la señal de fin.")
                return

            print(f"Consumidor: atiende {pedido}.")
            time.sleep(0.4)  # Simula la atención.
            print(f"Consumidor: termina {pedido}.")
        finally:
            cola.task_done()  # Una vez por cada get(), incluido None.

if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=2) as executor:
        consumo = executor.submit(consumidor)
        produccion = executor.submit(productor)

        produccion.result()  # Primero esperamos a que se encole todo.
        cola.join()  # Espera las tareas de la cola; no es Thread.join().
        consumo.result()

    print("Todos los pedidos han sido atendidos.")
