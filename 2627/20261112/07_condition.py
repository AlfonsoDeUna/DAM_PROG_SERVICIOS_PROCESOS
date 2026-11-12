import threading
import time
from concurrent.futures import ThreadPoolExecutor

condicion = threading.Condition()
pedidos = []

def cocinar():
    time.sleep(0.5)  # Simula la preparación del pedido.

    with condicion:
        pedidos.append("Pizza")
        print("Cocinero: el pedido está listo.")
        condicion.notify()  # Avisa al repartidor que esté esperando.

def repartir():
    with condicion:
        # Al despertar hay que comprobar otra vez si hay un pedido.
        while not pedidos:
            print("Repartidor: espera un pedido.")
            condicion.wait()  # Libera el bloqueo y lo recupera al despertar.

        pedido = pedidos.pop(0)

    # El reparto se hace fuera del bloqueo.
    print(f"Repartidor: entrega {pedido}.")

if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=2) as executor:
        reparto = executor.submit(repartir)
        cocina = executor.submit(cocinar)

        cocina.result()
        reparto.result()

    print("Pedido entregado.")
