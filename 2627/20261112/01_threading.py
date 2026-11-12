import threading
import time

def descargar(archivo):
    print(f"Empieza: {archivo}")
    time.sleep(1)  # Simula una espera de red; no descarga ningún archivo.
    print(f"Termina: {archivo}")
    return archivo

if __name__ == "__main__":
    archivos = ["foto.jpg", "informe.pdf", "datos.csv"]
    hilos = []

    # Iniciamos todos los hilos antes de esperar a que terminen.
    for archivo in archivos:
        hilo = threading.Thread(target=descargar, args=(archivo,))
        hilos.append(hilo)
        hilo.start()

    for hilo in hilos:
        hilo.join()  # El hilo principal espera a este hilo.

    print("Todas las descargas han terminado.")
