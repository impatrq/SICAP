import time
from Reader import RFIDReader


lector = RFIDReader(tx=17, rx=16)

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

        # Actualizamos el tiempo de la última vez que vimos un tag.
        time_lastag = tiempo_actual

    else:
        
        if lastag is not None and (tiempo_actual - time_lastag) > TIMEOUT:
            
            print()
            
            # Reiniciamos las variables, para un nuevo tag.
            lastag = None
            read_count = 0
            
    time.sleep(0.2)