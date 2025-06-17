import time  # Para manejar tiempos y timestamps
import urequests  # Librería para hacer peticiones HTTP
from wifi import connect_wifi  # Importamos la función para conectarnos al WiFi
from rfid_reader import RFIDReader  # Importamos nuestra clase lectora RFID
import asignaciones  # Importamos la tabla de asignaciones como un módulo Python

SERVER_URL = "http://<IP HERMANA TITI>:5000/api/registro"

# --------------------------------------------
# Paso 1: Conectarse a la red WiFi configurada
# --------------------------------------------
connect_wifi()  # Se ejecuta la función de conexión, configurada en wifi.py

# --------------------------------------------
# Paso 2: Inicializar el lector RFID en los pines TX/RX que definimos
# --------------------------------------------
lector = RFIDReader(tx=17, rx=16)  # Pines físicos que usás en el ESP32 para conectar el lector RS232

# --------------------------------------------
# Paso 3: Iniciar el bucle principal que escanea constantemente
# --------------------------------------------
while True:
    tag = lector.read_tag()  # Llamamos a la función para leer un tag RFID

    if tag:
        print("🔍 Tag detectado:", tag)

        # --------------------------------------------
        # Paso 4: Verificamos si ese tag existe en nuestra tabla de asignaciones
        # --------------------------------------------
        if tag in asignaciones.tabla:
            info = asignaciones.tabla[tag]  # Obtenemos la info de esa herramienta/persona
            print("✅ Tag reconocido:", info)

            # Armamos los datos que vamos a enviar al servidor
            datos = {
                "rfid": tag,
                "nombre": info["nombre"],
                "tipo": info["tipo"],
                "timestamp": time.time()  # Marca de tiempo actual
            }

            # --------------------------------------------
            # 🧠 Paso 5: Enviar los datos por WiFi a la Raspberry Pi usando POST
            # --------------------------------------------
            try:
                response = urequests.post(SERVER_URL, json=datos)
                print("📡 Datos enviados:", response.text)
                response.close()

            # --------------------------------------------
            # 🧠 Si algo sale mal (no hay WiFi, IP incorrecta, servidor caído, etc)
            # --------------------------------------------
            except Exception as e:
                print("❌ Error al enviar datos al servidor:", e)

        else:
            # Si el tag no está registrado en nuestra tabla
            print("⚠️ Tag no reconocido")

    time.sleep(1)  # Espera un segundo antes de volver a escanear