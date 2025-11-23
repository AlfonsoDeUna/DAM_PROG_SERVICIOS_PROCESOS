import multiprocessing
import random
import time
import os
 
def contar():
    for i in range(5):
        print(f"Proceso {os.getpid()} contando {i+1}")
        num = random.randint(1, 10)
        print (f"Proceso {os.getpid()} durmiendo {num} segundos")
        time.sleep(num)  # hace visible que corren a la vez
        print(f"Proceso {os.getpid()} contando_terminando {i+1}")
 
if __name__ == '__main__':
    procesos = []
    for i in range(5):
        p = multiprocessing.Process(target=contar)
        p.start()
        procesos.append(p)
 
    # Esperamos que todos terminen
    for p in procesos:
        p.join()
 
    print("Todos los procesos han terminado.")