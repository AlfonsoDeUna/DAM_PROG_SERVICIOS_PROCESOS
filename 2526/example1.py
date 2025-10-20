from multiprocessing import Process
import time

def count_down(name, delay):
    print('Proceso %s iniciando...' % name)
    
    counter = 5
    while counter:
        time.sleep(delay)
        print('Proceso %s, cuenta atrás: %i...' % (name, counter))
        counter -= 1
        
    print('Proceso %s finalizando...' % name)

if __name__ == '__main__':
    process1 = Process(target=count_down, args=('A', 0.5))
    process2 = Process(target=count_down, args=('B', 0.5))
    
    process1.start()
    process2.start()
    
    process1.join()
    process2.join()
    
    print('Hecho.')
