# PSP · Reto guiado: crea tu Guardián de procesos

## Descripción de la tarea

Eres el técnico encargado de probar una aplicación que realiza un trabajo. Necesitas **ponerla en marcha, detenerla temporalmente para revisarla y decidir si puede continuar o debe cerrarse**.

Vas a crear dos programas en la misma carpeta:

| Archivo | ¿Qué hace? |
|---|---|
| **`aplicacion.py`** | Es el **hijo**. Simula un trabajo mostrando mensajes numerados. |
| **`guardian.py`** | Es el **padre**. Lanza al hijo y controla lo que ocurre con él. |

**Todo es una simulación:** no se modifican archivos ni se controlan otros programas del ordenador.

En esta práctica crearás ambos archivos desde cero. El código inicial está incluido en los pasos siguientes; después completarás el control del hijo siguiendo las pistas.

## Paso 1. Crea la aplicación que vamos a controlar

Crea una carpeta llamada **`Reto_guardian`** y, dentro, un archivo llamado **`aplicacion.py`**.

Este programa debe mostrar 20 operaciones numeradas. Después de las operaciones **3, 6, 9, 12, 15 y 18**, hará una pausa de tres segundos y continuará.

Escribe este código:

```python
import time

# Simulamos un trabajo formado por 20 operaciones.
for numero in range(1, 21):
    print(f"HIJO | Realizando operación {numero} de 20", flush=True)

    # Después de cada grupo de tres operaciones, hacemos una pausa.
    if numero % 3 == 0:
        time.sleep(3)

print("HIJO | Trabajo terminado.", flush=True)
```

La condición `numero % 3 == 0` comprueba si el número es múltiplo de tres. `time.sleep(3)` introduce la espera dentro del propio hijo.

> **Importante:** esta pausa automática no es todavía la pausa que ordenará el guardián.

**Comprueba este archivo por separado:** ejecútalo y observa que avanza en grupos de tres operaciones hasta terminar.

## Paso 2. Crea el guardián y prepara el lanzamiento

En la misma carpeta, crea **`guardian.py`**.

Puedes comenzar con este código:

```python
import subprocess
import sys
import time
from pathlib import Path

import psutil

# Localizamos aplicacion.py en la misma carpeta que guardian.py.
ruta_hijo = Path(__file__).resolve().with_name("aplicacion.py")

# Lanzamos la aplicación como un proceso hijo.
hijo = subprocess.Popen([sys.executable, "-u", str(ruta_hijo)])

print("GUARDIÁN | Aplicación iniciada. PID:", hijo.pid)

# Preparamos el acceso al hijo mediante psutil.
control = psutil.Process(hijo.pid)

# A partir de aquí, añade los siguientes pasos.
```

El lanzamiento utiliza el mismo intérprete de Python con el que ejecutas el padre.

**`hijo` y `control` se refieren al mismo proceso**, pero permiten utilizar herramientas de dos librerías diferentes: usarás `hijo` para consultar y esperar su finalización, y `control` para suspenderlo y reanudarlo.

## Paso 3. Deja que trabaje y comprueba si ha terminado

Añade una espera de **tres segundos en el padre**, para dar tiempo a que el hijo empiece su trabajo.

Después, consulta si el hijo ha terminado, **sin quedarte esperando a que finalice**. Guarda el resultado en una variable llamada `estado`.

**Pista:** elige entre los métodos de consulta y espera estudiados. La consulta adecuada devuelve `None` cuando el hijo todavía no ha terminado.

Si no ha terminado, continúa con el siguiente paso. Si ya ha terminado, muestra un mensaje indicándolo y no intentes pausarlo.

## Paso 4. Detén temporalmente al hijo

Si el hijo sigue sin terminar, **detén temporalmente su ejecución** y muestra:

```text
GUARDIÁN | Aplicación pausada. Pendiente de revisión.
```

**Pista:** utiliza sobre `control` el método que detiene la ejecución sin finalizar el proceso. No debes cerrar la aplicación ni lanzar otra nueva.

> **No añadas un `sleep()` en el padre como sustituto de esta acción:** dormir al padre no pausa al hijo.

## Paso 5. Pregunta y aplica la decisión

Con el hijo detenido temporalmente, pregunta al usuario:

```python
decision = input("¿Autorizar o bloquear? ").strip().lower()
```

Después, utiliza una condición para decidir qué hacer:

| Respuesta | Lo que debe hacer el guardián | Pista |
|---|---|---|
| **`autorizar`** | Permitir que el mismo hijo continúe desde donde estaba. | Utiliza sobre `control` el método contrario al que elegiste para pausarlo. |
| **`bloquear`** | Finalizar al hijo sin completar el trabajo pendiente. | Utiliza sobre `hijo` uno de los métodos de finalización vistos en clase. |

Si el usuario escribe otra cosa, **vuelve a pedir la decisión**. No cierres el guardián dejando al hijo suspendido.

## Paso 6. Espera el final y muestra el resultado

Después de autorizar o bloquear, el padre debe **esperar a que el hijo haya terminado realmente**.

Guarda el código de salida en una variable y, después, muestra:

```text
GUARDIÁN | Revisión finalizada.
GUARDIÁN | Código de salida: ...
```

**Pista:** utiliza el método de `hijo` que espera su finalización y devuelve su código de salida. Colócalo **después de aplicar la decisión**, no mientras el hijo sigue suspendido pendiente de respuesta.

## Paso 7. Prueba las dos opciones

Cuando hayas completado el programa, **ejecuta únicamente `guardian.py`**: él se encargará de lanzar la aplicación.

| Prueba | Qué tienes que hacer | Qué debe ocurrir |
|---|---|---|
| **Autorizar** | Cuando aparezca la pregunta, espera al menos cinco segundos y escribe `autorizar`. | Mientras decides, no aparecen nuevas operaciones. Después, el hijo continúa desde donde estaba y termina su trabajo. |
| **Bloquear** | Vuelve a ejecutar el guardián, espera al menos cinco segundos ante la pregunta y escribe `bloquear`. | El hijo no continúa con las operaciones restantes y el guardián confirma su finalización. |

**No tiene que detenerse siempre en el mismo número de operación.** Lo importante es que deje de avanzar mientras decides y que responda correctamente a la opción elegida.

## Cómo entregar

Sube a Moodle los dos archivos:

**`aplicacion.py` y `guardian.py`**

En los comentarios de `guardian.py`, indica tu nombre y explica brevemente **qué métodos has elegido para consultar, pausar, continuar, finalizar y esperar**.

Añade también dos comentarios finales indicando qué has observado al **autorizar** y al **bloquear**.

**En esta versión no necesitas ZIP, `apoyo.py`, capturas ni una memoria aparte.**

## Documentación de consulta

- [Python: gestión de subprocesos con `subprocess`](https://docs.python.org/3/library/subprocess.html).
- [Python: funciones del módulo `time`](https://docs.python.org/3/library/time.html).
- [psutil: documentación de la API](https://psutil.io/api/).
