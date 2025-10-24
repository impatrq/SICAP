# 🔌 Placa Conversora RS232 ↔ TTL – Proyecto SICAP

La **placa conversora RS232 ↔ TTL** fue diseñada como parte del sistema **SICAP** con el fin de permitir la comunicación directa entre el **lector RFID industrial SAMSys MP9320** y el **microcontrolador ESP32**.  
Dado que ambos dispositivos trabajan con niveles eléctricos diferentes, este circuito actúa como **interfaz de adaptación de señal** para garantizar una comunicación serial estable, segura y bidireccional.

---

## ⚙️ Propósito de la placa

- Adaptar los niveles de voltaje entre el lector RFID (RS232 ±12 V) y el ESP32 (TTL 3.3 V).  
- Permitir la transmisión y recepción de comandos seriales sin distorsión.  
- Asegurar la integridad de los datos durante la comunicación continua.  
- Reducir el riesgo de daño en los pines del microcontrolador por diferencia de tensiones.

---

## 🧠 Descripción técnica

El circuito está basado en el integrado **MAX3232**, un conversor de nivel de voltaje compatible con microcontroladores modernos de 3.3 V.  
Su función es traducir las señales **TX** y **RX** del lector RFID a niveles seguros y comprensibles para el ESP32, y viceversa.

### Características principales
- **Chip:** MAX3232 (compatible con 3.3 V y 5 V).  
- **Alimentación:** 3.3 V proveniente del ESP32.  
- **Entradas/salidas:**  
  - Lado RS232: conector DB9 (lector RFID).  
  - Lado TTL: pines TX, RX, GND hacia el ESP32.  
- **Frecuencia de transmisión:** hasta 250 kbps.  
- **Protección:** capacitores de desacople y diodos de protección en líneas críticas.

---

## 🧩 Integración en el sistema

La placa conversora forma parte del **bloque de hardware principal** del proyecto.  
Cumple el rol de intermediario entre el lector RFID y el microcontrolador:

Lector RFID (RS232)  ⇄  Placa Conversora  ⇄  ESP32 (TTL 3.3V)
El firmware del ESP32 se comunica a través de esta placa utilizando comandos ASCII, como por ejemplo `A,0!`, `Rd`, `Z!`, etc.  
El lector responde con tramas del tipo `{Rd,d:300833B2DDD9014035050000,t:EPC1G2}`, que son luego interpretadas por el firmware y enviadas al servidor SICAP.

---

## 🧪 Pruebas de validación

- **Conversión de señal:** Verificada con osciloscopio y mediciones en ambos lados.  
- **Comunicación estable:** Confirmada entre el lector y el ESP32 a distintas tasas de baudios.  
- **Integridad de datos:** Sin pérdida de información en lecturas prolongadas.  
- **Protección eléctrica:** Validada sin sobrecargas ni fallos por inversión de polaridad.  

---

## 🔩 Materiales utilizados

- 1 × Integrado **MAX3232**  
- 4 × Capacitores de 0.1 µF (para carga y desacople)  
- 1 × Conector DB9 hembra (para el lector)  
- 1 × Header macho 3 pines (TX, RX, GND hacia el ESP32)  
- 1 × Placa PCB diseñada y fabricada por el grupo SICAP  
- Cables Dupont y jumpers de conexión

---
