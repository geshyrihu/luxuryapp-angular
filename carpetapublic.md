🔥 Cambio clave (oficial / comportamiento actual)

Angular ahora usa la carpeta public/ como reemplazo del antiguo src/assets.

Antes:

src/assets/

Ahora:

public/

Y esto ya viene configurado automáticamente en angular.json:

"assets": [
{
"glob": "**/*",
"input": "public"
}
]

➡️ Esto significa que todo lo que pongas en public/ se copia directamente al build (dist)

📁 ¿Cómo funciona public/?
Es la carpeta de archivos públicos (estáticos).
Angular CLI la trata como root público del proyecto.
No necesitas configurarla manualmente.

Ejemplo de estructura:

public/
├── assets/
│ └── images/
│ └── logo.png
├── favicon.ico
└── data.json
🧠 Cómo usar los archivos (IMPORTANTE)
✔️ Forma correcta (Angular moderno)

No incluyes public en la ruta:

<img src="assets/images/logo.png">

o incluso:

<img src="/logo.png">

➡️ Porque Angular sirve public/ como raíz /

⚠️ Diferencia con Angular antiguo
Angular < 17 Angular 18+
src/assets public/
Requiere config explícita Ya viene configurado
Ruta: assets/... Igual, pero desde public
🔄 ¿Puedo seguir usando assets?

Sí, tienes dos opciones:

Opción 1 — Usar public (recomendado)
Nuevo estándar
Menos configuración
Opción 2 — Mantener src/assets

Agregando en angular.json:

"assets": [
{
"glob": "**/*",
"input": "public"
},
{
"glob": "**/*",
"input": "src/assets",
"output": "/assets"
}
]

➡️ Esto permite coexistir ambos enfoques

📌 Concepto importante (clave mental)

Angular cambió el naming para hacerlo más claro:

public = archivos que se publican tal cual (sin procesamiento)
assets = solo era una convención, no una limitación real

Angular realmente solo copia archivos según angular.json, no le importa el nombre de la carpeta

🧾 Resumen claro
public/ reemplaza a assets/ por defecto desde Angular 18+
Todo dentro de public se expone como raíz /
No necesitas modificar angular.json
Puedes seguir usando assets si lo configuras manualmente
