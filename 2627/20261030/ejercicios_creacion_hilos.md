# Ejercicios de creación de hilos

**Programación de Servicios y Procesos — 2.º DAM**

Resuelve los siguientes ejercicios utilizando hilos en Python. Las tablas de ayuda recuerdan operaciones que puedes necesitar, pero no representan una solución completa.

## Recordatorio común

Utiliza `import threading`. Añade `import time` o `import random` cuando el ejercicio lo necesite.

| Operación | Utilidad |
|---|---|
| `threading.Thread(target=tarea, args=(dato,))` | Crea un hilo para ejecutar `tarea(dato)`. Si hay un solo argumento, recuerda la coma. |
| `hilo.start()` | Inicia el hilo. |
| `hilo.join()` | Espera a que termine. No devuelve el resultado de su función. |

Para recoger resultados, puedes utilizar listas compartidas: cada hilo escribe en su propia lista o en una posición asignada. Consulta los resultados después de esperar la finalización de los hilos.

## 1. Recuento de votos

Dispones de una lista con votos a "Equipo A", "Equipo B" y "Equipo C". Divide la lista en dos partes y encarga cada parte a un hilo. Cada hilo debe guardar su recuento por separado. Cuando ambos terminen, combina los resultados y muestra el ganador o indica si hay empate.

**Ayuda de Python**

| Operación | Utilidad o ejemplo |
|---|---|
| `len(votos) // 2` | Calcula la posición central de la lista. |
| `votos[:mitad]` y `votos[mitad:]` | Obtienen la primera y la segunda mitad. |
| `parte.count("Equipo A")` | Cuenta los votos de ese equipo en una parte. |
| `max([4, 7, 7])` | Obtiene el mayor recuento: `7`. |

**Recuerda:** puede haber varios equipos empatados con el máximo número de votos.

## 2. Buscador de palabras

Crea una lista con diez frases. El usuario introducirá una palabra y dos hilos buscarán sus apariciones: uno revisará la primera mitad de las frases y otro la segunda. Al finalizar, muestra qué frases contienen la palabra y cuántas coincidencias hay en total.

Utiliza frases **sin signos de puntuación** y busca **palabras completas, sin distinguir mayúsculas y minúsculas**.

**Ayuda de Python**

| Operación | Utilidad o ejemplo |
|---|---|
| `" sol ".strip()` | Quita espacios de los extremos: `"sol"`. |
| `"Hola".lower()` | Pasa a minúsculas: `"hola"`. |
| `"hola mundo".split()` | Separa en palabras: `["hola", "mundo"]`. |
| `["sol", "y", "sol"].count("sol")` | Cuenta apariciones en la lista: `2`. |
| `encontradas.append(frase)` | Añade la frase a una lista de resultados. |

**Recuerda:** guarda las transformaciones, por ejemplo, `texto = texto.lower()`. Para buscar palabras completas, aplica `count()` a la lista obtenida con `split()`. Si una palabra aparece dos veces en una misma frase, suma dos coincidencias.

## 3. Comprobación de una contraseña

Pide una contraseña al usuario. Realiza tres comprobaciones mediante tres hilos: tener al menos ocho caracteres, contener algún número y contener alguna mayúscula. Recoge los resultados y muestra "Contraseña aceptada" únicamente si supera las tres comprobaciones. Si falla, indica qué requisitos no cumple.

**Ayuda de Python**

| Operación | Utilidad o ejemplo |
|---|---|
| `len("Hola7")` | Cuenta caracteres: `5`. |
| `"7".isdigit()` | Comprueba si un carácter es un dígito: `True`. |
| `"A".isupper()` | Comprueba si un carácter es una mayúscula: `True`. |
| `a and b and c` | Es `True` únicamente si los tres valores son `True`. |

**Recuerda:** puedes recorrer el texto con `for caracter in clave:`. Cada hilo guarda un resultado `True` o `False`.

## 4. Pedido de una cafetería

Un pedido contiene un bocadillo y un café, que pueden prepararse al mismo tiempo. Simula su preparación con duraciones diferentes. El programa solo podrá mostrar "Pedido listo para recoger" cuando ambas partes estén terminadas. Muestra también cuánto ha tardado el pedido completo.

**Ayuda de Python**

| Operación | Utilidad o ejemplo |
|---|---|
| `time.sleep(2)` | Simula una tarea de aproximadamente dos segundos. |
| `inicio = time.perf_counter()` | Guarda una referencia temporal. |
| `duracion = time.perf_counter() - inicio` | Calcula los segundos transcurridos. |

**Recuerda:** mide desde antes de iniciar los dos hilos hasta que ambos hayan terminado.

## 5. Procesamiento por tandas

Tienes doce números y debes calcular el cuadrado de cada uno mediante hilos. Organiza el trabajo para que haya **como máximo tres hilos de cálculo activos a la vez**. Cada cálculo tardará un segundo. Al terminar, muestra los resultados en el mismo orden que los números originales.

**Ayuda de Python**

