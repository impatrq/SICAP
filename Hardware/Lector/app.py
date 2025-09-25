import time
from Reader import RFIDReader
import urequests
import wifi

SSID = "SICAP"
PASSWORD = "graciasamigo"
SERVER_IP = "192.168.111.218"  
API_URL = f"http://{SERVER_IP}:5000/api/v1/register/tag/"


LOOP_DELAY_MS = 50          
STABLE_READS = 3            
ABSENCE_MS = 600            

lector = RFIDReader(tx=17, rx=16)


current_tag = None    
stable_tag = None        
stable_count = 0            
last_seen_ms = time.ticks_ms() 

print("Iniciando programa...")
wifi.connect_to(SSID, PASSWORD)
print("\nListo. Esperando tags...")

def send_tag(tag_val):
    try:
        
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
    tag_detectado = lector.read_tag()  
    if tag_detectado:
        
        last_seen_ms = now

        
        if tag_detectado == stable_tag:
            stable_count += 1
        else:
            stable_tag = tag_detectado
            stable_count = 1

       
        if current_tag is None and stable_count >= STABLE_READS:
            print(f"Tag detectado estable: {stable_tag}. Enviando al servidor…")
            send_tag(stable_tag)
            current_tag = stable_tag  
    else:
        
        if current_tag is not None and time.ticks_diff(now, last_seen_ms) > ABSENCE_MS:
            
            print("Tag retirado. Listo para próximo registro.")
            current_tag = None
            stable_tag = None
            stable_count = 0

    time.sleep_ms(LOOP_DELAY_MS)