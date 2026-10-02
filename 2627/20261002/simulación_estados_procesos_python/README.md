# Simulación de estados de procesos en Python

Tres demos visuales con **Pygame**, un proceso padre y un hijo real. Incluyen botones, explicaciones breves y ejemplos de uso.

## Descargar

1. [Descarga el repositorio en ZIP](https://github.com/AlfonsoDeUna/DAM_PROG_SERVICIOS_PROCESOS/archive/refs/heads/main.zip) y descomprímelo.
2. Abre la carpeta `2627/20261002/simulación_estados_procesos_python`.
3. Abre una terminal dentro de esa carpeta y sigue las instrucciones de tu sistema.

Puedes copiar esta carpeta completa a otro ordenador; no depende de otros archivos del repositorio.

## Requisitos

Python 3.10 o posterior, una sesión de escritorio y conexión a Internet para instalar las dependencias. Probado con Python 3.12 en Windows. El código contempla Linux y macOS, pero esas plataformas no se han probado en esta entrega.

## Windows

Instala Python si aún no lo tienes. Desde la carpeta de estas demos:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Ejecuta una demo cada vez:

```powershell
.\.venv\Scripts\python.exe demo_poll_wait/demo.py
.\.venv\Scripts\python.exe demo_suspend_resume/demo.py
.\.venv\Scripts\python.exe demo_terminate_kill/demo.py
```

Si tu instalación no reconoce `py`, utiliza `python` en el primer comando. No es necesario activar el entorno virtual.

## Linux y macOS

```bash
python3 -m venv .venv
./.venv/bin/python -m pip install -r requirements.txt
```

Ejecuta una demo cada vez:

```bash
./.venv/bin/python demo_poll_wait/demo.py
./.venv/bin/python demo_suspend_resume/demo.py
./.venv/bin/python demo_terminate_kill/demo.py
```

En algunas distribuciones de Linux debes instalar el paquete `python3-venv` si falla la creación del entorno.

## Qué observar

| Carpeta | Prueba | Resultado |
| --- | --- | --- |
| `demo_poll_wait` | Pulsa **Probar poll()** y luego **Probar wait()**. | Con `poll()` el padre sigue animándose; con `wait()` su animación se detiene hasta que termina el hijo. |
| `demo_suspend_resume` | Pulsa **suspend()** y **resume()**. | El hijo se pausa y continúa donde estaba. El padre sigue animándose. |
| `demo_terminate_kill` | Pulsa **terminate()**, **Nuevo hijo** y **kill()**. | Se termina al hijo; el padre permanece abierto para repetir. |

Los botones se pulsan en la ventana **PADRE**. Los botones grises están desactivados. Las dos últimas demos crean al hijo automáticamente. En la primera, cada botón crea un hijo que pinta durante unos seis segundos y termina.

**En Windows, terminate() y kill() fuerzan el cierre del hijo.** En Linux/macOS, `terminate()` envía SIGTERM, que este hijo maneja para cerrar con limpieza; `kill()` envía SIGKILL y no permite ejecutar esa limpieza. `terminate()` no garantiza una salida ordenada en cualquier programa.

Durante `wait()`, el padre deja de atender su ventana a propósito y puede aparecer «No responde». Al terminar el hijo recupera la respuesta. Durante `suspend()`, es el hijo el que queda congelado; pulsa **resume()** en el padre para reanudarlo.

## Archivos de cada demo

- `demo.py`: programa principal y ventana del padre. **Ejecuta este archivo.**
- `hijo.py`: programa auxiliar que el padre arranca automáticamente. Déjalo junto a `demo.py`.
- `requirements.txt`: dependencias de esa demo por separado.
- `LEEME.txt`: tutorial ampliado y relación con los ejemplos de clase.

Puedes mover las ventanas si se superponen. Al cerrar el padre se recoge su hijo para no dejarlo ejecutándose. No hace falta descargar imágenes ni instalar un editor concreto.
