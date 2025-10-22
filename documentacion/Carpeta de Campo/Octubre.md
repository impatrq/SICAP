<h2> Miercoles 01/10/25 </h2>

Facu Spagno:

La jornada estuvo dedicada a resolver los problemas del apartado de personalización, que hasta el momento no funcionaba correctamente. Para ello, trabajé tanto en el frontend como en el backend, revisando el HomePage.ts, el settings.py y el views.py, donde encontré contradicciones en las listas y ausencia de la variable nombre.

En el backend detecté que en las views se estaba utilizando un método PATCH cuando en realidad era necesario un PUT para permitir la edición completa de los registros. Corregí esta lógica y también solucioné errores en las rutas (urls.py) que estaban interfiriendo con el funcionamiento esperado.

En paralelo, realicé los ajustes necesarios en el código TypeScript, unificando las implementaciones y corrigiendo variables para que la comunicación con el backend fuera consistente. Con estas modificaciones logré que el sistema reconozca y gestione la variable nombre, dejando operativo al 100% el módulo de personalización.

De esta manera, la página web ahora permite editar la configuración de personalización y asociar un nombre, garantizando su correcto funcionamiento dentro de la plataforma.

Al finalizar esta tarea, retomé el trabajo sobre la configuración horaria del servidor, ya que volvió a desajustarse y no registraba correctamente la hora local. Sin embargo, por cuestiones de tiempo no logré resolverlo completamente en esta jornada, quedando pendiente para continuar mañana.

Lautaro Santolucito:
Con la fecha de las ONIET cada vez más cerca, decidí concentrarme en la organización de toda la documentación del proyecto. Empecé reuniendo los registros de los distintos integrantes, revisando sus avances y unificando los textos para la carpeta de campo. Me enfoqué principalmente en mejorar la redacción y la coherencia general del documento, asegurándome de que cada jornada reflejara correctamente las tareas reales de cada integrante.
Además, durante esta primera semana nos topamos con un problema recurrente en el lector: sólo leía desde una o dos antenas, lo que nos generó incertidumbre acerca del estado del equipo. Comencé a portar y ordenar los problemas de lectura para analizarlos junto con Pablo y el resto del equipo.


Patella Tiziano:

El día de hoyy comence arreglando la Pagina Web ya que previamente Medina habia hecho unas modificaciones ya que nuestro github no funcioana bien y debido a eso nuestra pagina dejo de funcionar. Previo a arreglar la pagina nos pusimos con facu S a finalizar el funcionamiento de la edicion de tags que habia quedado pendiente del día anterior. Mientras yo realizaba pruebas sobre el frontend y modificaciones en el .ts, facu se encargo de trabajar sobre la parte del backend del servidor para encontrar donde estaba el problema de la comunicacion. Al finalizar, logramos que se puedan editar tags desde la app y que estos se guarden en el servidor. Ademas de eso, habilite que los nombres de los nuevos tags se muestren para asi poder identificarlos de forma mas sencilla. 

<h2> Jueves 02/10/25 </h2>

Facu Spagno:

La jornada estuvo enfocada en resolver aspectos centrales del sistema relacionados con la hora de los registros, la visualización y edición de datos en la API, y la estabilidad del servidor en la Raspberry Pi.

En primer lugar, se detectó que las fechas y horas de los registros no coincidían con la hora real. Esto ocurría porque Django maneja los horarios en UTC por defecto. La solución consistió en ajustar la configuración del sistema para que los registros se adapten a la hora local de Argentina, garantizando coherencia en la trazabilidad de los datos.

Otro de los puntos abordados fue la visualización de la información en la API. Al consultar los registros, solo aparecía el campo de creación automática, sin mostrar el campo personalizado de nombre. Para resolverlo, se realizaron correcciones en la configuración de los serializers, logrando que ahora se visualicen correctamente los campos de tag, nombre y fecha.

En cuanto a la edición de registros, se implementó una nueva vista en el backend que permite actualizar los datos de un registro mediante una petición de actualización completa. A nivel de frontend, se ajustó la lógica en TypeScript para que las solicitudes se enviaran correctamente y se corrigieron detalles en la construcción de las rutas que estaban generando errores. Con estas modificaciones, el sistema ahora permite editar el campo nombre de forma estable.

Se realizaron pruebas de validación tanto desde la API como desde la base de datos, confirmando que los cambios se guardaban adecuadamente. También se monitoreó el comportamiento del servidor en ejecución, verificando que las solicitudes fueran procesadas sin errores.

Como mejora adicional, se propuso la incorporación de una nueva columna llamada categoría en el modelo de registros, que podrá editarse de la misma manera que el nombre. Para ello, se planificaron los pasos necesarios para implementar la modificación en futuras jornadas.

