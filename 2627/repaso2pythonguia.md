# Guion docente : condicionales paso a paso

## Acceso rápido

[Guion docente paso a paso](#guion-paso-a-paso) · [Todo el código original del PDF](#codigo-completo-del-pdf) · [Índice de las 23 versiones](#indice-codigo-pdf)

El anexo final reúne las 23 versiones completas de `src1.pdf` en el orden del PDF, con sus comentarios originales. El guion docente se conserva a continuación.

<a id="guion-paso-a-paso"></a>

## Cómo está organizado este guion

Material de partida: `src1.pdf` (23 páginas) y `transcript 2 malan.txt`, aportados en esta conversación. Se conserva el código del PDF y se recuperan los estados intermedios que describe la transcripción. Los comentarios en castellano, las preguntas para tu alumnado y los títulos de pantalla son formulaciones de esta guía, no citas literales de Malan. No son una transcripción nueva del vídeo ni corresponden a una numeración de diapositivas que no se haya aportado.

Cada estado contiene el objetivo **antes del código**, lo que quieres que comprenda el alumnado, el cambio exacto, una intervención docente, **el programa completo en ese punto**, entradas con sus salidas y la transición al siguiente paso. Las pruebas adicionales y las inferencias sobre el código se identifican cuando procede. Los programas mantienen sus mensajes originales en inglés para localizarlos en el PDF.

### Dos diferencias que conviene tener presentes

El vídeo sigue `compare.py → grade.py → parity.py → house.py`. El PDF añade entre `grade` y `parity` cinco versiones de `agree.py`, páginas 11–15. No hay explicación de ese ejercicio en la transcripción aportada: el bloque A se identifica como reconstrucción docente a partir del código, no como una descripción de cómo Malan lo presenta en el vídeo.

En la comparación final, el vídeo muestra primero `!=` y luego `==`; el PDF los numera como `compare5.py` y `compare4.py`, respectivamente. Esta guía conserva el orden del vídeo, aunque la numeración de esas páginas no sea ascendente.

### El hilo de la demostración

La pauta que se aprecia en la transcripción es: **plantear una decisión sencilla → escribir una primera versión → ejecutarla o recorrerla → preguntar qué se repite o qué sabemos ya → cambiar lo necesario → volver a comprobar**. La cuestión no es presentar de una vez todos los operadores, sino hacer que cada versión tenga un motivo. Se distingue entre que un programa sea correcto y que pueda estar mejor diseñado. Esto se ve de forma explícita en `compare`, `grade` y `parity`.

Para el directo, trabaja en un único archivo por ejercicio. Los nombres numerados del PDF representan versiones que te sirven de referencia; no necesitas presentar cada una como un ejercicio distinto.

## Mapa de navegación

| Bloque | Problema | Progresión | Referencia del PDF |
|---|---|---|---|
| C | Comparar dos enteros | `if` independientes → `elif` → `else` → `or` → `!=` / `==` | Páginas 1–6 |
| G | Asignar una calificación | `and` → giro de comparaciones → encadenamiento → umbrales → error con `if` | Páginas 7–10 |
| A | Interpretar una respuesta | igualdad exacta → `strip` → `lower` → `or` → `startswith` | Páginas 11–15; solo PDF |
| P | Determinar si un entero es par | `%` → condición → función imaginada → `bool` → expresión condicional → devolución directa | Páginas 16–19 |
| H | Asociar nombres a casas | `if/elif/else` → `or` → `match` sin caso general → `_` → `|` | Páginas 20–23 |

No todos los estados son nuevas explicaciones largas. Algunos sirven únicamente para mostrar un cambio de una línea o provocar una predicción. Las versiones C04 y P03 son deliberadamente incorrecta e incompleta, respectivamente; G06 se ejecuta, pero produce varias calificaciones y no cumple el encargo.


# 1. compare.py — Tomar decisiones y evitar preguntas innecesarias

## C01 · Comparar dos números — Primero necesitamos los datos

**Origen:** Vídeo: creación de compare.py y lectura de x e y. Paso previo a PDF src1.pdf, página 1, compare0.py.

**Objetivo del paso:** Partir de lo que ya conocen: input, int y variables.

**Qué quiero que comprenda el alumnado:** La novedad de hoy no es pedir números, sino decidir qué hacer con ellos.

**Qué escribo o modifico:** Crea compare.py y escribe solo las dos lecturas. No añadas todavía ningún if.

**Qué puedo decir antes de escribir:** «Vamos a pedir dos números. No sabemos cuáles escribirá el usuario. ¿Cómo podría el programa decidir cuál es mayor?»

```python
x = int(input("What's x? "))
y = int(input("What's y? "))
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'1'`; `'2'` | No imprime ningún resultado |

**Atención docente:** Es un estado de construcción real del vídeo. La ejecución aislada de este estado es una propuesta de esta guía: todavía no muestra ningún resultado.

**Frase o pregunta de transición:** Ya tenemos los datos; ahora necesitamos formular una pregunta.

---

## C02 · Comparar dos números — Una pregunta que decide si imprimimos

**Origen:** Vídeo: primera condición y explicación de expresión booleana, dos puntos e indentación. Paso previo a PDF src1.pdf, página 1, compare0.py.

**Objetivo del paso:** Introducir if a partir de una decisión concreta.

**Qué quiero que comprenda el alumnado:** x < y produce una respuesta verdadera o falsa; el bloque indentado depende de esa respuesta.

**Qué escribo o modifico:** Añade únicamente if x < y: y su print indentado.

**Qué puedo decir antes de escribir:** «Si escribo 1 y 2, ¿se imprimirá el mensaje? ¿Y si escribo 2 y 1? Señalad qué línea decide si se ejecuta el print.»

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y:
    print("x is less than y")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'1'`; `'2'` | `x is less than y` |
| `'2'`; `'1'` | No imprime ningún resultado |

**Atención docente:** Las pruebas separadas de este primer estado son una propuesta de aula. Recuérdales: = asigna; == compara. No hacen falta paréntesis alrededor de esta condición, pero sí los dos puntos y la indentación.

**Frase o pregunta de transición:** Nuestra pregunta solo informa de uno de los tres casos. ¿Cuáles faltan?

---

## C03 · Comparar dos números — Añadir el segundo caso

**Origen:** Vídeo: añade la comparación x > y antes de completar la igualdad. Paso previo a PDF src1.pdf, página 1, compare0.py.

**Objetivo del paso:** Construir el programa por adición de una única decisión.

**Qué quiero que comprenda el alumnado:** Un segundo if constituye otra pregunta independiente.

**Qué escribo o modifico:** Conserva lo anterior y añade if x > y: con su print.

**Qué puedo decir antes de escribir:** «Ya podemos informar cuando el primero es menor o mayor. Si los dos son 1, ¿qué veremos?»

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y:
    print("x is less than y")
if x > y:
    print("x is greater than y")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'2'`; `'1'` | `x is greater than y` |
| `'1'`; `'1'` | No imprime ningún resultado |

**Atención docente:** El desglose y la prueba del empate antes de escribir el tercer caso son ayudas de esta guía.

**Frase o pregunta de transición:** Falta el caso en que los dos números son iguales.

---

## C04 · Comparar dos números — Detenerse ante = y ==

**Origen:** Vídeo: al formular la igualdad, Malan se detiene ante un solo signo igual y lo corrige. No es una versión independiente del PDF.

**Objetivo del paso:** Recuperar la diferencia entre asignar y comparar en el momento en que importa.

**Qué quiero que comprenda el alumnado:** Para preguntar si dos valores son iguales se escribe ==, no =.

**Qué escribo o modifico:** Muestra el tercer encabezado con un solo = únicamente para detectarlo y corregirlo antes de continuar.

**Qué puedo decir antes de escribir:** «Mirad esta línea: if x = y. ¿Estoy escribiendo correctamente una comparación?»

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y:
    print("x is less than y")
if x > y:
    print("x is greater than y")
if x = y:
    print("x is equal to y")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| No llega a solicitar entrada | `SyntaxError` — estado deliberadamente no ejecutable hasta corregirlo |

**Atención docente:** ESTADO INTENCIONADAMENTE INCORRECTO. No lo entregues como solución. La transcripción recoge la corrección en directo, no una ejecución deliberada del error.

**Frase o pregunta de transición:** Corrige = por == y ejecuta la versión completa.

---

## C05 · Comparar dos números — Funciona, pero pregunta tres veces

**Origen:** Vídeo y PDF src1.pdf, página 1, compare0.py.

**Objetivo del paso:** Separar el resultado correcto de la calidad del diseño.

**Qué quiero que comprenda el alumnado:** Con tres if independientes se evalúan las tres condiciones, aunque solo una sea verdadera en esta comparación de enteros.

**Qué escribo o modifico:** Corrige la igualdad y deja los tres if independientes.

**Qué puedo decir antes de escribir:** «Con 1 y 2 solo vemos un mensaje. ¿Eso significa que solo se ha hecho una pregunta? Sigamos el recorrido línea a línea.»

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y:
    print("x is less than y")
if x > y:
    print("x is greater than y")
if x == y:
    print("x is equal to y")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'1'`; `'2'` | `x is less than y` |
| `'2'`; `'1'` | `x is greater than y` |
| `'1'`; `'1'` | `x is equal to y` |

**Atención docente:** En el vídeo se ejecuta 1 y 2 y después se recorre un diagrama de flujo. Las tres parejas de prueba de la guía cubren los tres casos. No introduzcas aún elif: deja que se detecte la comprobación innecesaria.

**Frase o pregunta de transición:** La salida es correcta. ¿Podemos evitar seguir preguntando cuando ya sabemos qué caso se cumple?

---

## C06 · Comparar dos números — No seguir después de acertar

**Origen:** Vídeo y PDF src1.pdf, página 2, compare1.py.

**Objetivo del paso:** Dar sentido a elif como continuación condicionada al fracaso de las condiciones anteriores.

**Qué quiero que comprenda el alumnado:** La cadena elige una sola rama; una vez elegida, no se evalúan las posteriores de esa cadena.

**Qué escribo o modifico:** Sustituye el segundo y tercer if por elif. No cambies ninguna comparación ni ningún mensaje.

**Qué puedo decir antes de escribir:** «Si la primera condición ya es verdadera, ¿qué sentido tiene preguntar si x es mayor o igual que y?»

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y:
    print("x is less than y")
elif x > y:
    print("x is greater than y")
elif x == y:
    print("x is equal to y")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'1'`; `'2'` | `x is less than y` |
| `'2'`; `'1'` | `x is greater than y` |
| `'1'`; `'1'` | `x is equal to y` |

**Atención docente:** Recorrido: con 1 y 2 se evalúa una condición; con 2 y 1, dos; con 1 y 1, tres. Al salir de la cadena seguiría el código que hubiera después; en este programa ya no hay más instrucciones.

**Frase o pregunta de transición:** En el empate todavía hacemos una tercera pregunta. ¿Necesitamos realmente hacerla?

---

## C07 · Comparar dos números — Deducir el último caso

**Origen:** Vídeo y PDF src1.pdf, página 3, compare2.py.

**Objetivo del paso:** Introducir else como el caso restante, no como una comparación nueva.

**Qué quiero que comprenda el alumnado:** Si dos enteros no cumplen x < y ni x > y, entonces son iguales.

**Qué escribo o modifico:** Sustituye elif x == y: por else:. Mantén su print.

**Qué puedo decir antes de escribir:** «Si no es menor y tampoco es mayor, ¿qué posibilidad queda? ¿Necesitamos preguntarla?»

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y:
    print("x is less than y")
elif x > y:
    print("x is greater than y")
else:
    print("x is equal to y")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'1'`; `'2'` | `x is less than y` |
| `'2'`; `'1'` | `x is greater than y` |
| `'1'`; `'1'` | `x is equal to y` |

**Atención docente:** Para estas entradas se evalúan una, dos y dos condiciones, respectivamente. else no lleva condición. Esta deducción se está haciendo sobre los enteros que pide este ejercicio.

**Frase o pregunta de transición:** Ahora cambiamos el encargo: no necesitamos saber cuál es mayor, solo si son iguales.

---

## C08 · Comparar dos números — Cambia el encargo: iguales o distintos

**Origen:** Vídeo y PDF src1.pdf, página 4, compare3.py.

**Objetivo del paso:** Introducir or con dos situaciones que llevan a la misma salida.

**Qué quiero que comprenda el alumnado:** Para esta condición basta que se cumpla x < y o que se cumpla x > y para concluir que son distintos.

**Qué escribo o modifico:** Sustituye la cadena anterior por un if con or y un else; ahora solo hay dos mensajes posibles.

**Qué puedo decir antes de escribir:** «Ya no me importa cuál es mayor. Si uno es menor o mayor que el otro, ¿qué sé seguro sobre la igualdad?»

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y or x > y:
    print("x is not equal to y")
else:
    print("x is equal to y")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'1'`; `'2'` | `x is not equal to y` |
| `'2'`; `'1'` | `x is not equal to y` |
| `'1'`; `'1'` | `x is equal to y` |

**Atención docente:** No lo presentes como una refactorización con salida idéntica a compare2: aquí cambia el requisito y desaparece la distinción entre menor y mayor.

**Frase o pregunta de transición:** Si únicamente nos importa que sean distintos, ¿podemos preguntar eso directamente?

---

## C09 · Comparar dos números — Preguntar directamente por la desigualdad

**Origen:** Vídeo: esta versión se muestra antes de la de ==. PDF src1.pdf, página 6, compare5.py.

**Objetivo del paso:** Sustituir una formulación indirecta por la pregunta que realmente interesa.

**Qué quiero que comprenda el alumnado:** El operador != expresa directamente la desigualdad.

**Qué escribo o modifico:** Cambia solo x < y or x > y por x != y. Conserva los mensajes y el else.

**Qué puedo decir antes de escribir:** «¿No teníamos un símbolo que significa directamente distinto de?»

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x != y:
    print("x is not equal to y")
else:
    print("x is equal to y")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'1'`; `'2'` | `x is not equal to y` |
| `'2'`; `'1'` | `x is not equal to y` |
| `'1'`; `'1'` | `x is equal to y` |

**Atención docente:** El orden de nombres del PDF no coincide aquí con la demostración: la transcripción pasa por != y luego por ==.

**Frase o pregunta de transición:** También podríamos preguntar por la igualdad. ¿Qué más habría que cambiar?

---

## C10 · Comparar dos números — Invertir la pregunta y las respuestas

**Origen:** Vídeo: inversión final de la condición. PDF src1.pdf, página 5, compare4.py.

**Objetivo del paso:** Mostrar que dos formulaciones pueden ser igual de válidas.

**Qué quiero que comprenda el alumnado:** Si se invierte la condición, hay que intercambiar los mensajes de las ramas.

**Qué escribo o modifico:** Sustituye != por == y coloca el mensaje de igualdad dentro del if; el de desigualdad pasa al else.

**Qué puedo decir antes de escribir:** «Si ahora pregunto si son iguales y dejo los mensajes donde estaban, ¿seguiría siendo correcto?»

```python
x = int(input("What's x? "))
y = int(input("What's y? "))

if x == y:
    print("x is equal to y")
else:
    print("x is not equal to y")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'1'`; `'2'` | `x is not equal to y` |
| `'2'`; `'1'` | `x is not equal to y` |
| `'1'`; `'1'` | `x is equal to y` |

**Frase o pregunta de transición:** Pasamos de comparar dos números a clasificar una puntuación dentro de intervalos.

---


# 2. grade.py — Clasificar por intervalos y aprovechar el orden

## G01 · Calificaciones — Definir un intervalo con and

**Origen:** Vídeo: inicio de grade.py y primera condición. Paso previo a PDF src1.pdf, página 7, grade0.py.

**Objetivo del paso:** Introducir and porque la puntuación debe satisfacer dos límites a la vez.

**Qué quiero que comprenda el alumnado:** Una A requiere, en el modelo del ejercicio, una puntuación de 90 a 100.

**Qué escribo o modifico:** Crea grade.py, pide score y añade solo la primera condición con sus dos límites.

**Qué puedo decir antes de escribir:** «Para estar entre 90 y 100, ¿basta cumplir uno de los límites o necesitamos cumplir los dos?»

```python
score = int(input("Score: "))

if score >= 90 and score <= 100:
    print("Grade: A")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'95'` | `Grade: A` |
| `'89'` | No imprime ningún resultado |

**Atención docente:** El ejercicio trabaja con puntuaciones enteras y presupone entradas entre 0 y 100; no incorpora validación. Mantén las letras A, B, C, D y F del material. Las pruebas aisladas de esta primera condición son propuestas de aula.

**Frase o pregunta de transición:** Tenemos A. ¿Cómo escribiríamos el siguiente intervalo sin incluir otra vez el 90?

---

## G02 · Calificaciones — Completar los intervalos sin solapamientos

**Origen:** Vídeo y PDF src1.pdf, página 7, grade0.py.

**Objetivo del paso:** Construir una clasificación completa y atender a los límites.

**Qué quiero que comprenda el alumnado:** B: 80 <= score < 90; C: 70 <= score < 80; D: 60 <= score < 70; el resto del dominio previsto recibe F.

**Qué escribo o modifico:** Añade sucesivamente el elif de B, el de C, el de D y el else de F. No los pegues todos de golpe: lee cada intervalo al escribirlo.

**Qué puedo decir antes de escribir:** «Para la B podríamos escribir hasta 89. ¿Qué otra comparación expresa que todavía no hemos llegado a 90?»

```python
score = int(input("Score: "))

if score >= 90 and score <= 100:
    print("Grade: A")
elif score >= 80 and score < 90:
    print("Grade: B")
elif score >= 70 and score < 80:
    print("Grade: C")
elif score >= 60 and score < 70:
    print("Grade: D")
else:
    print("Grade: F")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'100'` | `Grade: A` |
| `'95'` | `Grade: A` |
| `'89'` | `Grade: B` |
| `'71'` | `Grade: C` |
| `'0'` | `Grade: F` |

**Atención docente:** Malan plantea <= 89 y después escribe < 90. Para las puntuaciones enteras del ejercicio delimitan el mismo extremo. Como comprobación propia de aula, contrasta también 89 con 90. No confundas este programa con un validador de entradas.

**Frase o pregunta de transición:** Funciona. Vamos a expresar los mismos límites de una forma que se parezca más a un intervalo escrito en papel.

---

## G03 · Calificaciones — Girar las comparaciones antes de encadenarlas

**Origen:** Vídeo y PDF src1.pdf, página 8, grade1.py.

**Objetivo del paso:** Hacer visible el paso intermedio que prepara la comparación encadenada.

**Qué quiero que comprenda el alumnado:** score >= 90 expresa la misma relación que 90 <= score.

**Qué escribo o modifico:** Gira únicamente las comparaciones inferiores: score >= 90 pasa a 90 <= score; haz lo mismo con 80, 70 y 60. Conserva and y los límites superiores.

**Qué puedo decir antes de escribir:** «¿He cambiado lo que significa o solo cómo lo estoy escribiendo? Leed 90 <= score en voz alta.»

```python
score = int(input("Score: "))

if 90 <= score and score <= 100:
    print("Grade: A")
elif 80 <= score and score < 90:
    print("Grade: B")
elif 70 <= score and score < 80:
    print("Grade: C")
elif 60 <= score and score < 70:
    print("Grade: D")
else:
    print("Grade: F")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'100'` | `Grade: A` |
| `'95'` | `Grade: A` |
| `'89'` | `Grade: B` |
| `'71'` | `Grade: C` |
| `'0'` | `Grade: F` |

**Atención docente:** Este cambio no reduce el número de comparaciones: prepara visualmente el siguiente.

**Frase o pregunta de transición:** La variable aparece dos veces en cada intervalo. Python nos permite escribir los dos límites seguidos.

---

## G04 · Calificaciones — Encadenar las comparaciones

**Origen:** Vídeo y PDF src1.pdf, página 9, grade2.py.

**Objetivo del paso:** Presentar la sintaxis de comparación encadenada sin saltar el paso previo.

**Qué quiero que comprenda el alumnado:** 90 <= score <= 100 expresa los dos límites del intervalo en una sola cadena.

**Qué escribo o modifico:** Sustituye 90 <= score and score <= 100 por 90 <= score <= 100; repite la operación en los demás intervalos.

**Qué puedo decir antes de escribir:** «¿Cómo leeríais esta línea? ¿Qué dos límites sigue comprobando?»

```python
score = int(input("Score: "))

if 90 <= score <= 100:
    print("Grade: A")
elif 80 <= score < 90:
    print("Grade: B")
elif 70 <= score < 80:
    print("Grade: C")
elif 60 <= score < 70:
    print("Grade: D")
else:
    print("Grade: F")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'100'` | `Grade: A` |
| `'95'` | `Grade: A` |
| `'89'` | `Grade: B` |
| `'71'` | `Grade: C` |
| `'0'` | `Grade: F` |

**Atención docente:** Malan distingue este cambio, principalmente de escritura y legibilidad, del siguiente cambio de lógica. No afirmes que encadenar ha eliminado uno de los límites.

**Frase o pregunta de transición:** Hemos reducido la escritura. ¿Podríamos ahora reducir las comprobaciones que necesitamos?

---

## G05 · Calificaciones — Aprovechar lo que ya sabemos por elif

**Origen:** Vídeo y PDF src1.pdf, página 10, grade3.py.

**Objetivo del paso:** Mostrar que el contexto de una rama aporta información.

**Qué quiero que comprenda el alumnado:** Al llegar a elif score >= 80 ya sabemos que score >= 90 ha sido falso; el límite superior está implícito.

**Qué escribo o modifico:** Elimina los límites superiores y conserva la cadena descendente >= 90, >= 80, >= 70, >= 60 y else.

**Qué puedo decir antes de escribir:** «Con una puntuación de 89, la primera condición falla. Al llegar a la siguiente, ¿qué sabemos ya sin volver a preguntarlo?»

```python
score = int(input("Score: "))

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
elif score >= 60:
    print("Grade: D")
else:
    print("Grade: F")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'100'` | `Grade: A` |
| `'95'` | `Grade: A` |
| `'89'` | `Grade: B` |
| `'71'` | `Grade: C` |
| `'0'` | `Grade: F` |

**Atención docente:** Malan explicita que, de momento, se supone una entrada entre 0 y 100. No borres esa condición del razonamiento: fuera de ese dominio las versiones no conservan necesariamente el mismo comportamiento. El orden descendente es parte de la solución.

**Frase o pregunta de transición:** ¿Y si sustituyéramos esos elif por if independientes?

---

## G06 · Calificaciones — Provocar el error de los if independientes

**Origen:** Vídeo: responde a una pregunta del alumnado, retira F y cambia los elif por if. No hay una página independiente para este estado.

**Objetivo del paso:** Hacer visible la diferencia entre una cadena de alternativas y varias decisiones independientes.

**Qué quiero que comprenda el alumnado:** 95 satisface todos los umbrales inferiores; al usar if separados se ejecutan las cuatro impresiones.

**Qué escribo o modifico:** Quita temporalmente el else de F. Sustituye todos los elif restantes por if. Pide una predicción antes de ejecutar 95.

**Qué puedo decir antes de escribir:** «¿Con 95 saldrá solo A o aparecerán más calificaciones? Justificadlo recorriendo las condiciones.»

```python
score = int(input("Score: "))

if score >= 90:
    print("Grade: A")
if score >= 80:
    print("Grade: B")
if score >= 70:
    print("Grade: C")
if score >= 60:
    print("Grade: D")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'95'` | `Grade: A`<br>`Grade: B`<br>`Grade: C`<br>`Grade: D` |

**Atención docente:** ERROR LÓGICO INTENCIONADO: Python puede ejecutarlo, pero no cumple el encargo de asignar una única nota. No añadas F a la salida de esta demostración: se ha retirado su bloque.

**Frase o pregunta de transición:** Restauramos la cadena de elif para que se elija una sola calificación.

---

## G07 · Calificaciones — Restaurar la solución y cerrar la idea

**Origen:** Restauración propuesta por esta guía para no dejar en pantalla el error; recupera PDF src1.pdf, página 10, grade3.py.

**Objetivo del paso:** Cerrar la demostración con una versión correcta y una explicación del motivo.

**Qué quiero que comprenda el alumnado:** La simplificación de los intervalos depende de conservar elif y el orden de los umbrales.

**Qué escribo o modifico:** Vuelve a escribir elif en las tres ramas posteriores y recupera else con F.

**Qué puedo decir antes de escribir:** «¿Por qué en compare.py los tres if solo imprimían una frase y aquí imprimían cuatro? No basta con decir que hay if: hay que mirar qué condiciones pueden cumplirse a la vez.»

```python
score = int(input("Score: "))

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
elif score >= 60:
    print("Grade: D")
else:
    print("Grade: F")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'100'` | `Grade: A` |
| `'95'` | `Grade: A` |
| `'89'` | `Grade: B` |
| `'71'` | `Grade: C` |
| `'0'` | `Grade: F` |

**Atención docente:** Respuesta esperada: menor, mayor e igual eran relaciones incompatibles para esos enteros; >= 90, >= 80, >= 70 y >= 60 se solapan.

**Frase o pregunta de transición:** En la transcripción se pasa a parity.py. El PDF intercala agree.py: el siguiente bloque es una reconstrucción separada.

---


# 3. agree.py — Bloque adicional del PDF, reconstrucción docente

## A01 · Aceptar una respuesta — Empezar con una comparación exacta

**Origen:** RECONSTRUCCIÓN DOCENTE: este ejercicio está en el PDF, no en la transcripción aportada. PDF src1.pdf, página 11, agree0.py.

**Objetivo del paso:** Aplicar una condición al texto introducido por el usuario.

**Qué quiero que comprenda el alumnado:** Esta primera versión solo considera acuerdo la cadena exacta yes.

**Qué escribo o modifico:** Crea agree.py, pide answer y compara con "yes".

**Qué puedo decir antes de escribir:** «Si el usuario escribe yes funciona. ¿Qué responderá con YES o con espacios alrededor?»

```python
answer = input("Do you agree? ")
if answer == "yes":
    print("Agreed")
else:
    print("Not agreed")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'yes'` | `Agreed` |
| `'YES'` | `Not agreed` |
| `' yes '` | `Not agreed` |

**Atención docente:** Las preguntas, las pruebas y la forma de presentar este bloque son propuestas de la guía, deducidas de la sucesión de versiones. No se atribuyen al vídeo.

**Frase o pregunta de transición:** La intención del usuario puede ser la misma, pero la cadena no coincide. Primero vamos a atender a los espacios.

---

## A02 · Aceptar una respuesta — Quitar espacios exteriores

**Origen:** RECONSTRUCCIÓN DOCENTE a partir de PDF src1.pdf, página 12, agree1.py.

**Objetivo del paso:** Normalizar un aspecto de la entrada sin cambiar la condición.

**Qué quiero que comprenda el alumnado:** strip elimina espacios en los extremos; la comparación sigue siendo con yes.

**Qué escribo o modifico:** Añade .strip() al resultado de input. No cambies el if ni los mensajes.

**Qué puedo decir antes de escribir:** «¿Hace falta escribir una condición para cada cantidad de espacios, o podemos limpiar la respuesta antes?»

```python
answer = input("Do you agree? ").strip()
if answer == "yes":
    print("Agreed")
else:
    print("Not agreed")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `' yes '` | `Agreed` |
| `'YES'` | `Not agreed` |

**Frase o pregunta de transición:** Hemos resuelto los espacios, pero no las diferencias entre mayúsculas y minúsculas.

---

## A03 · Aceptar una respuesta — Normalizar las mayúsculas

**Origen:** RECONSTRUCCIÓN DOCENTE a partir de PDF src1.pdf, página 13, agree2.py.

**Objetivo del paso:** Preparar la entrada para compararla de una forma consistente.

**Qué quiero que comprenda el alumnado:** La cadena se limpia con strip y después se convierte a minúsculas con lower.

**Qué escribo o modifico:** Añade .lower() después de .strip(). Conserva la comparación con yes.

**Qué puedo decir antes de escribir:** «¿Qué queda de la entrada YES, con espacios alrededor, después de aplicar estos dos métodos?»

```python
answer = input("Do you agree? ").strip().lower()
if answer == "yes":
    print("Agreed")
else:
    print("Not agreed")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `' YES '` | `Agreed` |
| `'y'` | `Not agreed` |

**Frase o pregunta de transición:** El usuario también puede querer contestar con la abreviatura y. ¿Cómo aceptaríamos las dos formas?

---

## A04 · Aceptar una respuesta — Admitir dos respuestas concretas

**Origen:** RECONSTRUCCIÓN DOCENTE a partir de PDF src1.pdf, página 14, agree3.py.

**Objetivo del paso:** Reutilizar or para aceptar dos alternativas de texto.

**Qué quiero que comprenda el alumnado:** Después de normalizar, se aceptan exactamente yes o y.

**Qué escribo o modifico:** Sustituye la condición por answer == "yes" or answer == "y". Mantén la lectura normalizada.

**Qué puedo decir antes de escribir:** «¿Cuál es la comparación completa que debemos escribir a cada lado de or?»

```python
answer = input("Do you agree? ").strip().lower()
if answer == "yes" or answer == "y":
    print("Agreed")
else:
    print("Not agreed")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'yes'` | `Agreed` |
| `'Y'` | `Agreed` |
| `'yellow'` | `Not agreed` |

**Frase o pregunta de transición:** El PDF termina con otra regla: comprobar el principio de la respuesta. Veamos qué cambia realmente.

---

## A05 · Aceptar una respuesta — Comprobar el comienzo no es lo mismo

**Origen:** RECONSTRUCCIÓN DOCENTE a partir de PDF src1.pdf, página 15, agree4.py.

**Objetivo del paso:** Interpretar startswith y comprobar el alcance real del cambio.

**Qué quiero que comprenda el alumnado:** Aceptar cualquier cadena que comience por y es una regla más amplia que aceptar solo yes o y.

**Qué escribo o modifico:** Sustituye la condición compuesta por answer.startswith("y"). No cambies el resto.

**Qué puedo decir antes de escribir:** «¿Esta versión admite exactamente las mismas entradas? Probad yellow. ¿Qué acaba de pasar?»

```python
answer = input("Do you agree? ").strip().lower()
if answer.startswith("y"):
    print("Agreed")
else:
    print("Not agreed")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'yes'` | `Agreed` |
| `'y'` | `Agreed` |
| `'yellow'` | `Agreed` |
| `'no'` | `Not agreed` |

**Atención docente:** Advertencia de la guía basada en comparar y ejecutar el código: no presentes esta versión como una simplificación equivalente. Acepta más entradas. El PDF no explica la intención didáctica de esa ampliación, y la transcripción no contiene el ejercicio. Asimismo, el else reúne todas las respuestas no aceptadas; no valida que el usuario haya escrito explícitamente no.

**Frase o pregunta de transición:** Volvemos al recorrido del vídeo: una condición matemática que después convertiremos en una función.

---


# 4. parity.py — De una condición a una función que responde

## P01 · Par o impar — Formular qué significa ser par

**Origen:** Vídeo: inicio de parity.py, explicación de % y pregunta sobre la divisibilidad por dos. Paso previo a PDF src1.pdf, página 16, parity0.py.

**Objetivo del paso:** Conectar el operador con una pregunta comprensible antes de escribir la condición.

**Qué quiero que comprenda el alumnado:** Un entero es par cuando al dividirlo por dos no queda resto; % obtiene ese resto en este ejercicio.

**Qué escribo o modifico:** Crea parity.py y pide únicamente el entero x. Antes del if, pregunta qué propiedad comparten 0, 2, 4, 6 y 8.

**Qué puedo decir antes de escribir:** «No me deis solo ejemplos de números pares: ¿qué condición cumplen todos?»

```python
x = int(input("What's x? "))
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'2'` | No imprime ningún resultado |

**Atención docente:** Malan explica primero restos al dividir entre tres y después pregunta qué significa ser par. Como apoyo propio de aula puedes contrastar 4 % 2 = 0 y 3 % 2 = 1. El símbolo % no significa porcentaje en este código.

**Frase o pregunta de transición:** Ahora que hemos definido la propiedad, podemos traducirla a x % 2 == 0.

---

## P02 · Par o impar — Comprobar el resto

**Origen:** Vídeo y PDF src1.pdf, página 16, parity0.py.

**Objetivo del paso:** Construir una primera solución directa.

**Qué quiero que comprenda el alumnado:** Si el resto entre dos es cero, se imprime Even; para el resto de enteros se imprime Odd.

**Qué escribo o modifico:** Añade if x % 2 == 0:, print("Even"), else y print("Odd").

**Qué puedo decir antes de escribir:** «¿Qué respuesta produce esta condición con 4? ¿Y con 3? ¿Por qué no necesitamos otra condición para el impar?»

```python
x = int(input("What's x? "))

if x % 2 == 0:
    print("Even")
else:
    print("Odd")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'2'` | `Even` |
| `'4'` | `Even` |
| `'3'` | `Odd` |

**Frase o pregunta de transición:** Funciona. ¿Cómo podríamos reutilizar la pregunta de si un número es par en otro lugar del programa?

---

## P03 · Par o impar — Usar la función que nos gustaría tener

**Origen:** Vídeo: Malan escribe main y utiliza is_even antes de haberla definido. Paso intermedio no conservado como página independiente.

**Objetivo del paso:** Mostrar una forma de descomponer el problema: decidir primero cómo se usará la función.

**Qué quiero que comprenda el alumnado:** main necesita una función que responda verdadero o falso; todavía falta construirla.

**Qué escribo o modifico:** Encapsula la lectura y la decisión en main, sustituye la condición por is_even(x) y deja la llamada a main al final. Todavía no definas is_even.

**Qué puedo decir antes de escribir:** «Voy a imaginar que existe una función que contesta si un número es par. ¿Qué tendría que devolver para poder usarla después de if?»

```python
def main():
    x = int(input("What's x? "))
    if is_even(x):
        print("Even")
    else:
        print("Odd")


main()
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'2'` | `NameError` al intentar llamar a `is_even`, que todavía no está definida |

**Atención docente:** ESTADO INCOMPLETO INTENCIONADO. La transcripción advierte que fallaría si se ejecutara así. No digas que is_even es una función incorporada de Python ni afirmes que Malan ejecuta el fallo en este punto.

**Frase o pregunta de transición:** No existe todavía. Vamos a definir is_even debajo de main y antes de ejecutar main().

---

## P04 · Par o impar — Devolver una respuesta booleana

**Origen:** Vídeo y PDF src1.pdf, página 17, parity1.py.

**Objetivo del paso:** Construir la función que faltaba y separar calcular una respuesta de mostrar un mensaje.

**Qué quiero que comprenda el alumnado:** is_even recibe n y devuelve True o False; main utiliza ese valor para decidir qué imprimir.

**Qué escribo o modifico:** Entre la definición de main y su llamada final, añade def is_even(n): y el if/else que devuelve True o False.

**Qué puedo decir antes de escribir:** «Esta función no debe imprimir la palabra par: debe contestar a quien la llama. ¿Qué devuelve cuando n vale 4?»

```python
def main():
    x = int(input("What's x? "))
    if is_even(x):
        print("Even")
    else:
        print("Odd")


def is_even(n):
    if n % 2 == 0:
        return True
    else:
        return False


main()
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'2'` | `Even` |
| `'4'` | `Even` |
| `'3'` | `Odd` |

**Atención docente:** Traza propuesta: x vale 4 → se llama a is_even(4) → n vale 4 → 4 % 2 == 0 produce True → return devuelve True → main toma la rama Even. True y False llevan mayúscula inicial y no comillas. Conserva main() como en el material; no introduzcas aquí otra estructura de arranque.

**Frase o pregunta de transición:** Ya tenemos una función reutilizable. ¿Podríamos expresar la misma devolución con otra sintaxis?

---

## P05 · Par o impar — Expresar la devolución en una línea

**Origen:** Vídeo y PDF src1.pdf, página 18, parity2.py.

**Objetivo del paso:** Presentar una expresión condicional como otra forma de escribir la misma decisión.

**Qué quiero que comprenda el alumnado:** return True if n % 2 == 0 else False conserva las dos respuestas de la función.

**Qué escribo o modifico:** Modifica únicamente el cuerpo de is_even. No toques main ni su llamada.

**Qué puedo decir antes de escribir:** «Leed esta línea en orden: devuelve True si el resto es cero; en caso contrario, False.»

```python
def main():
    x = int(input("What's x? "))
    if is_even(x):
        print("Even")
    else:
        print("Odd")


def is_even(n):
    return True if n % 2 == 0 else False


main()
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'2'` | `Even` |
| `'4'` | `Even` |
| `'3'` | `Odd` |

**Atención docente:** Malan muestra esta forma compacta y enseguida la vuelve a simplificar. No es el objetivo que memoricen una expresión sin poder explicar las dos ramas.

**Frase o pregunta de transición:** La condición n % 2 == 0 ya produce una respuesta booleana. ¿Por qué envolverla en otra decisión?

---

## P06 · Par o impar — Devolver la propia comparación

**Origen:** Vídeo: añade paréntesis temporalmente al explicar la devolución directa. Paso anterior a PDF src1.pdf, página 19, parity3.py.

**Objetivo del paso:** Hacer visible que la comparación es una expresión con un valor.

**Qué quiero que comprenda el alumnado:** n % 2 == 0 ya da True o False, que es exactamente lo que debe devolver la función.

**Qué escribo o modifico:** Sustituye la expresión condicional por return (n % 2 == 0). Mantén los paréntesis solo como apoyo visual.

**Qué puedo decir antes de escribir:** «Con n igual a 4, ¿qué valor hay dentro de los paréntesis? ¿Y con n igual a 3? Pues ese es el valor que devolvemos.»

```python
def main():
    x = int(input("What's x? "))
    if is_even(x):
        print("Even")
    else:
        print("Odd")


def is_even(n):
    return (n % 2 == 0)


main()
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'2'` | `Even` |
| `'4'` | `Even` |
| `'3'` | `Odd` |

**Frase o pregunta de transición:** Para esta expresión los paréntesis no son necesarios; podemos retirarlos sin cambiar el resultado.

---

## P07 · Par o impar — La versión final, sin perder la explicación

**Origen:** Vídeo y PDF src1.pdf, página 19, parity3.py.

**Objetivo del paso:** Cerrar la simplificación manteniendo una lectura comprensible del programa.

**Qué quiero que comprenda el alumnado:** La función puede consistir en devolver directamente el valor booleano de la comparación.

**Qué escribo o modifico:** Quita los paréntesis de la devolución: return n % 2 == 0. Conserva todo main.

**Qué puedo decir antes de escribir:** «No estamos devolviendo simplemente el resto. Estamos devolviendo el resultado de comparar ese resto con cero.»

```python
def main():
    x = int(input("What's x? "))
    if is_even(x):
        print("Even")
    else:
        print("Odd")


def is_even(n):
    return n % 2 == 0


main()
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'2'` | `Even` |
| `'4'` | `Even` |
| `'3'` | `Odd` |

**Atención docente:** Malan aclara que la versión larga con if y else también es correcta y puede ayudar a comprender el código. No presentes la menor longitud como una obligación que esté por encima de la claridad.

**Frase o pregunta de transición:** La siguiente demostración vuelve al texto y presenta otra manera de expresar varias alternativas.

---


# 5. house.py — Repetición, alternativas y match

## H01 · Casas — Empezar por un nombre conocido

**Origen:** Vídeo: inicio de house.py y primer nombre. Paso previo a PDF src1.pdf, página 20, house0.py.

**Objetivo del paso:** Retomar condiciones conocidas antes de introducir match.

**Qué quiero que comprenda el alumnado:** La misma estructura de decisión sirve para comparar cadenas.

**Qué escribo o modifico:** Crea house.py, pide name y añade el caso Harry con su casa.

**Qué puedo decir antes de escribir:** «Vamos a pedir un nombre y responder con la casa que hemos asociado a ese personaje. Empecemos solo por Harry.»

```python
name = input("What's your name? ")

if name == "Harry":
    print("Gryffindor")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'Harry'` | `Gryffindor` |
| `'Draco'` | No imprime ningún resultado |

**Atención docente:** La ejecución aislada de esta primera construcción es una propuesta de aula. Se conservan los nombres y mensajes del material, sin añadir normalización del texto.

**Frase o pregunta de transición:** Faltan más nombres y una respuesta para los que no hemos previsto.

---

## H02 · Casas — Completar los casos con if, elif y else

**Origen:** Vídeo y PDF src1.pdf, página 20, house0.py.

**Objetivo del paso:** Crear una solución familiar donde se pueda detectar repetición.

**Qué quiero que comprenda el alumnado:** Harry, Hermione y Ron reciben la misma salida; Draco recibe otra y el resto activa else.

**Qué escribo o modifico:** Añade, por este orden, los elif de Hermione, Ron y Draco; termina con else y Who?.

**Qué puedo decir antes de escribir:** «Probad Harry, Draco y Padma. Ahora mirad el código: ¿qué instrucción hemos repetido tres veces?»

```python
name = input("What's your name? ")

if name == "Harry":
    print("Gryffindor")
elif name == "Hermione":
    print("Gryffindor")
elif name == "Ron":
    print("Gryffindor")
elif name == "Draco":
    print("Slytherin")
else:
    print("Who?")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'Harry'` | `Gryffindor` |
| `'Hermione'` | `Gryffindor` |
| `'Ron'` | `Gryffindor` |
| `'Draco'` | `Slytherin` |
| `'Padma'` | `Who?` |

**Atención docente:** El vídeo prueba Harry, Draco y Padma en esta primera versión. El resto de comprobaciones de la tabla se incluyen para cubrir todos los nombres.

**Frase o pregunta de transición:** Ya sabemos unir alternativas que comparten una respuesta: reutilicemos or.

---

## H03 · Casas — Agrupar alternativas con la misma salida

**Origen:** Vídeo y PDF src1.pdf, página 21, house1.py.

**Objetivo del paso:** Reutilizar or para eliminar la repetición del mismo print.

**Qué quiero que comprenda el alumnado:** Tres comparaciones completas pueden llevar a una sola rama.

**Qué escribo o modifico:** Agrupa Harry, Hermione y Ron en el primer if usando or. Elimina los dos elif redundantes y conserva Draco y else.

**Qué puedo decir antes de escribir:** «Si cualquiera de estos tres nombres lleva a Gryffindor, ¿podemos escribir el print una sola vez?»

```python
name = input("What's your name? ")

if name == "Harry" or name == "Hermione" or name == "Ron":
    print("Gryffindor")
elif name == "Draco":
    print("Slytherin")
else:
    print("Who?")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'Harry'` | `Gryffindor` |
| `'Hermione'` | `Gryffindor` |
| `'Ron'` | `Gryffindor` |
| `'Draco'` | `Slytherin` |
| `'Padma'` | `Who?` |

**Atención docente:** Conserva cada name == a ambos lados de or. No sustituyas este paso por listas, in o diccionarios: esas no son las versiones de estos materiales.

**Frase o pregunta de transición:** La línea todavía acumula varias comparaciones. Malan introduce otra herramienta: match.

---

## H04 · Casas — Introducir match sin resolverlo todo de golpe

**Origen:** Vídeo: primera versión de match sin caso general. El PDF ya presenta ese caso general en house2.py.

**Objetivo del paso:** Introducir match y case usando el mismo problema, sin añadir a la vez todas sus variantes.

**Qué quiero que comprenda el alumnado:** El programa compara name con los casos escritos. Un nombre no contemplado no provoca ninguna de estas impresiones.

**Qué escribo o modifico:** Sustituye if/elif/else por match name y cuatro case separados: Harry, Hermione, Ron y Draco. Todavía no añadas case _.

**Qué puedo decir antes de escribir:** «Los nombres conocidos siguen funcionando. ¿Qué ocurrirá al introducir otra vez Padma?»

```python
name = input("What's your name? ")

match name:
    case "Harry":
        print("Gryffindor")
    case "Hermione":
        print("Gryffindor")
    case "Ron":
        print("Gryffindor")
    case "Draco":
        print("Slytherin")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'Harry'` | `Gryffindor` |
| `'Hermione'` | `Gryffindor` |
| `'Draco'` | `Slytherin` |
| `'Padma'` | No imprime ningún resultado |

**Atención docente:** Señala dos niveles de indentación: case dentro de match y print dentro de case. Mantén las comillas de los nombres. La ausencia de salida para Padma es un paso demostrado en el vídeo, no un error de transcripción.

**Frase o pregunta de transición:** Falta una respuesta general para lo que no coincide con ningún caso.

---

## H05 · Casas — Recuperar la respuesta para los demás nombres

**Origen:** Vídeo y PDF src1.pdf, página 22, house2.py.

**Objetivo del paso:** Añadir el equivalente práctico del caso restante para este ejemplo.

**Qué quiero que comprenda el alumnado:** El patrón _ permite atender al valor que no ha coincidido con los casos anteriores.

**Qué escribo o modifico:** Añade al final case _: y su print("Who?"). No cambies los casos anteriores.

**Qué puedo decir antes de escribir:** «¿Cómo le damos a match una respuesta para cualquier nombre que no hayamos escrito antes?»

```python
name = input("What's your name? ")

match name:
    case "Harry":
        print("Gryffindor")
    case "Hermione":
        print("Gryffindor")
    case "Ron":
        print("Gryffindor")
    case "Draco":
        print("Slytherin")
    case _:
        print("Who?")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'Harry'` | `Gryffindor` |
| `'Hermione'` | `Gryffindor` |
| `'Ron'` | `Gryffindor` |
| `'Draco'` | `Slytherin` |
| `'Padma'` | `Who?` |

**Frase o pregunta de transición:** Hemos recuperado Who?, pero vuelve a haber tres impresiones de Gryffindor. ¿Podemos agruparlas también aquí?

---

## H06 · Casas — Agrupar patrones con la barra vertical

**Origen:** Vídeo y PDF src1.pdf, página 23, house3.py.

**Objetivo del paso:** Completar la demostración agrupando las alternativas de match.

**Qué quiero que comprenda el alumnado:** case "Harry" | "Hermione" | "Ron": reúne tres patrones alternativos con la misma salida.

**Qué escribo o modifico:** Fusiona los tres primeros case con | y deja un único print de Gryffindor. Conserva el caso Draco y case _.

**Qué puedo decir antes de escribir:** «Antes usamos or dentro de una condición. En esta sintaxis de case, ¿qué símbolo permite reunir las alternativas?»

```python
name = input("What's your name? ")

match name:
    case "Harry" | "Hermione" | "Ron":
        print("Gryffindor")
    case "Draco":
        print("Slytherin")
    case _:
        print("Who?")
```

**Prueba y resultado esperado** — Los mensajes de solicitud de datos no se repiten en la columna de salida.

| Entrada, en orden | Salida o estado esperado |
|---|---|
| `'Harry'` | `Gryffindor` |
| `'Hermione'` | `Gryffindor` |
| `'Ron'` | `Gryffindor` |
| `'Draco'` | `Slytherin` |
| `'Padma'` | `Who?` |

**Atención docente:** Malan presenta match como otra herramienta, no como un reemplazo obligatorio de if. En estos casos no se añade break; el caso general se escribe con _. La transcripción menciona que match pertenece a versiones recientes, pero no concreta un número de versión.

**Frase o pregunta de transición:** Cierre: pide que expliquen qué decisión toma cada programa y por qué fue necesario cada cambio.

---

# Chuleta final para el directo

| Momento | Pregunta que justifica avanzar |
|---|---|
| Tres `if` en `compare` | «¿Solo imprime una vez o solo pregunta una vez?» |
| Cadena con `elif` | «Si ya ha encontrado una respuesta verdadera, ¿por qué seguir preguntando?» |
| Último caso de `compare` | «Si no es menor ni mayor, ¿qué puede ser?» |
| Paso a `or` | «Ahora solo quiero saber si son distintos: ¿qué casos puedo reunir?» |
| Intervalos de `grade` | «¿Necesitamos cumplir los dos límites?» |
| Simplificar `grade` | «Al llegar aquí, ¿qué sabemos por haber descartado las ramas anteriores?» |
| Error con nota 95 | «¿Cuántas de estas condiciones independientes son verdaderas?» |
| `agree`, solo PDF | «¿Qué entradas acepta ahora y cuáles antes no aceptaba?» |
| Función `is_even` | «¿Debe mostrar un mensaje o devolver una respuesta a quien la llama?» |
| Devolución directa | «¿Qué valor produce ya esta comparación?» |
| `match` sin `_` | «¿Qué ocurre con un nombre para el que no hemos escrito un caso?» |
| Agrupar patrones | «¿Podemos dejar una sola respuesta para estas tres alternativas?» |

## Comprobación de comprensión propuesta para tu grupo

Estas preguntas son una propuesta de aula, no una actividad recogida literalmente en la transcripción. Úsalas en el momento correspondiente, sin convertirlas en otra práctica extensa.

**Después de compare y grade:** «¿Por qué los tres if de la comparación no imprimían tres mensajes, pero los cuatro if de grade sí pueden imprimir cuatro calificaciones?» La respuesta debe hablar de qué condiciones pueden ser verdaderas simultáneamente, no solo de la palabra utilizada.

**Después de parity:** «Cuando llamamos a is_even(3), ¿qué devuelve la función y qué imprime main?» Respuesta: la función devuelve False; main imprime Odd.

**Después de house:** «¿Qué imprimiría Padma antes y después de añadir case _?» Respuesta: antes, ningún resultado; después, Who?.

## Límites de esta reconstrucción

No se han inventado marcas de tiempo porque la transcripción aportada no las contiene. No se atribuyen al vídeo las cinco versiones de agree. Tampoco se introducen como pasos de Malan validación de entradas, listas, diccionarios, excepciones ni otras refactorizaciones que no aparecen en este recorrido. Las advertencias sobre el dominio de las notas y sobre el cambio de entradas aceptadas por startswith evitan presentar como equivalentes versiones que no lo son fuera de sus supuestos.

El foco al dar la clase no es que copien la última versión, sino que puedan explicar **qué necesidad ha motivado el cambio que acabas de hacer**.

---

<a id="codigo-completo-del-pdf"></a>

# Anexo — Todo el código original de src1.pdf

**Fuente:** `src1.pdf`, páginas 1–23, aportado por el docente.

Las 23 versiones se presentan completas y en el mismo orden que en el PDF. Se conservan el código, los comentarios originales en inglés y la indentación; se han retirado únicamente los números de línea de la maquetación. Cada bloque corresponde a una versión independiente.

<a id="indice-codigo-pdf"></a>

## Índice del código

| Ejercicio | Páginas del PDF | Versiones |
|---|---|---|
| [compare.py — Comparación de números](#pdf-bloque-compare) | 1–6 | [compare0.py](#pdf-compare0) · [compare1.py](#pdf-compare1) · [compare2.py](#pdf-compare2) · [compare3.py](#pdf-compare3) · [compare4.py](#pdf-compare4) · [compare5.py](#pdf-compare5) |
| [grade.py — Calificaciones](#pdf-bloque-grade) | 7–10 | [grade0.py](#pdf-grade0) · [grade1.py](#pdf-grade1) · [grade2.py](#pdf-grade2) · [grade3.py](#pdf-grade3) |
| [agree.py — Comparación de respuestas](#pdf-bloque-agree) | 11–15 | [agree0.py](#pdf-agree0) · [agree1.py](#pdf-agree1) · [agree2.py](#pdf-agree2) · [agree3.py](#pdf-agree3) · [agree4.py](#pdf-agree4) |
| [parity.py — Números pares e impares](#pdf-bloque-parity) | 16–19 | [parity0.py](#pdf-parity0) · [parity1.py](#pdf-parity1) · [parity2.py](#pdf-parity2) · [parity3.py](#pdf-parity3) |
| [house.py — Nombres y casas](#pdf-bloque-house) | 20–23 | [house0.py](#pdf-house0) · [house1.py](#pdf-house1) · [house2.py](#pdf-house2) · [house3.py](#pdf-house3) |

---

<a id="pdf-bloque-compare"></a>

## 1. `compare.py` — Comparación de números

<a id="pdf-compare0"></a>

### Página 1: `compare0.py`

```python
# Demonstrates conditionals

x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y:
    print("x is less than y")
if x > y:
    print("x is greater than y")
if x == y:
    print("x is equal to y")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-compare1"></a>

### Página 2: `compare1.py`

```python
# Demonstrates mutually exclusive conditions

x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y:
    print("x is less than y")
elif x > y:
    print("x is greater than y")
elif x == y:
    print("x is equal to y")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-compare2"></a>

### Página 3: `compare2.py`

```python
# Demonstrates fewer conditions

x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y:
    print("x is less than y")
elif x > y:
    print("x is greater than y")
else:
    print("x is equal to y")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-compare3"></a>

### Página 4: `compare3.py`

```python
# Demonstrates inequalities and logical operator

x = int(input("What's x? "))
y = int(input("What's y? "))

if x < y or x > y:
    print("x is not equal to y")
else:
    print("x is equal to y")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-compare4"></a>

### Página 5: `compare4.py`

```python
# Demonstrates equality

x = int(input("What's x? "))
y = int(input("What's y? "))

if x == y:
    print("x is equal to y")
else:
    print("x is not equal to y")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-compare5"></a>

### Página 6: `compare5.py`

```python
# Demonstrates inequality

x = int(input("What's x? "))
y = int(input("What's y? "))

if x != y:
    print("x is not equal to y")
else:
    print("x is equal to y")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-bloque-grade"></a>

## 2. `grade.py` — Calificaciones

<a id="pdf-grade0"></a>

### Página 7: `grade0.py`

```python
# Demonstrates inequalities and logical operators

score = int(input("Score: "))

if score >= 90 and score <= 100:
    print("Grade: A")
elif score >= 80 and score < 90:
    print("Grade: B")
elif score >= 70 and score < 80:
    print("Grade: C")
elif score >= 60 and score < 70:
    print("Grade: D")
else:
    print("Grade: F")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-grade1"></a>

### Página 8: `grade1.py`

```python
# Demonstrates inequalities and logical operators

score = int(input("Score: "))

if 90 <= score and score <= 100:
    print("Grade: A")
elif 80 <= score and score < 90:
    print("Grade: B")
elif 70 <= score and score < 80:
    print("Grade: C")
elif 60 <= score and score < 70:
    print("Grade: D")
else:
    print("Grade: F")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-grade2"></a>

### Página 9: `grade2.py`

```python
# Demonstrates chained comparisons

score = int(input("Score: "))

if 90 <= score <= 100:
    print("Grade: A")
elif 80 <= score < 90:
    print("Grade: B")
elif 70 <= score < 80:
    print("Grade: C")
elif 60 <= score < 70:
    print("Grade: D")
else:
    print("Grade: F")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-grade3"></a>

### Página 10: `grade3.py`

```python
# Demonstrates fewer comparisons

score = int(input("Score: "))

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
elif score >= 60:
    print("Grade: D")
else:
    print("Grade: F")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-bloque-agree"></a>

## 3. `agree.py` — Comparación de respuestas

<a id="pdf-agree0"></a>

### Página 11: `agree0.py`

```python
# Compares strings

answer = input("Do you agree? ")
if answer == "yes":
    print("Agreed")
else:
    print("Not agreed")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-agree1"></a>

### Página 12: `agree1.py`

```python
# Strips string before comparing

answer = input("Do you agree? ").strip()
if answer == "yes":
    print("Agreed")
else:
    print("Not agreed")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-agree2"></a>

### Página 13: `agree2.py`

```python
# Lowercases string before comparing

answer = input("Do you agree? ").strip().lower()
if answer == "yes":
    print("Agreed")
else:
    print("Not agreed")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-agree3"></a>

### Página 14: `agree3.py`

```python
# Compares multiple strings

answer = input("Do you agree? ").strip().lower()
if answer == "yes" or answer == "y":
    print("Agreed")
else:
    print("Not agreed")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-agree4"></a>

### Página 15: `agree4.py`

```python
# Compares multiple strings

answer = input("Do you agree? ").strip().lower()
if answer.startswith("y"):
    print("Agreed")
else:
    print("Not agreed")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-bloque-parity"></a>

## 4. `parity.py` — Números pares e impares

<a id="pdf-parity0"></a>

### Página 16: `parity0.py`

```python
# Demonstrates modulo operator

x = int(input("What's x? "))

if x % 2 == 0:
    print("Even")
else:
    print("Odd")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-parity1"></a>

### Página 17: `parity1.py`

```python
# Demonstrates a function that returns a bool


def main():
    x = int(input("What's x? "))
    if is_even(x):
        print("Even")
    else:
        print("Odd")


def is_even(n):
    if n % 2 == 0:
        return True
    else:
        return False


main()
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-parity2"></a>

### Página 18: `parity2.py`

```python
# Demonstrates conditional expressions (ternary operators)


def main():
    x = int(input("What's x? "))
    if is_even(x):
        print("Even")
    else:
        print("Odd")


def is_even(n):
    return True if n % 2 == 0 else False


main()
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-parity3"></a>

### Página 19: `parity3.py`

```python
# Demonstrates returning the value of a Boolean expression


def main():
    x = int(input("What's x? "))
    if is_even(x):
        print("Even")
    else:
        print("Odd")


def is_even(n):
    return n % 2 == 0


main()
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-bloque-house"></a>

## 5. `house.py` — Nombres y casas

<a id="pdf-house0"></a>

### Página 20: `house0.py`

```python
# Compares multiple strings with if/elif/else

name = input("What's your name? ")

if name == "Harry":
    print("Gryffindor")
elif name == "Hermione":
    print("Gryffindor")
elif name == "Ron":
    print("Gryffindor")
elif name == "Draco":
    print("Slytherin")
else:
    print("Who?")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-house1"></a>

### Página 21: `house1.py`

```python
# Uses or

name = input("What's your name? ")

if name == "Harry" or name == "Hermione" or name == "Ron":
    print("Gryffindor")
elif name == "Draco":
    print("Slytherin")
else:
    print("Who?")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-house2"></a>

### Página 22: `house2.py`

```python
# Uses match with case

name = input("What's your name? ")

match name:
    case "Harry":
        print("Gryffindor")
    case "Hermione":
        print("Gryffindor")
    case "Ron":
        print("Gryffindor")
    case "Draco":
        print("Slytherin")
    case _:
        print("Who?")
```

[Volver al índice del código](#indice-codigo-pdf)

---

<a id="pdf-house3"></a>

### Página 23: `house3.py`

```python
# Uses |

name = input("What's your name? ")

match name:
    case "Harry" | "Hermione" | "Ron":
        print("Gryffindor")
    case "Draco":
        print("Slytherin")
    case _:
        print("Who?")
```

[Volver al índice del código](#indice-codigo-pdf)

---
Guion_Malan_condicionales_con_todo_el_codigo.md
Mostrando Guion_Malan_condicionales_con_todo_el_codigo.md.
