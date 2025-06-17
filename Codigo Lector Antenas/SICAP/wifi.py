import network  # Módulo para gestionar la conexión WiFi
import time     # Para agregar delays entre reintentos de conexión

# Esta función conecta el ESP32 a una red WiFi y devuelve la IP si fue exitosa
def connect_wifi():
    
    ssid = 'Cooperadora Alumnis'          # 🔧 Nombre de tu red WiFi
    password = ''  # 🔧 Contraseña de tu red WiFi

    wlan = network.WLAN(network.STA_IF)  # Creamos una interfaz WiFi en modo estación (cliente)
    wlan.active(True)                    # Activamos esa interfaz

    # Si no estamos conectados aún...
    if not wlan.isconnected():
        print('Conectando a la red WiFi...')
        wlan.connect(ssid, password)     # Intentamos conectar con los datos

        
        timeout = 10  # Tiempo máximo para esperar conexión (en segundos)
        
        while not wlan.isconnected() and timeout > 0:
            print("Esperando conexión...")
            
            time.sleep(1)                # Esperamos 1 segundo entre reintentos
            timeout -= 1                 # Reducimos el contador

    # Si la conexión fue exitosa
    if wlan.isconnected():
        
        print('✅ Conectado al WiFi')
        ip = wlan.ifconfig()[0]          # Obtenemos la dirección IP asignada
       
        print('📡 Dirección IP:', ip)
        
        return ip                        # Devolvemos la IP
    
    else:
        print('❌ No se pudo conectar al WiFi')
        return None                      # Si falló, devolvemos None