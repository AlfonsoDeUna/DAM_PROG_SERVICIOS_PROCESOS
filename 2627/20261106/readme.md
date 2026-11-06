# Sincronización de hilos en Python

Presentación y evaluación formativa para **Programación de Servicios y Procesos de 2.º DAM**. El material combina explicaciones, programas completos, predicciones, modificaciones de código y comprobación de las respuestas de la clase.

## Accesos

| Acceso | Para qué se utiliza |
| --- | --- |
| [Abrir la presentación](https://alfonsodeuna.github.io/DAM_PROG_SERVICIOS_PROCESOS/2627/20261106/) | Proyectar las explicaciones, las preguntas y sus resultados. |
| [Página del alumnado](https://alfonsodeuna.github.io/DAM_PROG_SERVICIOS_PROCESOS/2627/20261106/alumnado.html) | Entrar con nombre, grupo y código de sesión; responder individualmente. |
| [Panel docente](https://alfonsodeuna.github.io/DAM_PROG_SERVICIOS_PROCESOS/2627/20261106/docente.html) | Crear sesiones, abrir bloques, consultar respuestas y exportar resultados. |

## Qué incluye

- **169 diapositivas** con fondo blanco, navegación por teclado, índice de contenidos y pantalla completa.
- **12 bloques** que recorren la creación de hilos, las referencias compartidas, `join`, las carreras, el GIL, `Lock`, `RLock`, `Condition`, `Semaphore`, `BoundedSemaphore`, `Event`, `Queue`, las descargas y una actividad integradora.
- **36 actividades registradas: 24 preguntas de tipo test y 12 ejercicios de huecos**, distribuidas en tres actividades por bloque.
- Una diapositiva de resultados inmediatamente después de cada actividad registrada.
- Ejemplos Python y simulaciones didácticas para seguir una carrera y la diferencia entre retirar y confirmar un trabajo en una cola.

Las predicciones orales, los casos de discusión y las modificaciones prácticas de los ejemplos forman parte de la explicación. **No se califican automáticamente ni se guardan como respuestas**: el registro corresponde a las 36 actividades identificadas por bloque y número de pregunta.

Los programas Python se ejecutan en VS Code o en la terminal. Los botones de la presentación permiten copiar código; las simulaciones del navegador ayudan a comprender el funcionamiento, pero no ejecutan esos programas Python.

## Preparar una clase

1. Abre el **panel docente** e inicia sesión con una cuenta de Supabase Auth autorizada para esta unidad.
2. Pulsa **Nueva sesión**, escribe un nombre identificable y confirma su creación. Se genera un código de ocho caracteres.
3. Comparte la **página del alumnado** y ese código. El botón **Copiar enlace de alumnado** genera un enlace que incorpora el código.
4. Cada estudiante escribe su nombre y apellidos, su grupo y el código, y pulsa **Entrar en la actividad**.
5. Comprueba en el panel que el alumnado se ha inscrito. Todavía no hace falta que haya respondido.
6. Abre la presentación **en el mismo navegador y perfil que el panel docente**, utilizando los enlaces publicados. Ambos comparten el acceso docente y la selección de sesión. Si se solicita, pulsa **Sesión de clase** y selecciona la clase correspondiente.
7. Al llegar a las actividades, abre el bloque desde el panel o desde la diapositiva de la pregunta. Los bloques de una sesión nueva empiezan cerrados.

La presentación teórica puede consultarse sin acceso docente. La recogida de respuestas y los resultados requieren conexión con Supabase.

## Durante cada pregunta

La secuencia de trabajo es:

1. **Pregunta proyectada.** Se muestra el enunciado con el código y las opciones o los huecos necesarios.
2. **Respuesta individual.** El alumnado abre el bloque y la pregunta correspondiente en su página, responde y pulsa **Guardar respuesta**. Escribir una respuesta no equivale a enviarla: debe aparecer la confirmación de registro.
3. **Ver resultados.** Al pulsar este botón en la presentación, se solicita el cierre de esa pregunta. El cierre debe confirmarse antes de mostrar los resultados. Las otras preguntas del bloque conservan su estado.
4. **Diapositiva de resultados.** Aparecen las respuestas recibidas, los nombres y quién necesita revisar o todavía no ha respondido.
5. **Mostrar solución.** El profesor decide cuándo enseñar la opción correcta o el código que completa los huecos, junto con su explicación.
6. **Continuar.** Se pasa a la siguiente pregunta y se repite el proceso.

Una pregunta cerrada deja de admitir envíos y cambios. En la página del estudiante se muestra la **respuesta registrada**; si conservaba cambios sin enviar, aparecen aparte como borrador local. Un fallo de conexión no debe interpretarse como un envío confirmado.

### Cómo interpretar los resultados

| Estado | Significado |
| --- | --- |
| Correcta completa | La respuesta obtiene todos los puntos de la pregunta. |
| Incorrecta | La puntuación es cero. |
| Parcial | En un ejercicio con varios huecos, solo una parte coincide con las respuestas admitidas. Se muestra la puntuación conseguida. |
| Sin responder | La persona se ha inscrito en esta sesión, pero no tiene una respuesta registrada para esa pregunta. |

En la proyección, **incorrectas y parciales comparten la columna «Incorrectas o parciales»**; la puntuación de los huecos permite distinguirlas. El porcentaje de aciertos se calcula sobre las respuestas recibidas.

**Los pendientes se calculan sobre participantes inscritos, no sobre una lista oficial de clase.** Si alguien todavía no ha entrado con el código, no aparecerá ni como participante ni como pendiente. Conviene comprobar la inscripción al principio.

La proyección muestra **nombres y respuestas** para la revisión colectiva. El filtro de grupo permite limitar a quién se muestra. El panel docente ofrece además las vistas **Por alumno/a** y **Por pregunta**, el detalle de cada estudiante y la exportación CSV.

## Mostrar soluciones y repetir una pregunta

**Mostrar solución**, en una diapositiva de resultados, enseña la explicación en la proyección. No abre la pregunta ni permite cambiar respuestas.

Para que el alumnado pueda consultar la corrección de sus respuestas en su propia página, utiliza **Cerrar y mostrar soluciones** en el panel. Esta acción afecta al bloque completo y lo deja cerrado.

Si deseas repetir una pregunta:

1. Comprueba que estás en la sesión activa.
2. Si el bloque está cerrado o sus soluciones están visibles, pulsa **Abrir bloque**. Esto vuelve a permitir el trabajo del bloque y oculta su corrección en la página del alumnado.
3. En **Por pregunta**, pulsa **Reabrir pregunta** para la pregunta concreta. También puedes volver a su diapositiva y utilizar el botón de reapertura.
4. Pide un nuevo envío. Mientras la pregunta esté abierta, el último envío sustituye a la respuesta anterior de esa persona en la misma sesión.
5. Pulsa de nuevo **Ver resultados** para cerrar esa pregunta y revisar el nuevo estado.

Abrir un bloque **no reabre automáticamente** las preguntas cerradas individualmente. La reapertura de cada pregunta es explícita. Si ya se ha explicado la solución, tenlo en cuenta al interpretar el segundo intento.

Para empezar otra clase desde cero, utiliza **Nueva sesión**. La anterior se archiva y conserva sus respuestas en el historial docente. Solo hay una sesión activa de esta unidad; los registros de una sesión archivada no admiten nuevos envíos.

## Identificación del alumnado

El alumnado utiliza una identidad anónima de Supabase Auth y declara su nombre y grupo al entrar. No necesita una cuenta con correo y contraseña.

Para conservar esa identidad, debe continuar **en el mismo navegador y perfil**, sin borrar sus datos durante la actividad. Cambiar de dispositivo, usar otro perfil o perder la identidad guardada puede crear un participante distinto aunque escriba el mismo nombre. El nombre declarado no es una contraseña ni fusiona automáticamente dos identidades.

Los borradores pendientes se guardan en el navegador. Las respuestas confirmadas se guardan en Supabase. La página de alumnado usa una identidad separada de la sesión docente, de modo que se pueden abrir ambos accesos en el mismo equipo para preparar la clase.

## Requisitos de instalación en Supabase

La aplicación utiliza el proyecto **`snrvoilwmgzeylncqbrs`**:

- [Panel de administración del proyecto](https://supabase.com/dashboard/project/snrvoilwmgzeylncqbrs)
- URL de la API: `https://snrvoilwmgzeylncqbrs.supabase.co`

Antes de recoger respuestas, deben estar preparados el esquema de la unidad, las 36 preguntas y sus claves privadas de corrección. El backend utiliza tablas `public.hilos_*`, el esquema privado `hilos_private` y funciones públicas `hilos_*`. La creación de tablas por sí sola no carga las preguntas ni sus soluciones.

### 1. Habilitar el acceso anónimo del alumnado

En la configuración de **Authentication** del proyecto, habilita **Anonymous sign-ins** y guarda el cambio. La página del alumnado utiliza `signInAnonymously()` antes de registrar el nombre, el grupo y el código.

No es necesario dar permisos de lectura pública a las tablas para conseguirlo. El acceso a datos se realiza mediante las funciones de la aplicación y comprueba la identidad de cada participante.

### 2. Crear y autorizar una cuenta docente

1. Crea una cuenta permanente de **Supabase Auth** en este mismo proyecto, con el correo que utilizará el profesor. La contraseña se establece de forma privada en el proceso de creación o recuperación de esa cuenta.
2. Copia su **UUID de usuario** desde Authentication.
3. En SQL Editor, con acceso de administración, sustituye `UUID_REAL_DEL_DOCENTE` por ese UUID y ejecuta:

```sql
INSERT INTO hilos_private.teachers (user_id)
SELECT id
FROM auth.users
WHERE id = 'UUID_REAL_DEL_DOCENTE'::uuid
  AND COALESCE(is_anonymous, false) = false
ON CONFLICT (user_id) DO NOTHING;
```

4. Comprueba la autorización, utilizando el mismo UUID:

```sql
SELECT EXISTS (
    SELECT 1
    FROM hilos_private.teachers
    WHERE user_id = 'UUID_REAL_DEL_DOCENTE'::uuid
) AS docente_autorizado;
```

El resultado debe ser `true`. Si es `false`, comprueba que has copiado el UUID de la cuenta permanente correcta de este proyecto.

El acceso al panel docente se realiza con **esa cuenta de Auth**. El permiso para administrar Supabase y la autorización para utilizar esta aplicación son accesos distintos. No se publican contraseñas ni se autoriza automáticamente al primer visitante.

### 3. Configurar el navegador con una clave publicable

`config.js` contiene la URL del proyecto y una **clave publicable** de navegador. Esta es la estructura de configuración:

```javascript
window.HILOS_CONFIG = {
  url: "https://snrvoilwmgzeylncqbrs.supabase.co",
  publishableKey: "CLAVE_PUBLICABLE_DEL_PROYECTO",
  pollMs: 6000,
  unit: "psp-hilos-2026"
};
```

La clave publicable no concede acceso docente. La autorización se comprueba mediante `hilos_am_teacher()` y la tabla privada `hilos_private.teachers`.

Las claves de corrección se conservan en `hilos_private.answer_keys`. Ese esquema debe permanecer fuera de los esquemas expuestos por la Data API. No se incluyen claves `service_role`, claves secretas, contraseñas, soluciones privadas ni respuestas del alumnado en el repositorio de GitHub.

## Publicación y archivos

GitHub Pages sirve los archivos HTML, CSS y JavaScript desde `main`, en la ruta `2627/20261106/`. Supabase conserva las sesiones y las respuestas.

| Archivo o carpeta | Función |
| --- | --- |
| `index.html` | Presentación con preguntas y diapositivas de resultados. |
| `alumnado.html` | Entrada y respuestas individuales. |
| `docente.html` | Gestión y seguimiento de sesiones. |
| `config.js` | URL del proyecto y clave publicable. |
| `assets/` | Estilos, navegación y lógica de la aplicación. |
| `data/` | Contenido de la presentación y enunciados públicos de las preguntas. |
| `vendor/` | Cliente de Supabase y su licencia. |
| `ejemplos/` | Programas Python de la unidad. |

Las respuestas de tipo test se corrigen en el servidor. Los huecos admiten las alternativas definidas para cada pregunta: se ignoran espacios al principio y al final, pero se respetan mayúsculas y espacios interiores. No se ejecuta código Python para corregirlos.

Mantén estable el banco de preguntas y sus claves una vez iniciada una sesión evaluable, para que las puntuaciones y explicaciones se refieran a la misma versión de la actividad.

## Si algo no aparece

| Situación | Qué comprobar |
| --- | --- |
| El alumnado no puede entrar y se indica que el acceso anónimo no está habilitado. | Activar Anonymous sign-ins en Authentication del proyecto correcto. |
| La cuenta inicia sesión, pero no tiene acceso docente. | El UUID de esa cuenta debe estar en `hilos_private.teachers`. |
| La presentación solicita conectar una sesión. | Abrirla en el mismo navegador y perfil que el panel, iniciar sesión y seleccionar la clase. |
| Un estudiante no aparece en los pendientes. | Debe haberse inscrito con el código de esa sesión y estar incluido en el filtro de grupo. |
| Una pregunta no permite guardar. | Comprobar que la sesión está activa, el bloque abierto y esa pregunta reabierta. |
| El envío no se confirma. | Conservar el borrador, comprobar la conexión y reintentar mientras la pregunta siga abierta. |
| No se actualizan las sesiones o los resultados. | Pulsar Actualizar. Si se conserva una vista anterior, no interpretarla como datos recién recibidos. |

## Referencias del contenido

- [Artículo de partida: Python threads synchronization](https://www.doomedraven.com/2011/11/python-threads-synchronization-locks.html).
- [Documentación de threading](https://docs.python.org/es/3.14/library/threading.html).
- [Documentación de queue](https://docs.python.org/es/3.14/library/queue.html).
- [Documentación de urllib.request](https://docs.python.org/3.14/library/urllib.request.html).
- [Supabase: acceso anónimo](https://supabase.com/docs/guides/auth/auth-anonymous).
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).
- [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

El artículo de 2011 sirve como referencia temática. Los ejemplos y las actividades de esta unidad son originales en Python 3; la implementación histórica se identifica como ampliación.
