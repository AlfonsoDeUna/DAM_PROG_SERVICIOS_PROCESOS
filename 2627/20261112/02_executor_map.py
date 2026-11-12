import time
from concurrent.futures import ThreadPoolExecutor

def descargar(archivo):
    print(f"Empieza: {archivo}")
    time.sleep(1)  # Simula una espera de red; no descarga ningún archivo.
    print(f"Termina: {archivo}")
    return archivo

if __name__ == "__main__":
    archivos = ["foto.jpg", "informe.pdf", "datos.csv"]

    # Hasta dos hilos ejecutan las tareas. No llamamos a start ni a join.
    with ThreadPoolExecutor(max_workers=2) as executor:
        resultados = list(executor.map(descargar, archivos))

    # map entrega los resultados en el orden de entrada.
    print("Archivos descargados:", resultados)
