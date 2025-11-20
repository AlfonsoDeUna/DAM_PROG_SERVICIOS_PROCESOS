import time
import random
import threading

def calculatePrimeFactors(n):
    primfac = []
    d = 2
    # Bucle para encontrar factores
    while d * d <= n:
        while (n % d) == 0:
            primfac.append(d)
            n //= d
        d += 1
    if n > 1:
        primfac.append(n)
    return primfac

def executeProc():
    # Calcula factores para 1000 números aleatorios
    for i in range(1000):
        rand = random.randint(20000, 100000000)
        # print(calculatePrimeFactors(rand)) # Comentado para no saturar la consola
        calculatePrimeFactors(rand)

def main():
    print("Starting number crunching")
    t0 = time.time()
    
    threads = []
    
    # Crear e iniciar 10 hilos
    for i in range(10):
        thread = threading.Thread(target=executeProc)
        threads.append(thread)
        thread.start()
    
    # Esperar a que todos los hilos terminen
    for thread in threads:
        thread.join()
        
    t1 = time.time()
    totalTime = t1 - t0
    print("Execution Time: {}".format(totalTime))

if __name__ == '__main__':
    main()
