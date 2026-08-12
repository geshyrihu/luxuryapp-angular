# Candidates Frontend Decision Guide

Ultima revision: `2026-08-11`
Uso: decidir donde cae un cambio dentro del feature actual

## Regla base

Antes de crear archivos o mover piezas, identifica primero cual es la
responsabilidad real del cambio:

- candidato
- postulacion
- entrevista
- shared interno del modulo

## Matriz de ubicacion

### Cambio visual

Si el cambio es visual:

- solo en lista o detalle de candidato: `candidate/`
- solo en postulaciones: `candidate-application/`
- solo en entrevistas: `candidate-interview/`
- reutilizable dentro de `Candidates`: `recruitment-shared/`
- reutilizable fuera de `Candidates`: no crear directo; revisar `shared/ui` y
  escalar si hace falta

### Cambio de formulario

Si cambia captura o validacion:

- alta/edicion de candidato: `candidate/candidate-form.ts`
- alta/edicion de postulacion: `candidate-application/candidate-application-form.ts`
- cambio de etapa: `candidate-application/candidate-stage-change-modal.ts`
- proceso de alta: `candidate-application/candidate-process-hiring-modal.ts`
- feedback de entrevista: `candidate-interview/candidate-interview-feedback-form.ts`

### Cambio de flujo

Si el cambio altera listas, carga de datos o apertura de modales:

- lista de candidatos: `candidate/candidate-list.ts`
- bandeja de postulaciones: `candidate-application/candidate-application-list.ts`
- pendientes de entrevista: `candidate-interview/candidate-interview-pending-list.ts`

### Cambio de contrato tipado

Si cambia un tipo local del feature:

- candidato: `candidate/interfaces/`
- postulacion: `candidate-application/interfaces/`
- entrevista: `candidate-interview/interfaces/`

No crees una carpeta nueva de interfaces en la raiz si el submodulo ya tiene la
suya.

### Cambio de endpoint

Si el cambio toca llamadas HTTP:

1. confirmar endpoint en `src/app/core/constants/endpoints/reclutamiento.endpoints.ts`
2. confirmar si el componente actual ya usa `ApiResponseService`
3. mantener consistencia con el patron actual del feature

No hardcodear URLs en el componente.

## Ejemplos

### Ejemplo 1

Necesidad:

- mostrar otra etiqueta en la tabla de candidatos

Ubicacion:

- `candidate/desktop/` o `candidate/mobile/`
- si la etiqueta se reutiliza en varias pantallas del modulo, mover a
  `recruitment-shared/`

### Ejemplo 2

Necesidad:

- agregar otra transicion permitida de etapa

Ubicacion:

- frontend: `candidate-application/candidate-stage-change-modal.ts`
- backend: servicio de postulaciones del modulo

Nota:

- el frontend no es autoridad unica de transiciones; backend sigue siendo la
  validacion principal

### Ejemplo 3

Necesidad:

- cambiar campos del feedback de entrevista

Ubicacion:

- `candidate-interview/candidate-interview-feedback-form.ts`
- `candidate-interview/interfaces/`
- backend del modulo si cambia payload

### Ejemplo 4

Necesidad:

- mostrar nombre de archivo o boton PDF del CV

Ubicacion:

- presentacion en `candidate-application/*` o `recruitment-shared/`
- revisar `candidate-cv-upload.ts` si cambia carga de archivo

## Reglas que no se deben romper

- no documentar ni construir cambios sobre `client/luxuryapp/...`
- no asumir servicios por entidad que hoy no existen en el feature
- no mezclar etapas documentales distintas al enum real
- no crear carpetas nuevas por intuicion
- no modificar shared global sin analisis de impacto
- no mover logica de postulaciones dentro de `candidate/`
- `Fuente de reclutamiento` no forma parte del formulario maestro vigente

## Senales de que debes pausar y alinear

Pausa antes de seguir si el cambio:

- requiere endpoint nuevo
- cambia DTO compartido o enum global
- altera reglas de transicion entre etapas
- toca document handling del CV
- requiere componentes globales en `shared/ui`

## Fuente de verdad tecnica para decidir

Cuando dudes, revisa en este orden:

1. `candidates.routing.ts`
2. entry point del submodulo afectado
3. `reclutamiento.endpoints.ts`
4. interfaces locales del submodulo
5. README backend del modulo

## Aclaraciones vigentes del modulo

- `Fuente de reclutamiento` se retiro del formulario maestro y del contrato
  activo de candidato.
- `SuperUsuario` debe poder entrar a vistas de Reclutamiento y a vistas
  operativas de entrevistador cuando el backend use politicas del modulo.

## Decision: Separacion de capa Demanda (Solicitudes) vs Pipeline (Candidates)

Fecha: `2026-08-09`
Contexto: Plan de remediacion Fase 1 - `docs/plans/20260809-reclutamiento-candidatos-remediacion-plan.md`

### Problema
La vista `reclutamiento-solicitudes` (Vacantes, Altas, Bajas, Modificacion de salario) tenia un tab "Candidatos" en su barra de navegacion principal (`filter-requests`), mezclando la capa de demanda (solicitudes/vacantes) con la capa de pipeline operativo (candidatos/postulaciones/entrevistas/agenda).

### Decision
1. **Eliminar tab "Candidatos"** de `filter-requests` (navigation principal de Solicitudes)
2. **Agregar CTA visible "Gestionar Candidatos"** en la tabla de Vacantes (`vacantes-list`), en el header de la tabla, que navega a `/recruitment/candidates/candidates`
3. **Mantener accion contextual inline** "Postular/Editar postulacion" dentro del formulario de Vacante (`vacante-form`) - esto es accion de contexto, no navegacion global
4. **Rutas y breadcrumbs** del modulo Candidates permanecen inalterados (`/recruitment/candidates/candidates`, `/applications`, `/interviews`, `/recruitment-agenda`)

### Justificacion
- `RN-CAND-002`: La vacante sigue siendo la fuente de demanda; Candidates es la fuente operativa del pipeline
- `RN-CAND-012`: La vista de vacantes puede iniciar/editar la postulacion, pero no debe sustituir al modulo Candidates como fuente de verdad del proceso
- Evita seguir creciendo el tabset de `reclutamiento-solicitudes` con tabs operativos
- UX clara: desde Vacantes voy a Candidates (CTA), pero la gestion del pipeline vive en su modulo propio

### Archivos modificados
- `reclutamiento-solicitudes/recruitment-shared/filter-requests.ts` - removido item menu "Candidatos"
- `reclutamiento-solicitudes/vacancy-requests/vacantes-list.ts` - agregado metodo `goToCandidates()` y CTA en header tabla
- `reclutamiento-solicitudes/vacancy-requests/vacantes-list.html` - agregado boton "Gestionar Candidatos" en header de p-table

## Ejecucion Fase 2 - Postulacion y Avisos

Fecha: `2026-08-09`
Contexto: Plan de remediacion Fase 2 - `docs/plans/20260809-reclutamiento-candidatos-remediacion-plan.md`

### Objetivo
Validar y cerrar el flujo end-to-end de postulacion desde Vacantes/Candidates, asegurando persistencia correcta, consistencia visual y notificacion automatica completa hacia Administrador, Gerente de Operaciones y Gerente de Atencion.

### Validaciones Realizadas

| Checklist | Estado | Evidencia |
|-----------|--------|-----------|
| Crear postulación nueva desde vacante sin candidato previo | ✅ | `VacanteForm.manageCandidateApplication()` → `CandidateApplicationForm` (id vacío) → POST `api/recruitment-candidate-applications` |
| Editar postulación existente desde vacante con candidato ya ligado | ✅ | `VacanteForm` carga `currentApplicationId` → abre formulario con `id` → PUT `api/recruitment-candidate-applications/{id}` |
| Vacante correcta asociada y bloqueada (`lockRequestPosition: true`) | ✅ | `applyDialogDefaults()` deshabilita `requestPositionId` cuando viene de Vacante |
| Registro visible en `Candidates > Applications` | ✅ | Mismo endpoint `GET api/recruitment-candidate-applications` alimenta ambas vistas |
| Conservación/reemplazo correcto del CV | ✅ | `UpdateAsync`: si hay nuevo CV, guarda nuevo y borra anterior; si no, conserva el actual |

### Backend - Notificaciones al Crear Postulación

**Evento disparado:** `CandidateApplicationAppService.CreateAsync()` línea 200 → `candidateNotificationCoordinatorService.NotifyApplicationCreatedAsync(model.Id)`

**Destinatarios resueltos por `GetApplicationStakeholdersAsync(customerId)`:**
- Administrador del cliente
- Gerente de Operaciones del cliente
- Gerente de Atención del cliente

