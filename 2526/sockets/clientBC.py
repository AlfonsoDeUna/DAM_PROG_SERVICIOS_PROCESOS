#cliente para serverBC.py

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as cliente:
   cliente.connect(("0.0.0.0", 64532))
   mensaje = input("escribe tu mensaje:")
   cliente.sendall(mensaje.encode("utf-8"))
   data = cliente.recv(1024)
   print("Recibido:", data.decode("utf-8")) 
