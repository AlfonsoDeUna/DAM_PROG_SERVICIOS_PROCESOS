import os
import threading

from time import perf_counter
from urllib.request import urlopen
from urllib.error import HTTPError
from http.client import HTTPException


# FUNCIÓN PROPORCIONADA
def descargar(url, destino):
    print(f"[INICIO] {destino}", flush=True)
    inicio = perf_counter()

    # El nombre definitivo se utiliza cuando termina la descarga.
    temporal = destino + ".part"

    try:
        # Leer el contenido completo del archivo.
        with urlopen(url, timeout=15) as respuesta:
            datos = respuesta.read()

        # Guardar los bytes en el ordenador.
        with open(temporal, "wb") as fichero:
            fichero.write(datos)

        # Dar al archivo su nombre definitivo.
        os.replace(temporal, destino)

        duracion = perf_counter() - inicio
        megabytes = len(datos) / 1_000_000

        print(
            f"[OK] {destino}: "
            f"{megabytes:.2f} MB en {duracion:.3f} s",
            flush=True
        )

    except HTTPError as error:
        print(
            f"[ERROR] {destino}: HTTP {error.code}",
            flush=True
        )
        error.close()

    except (OSError, HTTPException) as error:
        print(
            f"[ERROR] {destino}: {error}",
            flush=True
        )


# ARCHIVOS QUE VAMOS A DESCARGAR
url_html = (
    "https://docs.python.org/3.14/archives/"
    "python-3.14-docs-html.zip"
)

url_texto = (
    "https://docs.python.org/3.14/archives/"
    "python-3.14-docs-text.zip"
)


# PREPARAR LAS CARPETAS
os.makedirs("descargas/secuencial", exist_ok=True)
os.makedirs("descargas/hilos", exist_ok=True)


# PRUEBA 1: DESCARGAS SECUENCIALES
print("\n=== DESCARGAS SECUENCIALES ===")

inicio_secuencial = perf_counter()

descargar(
    url_html,
    "descargas/secuencial/documentacion_html.zip"
)

descargar(
    url_texto,
    "descargas/secuencial/documentacion_texto.zip"
)

tiempo_secuencial = perf_counter() - inicio_secuencial


# PRUEBA 2: DESCARGAS CON HILOS
print("\n=== DESCARGAS CON HILOS ===")

inicio_hilos = perf_counter()

#Añade aquí los hilos
#hilo1
hilo1 = threading.Thread (target = descargar , args = (url_html,
    "descargas/hilos/documentacion_html.zip"))
#hilo2
hilo2 = threading.Thread (target = descargar , args = (url_texto,
    "descargas/hilos/documentacion_texto.zip"))

hilo1.start()
hilo2.start()
hilo1.join()
hilo2.join()

tiempo_hilos = perf_counter() - inicio_hilos

# RESULTADOS
print("\n=== RESULTADOS ===")
print(f"Tiempo secuencial: {tiempo_secuencial:.3f} segundos")
print(f"Tiempo con hilos:  {tiempo_hilos:.3f} segundos")

print("\nCompara los tiempos si las cuatro descargas muestran [OK].")
print("Carpeta de resultados:", os.path.abspath("descargas"))