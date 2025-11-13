# API Endpoints - SICAP Backend

## 1. Recibir Tag
**POST /register/tag/**
- Recibe lecturas de tags RFID.
- Body JSON:
  ```json
  {
    "tag": "X123",
    "nombre": "opcional",
    "categoria": "persona" | "insumo" | null
  }
  ```
- Lógica:
  - Actualiza/crea RegistroTag.
  - Si es persona: solo actualiza la foto.
  - Si es insumo: gestiona asignaciones según ventana de 20s y reglas de préstamo/devolución.
- Respuestas:
  - `{status: "ok", accion: "persona_actualizada"}`
  - `{status: "ok", accion: "asignacion_creada", persona_tag: ...}`
  - `{status: "ok", accion: "sin_persona_candidata"}`
  - `{status: "ok", accion: "asignacion_cerrada"}`
  - `{status: "ok", accion: "asignacion_cerrada_otro_usuario", persona_tag: ...}`

## 2. Listar Tags
**GET /register/tag/list/**
- Devuelve todos los tags registrados.
- Respuesta: lista de objetos con id, tag, nombre, categoria, fecha_hora.

## 3. Listar Asignaciones
**GET /assignments/**
- Permite filtrar por activo y persona_tag.
- Query params:
  - `activo=1` (solo activas)
  - `persona_tag=XYZ` (solo de esa persona)
- Respuesta: lista de asignaciones.

## 4. Devolver Asignación
**PUT /assignments/<id>/devolver/**
- Cierra una asignación manualmente.
- Respuesta: `{status: "ok", msg: "Asignación cerrada."}`

## 5. Borrar Tags Sin Categoría
**POST /register/tag/bulk_delete/**
- Body JSON: `{ "tags": ["tag1", "tag2", ...] }`
- Borra masivamente tags sin categoría.
- Respuesta: `{status: "ok", borrados: <cantidad>}`

## 6. Eliminar Tag
**DELETE/POST /register/tag/<id>/eliminar/**
- Parámetro opcional: `force=1` para forzar borrado si hay asignaciones activas.
- Si hay asignaciones activas y no se usa force, devuelve error 409.
- Si se usa force, cierra las asignaciones antes de borrar.
- Respuesta: `{status: "ok", msg: "Tag eliminado."}`

---

## Notas de Lógica
- Cada herramienta tiene a lo sumo una asignación activa.
- La ventana de tiempo para asociar persona-insumo es de 20 segundos.
- El backend decide cuándo crear/cerrar asignaciones.
- El frontend solo muestra estado y permite devoluciones/borrados manuales.

## Ejemplo de Flujo
1. Persona pasa por el arco (POST /register/tag/ con categoria="persona").
2. Herramienta pasa por el arco (POST /register/tag/ con categoria="insumo").
3. Si la herramienta no tiene asignación activa y hay persona candidata en ventana, se crea asignación.
4. Si la herramienta tiene asignación activa, se cierra (devuelta), y solo se reasigna si vuelve a salir.

---

Para dudas sobre la lógica, revisar los comentarios en `views.py` o consultar este documento.