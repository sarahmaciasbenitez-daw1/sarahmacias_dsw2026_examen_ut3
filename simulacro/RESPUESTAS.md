# Respuestas simulacro
# Primera parte
## 3
- En el controllador de documents con throw new ResourceNotfound
-El catch hace next(err)
-Se convierte en respuesta HTTP en errorHandler en instanceof ResourceNotFoundError para el 404

## 4

- Error centralizado (ejercicio 3): el controlador hace throw, el catch llama a next(err) y Express salta al errorHandler. Ahí se decide el estado y el cuerpo. Es un recorrido indirecto y la respuesta se construye en un solo sitio para todos los errores. Además, el error queda registrado en la consola con console.error.
- Respuesta directa (ejercicio 4): el controlador llama a res.status(400).json(...) y termina con return. La petición no pasa por el errorHandler, por lo que no se registra nada en el log de errores. Se usa para casos de validación esperados, con un cuerpo específico (INVALID_TITLE) que el controlador conoce mejor que el manejador global.
- Consecuencia práctica: con la respuesta directa no se ejecuta ni el servicio ni ningún cambio en el documento, porque el return corta el flujo antes.

### Explicación diferencia respecto al anterior ejercicio
En la actividad anterior, el controlador lanzaba un error con throw y lo pasaba con next(err) al errorHandler, que construía la respuesta. En esta actividad, el controlador responde él mismo con res.status(400).json(...) y termina con return. La petición no llega al errorHandler, así que no se registra en su log, y tampoco llega al servicio, así que no se modifica nada.

- throw + next(err): delegar el error al manejador central.
res.status(...).json(...) + return: contestar tú mismo y terminar.
- El orden de los if importa: lo específico primero y lo general al final.
- El return corta la función. Sin él, el código sigue ejecutándose.

## 5
### Configuración del logger

1. Cómo funciona LOG: se lee en env.ts, el logger la consulta y solo imprime si está activa.
2. Qué pasa con LOG=OFF y los errores: el errorHandler sigue registrando, porque es un mecanismo distinto del logger de peticiones.
3. Por qué deshabilitar el logger no impide que la petición llegue a las rutas. Un middleware es un eslabón de la cadena, y next() es lo que pasa la petición al siguiente. El logger solo debería observar y anotar. Si dejara de llamar a next(), cortaría la cadena y la petición nunca llegaría al router, ni a los controladores. Por eso se apaga el console.log, pero next() se sigue llamando siempre.

#### Errores típicos
- Olvidar reiniciar el servidor tras cambiar .env.
- Poner next() dentro del if.
- Comparar con === 'OFF' sin pasar a mayúsculas, y que off no funcione.
- Dejar algún console.log del logger fuera del if.
- Olvidar la variable en .env.example.

## 6
### Añadir Notices en services, router y controller

Únicamente creas Notices en estas carpetas, con el código de documents y cambiar los valores por notice, notices y noticesRouter en los casos indicados.

#### Errores típicos

- Importar Express en el servicio, o pasarle req o res. Si lo haces, incumples el reparto de responsabilidades.
- Usar el mismo array que los documentos.
- Registrar la ruta después del errorHandler o del 404 en app.ts.
- Escribir .js mal en los imports. Con TypeScript en módulos ES ("type": "module"), los imports llevan .js, como en tus otros archivos.
- Olvidar ?? {} en req.body, que puede ser undefined si no se envía JSON.
- Hacer que update sobrescriba campos con undefined.
- Poner el filtro con === en vez de includes, y que "reunión" no encuentre "Reunión de padres".
- No pasar page y limit a número. Llegan como texto desde la URL.

## 9
Lo que vas a observar y por qué:

### Pregunta Respuesta

¿NODE_ENV desactiva el logger?	
- No. El logger solo mira env.LOG (if (env.LOG === 'OFF') return). NODE_ENV no interviene

Respuesta al error:	
- En development: message: "Fallo interno de prueba". En production: message: "An unexpected error occurred". Se oculta el detalle para no filtrar información interna

Log del errorHandler: 	
- En development incluye el stack. En production el stack no aparece (undefined, y JSON.stringify lo omite)

Qué código lo explica:
- En errorHandler.ts: const isProduction = env.NODE_ENV === 'production', la línea stack: isProduction ? undefined : err.stack y la línea message: isProduction ? 'An unexpected error occurred' : err.message


## 10 
### Explicaciones

1. notFound antes de los routers

Qué esperarías: que todo siga funcionando, o que solo falle alguna ruta.

