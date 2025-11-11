<h2>Martes 4/11/2025</h2>

Facundo Ledesma:

En la jornada de hoy me dediqué a realizar todas las correcciones indicadas por los profesores con el objetivo de mejorar el video de presentación del proyecto.
Revisé cada observación y apliqué los cambios necesarios para optimizar tanto el contenido como la edición general. Ajusté tiempos, modifiqué textos, mejoré la sincronización de los clips y realicé pequeños retoques en la música y los subtítulos para lograr un resultado más claro y profesional.
De esta manera, el video quedó completamente actualizado y listo para su revisión final por parte de los docentes y jurados.

<srd> https://youtu.be/k7C2opmh9fs</src>

<h2>Miercoles 5/11/2025</h2>

Facu Spagno:

Durante la jornada desarrollé la versión 2.0 del método de asignaciones, mejorando de forma significativa la lógica de funcionamiento implementada previamente.

Esta nueva versión incorpora condiciones específicas de asignación de tags, lo que permite determinar en qué situaciones un insumo debe o no ser asignado a una persona. La lógica ahora evalúa distintos factores, como el estado actual de la herramienta, la disponibilidad en el sistema y las condiciones del usuario que realiza el retiro o la devolución.

Con estas mejoras, el proceso de asignación se volvió más preciso, dinámico y adaptable a distintos escenarios, evitando errores y asegurando una trazabilidad más confiable dentro del inventario del sistema S.I.C.A.P.

Facundo Ledesma:

En la jornada de hoy comencé con la creación del anuncio para comunicar que estaremos presentes en la muestra. Para el desarrollo de este trabajo utilicé las aplicaciones Canva e Illustrator.
En Canva me encargué de definir el concepto general del diseño, incluyendo la estructura visual, los textos principales y la disposición de los elementos gráficos. Luego, en Illustrator, me enfoqué en los detalles más precisos, ajustando tipografías, colores y formas para lograr un acabado profesional y coherente con la identidad del proyecto.

Lautaro Santolucito:
Durante la jornada desarmé toda la estructura del portal y la volví a armar correctamente, ya que había quedado floja y no garantizaba la estabilidad necesaria. Me aseguré de ajustar y reforzar cada punto de unión para dejar la estructura firme y alineada, optimizando su presentación y seguridad para futuras pruebas.

<h2>Jueves 06/11/25</h2>
Lautaro Santolucito:
Durante el día me encargué de plote ar el BMW de SICAP para la muestra, aplicando los vinilos y detalles visuales que representan al proyecto.

Facu Spagno:

Durante la jornada trabajé tanto en el backend como en el frontend del sistema, incorporando una nueva función destinada a la eliminación de tags.

El objetivo de esta mejora fue permitir la limpieza de los registros que quedaban en el apartado de Personalización, especialmente aquellos tags sin categoría asignada que interferían con la organización del sistema. Para esto, desarrollé la lógica correspondiente en el backend y su respectiva implementación en el archivo TypeScript y en el HTML de la interfaz.

La función permite eliminar tags de forma individual o múltiple, según la necesidad del usuario, seleccionando uno o varios registros al mismo tiempo. Aunque inicialmente la función no operaba correctamente, quedó implementada y lista para su ajuste final.

Además, aproveché la jornada para restaurar funciones eliminadas previamente del archivo TypeScript por Titi, reinsertándolas en el código para recuperar el correcto funcionamiento general del sistema.

<h2>Martes 11/11/25</h2>

Durante la jornada finalicé y optimicé la función de eliminación de tags en el frontend, logrando que el proceso se ejecute directamente desde la interfaz sin necesidad de acceder al backend. Esta función, iniciada el día anterior, quedó completamente operativa y estable.

Además, desarrollé una nueva función de eliminación dentro de los apartados de Inventario y Empleados, permitiendo borrar tags específicos de cada sección. De esta manera, ahora es posible eliminar tanto los tags sin categoría como aquellos que ya no se utilizan en los módulos activos del sistema.

También realicé ajustes en la Raspberry Pi, corrigiendo nuevamente el problema de la desconfiguración horaria. Para evitar que el inconveniente se repita, incorporé un miniscript automatizado que actualiza la hora del sistema cada vez que la Raspberry se desconecta y vuelve a conectarse. Con esta mejora, el servidor mantiene sincronizada su hora de manera continua, garantizando la precisión en los registros y evitando futuras inconsistencias.