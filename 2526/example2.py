from multiprocessing import Process, current_process
import time

def f1():
    # Obtiene el nombre del proceso actual
    pname = current_process().name

    print('Iniciando proceso %s...' % pname)
    time.sleep(2)
    print('Finalizando proceso %s...' % pname)

def f2():
    # Obtiene el nombre del proceso actual
    pname = current_process().name
  
    print('Iniciando proceso %s...' % pname)
    time.sleep(4)
    print('Finalizando proceso %s...' % pname)

if __name__ == '__main__':
    # Creamos los procesos y les asignamos un nombre y una función
    p1 = Process(name='Trabajador 1', target=f1)
    p2 = Process(name='Trabajador 2', target=f2)
    p3 = Process(target=f1)

    # Iniciamos la ejecución de los procesos
    p1.start()
    p2.start()
    p3.start()

    # Esperamos a que cada proceso termine antes de continuar
    p1.join()
    p2.join()
    p3.join()
