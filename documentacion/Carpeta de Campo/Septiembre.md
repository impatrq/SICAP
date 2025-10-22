<h2>Martes 02/09/2025</h2>

Patella Tiziano: 

El día de hoy teniamos planeado ponernos a trabajar con el codigo del ESP que dejo de funcionar en los ultimos días. Nuestro plan era encontrar el error en el codigo para poder probar el envio de las tags al servidor. Sin embargo, mientras trabajamos nos percatamos de que al ejecutar el codigo, en lugar de tirarnos un error sobre el codigo como hacia siempre, la terminal de thonny se colapsaba tirandonos un monton de datos que no sabiamos de donde venian. Ante este nuevo error el cual no sabiamos porque podia estar sucediendo decidimos ir con fabri para comentarle nuestra situacion y ver si el podia llegar a tener una idea de que podia llegar a estar pasando. Sin embargo, a pesar de haber de arrglado el codigo de thonny que fue el causante de nuestros problemas desde un principio, el error de que se colapsara la terminal continuo, por lo que no tuvimos respuestas claras de que era lo que estaba fallando y como podiamos solucionarlo.

<h2>Miercoles 3/09/2025</h2>

Patella Tiziano:

El día de hoy comenzamos temprano para así aprovechar a mayor cantidad de tiempo y poder encontrar el error que estaba causando que nuesto codigo del ESP32 no funcionace. Lo primero que comenenzamos por hacer fue probar el ESP32 con el codigo viejo que tenía para ver si con las instruccionas mas basicas posbiles se seguía presentando el mismo error. Tras probrablo y ver que el problema seguía se comprobo definitivamente que era un problema del ESP32 y no del codigo. Tras eso decidmos llevarle nuestro problema al profe Medina diciendole que nuestro problema se residia en nuestro ESP y no en nuestro codigo. Tras revisarlo, Medina tampoco puedo encontrar una pista concreta de que podia estar causando el mal funcionamiento del ESP. Su hipotesis fue que posiblemente se pudo haber descompuesto el modulo wifi del ESP por lo que teniamos que conseguir un ESP32 nuevo. Ese mismo día decidimos ir a compar el nuevo componente a la salida de la escuela para poder seguir trabajando lo antes posible. 

![alt text](<Imagen de WhatsApp 2025-09-05 a las 11.13.44_b2337438.jpg>)


Pablo Osores: 

Diseñé las primeras partes del soporte para antenas en SolidWorks. La idea de este soporte es que una vez instalada la antena con aflojar un tornillo se pueda regular 180º en el eje vertical, por eso decidí usar un soporte tipo "gopro". Intenté diseñarlo de tal forma que pueda sostener el peso de dos antenas para poder tener un margen apropiado en cuanto a la resistencia mecánica, ademas de esto intente que estéticamente quede prolijo, motivo por el cual tome la desicion de poner los alojamientos para que las dos tuercas y los tornillos queden al ras de la impresión.


<p align="center">
  <img src="https://github.com/user-attachments/assets/9182ecc4-c61f-4736-a851-d73588a5f35f" width="200"/>
  <img src="https://github.com/user-attachments/assets/31ec92f2-8a75-473a-bf31-a328201a1fa4" width="200"/>
  <img src="https://github.com/user-attachments/assets/3ed087a2-8bd7-484e-982e-d887aa2ff05a" width="200"/>
</p>


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

Pablo Osores: 

Imprimí las dos partes del soporte en PLA y vi 2 errores claves para poder mejorar el diseño y poder tener una versión definitiva. El primer error fué que a la hora de ingresar las medidas puse directamente los 24 mm del perfil de aluminio del portal, entonces el soporte hacia tope con el mismo y no apretaba el perfil haciendo que el soporte "baile" y no quede fijo (para probar si el resto del prototipo era funcional rebajé unos milimetros con la piedra para eliminar el material sobrante que impedía el ajuste). El otro error es que no me dí cuenta de que la "tapa" del soporte(pieza donde van las tuercas) estaba diseñado de tal forma que en vez de poder regular de forma vertical se podia regular de forma horizontal.