Finalmente, se comprobó que el servidor continúa funcionando de manera estable en la Raspberry Pi bajo la gestión de servicios del sistema, lo que asegura que el backend se mantenga en ejecución y se inicie automáticamente tras cada reinicio.

Lautaro Santolucito:
Continué trabajando sobre la carpeta técnica, ajustando los formatos, márgenes y estilos para lograr una presentación más prolija y uniforme. Organicé las secciones según las pautas solicitadas por los profesores, incorporando títulos, fechas y un sistema de numeración que facilite la lectura. Además, elaboré una estructura base para incluir más adelante imágenes, gráficos y descripciones técnicas de los componentes. Paralelamente, seguí recopilando mediciones y anotaciones sobre las lecturas inconsistentes de las antenas para poder comparar con las pruebas de hardware que íbamos a ejecutar.


Patella  Tiziano:

El día de hoy trabaje en conjunto con facu sobre todos los cambios que hizo sobre la Web-app. Al momento de que el haya implementado la columna de categoría me percaté de que esta no trabajaba de forma correcta debido al nombre que tenia asignado. Al tener un tilde como nombre el codigo no lograba reconocerla bien por lo que tuve que modificar el nombre en todos las secciones en donde era mecionada para así garantizar un funcionamineto correcto.

<h2>Viernes (NO HUBO CLASES) — 03/10/2025</h2>

Lautaro Santolucito:
Aproveché para avanzar en la selección de imágenes y la diagramación de portadas y carátulas. Ordené las fotos representativas del montaje y preparé descripciones técnicas y leyendas para cada imagen, dejando todo listo para su integración en las carpetas. Además coordiné con Pablo una sesión de pruebas para el fin de semana orientada a diagnosticar por qué el lector no respondía con las cuatro antenas.

<h2> Lunes 06/10/25 </h2>

Facu Spagno:
Durante la jornada realicé cambios en el backend con el objetivo de optimizar la gestión de categorías dentro del sistema. Creé un nuevo apartado para categorizar los tags, permitiendo distinguir entre personas e insumos. Anteriormente, la categoría debía escribirse manualmente, lo que generaba inconsistencias; por eso, implementé un sistema con opciones predefinidas que facilita la selección y evita errores.

Además, corregí la lógica de los pasajes en la interfaz visual, ya que los datos no se transferían correctamente entre los listados y, en algunos casos, el campo de nombre se borraba al mover un registro de un lado al otro. Con las modificaciones aplicadas, la comunicación entre la interfaz y el backend quedó más estable y funcional.

Lautaro Santolucito:
Durante la jornada me dediqué a incorporar imágenes y esquemas a la carpeta técnica del proyecto. Seleccioné las fotografías más representativas del montaje, los componentes y el desarrollo del sistema, asegurándome de que cada una contara con su respectiva descripción. También armé las primeras versiones de las carátulas internas buscando un diseño sobrio y profesional. Paralelamente, revisé las anotaciones de prueba de antenas y preparé el material que necesitábamos para las pruebas prácticas con Pablo.


<h2> Martes 07/10/25 </h2>

Facu Spagno:

Me dediqué principalmente a los aspectos estéticos de la Web-App, realizando un rediseño visual del Home. Definí una paleta de colores propia para unificar el estilo general de la plataforma y mejorar su presentación.

Durante esta tarea también eliminé el botón destinado a borrar tags, ya que no cumplía una función relevante dentro del flujo del sistema. Con este rediseño, quedó establecido el estilo visual final del Home, logrando una interfaz más moderna, limpia y coherente con la identidad del proyecto.

Lautaro Santolucito:
Avancé con la elaboración del glosario técnico y la introducción general del proyecto. Redacté definiciones claras y adaptadas al nivel de comprensión esperado por los evaluadores (RFID, EPC, RSSI, Django, ESP32). Empecé además a bosquejar ideas publicitarias y de difusión para ONIET, incluyendo el uso de códigos QR en folletos y un banner con el logo del proyecto.

<h2> Miercoles 08/10/25 </h2>


Facu Spagno:

Durante la jornada me dediqué a la elaboración de la documentación técnica del proyecto, en el marco de la presentación requerida por las categorías de Prototipos y SysApp del evento ONIET.

El trabajo consistió en la creación de informes descriptivos detallados sobre los componentes de software y hardware del sistema S.I.C.A.P., abarcando su funcionamiento, arquitectura y objetivos principales. El propósito fue presentar una documentación completa, clara y profesional que refleje la solidez técnica del proyecto y aumente las posibilidades de obtener un buen desempeño en la instancia de Córdoba.