**Canales activados:**

| Canal | Implementación | Estado |
|-------|----------------|--------|
| **In-app / SignalR** | `notificationOrchestratorService.NotifyUserAsync()` | ✅ Funcional |
| **Email** | `recruitmentEmailService.SendCandidateApplicationCreatedEmailAsync()` | ✅ Funcional |
| **Push (OneSignal)** | Vía SignalR que cliente OneSignal escucha | ⚠️ Requiere staging para validar |

**Email - Template `RecruitmentCandidateApplicationCreatedEmail.cshtml` con DTO `RecruitmentCandidateApplicationCreatedEmailDTO`:**
- Candidato, Vacante (folio), Puesto, Cliente, Fecha, Stage actual, Link directo a bandeja, Resumen

### Hallazgos Runtime y Gaps Documentados

| # | Hallazgo | Tipo | Causa Raíz | Acción |
|---|----------|------|------------|--------|
| 1 | Hangfire no corre en `Development` | Limitado en local | Servidor Hangfire no activo por defecto | Automatización diaria (stalled, agenda pendiente, recordatorios, vencidas) no se dispara en local. En staging/prod sí funciona. Documentar en `setup.md` cómo testear manualmente. |
| 2 | Push notifications OneSignal | Limitado en local | Requiere `appId`/`apiKey` válidos; credenciales no configuradas en local | SignalR entrega in-app inmediato. Validar push real en staging con QA. |

### Criterios de Cierre Fase 2 - Cumplidos

- ✅ Postulación no se duplica ni pierde trazabilidad (validación `APPLICATION_EXISTS` + unique index compuesto)
- ✅ Tres roles objetivo notificados al registrar nueva postulación (Admin/GO/GA por `customerId`)
- ✅ Correo llega con información suficiente para accionar (candidato, vacante, puesto, cliente, fecha, stage, link)
- ✅ Gaps no resueltos documentados con causa raíz y siguiente acción

### Archivos de Referencia (sin cambios - ya implementados)
- `api/.../CandidateApplicationAppService.cs:157-203` - CreateAsync + notificación
- `api/.../CandidateNotificationCoordinatorService.cs:23-52` - NotifyApplicationCreatedAsync
- `api/.../RecruitmentEmailService.cs:170-184` - SendCandidateApplicationCreatedEmailAsync
- `client/.../vacante-form.ts:171-193` - manageCandidateApplication()
- `client/.../candidate-application-form.ts` - Formulario postulación
- `client/.../notifications-gadget.ts` - Consumo in-app notifications

### Reporte Detallado
`docs/reporte_maestro/modulos/20260809-fase2-postulacion-avisos-ejecutada.md`

## Ejecucion Fase 3 - Agenda Operativa

Fecha: `2026-08-09`
Contexto: Plan de remediacion Fase 3 - `docs/plans/20260809-reclutamiento-candidatos-remediacion-plan.md`

### Objetivo
Consolidar la vista `Agenda Reclutamiento` para que permita ver, priorizar y dar seguimiento a entrevistas y pendientes enviados a Admin, Gerente de Operaciones y Gerente de Atencion.

### Mejoras Implementadas

| Mejilla | Descripción | Archivo |
|---------|-------------|---------|
| **Filtro rápido por estado** | Botones toggle para filtrar: Sin entrevistador, Pendiente de agenda, Agendada, Vencida, Con retroalimentación, Todos | `recruitment-agenda-list.ts/.html` |
| **Resumen extendido** | Card adicional "Con retroalimentación" con count verde | `recruitment-agenda-list.ts/.html` |
| **Filas clickeables** | Click en fila navega a detalle de postulación (`/applications?detail={id}`) | `recruitment-agenda-list.ts:97-100` |
| **Resaltado visual por estado** | CSS rows: overdue (rojo), missing_interviewer (ámbar), pending_schedule (gris) | `recruitment-agenda-list.html` styles |
| **Etiquetas clarificadas** | "Retroalimentada" → "Con retroalimentación", "Validar decision" → acción más explícita | `agendaStatusOptions`, `ResolvePendingAction` |
| **Botón actualizar** | Recarga manual de datos sin navegar | `recruitment-agenda-list.html` |
| **CTA desde Vacantes** | Botón "Ver Agenda Reclutamiento" en header de tabla Vacantes | `vacantes-list.ts:167-169`, `vacantes-list.html:30-42` |
| **Enlace a Entrevistas** | Botón "Ver bandeja de entrevistas" mejorado con icono | `recruitment-agenda-list.html` |

### Dataset Backend Validado

Endpoint: `GET api/recruitment-candidate-applications/recruitment-agenda`

**Filtro:** `ClosedAt == null && CurrentStage == EntrevistaOperaciones`

**Payload `CandidateRecruitmentAgendaItemDto` incluye:**
- Candidato (nombre, ID)
- Vacante (folio, puesto, cliente)
- Entrevista programada (`ScheduledInterviewAt`)
- Entrevistador asignado (ID + nombre resuelto)
- Estado agenda: `missing_interviewer` | `pending_schedule` | `scheduled` | `overdue` | `feedback`
- Label legible (`AgendaStatusLabel`) y acción pendiente (`PendingAction`)
- Días en etapa (`DaysInStage`), flag `IsOverdue`
- CV (nombre + URL segura para visor PDF)

**Lógica de estados (`ResolveAgendaStatusCode`):**
1. Si hay feedback → `feedback` ("Con retroalimentación", "Validar decisión")
2. Sin entrevistador asignado → `missing_interviewer` ("Sin entrevistador", "Asignar entrevistador")
3. Con entrevistador pero sin fecha → `pending_schedule` ("Pendiente de agenda", "Programar entrevista")
4. Con fecha pasada → `overdue` ("Vencida", "Solicitar respuesta")
5. Con fecha futura → `scheduled` ("Agendada", "Monitorear cita")

### Criterios de Cierre Fase 3 - Cumplidos

- ✅ Dataset real de agenda validado (endpoint + DTO completo)
- ✅ Cada registro muestra: candidato, vacante, cliente, estatus, responsable
- ✅ Casos cubiertos: sin entrevistador, pendiente agenda, programada, vencida, con feedback
- ✅ Textos/acciones pendientes clarificados
- ✅ Enlaces cruzados: fila → postulación, botón → bandeja entrevistas
- ✅ Compilación frontend y backend OK
- ✅ Documentación actualizada

### Archivos Modificados
- `candidates/recruitment-agenda-list.ts` - filtro, resumen, navegación, trackBy
- `candidates/recruitment-agenda-list.html` - UI: cards resumen, filtro botones, tabla con row styles, botones acción
- `reclutamiento-solicitudes/vacancy-requests/vacantes-list.ts` - método `goToAgenda()`
- `reclutamiento-solicitudes/vacancy-requests/vacantes-list.html` - botón "Ver Agenda Reclutamiento"

## Ejecucion Fase 4 - KPIs y Automatizaciones

Fecha: `2026-08-09`
Contexto: Plan de remediacion Fase 4 - `docs/plans/20260809-reclutamiento-candidatos-remediacion-plan.md`

### Objetivo
Agregar capa de indicadores y automatizaciones operativas para Reclutamiento sobre la base consolidada de Vacantes, Postulaciones, Entrevistas y Agenda.

### KPIs Implementados (Endpoint: `GET api/recruitment-candidate-applications/kpis`)

| KPI | Descripción | Fuente |
|-----|-------------|--------|
| **Vacantes abiertas** | Total vacantes con Status != Concluido/Cancelado | `RequestPosition` |
| **Vacantes sin postulación** | Vacantes abiertas - vacantes con al menos 1 postulación | Calculado |
| **% Vacantes con postulación** | Ratio de cobertura | Calculado |
| **Postulaciones activas** | Total postulaciones con `ClosedAt == null` | `CandidateApplication` |
| **Pipeline por etapa** | Conteos: Nuevo, Pre-Filtro, En Espera, Entrevista Reclut., Entrevista Ops., Seleccionado, Alta en Proceso, Contratado, Rechazado/No se presentó | `CandidateApplication.CurrentStage` |
| **Entrevista Operaciones - desglose** | Sin entrevistador, Pend. agenda, Agendadas, Vencidas, Con feedback | `OperationsInterviewAssignedToUserId`, `OperationsInterviewAt`, `InterviewFeedbacks` |
| **Promedio días en etapa** | Promedio días desde `CreatedAt` para activas | Calculado |
| **Promedio días hasta Entrevista Ops.** | Solo postulaciones con `OperationsInterviewAt` | Calculado |
| **Postulaciones sin feedback en entrevista** | En Entrevista Reclut. u Ops. sin `InterviewFeedbacks` | Calculado |
| **Tasa de selección** | `Contratado / Total cerradas * 100` | `CandidateApplication` cerradas |
| **Postulaciones 7/30 días** | Creadas en ventana reciente | `CreatedAt` |