<p align="center">
  <img src="https://github.com/user-attachments/assets/8bdf5eb6-816f-4f3b-a262-90c7659833c3" width="200"/>
  <img src="https://github.com/user-attachments/assets/0ba23e8c-20a8-46bc-9689-cac4d892cebb" width="200"/>
  <img src="https://github.com/user-attachments/assets/05fb4274-482b-49e7-b29f-272f770920ef" width="200"/>
</p>


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

Patella Tiziano:

El día comence con el proceso de mejora de la pagina web para la ONIET. Mi idea era mejorar la pagina para hacerla mucho mas dinamica y fluida por lo que comence por impementar animaciones. Lo priemro fue conectar la libre de animejs la cual es una pagina de donde queria sacar todas las animaciones con nuestra pagina web, hacer esa conexion tomo un rato pero al final pude hacerlo. Tras haberlos conectado comence haciendo pruebas para entender como es que funcionaban estas nuevas animaciones implementandoles en cosas pequeñas que no afecten tanto a la pagina(titulo principal y subtitulo).

Pablo Osores:

Ese dia seguí trabajando con el portal, una de las cosas que me interesaba mucho era poder hacer algo que para una exposicion sea práctico y estéticamente llamativo, por lo que para poner la lectora, el esp32 y la placa conversora decidí reutilizar una parte de la estructura con la cual arme el portal. Para esto tuve que cortarla a la medida que necesitba y que la chapa quede integrada con la estructura, ademas al tener bisagras va a ser una pieza móvil la cual se puede abrir para que las personas vean una parte de la electrónica que compone al proyecto.

<p align="center">
  <img src="https://github.com/user-attachments/assets/2b2b1d3d-e4df-409c-8e64-de3e90d0e978" width="200"/>
  <img src="https://github.com/user-attachments/assets/37a53093-a126-409c-ac90-dc56df7d9ee4" width="200"/>
  <br/>
  <img src="https://github.com/user-attachments/assets/d1ed4650-a1a9-4242-9e36-8d44a7422b9c" width="400"/>
</p>


<h2>Miércoles 24/09/2025</h2>  
**Santolucito Lautaro:**  

Comencé a planificar la elaboración de un manual de usuario, complementario a la carpeta técnica, con el objetivo de detallar el uso práctico del sistema SICAP de manera clara y accesible.

Además, evalué la posibilidad de trabajar con LaTeX para dar un formato más profesional y organizado tanto a la documentación técnica como al manual. Este análisis abre la puerta a optimizar la presentación final del proyecto, garantizando prolijidad y consistencia en todos los documentos entregables.

Facu Spagno:

Me dediqué al desarrollo del módulo de Menú. En esta etapa implementé un modelo para Pañol, con el objetivo de permitir la creación de pañoles independientes, cada uno con su propio Home, evitando depender de un único entorno centralizado.

Para lograrlo, integré tecnología CSRF mediante cookies y configuré nuevas rutas en Django.
Este esquema con DefaultRouter permitió manejar las solicitudes al backend de manera más estructurada, generando endpoints dinámicos para los pañoles.
En paralelo, adapté el frontend en TypeScript, incorporando modales necesarios para la creación de los pañoles. Sin embargo, en esta instancia no logré que funcionara correctamente.

Patella Tiziano:

El día de hoy tenia planeado seguir trabajando con la pagina web pero surgio un inconveniente que provoco que tengamos que hacer un cambio de prioridades urgente. La situacion fue que los profes a cargo de nuestros proyectos nos llamaron para informarnos de una situacion que habia con la competencia ZIZAP de la ONIET. La sitauacion era que para la competencia de ZIZAP solo se podian inscribir 2 proyectos por escuela y en el IMPA habia 3 proyectos que se querian inscribir por lo que unos de los proyectos no iba a poder participar. Nos dijeron que el Viernes iban a hacer una evaluacion de las 3 aplicaciones y que dependiendo de que tan avanzadas esten iban a seleccionar cuales iban a participar y cual no. Ante esta nueva cuenta regresiva nos dividimos las tareas de la app con Facu S y nos pusimos a adelantar la mayor cantidad de cosas en el menor tiempo posible. Lo primero en lo que comence a trabajar fue en armar la interfaz visual en donde se iban a mostrar que herramientas estaban dentro y fuera del pañol. Una vez que finalice la interfaz visual( una no muy compleja que cumplía su funcion y que iba a ser mejorada previo a nuestra aprobacion en ZIZAP) me puse a trabajar en mejorar la navegacion dentro de la app. Antes todos los botones que teniamos nos enviaban a la interfaz visual ya que no habiamos definido una zona de trabajo para cada una de las opciones, por lo que puse a trabajar en definir cada zona para poder trabajar despues en  detalle en cada una de ellas.

