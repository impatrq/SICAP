<h2> Miercoles 01/10/25 </h2>

Facu Spagno:

La jornada estuvo dedicada a resolver los problemas del apartado de personalización, que hasta el momento no funcionaba correctamente. Para ello, trabajé tanto en el frontend como en el backend, revisando el HomePage.ts, el settings.py y el views.py, donde encontré contradicciones en las listas y ausencia de la variable nombre.

En el backend detecté que en las views se estaba utilizando un método PATCH cuando en realidad era necesario un PUT para permitir la edición completa de los registros. Corregí esta lógica y también solucioné errores en las rutas (urls.py) que estaban interfiriendo con el funcionamiento esperado.

En paralelo, realicé los ajustes necesarios en el código TypeScript, unificando las implementaciones y corrigiendo variables para que la comunicación con el backend fuera consistente. Con estas modificaciones logré que el sistema reconozca y gestione la variable nombre, dejando operativo al 100% el módulo de personalización.

De esta manera, la página web ahora permite editar la configuración de personalización y asociar un nombre, garantizando su correcto funcionamiento dentro de la plataforma.

Al finalizar esta tarea, retomé el trabajo sobre la configuración horaria del servidor, ya que volvió a desajustarse y no registraba correctamente la hora local. Sin embargo, por cuestiones de tiempo no logré resolverlo completamente en esta jornada, quedando pendiente para continuar mañana.


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

Patella  Tiziano:

El día de hoy trabaje en conjunto con facu sobre todos los cambios que hizo sobre la Web-app. Al momento de que el haya implementado la columna de categoría me percaté de que esta no trabajaba de forma correcta debido al nombre que tenia asignado. Al tener un tilde como nombre el codigo no lograba reconocerla bien por lo que tuve que modificar el nombre en todos las secciones en donde era mecionada para así garantizar un funcionamineto correcto.

<h2> Lunes 06/10/25 </h2>

Facu Spagno:
Durante la jornada realicé cambios en el backend con el objetivo de optimizar la gestión de categorías dentro del sistema. Creé un nuevo apartado para categorizar los tags, permitiendo distinguir entre personas e insumos. Anteriormente, la categoría debía escribirse manualmente, lo que generaba inconsistencias; por eso, implementé un sistema con opciones predefinidas que facilita la selección y evita errores.

Además, corregí la lógica de los pasajes en la interfaz visual, ya que los datos no se transferían correctamente entre los listados y, en algunos casos, el campo de nombre se borraba al mover un registro de un lado al otro. Con las modificaciones aplicadas, la comunicación entre la interfaz y el backend quedó más estable y funcional.

<h2> Martes 07/10/25 </h2>

Facu Spagno:

Me dediqué principalmente a los aspectos estéticos de la Web-App, realizando un rediseño visual del Home. Definí una paleta de colores propia para unificar el estilo general de la plataforma y mejorar su presentación.

Durante esta tarea también eliminé el botón destinado a borrar tags, ya que no cumplía una función relevante dentro del flujo del sistema. Con este rediseño, quedó establecido el estilo visual final del Home, logrando una interfaz más moderna, limpia y coherente con la identidad del proyecto.

<h2> Miercoles 08/10/25 </h2>

Facu Spagno:

Durante la jornada me dediqué a la elaboración de la documentación técnica del proyecto, en el marco de la presentación requerida por las categorías de Prototipos y SysApp del evento ONIET.

El trabajo consistió en la creación de informes descriptivos detallados sobre los componentes de software y hardware del sistema S.I.C.A.P., abarcando su funcionamiento, arquitectura y objetivos principales. El propósito fue presentar una documentación completa, clara y profesional que refleje la solidez técnica del proyecto y aumente las posibilidades de obtener un buen desempeño en la instancia de Córdoba.

Patella Tiziano:

El día de hoy nos encargamos del armado de la documentacion obligatoria para nuestra presentacion en la ONIET. El trabajo de el que me encargue yo fue de el armado de diagramas visuales sobre la esplicacion del proyecto en profundidad haciendo un paso a paso de todas las etapas por las que pasa el proyecto para poder funcionar.

