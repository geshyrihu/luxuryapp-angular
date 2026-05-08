# PROMPT — Agente de Manuales y Procesos (LuxuryApp)

## Contexto del sistema

Trabajas en **LuxuryApp**, una plataforma de gestión de propiedades residenciales administradas por **Luxury Building Group (GLB)**. El stack es:

- **Backend:** .NET 10 / C# / EF Core 10 / SQL Server
- **Frontend:** Angular 21 / Signals / PrimeNG 21
- **Patrón API:** REST con wrapper `ApiResponseDTO<T>` en todos los endpoints
- **Autenticación:** JWT Bearer

---

## Módulo: Manuales y Procesos (`/library/manuals-and-processes`)

### Ubicaciones clave

**Backend:**
- Entidades: `api/LuxuryApp.Infrastructure/Data/Entities/ManualsAndProcesses/`
- DTOs: `api/LuxuryApp.Application/Features/ManualsAndProcesses/DTOs/`
- Servicios: `api/LuxuryApp.Application/Features/ManualsAndProcesses/Services/`
- Interfaces: `api/LuxuryApp.Application/Features/ManualsAndProcesses/Interfaces/`
- Controladores: `api/LuxuryApp.Application/Features/ManualsAndProcesses/Controller/`
- Enums: `api/LuxuryApp.Shared/Enums/Manuals/`

**Frontend:**
- Feature completa: `client/angular/src/app/features/biblioteca/manuals-and-processes/`
- Modelos: `models/manuals-and-processes.dto.ts` y `models/section-content.models.ts`
- Páginas: `pages/`
- Servicios: `services/`
- Routing: `client/angular/src/app/routing/library.routing.ts`
- Endpoints: `client/angular/src/app/core/constants/endpoints.ts` → objeto `Manuals` y `ManualFlowcharts`

---

## Arquitectura del módulo

### Entidades principales (Backend)

```
ManualTemplate           — Plantilla del manual (cabecera)
  ├── ManualTemplateItem[]    — Secciones/bloques del manual
  │     └── ManualFlowchart?  — Diagrama Draw.io opcional por sección
  ├── ManualTemplateVersion[] — Historial de versiones
  ├── ManualTemplateAttachment[] — Archivos auxiliares adjuntos
  ├── ManualTemplateRole[]    — Roles con acceso (filtro)
  └── ManualTemplateCustomer[] — Condominios con acceso (filtro)

ManualInstance           — PDF publicado/generado del manual
```

### Enums críticos

```csharp
// ESectionType — tipo de bloque de sección
Objective=0, Scope=1, Glossary=2, Raci=3, Steps=4,
Alert=5, Flowchart=6, VersionHistory=7, References=8, Appendix=9

// EAlertType — tipo de alerta
Warning=0, Info=1, BestPractice=2

// EDocumentTypeForManuals — tipos de documento para este módulo
ProcedimientoOperativo=18, ManualTecnico=19, InstructivoResidentes=20,
ProtocoloEmergencia=21, PoliticaCorporativa=22, ComunicadoResidentes=23
```

### Endpoints disponibles (Backend)

```
GET    api/manuals/templates            — Lista de plantillas
GET    api/manuals/templates/{id}       — Plantilla con items, versiones, adjuntos
POST   api/manuals/templates            — Crear plantilla (solo cabecera)
PUT    api/manuals/templates/{id}       — Actualizar cabecera (NO toca items)
PUT    api/manuals/templates/{id}/items — Guardar/reordenar/eliminar secciones
DELETE api/manuals/templates/{id}       — Eliminar plantilla completa

POST   api/manuals/instances            — Subir PDF publicado
DELETE api/manuals/instances/{id}       — Eliminar instancia

POST   api/manuals/templates/attachments        — Subir archivo auxiliar
DELETE api/manuals/templates/attachments/{id}   — Eliminar archivo auxiliar

GET    api/ManualFlowcharts/{id}        — Obtener diagrama
POST   api/ManualFlowcharts             — Crear diagrama (body: {manualTemplateItemId, name})
PUT    api/ManualFlowcharts/{id}        — Guardar XML del diagrama (body: {content})
DELETE api/ManualFlowcharts/{id}        — Eliminar diagrama
```

### Rutas Frontend

```
/library/manuals-and-processes                    → ManualsAndProcessesList
/library/manuals-and-processes/editor/:id         → ManualsAndProcessesEditor
/library/manuals-and-processes/flowchart-editor/:id → ManualFlowchartEditor
```

---

## Reglas de negocio críticas

### Separación POST/PUT de template

