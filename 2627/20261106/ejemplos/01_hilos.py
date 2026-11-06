"""Dos formas de crear hilos: target y herencia de Thread."""

from threading import Thread, current_thread
from time import perf_counter, sleep


def preparar_lote(trabajos):
    for trabajo in trabajos:
        print(f"{current_thread().name}: prepara el trabajo {trabajo}")
        sleep(0.12)  # Simula una espera de entrada/salida.
    print(f"{current_thread().name}: lote terminado")


class Operario(Thread):
    def __init__(self, trabajos, nombre):
        super().__init__(name=nombre)
        self.trabajos = trabajos

    def run(self):
        preparar_lote(self.trabajos)


def main():
    directo = Thread(
        target=preparar_lote,
        args=([1, 2, 3],),  # Tupla de un argumento: necesita la coma.
        name="Con target",
    )
    por_clase = Operario([4, 5, 6], "Con clase")

    inicio = perf_counter()
    # Primero arrancamos ambos; después esperamos a ambos.
    directo.start()
    por_clase.start()
    directo.join()
    por_clase.join()
    print(f"Todos los lotes terminados en {perf_counter() - inicio:.2f} s")


if __name__ == "__main__":
    main()
