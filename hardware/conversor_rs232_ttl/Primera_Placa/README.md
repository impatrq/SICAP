# ⚙️ Primera Placa – Conversor RS232 ↔ TTL

Esta carpeta contiene los archivos y documentación correspondientes a la **primera versión** de la **placa conversora RS232 ↔ TTL** desarrollada para el proyecto **SICAP**.  
Fue el primer prototipo funcional diseñado para adaptar las señales eléctricas entre el **lector RFID SAMSys MP9320** (nivel RS232 ±12V) y el **microcontrolador ESP32** (nivel TTL 3.3V).

---

## 🧠 Objetivo

El objetivo de esta primera placa fue **probar la comunicación física entre el lector y el ESP32**, validando la correcta conversión de voltajes y la transmisión de datos por puerto serial.

Se buscó construir un **circuito compacto, confiable y reproducible**, que reemplazara los adaptadores comerciales utilizados durante las pruebas iniciales.

---

## ⚠️ Error detectado en la versión

Durante las pruebas de funcionamiento se detectó un **error en el diseño del circuito impreso (PCB)**.  
El problema consistía en **una pista faltante** que impedía la correcta conexión entre una de las líneas de transmisión del chip MAX3232 y el conector correspondiente.

Como resultado:
- El circuito **alimentaba correctamente el integrado**,  
  pero **no transmitía señal entre el lector y el ESP32**.  
- Las pruebas con osciloscopio mostraron ausencia de datos en el pin TX del lado TTL.  
- Se descartaron fallas del chip o del cableado, confirmando un **error de diseño** en la placa.

---

## 🔄 Resultado y corrección

A partir de este error, se procedió al rediseño completo de la placa, dando origen a la **Segunda_Placa**, que incluyó:
- Corrección de la pista faltante.  
- Reubicación de componentes para mayor claridad.  
- Trazado más limpio de las líneas de comunicación.  
- Testigo de funcionamiento (LED)
- Verificación del esquema con simulación previa a la fabricación.

Esta mejora permitió establecer una comunicación estable y definitiva entre el **lector RFID** y el **ESP32**.

---
