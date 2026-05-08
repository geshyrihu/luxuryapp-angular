# Análisis del Módulo de Comité (Committee)

Este módulo está diseñado para que los miembros del consejo directivo y comité puedan visualizar documentos, minutas, estados financieros y pólizas de seguros de manera ejecutiva.

## Estructura de Endpoints (Solo Lectura)

Todos los endpoints utilizados en este módulo son de tipo **GET**, centrados en la recuperación de información y documentos.

| Categoría | Endpoint | Descripción |
|-----------|----------|-------------|
| **Imágenes Home** | `File/comite-home-images` | Recupera el mapeo de imágenes para el menú principal del comité. |
| **Estados Financieros** | `BoardDirectors/financial-reports/{customerId}` | Listado de informes financieros mensuales. |
| **Juntas Mensuales** | `BoardDirectors/monthly-meetings/{customerId}` | Listado de juntas programadas y pasadas. |
| **Minutas** | `BoardDirectors/meeting-minutes/{customerId}` | Listado general de minutas de reuniones. |
| **Detalle de Minuta** | `BoardDirectors/meeting-minutes-detail/{id}` | Información detallada y asuntos tratados en una minuta específica. |
| **Biblioteca Legal** | `customdocument/list/{customerId}/{type}` | Documentos clasificados (Actas, Asambleas, Juicios, etc.). |
| **Contratos** | `PolicyContract/List/{customerId}/true` | Listado de contratos con proveedores y pólizas de mantenimiento. |
| **Seguro Edificio** | `PolicyContract/building-insurance/{customerId}` | Detalle de la póliza de seguro vigente del edificio. |

## Componentes y Visualización

Todos los componentes cuentan con su respectivo archivo `.html`. La mayoría están orientados a la **previsualización de documentos PDF** mediante un modal integrado.

### Vistas Principales:
- **Home Comité (`home-comite`)**: Menú visual con tarjetas para navegación rápida.
- **Listados (`informes-financieros`, `reuniones-mensuales`, `minutas`, `biblioteca`)**: Utilizan tablas densas (`p-table`) en web y adaptaciones para móvil.
- **Detalle de Minuta**: Vista enriquecida con estados (Pendiente, En Progreso, Concluido) y desglose de participantes.
- **Visores**: Uso extensivo de `PdfViewerModal` para visualizar archivos sin salir de la aplicación.

---

## Propuesta de Diseño Ejecutivo (Flutter)

Para una versión móvil nativa en Flutter con enfoque ejecutivo, se propone la siguiente estructura simple y elegante:

### 1. Dashboard Principal (Home)
- **Grid Adaptativo**: Tarjetas con bordes redondeados y sombras suaves (estilo `Card` de Material 3).
- **Imágenes de Fondo**: Uso de imágenes de alta calidad con un overlay oscuro para el texto (similar a la implementación actual).
- **Navegación**: `BottomNavigationBar` con 3 iconos clave: Inicio, Documentos, Ajustes.

### 2. Navegación de Documentos
- **Categorización por pestañas**: Uso de `TabBar` para separar "Finanzas", "Legales" y "Contratos".
- **Búsqueda Rápida**: Un `SearchBar` flotante o integrado en el `SliverAppBar`.

### 3. Visualización de Minutas
- **Timeline UI**: Las reuniones se muestran en una línea de tiempo vertical para ver el histórico de forma cronológica.
- **Chips de Estado**: Etiquetas de color (Verde, Amarillo, Azul) para identificar rápidamente el estado de los asuntos pendientes.

### 4. Visor de PDF Integrado
- **Integración Nativa**: Uso de `flutter_pdfview` para una experiencia fluida.
- **Acciones Rápidas**: Botón flotante para compartir el documento o descargarlo directamente.

### 5. Estética "Executive"
- **Paleta de Colores**: Tonos sobrios (Azul oscuro, Gris antracita, Blanco puro).
- **Tipografía**: Fuentes Sans-Serif limpias (como Montserrat o Inter).
- **Feedback Visual**: Efectos de Ripple (onda) al tocar tarjetas para una sensación premium.
