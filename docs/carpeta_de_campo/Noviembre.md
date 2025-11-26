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
Facundo Ledesma:
Hoy elaboré el modelo digital de la caja destinada a cubrir la ESP utilizando AutoCAD. Durante el proceso definí las dimensiones generales de la estructura según los requerimientos de la placa, diseñé las superficies y paredes con el espesor adecuado para garantizar rigidez y protección, e incorporé las aberturas necesarias para ventilación, puertos de conexión y montaje interno. Además, realicé los ajustes finales para asegurar la compatibilidad del diseño con el resto del sistema, dejando el modelo listo para su revisión técnica y posterior prototipado.

Facu Spagno:

Durante la jornada finalicé y optimicé la función de eliminación de tags en el frontend, logrando que el proceso se ejecute directamente desde la interfaz sin necesidad de acceder al backend. Esta función, iniciada el día anterior, quedó completamente operativa y estable.

Además, desarrollé una nueva función de eliminación dentro de los apartados de Inventario y Empleados, permitiendo borrar tags específicos de cada sección. De esta manera, ahora es posible eliminar tanto los tags sin categoría como aquellos que ya no se utilizan en los módulos activos del sistema.

También realicé ajustes en la Raspberry Pi, corrigiendo nuevamente el problema de la desconfiguración horaria. Para evitar que el inconveniente se repita, incorporé un miniscript automatizado que actualiza la hora del sistema cada vez que la Raspberry se desconecta y vuelve a conectarse. Con esta mejora, el servidor mantiene sincronizada su hora de manera continua, garantizando la precisión en los registros y evitando futuras inconsistencias.

Patella Tiziano:

Tras todos los días de trabajo previos en los que estuve tratando de implentar la nueva logica de almacenamiento logical sin exito, logre hacerlo finalmente hoy. La idea de cambiar la logica de almacenamiento de local a servidor era que al utilizar la app en diferentes dispotisivos existia la problematica de estos mostraban un distinto almacenamiento de los tags, esto debido a que el almacenamiento era local sobre el dispotivo donde se estaba ejecutando. Por esto, hice que en lugar de guardarse la información en cada dispotivo lo hiciese en el servidor, cosa de que no importa desde sin importar desde donde ingrese, la informacion siempre sera la misma 

<h2>Miercoles 12/11/25</h2>

Lautaro Santolucito:
La jornada de hoy estuvo enfocada en completar por completo la sección de Revisión del Informe Descriptivo del proyecto. Esta tarea era la única parte pendiente para cumplir con todos los requisitos necesarios para la aprobación total de la documentación, por lo que trabajé en ajustar el contenido, mejorar la redacción técnica y asegurar que cada punto solicitado esté correctamente desarrollado.

Con esta revisión final, el informe queda terminado y en condiciones de ser presentado.

Facu Spagno:

Durante la jornada me dediqué a realizar una reorganización completa del código, tanto en el backend como en el frontend. El proyecto había acumulado varias funciones, estructuras y fragmentos desordenados, por lo que enfoqué el día en dejar todo en un formato profesional, prolijo y fácil de mantener.

Reorganicé los archivos respetando una estructura lógica y coherente, y agregué comentarios descriptivos en cada función para explicar su funcionamiento interno. Además, incorporé en la parte superior de cada archivo una descripción clara de su propósito, con el objetivo de que cualquier persona que consulte el código en el futuro pueda comprender rápidamente su rol dentro del sistema.

Posteriormente, trabajé en la mejora de la lógica de asignaciones, ya que presentaba fallas y no estaba adaptada al nuevo sistema de almacenamiento implementado previamente. Debido a estos cambios, la asignación de tags no estaba funcionando correctamente. Reescribí y ajusté la lógica para compatibilizarla con el nuevo método de almacenamiento, logrando que el proceso sea más fluido y estable.

Si bien la funcionalidad quedó operativa, se encuentra en una versión beta 2.0, lo que significa que todavía requiere una etapa de refinamiento final para alcanzar su versión completamente estable.

Tiziano Patella:

Debido a la nueva logica implementada para el almacenamiento, algunas funciones previas ya existentes de la app dejaron de funcionar por lo que tuve que arreglarlas.
La interfaz Visual ya no mostraba los tags y el moviento de una seccion a otra por lo que tras un largo analisis logre encontrar el problema y hacerla funcionar nuevamente. Ademas de eso, tuve que hablitar un nuevo valor de CORS debido a que por alguna extraña razon el router cambia constantemente la IP de la app por lo que tuve que ingresar la nueva dirrecion que se había genereado para así poder volver a ingresar a la app. 

<h2>Jueves 13/11/25</h2>

Facu Spagno:

Para finalizar la carpeta de campo, dediqué la jornada a realizar las pruebas finales del sistema de asignaciones, evaluando los nuevos estados y verificando que toda la lógica respondiera correctamente en distintos escenarios. Estas pruebas permitieron detectar pequeños ajustes necesarios, los cuales corregí directamente en el backend para optimizar aún más el funcionamiento general.

Como último paso, desarrollé la versión final del módulo de asignaciones (versión 3.0). Esta actualización representa la etapa más madura y estable del sistema, ya que permite que las herramientas e insumos se asignen y se devuelvan en tiempo real, sin demoras ni errores.
La lógica fue optimizada para que el inventario de cada persona se actualice de forma automática cada 2 segundos, garantizando una trazabilidad completamente inmediata entre el momento en que una persona entra o sale del pañol y el estado de los elementos que lleva consigo.

Con esta versión 3.0, el comportamiento del sistema quedó totalmente estable, fluido y funcional, cerrando así la etapa de desarrollo del módulo de asignaciones con un resultado profesional y definitivo.