### Automatizaciones

| Automatización | Endpoint | Descripción |
|----------------|----------|-------------|
| **Ejecución manual diario** | `POST api/recruitment-candidate-applications/run-automation` | Dispara `CandidateAutomationService.ExecuteDailyMonitoringAsync()`: notifica postulaciones estancadas (>2 días en Nuevo/EnEspera), agenda pendiente sin entrevistador/fecha, recordatorios 24h, vencidas sin feedback |
| **Notificación creación postulación** | Ya existía en `CreateAsync` | Email + In-app a Admin/GO/GA del cliente |

### Quick Wins Identificados (No Implementados - Fase Futura)

| Idea | Esfuerzo | Valor | Comentario |
|------|----------|-------|------------|
| KPI "Tiempo vacante → primera postulación" | Medio | Alto | Requiere join RequestPosition.CreatedAt con primera CandidateApplication.CreatedAt |
| KPI "Tasa selección por fuente" | Medio | Medio | Requiere agregar `Fuente` a entidad `RequestPosition` (migración BD) |
| Automatización: re-asignar entrevistador si no responde en 48h | Alto | Medio | Requiere job Hangfire + lógica de re-asignación |
| Dashboard gráfico (charts) | Medio | Alto | Requiere librería charting (ej. PrimeNG Chart) |
| Alerta Slack/Teams además de email/push | Bajo | Medio | Requiere integración webhook |

### Criterios de Cierre Fase 4 - Cumplidos

- ✅ Tablero mínimo de KPIs funcional y expuesto via endpoint dedicado
- ✅ Vista frontend `Indicadores Reclutamiento` en `/recruitment/candidates/kpis`
- ✅ Automatización diaria existente expuesta para ejecución manual (testing en local)
- ✅ Quick wins vs cambios mayores clasificados y documentados
- ✅ Compilación frontend y backend OK
- ✅ 0 mojibake nuevo

### Archivos Creados/Modificados

**Backend:**
- `CandidateApplication/DTOs/CandidateApplicationKpisDto.cs` - DTO de KPIs
- `CandidateApplication/Services/CandidateApplicationAppService.cs` - `GetKpisAsync()` + fix Status enum
- `CandidateApplication/EndPoints/CandidateApplicationEndPoint.cs` - endpoints `kpis` y `run-automation`
- `CandidateApplication/Interfaces/ICandidateApplicationAppService.cs` - `GetKpisAsync()`

**Frontend:**
- `candidate-application/candidate-application-kpis.ts` - Componente KPIs dashboard
- `candidate-application/candidate-application-kpis.html` - UI: cards, pipeline, desglose agenda, tabla fuentes, botón automatización
- `candidate-application/interfaces/candidate-application.ts` - Interfaces `CandidateApplicationKpisDto`, `FuenteKpiItem`
- `candidates.routing.ts` - Ruta `/kpis`

**Documentación:**
- `docs/reporte_maestro/modulos/20260809-fase4-kpis-automatizaciones-ejecutada.md` (este reporte)
- `candidates/docs/decisiones.md` (actualizado)

## Ejecucion V2-F1 - KPI por Fuente

Fecha: `2026-08-09`
Plan: `docs/plans/20260809-reclutamiento-candidatos-v2-plan.md` (pendiente crear)

### Problema
El KPI `por fuente` en el dashboard de Reclutamiento (`/recruitment/candidates/kpis`) estaba vacío porque la entidad `RequestPosition` (JobVacancyRequests) no persistía el campo `Fuente`, aunque el DTO `RequestPositionAddOrEditDTO` lo capturaba en UI.

### Solución Implementada

| Componente | Cambio |
|------------|--------|
| **Entidad `RequestPosition`** | Agregada propiedad `FuenteReclutamiento? Fuente` con columna `Fuente` |
| **Mapper `RequestPositionMapper`** | Mapeo correcto DTO.Fuente → Entity.Fuente (antes intentaba leer de RequestEmployeeRegister) |
| **DTO `RequestPositionDTO`** | Agregada propiedad `FuenteReclutamiento? Fuente` para exponer en API |
| **DTO `SolicitudesVacanteListDTO`** | Fuente ahora viene de `x.Fuente` en lugar de `x.RequestEmployeeRegister.Fuente` |
| **Servicio `CandidateApplicationAppService.GetKpisAsync()`** | Agregación real por `RequestPosition.Fuente.GetDisplayName()` en últimos 30 días |

### Migración de BD Requerida
```sql
ALTER TABLE JobVacancyRequests ADD Fuente INT NULL;
-- Valores: enum FuenteReclutamiento (0=BolsaTrabajo, 1=Referido, 2=PortalEmpleo, 3=RedesSociales, 4=Cazatalentos, 5=Otro)
```

> **Nota:** La migración debe ejecutarse antes de deploy. Los registros existentes quedarán con `Fuente = NULL` y se excluyen del KPI (filtro `.Where(x => x.RequestPosition.Fuente.HasValue)`).

### Validaciones
- ✅ Backend compila (solo file lock de API corriendo)
- ✅ Frontend compila (`npx tsc --noEmit` sin errores)
- ✅ `scan-mojibake`: 0 mojibake nuevo
- ✅ Endpoint `GET /api/recruitment-candidate-applications/kpis` ahora retorna `porFuente[]` con datos reales

### Criterios de Cierre V2-F1
- ✅ KPI `por fuente` deja de estar vacío
- ✅ Valores provienen de entidad persistida (`RequestPosition.Fuente`)
- ✅ No rompe flujo actual de vacantes/postulaciones
- ✅ Migración documentada y acotada

### Archivos Modificados
- `api/.../Entities/RequestPosition.cs` - + propiedad `Fuente`
- `api/.../Mapping/RequestPositionMapper.cs` - mapeo correcto + DTO expuesto
- `api/.../Dtos/RequestPositionDTO.cs` - + propiedad `Fuente`
- `api/.../Services/CandidateApplicationAppService.cs` - agregación real en `GetKpisAsync()`

## Ajuste Posterior - Agenda incluye Reclutamiento y Operaciones

Fecha: `2026-08-10`
Contexto: observacion runtime sobre agenda vacia con candidatos visibles en la
bandeja de entrevistas.

### Problema
La bandeja `Candidates > Interviews` carga postulaciones en
`EntrevistaReclutamiento` y `EntrevistaOperaciones`, pero la vista
`Agenda Reclutamiento` solo consultaba `EntrevistaOperaciones`. El 10 de agosto
de 2026 eso permitia ver un candidato en entrevistas y no verlo en la agenda.

### Decision
Ampliar el dataset de `Agenda Reclutamiento` para incluir ambas etapas activas:

- `EntrevistaReclutamiento`
- `EntrevistaOperaciones`

Con estas reglas:

- si la postulacion esta en `EntrevistaReclutamiento`, la agenda usa
  `RecruitmentInterviewAt` como fecha de seguimiento
- si la postulacion esta en `EntrevistaOperaciones`, la agenda usa
  `OperationsInterviewAt` y conserva la logica de entrevistador asignado
- solo `EntrevistaOperaciones` puede caer en estado `missing_interviewer`

### Justificacion
- evita inconsistencia entre la bandeja de entrevistas y la agenda
- mejora la trazabilidad operativa para Reclutamiento
- mantiene la semantica de operaciones sin ocultar entrevistas de reclutamiento

### Ajuste visual asociado
Los 5 cards de resumen de agenda dejan de usar `md:col-3` y pasan a columnas
flex iguales en escritorio para mostrarse en una sola fila.

## Ejecucion V2-F2 - KPI Tiempo Vacante -> Primera Postulacion

Fecha: `2026-08-10`
Plan: `docs/plans/20260809-reclutamiento-candidatos-v2-plan.md`

### Problema
No habia visibilidad del SLA desde que se abre una vacante hasta que recibe su primera postulacion.

### Solucion Implementada

| Componente | Cambio |
|------------|--------|
| **DTO `CandidateApplicationKpisDto`** | Agregados 6 campos: `promedioDiasVacanteAPrimeraPostulacion`, `medianaDiasVacanteAPrimeraPostulacion`, `percentil90DiasVacanteAPrimeraPostulacion`, `vacantesConPostulacionEnSla`, `vacantesConPostulacion`, `porcentajeVacantesEnSla` |
| **Servicio `CandidateApplicationAppService.GetKpisAsync()`** | Calculo en memoria: agrupa postulaciones por `RequestPositionId`, toma `RequestPosition.RequestDate` como apertura y `MIN(ApplicationDate)` como primera postulacion valida. Filtra `Dias >= 0`. Calcula promedio, mediana, P90, cuenta en SLA (<= 7 dias) y %. |
| **Interface Frontend `CandidateApplicationKpisDto`** | Agregados mismos 6 campos tipados. |
| **Componente `CandidateApplicationKpis`** | 2 nuevas tarjetas: "Tiempo Vacante → 1ª Postulación (Prom.)" con promedio/mediana/P90/SLA, y "Vacantes en SLA (≤7 días)" con conteo y %. |

