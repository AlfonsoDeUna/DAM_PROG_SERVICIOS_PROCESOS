
import threading

def Saludo():
    print("Hola")

t = threading.Thread(target=_________)
t.start()

print("Hola")  # Hilo principal
