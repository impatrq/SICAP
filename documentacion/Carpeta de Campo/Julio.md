<h2>Martes 1/07/2025</h2> 

**Lautaro Santolucito:**

Durante la jornada de hoy continué con el trabajo en el servidor del sistema SICAP. Luego de haber configurado la base del backend, me enfoqué en probar si el servidor era capaz de recibir correctamente los datos enviados en formato JSON desde un dispositivo. Para eso levanté el servidor local usando Django y utilicé herramientas como Postman y curl para simular envíos de información, validando que llegaran al endpoint `/api/recibir/`.

Las pruebas fueron exitosas, el servidor recibió los datos y los procesó como estaba previsto. Esto me permitió confirmar que la estructura básica del backend ya está funcional. Dejé todo listo para que en los próximos días se pueda avanzar con la integración del ESP32 real, que es el dispositivo que va a mandar los datos de los tags RFID.

Además, comencé a tomar nota de los pasos técnicos para poder documentar todo correctamente más adelante, pensando en la carpeta de campo y en cómo explicarlo si algún profe me lo pregunta.

<h2>Miércoles 2/07/2025</h2>

Lautaro Santolucito:
Durante la madrugada y la mañana me dediqué a avanzar con el backend del proyecto SICAP. El objetivo principal fue armar un servidor interno que permita recibir, almacenar y luego consultar los datos que enviará el ESP32 al detectar un tag RFID.

Primero creé un nuevo proyecto en Django llamado sicap_backend, con una app específica llamada registros. Allí definí un modelo (RegistroTag) para guardar cada tag leído junto con la fecha y hora en que fue recibido. Luego armé un endpoint REST en la ruta /api/recibir/ que permite recibir datos en formato JSON (por ejemplo: {"tag": "A1B2C3D4"}).

Realicé pruebas exitosas enviando datos desde la terminal y verifiqué que los registros se almacenan correctamente en la base de datos. También confirmé su correcto guardado accediendo al panel de administración de Django.

Más tarde, en la escuela, trabajamos en el ESP32 con el lector RFID. Se cargaron los archivos main.py y wifi.py, y se conectó el dispositivo a la red "Cooperadora Alumnos". Luego:

Verifique que el lector detecta los tags correctamente.

Se imprimen en consola los códigos leídos.

Los datos se envían al servidor Django.

Se ajustó el parámetro ALLOWED_HOSTS para aceptar la IP del ESP.

Se confirmaron múltiples respuestas 200 OK desde el servidor, demostrando que el sistema ya está funcionando de punta a punta.

También creé una lógica de lectura mejorada con control de repeticiones y TIMEOUT, para evitar enviar el mismo tag muchas veces seguidas.

Finalmente, estuve pensando en cómo mostrar todo esto en la feria. Se me ocurrió usar una Raspberry Pi o una notebook vieja como servidor local, sin depender del WiFi del colegio (que suele fallar). Incluso consideré llevar un router propio, para tener una red cerrada exclusiva del proyecto y sin interferencias.

Facu Ledesma:

Hoy estuve trabajando en dos publicaciones importantes para SICAP, por un lado anuncié con mucha alegría que ya tenemos nuestra página web oficial, un gran paso para seguir creciendo y mostrando todo lo que venimos haciendo, y por otro lado compartí un agradecimiento especial a LedMull por habernos regalado las camperas que ahora nos identifican como equipo, muy contento por todo lo que estamos construyendo.

Facu Spagnoletta:

Mañana:
La jornada comenzó con una fase de formación enfocada en el desarrollo del frontend de la aplicación web del proyecto. Se inició un curso de JavaScript para adquirir los conocimientos fundamentales necesarios para la implementación de interfaces interactivas y dinámicas en la plataforma de monitoreo de S.I.C.A.P. El objetivo de esta capacitación es asegurar una base sólida para el desarrollo de la experiencia de usuario. También asistimos a una Reunión en el entrepiso sobre el curso de inscripción a la Fuerza Aérea.

Durante la tarde, se finalizó la etapa de desarrollo local del script principal en Python. Con el código ya funcional, el enfoque se trasladó a la siguiente fase: la integración con el servidor. Se iniciaron las primeras pruebas conceptuales para investigar y definir la metodología de conexión y el protocolo para la transmisión de datos desde el script del lector RFID hacia el backend.

Paralelamente, se completó el curso básico de JavaScript con una duración total de 6 horas en videos sumado a prácticas en simultaneo que fui haciendo y se reforzaron los conocimientos adquiridos mediante la realización de ejercicios prácticos en la plataforma SoloLearn.



