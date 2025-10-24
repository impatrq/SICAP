# ⚙️ Carpeta Técnica – Proyecto SICAP

La **carpeta técnica** reúne toda la información de diseño, desarrollo y pruebas del sistema **SICAP**.  
Contiene la **versión más actualizada** de la documentación técnica del proyecto, incluyendo diagramas, especificaciones, pruebas de hardware y detalles de integración entre los distintos módulos.

---

## 🧱 Descripción técnica del sistema

El proyecto SICAP combina componentes de **hardware, software y red** para crear un sistema capaz de identificar recursos mediante tecnología RFID y registrar la información automáticamente en una base de datos central.

### 🔌 Hardware principal

| Componente | Descripción | Función |
|-------------|-------------|----------|
| **ESP32 DevKit V1** | Microcontrolador principal | Control del lector RFID y conexión WiFi |
| **SAMSys MP9320** | Lector RFID UHF | Lectura de etiquetas EPC Gen2 |
| **Antenas UHF** | Hasta 4 antenas | Detección de objetos en distintas zonas |
| **Conversor RS232–TTL** | Adaptador serial | Comunicación entre el lector y el ESP32 |
| **Fuente 12V / 5A** | Alimentación | Energía estable para el sistema completo |

---

## 🧩 Integración del sistema

1. El **ESP32** ejecuta el firmware en **MicroPython** que controla el lector RFID.  
2. Las lecturas se procesan y se envían al **servidor Django** a través de una red WiFi local.  
3. El **backend** almacena los datos y los expone a la **aplicación web** para visualización y control.  
4. El sistema es escalable y permite futuras integraciones con nuevas antenas o lectores.

---

## 🧾 Actualización y control de versiones

La presente carpeta contiene **la última versión de la carpeta técnica**, actualizada con las pruebas, esquemas y documentación final del proyecto SICAP.  

---
