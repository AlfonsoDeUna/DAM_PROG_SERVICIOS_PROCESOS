import threading
from time import perf_counter
from urllib.request import urlopen
from urllib.error import HTTPError


# FUNCIÓN PROPORCIONADA
def comprobar(nombre, url):
    print(f"[INICIO] {nombre}", flush=True)
    inicio = perf_counter()

    try:
        with urlopen(url, timeout=3) as respuesta:
            resultado = f"HTTP {respuesta.status}"
            
            # Leer el contenido de la página
            #contenido = respuesta.read().decode("utf-8", errors="replace")

            # Mostrar los primeros 500 caracteres
            #print(contenido[:500])

    except HTTPError as error:
        resultado = f"HTTP {error.code}"
        error.close()

    except OSError:
        resultado = "no se ha podido completar la consulta"

    duracion = perf_counter() - inicio
    print(
        f"[FIN] {nombre}: {resultado} ({duracion:.2f} s)",
        flush=True
    )


# DIRECCIONES QUE VAMOS A COMPROBAR
url_python = "https://www.elmundo.es/"
url_documentacion = "https://docs.python.org/es/3/"


# BLOQUE QUE VAMOS A MODIFICAR
inicio_total = perf_counter()

comprobar("Python", url_python)
comprobar("Documentación", url_documentacion)

hilo1 = threading.Thread (target=comprobar, args = ("Python", url_python))
hilo2 = threading.Thread (target=comprobar, args = ("Documentación", url_documentacion))

hilo1.start()
hilo2.start()
hilo1.join()
hilo2.join()
duracion_total = perf_counter() - inicio_total
print(f"Revisión terminada en {duracion_total:.2f} s")