import subprocess
import time
print("\n--- 2. Lanzar en Segundo Plano (Popen) ---")

# Lanza Notepad sin esperar
proceso = subprocess.Popen(['notepad.exe'])
pid_notepad = proceso.pid # ¡Obtenemos el PID!
print(f"✅ Notepad lanzado con PID: {pid_notepad}")

# El programa Python sigue su ejecución
print("El programa Python sigue trabajando...")
time.sleep(2) 

# Podemos interactuar con el proceso, como consultando si está vivo
if proceso.poll() is None:
    print(f"El proceso con PID {pid_notepad} sigue en ejecución.")
    
    # Para la demostración, lo terminamos después de 5 segundos
    # Quita las siguientes 3 líneas para dejarlo abierto
    time.sleep(3) 
    proceso.terminate()
    print(f"Se ha enviado la señal de terminación al PID {pid_notepad}")
else:
    print(f"El proceso terminó antes de la comprobación.")