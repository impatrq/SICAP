import time
from Reader import RFIDReader
import urequests
import wifi

ssid = "SICAP"
password = "graciasamigo"
SERVER_IP = "192.168.111.218"  # La IP de la PC con el servidor Django
API_URL = f"http://{SERVER_IP}:8000/admin/registros/registrotag/"
TIMEOUT_TAG = 2.0  


lector = RFIDReader(tx=17, rx=16)
ultimo_tag_enviado = None
tiempo_ultimo_envio = 0

print("Iniciando programa...")

# Conectamos al WiFi
if not wifi.conectar(ssid, password):
    print("Error crítico de Wi-Fi. El programa se detendrá.")
    
    while True:
        time.sleep(1)

print("\nListo. Esperando tags...")


while True:
    tag_detectado = lector.read_tag()

    if tag_detectado:
        tiempo_actual = time.time()
        print ("tag detectado")
        
        # Lógica para evitar enviar el mismo tag repetidamente
        if tag_detectado != ultimo_tag_enviado or (tiempo_actual - tiempo_ultimo_envio) > TIMEOUT_TAG:
            print(f"Tag detectado: {tag_detectado}. Enviando al servidor...")
            
            try:
                # Preparamos el JSON con la clave correcta "tag_id"
                json_data = {"tag": tag_detectado}
                response = urequests.post(API_URL, json=json_data)
                
                if response.status_code >= 200 and response.status_code > 300:
                    print("✅ Servidor respondió: Tag registrado.")
                else:
                    print(f"❌ Error del servidor: {response.status_code} {response.text}")
                
                response.close()
                
                # Actualizamos el estado para no volver a enviarlo inmediatamente
                ultimo_tag_enviado = tag_detectado
                tiempo_ultimo_envio = tiempo_actual
                
            except Exception as e:
                print("❌ Error de conexión al enviar el tag:", e)
        
        
    
    # Pausa breve para no saturar el procesador
    time.sleep(0.1)
