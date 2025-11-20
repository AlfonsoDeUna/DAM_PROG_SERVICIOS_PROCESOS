import threading
import time

# Esta es la función que realizará el trabajo (el "target")
def trabajador():
    print("  [Estado: Running] El hilo ha empezado a trabajar.")
    time.sleep(2) # Simulamos trabajo y pasa a estado 'Not-running'
    print("  [Estado: Dead] El hilo ha terminado.")

# 1. [Estado: New Thread] Instanciamos el objeto, pero no hace nada aún.
mi_hilo = threading.Thread(target=trabajador)

print("1. Hilo creado (objeto instanciado).")

# 2. [Estado: Runnable -> Running] Asignamos recursos y ejecutamos run()
mi_hilo.start() 

print("2. Hilo iniciado (start llamado).")

# 3. Esperamos a que el hilo termine antes de seguir con el programa principal
mi_hilo.join()

print("3. El programa principal continúa. El hilo ya es historia.")
