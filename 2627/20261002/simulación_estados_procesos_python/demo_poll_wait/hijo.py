"""Proceso hijo: pinta 60 cuadrados durante unos seis segundos y termina."""
import os
import time

os.environ.setdefault("PYGAME_HIDE_SUPPORT_PROMPT", "1")
os.environ["SDL_VIDEO_WINDOW_POS"] = "750,100"
import pygame


def main():
    pygame.init()
    pantalla = pygame.display.set_mode((510,345))
    pygame.display.set_caption("HIJO | Pinto cuadrados por mi cuenta")
    fuente = pygame.font.Font(None, 27)
    reloj = pygame.time.Clock()
    inicio = time.perf_counter()
    print(f"HIJO | PID {os.getpid()} | Empiezo a pintar.", flush=True)
    try:
        while True:
            for evento in pygame.event.get():
                if evento.type == pygame.QUIT or (
                    evento.type == pygame.KEYDOWN and evento.key == pygame.K_ESCAPE
                ):
                    # Código distinto de cero para practicar el final anticipado.
                    return 2

            transcurrido = time.perf_counter() - inicio
            cantidad = min(60, int(transcurrido * 10))
            pantalla.fill("#101b2b")
            for texto, y in [
                ("HIJO", 24),
                ("Pinto cuadrados y me cierro al terminar.", 65),
            ]:
                pantalla.blit(fuente.render(texto, True, "#e6edf7"), (22, y))
            for i in range(60):
                rect = (23 + (i % 10) * 47, 115 + (i // 10) * 32, 37, 24)
                pygame.draw.rect(pantalla, "#58d6b4" if i < cantidad else "#263850", rect, border_radius=4)
            pygame.display.flip()
            # Dejamos el tablero completo visible durante medio segundo.
            if transcurrido >= 6.5:
                print("HIJO | Terminado. Código de salida: 0.", flush=True)
                return 0
            reloj.tick(60)
    finally:
        pygame.quit()


if __name__ == "__main__":
    raise SystemExit(main())
