import threading
from multiprocessing import Process
import time
import os

def MyTask():
    print("Starting task in PID: {}".format(os.getpid()))
    time.sleep(2)

if __name__ == "__main__":
    # --- PARTE 1: THREADING ---
    t0 = time.time()
    threads = []
    
    # Crear e iniciar 10 hilos
    for i in range(10):
        thread = threading.Thread(target=MyTask)
        thread.start()
        threads.append(thread)
        
    t1 = time.time()
    print("\nTotal Time for Creating 10 Threads: {} seconds".format(t1-t0))
    
    # Esperar a que terminen los hilos
    for thread in threads:
        thread.join()

    print("All threads finished.\n")

    # --- PARTE 2: MULTIPROCESSING ---
    t2 = time.time()
    procs = []
    
    # Crear e iniciar 10 procesos
    for i in range(10):
        process = Process(target=MyTask)
        process.start()
        procs.append(process)
        
    t3 = time.time()
    print("Total Time for Creating 10 Processes: {} seconds".format(t3-t2))
    
    # Esperar a que terminen los procesos
    for proc in procs:
        proc.join()
        
    print("All processes finished.")