<h2>Jueves 25/09/2025</h2>

Lautaro Santolucito:

El día de hoy me puse a trabajar con la Raspberry Pi, donde encontré un problema: al acceder desde el puerto 8000 solamente se mostraba el HTML pelado de la página administrativa, sin los estilos ni el funcionamiento esperado. Como no pude terminar de resolver este inconveniente en el momento, decidí avanzar con otra parte del proyecto para aprovechar el tiempo.

Me enfoqué entonces en el ESP32, revisando y modificando el código cargado en el microcontrolador para mejorar la calidad de lectura y optimizar el envío de información hacia el servidor. Estos ajustes permitieron que el dispositivo registrara con mayor precisión los tags y transmitiera los datos de forma más estable.

El trabajo en la Raspberry quedó pendiente de revisión, mientras que en el ESP32 se lograron avances importantes en el rendimiento general del sistema.

Patella Tiziano:

El día de hoy comenzamos bien temprano a trabajar para aprovechar el maximo tiempo posible en trabajar en la app previo a la examinacion que nos iban a hacer los profes el día de mañana. Lo primero  que comence a hacer fue permitir que se pueda navegar dentro de la toolbar lo cual me habia quedado pendiente de ayer. Previo a eso me encargue de armar la interfaz de Control de Stock/Inventario, en esta interfaz se tenian que ver todos los tags que eran detectados en la interfaz visual del pañol y acomodarse en una lista para poder ver todos los materiales de los que dispone el usuario. Una vez armada la zona de stock me propuse en trabajar en una de las funciones mas importantes de la app la cual era la opcion de poder editar los datos de los tags de manera personalizada. Para mi sorpresa, resulto ser una tarea mucho mas complicada de lo que imaginaba ya que ademas de agregar un boton para editar el tag tenia  que enviar la nueva informacion del tag al servidor backend para que sobresciba la info del tag y para que cada vez que lo detecte lo haga con los datos que yo lo encargue. Esa parte resulto ser la mas dificil por lo que le dediqué la tarde completa. A pesar de todo no logre hacer que funcionase la respuesta del backend por lo que quedó como una tarea que iba a terminar el viernes. Ademas de eso implemente unas cuntas animaciones dentro de la app para hacerla mucho mas dinamica. 

Facu Spagno:

Continué trabajando en el Menú, ajustando las rutas en el backend y probando diferentes variantes de implementación. Logré generar un primer prototipo del Menú que integraba la validación CSRF, aunque no funcionó como esperaba.

Realicé iteraciones con distintos estilos de Menú y, tras varios intentos, seleccioné el tercer diseño, por ser el más claro y adaptable a las necesidades del sistema.

<h2>Viernes 26/09/2025 </h2>

Facu Spagno:

En esta jornada me enfoqué en la configuración horaria del servidor. Detecté que los registros de tags se almacenaban con horarios incorrectos, debido a que la Raspberry Pi estaba configurada con zona horaria de Inglaterra.

Ajusté la configuración para establecer la zona horaria de Argentina (GMT-3), lo que permitió que los datos se registraran con la hora local correcta.
Con este cambio, y junto a las mejoras previas, el Menú quedó funcional, integrando tanto la gestión de pañoles como la correcta sincronización horaria del sistema.

Tiziano Patella:

