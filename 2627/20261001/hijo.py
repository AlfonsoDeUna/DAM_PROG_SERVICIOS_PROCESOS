# hijo.py

import os
import time


def calcular(segundos):
    """Realiza cálculos durante un tiempo limitado."""
    final = time.perf_counter() + segundos
    contador = 0

    while time.perf_counter() < final:
        contador = (contador + 1) % 1_000_000


print("HIJO | Mi PID es:", os.getpid(), flush=True)

print("HIJO | Fase 1: calculo durante 2 segundos.", flush=True)
calcular(2)

print("HIJO | Fase 2: espero durante 3 segundos.", flush=True)
time.sleep(3)

print("HIJO | Fase 3: vuelvo a calcular durante 2 segundos.", flush=True)
calcular(2)

print("HIJO | He terminado.", flush=True)