Qué pasa: todas las rutas dan 404, incluso /health/live o /documents.

Por qué: notFound responde a cualquier petición y no llama a next(). Como está antes de los routers, la petición nunca llega a ellos.
Corrección: notFound debe ir después de todos los routers y antes del errorHandler.

2. quitar next() del logger

Qué esperarías: que el logger funcione y la petición siga normal, o quizá un error.

Qué pasa: la petición se queda colgada, sin respuesta, hasta que el cliente (Bruno) agota el tiempo. Y tampoco se escribe el log, porque nunca se envía respuesta y el evento finish no se dispara.

Por qué: next() es lo que pasa la petición al siguiente middleware. Sin él, la cadena se corta en el logger y nadie responde.
Corrección: volver a poner next().

## 11
- Caso	Qué interviene	Dónde se genera la respuesta	¿errorHandler?

- Documento existente	requestId → logger → json → documentsRouter → getById (controlador) → servicio	En el controlador con res.json({ data }), 200	No

- Documento inexistente	Igual, pero getById hace throw new ResourceNotFoundError y el catch llama a next(err)	En errorHandler, 404 { message, resourceId }	Sí

- URL que no existe	requestId → logger → json → ningún router coincide → notFound	En notFound, 404 NOT_FOUND	No (nadie llamó a next(err))

- Aviso con título inválido (JSON correcto)	requestId → logger → json → noticesRouter → create lanza AppError → next(err)	En errorHandler, 400 BAD_REQUEST	Sí

- JSON mal formado	requestId → logger → express.json() falla con SyntaxError (nunca llega al router ni al controlador)	En errorHandler, 400 INVALID_JSON	Sí

- PATCH de documento con título vacío	requestId → logger → json → documentsRouter → update	En el controlador con res.status(400).json(...) y return. No llega al servicio	No

#### Entrada al logger
Entrada al logger frente al finish: cuando la petición entra, el logger solo guarda la hora de inicio, registra un "listener" para el evento finish y llama a next() en el acto. El mensaje de log se escribe más tarde, cuando la respuesta ya se ha enviado. Son dos momentos distintos de la misma función.

### Preguntas:

- ¿Por qué notFound no llama a next()? Porque es el último paso normal de la cadena: termina la petición respondiendo. Si llamara a next(), Express seguiría buscando otro middleware y se podría intentar responder dos veces.
- ¿Por qué next(err) no ejecuta el notFound que viene después? Cuando se llama a next con un error, Express salta todos los middlewares normales y va directo al primer middleware de errores (el de cuatro parámetros). notFound es normal, así que se salta.
- ¿Por qué el errorHandler tiene cuatro parámetros aunque no use _next? Express reconoce un middleware de errores por tener exactamente cuatro parámetros. Con tres lo trataría como un middleware normal y nunca recibiría los errores.
Ruta inexistente frente a recurso inexistente: en la ruta inexistente, la URL no coincide con ningún endpoint de la API (/api/v1/loquesea) y responde notFound. En el recurso inexistente, la ruta sí existe (/documents/:id) pero ese id no está, y responde un ResourceNotFoundError desde el controlador. Los dos dan 404, pero con cuerpos distintos y por caminos distintos.
- ¿Por qué el logger usa finish? Al entrar la petición todavía no se conoce el código de estado ni cuánto tarda. Cuando se dispara finish, la respuesta ya se ha enviado, así que res.statusCode y durationMs están disponibles.
- ¿Para qué sirve requestId? Es un identificador único por petición. Se envía en la cabecera X-Request-Id y aparece en los logs del logger y del errorHandler, así puedes enlazar lo que pasó en una misma petición. Para la evidencia, haz una petición que dé error (por ejemplo, GET /documents/no-existe) y copia las dos líneas de consola que tengan el mismo requestId: la del errorHandler (con error) y la del logger (con status: 404).
- ¿Es obligatorio separar router, controlador y servicio? No, Express funciona con todo en un solo archivo. Pero la separación aporta orden (cada capa tiene una responsabilidad), reutilización, facilidad para cambiar una parte sin romper otras (por ejemplo, cambiar el array por una base de datos solo afecta al servicio) y que el servicio no dependa de Express.
- ¿Qué pasa con los avisos al reiniciar? Se pierden los que creaste. Están en un array en memoria (RAM) y, al reiniciar, el proceso arranca de nuevo y el array se vuelve a crear solo con los avisos iniciales del código.

## 12
### Comprobar y entregar

