import threading
import time

def servicio_latido():
    while True: # Bucle infinito
        print("Latido: El sistema sigue vivo...")
        time.sleep(1)

def tarea_normal():
    print("Tarea normal: Iniciando...")
    time.sleep(3)
    print("Tarea normal: Terminada.")

# Hilo Daemon (Latido)
hilo_monitor = threading.Thread(target=servicio_latido)
hilo_monitor.daemon = True # Esto lo convierte en Daemon
# Alternativa moderna: threading.Thread(..., daemon=True)

# Hilo Normal
hilo_trabajo = threading.Thread(target=tarea_normal)

hilo_monitor.start()
hilo_trabajo.start()

# El programa esperará al hilo_trabajo porque es normal.
# Cuando hilo_trabajo acabe, el programa acaba y MATA al hilo_monitor automáticamente.
