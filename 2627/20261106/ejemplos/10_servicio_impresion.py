"""Integración: Queue reparte, Event autoriza el arranque y Lock protege el log."""

from queue import Queue
from threading import Event, Lock, Thread, current_thread
from time import sleep

FIN = object()


def operario(cola, arranque, registro, candado):
    arranque.wait()
    while True:
        trabajo = cola.get()
        try:
            if trabajo is FIN:
                return
            numero, paginas = trabajo
            sleep(0.05 * paginas)  # Impresión simulada fuera del candado.
            with candado:
                registro.write(f"Trabajo {numero}; páginas: {paginas}\n")
                registro.write(f"Atendido por {current_thread().name}\n")
            print(f"Trabajo {numero} terminado")
        except Exception as error:
            print(f"Error en el trabajo {trabajo}: {error}")
        finally:
            cola.task_done()  # Fin del intento, no certificación de éxito.


def main():
    cola = Queue(maxsize=3)
    arranque = Event()
    candado = Lock()
    trabajos = [(1, 3), (2, 1), (3, 2), (4, 1), (5, 3), (6, 2)]

    with open("registro_impresion.txt", "w", encoding="utf-8") as registro:
        hilos = [
            Thread(
                target=operario,
                args=(cola, arranque, registro, candado),
                name=f"Impresora {n}",
            )
            for n in range(1, 3)
        ]
        for hilo in hilos:
            hilo.start()

        # Los consumidores deben poder avanzar antes de llenar la cola limitada.
        arranque.set()
        for trabajo in trabajos:
            cola.put(trabajo)
        for _ in hilos:
            cola.put(FIN)
        cola.join()
        for hilo in hilos:
            hilo.join()

    print("Servicio finalizado. Revisa registro_impresion.txt")


if __name__ == "__main__":
    main()
