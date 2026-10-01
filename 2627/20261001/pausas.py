# Pausar procesos

import subprocess
import sys
import time
from pathlib import Path

import psutil


ruta_hijo = Path(__file__).resolve().with_name("contador.py")

hijo = subprocess.Popen(
    [sys.executable, "-u", str(ruta_hijo)]
)

try:
    proceso = psutil.Process(hijo.pid)

    # Dejamos que el contador avance.
    time.sleep(2)

    print("\nPADRE | Voy a suspender al contador.", flush=True)
    proceso.suspend()

    print("PADRE | El contador está suspendido.", flush=True)
    print("PADRE | poll() devuelve:", hijo.poll(), flush=True)

    # Durante este intervalo el contador no debe avanzar.
    time.sleep(3)

    print("\nPADRE | Voy a reanudar al contador.", flush=True)
    proceso.resume()

    print("PADRE | Espero a que termine.", flush=True)
    codigo = hijo.wait()

    print("PADRE | El contador ha terminado.")
    print("PADRE | Código de salida:", codigo)

except psutil.NoSuchProcess:
    print("PADRE | El contador ya no existe.")

except psutil.AccessDenied:
    print("PADRE | No tengo permisos para controlar el contador.")

finally:
    # Actuamos únicamente sobre el hijo creado por este ejemplo.
    # Si interrumpimos la demo, no lo dejamos suspendido.
    if hijo.poll() is None:
        hijo.kill()

    hijo.wait()