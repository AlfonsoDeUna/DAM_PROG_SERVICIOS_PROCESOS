# Procesos con Python en Windows

## Apuntes de los ejemplos 1 a 6

Un programa Python puede iniciar otras aplicaciones, ejecutar comandos del sistema y poner en marcha otros programas Python. En esta clase aprenderás a hacerlo con `subprocess` y a distinguir cuándo el programa principal espera y cuándo puede continuar.

Los ejemplos están pensados para **Windows, Python 3 y una terminal de Visual Studio Code**. Los módulos utilizados vienen con Python: no necesitas instalar paquetes adicionales.

## Índice

- [Antes de empezar](#antes-de-empezar)
- [1. Lanzamiento de una aplicación](#1-lanzamiento-de-una-aplicación)
- [2. Argumentos de ejecución](#2-argumentos-de-ejecución)
- [3. Ejecución de comandos del sistema](#3-ejecución-de-comandos-del-sistema)
- [4. Captura de la salida de un comando](#4-captura-de-la-salida-de-un-comando)
- [5. Ejecución de un script desde otro script](#5-ejecución-de-un-script-desde-otro-script)
- [6. Ejecución con espera y sin espera](#6-ejecución-con-espera-y-sin-espera)
- [Errores frecuentes](#errores-frecuentes)
- [Comprueba lo que has entendido](#comprueba-lo-que-has-entendido)
- [Documentación de consulta](#documentación-de-consulta)

## Antes de empezar

### Programa y proceso

Un **programa** es un conjunto de instrucciones. Por ejemplo, `tarea.py` será un archivo que contiene código Python.

Un **proceso** es una ejecución de un programa. Cuando ejecutas `tarea.py`, el intérprete de Python ejecuta sus instrucciones dentro de un proceso. Guardar el archivo no lo pone en marcha: hay que ejecutarlo.

Si lanzas el mismo programa dos veces, puedes tener dos procesos ejecutando el mismo código. Además, un proceso puede funcionar sin mostrar una ventana gráfica.

### Preparar la carpeta de clase

1. Crea una carpeta llamada `procesos_clase` y ábrela en Visual Studio Code.
2. Abre una terminal situada en esa carpeta.
3. Crea y guarda los archivos a medida que aparezcan en los apuntes.
4. Ejecuta los comandos de terminal indicados debajo de los ejemplos.

Estos son los archivos que utilizaremos:

| Archivo | Para qué sirve | Cuándo se crea |
| --- | --- | --- |
| `lanzamientos.py` | Abrir aplicaciones y ejecutar comandos. | Ejemplo 1; se reutiliza hasta el 4. |
| `fichero.txt` | Contener el texto que abriremos con Bloc de notas. | Ejemplo 2. |
| `tarea.py` | Ejecutar una tarea breve como proceso hijo. | Ejemplo 5. |
| `lanzador.py` | Poner en marcha `tarea.py`. | Ejemplo 5; se modifica en el 6. |

En los ejemplos usamos nombres como `fichero.txt` o `tarea.py` sin una ruta completa. Se buscan desde la **carpeta de trabajo**, que aquí será `procesos_clase`. Por eso debes ejecutar los programas desde esa carpeta.

**Cómo seguir los cambios:** cada bloque de Python muestra el contenido completo del archivo indicado. Cuando se pida reutilizarlo, sustituye su contenido por la nueva versión. Si conservas una versión anterior en el mismo archivo, coméntala con `#` para que no se ejecute también.

## 1. Lanzamiento de una aplicación

**Objetivo:** abrir una aplicación de Windows desde Python.

Crea **`lanzamientos.py`**:

```python
import subprocess

subprocess.run(["notepad.exe"])
```

Ejecuta en la terminal:

```powershell
python lanzamientos.py
```

Se abrirá el Bloc de notas.

### Qué significa el código

- `import subprocess` permite utilizar el módulo que gestiona el lanzamiento de otros programas.
- `subprocess.run(...)` inicia la orden indicada y espera a que termine el proceso lanzado.
- `["notepad.exe"]` es una **lista** con un elemento: el nombre del programa que queremos ejecutar.
- Las comillas indican que `"notepad.exe"` es una cadena de texto.

Una llamada a una función utiliza paréntesis: dentro se colocan los datos que necesita. Aquí pasamos a `run` una lista con la orden.

**Qué observar:** Python puede poner en marcha un programa externo. La ventana que ves pertenece al Bloc de notas; no la hemos dibujado con Python.

> La espera de `run` se refiere al proceso que ha lanzado. Una aplicación puede delegar su ventana en otro proceso, por lo que el cierre de la ventana no siempre sirve para comprobar esa espera. En el ejemplo 5 la estudiaremos con un programa Python propio.

## 2. Argumentos de ejecución

**Objetivo:** indicar a una aplicación qué archivo debe abrir.

Crea **`fichero.txt`** en la misma carpeta y escribe:

```text
Hola, estamos aprendiendo a lanzar procesos desde Python.
```

Reutiliza **`lanzamientos.py`**:

```python
import subprocess

subprocess.run(["notepad.exe", "fichero.txt"])
```

Ejecuta otra vez:

```powershell
python lanzamientos.py
```

Ahora el Bloc de notas debe abrir el documento que has creado.

### Programa y argumentos

Un **argumento de ejecución** es un dato que entregamos a un programa al iniciarlo para indicarle qué debe hacer.

| Elemento de la lista | Significado |
| --- | --- |
| `"notepad.exe"` | Programa que se ejecuta. |
| `"fichero.txt"` | Argumento que recibe: el archivo que debe abrir. |

El archivo `.txt` contiene datos. Quien se ejecuta es el Bloc de notas, que interpreta ese argumento y abre el texto.

**Prueba para entenderlo:** modifica el contenido de `fichero.txt`, guarda los cambios y vuelve a ejecutar el lanzador. La orden de Python puede ser la misma aunque cambie el contenido del documento.

## 3. Ejecución de comandos del sistema

**Objetivo:** ejecutar desde Python órdenes que también podemos utilizar en la terminal.

Hay comandos que son programas ejecutables y otros que interpreta una consola como CMD. Veremos las dos situaciones.

### Ejecutar un programa de consola

Reutiliza **`lanzamientos.py`**:

```python
import subprocess

subprocess.run(["ipconfig"])
```

Ejecuta `python lanzamientos.py`. La información de configuración de red aparecerá en la terminal.

`ipconfig` es un programa ejecutable de Windows. Podemos pedir a `subprocess` que lo inicie directamente.

### Ejecutar una orden interna de CMD

`dir` muestra los archivos y carpetas de un directorio. Es una orden interna de CMD: para usarla de esta forma tenemos que iniciar el intérprete que la entiende.

Sustituye el contenido de **`lanzamientos.py`**:

```python
import subprocess

subprocess.run(["cmd.exe", "/c", "dir"])
```

| Elemento | Significado |
| --- | --- |
| `"cmd.exe"` | Inicia el intérprete de comandos de Windows. |
| `"/c"` | Le indica que ejecute la orden siguiente y termine. |
| `"dir"` | Orden que CMD debe interpretar. |

Ejecuta el archivo y observa el listado. En esta práctica debe corresponder a la carpeta `procesos_clase`.

**No es necesario que aparezca otra ventana:** estos comandos pueden escribir en la terminal desde la que has lanzado Python.

### Otra forma de utilizar el intérprete

También podemos solicitar que Python utilice el intérprete de comandos mediante `shell=True`.

Esta es una versión alternativa completa de **`lanzamientos.py`**:

```python
import subprocess

subprocess.run("dir", shell=True)
```

Aquí pasamos una cadena con la orden. `shell=True` es una opción de la llamada: pide ejecutarla mediante el intérprete. En Windows, el intérprete predeterminado suele ser CMD.

Para esta prueba utilizamos la orden fija `"dir"`. No construyas órdenes de consola concatenando texto introducido por un usuario: algunos caracteres pueden interpretarse como nuevas órdenes.

**Prueba para entenderlo:** compara las dos formas de ejecutar `dir`. En ambas se utiliza un intérprete, aunque en la primera escribimos explícitamente `cmd.exe`.

## 4. Captura de la salida de un comando

**Objetivo:** recoger lo que escribe un comando para mostrarlo desde nuestro programa.

Hasta ahora la salida aparecía directamente en la terminal. Al capturarla, la guardamos en el resultado de la llamada y decidimos cuándo mostrarla.

Reutiliza **`lanzamientos.py`**:

```python
import subprocess

resultado = subprocess.run(
    ["cmd.exe", "/u", "/c", "dir"],
    capture_output=True,
    text=True,
    encoding="utf-16le"
)

print("Contenido de la carpeta:")
print(resultado.stdout)
# print(resultado.stderr)  # Permite consultar la salida de error
```

Ejecuta `python lanzamientos.py`.

### Qué añadimos

| Elemento | Para qué sirve |
| --- | --- |
| `resultado = ...` | Guarda el objeto que devuelve `run` cuando termina la orden. |
| `capture_output=True` | Recoge la salida normal y la salida de error. |
| `text=True` | Permite trabajar con esas salidas como texto. |
| `"/u"` | Pide a CMD salida Unicode para sus órdenes internas. |
| `encoding="utf-16le"` | Indica cómo interpretar ese texto al recogerlo. |
| `resultado.stdout` | Contiene la salida normal capturada. |
| `resultado.stderr` | Contiene la salida de error capturada. |

`stdout` y `stderr` son **atributos** del resultado: se accede a ellos con un punto y sin paréntesis. `print(...)`, en cambio, es una llamada a una función.

La **codificación** establece cómo se representan los caracteres. En este ejemplo emparejamos `/u` con `utf-16le` para recoger la salida de `dir` a través de CMD. Otros programas pueden utilizar otra codificación: no copies esta pareja automáticamente para cualquier comando.

### Capturar no es mostrar

`capture_output=True` recoge los mensajes; `print(resultado.stdout)` los presenta en pantalla. Como utilizamos `run`, el programa recibe el resultado después de que termine la orden.

**Prueba para entenderlo:** comenta únicamente la línea `print(resultado.stdout)` y vuelve a ejecutar el archivo. Aparecerá el título, pero no el listado. El comando sí se ha ejecutado; su salida está capturada y no la hemos mostrado.

Si quieres consultar posibles mensajes de error, activa también la última línea. Que `stderr` esté vacío significa que no se ha recibido texto por ese canal.

## 5. Ejecución de un script desde otro script

**Objetivo:** crear un programa que ponga en marcha otro programa Python y espere a que termine.

Ahora vamos a trabajar con dos archivos. El **proceso padre** será la ejecución de `lanzador.py`; el **proceso hijo**, la ejecución de `tarea.py` que crea el padre.

### Crear la tarea hija

Crea **`tarea.py`**:

```python
import time

print("[Hijo] Empiezo", flush=True)
time.sleep(3)
print("[Hijo] Termino", flush=True)
```

Primero comprueba la tarea por separado:

```powershell
python tarea.py
```

Debe mostrar el primer mensaje, esperar unos tres segundos y mostrar el segundo. Después termina.

- `time.sleep(3)` introduce una pausa de tres segundos en el hilo que lo ejecuta. En este programa sencillo, se pausa la tarea hija. El tiempo real puede ser algo mayor.
- `flush=True` pide a `print` que vacíe la salida pendiente para que podamos observar el mensaje sin un retraso debido al búfer.
- `[Hijo]` es solo una etiqueta de texto que hemos elegido. No es una instrucción especial de Python.

### Crear el lanzador

Crea **`lanzador.py`** junto a `tarea.py`:

```python
import subprocess
import sys

print("[Padre] Antes", flush=True)
subprocess.run([sys.executable, "tarea.py"])
print("[Padre] Después", flush=True)
```

Ejecuta desde esa carpeta:

```powershell
python lanzador.py
```

La salida esperada, si ambos programas se ejecutan correctamente, es:

```text
[Padre] Antes
[Hijo] Empiezo
[Hijo] Termino
[Padre] Después
```

La pausa ocurre entre los dos mensajes del hijo.

### Qué es `sys.executable`

`sys.executable` contiene la ruta del intérprete de Python que está ejecutando el programa padre. Al usarla en la orden, pedimos que el hijo utilice ese mismo intérprete.

| Elemento de la orden | Función |
| --- | --- |
| `sys.executable` | Programa que se inicia: el intérprete de Python. |
| `"tarea.py"` | Archivo de código que ese intérprete debe ejecutar. |

No escribimos comillas alrededor de `sys.executable` porque queremos utilizar su valor, no el texto literal `"sys.executable"`.

### Por qué el padre imprime al final

La llamada a `run` espera a que termine el hijo. Por eso el padre no llega a su último `print` hasta que `tarea.py` ha acabado.

**Prueba para entenderlo:** cambia `sleep(3)` por `sleep(5)` en el hijo. El padre seguirá mostrando «Después» al terminar la tarea, sin necesidad de añadir una pausa al lanzador.

## 6. Ejecución con espera y sin espera

**Objetivo:** permitir que el padre continúe después de iniciar al hijo.

Conserva **`tarea.py`** del ejemplo anterior y vuelve a dejar su pausa en tres segundos. Reutiliza **`lanzador.py`**, sustituyendo su contenido por esta versión:

```python
import subprocess
import sys

print("[Padre] Antes", flush=True)
proceso = subprocess.Popen([sys.executable, "tarea.py"])
print("[Padre] Después", flush=True)
```

Ejecuta `python lanzador.py`.

### Qué cambia con `Popen`

`Popen` inicia el hijo y devuelve un objeto que lo representa. La variable `proceso` guarda ese objeto. El padre puede avanzar a su siguiente instrucción sin esperar a que termine la tarea hija.

Se escribe **`Popen`**, con la primera letra en mayúscula. Python distingue mayúsculas y minúsculas.

Una salida posible es:

```text
[Padre] Antes
[Padre] Después
[Hijo] Empiezo
[Hijo] Termino
```

También puede aparecer:

```text
[Padre] Antes
[Hijo] Empiezo
[Padre] Después
[Hijo] Termino
```

Estos ejemplos ilustran órdenes posibles; no recogen todas las situaciones. Si el padre se retrasa lo suficiente, «Después» también podría aparecer tras el final del hijo. **No esperar al hijo no garantiza imprimir antes que él.**

### Qué orden podemos asegurar

En una ejecución correcta:

- El padre muestra «Antes» antes de lanzar al hijo.
- Dentro del hijo, «Empiezo» precede a «Termino».
- Con `Popen`, el orden entre «Después» y los mensajes del hijo no queda fijado por una espera del padre.

El sistema operativo reparte el tiempo de ejecución entre los procesos. Por eso repetir una prueba puede producir un orden distinto, aunque el código sea el mismo.

En esta versión, padre e hijo comparten la salida de la terminal. Que sus mensajes aparezcan en el mismo lugar no significa que sean el mismo proceso.

### Comparación entre `run` y `Popen`

| Pregunta | `subprocess.run(...)` | `subprocess.Popen(...)` |
| --- | --- | --- |
| ¿Inicia otro programa? | Sí. | Sí. |
| ¿La llamada espera a que termine ese proceso? | Sí. | No. |
| ¿Cuándo continúa el padre? | Cuando finaliza la orden. | Cuando termina el lanzamiento, sin esperar al final del hijo. |
| ¿Qué devuelve? | Un objeto `CompletedProcess` con el resultado de la orden terminada. | Un objeto `Popen` que representa el proceso lanzado. |
| ¿Para qué nos sirve aquí? | Hacer una tarea después de que acabe otra. | Dejar que el padre avance mientras el hijo sigue trabajando. |

**Prueba para entenderlo:** ejecuta varias veces cada versión y anota el orden de los mensajes. Explica qué orden depende de las instrucciones de un mismo programa y cuál depende de cómo avanzan el padre y el hijo.

## Errores frecuentes

| Qué sucede | Qué revisar |
| --- | --- |
| Python indica que no puede abrir `tarea.py`. | Guarda el archivo y comprueba que la terminal está en la carpeta que lo contiene. |
| Bloc de notas no abre el texto esperado. | Comprueba el nombre, la extensión `.txt` y la carpeta de trabajo. |
| Aparece `NameError` al utilizar `subprocess` o `sys`. | Incluye el `import` correspondiente al principio del archivo. |
| No se reconoce `subprocess.popen`. | Utiliza `subprocess.Popen`, con `P` mayúscula. |
| `dir` falla al intentar lanzarlo como un ejecutable. | Utiliza CMD para interpretar esa orden interna. |
| El comando se ejecuta, pero no aparece su salida. | Si la has capturado, muéstrala con `print(resultado.stdout)`. |
| Los caracteres capturados se ven mal. | Comprueba la codificación de salida del comando utilizado. |
| Se ejecutan ejemplos anteriores además del actual. | Deja activa una sola versión; elimina o comenta las llamadas anteriores. |


## Documentación de consulta

- [Python: módulo `subprocess`](https://docs.python.org/3/library/subprocess.html).
- [Python: `sys.executable`](https://docs.python.org/3/library/sys.html#sys.executable).
- [Python: `time.sleep`](https://docs.python.org/3/library/time.html#time.sleep).
- [Microsoft: intérprete CMD y sus opciones](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/cmd).