- `POST api/manuals/templates` → crea SOLO la cabecera + roles + customers. **NO crea items.**
- `PUT api/manuals/templates/{id}` → actualiza SOLO la cabecera + roles + customers. **NO toca items.**
- `PUT api/manuals/templates/{id}/items` → upsert completo de secciones. Items no incluidos se marcan `IsActive=false`.

**Motivo:** La versión anterior `UpsertTemplateAsync` borraba los items al hacer PUT desde el formulario del template porque el form no envía items.

### Detección de items nuevos vs. existentes (Backend)

El backend detecta si un item es nuevo comparando el `Id` recibido contra los IDs que existen en la DB para ese template. **NO usa `Guid.Empty`** porque el frontend usa `crypto.randomUUID()` para IDs temporales.

```csharp
var existingIds = existingItems.Select(e => e.Id).ToHashSet();
bool isNew = !existingIds.Contains(itemDto.Id);  // nuevo si no existe en DB
```

### IDs temporales en el frontend

Los items nuevos (no guardados) reciben un UUID temporal generado con `crypto.randomUUID()`. Esto evita el warning `NG0955` (duplicate tracking keys). Al guardar, el backend crea el item con un nuevo Guid y lo devuelve ya persistido.

El editor mantiene un `Set<string>` llamado `persistedIds` que se puebla al cargar desde el servidor. Se usa para saber si un item ya fue guardado (p. ej., para habilitar la creación de flujogramas).

### Diagrama Draw.io (Flowchart)

- Cada `ManualTemplateItem` con `sectionType=Flowchart` puede tener un `ManualFlowchart` asociado.
- El editor Draw.io usa `embed.diagrams.net` en un iframe con la API PostMessage.
- El parámetro `returnTo` (query param) indica la URL a la que regresa al salir del editor de diagramas.
- El XML del diagrama se guarda en `ManualFlowchart.Content`.

---

## Patrones de código — Backend

### Primary constructors (.NET 10)
```csharp
public class ManualAppService(
    ApplicationDbContext dbContext,
    ICurrentUserService currentUserService
) : IManualAppService { }
```

### Sin AutoMapper en proyecciones Select
```csharp
// CORRECTO — proyección manual en Select()
.Select(x => new ManualTemplateDTO { Id = x.Id, Folio = x.Folio, ... })
// INCORRECTO — no usar mapper.Map<> en queries EF
```

### Respuesta estándar
```csharp
return ApiResponseDTO<ManualTemplateDTO>.SuccessResult(dto);
return ApiResponseDTO<ManualTemplateDTO>.ErrorResult("mensaje");
```

### Permisos
```csharp
private bool IsSuperUser => currentUserService.UserRole == "SuperUsuario";
if (!IsSuperUser) return ApiResponseDTO<T>.ErrorResult("No tiene permisos");
```

### Migraciones (sin startup project bloqueado)
```bash
dotnet ef migrations add NombreMigracion --project api/LuxuryApp.Infrastructure/LuxuryApp.Infrastructure.csproj
dotnet ef database update --project api/LuxuryApp.Infrastructure/LuxuryApp.Infrastructure.csproj
```

---

## Patrones de código — Frontend

### Rutas de imports (NO existe alias `@core/`)
```typescript
// CORRECTO
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { Endpoints } from 'src/app/core/constants/endpoints';
// INCORRECTO
import { ApiResponseService } from '@core/services/api-response.service';
```

### Formularios — patrón Banks (POST/PUT separados)
```typescript
const res = id
  ? await this.apiS.onPut(Endpoints.Manuals.updateTemplate(id), body)
  : await this.apiS.onPost(Endpoints.Manuals.createTemplate, body);
```

### Signals Angular 21
```typescript
id = signal<string>('');
template = signal<IManualTemplateDTO | null>(null);
sections = signal<IManualTemplateItemDTO[]>([]);
activeSection = computed(() => this.sections()[this.activeSectionIndex()] ?? null);
```

### PrimeNG 21 — Tabs
```html
<p-tabs><p-tablist><p-tab>...</p-tab></p-tablist>
<p-tabpanels><p-tabpanel>...</p-tabpanel></p-tabpanels></p-tabs>
```

### Select-item-enum disponibles para este módulo
```
GET api/select-item-enum/document-type-for-manuals   → EDocumentTypeForManuals (18-23)
GET api/select-item-enum/ESectionType                → ESectionType (0-9)
GET api/select-item-enum/EAlertType                  → EAlertType (0-2)
GET api/select-item-enum/EDepartament                → departamentos
GET api/select-item-enum/EConfidentialityLevel       → niveles de confidencialidad
```

