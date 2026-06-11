# QA Manual del Organigrama Modernizado

Fecha: 2026-05-19
Ruta a probar: `/directory/work-position-org-chart`
Objetivo: validar la vista nueva basada en `ngx-graph` con datos reales y detectar ajustes de UX antes de cierre final.

## Cuando necesito que pruebes

Haz pruebas cuando puedas abrir la ruta real del modulo en tu entorno y tengas datos del customer que representen al menos uno de estos escenarios:

- un root unico
- varios roots
- un puesto vacante
- al menos una rama con varios hermanos

Si puedes, necesito una primera pasada manual en cuanto entres al componente y una segunda pasada solo si detectas algo raro despues de mover nodos.

## Que necesito que me compartas

Para cada problema o confirmacion, idealmente comparte:

- si el caso paso o fallo
- pasos exactos
- resultado esperado
- resultado observado
- una captura de pantalla si el problema es visual
- si aparece toast o error, el texto exacto
- si ves error en consola o en network, una captura o el texto del error

Formato sugerido:

```text
Caso: Reordenar antes de un hermano
Resultado: Falla
Pasos:
1. Abrir /directory/work-position-org-chart
2. Ir a Editar
3. Arrastrar SUP-02 a la franja superior de SUP-01
Esperado:
- SUP-02 queda antes de SUP-01
Observado:
- El drop cae como cambio de jefe, no como reorder
Errores:
- Sin toast
- Sin error de red
```

## Checklist funcional

### 1. Carga inicial

- [ ] La ruta abre sin error de pantalla en blanco.
- [ ] El grafo se renderiza.
- [ ] Se muestran puestos y vacantes.
- [ ] El zoom, pan y minimapa funcionan.
- [ ] No aparece el error `No provider found for _LayoutService`.

### 2. Modo visualizacion

- [ ] Al hacer click en un puesto con empleado se abre el drawer.
- [ ] El drawer muestra nombre, puesto, departamento y nivel.
- [ ] En vacantes, el drawer no rompe y muestra datos coherentes.
- [ ] `Esc` cierra el drawer si esta abierto.

### 3. Modo edicion por seleccion

- [ ] Se puede activar `Editar`.
- [ ] Al seleccionar un origen aparece el tag `Origen`.
- [ ] Al seleccionar un destino valido aparece confirmacion.
- [ ] Al confirmar, el nodo cambia de jefe correctamente.
- [ ] Al cancelar, no se persiste ningun cambio.
- [ ] `Esc` limpia la seleccion actual.

### 4. Drag and drop sobre otro puesto

- [ ] Se puede arrastrar una card sobre otra.
- [ ] El hover visual del drop se entiende con claridad.
- [ ] Al soltar sobre otra card, el movimiento se interpreta como cambio de jefe.
- [ ] El resultado persistido coincide con lo esperado al recargar.

### 5. Drag and drop a raiz

- [ ] La zona `Suelta aqui para mover el puesto al nivel raiz` es visible en modo edicion.
- [ ] Al soltar un nodo ahi, el puesto sube a raiz.
- [ ] El resultado persistido coincide al recargar.

### 6. Reordenamiento entre hermanos

- [ ] `Subir` y `Bajar` funcionan para un nodo seleccionado.
- [ ] Las franjas superior e inferior de una card funcionan como `antes` y `despues`.
- [ ] El reorder no se confunde con cambio de jefe.
- [ ] El orden nuevo se conserva al recargar.

### 7. Validaciones

- [ ] No permite mover un puesto sobre si mismo.
- [ ] No permite crear ciclos moviendo un padre debajo de un descendiente.
- [ ] Si la API rechaza el cambio, aparece feedback de error y la seleccion se conserva.

### 8. Responsive y accesibilidad basica

- [ ] En ancho pequeno la pantalla sigue siendo usable.
- [ ] Se puede hacer pan/zoom sin que la UI quede inutilizable.
- [ ] Con teclado, `Enter` o `espacio` activa la card enfocada.
- [ ] Los focus states se ven con claridad.

## Casos prioritarios

Si no hay tiempo para todo, necesito primero estos 5:

1. Abrir la ruta y confirmar que carga.
2. Abrir drawer de un puesto y de una vacante.
3. Cambiar un puesto de jefe por drag and drop.
4. Mover un puesto a raiz.
5. Reordenar dos hermanos y recargar para confirmar persistencia.

## Señales de alerta que quiero ver de inmediato

Avísame en cuanto veas cualquiera de estos:

- pantalla en blanco
- error en consola
- el nodo desaparece despues de moverlo
- el reorder cambia de jefe en lugar de solo cambiar orden
- el cambio se ve bien pero al recargar vuelve al estado anterior
- el drawer deja de abrir
- la zona de drop es demasiado sensible o imposible de acertar