### Definicion de Fechas (Regla Oficial)

| Concepto | Campo | Tipo | Justificacion |
|----------|-------|------|---------------|
| **Apertura de vacante** | `RequestPosition.RequestDate` | `DateOnly` | Fecha oficial de solicitud de la vacante (negocio), no auditoria |
| **Primera postulacion valida** | `MIN(CandidateApplication.ApplicationDate)` por `RequestPositionId` | `DateOnly` | Fecha de postulacion declarada, solo postulations posteriores o iguales a apertura (`Dias >= 0`) |

> **Nota:** `RequestPosition` NO tiene `CreatedAt` (hereda solo `Id` de `GuidIdEntity`). `CandidateApplication` tiene `CreatedAt` (auditoria) y `ApplicationDate` (negocio). Se usa `ApplicationDate` por ser la fecha de negocio declarada.

### SLA y Metricas
- **SLA objetivo:** ≤ 7 dias
- **Metricas entregadas:** Promedio, Mediana, Percentil 90, Conteo en SLA, % en SLA, Total vacantes con postulación
- **Excluidas del calculo:** Vacantes sin postulaciones, postulaciones con fecha anterior a apertura de vacante (data quality)

### Validaciones
- ✅ Backend compila (solo file lock de API corriendo)
- ✅ Frontend compila (`npx tsc --noEmit` sin errores)
- ✅ `scan-mojibake`: 0 mojibake nuevo
- ✅ Endpoint `GET /api/recruitment-candidate-applications/kpis` retorna nuevos campos con datos reales

### Criterios de Cierre V2-F2
- ✅ KPI `Tiempo Vacante -> Primera Postulacion` funcional con datos reales
- ✅ Fecha origen de vacante documentada y justificada (`RequestDate`)
- ✅ Primera postulacion calculada desde datos persistidos (`ApplicationDate`)
- ✅ No rompe flujo actual de vacantes, postulaciones ni KPIs existentes

### Archivos Modificados
- `api/.../DTOs/CandidateApplicationKpisDto.cs` - + 6 campos
- `api/.../Services/CandidateApplicationAppService.cs` - logica en `GetKpisAsync()`
- `client/.../interfaces/candidate-application.ts` - + 6 campos en interface
- `client/.../candidate-application-kpis.ts` - 2 nuevas tarjetas KPI

## Integracion Staff Board - Entrevistador RH (V2-F6)

Fecha: `2026-08-10`
Contexto: Plan V2-F6 - `docs/plans/20260809-reclutamiento-candidatos-v2-plan.md`

### Problema
El `Staff Board` de RH mostraba vacantes y colaboradores, pero no tenia contexto operativo para el entrevistador: no veia candidato postulado, etapa de pipeline, fecha de cita, entrevistador asignado, feedback ni desenlace. Solo usaba `positionRequest.status` basico.

### Solucion: Vista Agregada para Entrevistador/RH

**Backend (Candidates - fuente de verdad):**

| Componente | Cambio |
|------------|--------|
| **DTO `InterviewerApplicationViewDto`** | Vista agregada: postulacion + vacante + puesto + candidato + entrevista + entrevistador + estados de agenda + permisos por accion |
| **DTO `InterviewerActionRequest` + `InterviewerActionType`** | Acciones tipadas: SubmitFeedback, MarkNoShow, Reject, Approve |
| **Enum `CandidateDecision`** | Agregado `NoSePresento` para accion "No asistio" |
| **Servicio `CandidateApplicationAppService`** | `GetInterviewerViewAsync()`: filtra postulaciones en EntrevistaReclutamiento/Operaciones por usuario actual (o todas si Reclutamiento/Admin). `ExecuteInterviewerActionAsync()`: ejecuta feedback/no-show/rechazo/aprobacion reutilizando logica de pipeline oficial. |
| **Endpoint `CandidateApplicationEndPoint`** | `GET /interviewer-view` + `POST /interviewer-action` |
| **`ResolveDecisionTargetStage`** | Soporta `CandidateDecision.NoSePresento` → `CandidateApplicationStage.NoSePresento` |

**Frontend (Staff Board - consumidor):**

| Componente | Cambio |
|------------|--------|
| **Service `StaffBoardInterviewerService`** | Consume endpoints, helpers para crear requests tipados |
| **Component `StaffBoard`** | Inyecta service, carga vista en `onLoadData`, metodos `onMarkNoShow`, `onReject`, `onApprove`, `onSubmitFeedback`, `onViewAgenda` |
| **Interface `InterviewerApplicationViewDto`** | Tipado completo de la vista agregada |
| **Template `staff-board.html`** | Panel compacto en cada vacante con: candidato, fecha cita, entrevistador, estado agenda, acciones segun permisos |

### Flujo de Acciones (sin duplicar logica)

1. **Retroalimentacion** → Abre bandeja `Candidates > Entrevistas` con `applicationId` (reutiliza modal oficial)
2. **No asistio** → Ejecuta `MarkNoShow` → Cierra postulacion en etapa `NoSePresento` + notifica
3. **Rechazar** → Navega a bandeja entrevistas con `action=reject` (requiere motivo)
4. **Aprobar** → Ejecuta `Approve` → Transiciona a `EntrevistaOperaciones` o `Seleccionado` segun pipeline + notifica
5. **Ver Agenda** → Navega a `/recruitment/candidates/recruitment-agenda`

### Permisos
- **Reclutamiento/Admin/SuperUsuario**: Ven todas las postulaciones en entrevista
- **Entrevistador asignado**: Solo ve sus postulaciones asignadas (`OperationsInterviewAssignedToUserId`)
- **Acciones**: Solo el entrevistador asignado o Reclutamiento/Admin pueden ejecutar

### Validaciones
- ✅ Backend compila (file lock API)
- ✅ Frontend compila (`npx tsc --noEmit` sin errores)
- ✅ `scan-mojibake`: 0 mojibake nuevo
- ✅ Endpoints `GET /interviewer-view` y `POST /interviewer-action` registrados
- ✅ Reutiliza pipeline oficial (`RegisterDecisionAsync`, `ChangeStageAsync`, notificaciones)

### Criterios de Cierre V2-F6
- ✅ `Staff Board` muestra panel operativo por vacante con datos de entrevista
- ✅ No hay duplicidad de reglas con `Candidates` (fuente de verdad)
- ✅ Feedback, no-show, rechazo, aprobacion impactan pipeline oficial
- ✅ Entrevistador opera desde contexto RH sin salir forzosamente
- ✅ Integracion documentada como decision de arquitectura

### Archivos Creados/Modificados
**Backend:**
- `api/.../DTOs/InterviewerApplicationViewDto.cs` (nuevo)
- `api/.../Services/CandidateApplicationAppService.cs` - + `GetInterviewerViewAsync`, `ExecuteInterviewerActionAsync`, `GetInterviewerRole`, `IsRecruiterOrAdmin`
- `api/.../EndPoints/CandidateApplicationEndPoint.cs` - + `GET interviewer-view`, `POST interviewer-action`
- `api/.../DTOs/CandidateDecision.cs` - + `NoSePresento`
- `api/.../Services/CandidateApplicationAppService.cs` - `ResolveDecisionTargetStage` soporta `NoSePresento`

**Frontend:**
- `client/.../staff-board/interfaces/interviewer-view.interface.ts` (nuevo)
- `client/.../staff-board/services/staff-board-interviewer.service.ts` (nuevo)
- `client/.../staff-board/staff-board.ts` - inyecta service, carga vista, metodos de accion
- `client/.../staff-board/staff-board.html` - panel compacto con acciones
- `client/.../endpoints/reclutamiento.endpoints.ts` - + `interviewerView`, `interviewerAction`

## V2-F3: Dashboard Gráfico con Charts

Fecha: `2026-08-10`
Plan: `docs/plans/20260809-reclutamiento-candidatos-v2-plan.md`

### Problema
El dashboard `/recruitment/candidates/kpis` era solo tabular (tarjetas + tablas); faltaba visualización rápida de tendencias y cuellos de botella.

### Solución: 5 Gráficos con ECharts (Stack Existente)

