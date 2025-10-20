from multiprocessing import Process, current_process
import time

def f1():
    p = current_process()
    
    print('Iniciando proceso %s, ID %s...' % (p.name, p.pid))
    time.sleep(4)

    print('Finalizando proceso %s, ID %s...' % (p.name, p.pid))

def f2():
    p = current_process()
    
    print('Iniciando proceso %s, ID %s...' % (p.name, p.pid))
    time.sleep(2)
   
    print('Finalizando proceso %s, ID %s...' % (p.name, p.pid))

if __name__ == '__main__':
    # Creamos el proceso p1 y lo marcamos como demonio
    p1 = Process(name='Trabajador 1 (Demonio)', target=f1)
    p1.daemon = True  # <-- ¡Esta es la línea clave!

    # Creamos el proceso p2 (este NO es un demonio por defecto)
    p2 = Process(name='Trabajador 2', target=f2)

    p1.start()
    time.sleep(1) # Pequeña pausa para que p1 arranque antes que p2
    p2.start()

    # Nota: No hay llamadas a .join()
    print('El programa principal ha terminado.')
