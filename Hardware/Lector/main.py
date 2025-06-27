import time
from Reader import RFIDReader

lector = RFIDReader(tx=17, rx=16)

Cooldown = 5 
lastag = None
time_lastag = 0

print("Esperando tags...")

while True:
    
    tag = lector.read_tag()

    if tag:
        tiempo_actual = time.time()
        
        if tag != lastag or (tiempo_actual - time_lastag) > Cooldown:
            

            print("Tag leído", {tag})
            
            # Actualizo las variables de control
            lastag = tag
            time_lastag = tiempo_actual
    

    time.sleep(3)
