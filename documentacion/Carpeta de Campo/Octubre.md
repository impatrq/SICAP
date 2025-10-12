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

<h2> Lunes 06/10/25 </h2>

Facu Spagno:
Durante la jornada realicé cambios en el backend con el objetivo de optimizar la gestión de categorías dentro del sistema. Creé un nuevo apartado para categorizar los tags, permitiendo distinguir entre personas e insumos. Anteriormente, la categoría debía escribirse manualmente, lo que generaba inconsistencias; por eso, implementé un sistema con opciones predefinidas que facilita la selección y evita errores.

Además, corregí la lógica de los pasajes en la interfaz visual, ya que los datos no se transferían correctamente entre los listados y, en algunos casos, el campo de nombre se borraba al mover un registro de un lado al otro. Con las modificaciones aplicadas, la comunicación entre la interfaz y el backend quedó más estable y funcional.

<h2> Martes 07/10/25 </h2>
