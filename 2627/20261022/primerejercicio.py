import multiprocessing
import random
import time


def saludar (nombre):
    
    num = random.randint(5,10)
    time.sleep(6)
    print (f"hola mundo 1! {nombre}")
    
def saludar2(nombre):
    
    num = random.randint(5,10)
    time.sleep(6)
    print (f"hola mundo 2! {nombre}")
    
    
if __name__ == "__main__":
    proceso = multiprocessing.Process(target=saludar("alfonso"))
    proceso2 = multiprocessing.Process(target=saludar2("andres"))
    
    inicio = time.perf_counter()
    proceso.start()
    proceso2.start()
    
    proceso.join()
    proceso2.join()
    fin = time.perf_counter()
    resultado = fin - inicio
    
    print (f"programa prinpal ha terminado en tiempo {resultado:.6f}")