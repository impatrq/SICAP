import network
import time

def conectar():
    ssid = "Cooperadora Profesores"
    password = "Profes_IMPA_2022"

    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    if not wlan.isconnected():
        print(f"Conectando a {ssid}...")
        wlan.connect(ssid, password)
        for _ in range(20):  # espera hasta 10 segundos
            if wlan.isconnected():
                break
            time.sleep(0.5)

    if wlan.isconnected():
        print("✅ Conectado con IP:", wlan.ifconfig()[0])
        return True
    else:
        print("❌ No se pudo conectar a la red.")
        return False