---

## Estructura de `contentJson` por tipo de sección

Cada `ManualTemplateItem.ContentJson` es un JSON string. El tipo depende de `SectionType`:

```typescript
// Objective, Scope, VersionHistory, References generales
{ "html": "<p>texto...</p>" }

// Glossary
{ "terms": [{ "term": "", "noUsar": "", "definition": "" }] }

// Raci
{ "activities": [{ "activity": "", "responsible": "R", "accountable": "A", "consulted": "C", "informed": "I" }] }

// Steps
{ "steps": [{ "order": 1, "actor": "", "action": "", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" }] }

// Alert
{ "alertType": 0, "text": "" }  // 0=Warning, 1=Info, 2=BestPractice

// References (normativas)
{ "items": [{ "norm": "", "description": "" }] }

// Appendix
{ "attachments": [] }
```

---

## Contenido disponible para cargar

El archivo `estructura-jefe-mantenimiento.md` en esta misma carpeta contiene los **11 procesos del Manual de Jefe de Mantenimiento GLB-2025** ya estructurados en el formato `contentJson` exacto del sistema, listos para ser cargados como templates:

| Folio | Proceso |
|-------|---------|
| GLB-MTTO-001 | Entrega de Recursos |
| GLB-MTTO-002 | Orden y Limpieza |
| GLB-MTTO-003 | Uso de Uniforme |
| GLB-MTTO-004 | Inventarios |
| GLB-MTTO-005 | Calendario de Mantenimiento |
| GLB-MTTO-006 | Solicitudes de Compra |
| GLB-MTTO-007 | Atención a Departamentos |
| GLB-MTTO-008 | Recorridos |
| GLB-MTTO-009 | Bitácoras |
| GLB-MTTO-010 | Supervisión de Trabajos |
| GLB-MTTO-011 | Reportes |

---

## Estado actual del módulo (2026-04-24)

| Fase | Estado |
|------|--------|
| Entidades + Migración EF Core | Completado |
| Backend POST/PUT separados (cabecera vs items) | Completado |
| Servicio de flujogramas (ManualFlowchartService) | Completado |
| Frontend: lista, formulario, editor de secciones | Completado |
| Frontend: editor Draw.io (flujogramas) | Completado |
| **Generación de PDF (pdfmake)** | **Pendiente** |

### Pendiente: Generación de PDF

Archivo a crear: `services/manual-pdf.service.ts`

Método público esperado:
```typescript
generateAndDownload(template: IManualTemplateDTO, sections: IManualTemplateItemDTO[]): Promise<void>
getPdfBlob(template: IManualTemplateDTO, sections: IManualTemplateItemDTO[]): Promise<Blob>
```

Requisitos:
- Portada corporativa con logo Luxury Building Group, folio, versión y fecha
- Renderizar cada sección según su `sectionType` (tablas para RACI, listas numeradas para Steps, etc.)
- `sectionType: Flowchart` → mostrar imagen exportada desde `export.diagrams.net` o placeholder
- Librería sugerida: `pdfmake` (ya en uso en otros módulos del proyecto)
- Referencia: buscar usos existentes de pdfmake en `client/angular/src/app/`

---

## Archivos de referencia en este directorio

| Archivo | Descripción |
|---------|-------------|
| `estructura-jefe-mantenimiento.md` | 11 procesos GLB mapeados al sistema con contentJson listo |
| `PROMPT-AGENTE.md` | Este archivo — contexto completo para agentes futuros |
| `Capacitación Jefe de Mantenimiento GLB-2025.pdf` | PDF fuente original del manual |

---

## Errores comunes ya resueltos (no repetir)

| Error | Causa | Solución aplicada |
|-------|-------|-------------------|
| 400 Bad Request en `PUT /items` | `id: ""` no es Guid válido para .NET | Usar `crypto.randomUUID()` para items nuevos |
| NG0955 duplicate tracking keys | Múltiples items nuevos con mismo `Guid.Empty` | `crypto.randomUUID()` + `persistedIds: Set<string>` |
| Items borrados al hacer PUT template | `UpsertTemplateAsync` recibía items vacíos del form | POST/PUT separados: cabecera ≠ items |
| EF migration DLL locked | API corriendo bloquea el proyecto startup | Usar solo `--project Infrastructure.csproj` (tiene `IDesignTimeDbContextFactory`) |
| `@core/` import no resuelto | No existe alias de paths en tsconfig | Usar `src/app/core/...` siempre |
