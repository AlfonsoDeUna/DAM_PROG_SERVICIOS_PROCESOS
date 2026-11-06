"""Dos hilos descargan páginas de texto y comparten un archivo de salida."""

import argparse
from http.client import HTTPException
from threading import Lock, Thread
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


class Descargador(Thread):
    def __init__(self, urls, salida, candado, nombre):
        super().__init__(name=nombre)
        self.urls = list(urls)
        self.salida = salida
        self.candado = candado

    def run(self):
        for url in self.urls:
            try:
                peticion = Request(url, headers={"User-Agent": "PSP-Aula/1.0"})
                with urlopen(peticion, timeout=5) as respuesta:
                    datos = respuesta.read()  # Bytes; lectura fuera del Lock.
            except HTTPError as error:
                # HTTPError también es un URLError: este except va primero.
                print(f"{self.name}: HTTP {error.code} en {url}")
                error.close()
                continue
            except (URLError, OSError, HTTPException) as error:
                print(f"{self.name}: no se pudo descargar {url}: {error}")
                continue

            # Esta práctica usa páginas de texto UTF-8. El archivo recibe str.
            texto = datos.decode("utf-8", errors="replace")
            with self.candado:
                # Las tres escrituras forman un registro indivisible respecto
                # a los otros hilos que respetan este mismo candado.
                self.salida.write(
                    f"\n=== {url} | {self.name} | {len(datos)} bytes ===\n"
                )
                self.salida.write(texto)
                self.salida.write("\n=== FIN ===\n")
            print(f"{self.name}: guardada {url}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "urls",
        nargs="*",
        default=["https://www.python.org/", "https://docs.python.org/es/3/"],
        help="Direcciones HTTP o HTTPS de páginas de texto UTF-8",
    )
    parser.add_argument("--salida", default="descargas.txt")
    opciones = parser.parse_args()

    candado = Lock()  # Exactamente el mismo objeto para los dos hilos.
    with open(opciones.salida, "w", encoding="utf-8") as salida:
        hilos = [
            Descargador(opciones.urls[::2], salida, candado, "Descarga 1"),
            Descargador(opciones.urls[1::2], salida, candado, "Descarga 2"),
        ]
        for hilo in hilos:
            hilo.start()
        for hilo in hilos:
            hilo.join()
    # El archivo se cierra después de terminar todos los escritores.
    print(f"Ejecución finalizada. Archivo: {opciones.salida}")


if __name__ == "__main__":
    main()
