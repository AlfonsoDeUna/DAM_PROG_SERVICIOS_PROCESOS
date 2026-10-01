"""
04 - Barras de carga por núcleo, en vivo
Refresca la pantalla cada segundo con el uso de cada core y de la RAM.
Ctrl+C para salir.
"""
import psutil
import subprocess


def limpiar():
    subprocess.run(["cls"], shell=True)


def barra(pct, ancho=40):
    llenos = round(pct / 100 * ancho)
    return "█" * llenos + "░" * (ancho - llenos) + f" {pct:5.1f}%"


try:
    while True:
        usos = psutil.cpu_percent(interval=1, percpu=True)  # espera 1 s midiendo
        limpiar()
        print("USO DE CPU POR NÚCLEO  (Ctrl+C para salir)\n")
        for i, pct in enumerate(usos):
            print(f"  Core {i:2}: {barra(pct)}")
        print(f"\n  Total:   {barra(sum(usos) / len(usos))}")
        print(f"  RAM:     {barra(psutil.virtual_memory().percent)}")
except KeyboardInterrupt:
    print("\nFin.")
