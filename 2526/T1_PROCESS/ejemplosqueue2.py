from multiprocessing import Queue, Process
import random
import time


if __name__ == "__main__":

    q = Queue()
    tiempo_inicio = time.time()


    for num in range(100000000000, 100000010000):
        q.put(num)

    ##for _ in range(q.qsize()):
    ##    print(q.get()**100)  
    

    while not q.empty():
        num = q.get()
        es_primo = True
        for i in range(2, int(num**0.5) + 1):
            if num % i == 0:
                es_primo = False
                break
        if es_primo:
            print(f"El número {num} es primo.")
        else:
            print(f"El número {num} no es primo.")



    tiempo_fin = time.time()
    print(f"Tiempo de ejecución: {tiempo_fin - tiempo_inicio} segundos")