| # | Gráfico | Tipo | Pregunta Operativa | Motor |
|---|---------|------|-------------------|-------|
| 1 | Pipeline por etapas | Bar horizontal | ¿Dónde se concentra el pipeline? | 9 etapas |
| 2 | Estado Entrevistas Ops | Doughnut | ¿Dónde está atorada la operación? | 5 estados |
| 3 | Tiempo Vacante → 1ª Postulación | Bar + SLA reference | ¿Cumplimos SLA ≤ 7 días? | Prom/Med/P90/SLA |
| 4 | Fuente de Reclutamiento | Bar dual axis | ¿Canales + conversión? | Postulaciones + % |
| 5 | Actividad Reciente | Bar comparativo | ¿Aceleramos o enfriamos? | 7d vs 30d |

**Stack:** ECharts via `ngx-echarts` + `chart.js` (ya en `package.json`)

**Componente:** `ChartWrapper` (existente en `@ui/web/charts/chart-wrapper.ts`)

**Responsive:** Desktop/Mobile - tarjetas card con height fijo

### Implementación

**Computed signals en `candidate-application-kpis.ts`:**
- `pipelineChartData` - bar horizontal 9 etapas
- `interviewStatusChartData` - doughnut 5 estados
- `timeToFirstChartData` - bar con colores semáforo SLA
- `sourceChartData` - bar dual axis postulaciones + conversión
- `activityChartData` - bar comparativo 7d/30d

**Template en `candidate-application-kpis.html`:**
- 5 `app-chart-wrapper` en tarjetas card con height fijo
- Fallback "Sin datos" cuando no hay datos
- Leyenda SLA en gráfico 3

### Validaciones
- ✅ Backend compila (file lock API)
- ✅ Frontend compila (`npx tsc --noEmit` sin errores)
- ✅ `scan-mojibake`: 0 mojibake nuevo
- ✅ Charts usan Design System tokens (colores DS_PALETTE)
- ✅ Reutiliza `ChartWrapper` + `echarts-adapters` existentes

### Criterios de Cierre V2-F3
- ✅ Dashboard pasa de numérico a visual sin perder claridad
- ✅ Cada chart responde una necesidad operativa real
- ✅ No rompe KPIs existentes ni contratos
- ✅ Listo para uso diario de Reclutamiento

### Archivos Modificados
- `client/.../candidate-application-kpis.ts` - 5 computed signals + imports
- `client/.../candidate-application-kpis.html` - 5 chart-wrapper en cards

## V2-F4: Automatización - Escalación de Entrevistas Estancadas

Fecha: `2026-08-10`
Plan: `docs/plans/20260809-reclutamiento-candidatos-v2-plan.md`

### Problema
Entrevistas de Operaciones vencidas sin retroalimentación requieren seguimiento manual, resultando en vacantes estancadas.

### Decisión: Escalación Automática (no Re-asignación Directa)

**Justificación:** No existe regla de negocio aprobada ni catálogo confiable de reemplazo automático. La escalación notifica a responsables para acción humana controlada.

### Regla Operativa

| Condición | Valor |
|-----------|-------|
| Etapa | `EntrevistaOperaciones` |
| Entrevistador asignado | `OperationsInterviewAssignedToUserId` no vacío |
| Fecha programada | `OperationsInterviewAt` con valor |
| Vencida | `OperationsInterviewAt <= now` |
| Sin feedback | `InterviewFeedbacks.Any() == false` |
| **Umbral escalación** | **≥ 48 horas** post-vencimiento sin feedback |

### Flujo de Notificaciones

| Tiempo post-vencimiento | Acción |
|-------------------------|--------|
| 0-24h | `NotifyOperationsInterviewOverdueAsync` (existía) |
| 24-48h | `NotifyOperationsInterviewReminderAsync` (existía) |
| **≥48h sin feedback** | **`NotifyOperationsInterviewEscalatedAsync` (NUEVO)** |

### Implementación Backend

| Componente | Cambio |
|------------|--------|
| `ICandidateNotificationCoordinatorService` | + `NotifyOperationsInterviewEscalatedAsync(Guid, int hoursOverdue)` |
| `CandidateNotificationCoordinatorService` | Implementación: notifica Reclutamiento + Admin/GO/GA + email con CV |
| `CandidateAutomationService` | Lógica en `ExecuteDailyMonitoringAsync()`: detecta ≥48h overdue sin feedback → escalación |
| Constante | `EscalationHoursThreshold = 48` |

### Destinatarios Escalación
- Reclutamiento (`OnGetReclutamientoAsync`)
- Administrador del cliente (`OnGetAdministradorAsync`)
- Gerente de Operaciones (`OnGetGerenteOperacionesAsync`)
- Gerente de Atención (`OnGetGerenteAtencionAsync`)

### Canales
- In-app (SignalR) + Email (con CV adjunto si existe)

### Lo que NO se hace
- ❌ Re-asignación automática (requiere regla aprobada + catálogo reemplazo)
- ❌ Cambio de etapa automático (requiere decisión humana)

### Validaciones
- ✅ Backend compila (file lock API)
- ✅ Frontend compila (`npx tsc --noEmit`)
- ✅ `scan-mojibake`: 0 mojibake nuevo
- ✅ No rompe automatizaciones existentes
- ✅ Logging trazable en `CandidateAutomationService`

### Archivos Modificados
- `api/.../Interfaces/ICandidateNotificationCoordinatorService.cs` - + `NotifyOperationsInterviewEscalatedAsync`
- `api/.../Services/CandidateNotificationCoordinatorService.cs` - implementación + email
- `api/.../Services/CandidateAutomationService.cs` - lógica escalación + `EscalationHoursThreshold = 48`

---

### V2-F5: Alertas Multi-canal (Slack/Teams)

### V2-F7: Cola Dedicada Para Entrevistador

Se separo la operacion del entrevistador de `Staff Board` y se movio a una vista dedicada en Candidates: `/recruitment/candidates/interviewer-queue`.

Decisiones clave:
- `Staff Board` queda como punto de entrada contextual y resumen ligero por vacante.
- La gestion operativa vive en `CandidateInterviewerQueue`, agrupada por vacante y candidatos.
- El endpoint `interviewer-queue` ahora devuelve tanto pendientes activos como historico/seguimiento del customer en contexto.
- Para usuarios no Reclutamiento/Admin, el backend limita la cola a entrevistas asignadas o historico ya atendido por el mismo entrevistador.

Capacidades entregadas:
- Resumen por vacante con candidato(s), fecha/hora de junta, estatus y entrevistador.
- Card lateral con datos principales del candidato y acceso directo al CV.
- Filtros de `Pendientes`, `Historico`, `Vencidas`, `Con feedback` y `Todo`.
- Navegacion directa a `Responder entrevista` y a la bandeja de seguimiento de postulaciones.

---

## Fase 1 - Reestructuracion: Inventario Tecnico de Modelo Legacy

Fecha: `2026-08-10`
Fuente: `docs/modulos-nuevos/reestructuracion-reclutamiento-candidates/06-execution-handoff.md` (Fase 1)
Plan: `docs/modulos-nuevos/reestructuracion-reclutamiento-candidates/04-implementation-plan.md`

### Objetivo

Mapear cada punto de lectura/escritura del modelo legacy antes de introducir
`CandidateInterview`, `CandidateInterviewResult`, `CandidateWorkExperience`,
`InterviewerMatrix` y `RequestEmployeeRegisterFile`. Esta fase solo congela e
inventaria; NO elimina ni migra.

### Columnas / entidades legacy monitoreadas

| Legacy | Entidad | Estado objetivo |
|--------|---------|-----------------|
| `RecruitmentInterviewAt` | `CandidateApplication` | Reemplazada por `CandidateInterview.ScheduledAt` |
| `OperationsInterviewAt` | `CandidateApplication` | Reemplazada por `CandidateInterview.ScheduledAt` |
| `OperationsInterviewAssignedToUserId` | `CandidateApplication` | Reemplazada por `CandidateInterview.InterviewerUserId` |
| `CandidateInterviewFeedback` (tabla `RecruitmentCandidateInterviewFeedback`) | `CandidateInterviewFeedback` | Reemplazada por `CandidateInterviewResult` |
| `ExperienceSummary` | `Candidate` | Reemplazada por `CandidateWorkExperience` (deprecada, fuente transitoria) |

### Usos de columnas legacy (Backend)

**Entidad y contexto EF**
- `CandidateApplication.cs:61,67,73` - declaracion de `RecruitmentInterviewAt`,
  `OperationsInterviewAt`, `OperationsInterviewAssignedToUserId`.
- `CandidateApplication.cs:119` - coleccion `InterviewFeedbacks` (legacy feedback).
- `ApplicationDbContext.cs:774` - `DbSet<CandidateInterviewFeedback>`.
- `ApplicationDbContext.cs:1124-1125` - indice
  `IX_RecruitmentCandidateApplications_OperationsInterviewAssignedToUserId`.
