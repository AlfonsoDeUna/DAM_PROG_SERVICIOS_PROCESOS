from threading import Thread
import time

class HiloObrero(Thread):
    def __init__(self, nombre_tarea):
        # Iniciar constructor de la clase padre es OBLIGATORIO
        Thread.__init__(self)
        self.nombre_tarea = nombre_tarea

    def run(self):
        # Aquí va la lógica que se ejecuta al llamar a .start()
        print(f"Comenzando la tarea compleja: {self.nombre_tarea}")
        time.sleep(1)
        print(f"Tarea {self.nombre_tarea} finalizada.")

# Uso de la clase
mi_obrero = HiloObrero("Construir Pared")
mi_obrero.start()
mi_obrero.join()
print("Obra terminada.")