| Operación | Utilidad o ejemplo |
|---|---|
| `4 ** 2` | Calcula el cuadrado: `16`. |
| `range(0, 12, 3)` | Genera `0, 3, 6, 9`, índices de inicio de las tandas. |
| `resultados = [None] * 12` | Reserva doce posiciones para los resultados. |
| `resultados[i] = valor` | Guarda un resultado en su posición original. |

**Recuerda:** inicia los tres hilos de cada tanda y espera a que terminen antes de iniciar la siguiente. Utiliza `time.sleep(1)` para simular cada cálculo.

## 6. Ascensores de un edificio

Crea una clase que herede de `Thread` y represente un ascensor. Cada ascensor recibirá su planta inicial y una planta de destino. Debe avanzar una planta por segundo e indicar su posición. Pon dos ascensores en marcha, uno subiendo y otro bajando, y anuncia cuándo ambos han llegado.

**Ayuda de Python**

| Elemento | Utilidad |
|---|---|
| `class Ascensor(threading.Thread):` | Crea una clase que hereda de `Thread`. |
| `super().__init__()` | Inicializa la parte correspondiente a `Thread` en el constructor. |
| `self.planta = inicial` | Guarda la planta como atributo del ascensor. |
| `def run(self):` | Define lo que hará el hilo al ejecutar `start()`. |
| `self.planta += 1` / `self.planta -= 1` | Sube o baja una planta. |

**Recuerda:** utiliza `time.sleep(1)` entre movimientos y espera a los dos ascensores antes del mensaje final.

## 7. Supervisión de un trabajo

Un hilo debe procesar cinco elementos, tardando un tiempo aleatorio en cada uno. Mientras trabaja, el programa principal comprobará periódicamente si sigue activo y mostrará "Trabajo en curso". Cuando termine, mostrará "Proceso completado". La supervisión debe depender del estado real del hilo, no de un tiempo total calculado previamente.

**Ayuda de Python**

| Operación | Utilidad o ejemplo |
|---|---|
| `hilo.is_alive()` | Devuelve `True` mientras el hilo sigue activo. |
| `random.randint(1, 3)` | Devuelve un entero aleatorio entre 1 y 3 (ambos incluidos). |
| `time.sleep(0.5)` | Espera medio segundo entre comprobaciones. |

**Recuerda:** inicia el hilo antes de consultar su estado.

## 8. Presupuestos independientes

Dos hilos calcularán presupuestos para clientes con distintos porcentajes de descuento. Utiliza `threading.local()` para guardar el descuento de cada hilo. Una función auxiliar deberá consultar ese descuento para calcular el precio final, sin recibirlo como argumento. Comprueba que cada cliente obtiene el importe que le corresponde.

**Ayuda de Python**

| Operación | Utilidad o ejemplo |
|---|---|
| `datos = threading.local()` | Crea un objeto cuyos atributos tienen valores independientes en cada hilo. |
| `datos.descuento = 10` | Guarda el descuento del hilo actual. |
| `datos.descuento` | Consulta el descuento del hilo actual. |
| `100 * (1 - 10 / 100)` | Aplica un descuento del 10 %: `90`. |

**Recuerda:** crea `datos` una sola vez, fuera de las funciones. Cada hilo debe asignar su descuento antes de llamar a la función auxiliar.

## 9. La última entrada disponible

Queda una sola entrada para un concierto. Dos hilos representan a dos compradores. Cada comprador consulta la disponibilidad, espera un segundo y después intenta confirmar la compra utilizando la información que consultó. Observa si ambos pueden recibir una confirmación. Explica el problema y por qué esperar con `join()` al final no evita que ocurra.

**Ayuda de Python**

| Operación | Utilidad |
|---|---|
| `estado = {"entradas": 1}` | Crea un diccionario con la disponibilidad compartida. |
| `consultadas = estado["entradas"]` | Guarda la cantidad consultada en ese momento. |
| `estado["entradas"] = 0` | Actualiza la cantidad de entradas disponibles. |
| `time.sleep(1)` | Introduce una espera entre consultar y confirmar. |

**Recuerda:** ambos compradores deben utilizar el mismo diccionario `estado`. El objetivo es observar el posible error, no corregirlo todavía.

## 10. Autoguardado de un borrador

El programa principal permitirá escribir y sustituir un borrador de texto. Un hilo daemon simulará un autoguardado cada tres segundos mostrando el contenido actual. Cuando el usuario escriba "salir", el programa terminará. Comprueba qué ocurre si se sale antes del siguiente autoguardado.

**Ayuda de Python**

| Operación | Utilidad |
|---|---|
| `texto = input("Borrador: ")` | Lee el texto introducido por el usuario. |
| `estado = {"borrador": ""}` | Crea un diccionario para compartir el texto. |
| `estado["borrador"] = texto` | Actualiza el borrador. |
| `threading.Thread(target=autoguardar, daemon=True)` | Crea un hilo daemon, que no impide por sí solo que termine el programa. |
| `time.sleep(3)` | Espera tres segundos entre autoguardados. |

**Recuerda:** consulta `estado["borrador"]` en cada autoguardado para ver el texto actual. Comprueba `"salir"` antes de reemplazarlo.