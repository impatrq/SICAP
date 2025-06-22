from machine import UART

class RFIDReader:
    def __init__(self, tx=17, rx=16, baudrate=9600):
        self.uart = UART(2, baudrate=baudrate, tx=tx, rx=rx)

    def read_tag(self):

        if self.uart.any():
            raw_data = self.uart.readline()

            if raw_data:
                try:

                    tag = raw_data.hex().upper()

                    return raw_data, tag
                
                except Exception:

                    return None
        return None