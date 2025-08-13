<h2>Miercoles 6/08/2025</h2>

Tiziano Patella:

El día de hoy comenzamos trabajando en conjunto todo el grupo  con como iba a ser el diseño de la app-web y que cosas debía incluir para que Facu S y yo podamos despues trabajar con una idea mas clara de lo que tenemos que hacer, luego de divirnos todas las tareas, me encargué de diseñar el modelado del portal con las antenas que vamos a armar para la prueba del sistema y para las exposiciones y competencias. El modelo lo hice en AUTOCAD con medidas reales para poder ayudar y guiar al momento del armado. 

![alt text](<Imagen de WhatsApp 2025-08-06 a las 14.07.13_792f4d94.jpg>)


**Lautaro Santolucito:**

Durante la jornada de hoy estuvimos definiendo con el grupo cómo iba a ser el diseño general de la app-web, discutiendo qué funciones debería tener y cómo se iba a ver. Ayudé a bajar todas las ideas en papel para que Tiziano y Facu S puedan después programar con una base clara.

Además, me puse a revisar y corregir algunos detalles del backend que habíamos dejado pendientes, y organicé parte de la estructura de carpetas para dejar todo más ordenado de cara a las próximas pruebas del sistema. También estuve coordinando con Pablo cómo encarar el armado del prototipo físico que vamos a llevar a la feria, tomando decisiones sobre materiales y pasos a seguir.
Hoy respondi las preguntas con la primera version que le vamos a mostrar al jefe de area.

Facundo Spagnoletta:

Desarrollo Frontend: Se continuó trabajando en la página de inicio de sesión (Login). El foco estuvo en refinar los estilos CSS (login.page.scss) para mejorar la estética visual y la experiencia de usuario, asegurando que la disposición de los elementos fuera limpia y profesional. Se realizaron ajustes finos en los componentes de Ionic para lograr una apariencia cohesiva.

Investigación Backend: Se realizó una investigación exhaustiva sobre la implementación de APIs en Django utilizando Django REST Framework. El objetivo fue definir la mejor estrategia para crear un endpoint privado y seguro que permitiera la creación de usuarios nuevos solo por administradores, sentando las bases teóricas para el desarrollo de los días siguientes.

<h2>Martes 12/08/2025</h2>

Facundo Spagnoletta:

Basado en la investigación previa, se comenzó la construcción de la API de creación de usuarios.

Instalación y Configuración: Se instaló y configuró formalmente Django REST Framework en el proyecto.

Creación de Serializers: Se creó el archivo serializers.py y se definió el UserCreateSerializer, el componente encargado de validar los datos y gestionar la creación del usuario y su contraseña segura.

Definición de la Vista y Rutas: Se creó la estructura inicial de la vista UserCreateAPIView en views.py y se configuraron las URLs para establecer la ruta de acceso al nuevo endpoint (/usuarios/crear-usuario/).


<h2>Miercoles 13/08/2025</h2>

Facundo Spagnoletta:

La jornada se dedicó a completar y probar rigurosamente la API.

Implementación de Seguridad: Se añadió la regla de permisos permission_classes = [IsAdminUser] a la vista, restringiendo el acceso únicamente a los administradores autenticados.

Pruebas Exhaustivas: Se utilizó la herramienta Postman para una verificación completa del endpoint. Se creó un superusuario en Django para obtener las credenciales necesarias, y se realizaron múltiples pruebas de creación de usuarios para confirmar el correcto funcionamiento de la API y asegurar que los datos se almacenaban correctamente en la base de datos.

Como resultado, la API quedó 100% funcional.


