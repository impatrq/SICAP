<h2> Miercoles 01/10/25 </h2>

Facu Spagno:

La jornada estuvo dedicada a resolver los problemas del apartado de personalización, que hasta el momento no funcionaba correctamente. Para ello, trabajé tanto en el frontend como en el backend, revisando el HomePage.ts, el settings.py y el views.py, donde encontré contradicciones en las listas y ausencia de la variable nombre.

En el backend detecté que en las views se estaba utilizando un método PATCH cuando en realidad era necesario un PUT para permitir la edición completa de los registros. Corregí esta lógica y también solucioné errores en las rutas (urls.py) que estaban interfiriendo con el funcionamiento esperado.

En paralelo, realicé los ajustes necesarios en el código TypeScript, unificando las implementaciones y corrigiendo variables para que la comunicación con el backend fuera consistente. Con estas modificaciones logré que el sistema reconozca y gestione la variable nombre, dejando operativo al 100% el módulo de personalización.

De esta manera, la página web ahora permite editar la configuración de personalización y asociar un nombre, garantizando su correcto funcionamiento dentro de la plataforma.

Al finalizar esta tarea, retomé el trabajo sobre la configuración horaria del servidor, ya que volvió a desajustarse y no registraba correctamente la hora local. Sin embargo, por cuestiones de tiempo no logré resolverlo completamente en esta jornada, quedando pendiente para continuar mañana.


Patella Tiziano:

El día de hoyy comence arreglando la Pagina Web ya que previamente Medina habia hecho unas modificaciones ya que nuestro github no funcioana bien y debido a eso nuestra pagina dejo de funcionar. Previo a arreglar la pagina nos pusimos con facu S a finalizar el funcionamiento de la edicion de tags que habia quedado pendiente del día anterior. Mientras yo realizaba pruebas sobre el frontend y modificaciones en el .ts, facu se encargo de trabajar sobre la parte del backend del servidor para encontrar donde estaba el problema de la comunicacion. Al finalizar, logramos que se puedan editar tags desde la app y que estos se guarden en el servidor. Ademas de eso, habilite que los nombres de los nuevos tags se muestren para asi poder identificarlos de forma mas sencilla. 