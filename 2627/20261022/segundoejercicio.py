import time
import multiprocessing

def  sumar_cuadrados():
    
    total = 0
    for i in range (5_000_000):
        total = i * i
    print (f"el total es {total}") 
    
if __name__ == "__main__":
    
    procesos = []
    
    inicio = time.perf_counter()
    for i in range (5):
        sumar_cuadrados()
    fin = time.perf_counter()
    metodo1 = fin - inicio
    
    # calcular el timpo que tarda que lo lance un proceso
    inicio = time.perf_counter()
    for i in range (5):
        proceso = multiprocessing.Process (target=sumar_cuadrados)
        proceso.start()
        procesos.append(proceso)
    
    
    for p in procesos:
        p.join()
    
    fin = time.perf_counter()
    metodo2 = fin - inicio
    print (f"el tiempo que tarda el proceso padre 5 llamadas: {metodo1:.6f}" )
    print (f"el tiempo que tarda los 5 procesos: {metodo2:.6f}" )