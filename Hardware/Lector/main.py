import time
from Reader import RFIDReader
import urequests
import wifi

lector = RFIDReader(tx=17, rx=16)
wifi.conectar()

lastag = None 
read_count = 0
time_lastag = 0
TIMEOUT = 1.5 

print("Esperando tags...")

while True:
    tag = lector.read_tag()
    tiempo_actual = time.time()

    if tag:
        if tag != lastag:
            if lastag is not None:
                print()
            lastag = tag
            read_count = 1
        else:
            read_count += 1

        print(f"{lastag} X{read_count}", end='\r')
        time_lastag = tiempo_actual

        # ✅ Mandar al servidor (cambiar IP si hace falta)
        try:
            response = urequests.post("http://192.168.111.250:8000/api/recibir/",
                                      json={"tag": tag})
            response.close()
        except Exception as e:
            print("Error al enviar:", e)

    else:
        if lastag is not None and (tiempo_actual - time_lastag) > TIMEOUT:
            print()
            lastag = None
            read_count = 0

    time.sleep(0.2)



