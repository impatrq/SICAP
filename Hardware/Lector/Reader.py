from machine import UART
import time

# Este es el largo de bits de un tag.
id_bytes = 8

class RFIDReader:
    def __init__(self, tx=17, rx=16, baudrate=9600):
        self.uart = UART(2, baudrate=baudrate, tx=tx, rx=rx)

    def read_tag(self):
        # Si hay datos disponibles...
        if self.uart.any():
            raw_data = self.uart.read(id_bytes)
            
            # Solo procesamos si recibimos la cantidad exacta de bytes esperada.
            if raw_data and len(raw_data) == id_bytes:
                
                return raw_data.hex().upper()
        
        return None
