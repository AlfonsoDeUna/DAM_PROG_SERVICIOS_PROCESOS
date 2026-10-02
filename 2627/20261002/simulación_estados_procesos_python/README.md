# Simulación de estados de procesos en Python

Tres demos visuales con **Pygame**, un proceso padre y un hijo real. Incluyen botones, explicaciones breves y ejemplos de uso.

## Descargar

1. [Descarga el repositorio en ZIP](https://github.com/AlfonsoDeUna/DAM_PROG_SERVICIOS_PROCESOS/archive/refs/heads/main.zip) y descomprímelo.
2. Abre la carpeta `2627/20261002/simulación_estados_procesos_python`.
3. Abre esa carpeta en Visual Studio.

Puedes copiar esta carpeta completa a otro ordenador; no depende de otros archivos del repositorio.

## Instalar las librerías

Necesitas Python 3.10 o posterior. En la terminal de Visual Studio, situada en esta carpeta, ejecuta:

```bash
python -m pip install -r requirements.txt
```

Este comando instala **pygame** y **psutil**, las librerías necesarias para las tres demos. Utiliza el mismo intérprete de Python que tengas seleccionado para ejecutar los programas en Visual Studio.

## Ejecutar una demo

Abre el archivo `demo.py` de la carpeta que quieras probar y ejecútalo desde Visual Studio:

- `demo_poll_wait/demo.py`
- `demo_suspend_resume/demo.py`
- `demo_terminate_kill/demo.py`

Ejecuta una demo cada vez. El padre abre automáticamente el proceso hijo; no tienes que ejecutar `hijo.py` por separado.

## Qué observar

| Carpeta | Prueba | Resultado |
| --- | --- | --- |
| `demo_poll_wait` | Pulsa **Probar poll()** y luego **Probar wait()**. | Con `poll()` el padre sigue animándose; con `wait()` su animación se detiene hasta que termina el hijo. |
| `demo_suspend_resume` | Pulsa **suspend()** y **resume()**. | El hijo se pausa y continúa donde estaba. El padre sigue animándose. |
| `demo_terminate_kill` | Pulsa **terminate()**, **Nuevo hijo** y **kill()**. | Se termina al hijo; el padre permanece abierto para repetir. |

Los botones se pulsan en la ventana **PADRE**. Los botones grises están desactivados. Las dos últimas demos crean al hijo automáticamente. En la primera, cada botón crea un hijo que pinta durante unos seis segundos y termina.

La propia demo de `terminate()` y `kill()` explica cómo se comportan en tu ordenador.

Durante `wait()`, el padre deja de atender su ventana a propósito y puede aparecer «No responde». Al terminar el hijo recupera la respuesta. Durante `suspend()`, es el hijo el que queda congelado; pulsa **resume()** en el padre para reanudarlo.

## Archivos de cada demo

- `demo.py`: programa principal y ventana del padre. **Ejecuta este archivo.**
- `hijo.py`: programa auxiliar que el padre arranca automáticamente. Déjalo junto a `demo.py`.
- `requirements.txt`: dependencias de esa demo por separado.
- `LEEME.txt`: tutorial ampliado y relación con los ejemplos de clase.

Puedes mover las ventanas si se superponen. Al cerrar el padre se recoge su hijo para no dejarlo ejecutándose. No hace falta descargar imágenes adicionales.
