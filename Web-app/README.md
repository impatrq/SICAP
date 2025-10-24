# 💻 Web App – Proyecto SICAP

La **aplicación web** del proyecto **SICAP** fue desarrollada para ofrecer una **interfaz moderna, accesible y adaptable a distintos dispositivos**, desde la cual se puede visualizar y gestionar la información proveniente del sistema RFID en tiempo real.  

Este módulo representa la parte **interactiva y visual** del proyecto, permitiendo al usuario consultar datos, verificar lecturas, controlar el estado del sistema y navegar de forma intuitiva entre las distintas secciones.

---

## 🎯 Objetivo

- Mostrar de manera dinámica los datos enviados por el **servidor SICAP**.  
- Permitir el **monitoreo de etiquetas RFID**, antenas activas y estados del sistema.  
- Brindar una interfaz **multiplataforma**, accesible desde navegadores y dispositivos móviles.  
- Integrar visualmente todas las áreas del proyecto (hardware, firmware y backend).

---

## ⚙️ Tecnologías utilizadas

| Tecnología | Función |
|-------------|----------|
| **Ionic Framework** | Base de la aplicación, interfaz adaptable (responsive). |
| **JavaScript / TypeScript** | Lógica del cliente y manejo de datos recibidos del servidor. |
| **HTML5 / CSS3** | Estructura y estilo visual de la interfaz. |
| **Node.js / npm** | Gestión de dependencias y entorno de desarrollo. |
| **API SICAP (Backend Django)** | Fuente de datos principal (lecturas, estados, registros). |
---

## 🧠 Funcionamiento general

1. La aplicación obtiene los datos desde el **servidor Django** del sistema SICAP mediante solicitudes HTTP o WebSocket.  
2. Los datos se procesan y se muestran en una interfaz interactiva:  
   - Listado de etiquetas RFID detectadas.  
   - Estado de las antenas.  
   - Fecha y hora de lectura.  
   - Información de los equipos conectados.  
3. El diseño está pensado para adaptarse a distintas resoluciones (desktop, tablet, celular).  
4. Puede ejecutarse como **web progresiva (PWA)** o integrarse en un servidor local para pruebas.

