import threading
from multiprocessing import Process
import time
import os

def MyTask():
    print("Starting task in PID: {}".format(os.getpid()))
    time.sleep(2)

def main():
    # --- Parte 1: Hilos (Threading) ---
    t0 = time.time()
    threads = []
    
    for i in range(10):
        thread = threading.Thread(target=MyTask)
        thread.start()
        threads.append(thread)
        
    t1 = time.time()
    print("\nTotal Time for Creating 10 Threads: {:.6f} seconds".format(t1 - t0))

    # Esperar a que terminen los hilos antes de seguir
    for thread in threads:
        thread.join()

    print("-" * 20)

    # --- Parte 2: Procesos (Multiprocessing) ---
    t2 = time.time()
    procs = []
    
    for i in range(10):
        process = Process(target=MyTask)
        process.start()
        procs.append(process)
        
    t3 = time.time()
    print("\nTotal Time for Creating 10 Processes: {:.6f} seconds".format(t3 - t2))

    # Esperar a que terminen los procesos
    for proc in procs:
        proc.join()

if __name__ == '__main__':
    main()
