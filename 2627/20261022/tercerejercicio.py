import multiprocessing
import time

def  sumar_cuadrados(cantidad):
    
    total = 0
    for i in range (cantidad):
        total = i * i
    print (f"el total es {total}") 
    
if __name__ == "__main__":
    
    argumentos = [5_000_000, 5_000_000, 5_000_000, 5_000_000]
    with multiprocessing.Pool(processes = 4) as pool:
        pool.map(sumar_cuadrados, argumentos)