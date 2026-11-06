"""Dos objetos reciben el mismo archivo. Todavía no hay hilos en este ejemplo."""


class Escritor:
    def __init__(self, salida):
        # salida es el parámetro; self.salida es un atributo de este objeto.
        self.salida = salida

    def escribir(self, mensaje):
        self.salida.write(mensaje + "\n")


def main():
    # Se abre un archivo una sola vez. El modo w reemplaza su contenido anterior.
    with open("registro_compartido.txt", "w", encoding="utf-8") as archivo:
        escritor1 = Escritor(archivo)
        escritor2 = Escritor(archivo)

        escritor1.escribir("Mensaje de Ana")
        escritor2.escribir("Mensaje de Luis")

        # is comprueba si ambas referencias señalan el mismo objeto.
        print("¿Comparten el mismo objeto de archivo?")
        print(escritor1.salida is escritor2.salida)

    print("Abre registro_compartido.txt para ver los dos mensajes.")


if __name__ == "__main__":
    main()