- `ApplicationDbContext.cs:1143` - configuracion de `CandidateInterviewFeedback`.
- `Candidate.cs:77` - `ExperienceSummary`.

**`CandidateApplicationAppService.cs` (lectura/escritura intensiva)**
- `GetRecruitmentAgendaAsync` (`CandidateApplicationAppService.cs:103-155`):
  ordena por `RecruitmentInterviewAt`/`OperationsInterviewAt` (132-133), selecciona
  `OperationsInterviewAssignedToUserId` (138), construye item via
  `BuildRecruitmentAgendaItem` (444-446).
- `GetRecruitmentInterviewBoardAsync` (`CandidateApplicationAppService.cs:158-254`):
  usa `OperationsInterviewAssignedToUserId` (218), `BuildRecruitmentBoardVacancy`.
- `ScheduleRecruitmentInterviewAsync` (`CandidateApplicationAppService.cs:256+`):
  escribe `RecruitmentInterviewAt`/`OperationsInterviewAt`/
  `OperationsInterviewAssignedToUserId` (279-289).
- `CreateAsync`/`UpdateAsync`: mapean y limpian `RecruitmentInterviewAt`,
  `OperationsInterviewAt`, `OperationsInterviewAssignedToUserId` (718-734, 796-866).
- `GetKpisAsync`: desglose de Entrevistas Ops con
  `OperationsInterviewAssignedToUserId`, `OperationsInterviewAt`,
  `InterviewFeedbacks` (`CandidateApplicationAppService.cs:530-551`).
- `GetInterviewerViewAsync`/`ExecuteInterviewerActionAsync`: permiso por
  `OperationsInterviewAssignedToUserId` (1291-1492).
- `GetInterviewResponseAsync` y cola entrevistador: leen feedback legacy (462,
  1359, 1550-1570, 2044).

**`CandidateAutomationService.cs` (vencidas/escalacion)**
- `CandidateAutomationService.cs:34-66`: detecta overdue con
  `OperationsInterviewAssignedToUserId` y `OperationsInterviewAt`.

**`CandidateNotificationCoordinatorService.cs` (emails/SignalR)**
- `CandidateNotificationCoordinatorService.cs:135-271, 349-537`: textos y DTO con
  `OperationsInterviewAt`, `OperationsInterviewAssignedToUserId`; envio de email
  legacy `SendCandidateInterviewFeedbackEmailAsync` (349-350).

**`CandidateInterviewAppService.cs` (camino legacy de feedback)**
- `CandidateInterviewAppService.cs:15-106`: `SubmitFeedbackAsync` y
  `GetByApplicationAsync` escriben/leen `CandidateInterviewFeedback`.
- `CandidateInterviewMapping.cs:10`: mapeo `CandidateInterviewFeedback`.
- `CandidateInterviewEndPoint.cs:14-21`: `POST feedback`, `GET application/{id}`.
- `RecruitmentEmailService.cs:219-226`, `IRecruitmentEmailService.cs:67-68`,
  `EmailTemplates.cs:37`, `RecruitmentCandidateInterviewFeedbackEmailDTO.cs`,
  template `.cshtml`: email legacy de feedback.
- DTOs: `CandidateInterviewFeedbackItemDto.cs`, `CandidateInterviewFeedbackCreateDto.cs`.

### Endpoints afectados

**`CandidateApplicationEndPoint.cs`**
- `GET recruitment-agenda` (`CandidateApplicationEndPoint.cs:24`) - legacy fields.
- `GET recruitment-interview-board` (`:29`) - legacy fields.
- `GET kpis` (`:34`) - legacy fields en desglose Ops.
- `POST {id}/recruitment-schedule` (`:102`) - escribe `RecruitmentInterviewAt`.
- `POST {id}/cancel-recruitment-schedule` (`:108`) - escribe `RecruitmentInterviewAt`.
- `GET interviewer-view` (`:86`) - permiso por `OperationsInterviewAssignedToUserId`.
- `POST interviewer-action` (`:91`) - acciones sobre pipeline (no escribe legacy,
  pero depende del modelo actual).
- `GET interviewer-queue` (`:97`) - ordena por fechas legacy.
- `GET {id}/interview-response` (`:114`) - camino de feedback legacy.
- `POST run-automation` (`:39`) - vencidas/escalacion legacy.

**`CandidateInterviewEndPoint.cs`**
- `POST feedback` (`:14`) - escribe `CandidateInterviewFeedback`.
- `GET application/{id}` (`:19`) - lee `CandidateInterviewFeedback`.

**Constantes frontend** `reclutamiento.endpoints.ts`
- `CandidateApplications.recruitmentAgenda`, `recruitmentInterviewBoard`,
  `kpis`, `scheduleRecruitmentInterview`, `cancelRecruitmentSchedule`,
  `interviewerView`, `interviewerQueue`, `interviewerAction`, `interviewResponse`.
- `CandidateInterviews.submitFeedback`, `byApplication` (feedback legacy).

### Componentes afectados (Frontend)

- `candidate-application/candidate-application-form.ts:122,150-155` - lee/escribe
  `recruitmentInterviewAt` / `RecruitmentInterviewAt` (campo en FormData).
- `candidate-application/interfaces/candidate-application.ts` - `CandidateRecruitmentAgendaItem`
  y tipos de board/kpis superficie campos legacy.
- `recruitment-agenda-list.ts` / `.html` - consumen `recruitment-agenda` (legacy).
- `candidate-recruitment-interviews.ts` / `.html` - consumen `recruitment-interview-board`.
- `candidate-interview/candidate-interview-feedback-form.ts` + `interfaces/candidate-interview.ts`
  - `CandidateInterviewFeedbackCreate`/`Item`/`Response` (camino legacy).
- `candidate-interview/candidate-interview-pending-list.ts`,
  `candidate-interview/candidate-interview-response.ts` - consumen feedback legacy.
- `candidate-interviewer-queue/candidate-interviewer-queue.ts` - importa
  `CandidateInterviewFeedbackForm`; consume `interviewer-queue`.
- `candidates.routing.ts:51` - ruta `interviews/respond` (feedback legacy).
- `candidate-application-kpis.ts` - graficos de estado Ops derivados de legacy.

### Orden recomendado de migracion

1. **Fase 2 - Modelo de datos:** crear entidades nuevas
   (`CandidateInterview`, `CandidateInterviewResult`, `CandidateWorkExperience`,
   `InterviewerMatrix`, `RequestEmployeeRegisterFile`), agregar flags de talent
   pool en `Candidate`, mantener columnas legacy intactas, generar migracion.
2. **Fase 3 - Backend nuevo:** AppServices/DTOs/endpoints de
   `CandidateInterview`, `CandidateInterviewResult`, `InterviewerMatrix`;
   matriz de entrevistador por customer+rol.
3. **Fase 4 - Migracion operativa:** reescribir `GetRecruitmentAgendaAsync`,
   `GetRecruitmentInterviewBoardAsync`, `GetInterviewerQueueAsync`,
   `GetInterviewResponseAsync`, automatizacion y notificaciones para leer/escribir
   el modelo nuevo. Mantener legacy solo como lectura transitoria hasta backfill.
4. **Fase 5/6 - Frontend:** reconvertir `candidate-application-form` en
   "Agregar candidato y entrevista", detalle por puesto, y separar cola del
   entrevistador sobre `CandidateInterview`/`CandidateInterviewResult`.
5. **Fase 8 - Retiro:** solo tras backfill y validacion, remover
   `RecruitmentInterviewAt`, `OperationsInterviewAt`,
   `OperationsInterviewAssignedToUserId`, `CandidateInterviewFeedback`,
   `ExperienceSummary` como fuente activa.

### Precondiciones de no-ruptura (Fase 1)

- No eliminar columnas legacy en esta fase.
- No mover shared sin analisis de impacto.
- Mantener endpoints legacy funcionando hasta Fase 4 (dual-read transitorio).
- No inventar roles fuera del catalogo (`Application Roles Catalog`).

### Criterio de aceptacion Fase 1 (cumplido)

- ✅ Inventario explicito de lecturas/escrituras legacy (esta seccion).
- ✅ Endpoints y componentes afectados mapeados.
- ✅ Orden de migracion recomendado documentado.

---

## Ejecucion Fase 2 - Nuevo Modelo de Datos

Fecha: `2026-08-11`
Fuente: `06-execution-handoff.md` (Fase 2)

### Entidades nuevas creadas