Lautaro Santolucito:
El día de hoy trabajé en la versión final de las carpetas, revisando que tanto la técnica como la de campo estuvieran completas y con un formato coherente entre sí. Incorporé los logotipos oficiales del proyecto y ajusté detalles de diseño como tipografías, espaciado y márgenes. También generé copias digitales de respaldo y las subí a la carpeta compartida del equipo para evitar pérdidas de información antes del viaje a Córdoba.

Patella Tiziano:

El día de hoy nos encargamos del armado de la documentacion obligatoria para nuestra presentacion en la ONIET. El trabajo de el que me encargue yo fue de el armado de diagramas visuales sobre la esplicacion del proyecto en profundidad haciendo un paso a paso de todas las etapas por las que pasa el proyecto para poder funcionar.

Previo a la elaboración de los diagramas respectivos me encargue de trabajar en la documentacion de la carpeta tecnica, transformado todas las partes de codigo en una vista mucho mas estetica, acomodada y correcta para el informe descriptivo que estabamos haciendo.

<h2> Viernes 10/10/25 </h2>

Facu Spagno:

Durante la jornada me dediqué al desarrollo completo del apartado de personalización, el cual hasta el momento se encontraba vacío debido a que no habíamos finalizado su implementación.

Creé este módulo desde cero, incluyendo la tabla correspondiente y la lógica de funcionamiento. El objetivo fue que en este apartado se agrupen todos los tags sin categoría asignada, de modo que el usuario pueda ingresar, asignarles su nombre y categoría, y definir su destino dentro del sistema.

Una vez que se asigna la categoría, el sistema filtra automáticamente los registros y los redirige a su sección correspondiente: si el tag pertenece a una persona, se envía al módulo de Empleados; si corresponde a un insumo, pasa al Inventario.

Para lograrlo, implementé un filtro de categorización que gestiona el traspaso dinámico entre secciones y asegura que cada tag quede correctamente clasificado. Con esta función finalizada, el Home y las metas de categorización quedaron completamente operativas, consolidando una parte clave del flujo de trabajo del sistema.

Lautaro Santolucito:
Coordiné la preparación final del material documental con el equipo. Revisé y uniformé los textos individuales y propuse elementos para la difusión en ONIET: folletos con QR, banner, y una hoja técnica breve para el jurado. Dejé todo preparado para las últimas revisiones previas al viaje. Además, seguí con pruebas puntuales del lector y recopilé datos de RSSI para comparar con las futuras lecturas del ESP32.


<h2>Lunes 13/10/25</h2>

Tiziano Patella:

El día de hoy, los compañeros termianor el  armado del portal para presentar en la ONIET por lo que una vez todas las antenas y lectores fueron conectados nos duspusimos a hacer las pruebas finales previo a nuestra competencia. Sin embargo, una vez que comencamos a probar todo pasando los tags como si fueramos empleados nos percatamos de que habia un error que estaba sucediendo el cual estaba arruinando todo el funcionamiento, algunos de los tags que pasabamos por alguna razon se duplicaban. Este fue un error que nos nos había pasado antes por lo que no supe cual podria llegar a ser el causante. Debido a eso decidí quedarme toda la tarde trabajando en ver cual era el problema. Al comienzo consideré que el cuasante podía ser un problema de lectura erronea de bytes por parte de las antenas pero  tras hablar con los profes quedo descartada esa idea. A pesar de que estuve toda la tarde analizando posibles causantes de el problema no logré encontrar una solución por lo que unica opcion era esperar al día de mañana al profe Medina y ver si el me podía llegar a dar una mano. 

Lautaro Santolucito:

Comenzamos la semana previa a las ONIET revisando el estado general del sistema. Mientras los chicos terminaron ajustes de código, me encargué de verificar la documentación y las presentaciones. En paralelo, realicé pruebas adicionales sobre la comunicación entre el lector RFID, las antenas y el servidor y detecté persistencia del problema: lecturas parciales (una o dos antenas activas). Preparé una lista de chequeo de conexiones, alimentaciones y multiplexado de antenas para la intervención técnica del viernes.

<h2>Martes 14/10/25</h2>

Tiziano Patella:

Una vez que llego Medina a la escuela le mostré cual era el problema que estabamos teniendo para ver si el podía llegar a darse cuenta que estaba pasando. Lo primero que nos hizo hacer fue modificar el codigo de el micro para que al detectar el tag nos de una respuesta completa completa en byts de que es lo que obtiene. Una vez que obtuvimos el cifrado de que era lo que detectaba la antena nos hizo separarlo para poder obtener el numero de tag, haciendo eso nos dimos cuenta que el número de tag que nos brindaba antes nuestro codigo era erroneo y no se asimilaba en nada al verdadero identificador, esto estaba causando que al trabajar con números que no eran reales estos se repitieran ocacionalmente. Gracias a las intrucciones de Medina pudimos saber cuales eran los pasos que teniamos que seguir para obtener la información correcta. 

