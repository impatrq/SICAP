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

 Facu Ledesma:

 Hoy volví a editar el banner, esta vez siguiendo todas las indicaciones que me pasó Tobi Pagano. Me puse a revisar punto por punto lo que me marcó y la verdad es que le cambió bastante la onda. Ajusté colores, acomodé un par de detalles que no estaban tan finos y le di una repasada general para que quedara más limpio.

Facu Spagno:

Me dediqué a resolver problemas de configuración en la Raspberry Pi. Principalmente trabajé en la instalación de GitHub CLI y en la puesta en marcha del servidor local, ya que presentaba inconvenientes al intentar ejecutarlo. El objetivo fue dejar operativo el entorno de desarrollo para continuar con la integración del sistema.

<h2>Jueves 18/09/2025</h2>

Patella Tiziano:

El día de hoy me puse a preparar la interfaz visual de la web-app para cuando ya tengamos en funcinamiento el detector de tags con su respectivo codigo con el servidor. Lo que cambié fue la manera en la que se veían las opciones del menu, en nuestra vesión anterior todas las opciones la cuales iba a poder elegir el usuario se mostraban como menus desplegables (lo cual hacia incomodo la vista debido a la gran cantidad de opciones). Debido a eso opté por cambiarlos por botones y agregar la funcion de que al seleccionar cualquier opcion se libere toda la pantalla del menu y despliegue el resto de opciones hacia un costado, simulando la interfaz visual que queremos tener en la version final de la app.

<h2>Viernes 19/09/2025</h2>

Santolucito Lautaro:

El día de hoy, junto con todos los chicos probamos el funcionamiento de los distintos componentes del sistema, incluyendo el servidor al momento de registrar las etiquetas. Todas las pruebas resultaron satisfactorias y el sistema funcionó correctamente.  

Detectamos un único inconveniente en el lector: al inicio presentaba fallas que, tras nuestro análisis, concluimos que se debían a la temperatura interna del dispositivo en su primer arranque. Esta, sumada a la carga de los componentes necesarios para su correcto funcionamiento, ocasionaba un arranque defectuoso que luego se normalizaba al cabo de unos minutos.  

Pasado el mediodía, con Pablo comenzamos la elaboración de la carpeta técnica del proyecto, tarea en la que trabajamos durante toda la tarde. En paralelo, coordinamos con Facu Ledesma el diseño de las carátulas y hojas correspondientes, avanzando de manera conjunta en la documentación y presentación formal del proyecto.  

Facu Spagno:

En el día de la fecha pudimos lograr el primer prototipo de S.I.C.A.P confirmando toda la comunicación entre el sistema con nuestra aplicación, Lo que aporte yo en el día para que pueda funcionar fue que me puse a reeparar la comunicacióon y el endpoint de las rutas, que eran lo que nos estaba dando los principales problemas, los arreglé, le di unos retoques a la raspberry con algunos errores al levantar el servidor, creé un entorno virtual y a la hora de llegar a la pruebay deducir si funcionaba, comprobamos que ya funcionaba.

Patella Tiziano:

El día de hoy nos pusimos a trabajar con las ultimas pruebas de la conexion del servidor (BACKEND) con la web-app (FRONTEND). Al momento de comenzar a trabajar nos tomamos con un problema que ya veniamos teniendo desde ya hace unos cuantos meses y nunca nos habiamos parado a solucionarlo, al momento de conectar los lectores no salta una luz roja la cual nos anuniaba que el aparato no funcionaba como deberia, usualmente lo solucionabamos desconectandolo y volviendolo a conectar pero esta bien al intentarlo no funciono por lo que optamos por ver cual podia llegar a ser el problema. Tras haber sido solucionado el problema por parte de mis compañeros, conectamos todo con Facu Spagno y nos pusimos a trabajar en los ultimos detaller que nos quedaban para el funcionamiento total de la app. Tras un par de horas de indagar en detalles los cuales no faltaban por pulir logramos conectar de forma exitosa el servidor y la aplicacion, cumpliendo la mision del proyecto y habiendo armado un prototipo muy provisorio. 

<video controls src="Video de WhatsApp 2025-09-22 a las 13.38.11_5c685a5c.mp4" title="Title"></video>

<h2>Lunes 22/09/2025</h2>  
**Santolucito Lautaro:**  
Durante la mañana, aunque debía ingresar más tarde, asistí en el horario habitual para aprovechar el tiempo revisando las carpetas del proyecto. En este espacio individual, avancé en la lectura y organización de los documentos ya elaborados, evaluando posibles ajustes y mejoras.

Por la tarde, retomamos el trabajo grupal, aunque en un ritmo más relajado debido a que era lunes. Si bien la jornada no resultó del todo productiva en términos de avances concretos, se mantuvo el compromiso con el proyecto y se sostuvo la continuidad de la tarea.

<h2>Martes 23/09/2025</h2>  
**Santolucito Lautaro:**  

En esta jornada me dediqué principalmente a realizar correcciones sobre la carpeta técnica del proyecto, ajustando apartados que necesitaban mayor claridad y precisión.

A su vez, identifiqué que el contenido originalmente destinado a la sección “Instalaciones” debía reubicarse, correspondiendo en realidad a un futuro manual de usuario. Esta observación permitió ordenar mejor la estructura de la documentación y definir qué elementos se desarrollarán en cada apartado.

Facu Spagno:

Durante la jornada me enfoqué en perfeccionar la interfaz visual de la Web-App, mejorando la organización general de los elementos y puliendo detalles de diseño para lograr una apariencia más profesional y consistente.

Se aplicaron ajustes en la distribución, tipografía y fondos, tomando como base el trabajo previo de rediseño del Home y los aportes gráficos ya integrados. Con estas mejoras, la interfaz quedó en mejores condiciones, facilitando la usabilidad, la navegación y la proyección de futuras funciones dentro del sistema.

<h2>Miércoles 24/09/2025</h2>  
**Santolucito Lautaro:**  

Comencé a planificar la elaboración de un manual de usuario, complementario a la carpeta técnica, con el objetivo de detallar el uso práctico del sistema SICAP de manera clara y accesible.

Además, evalué la posibilidad de trabajar con LaTeX para dar un formato más profesional y organizado tanto a la documentación técnica como al manual. Este análisis abre la puerta a optimizar la presentación final del proyecto, garantizando prolijidad y consistencia en todos los documentos entregables.