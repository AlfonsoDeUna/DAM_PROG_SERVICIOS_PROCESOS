from multiprocessing import Queue, Process
import multiprocessing
import random
import time

def calcular (q):
    while not q.empty():
        num = q.get()
        print ("proceso %s calculando el número %i" % (multiprocessing.current_process().name, num))
        print ("Resultado: %i" % (num**100))

def siesnumeroprimo(q):
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

if __name__ == "__main__":

    q = Queue()
    tiempo_inicio = time.time()


    for num in range(100000000000, 100000010000):
        q.put(num)

    p = Process(target=siesnumeroprimo, name="Proceso 1", args=(q,))
    p2 = Process(target=siesnumeroprimo, name="Proceso 2", args=(q,))
    p3 = Process(target=siesnumeroprimo, name="Proceso 3", args=(q,))
    p4 = Process(target=siesnumeroprimo, name="Proceso 3", args=(q,))

    p.start()
    p2.start()
    p3.start()
    p4.start()
    p.join()
    p2.join()
    p3.join()
    p4.join()
    tiempo_fin = time.time()
    print(f"Tiempo de ejecución: {tiempo_fin - tiempo_inicio} segundos")