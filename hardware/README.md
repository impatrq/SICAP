# ⚙️ Conversor RS232–TTL - Proyecto SICAP

Este módulo documenta el desarrollo y las pruebas del **conversor RS232–TTL** utilizado para conectar el lector **SAMSys MP9320** con el **ESP32** del sistema **SICAP**.  
El conversor fue diseñado y fabricado por el equipo para adaptar las señales eléctricas entre ambos dispositivos.

---

## 🔌 Propósito

El lector RFID **SAMSys MP9320** utiliza comunicación **RS232**, mientras que el **ESP32** trabaja con niveles de **TTL (3.3V)**.  
Para permitir la comunicación segura y estable entre ambos, se diseñó este conversor que:
- Reduce el voltaje de transmisión RS232 a niveles TTL.  
- Asegura la integridad de datos en ambos sentidos.  
- Permite mantener el cableado corto y estable en entorno industrial.  

---

## 🧪 Validación

Durante las pruebas se verificó:
- Comunicación bidireccional entre el lector y el ESP32.  
- Sincronización estable en 9600 bps.  
- Tolerancia a variaciones de tensión sin pérdida de datos.  
- Funcionamiento continuo superior a 2 horas sin errores detectados.

---

## 📸 Documentación adicional
Las imágenes, esquemas y resultados de mediciones se encuentran dentro de cada subcarpeta.
---

> 🔩 *El conversor RS232–TTL fue un componente clave para lograr la integración física entre el firmware y el lector RFID dentro del sistema SICAP.*