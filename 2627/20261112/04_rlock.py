import threading
import time
from concurrent.futures import ThreadPoolExecutor

class CuentaBancaria:
    def __init__(self):
        self.saldo = 0
        self.bloqueo = threading.RLock()

    def consultar_saldo(self):
        with self.bloqueo:
            return self.saldo

    def ingresar(self, cantidad):
        with self.bloqueo:  # El hilo adquiere el bloqueo.
            saldo_anterior = self.saldo
            time.sleep(0.1)  # Pausa didáctica para observar la ejecución.
            self.saldo = saldo_anterior + cantidad

            # El MISMO hilo vuelve a adquirir el MISMO bloqueo.
            saldo_actual = self.consultar_saldo()
            print(f"Ingreso: {cantidad} €. Saldo: {saldo_actual} €")

if __name__ == "__main__":
    cuenta = CuentaBancaria()
    ingresos = [100, 200, 50, 150]

    with ThreadPoolExecutor(max_workers=4) as executor:
        list(executor.map(cuenta.ingresar, ingresos))

    print(f"Saldo final: {cuenta.consultar_saldo()} €")  # 500 €.