Llegada la tarde, tras haber hecho funcionar el sistema con exito y el tipo de tag real( de un momento para otro y sin explicación alguna) dejo de funcionar todo. Los lectores estaban muy calientes y nos saltaban error y el codigo hecho por Medina que antes funciobana ahora no nos devolvía nada. Esto significo una gran preocupación para nosotros porque Medina ya se había ido de la escuela por lo que ya no podría ayudarnos y al día siguiente nos ibamos a Cordoba por lo que el proyecto tenía que funcionar ese mismo día si o si.

Ante esta problematica de ultimo momento decidimos que la mejor opción era juntarnos en una casa durante la noche para poder arreglar todo y llegar a la ONIET con un proyecto funcional.


Lautaro Santolucito:


Durante la tarde detectamos que el lector RFID había dejado de funcionar correctamente sin motivo aparente. Convocamos una reunión de emergencia en mi casa para revisar el sistema en conjunto. Esa noche trabajamos intensamente y el equipo: diagnosticamos conexiones, probamos distintos cables coaxiales, revisamos la alimentación de los módulos y comprobamos el multiplexado de antenas. Finalmente, logramos restablecer el funcionamiento del lector y hacer que ambos lectores trabajaran de forma coordinada, permitiendo la lectura estable desde las cuatro antenas.
Además a la salida del colegio antes de la reunion en mi casa, gestioné la impresión completa de la documentación técnica y de campo, con el apoyo de Transporte Miloser S.A. como sponsor, y coordiné el encuadernado para que todo estuviera listo para llevar a ONIET. Terminamos la jornada con el sistema y la documentación listos para el viaje.


<h2>Miércoles 15/10/2025 — Salida hacia ONIET</h2>

Lautaro Santolucito:
El equipo emprendió el viaje a Córdoba para participar en la instancia nacional de las ONIET. Me encargué de trasladar las carpetas impresas, los respaldos digitales y el equipo RFID completo. Durante el trayecto repasamos las presentaciones y coordinamos los últimos detalles de exposición. La preparación previa y las pruebas realizadas permitieron llegar con el sistema estable y la documentación impresa para presentar al jurado.

<h2>Sábado 18/10/2025 — Regreso y cierre</h2>
Lautaro Santolucito:
Regresamos de la competencia el 18 de octubre luego de una experiencia inolvidable en las ONIET. El proyecto S.I.C.A.P. obtuvo el primer puesto en la categoría Prototipos, con una calificación de 96/100, y el cuarto puesto en SysApp, con una puntuación de 87/100. Estos resultados reflejaron el trabajo constante y la dedicación de todo el equipo a lo largo del año.
El jurado destacó especialmente la integración entre hardware y software, la estabilidad del sistema y la calidad de la documentación presentada. Ver funcionar cada parte del proyecto —desde las antenas y el lector hasta la web y el backend— fue una gran satisfacción.
A mi regreso elaboré un informe con las observaciones del jurado y los puntos de mejora sugeridos, que servirán como base para futuras versiones del sistema. Cerramos esta etapa con orgullo y motivación, conscientes de que logramos posicionar a nuestra escuela entre los mejores proyectos del país.

<h2>Martes 21/10/2025</h2>
Lautaro Santolucito:
Comenzamos nuevamente con las jornadas de trabajo tras el regreso de las ONIET. Junto con Pablo nos dedicamos a rearmar la estructura del portal del proyecto, que había sido desarmada para el viaje, con el objetivo de dejarla lista para la presentación de la feria de fin de año.
Revisamos las conexiones, el anclaje de las antenas y el posicionamiento del lector para asegurar estabilidad y buena visibilidad durante la exposición. Además, evaluamos posibles mejoras en el diseño físico del stand, buscando hacerlo más prolijo y atractivo para el público.

<h2>Miércoles 22/10/2025</h2>
Lautaro Santolucito:
Durante la jornada continuamos con la puesta a punto del sistema y la organización general del proyecto. Analizamos junto con los chicos las observaciones recibidas en las ONIET, identificando qué aspectos podrían optimizarse para la feria de fin de año.
Nos enfocamos en planificar pequeñas mejoras de presentación y en definir una distribución más práctica para el espacio de exposición. Con la experiencia adquirida en Córdoba, el grupo mostró mayor coordinación y claridad sobre cómo comunicar el funcionamiento y el impacto del S.I.C.A.P. frente a nuevos evaluadores.
>>>>>>> 95e641ea1d5da48acec28b96b00ca3a66d6f648f
