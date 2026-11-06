"""RLock permite que un mismo hilo vuelva a adquirir su propio bloqueo."""

from threading import RLock, Thread


class Registro:
    def __init__(self):
        self.trabajos = []
        self.candado = RLock()

    def anotar(self, trabajo):
        with self.candado:
            self.trabajos.append(trabajo)

    def anotar_lote(self, lote):
        # El lote debe anotarse completo, sin mezclarse con otro lote.
        with self.candado:
            for trabajo in lote:
                self.anotar(trabajo)  # Adquisición anidada del mismo RLock.

    def leer(self):
        with self.candado:
            return self.trabajos.copy()


def main():
    registro = Registro()
    hilos = [
        Thread(target=registro.anotar_lote, args=(["A1", "A2"],)),
        Thread(target=registro.anotar_lote, args=(["B1", "B2"],)),
    ]
    for hilo in hilos:
        hilo.start()
    for hilo in hilos:
        hilo.join()

    print("Registro:", registro.leer())
    print("El orden de los lotes puede variar; cada lote queda agrupado.")
    print("Cambiar RLock por Lock bloquearía la llamada anidada a anotar.")


if __name__ == "__main__":
    main()
