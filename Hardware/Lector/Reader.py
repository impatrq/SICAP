from machine import UART
import time

class RFIDReader:
    def __init__(self, tx=17, rx=16, baudrate=9600):
        self.uart = UART(2, baudrate=baudrate, tx=tx, rx=rx)

    def read_tag(self):
        if self.uart.any():
            raw_data = self.uart.read()  
            if raw_data:
                try:
                    tag = raw_data.hex().upper()
                    return tag
                except Exception as e:
                    print("Error al procesar:", e)
        return None

