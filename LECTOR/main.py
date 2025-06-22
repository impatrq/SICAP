import time
from Reader import RFIDReader

lector = RFIDReader(tx=17, rx=16)

while True:
    try:
        tag = lector.read_tag()

        if tag:

            print("Tag leído:", tag)

        else:
            
            print("No se detectó ningún tag.")

    except Exception as e:
        
        print("Error al procesar el tag:", e)

    time.sleep(1)