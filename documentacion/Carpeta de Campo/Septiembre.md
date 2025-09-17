<h2> Martes 09/09/2025 </h2>

Del 27/08 a principios de Septiembre

Junto con Titi nos enfocamos en la comunicación entre el servidor en la Raspberry Pi y las antenas UHF, con el objetivo de recibir correctamente los tags RFID y asegurar la integración con la Web-App. Esta etapa es fundamental, ya que el flujo de datos provenientes del lector es la base para que la aplicación pueda procesar y actuar en tiempo real.

Durante este período surgieron algunos inconvenientes técnicos, entre ellos la falla del módulo WiFi del ESP32, lo que nos obligó a reemplazarlo por un nuevo dispositivo para poder continuar con las pruebas.

A pesar de estas dificultades, seguimos trabajando en la configuración y depuración del sistema de comunicación, ya que constituye un paso esencial para avanzar con el desarrollo completo de la plataforma.

<h2> Miercoles 10/09/2025 </h2>
 
 Facundo Ledesma:
 Hoy arranqué con la creación de las pulseras para SICAP, usando AutoCAD. Estas pulseras van a estar pensadas para el registro de personas dentro del sistema, así que estuve trabajando en las primeras medidas y el diseño inicial.

<h2>Lunes 15/09/2025</h2>

Patella Tiziano: El día de hoy, le pedimos ayuda a fabri ya que tras haber arreglado todos los problemas que estabamos teniendo con la raspberry para poder ver internamente el funcionamiento del servidor desde el ssh, resulto que de acuerdo con nuestras sospechas, el servidor funciona correctamente pero a pesar de eso no detectaba los tags que se ingresaban. Tras haber estado revisando con detalle los archivos internos de la raspberry fabri nos dijo que el problema que podia llegar a estar causando era que nos faltaba un SQL (una base de datos en donde se almacenaran todos los datos que se ingresaban), sin embargo nos pusimos a revisar con Facu Spagno y nos percatamos de que ya teniamos una base de datos la cual era la que se creaba por defecto con el Django. Fabri nos dijo que entonces lo que nos faltba era un Modelo para el SQL y configurar bien su funcionamiento para definir de manera correcta cual era su funcion y que tipo de datos tenía que guardar y donde tenía que almacenarlos. Revisamos que era lo que teniamos que hacer y notamos que lauty ya se habia encargado de crear ese modelo por lo que quedamos en la incognita de que cual era el causante de nuestro problema.  

Facu Spagno:

Revisamos la tabla de SQL creada en DJANGO y demas para seguir buscando el problema que nos pasaba.


 <h2>Martes 16/09/2025</h2>

 Facu Spagno:

 Colaboré con titi y Fabri para resolver el problema del backend. Corregimos también unas ruutas y otros errores.

 Patella Tiziano:

 El día de hoy Facu Spagno y yo nos sentamos con fabri a arreglar el problema de que a pesar de que el codigo del ESP funcione correctamente y que el servidor se levante con exito, al pasar los tags por las antenas, estos no se enviaban de manera correcta al servidor. Ante ese problema, nos pusimos toda la tarde a rebicar cual podría llegar a ser el causate de este mal funcionamiento del codigo. Lo que procedimos a hacer fue meternos internamente en el router en donde estaba ubicado el servidor lo que nos permitio percatarnos de que el ESP32 no estaba ingresando a la red de SICAP. Eso nos dio una guía de que el verdado problema podía llegar a ser uno de rutas, el modelo del sql y los permisos a los dispositivos que podian y no podian ingresar a la red. Tras probar con diferentes rutas, logramos que al pasar los tags estos se pudiesen detectar y quedar guardados en el servidor. Sin embargo para el momento en el que hicimos funcionar todo ya era hora de irnos por lo que no pudimos guardar ninguno de los cambios. Todas las configuraciones nuevas las trabajamos directo desde la raspberry, asi que lo unico que nos falta es crear un token desde github para poder hacer un pull desde la raspberry y guardar los nuevos cambios que permiten el funcionamieto correcto del server.