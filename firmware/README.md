# ⚙️ Firmware – Proyecto SICAP

El directorio **`firmware/`** contiene todo el código encargado de la **lógica interna y control físico** del sistema **SICAP (Sistema de Control y Administración de Producción)**.  
Aquí se desarrollan los programas que permiten la comunicación entre el **hardware RFID** y **microcontrolador ESP32**.

---

## 🧠 Función general del firmware

- Controlar el **lector RFID SAMSys MP9320** mediante comandos seriales.
- Administrar la lectura y envío de datos de las **antenas UHF**.
- Establecer la conexión WiFi con la red local.
- Formatear los datos y enviarlos en formato **JSON** al servidor Django.
- Permitir la depuración y monitoreo desde Thonny o VS Code.

---

## 🔗 Comunicación general

1. El **ESP32** se conecta por **RS232** al lector RFID.  
2. El firmware ejecuta comandos ASCII (`A,0!`, `Rd`, etc.).  
3. Los datos EPC leídos se procesan y filtran.  
4. Se envían al **servidor SICAP** vía HTTP POST:
   ```json
   {
     "epc": "300833B2DDD9014035050000",
     "timestamp": "2025-10-24T10:00:00"
   }