DIAGNOSTICO: Desalineacion Vertical Input + Button

========================================
PROBLEMA
========================================
En member-list.html lineas 3-21, los elementos no estan alineados verticalmente:
unos quedan arriba y otros abajo.

========================================
ESTRUCTURA ACTUAL
========================================

<div class="flex gap-3 align-items-end mb-4 flex-wrap">
  <custom-input-select-signal label="Propiedad" ... />
  <custom-button label="Buscar" iconClass="pi pi-search" ... />
  <custom-button label="Vincular Miembro" ... />
</div>

========================================
CAUSA RAIZ
========================================
El problema tiene 2 componentes:

1. BASE-INPUT-SIGNAL (base-input-signal.ts lineas 41-57)
   - Usa class="field" por defecto
   - Pero en horizontal=false (valor por defecto de horizontal() es true)
   - El label tiene: display: block y margin-bottom: 0.5rem
   - El field-content wrapper es el que envuelve el input de PrimeNG
   - El input de PrimeNG (p-select) tiene su propia altura

2. CUSTOM-BUTTON (custom-button.ts lineas 39-67)
   - Wrapeado en: <div class="flex w-full justify-content-end">
   - El button interno usa: inline-flex align-items-center
   - Pero el wrapper exterior tiene: justify-content-end
   - El boton tiene padding interno que afecta su altura visual

========================================
POR QUE SE DESALINEAN
========================================

1. El input tiene:
   - Label arriba + campo de input + mensajes de error
   - Altura total variable depende del contenido

2. El boton tiene:
   - Solo el boton (icono + texto)
   - Altura fija determinada por el padding del btn class

3. Cuando se usan juntos en un flex container:
   - align-items-end alinea por la linea base del texto
   - Pero el input tiene su linea base en el campo de texto
   - Mientras el boton tiene su linea base en el centro del boton
   - RESULTADO: el boton queda mas arriba que el input

========================================
SOLUCION
========================================
Opcion 1: Alinear por el centro del contenedor

---

Cambiar en el template (member-list.html):

<div class="flex gap-3 align-items-center mb-4 flex-wrap">

En vez de: align-items-end

Esto alinea por el centro vertical del contenedor.

## Opcion 2: Forzar altura的一致 del INPUT

En base-input-signal.ts, agregar clase para forzar altura:
.field-content {
width: 100%;
display: flex;
align-items: center; // <-- AGREGAR
}

Pero esto puede afectar otros formularios.

## Opcion 3: Solution global (RECOMENDADA)

Modificar base-input-signal.ts para que cuando horizontal=true
(el caso mas comun), el field-content use display flex y align-items-center:

.field-content {
width: 100%;
display: flex; // AGREGAR
align-items: center; // AGREGAR
}

Y en member-list.html agregar una clase wrapper al input:
<custom-input-select-signal class="flex-grow-1" ... />

O mejor, modificar CustomButton para que no tenga el wrapper
exterior "justify-content-end":

template en custom-button.ts:
// Cambiar de:

  <div class="flex w-full justify-content-end">
  // A:
  <div class="flex w-full">

Y mover el justify-content-end al uso direto en el template:

========================================
SOLUCION RECOMENDADA
========================================
Hacer 2 cambios minimos:

1. En base-input-signal.ts (field-content):
   Agregar display:flex y align-items:center

.field-content {
width: 100%;
display: flex;
align-items: center;
}

2. En member-list.html (contenedor flex):
   Cambiar align-items-end por align-items-center

<div class="flex gap-3 align-items-center mb-4 flex-wrap">

========================================
IMPACTO
========================================
Esta solucion afectara TODOS los formularios que usan:

- custom-input-select-signal
- custom-input-text-signal
- cualquier componente que extienda de BaseInputSignal

Si hay formularios que necesitan el comportamiento actual,
se mantendran igual por la herencia, pero la mayoria
deberian beneficiarse de esta mejora.

El cambio en align-items-center en el contenedor es seguro
y solo afecta ese template especifico.
