## Martes 1/07/2025  
**Lautaro Santolucito:**

Durante la jornada de hoy continué con el trabajo en el servidor del sistema SICAP. Luego de haber configurado la base del backend, me enfoqué en probar si el servidor era capaz de recibir correctamente los datos enviados en formato JSON desde un dispositivo. Para eso levanté el servidor local usando Django y utilicé herramientas como Postman y curl para simular envíos de información, validando que llegaran al endpoint `/api/recibir/`.

Las pruebas fueron exitosas, el servidor recibió los datos y los procesó como estaba previsto. Esto me permitió confirmar que la estructura básica del backend ya está funcional. Dejé todo listo para que en los próximos días se pueda avanzar con la integración del ESP32 real, que es el dispositivo que va a mandar los datos de los tags RFID.

Además, comencé a tomar nota de los pasos técnicos para poder documentar todo correctamente más adelante, pensando en la carpeta de campo y en cómo explicarlo si algún profe me lo pregunta.

<h2>Miércoles 2/07/2025</h2>
Lautaro Santolucito:
Durante la madrugada y la mañana, me dediqué a avanzar con el backend del proyecto SICAP. El objetivo principal fue armar un servidor interno que nos permita recibir, almacenar y luego consultar los datos que va a enviar el ESP32 cuando detecte un tag RFID.

Primero creé un nuevo proyecto en Django llamado sicap_backend, y dentro de él una app específica llamada registros. Ahí definí un modelo (RegistroTag) para guardar cada tag leído junto con la fecha y hora en que fue recibido.

Después armé un endpoint en la ruta /api/recibir/ que permite recibir los datos en formato JSON (por ejemplo: {"tag": "A1B2C3D4"}). Hice varias pruebas mandando datos desde la terminal y logré verificar que todo se guarda correctamente en la base de datos. También accedí al panel de administración de Django para confirmar que los registros se almacenan bien.

Por otro lado, revisé el código que están usando mis compañeros para leer los tags desde la ESP32 y lo guardé para después integrarlo con el servidor. Además, preparé un archivo wifi.py con los datos de conexión para que el microcontrolador se conecte automáticamente a la red cuando esté listo.

Finalmente, estuve pensando en cómo vamos a mostrar todo esto en la feria. Se me ocurrió que podríamos usar una Raspberry Pi o una computadora vieja como servidor local, para no depender del WiFi del colegio, que suele ser inestable. También pensé en llevar nuestro propio router, así tenemos una red cerrada dedicada al proyecto y sin interferencias.

Cabe aclarar que esta última parte es una idea personal que todavía no hablé con el resto del grupo.