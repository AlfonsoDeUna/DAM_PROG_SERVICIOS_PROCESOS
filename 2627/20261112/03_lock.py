import threading
import time
from concurrent.futures import ThreadPoolExecutor

class CuentaBancaria:
    def __init__(self):
        self.saldo = 0  # Euros enteros para simplificar el ejemplo.
        self.bloqueo = threading.Lock()

    def ingresar(self, cantidad):
        # Solo un hilo puede ejecutar esta zona protegida a la vez.
        with self.bloqueo:
            saldo_anterior = self.saldo
            time.sleep(0.1)  # Pausa didáctica; quien protege es el Lock.
            self.saldo = saldo_anterior + cantidad
            print(f"Ingreso: {cantidad} €. Saldo: {self.saldo} €")

if __name__ == "__main__":
    cuenta = CuentaBancaria()  # Una sola cuenta compartida por los hilos.
    ingresos = [100, 200, 50, 150]

    with ThreadPoolExecutor(max_workers=4) as executor:
        # Consumimos map para esperar los resultados y detectar errores.
        list(executor.map(cuenta.ingresar, ingresos))

    # Aquí ya han terminado todos los ingresos: debe mostrar 500 €.
    print(f"Saldo final: {cuenta.saldo} €")