El día de hoy era la presentacion de la web-app para ver si eramos selecionados para la competencia de SISAP por lo que me debía asegurar de conretar la mayor cantidad de cosas para que quede presentable. Lo primero con lo que comence a trabajar fue en diseñar la logica para la edicion de los nombres de los tags, esto funcionaba modificando la categoria de tag de cada una de las etiquetas(nombre "fisico" del tag). Sin embargo al realizar las pruebas esto no funciono por lo que en lugar de seguir invirtiendo tiempo preferí modificar la estetica de la app para que a los profes les guste mas. Cree la intefaz de Empleados(la cual muestra lo mismo que la de Invertario por el momento) e hice modificaciones esteticas. Tras ser llamados para la evaluacion terminamos siendo de los equipos seleccionados para participar en la competencia. 

<h2>Lunes 29/09/2025 </h2>

Lautaro Santolucito:
Hoy me dediqué junto con Pablo a tomar medidas precisas para el diseño del portal web del proyecto. Además, realicé pruebas prácticas con la pistola RFID que nos facilitó Checkpoint: comprobé la detección de etiquetas a distintas distancias y angulaciones, registré los valores de señal (RSSI) y anoté las condiciones en las que la lectura era más estable. Coordiné con Facu S. y Titi para ver de desarrollar la idea en un futuro.

Facu Spagno:

Me dediqué a perfeccionar la tarjeta de creación de Pañol dentro del Menú. Corrigí diversos errores y optimicé su diseño visual, logrando una versión más estable, clara y profesional.
Con este avance, la funcionalidad de creación de pañoles quedó en condiciones óptimas para su uso dentro de la Web-App.

Pablo Osores:

Arreglé los errores del soporte para las antenas.

<h2>Martes 30/09/2025 </h2>

Facu Spagno:

Durante la jornada me enfoqué en dos aspectos centrales del proyecto. Por un lado, trabajé sobre la interfaz visual de la Web-App, incorporando un fondo animado diseñado por Facu Ledesma en el Home, con el objetivo de darle una estética más profesional y personalizada.

Por otro lado, avancé en la puesta en marcha automática del servidor en la Raspberry Pi. Para esto configuré Gunicorn como servidor WSGI en modo producción y lo integré con systemd, de manera que el backend se levante automáticamente al encender la Raspberry y se mantenga en funcionamiento de forma estable sin necesidad de ingresar por SSH.

En paralelo, realicé los ajustes necesarios en el código TypeScript, unificando las implementaciones y corrigiendo variables para que la comunicación con el backend fuera consistente. Con estas modificaciones logré que el sistema reconozca y gestione la variable nombre, dejando operativo al 100% el módulo de personalización.

De esta manera, la página web ahora permite editar la configuración de personalización y asociar un nombre, garantizando su correcto funcionamiento dentro de la plataforma.

Al finalizar esta tarea, retomé el trabajo sobre la configuración horaria del servidor, ya que volvió a desajustarse y no registraba correctamente la hora local. Sin embargo, por cuestiones de tiempo no logré resolverlo completamente en esta jornada, quedando pendiente para continuar mañana.

Finalmente, comencé a analizar los problemas relacionados con la personalización de tags en las funciones que estaba desarrollando Titi, aunque el trabajo quedó pendiente de continuidad.


Patella Tiziano:

El día de hoy seguí trabajando con la personalizacion de los tags con el backend. Al ir al preguntarle al profe Fabri sobre si es que estaba haciendo todo de manera correcta me corrigio e indico que la manera en la cual estaba queriendo editar los tags no era correcta y que nunca iba a funcionar. Yo estaba queriendo editar la categoria de tag que viene por defecto con el tag, sin embargo si modifica ese parametro iba a ser imposible para el servidor vovler a indentificar el tag por lo que debia dejar esa categoria como estaba y crear una nueva para poder asignarles nombres de manera segura. Tras crear toda la logica de nueva identifacion pobre el codigo para ver si funcioaba, pero a pesar de que la codigo era el correcto habia unos problemas con la comunacion con el servidor por lo que con facu S nos propusimos que quedaba pendiente arreglar los problemas que faltaban con el servidor. 

Lautaro Santolucito:
Continué con el análisis de las lecturas obtenidas el día anterior. Crucé las mediciones de la pistola RFID con las lecturas que nos envía el ESP32 para identificar discrepancias y posibles fuentes de error (interferencias, orientación del tag, distancia). Pero rapidamente nos dimos cuenta con los chicos que no era viable hacerlo ahora y tambien por una cuestion de rangos

