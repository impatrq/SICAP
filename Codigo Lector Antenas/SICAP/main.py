import time  # Para manejar tiempos y timestamps
from rfid_reader import RFIDReader  # Importamos nuestra clase lectora RFID
import asignaciones  # Importamos la tabla de asignaciones como un módulo Python

lector = RFIDReader(tx=17, rx=16)  # Pines físicos que usás en el ESP32 para conectar el lector RS232

while True:
    tag = lector.read_tag()  # Llamamos a la función para leer un tag RFID

    if tag:
        print("Tag detectado:", tag)

            info = asignaciones.tabla[tag]  # Obtenemos la info de esa herramienta/persona
            print("Tag reconocido:", info)

            # Armamos los datos que vamos a enviar al servidor
            datos = {
                "rfid": tag,
                "nombre": info["nombre"],
                "tipo": info["tipo"],
                "timestamp": time.time()  # Marca de tiempo actual
            }

        else:
            # Si el tag no está registrado en nuestra tabla
            print("Tag no reconocido")

    time.sleep(1)  # Espera un segundo antes de volver a escanear