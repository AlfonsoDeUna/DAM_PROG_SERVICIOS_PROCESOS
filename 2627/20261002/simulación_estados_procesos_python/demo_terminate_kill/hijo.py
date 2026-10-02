"""Hijo con animación propia. Solo el padre controla su proceso."""
import os
from pathlib import Path
import signal
import sys
import time

os.environ.setdefault("PYGAME_HIDE_SUPPORT_PROMPT", "1")
os.environ["SDL_VIDEO_WINDOW_POS"] = "750,100"
import pygame


def main(carpeta):
    carpeta = Path(carpeta)
    salida_solicitada = False

    def recibir_sigterm(numero, marco):
        # El manejador solo marca una bandera; el bucle hará la limpieza.
        nonlocal salida_solicitada
        salida_solicitada = True

    # POSIX: terminate envía SIGTERM. Windows: termina forzosamente.
    if os.name != "nt":
        signal.signal(signal.SIGTERM, recibir_sigterm)
    pygame.init()
    pantalla = pygame.display.set_mode((510, 345))
    pygame.display.set_caption("HIJO | Mi animación es independiente")
    fuente = pygame.font.Font(None, 25)
    reloj = pygame.time.Clock()
    fotogramas = 0
    cerrando_desde = None
    try:
        (carpeta / "listo.txt").write_text(str(os.getpid()))
        while True:
            # El límite de FPS evita consumir un núcleo entero.
            reloj.tick(60)
            for evento in pygame.event.get():
                if evento.type == pygame.QUIT or (
                    evento.type == pygame.KEYDOWN and evento.key == pygame.K_ESCAPE
                ):
                    salida_solicitada = True
            if salida_solicitada and cerrando_desde is None:
                cerrando_desde = time.monotonic()
            if cerrando_desde is not None and time.monotonic() - cerrando_desde >= 1.5:
                break
            fotogramas += 1
            # Contamos trabajo realizado, no tiempo de reloj: al reanudar,
            # los cuadrados continúan donde estaban, sin saltar la pausa.
            cantidad = (fotogramas // 6) % 61
            pantalla.fill("#101b2b")
            textos = [
                ("HIJO", 24),
                ("Cerrando..." if salida_solicitada else "Controla este proceso desde el PADRE.", 65),
            ]
            for texto, y in textos:
                pantalla.blit(fuente.render(texto, True, "#e6edf7"), (22, y))
            for i in range(60):
                rect = (23 + i % 10 * 47, 115 + i // 10 * 32, 37, 24)
                pygame.draw.rect(pantalla, "#58d6b4" if i < cantidad else "#263850",
                                 rect, border_radius=4)
            pygame.display.flip()
    finally:
        # Evidencia visible para el padre. kill y terminate en Windows
        # no permiten ejecutar este finally. No es un guardado simulado.
        (carpeta / "limpieza.txt").write_text("El hijo ejecutó su finally.", encoding="utf-8")
        pygame.quit()
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1]))
