# ejemplo de wait

import subprocess
import sys
from pathlib import Path


ruta_hijo = Path(__file__).resolve().with_name("hijo.py")

hijo = subprocess.Popen(
    [sys.executable, "-u", str(ruta_hijo)]
)

print("PADRE | He creado al hijo:", hijo.pid, flush=True)
print("PADRE | Ahora me quedo esperando en wait().", flush=True)

codigo = hijo.wait()

# Estas instrucciones se ejecutan DESPUÉS de que termine el hijo.
print("PADRE | El hijo ha terminado. Ahora puedo continuar.")
print("PADRE | Código de salida:", codigo)
print("PADRE | Realizo mi siguiente tarea.")