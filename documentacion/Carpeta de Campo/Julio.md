## Martes 1/07/2025  
**Lautaro Santolucito:**

Durante la jornada de hoy continué con el trabajo en el servidor del sistema SICAP. Luego de haber configurado la base del backend, me enfoqué en probar si el servidor era capaz de recibir correctamente los datos enviados en formato JSON desde un dispositivo. Para eso levanté el servidor local usando Django y utilicé herramientas como Postman y curl para simular envíos de información, validando que llegaran al endpoint `/api/recibir/`.

Las pruebas fueron exitosas, el servidor recibió los datos y los procesó como estaba previsto. Esto me permitió confirmar que la estructura básica del backend ya está funcional. Dejé todo listo para que en los próximos días se pueda avanzar con la integración del ESP32 real, que es el dispositivo que va a mandar los datos de los tags RFID.

Además, comencé a tomar nota de los pasos técnicos para poder documentar todo correctamente más adelante, pensando en la carpeta de campo y en cómo explicarlo si algún profe me lo pregunta.