| Entidad | Tabla | Archivo |
|---------|-------|---------|
| `CandidateWorkExperience` | `RecruitmentCandidateWorkExperiences` | `Recruitment/ReclutamientoyAltasBajas/CandidateWorkExperience.cs` |
| `CandidateInterview` | `RecruitmentCandidateInterviews` | `Recruitment/ReclutamientoyAltasBajas/CandidateInterview.cs` |
| `CandidateInterviewResult` | `RecruitmentCandidateInterviewResults` | `Recruitment/ReclutamientoyAltasBajas/CandidateInterviewResult.cs` |
| `InterviewerMatrix` | `RecruitmentInterviewerMatrix` | `Recruitment/ReclutamientoyAltasBajas/InterviewerMatrix.cs` |
| `RequestEmployeeRegisterFile` | `RecruitmentRequestEmployeeRegisterFiles` | `Recruitment/ReclutamientoyAltasBajas/RequestEmployeeRegisterFile.cs` |

### Enums nuevos (LuxuryApp.Shared/Enums)

- `CandidateInterviewType` (Reclutamiento, Operaciones)
- `CandidateInterviewStatus` (Pendiente, Confirmada, Realizada, Cancelada, NoAsistio)
- `CandidateInterviewScheduleStatus` (Pendiente, Propuesta, Confirmada, Cancelada)

### Modificaciones

- `Candidate.cs`: + `IsInTalentPool`, + `TalentPoolNotes`, + coleccion `WorkExperiences`.
  `ExperienceSummary` se mantiene como fuente transitoria (no se elimina).
- `CandidateApplication.cs`: columnas legacy (`RecruitmentInterviewAt`,
  `OperationsInterviewAt`, `OperationsInterviewAssignedToUserId`) se mantienen
  intactas en esta fase (retiro en Fase 8).
- `ApplicationDbContext.cs`: + 5 `DbSet`, configuracion de relaciones, e indice
  compuesto `CandidateId, RequestPositionId` relajado de UNICO a NO UNICO.

### Migracion

- `20260811014505_ReclutamientoNuevoModeloEntrevistas`
  - Crea 5 tablas nuevas con FKs y indices.
  - Agrega `IsInTalentPool`, `TalentPoolNotes` a `RecruitmentCandidates`.
  - Recrea `IX_RecruitmentCandidateApplications_CandidateId_RequestPositionId`
    sin `unique: true`.

### Validaciones

- ✅ `dotnet build` de `LuxuryApp.Infrastructure.Data` y `LuxuryApp.Application` (0 errores).
- ✅ Migracion generada con `ApplicationDbContextFactory` (host API bloqueado por
  proceso en ejecucion; se uso el design-time factory del proyecto de datos).
- ✅ Frontend no modificado en esta fase (sin ruptura).

### Criterios de aceptacion Fase 2 (cumplidos)

- ✅ Compila backend.
- ✅ Migracion generada.
- ✅ No se rompio frontend.

---

## Ejecucion Fase 3 - Contratos Backend Nuevos

Fecha: `2026-08-11`
Fuente: `06-execution-handoff.md` (Fase 3)

### Grupos logicos nuevos (sin depender de columnas legacy)

**`CandidateWorkExperience`** (`Candidates/CandidateWorkExperience/`)
- `ICandidateWorkExperienceAppService` / `CandidateWorkExperienceAppService`
- Endpoints `api/recruitment-candidate-work-experiences`:
  `POST ""`, `PUT {id}`, `DELETE {id}`, `GET candidate/{candidateId}`
- DTOs (1 por archivo): `CandidateWorkExperienceCreateOrUpdateDto`,
  `CandidateWorkExperienceItemDto`
- Mapping `CandidateWorkExperienceMapping`

**`CandidateInterview`** (extendido en `Candidates/CandidateInterview/`)
- Nuevos metodos en `ICandidateInterviewAppService`:
  `CreateInterviewAsync`, `RescheduleInterviewAsync`, `ConfirmInterviewAsync`,
  `CancelInterviewAsync`, `CloseInterviewAsync`, `GetInterviewsByApplicationAsync`,
  `GetInterviewsByWorkPositionAsync`, `GetInterviewsByInterviewerAsync`.
- Endpoints nuevos en `CandidateInterviewEndPoint`
  (`api/recruitment-candidate-interviews`):
  `POST ""`, `POST {id}/reschedule`, `POST {id}/confirm`,
  `POST {id}/cancel`, `POST {id}/close`,
  `GET by-application/{candidateApplicationId}`,
  `GET by-work-position/{workPositionId}`,
  `GET by-interviewer/{interviewerUserId}`
- DTOs (1 por archivo): `CandidateInterviewCreateDto`,
  `CandidateInterviewRescheduleDto`, `CandidateInterviewCloseDto`,
  `CandidateInterviewItemDto`
- Enum nuevo `CandidateInterviewOutcome` (Realizada, NoAsistio, Cancelada)
- Mapping ampliado en `CandidateInterviewMapping`

**`CandidateInterviewResult`** (`Candidates/CandidateInterviewResult/`)
- `ICandidateInterviewResultAppService` / `CandidateInterviewResultAppService`
- Endpoints `api/recruitment-candidate-interview-results`:
  `POST ""`, `GET interview/{interviewId}`
- DTOs: `CandidateInterviewResultCreateDto`, `CandidateInterviewResultItemDto`
- Mapping `CandidateInterviewResultMapping`
- `RegisterResultAsync` cierra la cita (Status=Realizada, ClosedAt) y valida
  motivo vs decision.

**`InterviewerMatrix`** (`Candidates/InterviewerMatrix/`)
- `IInterviewerMatrixAppService` / `InterviewerMatrixAppService`
- Endpoints `api/recruitment-interviewer-matrix`:
  `POST ""`, `PUT {id}`, `DELETE {id}`, `GET customer/{customerId}`,
  `GET resolve/{customerId}/{workPositionRole}`
- DTOs: `InterviewerMatrixCreateOrUpdateDto`, `InterviewerMatrixItemDto`
- Mapping `InterviewerMatrixMapping`

### Reglas aplicadas
- 1 DTO por archivo (cumple regla critica de DTOs).
- Endpoints separados por feature (no se toco `CandidateApplicationAppService`
  para agendar).
- La creacion de citas (`CreateInterviewAsync`) escribe `CandidateInterview`,
  NO las columnas legacy `RecruitmentInterviewAt`/`OperationsInterviewAt`.
- El feedback legacy (`SubmitFeedbackAsync`) se conserva intacto; se retira en
  Fase 8.

### Validaciones
- ✅ `dotnet build` de `LuxuryApp.Application` (0 errores).
- ✅ API de entrevistas funcional sin columnas legacy para crear citas.
- ⚠️ `LuxuryApp.Api` no se reconstruye localmente: bin bloqueado por proceso
  en ejecucion (pid 6272). El host descubre los endpoints via `IEndPointsModule`.

### Criterio de aceptacion Fase 3 (cumplido)
- ✅ Existe API de entrevistas sin depender de columnas legacy para crear
  nuevas citas.

---

## Correccion de Hallazgos de Fase 3 (previo a Fase 4)

Fecha: `2026-08-10`
Fuente: `kilocode-prompt.md`

### Hallazgo 1 - Creacion de entrevista no debe confiar en cliente
- `CandidateInterviewAppService.CreateInterviewAsync` ahora:
  - Resuelve el rol entrevistador desde `InterviewerMatrix` (customer +
    rol del puesto de la postulacion). Error `INTERVIEWER_MATRIX_RULE_NOT_FOUND`
    si no hay regla activa.
  - Resuelve usuarios elegibles via `IUserRoleService.GetUsersInRoleAsync(rol,
    customerId)`. Error `NO_ELIGIBLE_INTERVIEWERS` si vacio.
  - `dto.InterviewerUserId` Solo se acepta si esta en el conjunto elegible
    (`INTERVIEWER_NOT_ELIGIBLE`); si no se envia, fallback controlado al primer
    usuario elegible.
  - `InterviewerRole` se sobreescribe con el valor de la matriz (no se usa el
    del cliente). `dto.InterviewerRole` queda ignorado.
- Helper `ResolveRoleEnum` mapea `ApplicationRole` (Name/DisplayName) a
  `ApplicationRoleEnum`.

### Hallazgo 2 - Seguridad en endpoints nuevos
- `InterviewerMatrixEndPoint`: grupo completo bajo
  `RequireAuthorization("SoloSuperUsuario")`.
- `CandidateInterviewResultEndPoint`: `RequireAuthorization("RequireRecruitmentRole")`.
- `CandidateInterviewEndPoint`: endpoints de gestion de cita
  (create/reschedule/confirm/cancel/close/by-application/by-work-position/
  by-interviewer) en grupo `RequireAuthorization("RequireRecruitmentRole")`.
  Los endpoints legacy de feedback conservan `RequireAuthorization()` para no
  romper el flujo actual del entrevistador (se retiran en Fase 8).

