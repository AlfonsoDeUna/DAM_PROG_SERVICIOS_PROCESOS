import threading
import time

def quien_soy():
    # Obtenemos la identidad del hilo actual
    yo = threading.current_thread()
    print(f"Soy el hilo: {yo.name} | ID interno: {yo.ident} | ID SISTEMA OPERATIVO {yo.native_id}")
    time.sleep(2)

# Creamos hilos con nombres específicos
h1 = threading.Thread(target=quien_soy, name="Hilo-Alfa")
h2 = threading.Thread(target=quien_soy, name="Hilo-Beta")

main = threading.main_thread()
print(f"Soy el hilo: {main.name} | ID interno: {main.ident} | ID SISTEMA OPERATIVO {main.native_id}")
h1.start()
h2.start()


# Introspección: Ver qué está pasando
print(f"\n--- Auditoría ---")
print(f"Hilos activos totales: {threading.active_count()}")
print(f"Lista de hilos: {threading.enumerate()}")

h1.join()
h2.join()

print(f"-----------------\n")