# SICAP - Backend

Este es el backend del sistema S.I.C.A.P., hecho con Django. Se encarga de recibir los datos enviados por el ESP32 (por ejemplo, los tags RFID) y guardarlos automáticamente en una base de datos.

Dicho en pocas palabras, el servidor interno de S.I.C.A.P.

---

## ¿Qué hace este servidor?

- Recibe datos a través del endpoint `/api/recibir/` en formato JSON.
- Guarda esos datos en la base, incluyendo el tag y la fecha/hora en que llegó.
- Más adelante, estos datos se van a poder consultar desde la web del proyecto.

---

## ¿Qué estructura tiene el proyecto?

- El proyecto Django se llama `sicap_backend`.
- Adentro hay una app llamada `registros`, que maneja todo lo relacionado a los tags RFID.

---

## ¿Qué modelo usamos para guardar los datos?

Dentro de la app `registros`, hay un modelo llamado `RegistroTag`. Guarda dos cosas:
- `tag_id`: el tag que mandó el ESP32.
- `fecha_hora`: se guarda automáticamente cuando llega el dato.

---

## ¿Qué falta?

- Conectar el ESP32 y hacer que mande el JSON real.
- Hacer pruebas con hardware real.
- En el futuro, conectar este backend con la página web para consultar todos los registros.

---

> ⚙️ Cualquier cambio en los modelos requiere correr:
>
> ```bash
> python3 manage.py makemigrations
> python3 manage.py migrate
> ```

---

## Estado: 🟡 En pruebas