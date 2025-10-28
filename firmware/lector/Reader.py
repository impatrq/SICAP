from machine import UART

class RFIDReader:
    def __init__(self, tx=17, rx=16, baudrate=38400, uart_id=2):
        self.uart = UART(uart_id, baudrate=baudrate, tx=tx, rx=rx,
                        timeout=100, timeout_char=20)
        self._buf = ""

    def _extract_first_epc(self, s: str):
        """
        Extrae el primer EPC entre 'd:' y ',', ';' o '}'.
        Devuelve (epc, end_index) o (None, None).
        end_index es el índice hasta donde se consumió el buffer.
        """
        d = s.find("d:")
        if d == -1:
            return None, None
        d += 2
        end = len(s)
        for ch in (",", ";", "}"):
            p = s.find(ch, d)
            if p != -1 and p < end:
                end = p
        if end <= d:
            return None, None

        epc = s[d:end].strip()
        # validar HEX
        for c in epc:
            if c not in "0123456789ABCDEFabcdef":
                return None, None
        return epc.upper(), end  # consumimos hasta end

    def read_tag(self):
        """
        Devuelve UN EPC (str) por llamada, o None si no hay todavía.
        Misma filosofía que el tester: acumular y extraer por 'd:'.
        """
        data = self.uart.read()
        if data:
            try:
                self._buf += data.decode("latin1", "ignore")
            except:
                pass

        # si el buffer está muy grande, recortamos del principio
        if len(self._buf) > 4096:
            self._buf = self._buf[-512:]

        epc, end = self._extract_first_epc(self._buf)
        if epc:
            # consumimos el buffer hasta el fin del EPC encontrado
            self._buf = self._buf[end:]
            return epc

        return None

