import socket
import threading
 
HOST = '0.0.0.0'
PORT = 65432
 
clientes = []  # Lista de conexiones activas
lock = threading.Lock() 
 
def broadcast(mensaje, origen):
    """Envía mensaje a todos excepto al origen"""
    with lock:
        for cliente in clientes:
            if cliente != origen:
                try:
                    cliente.sendall(mensaje)
                except:
                    clientes.remove(cliente)
 
def atender_cliente(conn, addr):
    print(f"[+] {addr} conectado")
    with lock:
        clientes.append(conn)
    
    try:
        while True:
            data = conn.recv(1024)
            if not data:
                break
            mensaje = f"[{addr[1]}]: {data.decode()}".encode()
            print(mensaje.decode())
            broadcast(mensaje, conn)
    finally:
        with lock:
            clientes.remove(conn)
        conn.close()
        print(f"[-] {addr} desconectado")
 
# Servidor principal
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind((HOST, PORT))
    s.listen()
    print(f"Chat server en {HOST}:{PORT}")
    
    while True:
        conn, addr = s.accept()
        t = threading.Thread(target=atender_cliente, args=(conn, addr))
        t.daemon = True  # El hilo muere cuando el programa principal termina
        t.start()
