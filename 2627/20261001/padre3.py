# ejemplo timeout


import subprocess
import sys
from pathlib import Path


ruta_hijo = Path(__file__).resolve().with_name("hijo.py")

hijo = subprocess.Popen(
    [sys.executable, "-u", str(ruta_hijo)]
)

try:
    print("PADRE | Espero al hijo como máximo 3 segundos.", flush=True)

    codigo = hijo.wait(timeout=3)

    print("PADRE | El hijo terminó dentro del plazo.")
    print("PADRE | Código de salida:", codigo)

except subprocess.TimeoutExpired:
    print("PADRE | Se ha agotado mi tiempo de espera.", flush=True)

    # Comprobamos que el timeout no lo ha terminado.
    print("PADRE | poll() devuelve:", hijo.poll(), flush=True)

    print("PADRE | Ahora decido finalizar al hijo.", flush=True)
    hijo.terminate()

    # Confirmamos su finalización y recogemos el código de salida.
    codigo = hijo.wait()

    print("PADRE | El hijo ya ha terminado.")
    print("PADRE | Código de salida:", codigo)

finally:
    # Limpieza adicional si interrumpimos el programa.
    if hijo.poll() is None:
        hijo.terminate()
        hijo.wait()