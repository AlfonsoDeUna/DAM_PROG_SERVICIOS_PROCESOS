import subprocess
print("--- 1. Lanzar y Esperar ---")

try:
    # Lanza Notepad y espera a que el usuario lo cierre.
    # Es similar a la ejecución en primer plano (foreground).
    resultado = subprocess.run(['notepad.exe'], check=True)
    
    # Esta línea solo se ejecutará después de cerrar Notepad.
    print(f"✅ Notepad terminado. Código de retorno: {resultado.returncode}")

except subprocess.CalledProcessError as e:
    print(f" Error al ejecutar Notepad: {e}")

# Esta ejecución bloquea el flujo de Python.