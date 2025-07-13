<h2>Martes 1/07/2025</h2> 

**Lautaro Santolucito:**

Durante la jornada de hoy continué con el trabajo en el servidor del sistema SICAP. Luego de haber configurado la base del backend, me enfoqué en probar si el servidor era capaz de recibir correctamente los datos enviados en formato JSON desde un dispositivo. Para eso levanté el servidor local usando Django y utilicé herramientas como Postman y curl para simular envíos de información, validando que llegaran al endpoint `/api/recibir/`.

Las pruebas fueron exitosas, el servidor recibió los datos y los procesó como estaba previsto. Esto me permitió confirmar que la estructura básica del backend ya está funcional. Dejé todo listo para que en los próximos días se pueda avanzar con la integración del ESP32 real, que es el dispositivo que va a mandar los datos de los tags RFID.

Además, comencé a tomar nota de los pasos técnicos para poder documentar todo correctamente más adelante, pensando en la carpeta de campo y en cómo explicarlo si algún profe me lo pregunta.

Patella Tiziano: 

El día de hoy le fuí a presentar al profe Medina lo que había investigado ayer acerca del desarrollo de la app y sobre la aplicacion que supuestamente me podia hacer el trabajo sin necesidad de codigo, sin embargo el me dijo que no me servian para lo que necesitabamos por varias razones y que ese tipo de programanas se suelen usar para hacer "maquetados" de las aplicaciones. Como alternativa me explico como era la forma correcta de trabajar para hacer la app y que debía hacer ( usar frameworks). Tras haberme explicado todos los tipos de frameworks que existian y que hacian cada uno llegamos a la conclusion de que el que nos iba a servir a nuestro grupo era "IONIC", así que procedí a instalar node.js y cofigurar IONIC para comenzar con el desarrollo cuanto antes. Tras unas complicaciones logré ejecutar de forma exitosa la apicacion y editarla para poder darle el aspecto que yo quería.

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


**Patella Tiziano:**

El día de hoy me encargué de trabajar con la primera parte de la web app con la que los usuarios tendran que intecartuar al inicar, el inicio de sesión. Lo primero que tuve que hacer fue crear una nueva ruta en la app la cual llamé "login" e iba a coresponder justamente al inicio de sesión de los usuarios. 

Tras consultar con el profe Medina que era lo que tenía que considerar antes de ponerme a trabajar, llegamos a la conclusión de que en lugar de enfocarme en la estetica de como iba a tener que verse el login (frontend), tenía que enfocarme y trabajar en la parte mas complicada, la cual era el servidor que iba a almacenar los datos de todos los usarios que se regisrtaban(backend). Tras investigar en internet sobre como era el procedimineto para trabajar encontré un video que me explicaba paso por paso cuales eran las cosas que tenía que hacer.

 Lo primero fue habilitar el phyton e instalar django en vscode ( django es el lugar donde iba a crear el servidor que almacenara todos los datos de usuario). Sin embargo al momento de querer utilizar el django previo a su descarga me salto un <span style="color: red;">error</span> el cual me indicaba que no se podía utilizar django debido a que no estaba en mi entorno "PATH", lo cual termine solucionando al incluir la ruta en los ajustes avanzados de mi computadora. Sin embargo, previo a ese problema se me presento otra situacion la cual no supe como resolver. Este mismo día, mi compañero Lautaro se encargo de crear un servidor Django en su computadora para poder almacenar los datos de todos los tags RFID que detectaban las antenas, el problema era que nuestra idea es trabajar con todos los datos en un mismo servidor y los pasos que estaba siguiendo yo en el video me hacían crear un servidor nuevo, de hacerlo iba a generar un problema de servidores ya que ibamos a tener 2 diferentes para almacenar diferentes cosas cuando realmente solo necesitamos uno. A todo esto, el profe Medina ya se había ido de la escuela lo que significo en que no tenga nadie a quien poder consultarle por ayuda y que me trabe en ese problema de no usar el servidor de mi compañero. 




<h2>Lunes 7/07/2025</h2>

Facu Ledesma:

Me dediqué a trabajar en el armado de la presentación oficial del proyecto SICAP. Fue una jornada bastante productiva en la que pude ordenar las ideas, definir los ejes principales y pensar en cómo transmitir de la mejor manera todo lo que venimos construyendo con este proyecto. La presentación busca ser clara, visual y didáctica, para que cualquier persona que la vea pueda entender de qué se trata SICAP, cuáles son nuestros objetivos, los avances que logramos hasta el momento y hacia dónde queremos seguir creciendo. Me concentré en organizar los contenidos en secciones que tengan coherencia entre sí, incluyendo tanto la parte técnica como la parte humana del proyecto, ya que para nosotros es fundamental mostrar el trabajo en equipo, el compromiso y la innovación que nos caracterizan. También estuve seleccionando recursos visuales, gráficos e imágenes que acompañen cada sección y ayuden a reforzar el mensaje. Además, colaboré en el desarrollo de la animación para el intro de la web app, buscando que tenga un diseño atractivo, moderno y representativo de nuestra identidad visual. En los próximos días seguiré puliendo detalles para que la presentación y la animación queden lo más completas y profesionales posible, y así poder mostrar todo el laburo que venimos haciendo con tanto esfuerzo.