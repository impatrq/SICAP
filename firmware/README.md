# 🔧 Firmware - Proyecto SICAP

El directorio **/firmware** contiene el código fuente que controla el hardware del sistema **SICAP**.  
Aquí se aloja el programa encargado de gestionar la lectura de etiquetas RFID y la comunicación entre el lector **SAMSys MP9320** y el servidor del proyecto.

---

## 🧩 Descripción

El firmware está desarrollado en **MicroPython** y se ejecuta en un **ESP32** conectado al lector RFID.  
Su función es:
- Inicializar la red Wi-Fi.  
- Recibir los EPC de las etiquetas detectadas.  
- Formatear los datos y enviarlos al servidor backend mediante HTTP.  

Cada componente del módulo (`wifi.py`, `Reader.py`, `app.py`) tiene responsabilidades separadas para mantener una arquitectura clara y escalable.

---

> 🛰️ *El firmware es el punto de enlace entre el mundo físico (lecturas RFID) y el sistema digital SICAP.*