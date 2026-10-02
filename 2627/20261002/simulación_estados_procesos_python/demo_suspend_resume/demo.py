"""suspend() y resume(): controles del padre sobre un hijo real."""
import os
from pathlib import Path
import subprocess
import sys
import tempfile

os.environ.setdefault("PYGAME_HIDE_SUPPORT_PROMPT", "1")
os.environ["SDL_VIDEO_WINDOW_POS"] = "30,100"
import pygame
import psutil

TITULO = "suspend() y resume()"
PAUSA = True


def main():
    pygame.init()
    pantalla = pygame.display.set_mode((690, 535))
    pygame.display.set_caption("PADRE | " + TITULO)
    fuente = pygame.font.Font(None, 26)
    titulo = pygame.font.Font(None, 38)
    reloj = pygame.time.Clock()
    hijo = None
    p = None
    suspendido = False
    terminado = False
    mensaje = "Iniciando al hijo..."
    ultima = ""
    fotogramas = 0
    temporales = tempfile.TemporaryDirectory(prefix="demo_procesos_")
    carpeta = Path(temporales.name)
    botones = [
        (pygame.Rect(25, 255, 200, 52), "Nuevo hijo", "nuevo"),
        (pygame.Rect(245, 255, 200, 52), "suspend()" if PAUSA else "terminate()", "primero"),
        (pygame.Rect(465, 255, 200, 52), "resume()" if PAUSA else "kill()", "segundo"),
    ]

    def habilitado(accion):
        if accion == "nuevo":
            return hijo is None or terminado
        listo = hijo is not None and not terminado and (carpeta / "listo.txt").exists()
        if not listo:
            return False
        return (not suspendido if accion == "primero" else suspendido) if PAUSA else True

    try:
        abierto = True
        iniciar = True
        while abierto:
            reloj.tick(60)
            acciones = ["nuevo"] if iniciar else []
            iniciar = False
            for evento in pygame.event.get():
                if evento.type == pygame.QUIT:
                    abierto = False
                elif evento.type == pygame.MOUSEBUTTONDOWN and evento.button == 1:
                    for rect, texto, accion in botones:
                        if rect.collidepoint(evento.pos):
                            acciones.append(accion)
                elif evento.type == pygame.KEYDOWN:
                    if evento.key == pygame.K_ESCAPE:
                        abierto = False
                    atajos = {pygame.K_n: "nuevo", pygame.K_s: "primero", pygame.K_r: "segundo"} if PAUSA else {
                        pygame.K_n: "nuevo", pygame.K_t: "primero", pygame.K_k: "segundo"}
                    if evento.key in atajos:
                        acciones.append(atajos[evento.key])
            if not abierto:
                break
            for accion in acciones:
                if not habilitado(accion):
                    continue
                try:
                    if accion == "nuevo":
                        for nombre in ("listo.txt", "limpieza.txt"):
                            (carpeta / nombre).unlink(missing_ok=True)
                        ruta = Path(__file__).resolve().with_name("hijo.py")
                        hijo = subprocess.Popen([sys.executable, "-u", str(ruta), str(carpeta)])
                        # p controla exactamente el proceso creado por Popen.
                        p = psutil.Process(hijo.pid)
                        suspendido = terminado = False
                        ultima = ""
                        mensaje = "Iniciando al hijo..."
                    elif PAUSA and accion == "primero":
                        p.suspend()  # Pausa al hijo; el padre continúa.
                        suspendido = True
                        mensaje = "Hijo pausado. Sigue existiendo."
                    elif PAUSA:
                        p.resume()   # Continúa el mismo hijo desde donde estaba.
                        suspendido = False
                        mensaje = "Hijo reanudado. Continúa donde se quedó."
                    elif accion == "primero":
                        p.terminate()
                        ultima = "terminate()"
                        mensaje = "terminate() enviado. Esperando el cierre del hijo..."
                    else:
                        p.kill()
                        ultima = "kill()"
                        mensaje = "kill() enviado. Esperando el cierre del hijo..."
                except psutil.NoSuchProcess:
                    mensaje = "El hijo ya ha terminado."
                except (psutil.AccessDenied, OSError) as error:
                    mensaje = "No se pudo realizar la acción. Mira la terminal."
                    print(error, flush=True)

            # No usamos wait() en el bucle: el padre debe seguir respondiendo.
            if hijo is not None and not terminado:
                codigo = hijo.poll()
                if codigo is not None:
                    terminado = True
                    suspendido = False
                    mensaje = (ultima + ": hijo terminado.") if ultima else "El hijo ha terminado."
                elif (carpeta / "listo.txt").exists() and mensaje == "Iniciando al hijo...":
                    mensaje = "El hijo está dibujando. Prueba los botones."

            fotogramas += 1
            pantalla.fill("#101b2b")
            pantalla.blit(titulo.render(TITULO, True, "#f0f5fc"), (25, 24))
            pantalla.blit(fuente.render(mensaje, True, "#58d6b4"), (25, 85))
            pantalla.blit(fuente.render("PADRE: su animación continúa", True, "#ccd8e9"), (25, 138))
            pygame.draw.rect(pantalla, "#263850", (25, 176, 640, 40), border_radius=6)
            x = 29 + abs((fotogramas * 3) % 1200 - 600)
            pygame.draw.rect(pantalla, "#ffbf69", (x, 181, 30, 30), border_radius=4)
            for rect, texto, accion in botones:
                activo = habilitado(accion)
                pygame.draw.rect(pantalla, "#28665a" if activo else "#26313e", rect, border_radius=8)
                etiqueta = fuente.render(texto, True, "#ffffff" if activo else "#7f8a98")
                pantalla.blit(etiqueta, etiqueta.get_rect(center=rect.center))
            pygame.draw.rect(pantalla, "#18283c", (25, 328, 640, 65), border_radius=7)
            pantalla.blit(fuente.render('suspend(): pausa al hijo sin cerrarlo ni perder sus datos.', True, "#58d6b4"), (37, 337))
            pantalla.blit(fuente.render('Ejemplo: pausar un cálculo para liberar tiempo de CPU.', True, "#ccd8e9"), (37, 364))
            pygame.draw.rect(pantalla, "#18283c", (25, 401, 640, 65), border_radius=7)
            pantalla.blit(fuente.render('resume(): permite que el hijo suspendido continúe.', True, "#58d6b4"), (37, 410))
            pantalla.blit(fuente.render('Ejemplo: continuar ese cálculo desde donde se quedó.', True, "#ccd8e9"), (37, 437))
            nota = "Pausar no es terminar: se conserva el mismo proceso."
            pantalla.blit(fuente.render(nota, True, "#ccd8e9"), (25, 477))
            detalle = "" if PAUSA or not terminado else (
                "El hijo ejecutó su limpieza." if (carpeta / "limpieza.txt").exists() else
                "El hijo no ejecutó su limpieza.")
            pantalla.blit(fuente.render(detalle, True, "#ccd8e9"), (25, 502))
            pygame.display.flip()
    finally:
        # Recogemos solo nuestro hijo, incluso si estaba suspendido.
        if hijo is not None:
            if hijo.poll() is None:
                hijo.kill()
            hijo.wait()
        pygame.quit()
        temporales.cleanup()


if __name__ == "__main__":
    main()
