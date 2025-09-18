<h2>Martes 02/09/2025</h2>

Patella Tiziano: 

El día de hoy teniamos planeado ponernos a trabajar con el codigo del ESP que dejo de funcionar en los ultimos días. Nuestro plan era encontrar el error en el codigo para poder probar el envio de las tags al servidor. Sin embargo, mientras trabajamos nos percatamos de que al ejecutar el codigo, en lugar de tirarnos un error sobre el codigo como hacia siempre, la terminal de thonny se colapsaba tirandonos un monton de datos que no sabiamos de donde venian. Ante este nuevo error el cual no sabiamos porque podia estar sucediendo decidimos ir con fabri para comentarle nuestra situacion y ver si el podia llegar a tener una idea de que podia llegar a estar pasando. Sin embargo, a pesar de haber de arrglado el codigo de thonny que fue el causante de nuestros problemas desde un principio, el error de que se colapsara la terminal continuo, por lo que no tuvimos respuestas claras de que era lo que estaba fallando y como podiamos solucionarlo.

<h2>Miercoles 3/09/2025</h2>

Patella Tiziano:

El día de hoy comenzamos temprano para así aprovechar a mayor cantidad de tiempo y poder encontrar el error que estaba causando que nuesto codigo del ESP32 no funcionace. Lo primero que comenenzamos por hacer fue probar el ESP32 con el codigo viejo que tenía para ver si con las instruccionas mas basicas posbiles se seguía presentando el mismo error. Tras probrablo y ver que el problema seguía se comprobo definitivamente que era un problema del ESP32 y no del codigo. Tras eso decidmos llevarle nuestro problema al profe Medina diciendole que nuestro problema se residia en nuestro ESP y no en nuestro codigo. Tras revisarlo, Medina tampoco puedo encontrar una pista concreta de que podia estar causando el mal funcionamiento del ESP. Su hipotesis fue que posiblemente se pudo haber descompuesto el modulo wifi del ESP por lo que teniamos que conseguir un ESP32 nuevo. Ese mismo día decidimos ir a compar el nuevo componente a la salida de la escuela para poder seguir trabajando lo antes posible. 

![alt text](<Imagen de WhatsApp 2025-09-05 a las 11.13.44_b2337438.jpg>)

<h2>Jueves 4/09/2025</h2>

Patella Tiziano:

El día de hoy nos propusimos a hacer funcionar el codigo de thonny junto al nuevo ESP32 que habiamos comprado. Tras probar un codigo bien basico y comprobar que este nuevo ESP si funcionaba nos pusimos a trabajar con el codigo para poder definir cual es el codigo que debemos usar para los tags(esto debido a que continuamente estabamos cambiando el codigo y ya no sabiamos cual fue el codigo original que funciono en primer lugar). Así que una vez que conseguimos el codigo definitivo lo subimos al github para tenerlo guardado y dejar de equivocarnos. A la par, decidimos probar el nuevo codigo y las antenas junto al nuevo cable que nos hizo pablo para las antenas y verificar que todo funcionace con exito en conjunto lo que por suerte fue lo que obtuvimos.  

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

 <h2>Miercoles 17/09/2025</h2>

 Patella Tiziano:

 El día de hoy no asistí a las practicas de la UTN debído al paro de las facultados publicas por lo que fuí directamente a la escuela por las practicas profecionalizantes. Durante la mañana de hoy acomode y reorganize las tareas del Trello ya que Medina me dijo que debiamos mejorarlo y prestarle mas ateción. Lo que hice fue organizar las tareas de acuerdo a la importancia que tienen para lo ONIET, poniendoles fecha de vencimiento para de esta manera aumentar el tiempo de trabajo y la practicidad. Luego de eso, me encargue de arreglar el problema que tenia la pagina web en el que aparecía como un sitio no seguro, esto se debía a que la pagina no tenia certificación HTTPS, por lo que tuve que pedir la renovación desde GITHUB PAGES. Por ultimo me encargué de completar la carpeta de campo con las tareas que venía haciendo en las ultimas semanas, las cuales no había anotado en su momento. 