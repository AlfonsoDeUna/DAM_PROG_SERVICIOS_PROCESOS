import threading
import time

def tarea ():
    print ("HILO inciado")
    time.sleep(3)
    print ("HILO terminado")
    

hilo = threading.Thread (target=tarea)

print ("-->" ,hilo.ident)

print ("estado NEW:", hilo.is_alive())    

hilo.start()

print ("-->", hilo.ident)
print ("estado activo:", hilo.is_alive()) 

time.sleep(1)

print ("estado en espera:", hilo.is_alive()) 

hilo.join()

print ("estado DEAD:", hilo.is_alive())

