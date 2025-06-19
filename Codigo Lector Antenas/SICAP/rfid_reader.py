from machine import UART  # Módulo para usar puertos UART (comunicación serial)
import time               # Para delays entre lecturas

# Creamos una clase que maneja el lector RFID conectado por UART
class RFIDReader:
    def __init__(self, tx=17, rx=16, baudrate=9600):
        """
        Inicializa la conexión UART con los pines y velocidad deseados.
        """
        self.uart = UART(2, baudrate=baudrate, tx=tx, rx=rx)  # UART2 en ESP32

    def read_tag(self):
         # Verificamos si hay datos disponibles para leer en la UART (datos enviados por la antena UHF)
        if self.uart.any():                         # Verifica si hay datos disponibles en UART
            raw_data = self.uart.readline()         # Lee la línea completa
            if raw_data:                            # Si recibió datos...
                try:
                    
                    return tag                      # Devuelve el tag
                
                except Exception as e:
                    
                    print("Error al procesar el tag:", e)
        
        return None                                  # Si no hay datos o falla, devuelve None