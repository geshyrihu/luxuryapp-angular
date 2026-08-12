# Candidates Frontend Docs

Ultima revision: `2026-08-11`
Scope: `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates`
Estado: `Vigente y alineado al codigo actual`

## Proposito

Esta carpeta documenta el estado real del frontend `Candidates` en Angular.
Su objetivo es ayudar a trabajar sobre el feature sin asumir rutas, etapas,
servicios o componentes que no existen.

Usa este documento para:

- ubicar las rutas reales del modulo
- identificar los componentes activos
- entender el flujo frontend actual
- recordar que el frontend vigente es solo `client/angular/...`

## Rutas reales del feature

El routing local del modulo vive en:

- `candidates.routing.ts`

Rutas disponibles hoy:

- `http://localhost:4200/recruitment/candidates/candidates`
- `http://localhost:4200/recruitment/candidates/applications`
- `http://localhost:4200/recruitment/candidates/interviews`
- `http://localhost:4200/recruitment/candidates/recruitment-agenda`

No existen en este feature rutas locales documentadas como:

- `candidate-applications`
- `interview/pending`
- `cv-upload`

## Estructura real

```text
candidates/
|-- candidate/
|   |-- candidate-list.ts
|   |-- candidate-form.ts
|   |-- candidate-detail.ts
|   |-- desktop/
|   |-- mobile/
|   `-- interfaces/
|-- candidate-application/
|   |-- candidate-application-list.ts
|   |-- candidate-application-form.ts
|   |-- candidate-stage-change-modal.ts
|   |-- candidate-process-hiring-modal.ts
|   |-- desktop/
|   |-- mobile/
|   `-- interfaces/
|-- candidate-interview/
|   |-- candidate-interview-pending-list.ts
|   |-- candidate-interview-feedback-form.ts
|   |-- desktop/
|   |-- mobile/
|   `-- interfaces/
|-- recruitment-shared/
|   |-- candidate-cv-upload.ts
|   |-- candidate-stage-badge.ts
|   |-- candidate-stage-labels.ts
|   |-- candidate-stage-timeline.ts
|   |-- candidate-decision-labels.ts
|   |-- candidate-decision-reason-select.ts
|   `-- mapped-p-tag.ts
|-- docs/
`-- candidates.routing.ts
```

Nota:

- Las interfaces no viven en una carpeta raiz unica del feature.
- Cada submodulo mantiene sus propios contratos locales en `interfaces/`.

## Componentes principales

### Candidate

- `candidate/candidate-list.ts`
  - lista candidatos
  - abre alta/edicion con `CandidateForm`
  - abre detalle con `CandidateDetail`
  - archiva con `PATCH recruitment-candidates/{id}/archive`
- `candidate/candidate-form.ts`
  - usa `FormGroup` tipado
  - crea o edita contra `EndpointsReclutamiento.Candidates`
  - ya no incluye `Fuente de reclutamiento` en el formulario maestro
- `candidate/candidate-detail.ts`
  - muestra ficha del candidato y sus postulaciones

### Candidate Application

- `candidate-application/candidate-application-list.ts`
  - lista postulaciones
  - permite filtrar por etapa
  - abre formulario de postulacion
  - abre modal de cambio de etapa
- `candidate-application/candidate-stage-change-modal.ts`
  - resuelve transiciones permitidas en frontend
  - envia `POST recruitment-candidate-applications/{id}/stage`
- `candidate-application/candidate-process-hiring-modal.ts`
  - procesa alta cuando la postulacion ya puede avanzar
  - envia `POST recruitment-candidate-applications/{id}/process-hiring`

### Candidate Interview

- `candidate-interview/candidate-interview-pending-list.ts`
  - combina listados de `EntrevistaReclutamiento` y `EntrevistaOperaciones`
  - abre modal de retroalimentacion
- `candidate-interview/candidate-interview-feedback-form.ts`
  - envia `POST recruitment-candidate-interviews/feedback`

## Patron tecnico actual

Hoy este feature trabaja principalmente con:

- componentes standalone
- `signal()` y `computed()`
- `ApiResponseService`
- `DialogHandlerService`
- wrappers oficiales `@ui/*`

Hoy no es correcto documentarlo como si usara:

- `PaginationStore`
- `CandidateService`
- `CandidateApplicationService`
- `CandidateInterviewService`

Si en el futuro se migra a ese patron, primero debe reflejarse en codigo y luego
actualizarse esta documentacion.

## Endpoints reales consumidos en frontend

Fuente de verdad:

- `src/app/core/constants/endpoints/reclutamiento.endpoints.ts`

Endpoints del modulo:

- `recruitment-candidates`
- `recruitment-candidates/{id}`
- `recruitment-candidates/{id}/archive`
- `recruitment-candidate-applications`
- `recruitment-candidate-applications/by-stage/{stage}`
- `recruitment-candidate-applications/{id}`
- `recruitment-candidate-applications/{id}/stage`
- `recruitment-candidate-applications/{id}/decision`
- `recruitment-candidate-applications/{id}/cv`
- `recruitment-candidate-applications/{id}/process-hiring`
- `recruitment-candidate-applications/recruitment-agenda`
- `recruitment-candidate-interviews/feedback`
- `recruitment-candidate-interviews/application/{candidateApplicationId}`

No documentar este modulo con rutas legacy como:

- `api/candidates`
- `api/candidate-applications`
- `api/interviews`

## Pipeline actual

Fuente de verdad:

- `src/app/core/enums/candidate-application-stage.ts`

Etapas actuales:

1. `Nuevo`
2. `PreFiltro`
3. `EnEspera`
4. `EntrevistaReclutamiento`
5. `EntrevistaOperaciones`
6. `NoSePresento`
7. `Rechazado`
8. `Seleccionado`
9. `AltaEnProceso`
10. `Contratado`

La pantalla de cambio de etapa usa este enum real. No usar en documentos
internos estados alternos como `AwaitingInterview`, `Interviewed` u
`OpsApproved` mientras no existan en codigo.

## Flujo funcional frontend actual

### 1. Candidatos

1. entrar a `recruitment/candidates/candidates`
2. abrir `Agregar` o editar desde la tabla
3. guardar desde `candidate-form.ts`
4. refrescar listado

### 2. Postulaciones

1. entrar a `recruitment/candidates/applications`
2. crear o editar postulacion
3. usar `Cambiar etapa` cuando aplique
4. refrescar listado

### 3. Entrevistas

1. entrar a `recruitment/candidates/interviews`
2. abrir `Retroalimentacion`
3. capturar decision, motivo y comentarios
4. guardar y refrescar listado

### 3.1 Agenda de reclutamiento

1. entrar a `recruitment/candidates/recruitment-agenda`
2. revisar entrevistas pendientes, agendadas o vencidas
3. abrir CV o navegar al detalle operativo

Acceso esperado:

- `Reclutamiento`
- `Administrador`
- `SuperUsuario`

### 4. Proceso de alta

1. ubicar una postulacion que ya permita procesar alta
2. abrir `Procesar alta`
3. capturar campos requeridos
4. guardar

## Smoke test sugerido

1. abrir `candidates`
2. crear un candidato
3. abrir `applications`
4. crear una postulacion con CV
5. cambiar etapa a `EntrevistaReclutamiento`
6. mover a `EntrevistaOperaciones`
7. abrir `interviews`
8. registrar retroalimentacion
9. avanzar a `Seleccionado`
10. procesar alta

## Reglas de mantenimiento de esta carpeta

- esta documentacion debe seguir al codigo, no al reves
- si cambia una ruta, componente o endpoint, se actualiza aqui
- no mezclar referencias de `client/luxuryapp/...`
- no inventar servicios o stores que aun no existen
- usar fechas reales; no dejar fechas futuras

## Archivos relacionados

- `docs/setup.md`
- `docs/decisiones.md`
- `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/README.md`
