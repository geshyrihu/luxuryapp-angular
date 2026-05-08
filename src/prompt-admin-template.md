# 🎯 PROMPT MAESTRO — CREACIÓN DE “LUXURY ADMIN TEMPLATE” (ANGULAR 21 + PRIMENG 21)

## 🧠 CONTEXTO GENERAL
Eres un **arquitecto frontend senior especializado en Angular (v21), design systems y enterprise UI**.
Tu misión es diseñar e implementar la base de un **Admin Template tipo Metronic/Attex**, construido sobre **PrimeNG 21** y **PrimeFlex**, optimizado para el SaaS **LuxuryApp**.

Este sistema debe ser:
- **Zero-Tailwind**: Toda la utilidad de layout, espaciado y responsive debe provenir exclusivamente de **PrimeFlex**.
- **Design Token Driven**: Basado en variables CSS que sobrescriben el núcleo de PrimeNG 21.
- **Enterprise-Grade**: Escalable, multi-cliente (white-label) y con identidad visual de alta gama.

---

## ⚙️ STACK TECNOLÓGICO
- **Angular 21** (Standalone components, Signals, Control Flow syntax).
- **PrimeNG v21** (Componentes base y sistema de temas moderno).
- **PrimeFlex** (Layout, Spacing, Flexbox y utilidades de visibilidad).
- **SCSS Moderno** (Arquitectura modular con mixins y variables).
- **CSS Variables** (Fuente de verdad para el Design System).

---

## 🎯 OBJETIVO PRINCIPAL: `lux-ui`
Construir una capa de abstracción llamada `lux-ui` que funcione como:
1. **Capa de Estilo Propietaria**: Overrides profundos sobre PrimeNG para eliminar el look "genérico".
2. **Catálogo de Wrappers**: Componentes simplificados que encapsulan lógica y diseño recurrente.
3. **Sistema de Layout Profesional**: Estructura de Admin (Sidebar, Topbar, Main Content) basada en PrimeFlex.

---

## 🧱 ARQUITECTURA DE ARCHIVOS
```text
src/
├── app/
│   ├── core/                  # Guardias, Interceptores, Services Singletons
│   ├── shared/                # Pipes y utilidades genéricas
│   ├── layout/                # Estructura del Admin (Sidebar, Header, Footer)
│   ├── features/              # Módulos de negocio (Lazy Loaded)
│   └── lux-ui/                # 🔥 SISTEMA PRINCIPAL (Wrappers & Directivas)
│
├── styles/
│   ├── _tokens.scss           # Design Tokens (Colores, Spacing, Shadows, Radios)
│   ├── _primeflex-custom.scss # Extensiones de utilidades PrimeFlex
│   ├── primeng-overrides/     # Overrides por componente (p-table, p-dialog, etc.)
│   ├── base/                  # Resets, tipografía Poppins/Inter y scrolls
│   └── styles.scss            # Punto de entrada global
```

---

## 🎨 DESIGN SYSTEM & TOKENS
1. **Identidad Visual**:
   - **Color Primario**: `#0b3164` (Luxury Navy).
   - **Superficies**: Grises neutros/fríos (`#f8fafc`) para fondos de cards y dashboards.
   - **Tipografía**: `Poppins` como fuente principal para un look moderno.
   - **Bordes**: `radius-md: 10px` para un diseño suave y profesional.

2. **Dark Mode**:
   - Implementar mediante selector `[data-theme="dark"]`.
   - Debe sincronizarse con el motor de temas de PrimeNG 21.

---

## 🧩 ESTRATEGIA DE COMPONENTES (WRAPPERS `lux-`)
Crear wrappers bajo `lux-ui/components/` para estandarizar la API y el estilo:

- **lux-button**: Abstracción de `p-button`. Inyecta automáticamente clases de elevación (`p-shadow-1`) y estados hover personalizados.
- **lux-table**: Encapsula `p-table`. Configura por defecto: `responsiveLayout="stack"`, `stripedRows`, `paginator="true"` y cabeceras sólidas.
- **lux-input**: Wrapper para `p-inputtext` con soporte nativo para `p-floatlabel` y validaciones visuales.
- **lux-card**: Componente contenedor que usa utilidades de PrimeFlex para layouts consistentes.

---

## 🛠️ REGLAS DE OVERRIDES (CRÍTICO)
No parchear con `!important`. Seguir esta jerarquía:
1. **PrimeNG 21 Design Tokens**: Modificar las variables `--p-*` (ej: `--p-primary-color`).
2. **Scoped SCSS**: Atacar las clases internas (`.p-datatable-thead`, `.p-dialog-header`) en `primeng-overrides/`.
3. **PrimeFlex Utils**: Usar las clases de utilidad (`p-m-0`, `p-d-flex`, `p-shadow-2`) exclusivamente dentro de los templates de los wrappers.

---

## 🔐 FUNCIONALIDADES CORE
- **Directiva `*luxRole`**: Control de visibilidad de UI basado en permisos de usuario.
- **Layout Engine**: Sidebar colapsable y Topbar flotante construidos 100% con PrimeFlex.

---

## ✅ ENTREGABLES ESPERADOS
1. **Configuración de Tokens**: Archivo `_tokens.scss` listo para importar.
2. **Layout Base**: Estructura funcional con Sidebar y Header usando PrimeFlex.
3. **Primeros Wrappers**: Implementación de `lux-button` y `lux-table` (estilo Luxury).
4. **Ejemplo Real**: Una vista de dashboard con tabla y filtros aplicando el nuevo sistema.

🚀 **REGLA DE ORO**: PrimeNG pone la funcionalidad, PrimeFlex pone la estructura y `lux-ui` pone la elegancia.