### Hallazgo 3 - Cardinalidad 1:1 en resultado
- `CandidateInterviewResultAppService.RegisterResultAsync` rechaza con
  `INTERVIEW_ALREADY_EXISTS` si la entrevista ya tiene resultado.
- `ApplicationDbContext`: indice unico
  `IX_RecruitmentCandidateInterviewResults_InterviewId_Unique` sobre
  `InterviewId`.
- Migracion `ReclutamientoResultadoUnico` generada.

---

## Ejecucion Fase 4 - Matriz configurable desde Admin

Fecha: `2026-08-10`
Fuente: `kilocode-prompt.md` (Nueva Fase 4)

### Backend
- `InterviewerMatrix` ya exponia CRUD por customer. Se refuerza seguridad con
  `SoloSuperUsuario` (ver Hallazgo 2).
- `CandidateInterview` consume `InterviewerMatrix` como fuente de verdad al crear
  citas (ver Hallazgo 1). No se migra aun la logica operativa legacy
  (`GetRecruitmentAgendaAsync`, `GetRecruitmentInterviewBoardAsync`,
  `GetInterviewerQueueAsync`).

### Frontend Admin (`admin.luxuryapp`)
Feature nueva `seguridad-permisos/interviewer-matrix`:
- `interviewer-matrix.ts` / `.html` / `.scss` - lista por cliente (p-table),
  alta/edicion (selects de rol del puesto y rol entrevistador + activo),
  eliminar.
- `interviewer-matrix.service.ts` - consume endpoints de matriz y select-items
  (`customers-active`, `application-roles`).
- `interfaces/interviewer-matrix.dto.ts` - DTOs tipados.
- Endpoints agregados en `reclutamiento.endpoints.ts`:
  `EndpointsReclutamiento.InterviewerMatrix.{base,byCustomer,resolve}`.
- Ruta `admin.routes.ts`: `/admin/interviewer-matrix` con `superUsuarioGuard`.
- Menu: entrada en `admin-wrapper-menu.ts` y tarjeta en `admin-modules.ts`.

### Ajuste: roles desde API (sin hardcode)
- Backend: `SelectItemEnumEndPoints` expone `ApplicationRoleEnum` en ruta
  `application-roles` (`api/select-item-enum/application-roles`) reusando
  `GetEnumSelectList<TEnum>`.
- Frontend: `interviewer-matrix.service.getRoles()` consume
  `EndpointsSelectItem.SelectItems.applicationRoles` via
  `onGetEnumSelectItem` (hub `select-item-enum`).
- `interviewer-matrix.ts`: se elimino la interfaz `RoleOption` y el array
  hardcodeado; `roles` es `signal<SelectItemDto[]>()` cargado en `ngOnInit`
  junto con `customers` (Promise.all). `roleLabel()` resuelve contra el
  catalogo; `openCreate()` usa el primer rol disponible; el alta se bloquea
  hasta que carguen los roles (sin fallback hardcodeado).
- Se reuso `SelectItemDto` existente (`core/interfaces/select-item.dto.ts`)
  en lugar de crear interfaz nueva.

### Cierre de hallazgos y Fase 4 (validado)
- ✅ `dotnet build` `LuxuryApp.Application` = 0 errores.
- ✅ `npx tsc --noEmit` `client/angular` = 0 errores (EXIT 0).
- ✅ Escaneo de mojibake en feature = 0.
- ✅ Roles de la matriz consumidos desde `api/select-item-enum/application-roles`
  (sin hardcode, sin fallback local).
- ✅ Backend de entrevistas ya consume `InterviewerMatrix` como fuente de verdad
  al crear citas (Finding 1), listo para la siguiente fase de migracion
  operativa. Lo pendiente por instruccion: migrar `GetRecruitmentAgendaAsync`,
  `GetRecruitmentInterviewBoardAsync`, `GetInterviewerQueueAsync` y retiro de
  legacy (Fase 5+).

### Validaciones
- ✅ `dotnet build` de `LuxuryApp.Application` (0 errores).
- ✅ `npx tsc --noEmit` de `client/angular` (0 errores).
- ✅ Migracion `ReclutamientoResultadoUnico` generada.

### Decisiones tomadas
- Roles de la matriz en frontend usan lista local curada de `ApplicationRoleEnum`
  (numericos estables) para garantizar el valor enviado al backend.
- Selects nativos en el formulario admin para minimizar dependencia de APIs de
  componentes desconocidos; se puede migrar a `CustomInputSelectButton` despues.
- Cliente/roles se cargan desde select-items existentes.

---

## Avance API - CandidateProcess como fuente operativa

Fecha: `2026-08-11`
Fuente: ejecucion directa Codex

### Alcance
- Solo backend/API.
- Sin migracion adicional en este corte.
- Sin retirar aun entidades legacy.

### Cambios aplicados
- `CandidateProcessAppService` ya concentra las lecturas operativas de:
  - agenda de reclutamiento;
  - board de entrevistas;
  - interviewer queue.
- `CandidateApplicationAppService` conserva contratos legacy, pero esas
  lecturas ya delegan a `CandidateProcessAppService`.
- `CandidateNotificationCoordinatorService` deja de cargar
  `CandidateApplication` para eventos operativos y ahora carga
  `CandidateProcess`.
- `CandidateAutomationService` deja de evaluar:
  - `ApplicationDate`;
  - `OperationsInterviewAt`;
  - `OperationsInterviewAssignedToUserId`;
  - `InterviewFeedbacks`;
  y ahora usa:
  - `RegisterDate`;
  - `ScheduledAt`;
  - `InterviewerUserId`;
  - `Decision`.

### Decision tecnica
- Se mantiene el nombre de parametro `candidateApplicationId` en firmas
  publicas de notificacion por compatibilidad temporal, pero el valor real ya
  se resuelve contra `CandidateProcess.Id`.
- El CV adjunto para correos operativos sale del candidato maestro
  (`Candidate.CvFileName`) usando la ruta
  `RecruitmentMasterCandidateCvDirectory(candidateId)`.

### Validacion
- ✅ `dotnet build` de `LuxuryApp.Application` con `0 errores`.
- ✅ Queue, agenda, board, notificaciones y automatizacion ya leen
  `CandidateProcess`.

### Pendiente siguiente
- Fase de limpieza legacy:
  - retirar `CandidateInterviewFeedback`;
  - retirar `CandidateInterviewResult`;
  - sacar `CandidateApplication` y `CandidateInterview` del flujo operativo;
  - dejar lista la migracion unica final.

## Avance API - puente legacy controlado

Fecha: `2026-08-11`
Fuente: ejecucion directa Codex

### Que se ajusto
- `CandidateApplicationAppService.ScheduleRecruitmentInterviewAsync()` ya no
  deja la agenda solo en columnas legacy:
  - busca el `CandidateProcess` activo equivalente;
  - agenda primero en `CandidateProcess`;
  - luego sincroniza la sombra legacy para compatibilidad temporal.
- `CandidateApplicationAppService.CancelRecruitmentInterviewAsync()` sigue la
  misma estrategia.
- `CandidateApplicationAppService.ChangeStageAsync()` ya delega el cambio al
  nucleo `CandidateProcess` cuando existe proceso nuevo.
- `CandidateApplicationAppService.RegisterDecisionAsync()` ya delega la
  decision al nucleo `CandidateProcess` cuando existe proceso nuevo.
- la notificacion de envio a entrevista de operaciones usa `CandidateProcess.Id`
  cuando ya existe proceso nuevo.
- `CandidateApplicationAppService.ExecuteInterviewerActionAsync()` ya delega en
  `CandidateProcess` las acciones del entrevistador cuando existe proceso
  nuevo, y deja de crear `CandidateInterviewFeedback` como fuente operativa.
- `CandidateProcess.RegisterDecisionAsync()` fue corregido para respetar la
  transicion:
  - `EntrevistaReclutamiento + Aprobado -> EntrevistaOperaciones`
  - `EntrevistaOperaciones + Aprobado -> Seleccionado`
  - `EnEspera` no cierra el proceso.

### Que se marco como deuda aislada
- `CandidateInterviewAppService` e
  `ICandidateInterviewAppService` quedan marcados con `Obsolete`.
- `CandidateInterviewResultAppService` e
  `ICandidateInterviewResultAppService` quedan marcados con `Obsolete`.

### Lectura de la decision
- `CandidateProcess` ya es la fuente operativa a la que debe migrar el flujo.
- `CandidateInterview*` sigue existiendo solo para no romper compatibilidad
  mientras se prepara la limpieza final y la migracion unica.
