import threading
import time
from concurrent.futures import ThreadPoolExecutor

salida = threading.Event()  # Al principio está desactivado.

def trabajar(nombre):
    print(f"{nombre}: espera la señal.")
    salida.wait()  # Espera hasta que el evento esté activado.
    print(f"{nombre}: empieza a trabajar.")
    time.sleep(0.3)  # Simula el trabajo.
    print(f"{nombre}: ha terminado.")

if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=3) as executor:
        resultados = executor.map(trabajar, ["Ana", "Luis", "Marta"])

        time.sleep(0.5)  # Solo retrasa la señal para observar la espera.
        print("Principal: da la señal de salida.")
        salida.set()  # Permanece activado hasta que se llame a clear().

        # Recogemos los resultados DESPUÉS de dar la señal.
        list(resultados)

    print("Todos los trabajadores han terminado.")
