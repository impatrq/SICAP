import time
from Reader import RFIDReader

lector = RFIDReader(tx=17, rx=16)

while True:
    tag = lector.read_tag()

    if tag:
        print("Tag detectado:", tag)

    else:
            print("Tag no reconocido")

    time.sleep(1)

