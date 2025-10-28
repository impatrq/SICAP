import time
from Reader import RFIDReader
import urequests
import wifi

SSID = "SICAP"
PASSWORD = "graciasamigo"
SERVER_IP = "192.168.111.218"  # Django
API_URL = f"http://{SERVER_IP}:5000/api/v1/register/tag/"

# Parámetros  robustez
LOOP_DELAY_MS = 50          # 20 Hz de chequeo
STABLE_READS = 3            # lecturas consecutivas iguales para considerar "estable"
ABSENCE_MS = 600            # cuánto tiempo sin leer nada para considerar que se retiró

# 👉 Igual que el tester: UART2 (GPIO16/17) a 57600
lector = RFIDReader(tx=17, rx=16, uart_id=2, baudrate=38400)

# Estado
current_tag = None          # tag "latched" (enviado y sostenido)
stable_tag = None           # último tag visto para conteo de estabilidad
stable_count = 0            # lecturas consecutivas del mismo tag
last_seen_ms = time.ticks_ms()  # última vez que se leyó ALGÚN tag

print("Iniciando programa...")
wifi.connect_to(SSID, PASSWORD)
print("\nListo. Esperando tags...")

def send_tag(tag_val):
    try:
        # Si tu API espera "tag" como clave, dejamos así. Si espera "tag_id", cambiar.
        payload = {"tag": tag_val}
        resp = urequests.post(API_URL, json=payload)
        status = resp.status_code
        body = ""
        try:
            body = resp.text
        except Exception:
            pass
        resp.close()
        if 200 <= status < 300:
            print("✅ Servidor respondió: Tag registrado.")
        else:
            print(f"❌ Error del servidor: {status} {body}")
    except Exception as e:
        print("❌ Error de conexión al enviar el tag:", e)

while True:
    now = time.ticks_ms()
    tag_detectado = lector.read_tag()  # Debe devolver str/None; si devuelve "" tratala como None

    if tag_detectado:
        print(tag_detectado)

        # Actualizamos "última vez visto algo"
        last_seen_ms = now

        # Debounce por lecturas consecutivas
        if tag_detectado == stable_tag:
            stable_count += 1
        else:
            stable_tag = tag_detectado
            stable_count = 1

        # Si no hay tag latched aún y el tag está estable suficiente, disparamos
        if current_tag is None and stable_count >= STABLE_READS:
            print(f"Tag detectado estable: {stable_tag}. Enviando al servidor…")
            send_tag(stable_tag)
            current_tag = stable_tag  # quedamos en HELD

    else:
        # No se leyó tag en este ciclo.
        # Si había un tag latched, soltamos solo si pasó tiempo de ausencia suficiente
        if current_tag is not None and time.ticks_diff(now, last_seen_ms) > ABSENCE_MS:
            # Consideramos que se retiró el tag → volvemos a IDLE
            print("Tag retirado. Listo para próximo registro.")
            current_tag = None
            stable_tag = None
            stable_count = 0

    time.sleep_ms(LOOP_DELAY_MS)
