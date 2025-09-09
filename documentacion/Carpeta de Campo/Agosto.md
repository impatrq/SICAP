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

Pablo Osores:

Me encargué de conseguir los materiales para la estructura del portal para el prototipo del sistema SICAP la cual estaba en desuso en el pañol de aviónica. El armado del portal nos sirvió para tomar dimensión de como hacer los soportes de antenas y lectores, además de toda la electrónica y poder pensar con algo físico la forma de distribución de cables y antenas de forma que quede lo mejor posible.

<p align="center">
  <img src="https://github.com/user-attachments/assets/583ba720-f0cb-418a-8af8-36f7f3f5a0b9" alt="imagen 1" width="300" style="display:inline-block; margin-right:10px;"/>
  <img src="https://github.com/user-attachments/assets/31849460-ce5b-4433-bcb3-dc7b8458f14d" alt="imagen 2" width="300" style="display:inline-block;"/>
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/39772eca-234c-411c-b6ec-0c228841d412" alt="imagen 3" width="600"/>
</p>

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

Lautaro:

Puse a andar el sistema y dejamos una pantalla de ingreso con usuario y contraseña.

Al iniciar sesión te lleva a un panel donde se ven los registros de tags más recientes.

Ordene y limpie cosas que estaban trabando el arranque (rutas y configuración).

Probe de punta a punta: entrar, ver los registros y cerrar sesión.

Quedó listo para que el equipo del frontend se conecte y siga trabajando sin tocar nada más del lado del servidor.

<h2>Miercoles 20/08/2025</h2>

Facu Spagnoletta:

Durante la jornada trabajé en la interfaz de usuario del sistema. En primer lugar, finalicé el diseño estético y funcional del módulo de login, otorgándole un estilo más profesional y consistente con la identidad general del proyecto.

Posteriormente, avancé en la sección Home, incorporando nuevas funcionalidades y optimizando su estructura para mejorar la navegabilidad y la experiencia de usuario. Estos cambios permitirán que el sistema tenga una interfaz más clara, adaptable y preparada para futuras integraciones.

<h2>Jueves 21/08/2025 </h2>

Se implementó la API de gestión de usuarios vinculada al módulo de login. La misma quedó operativa al 100%, permitiendo:

Creación de usuarios mediante la API.

Registro automático de dichos usuarios en la base de datos del backend.

Verificación en tiempo real de la existencia del usuario al momento de iniciar sesión.

Redirección automática a la interfaz correspondiente en caso de validación positiva.

Con esta mejora, el sistema consolida la integración entre el login y la base de datos, garantizando un control más seguro y eficiente del acceso de los usuario


<h2>Miercoles 27/08/2025</h2>

Pablo Osores: Este día hice reformas a los perfiles de aluminio que teníamos para poder tener 4 perfiles de una medida específica para poder continuar con el armado del portal, en estos perfiles fabricados van a estar los soportes para las antenas los cuales van a estar impresos en 3d con PLA o en PETG. La idea es que los soportes sean regulables en altura y dirección para poder acomodar las antenas en caso de necesitarlo.

<p align="center" style="margin-bottom:10px;">
  <img src="https://github.com/user-attachments/assets/9fc02ee7-90c2-4edb-a52d-185ffe1ed057" width="250" alt="imagen 1" width="300">
  <img src="https://github.com/user-attachments/assets/40c4e655-ce94-49d1-b5bc-5413b92c5d1f" width="250" alt="imagen 2" width="300">
  <img src="https://github.com/user-attachments/assets/f3c0296b-01a8-43fc-af2b-07cca5703b6e" width="250" alt="imagen 3" width="300">
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/1904855b-cd63-4a4d-9fe9-9238f2194567" width="760" alt="imagen 4" width="600"/>
</p>

Facundo Ledesma:
 Para la creación del banner destinado a las ONIET, utilicé la plataforma Canva, aplicando todos los conocimientos adquiridos previamente sobre diseño gráfico y comunicación visual. En el proceso tuve en cuenta aspectos fundamentales como la elección de colores, tipografías y distribución de los elementos, de manera que el resultado transmitiera un mensaje claro, atractivo y profesional.

Primero trabajé en la paleta cromática, seleccionando tonos que representaran la identidad del evento y que, al mismo tiempo, generaran contraste para facilitar la lectura. Luego, apliqué tipografías legibles y acordes al estilo institucional, cuidando jerarquías entre títulos, subtítulos y textos secundarios. También consideré la importancia del equilibrio visual, organizando los elementos de forma armoniosa y evitando la sobrecarga de información.

Además, recurrí al uso de imágenes y formas gráficas que reforzaran el propósito del banner, procurando que cada componente tuviera una función dentro del diseño. Este trabajo me permitió poner en práctica conocimientos de composición, teoría del color y principios de comunicación visual, logrando un producto que no solo cumple con su objetivo informativo, sino que también resulta atractivo para el público al que está dirigido.