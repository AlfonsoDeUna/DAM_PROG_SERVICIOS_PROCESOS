"""Tutorial visual de subprocess.Popen.poll() y wait(). Ejecutar este archivo."""
import argparse
import os
from pathlib import Path
import subprocess
import sys
import time

os.environ.setdefault("PYGAME_HIDE_SUPPORT_PROMPT", "1")
os.environ["SDL_VIDEO_WINDOW_POS"] = "40,100"
import pygame


def main(modo_inicial=None, auto_salir=False):
    pygame.init()
    pantalla = pygame.display.set_mode((690, 535))
    pygame.display.set_caption("PADRE | poll() y wait()")
    fuente = pygame.font.Font(None, 26)
    titulo = pygame.font.Font(None, 40)
    reloj = pygame.time.Clock()
    hijo = None
    modo = "PREPARADO"
    estado = "Pulsa un botón para crear al hijo y comparar."
    resultado = "Todavía no hay un proceso hijo."
    fotogramas = 0
    consultas = 0
    x = 32.0
    direccion = 1
    pendiente = modo_inicial
    ejecutando = True
    terminado = False
    inicio = 0.0
    botones = [
        (pygame.Rect(25, 255, 310, 52), "Probar poll()", "poll"),
        (pygame.Rect(355, 255, 310, 52), "Probar wait()", "wait"),
    ]

    def pintar():
        pantalla.fill("#101b2b")
        pantalla.blit(titulo.render("poll() frente a wait()", True, "#f0f5fc"), (28, 25))
        lineas = [
            (estado, 85),
            ("PADRE: observa si se mueve su cuadrado", 138),
        ]
        for texto, y in lineas:
            pantalla.blit(fuente.render(texto, True, "#ccd8e9"), (25, y))
        pygame.draw.rect(pantalla, "#263850", (25, 176, 640, 40), border_radius=6)
        pygame.draw.rect(pantalla, "#ffbf69", (int(x), 181, 30, 30), border_radius=4)
        for rect, texto, valor in botones:
            activo = hijo is None
            pygame.draw.rect(pantalla, "#28665a" if activo else "#26313e", rect, border_radius=8)
            etiqueta = fuente.render(texto, True, "#ffffff" if activo else "#7f8a98")
            pantalla.blit(etiqueta, etiqueta.get_rect(center=rect.center))
        pygame.draw.rect(pantalla, "#18283c", (25, 328, 640, 65), border_radius=7)
        pantalla.blit(fuente.render('poll(): consulta si el hijo terminó, sin bloquear al padre.', True, "#58d6b4"), (37, 337))
        pantalla.blit(fuente.render('Ejemplo: comprobar una descarga mientras la ventana responde.', True, "#ccd8e9"), (37, 364))
        pygame.draw.rect(pantalla, "#18283c", (25, 401, 640, 65), border_radius=7)
        pantalla.blit(fuente.render('wait(): bloquea al que llama hasta que el hijo termina.', True, "#58d6b4"), (37, 410))
        pantalla.blit(fuente.render('Ejemplo: esperar a que se genere un archivo antes de leerlo.', True, "#ccd8e9"), (37, 437))
        nota = "poll(): None = no terminó; un número = código de salida."
        pantalla.blit(fuente.render(nota, True, "#ccd8e9"), (25, 477))
        pygame.display.flip()

    try:
        while ejecutando:
            # Limita los FPS: poll() no necesita un bucle que sature la CPU.
            dt = min(reloj.tick(60) / 1000, 0.05)
            for evento in pygame.event.get():
                if evento.type == pygame.QUIT:
                    ejecutando = False
                elif evento.type == pygame.KEYDOWN:
                    if evento.key == pygame.K_ESCAPE:
                        ejecutando = False
                    elif hijo is None:
                        if evento.key == pygame.K_p:
                            pendiente = "poll"
                        elif evento.key == pygame.K_w:
                            pendiente = "wait"
                elif evento.type == pygame.MOUSEBUTTONDOWN and evento.button == 1 and hijo is None:
                    for rect, texto, valor in botones:
                        if rect.collidepoint(evento.pos):
                            pendiente = valor
            if not ejecutando:
                break

            if pendiente is not None and hijo is None:
                modo = pendiente
                pendiente = None
                consultas = 0
                terminado = False
                ruta_hijo = Path(__file__).resolve().with_name("hijo.py")
                # Igual que en clase: mismo intérprete y ruta junto al padre.
                hijo = subprocess.Popen([sys.executable, "-u", str(ruta_hijo)])
                inicio = time.perf_counter()
                print(f"PADRE | Modo {modo} | He creado al hijo {hijo.pid}.", flush=True)

                if modo == "wait":
                    estado = "wait(): padre detenido; el hijo sigue pintando."
                    resultado = f"Esperando al hijo PID {hijo.pid}..."
                    # Mostramos el aviso ANTES de bloquear el hilo de la ventana.
                    pintar()
                    antes = time.perf_counter()

                    # CLAVE 1: esta llamada no vuelve hasta que termina el hijo.
                    codigo = hijo.wait()

                    duracion = time.perf_counter() - antes
                    estado = "Hijo terminado. El padre vuelve a moverse."
                    resultado = f"wait() devolvió {codigo}. El hijo ha terminado."
                    # Descarta clics hechos sobre los botones mientras estaban
                    # desactivados. Conserva QUIT y las teclas de salida.
                    pygame.event.clear(pygame.MOUSEBUTTONDOWN)
                    hijo = None
                    terminado = True
                    print(f"PADRE | {resultado}", flush=True)
                else:
                    estado = "poll(): el padre y el hijo siguen animándose."

            if hijo is not None and modo == "poll":
                # CLAVE 2: consulta inmediata; None significa que no ha terminado.
                codigo = hijo.poll()
                consultas += 1
                resultado = f"poll() devuelve {codigo}  |  Hijo PID {hijo.pid}"

                # ¡No usar 'if codigo'! El código 0 también indica finalización.
                if codigo is not None:
                    estado = "Hijo terminado. El padre ha seguido moviéndose."
                    print(f"PADRE | {resultado}", flush=True)
                    hijo = None
                    terminado = True

            # El padre hace trabajo útil entre las consultas a poll().
            # Durante wait() no se ejecuta ninguna de estas instrucciones.
            x += direccion * 220 * dt
            if x >= 632 or x <= 32:
                x = max(32, min(632, x))
                direccion *= -1
            fotogramas += 1
            pintar()
            if auto_salir and terminado:
                ejecutando = False
    finally:
        # Solo limpiamos el proceso hijo creado por esta demo.
        if hijo is not None:
            if hijo.poll() is None:
                hijo.terminate()
            try:
                hijo.wait(timeout=2)
            except subprocess.TimeoutExpired:
                hijo.kill()
                hijo.wait()
        pygame.quit()
    return {"fotogramas": fotogramas, "consultas": consultas, "terminado": terminado}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--modo", choices=["poll", "wait"], help="Iniciar directamente un modo")
    parser.add_argument("--auto-salir", action="store_true", help="Cerrar al terminar la prueba")
    argumentos = parser.parse_args()
    main(argumentos.modo, argumentos.auto_salir)
