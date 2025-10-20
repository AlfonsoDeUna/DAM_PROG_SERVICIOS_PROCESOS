from multiprocessing import Process, current_process
import time

def f1():
    p = current_process()
    print('Iniciando proceso %s, ID %s...' % (p.name, p.pid))
    time.sleep(4) # Simula una tarea larga
    print('Finalizando proceso %s, ID %s...' % (p.name, p.pid))

def f2():
    p = current_process()
    print('Iniciando proceso %s, ID %s...' % (p.name, p.pid))
    time.sleep(2) # Simula una tarea más corta
    print('Finalizando proceso %s, ID %s...' % (p.name, p.pid))

if __name__ == '__main__':
    p1 = Process(name='Worker 1', target=f1)
    p1.daemon = True # Marcamos el primer proceso como demonio

    p2 = Process(name='Worker 2', target=f2)

    p1.start()
    time.sleep(1) # Pequeña pausa
    p2.start()

    p1.join(1) # Esperamos a p1 por un máximo de 1 segundo
    print('¿Worker 1 sigue vivo?:', p1.is_alive())

    p2.join() # Esperamos a p2 indefinidamente

    print("Programa principal terminado.")