Previo a la elaboración de los diagramas respectivos me encargue de trabajar en la documentacion de la carpeta tecnica, transformado todas las partes de codigo en una vista mucho mas estetica, acomodada y correcta para el informe descriptivo que estabamos haciendo.

<h2> Viernes 10/10/25 </h2>

Facu Spagno:

Durante la jornada me dediqué al desarrollo completo del apartado de personalización, el cual hasta el momento se encontraba vacío debido a que no habíamos finalizado su implementación.

Creé este módulo desde cero, incluyendo la tabla correspondiente y la lógica de funcionamiento. El objetivo fue que en este apartado se agrupen todos los tags sin categoría asignada, de modo que el usuario pueda ingresar, asignarles su nombre y categoría, y definir su destino dentro del sistema.

Una vez que se asigna la categoría, el sistema filtra automáticamente los registros y los redirige a su sección correspondiente: si el tag pertenece a una persona, se envía al módulo de Empleados; si corresponde a un insumo, pasa al Inventario.

Para lograrlo, implementé un filtro de categorización que gestiona el traspaso dinámico entre secciones y asegura que cada tag quede correctamente clasificado. Con esta función finalizada, el Home y las metas de categorización quedaron completamente operativas, consolidando una parte clave del flujo de trabajo del sistema.

<h2>Lunes 13/10/25</h2>

Tiziano Patella:

El día de hoy, los compañeros termianor el  armado del portal para presentar en la ONIET por lo que una vez todas las antenas y lectores fueron conectados nos duspusimos a hacer las pruebas finales previo a nuestra competencia. Sin embargo, una vez que comencamos a probar todo pasando los tags como si fueramos empleados nos percatamos de que habia un error que estaba sucediendo el cual estaba arruinando todo el funcionamiento, algunos de los tags que pasabamos por alguna razon se duplicaban. Este fue un error que nos nos había pasado antes por lo que no supe cual podria llegar a ser el causante. Debido a eso decidí quedarme toda la tarde trabajando en ver cual era el problema. Al comienzo consideré que el cuasante podía ser un problema de lectura erronea de bytes por parte de las antenas pero  tras hablar con los profes quedo descartada esa idea. A pesar de que estuve toda la tarde analizando posibles causantes de el problema no logré encontrar una solución por lo que unica opcion era esperar al día de mañana al profe Medina y ver si el me podía llegar a dar una mano. 

<h2>Martes 14/10/25</h2>

Tiziano Patella:

Una vez que llego Medina a la escuela le mostré cual era el problema que estabamos teniendo para ver si el podía llegar a darse cuenta que estaba pasando. Lo primero que nos hizo hacer fue modificar el codigo de el micro para que al detectar el tag nos de una respuesta completa completa en byts de que es lo que obtiene. Una vez que obtuvimos el cifrado de que era lo que detectaba la antena nos hizo separarlo para poder obtener el numero de tag, haciendo eso nos dimos cuenta que el número de tag que nos brindaba antes nuestro codigo era erroneo y no se asimilaba en nada al verdadero identificador, esto estaba causando que al trabajar con números que no eran reales estos se repitieran ocacionalmente. Gracias a las intrucciones de Medina pudimos saber cuales eran los pasos que teniamos que seguir para obtener la información correcta. 

Llegada la tarde, tras haber hecho funcionar el sistema con exito y el tipo de tag real( de un momento para otro y sin explicación alguna) dejo de funcionar todo. Los lectores estaban muy calientes y nos saltaban error y el codigo hecho por Medina que antes funciobana ahora no nos devolvía nada. Esto significo una gran preocupación para nosotros porque Medina ya se había ido de la escuela por lo que ya no podría ayudarnos y al día siguiente nos ibamos a Cordoba por lo que el proyecto tenía que funcionar ese mismo día si o si.

Ante esta problematica de ultimo momento decidimos que la mejor opción era juntarnos en una casa durante la noche para poder arreglar todo y llegar a la ONIET con un proyecto funcional.


