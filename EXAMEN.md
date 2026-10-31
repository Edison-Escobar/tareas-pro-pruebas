# Parte 2 · El reto

**55 minutos · 60 puntos**

Esta es tu copia. Los errores que tiene **no son los mismos que los de tu
compañero**: se sembraron a partir de tu carné. Copiar la pantalla de al lado
no te sirve; entender lo que pasa, sí.

---

## Qué hay aquí

Una versión de *Tareas Pro* con **cinco errores sembrados**, uno por cada tema
del parcial:

| Tema | De dónde viene |
|---|---|
| Server y Client Components | Semana 7 |
| TanStack Query, Zod y formularios | Semana 8 |
| Tiempo real con SSE | Semana 9 |
| Cuerpo crudo y firma | Semana 10 |
| Rendimiento y accesibilidad | Semana 11 |

Ninguno es un error de dedo ni una llave que falta. Todos son los errores que
ya vimos en clase, puestos en un lugar nuevo.

---

## Arranque

```bash
pnpm install
cp .env.local.ejemplo .env.local   # y pega los dos valores del pizarrón
pnpm dev
```

Abre <http://localhost:3000>.

---

## Cómo sabes que vas bien

Hasta abajo de la página hay un botón **Entregar**. Al presionarlo corre siete
pruebas contra tu aplicación y te dice, una por una, cuál pasa y cuál no.

Úsalo desde el primer minuto. No es el final: es tu tablero.

| | |
|---|---|
| `p1_lista` | La lista llega del servidor y es la que se ve en pantalla |
| `p2_validacion` | El servidor rechaza un título inválido |
| `p3_se_actualiza` | Al crear una tarea, la lista se actualiza sola |
| `p4_marcar` | Marcar una tarea como hecha responde bien |
| `p5_en_vivo` | El canal en vivo entrega mensajes |
| `p6_portada` | La portada reserva su espacio y no se carga en diferido |
| `p7_contraste` | El botón principal pasa el mínimo AA de 4.5 a 1 |

La octava prueba es que tu entrega **exista**: si el cuerpo que mandas no va
firmado como el servidor espera, no se guarda nada.

Puedes entregar cuantas veces quieras. Se califica la última.

---

## Las reglas

1. **No toques `lib/pruebas.ts`.** Tu entrega incluye el sha256 de ese archivo.
   Si lo editas, se ve.
2. Por cada error que arregles, deja un comentario en la línea donde estaba:

   ```ts
   // FIX: el mensaje SSE terminaba en un solo salto de línea, así que
   // el navegador nunca lo daba por cerrado y onmessage no disparaba.
   ```

   Esos comentarios valen 10 de los 60 puntos. Explican que entendiste, no
   que adivinaste.
3. Puedes ver tus apuntes, tu código de las semanas pasadas y la documentación.
   No puedes ver la pantalla de otro.

---

## Reparto de los 60 puntos

| | |
|---|---|
| Los 5 errores arreglados (8 pts cada uno) | 40 |
| La entrega llega a Supabase | 10 |
| Los comentarios `// FIX:` explican el porqué | 10 |

---

## Si se te cae todo

Si la aplicación ni siquiera compila y no puedes llegar al botón:

```bash
pnpm entregar
```

Registra que estuviste aquí y lo que alcanzaste a averiguar. Vale menos que
entregar bien. Vale mucho más que no entregar.
