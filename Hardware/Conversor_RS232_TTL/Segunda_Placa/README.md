# RS232 a TTL

Este módulo es un conversor de señal RS232 a TTL, utilizado en el proyecto SICAP para permitir la comunicación entre el microcontrolador ESP32 y el lector RFID que trabaja con señal RS232.

---

**¿Por qué lo hicimos?**  
Los lectores RFID comerciales que conseguimos trabajan bajo el protocolo RS232, pero el ESP32 solo puede interpretar señales TTL (3.3V/5V). Por eso, diseñamos e implementamos esta plaqueta para hacer la conversión y asegurar una lectura estable y sin errores.

---

**🛠️ Componentes usados**  
- MAX232
- Capacitores de desacople (1µF)  
- PCB diseñada a medida (archivos incluidos)  
- Pines macho para conexión a protoboard

---

**📂 Archivos incluidos**  
- `esquematico.pdf`: Diagrama del circuito  
- `pcb_layout.png`: Imagen de la placa diseñada  
- `README.md`: Este archivo  

> Si aún no subiste los archivos, podés preparar esos .pdf y capturas para completar este README.

---

**📈 Estado del módulo**  
✅ Probado con ESP32 y lector RFID  
✅ Confirmada la lectura estable de tarjetas  
