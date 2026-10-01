# ejemplo_01_poll.py

import subprocess
import sys
import time
from pathlib import Path


# Buscamos hijo.py en la misma carpeta que este archivo.
ruta_hijo = Path(__file__).resolve().with_name("hijo.py")

hijo = subprocess.Popen(
    [sys.executable, "-u", str(ruta_hijo)]
)

print("PADRE | He creado al hijo con PID:", hijo.pid, flush=True)

try:
    while True:
        codigo = hijo.poll()

        print("PADRE | poll() devuelve:", codigo, flush=True)

        # Cualquier número indica que el hijo ha terminado.
        # No usamos "if codigo", porque 0 también es un código de salida.
        if codigo is not None:
            break

        print("PADRE | Puedo seguir haciendo otras cosas.", flush=True)
        time.sleep(1)

finally:
    # Limpieza si interrumpimos el ejemplo antes de que termine.
    if hijo.poll() is None:
        hijo.terminate()

    hijo.wait()

print("PADRE | Código de salida final:", hijo.returncode)