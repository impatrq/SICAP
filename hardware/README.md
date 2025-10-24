# 🧰 Hardware – Proyecto SICAP

El directorio **`hardware/`** reúne todos los diseños, esquemas, prototipos y componentes físicos desarrollados para el proyecto **SICAP**.  
Aquí se documenta la parte **electrónica y estructural** del sistema, incluyendo las placas de conexión, adaptadores, antenas y configuraciones del lector RFID.

---

## ⚙️ Propósito del módulo de hardware

El objetivo del área de hardware dentro del proyecto SICAP es **garantizar la comunicación estable y confiable entre el lector RFID SAMSys MP9320, el microcontrolador ESP32 y las antenas UHF**, asegurando que el sistema funcione correctamente tanto a nivel eléctrico como de señal.


## 🔩 Componentes principales

| Componente | Función | Descripción |
|-------------|----------|-------------|
| **SAMSys MP9320** | Lector RFID UHF | Captura las etiquetas EPC Gen2. |
| **ESP32 DevKit V1** | Microcontrolador | Ejecuta el firmware y envía datos al servidor. |
| **Conversor RS232–TTL** | Adaptador de señal | Permite la comunicación entre el lector y el ESP32. |
| **Antenas UHF** | Módulo lector pasivo | Detectan las etiquetas dentro del área de cobertura. |

---
