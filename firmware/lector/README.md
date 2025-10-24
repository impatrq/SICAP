# 📡 Lector RFID – Firmware del Proyecto SICAP

El módulo **`lector/`** contiene el código central del **firmware** del proyecto **SICAP**, encargado de controlar el **lector RFID SAMSys MP9320**, procesar las lecturas de las antenas y enviar los datos al **servidor central** mediante un **ESP32** programado en **MicroPython**.

---

## 🧠 Objetivo del módulo

Automatizar la detección, filtrado y envío de etiquetas **RFID UHF (EPC Gen2)** desde el hardware hacia el servidor web, garantizando una lectura confiable y sin duplicados.

---

## ⚙️ Descripción de funcionamiento

1. **Inicio del sistema**
   - Se conecta el ESP32 a la red WiFi configurada.
   - Se inicializa la comunicación con el lector RFID por **UART / RS232**.
   - Se verifica el estado de conexión antes de comenzar la lectura.

2. **Lectura de etiquetas**
   - `Reader.py` envía comandos al MP9320 (por ejemplo: `A,0!`, `Rd`, `Z!`).
   - El lector devuelve tramas en formato ASCII (`{Rd,d:300833B2DDD9014035050000,t:EPC1G2}`).
   - El script interpreta cada respuesta y extrae el **EPC** y el número de antena.

3. **Procesamiento y filtrado**
   - El firmware descarta duplicados temporales y errores de lectura.
   - Genera un objeto JSON con la información limpia.

4. **Envío al servidor**
   - `wifi.py` envía los datos mediante un **POST HTTP** al servidor Django.
   - En caso de fallo de red, los reintenta automáticamente.

---