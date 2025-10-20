import multiprocessing
import time
import os

def proceso_hijo():
    """
    Esta función será ejecutada por el proceso hijo.
    """
    proceso_actual = multiprocessing.current_process()
    print(f"Proceso Hijo iniciado con PID: {proceso_actual.pid}")
    try:
        # Una espera larga para que podamos ver cómo se interrumpe
        time.sleep(20)
    except KeyboardInterrupt:
        pass # Ignorar si se interrumpe
    print("El proceso hijo está finalizando su función.")

# Es CRUCIAL que el código que crea procesos esté dentro de este bloque
if __name__ == '__main__':
    proceso_principal_pid = os.getpid()
    print(f"Proceso Principal tiene el PID: {proceso_principal_pid}")

    # Crear el objeto Process con un nombre de función claro como objetivo
    proceso = multiprocessing.Process(target=proceso_hijo)

    # Iniciar el proceso hijo
    proceso.start()

    # El programa principal no espera, continúa inmediatamente
    print("El Proceso Principal ha iniciado al hijo y continúa su ejecución.")
    
    # Damos un segundo para asegurarnos de que el proceso hijo arranque e imprima su mensaje
    time.sleep(1)

    print("Terminando el Proceso Hijo de forma abrupta...")
    proceso.terminate() # Forzamos la finalización del proceso hijo
    
    # Es una buena práctica hacer join() después de terminate() para que el S.O. limpie el proceso
    proceso.join() 

    print("Proceso Hijo terminado con éxito.")
