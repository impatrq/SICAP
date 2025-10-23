# ⚙️ Firmware del Lector RFID - Proyecto SICAP

Este módulo contiene el código del **lector RFID basado en ESP32**, encargado de capturar etiquetas UHF mediante un lector **SAMSys MP9320** y enviar los datos al servidor **SICAP Backend**.

---

## 🔌 Descripción general

El firmware controla la lectura automática de etiquetas RFID conectadas al ESP32 mediante comunicación **RS232 TTL**.  
Cada lectura se procesa, filtra y envía en formato **JSON** al servidor local SICAP, donde se almacena y visualiza a través de la **WebApp**.

El código fue desarrollado íntegramente en **MicroPython** utilizando **Thonny IDE**.

---

## 🧠 Funcionamiento

1. **Inicialización Wi-Fi**  
   El módulo `wifi.py` configura la conexión a la red local, permitiendo que el lector se comunique con el servidor.

2. **Lectura de etiquetas**  
   `Reader.py` envía comandos al SAMSys MP9320 y recibe los EPC de las etiquetas UHF detectadas.

3. **Procesamiento y envío**  
   `app.py` toma los EPC obtenidos, genera una estructura JSON con fecha, hora y antena, y la envía al endpoint del backend mediante HTTP POST.

---

## 🧪 Pruebas y validación

Durante las pruebas, se verificó:
- Comunicación estable entre ESP32 y lector MP9320.  
- Correcta transmisión de los datos al servidor mediante la API.  
- Reintentos automáticos ante pérdida de conexión Wi-Fi.  
- Lectura simultánea con múltiples antenas activas.

---

## 🔧 Requisitos

- **MicroPython** instalado en el ESP32  
- **Thonny IDE** o herramienta equivalente  
- Conexión serial RS232-TTL al lector SAMSys MP9320  
- Servidor SICAP en ejecución en la misma red local  

---

## 🚀 Carga del firmware

1. Conectar el ESP32 a la PC mediante cable USB.  
2. Abrir Thonny IDE y seleccionar el intérprete **MicroPython (ESP32)**.  
3. Cargar los archivos `app.py`, `Reader.py` y `wifi.py` dentro del dispositivo.  
4. Reiniciar el ESP32: el programa comenzará a ejecutarse automáticamente.
---

> 💡 *Este firmware forma parte integral del ecosistema SICAP, encargado de la captura física de datos RFID que luego son procesados por el servidor.*