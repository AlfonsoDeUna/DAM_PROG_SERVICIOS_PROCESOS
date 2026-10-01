# observador.py

import subprocess
import sys
from pathlib import Path

import psutil


ruta_hijo = Path(__file__).resolve().with_name("hijo.py")

hijo = subprocess.Popen(
    [sys.executable, "-u", str(ruta_hijo)]
)

try:
    proceso = psutil.Process(hijo.pid)

    print("OBSERVADOR | PID del hijo:", proceso.pid, flush=True)

    while hijo.poll() is None:
        # Medimos el consumo durante medio segundo.
        cpu = proceso.cpu_percent(interval=0.5)

        # Consultamos otros datos del proceso.
        estado = proceso.status()
        memoria = proceso.memory_info().rss / 1024**2

        print(
            f"OBSERVADOR | "
            f"PID: {proceso.pid} | "
            f"Estado informado: {estado} | "
            f"CPU: {cpu:5.1f}% | "
            f"RAM: {memoria:6.1f} MiB",
            flush=True
        )

except psutil.NoSuchProcess:
    # Puede terminar entre la comprobación con poll()
    # y la consulta de sus datos.
    print("OBSERVADOR | El proceso ha terminado durante la consulta.")

except psutil.AccessDenied:
    print("OBSERVADOR | No tengo permisos para consultar algún dato.")

finally:
    if hijo.poll() is None:
        hijo.terminate()

    hijo.wait()

print("OBSERVADOR | Código de salida:", hijo.returncode)