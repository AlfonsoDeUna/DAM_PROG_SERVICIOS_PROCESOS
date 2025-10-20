from multiprocessing import Process, current_process
import time
import os

def print_info(title):
    print(title)
    # Comprueba si la función getppid está disponible en el sistema operativo
    if hasattr(os, 'getppid'): 
        print('ID del proceso padre: %s.' % str(os.getppid()))
  
    print('ID del proceso actual: %s.\n' % str(os.getpid()))

def f():
    
    print_info('Función f')
    pname = current_process().name
    
    print('Iniciando proceso %s...' % pname)
    time.sleep(1)
    
    print('Finalizando proceso %s...' % pname)

if __name__ == '__main__':
   
    print_info('Programa principal')
    p = Process(target=f)
    p.start()
    p.join()
  
    print('Hecho.')
