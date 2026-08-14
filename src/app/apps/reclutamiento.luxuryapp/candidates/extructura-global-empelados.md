# 📄 Estructura Global – Entidad Employees

## 1. Objetivo

Analizar la funcionalidad y el flujo de la entidad `Employees`, rastreando todas las
entidades relacionadas directa e indirectamente mediante la propiedad
`public Guid EmployeeId` o `public Guid? EmployeeId`, y documentar el mapa de relaciones.

## 2. Metodología

- Búsqueda de `EmployeeId` / `EmployeeId?` en todo el repositorio (.NET, capa
  `LuxuryApp.Infrastructure.Data\Data\Entities`).
- Clasificación en **directas** (contienen `EmployeeId`) e **indirectas** (relacionadas
  con otras que a su vez tienen `EmployeeId`).
- Agrupación funcional: personales, laborales, financieras, administrativas.
- Resultado volcado en este archivo.

## 3. Entidad Principal: `Employee`

- Tabla: `Employees` (`ExpedientedelEmpleado/Employee.cs`).
- Datos base del trabajador: `UserId` (vínculo a `ApplicationUser`), `NumberEmployee`,
  `DateAdmission`, `Salary`, `EducationLevel`, `AddressId`.
- Navegaciones declaradas: `WorkPosition`, `Address`, `EmergencyContact`
  (`HashSet<EmployeeEmergencyContact>`), `PerformanceEvaluations`
  (`HashSet<PerformanceEvaluation>`).
- Nodo central: todas las entidades siguientes poseen `EmployeeId` + navegación `Employee`.

> Nota: los ejemplos del enunciado (`EmployeePersonalData`, `EmployeeJobData`,
> `EmployeeSalaryHistory`, `EmployeeHealthData`) **no existen como entidades separadas**.
> En el código real se mapean a: `PersonData` (datos personales), `WorkPosition` +
> campos de `Employee` (datos de puesto), `RequestSalaryModification` + campo `Salary`
> (modificación de sueldo), y `EmployeeClinicalData` (datos de salud).

## 4. Relaciones Directas (entidades con `EmployeeId`)

### Datos personales (🔵)
| Entidad | Tabla | Propósito |
|---|---|---|
| `PersonData` | `EmployeePersonData` | Datos personales extendidos (CURP, RFC, NSS, datos biográficos). `EmployeeId` es `Guid?` (puede existir sin empleado aún). |
| `EmployeeEmergencyContact` | `EmployeeEmergencyContacts` | Contactos de emergencia y beneficiarios. `EmployeeId` `Guid?`. |
| `EmployeeClinicalData` | `EmployeeClinicalData` | Datos clínicos/médicos para gestión de salud en el trabajo. |

### Datos laborales (🟢)
| Entidad | Tabla | Propósito |
|---|---|---|
| `WorkPosition` | `JobPositions` | Puesto de trabajo; `EmployeeId` `Guid?` (un puesto puede estar vacante). Pertenece a `Recruitment`. |
| `WorkContract` | `WorkContracts` | Contrato laboral; histórico de relaciones contractuales (un activo por empleado/periodo). |
| `PerformanceEvaluation` | `EvaluationStaffs` | Evaluaciones de desempeño aplicadas al empleado. |
| `Incident` | `Incidents` | Incidencias disciplinarias (investigación, evidencia, sanción). |
| `VacationRequest` | `VacationRequests` | Solicitud formal de vacaciones (periodo, estatus, prima vacacional). |
| `VacationBalance` | `VacationBalances` | Saldo de vacaciones por año (días totales/usados/pendientes, antigüedad). |
| `ManualBalanceChangeLog` | `VacationAdjustments` | Auditoría de ajustes manuales al saldo de vacaciones (valores anterior/nuevo). |
| `LeaveRequest` | `LeaveRequests` | Permisos/ausencias temporales (médico, personal, etc.). |

### Datos financieros / nómina (🟠)
| Entidad | Tabla | Propósito |
|---|---|---|
| `EmployeeBankData` | `EmployeeBankData` | Cuenta bancaria para dispersión de nómina (banco, CLABE, contacto referencia). |
| `TiempoExtra` | `OvertimeRecords` | Horas extra (simples/dobles) para cálculo de nómina. |
| `PrestamoEmpleado` | `EmployeeLoans` | Préstamos de la organización al empleado (amortización, saldo). |
| `NominaDetalle` | `PayrollDetails` | Detalle individual de nómina (días, ausencias, percepciones, deducciones). |
| `IncidenciaNomina` | `PayrollIncidents` | Incidencias que afectan nómina (retardos, faltas, incapacidades). |
| `RequestSalaryModification` | `SalaryChangeRequests` | Solicitud de modificación de sueldo. |

### Altas / bajas / administrativas (🔴)
| Entidad | Tabla | Propósito |
|---|---|---|
| `RequestEmployeeRegister` | `StaffHiringRequests` | Solicitud de alta tras reclutamiento. `EmployeeId` `Guid?` (se asigna al contratar). Vincula a `RequestPosition`. |
| `RequestDismissal` | `TerminationRequests` | Solicitud de baja del empleado. |

## 5. Relaciones Indirectas (referencias detectadas en código)

- `RequestPosition` → se relaciona con `RequestEmployeeRegister` (que tiene `EmployeeId`);
  origen del flujo de reclutamiento → alta.
- `CommitteeLuxuryApp` / `WorkPosition`: `CommitteeAppService` usa `EmployeeId` de
  `WorkPosition` para mapear empleados ↔ usuarios de comité.
- `ServiceOrder` (`Operations/FieldService`): referencia `ResponsibleEmployeeId`
  (no es `EmployeeId` literal, pero vincula al empleado responsable de la orden).
- `EmployeeDataValidationService` / `UserAccountAppService`: consultan `PersonData.EmployeeId`
  y `Employee` para validación de datos y cuentas de usuario.
- `VacationUpdaterJob` / `NotifyExpiringVacationsJob`: job que recorre `Employee` y
  actualiza `VacationBalance` por `EmployeeId`.
- `CustomerAppService` (borrado en cascada): elimina en bloque `EmployeeBankData`,
  `EmployeeClinicalData`, `EmployeeEmergencyContact`, `PersonData`, `RequestEmployeeRegister`
  al eliminar empleados de un cliente → confirma dependencia directa.

> Nota: los ejemplos del enunciado `RecruitmentCandidates`, `PayrollMovements`,
> `AttendanceRecords`, `TrainingRecords`, `TerminationRecords` **no existen como entidades
> con `EmployeeId`** en el código actual. El flujo equivalente es:
> `RequestEmployeeRegister` (altas), `RequestDismissal`/`TerminationRequests` (bajas),
> `RequestSalaryModification` (movimientos salariales).

## 6. Mapa ERD (texto)

```
                         Employees (Employee)
                              │  Id (PK)
        ┌──────────────┬───────┼───────────────┬──────────────┬──────────────┐
       🔵             🔵      🔵              🟢             🟢            🟢
  EmployeePersonData  EmployeeEmergency-   EmployeeClinical-  WorkPosition   WorkContract
  (PersonData)        Contacts             Data              (JobPositions) (WorkContracts)
                              │
                       ┌──────┴──────────┬───────────────┬───────────────┬──────────────┐
                      🟢                🟢             🟢              🟢             🟢
                 PerformanceEvaluation  Incident    VacationRequest   VacationBalance  LeaveRequest
                 (EvaluationStaffs)     (Incidents) (VacationRequests)(VacationBalances)(LeaveRequests)
                                                    ManualBalanceChangeLog (VacationAdjustments)
       ┌──────────────────────────────┬──────────────┬──────────────┬──────────────┐
      🟠                            🟠             🟠             🟠             🟠
  EmployeeBankData              TiempoExtra    PrestamoEmpleado  NominaDetalle  IncidenciaNomina
  (dispersión nómina)          (OvertimeRecords)(EmployeeLoans) (PayrollDetails)(PayrollIncidents)
                              RequestSalaryModification (SalaryChangeRequests)

   🔴 Altas / Bajas
   RequestEmployeeRegister (StaffHiringRequests, EmployeeId?) → genera Employee
   RequestDismissal         (TerminationRequests, EmployeeId)
```

## 7. Conclusión del flujo funcional

1. **Alta**: `RequestEmployeeRegister` → crea `Employee` (EmployeeId) y luego
   `PersonData`, `EmployeeBankData`, `EmployeeClinicalData`, `EmployeeEmergencyContact`,
   `WorkPosition`, `WorkContract`.
2. **Modificación**: `RequestSalaryModification` (campo `Salary` en `Employee`),
   cambios de `WorkPosition`, `PersonData`, `EmployeeBankData`.
3. **Baja**: `RequestDismissal` (TerminationRequests); el borrado de cliente cascada
   las entidades directas.
4. **Trazabilidad**: nómina (`NominaDetalle`, `IncidenciaNomina`, `TiempoExtra`,
   `PrestamoEmpleado`), incidencias (`Incident`), evaluaciones (`PerformanceEvaluation`)
   y vacaciones (`VacationRequest`/`VacationBalance`/`ManualBalanceChangeLog`/`LeaveRequest`)
   mantienen `EmployeeId` para auditoría.

---

# Anexo A — Estructura y funcionalidad actual de Candidatos

Este anexo documenta el módulo **Candidates** (reclutamiento) en su estado actual,
tanto en backend (.NET 10 / Minimal APIs) como en frontend (Angular), y cómo se
conecta con la entidad `Employee` (ver sección 3).

Fuente de verdad:
- Backend: `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/`
- Frontend: `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/`
- Docs previas: `Candidates/Docs/documentacion-candidates.md`,
  `Candidates/Docs/20260811-*` y `candidates/docs/README.md`.

## A.1 Backend — Estructura de carpetas

```
Candidates/
|-- Candidate/                 # Gestión base del candidato
|   |-- DTOs/  EndPoints/  Interfaces/  Mappings/  Services/
|-- CandidateApplication/      # Postulaciones + pipeline de etapas
|   |-- DTOs/  EndPoints/  Interfaces/  Mappings/  Services/
|-- CandidateDecisionReason/   # Catálogo de motivos de decisión
|   |-- DTOs/  EndPoints/  Interfaces/  Mappings/  Services/
|-- CandidateInterview/        # Feedback de entrevistas
|   |-- DTOs/  EndPoints/  Interfaces/  Mappings/  Services/
|-- CandidateInterviewResult/  # Resultado/resolución de entrevista
|   |-- DTOs/  EndPoints/  Interfaces/  Mappings/  Services/
|-- CandidateProcess/          # Proceso de contratación / alta
|   |-- DTOs/  EndPoints/  Interfaces/  Services/
|-- CandidateWorkExperience/   # Experiencia laboral del candidato
|   |-- DTOs/  EndPoints/  Interfaces/  Mappings/  Services/
|-- InterviewerMatrix/         # Matriz de entrevistadores elegibles
|   |-- DTOs/  EndPoints/  Interfaces/  Mappings/  Services/
|-- Notifications/             # Coordinator + multi-canal de notificaciones
|   |-- Interfaces/  Services/
|-- Shared/Validators/         # Validadores compartidos (p. ej. candidato)
|-- Docs/                      # Documentación técnica del módulo
```

Patrón por submódulo: `DTOs` (contratos), `EndPoints` (Minimal API),
`Interfaces` (contrato de servicio), `Mappings` (AutoMapper), `Services` (lógica).

## A.2 Backend — Entidades y modelo

```
Candidate (1) ────< (N) CandidateApplication
                          |-- CandidateId (FK)
                          |-- RequestPositionId (FK → RequestPosition)
                          |-- Stage (enum 9 etapas)
                          |-- AssignedInterviewerId (FK → User)  [1 entrevistador]
                          |-- DecisionReasonId, DecisionComment
        │
        └──< (N) CandidateInterview
                  |-- CandidateApplicationId (FK)
                  |-- InterviewerId (FK → User)
                  |-- Rating (1-5), FeedbackText
```

- `Candidate`: datos personales (Email, FirstName, LastName, Phone, Age, Address,
  Availability, SalaryExpectation, ExperienceSummary). `Status` (Active/Archived) con
  soft-delete vía `ArchivedDate`.
- `CandidateApplication`: bandeja canónica de postulación a una `RequestPosition`;
  `ClosedAt` marca terminal.
- `CandidateInterview`: feedback estructurado por entrevistador.

## A.3 Backend — Pipeline de etapas (CandidateApplicationStage)

```
Nuevo(0) → PreFiltro(1) ─┐
                          ├→ Rechazado(8) / NoSePresento(9)  [terminales desde cualquier etapa]
EnEspera(2) → EntrevistaReclutamiento(3) → EntrevistaOperaciones(4)
           → Seleccionado(5) → AltaEnProceso(6) → Contratado(7) [terminal]
```
Transiciones validadas por `ValidateStageTransition`; al ir a `EntrevistaOperaciones`
se exige entrevistador asignado, activo, con rol autorizado y del mismo cliente.

## A.4 Backend — Endpoints principales

- `GET/POST /api/recruitment-candidates` — listar/crear candidatos (paginado).
- `GET /api/recruitment-candidates/{id}` — detalle.
- `PATCH /api/recruitment-candidates/{id}/archive` — archivar.
- `GET /api/recruitment-candidate-applications` — listar postulaciones.
- `GET /api/recruitment-candidate-applications/by-stage/{stage}` — filtro por etapa.
- `POST /api/recruitment-candidate-applications/{id}/stage` — cambiar etapa.
- `POST /api/recruitment-candidate-applications/{id}/decision` — registrar decisión.
- `POST /api/recruitment-candidate-applications/{id}/cv` — adjuntar CV.
- `POST /api/recruitment-candidate-applications/{id}/process-hiring` — **crea `Employee`**
  vía `RequestEmployeeRegister` y cierra la postulación (etapa `Contratado`).
- `GET/POST /api/recruitment-candidate-applications/recruitment-agenda` — agenda.
- `POST /api/recruitment-candidate-interviews/feedback` — feedback de entrevista.
- `GET /api/recruitment-candidate-interviews/application/{id}` — feedback por postulación.

## A.5 Backend — Conexión con Employee (relevante al reporte principal)

El proceso de alta (`process-hiring`) es el puente Candidato → `Employee`:
1. Valida `Stage == Seleccionado`.
2. Busca/crea usuario y genera `RequestEmployeeRegister` (tabla `StaffHiringRequests`,
   con `EmployeeId?` que se asigna al contratar).
3. Crea `Employee` y enlaza `CandidateApplication.EmployeeId`.
4. Cierra la postulación. Esto alimenta las entidades de la sección 4
   (`PersonData`, `EmployeeBankData`, `WorkContract`, `WorkPosition`, etc.).

> Hallazgo documentado: la búsqueda de usuario por email en `ProcessHiringAsync`
> no filtra por `CustomerId`, lo que puede asignar un usuario ambiguo. Ver
> `Candidates/Docs/documentacion-candidates.md` (sección 3, Flujo 3).

## A.6 Frontend — Estructura de carpetas

```
candidates/
|-- candidates.routing.ts        # Rutas del módulo
|-- candidate/                   # ABM de candidatos
|   |-- candidate-list/.ts  candidate-form.ts  candidate-detail.ts
|   |-- candidate-status-tag.ts  desktop/  mobile/  interfaces/
|-- candidate-application/        # Postulaciones
|   |-- candidate-application-list.ts  candidate-application-form.ts
|   |-- candidate-stage-change-modal.ts  candidate-process-hiring-modal.ts
|   |-- desktop/  mobile/  interfaces/
|-- candidate-interview/          # Feedback de entrevistas
|   |-- candidate-interview-pending-list.ts  candidate-interview-feedback-form.ts
|   |-- desktop/  mobile/  interfaces/
|-- candidate-interviewer-queue/  # Cola de entrevistadores
|-- candidate-recruitment-interview/  # Entrevistas de reclutamiento
|-- candidate-work-position-candidates/ # Candidatos por puesto de trabajo
|-- recruitment-shared/           # Componentes compartidos
|   |-- candidate-cv-upload.ts  candidate-stage-badge.ts  candidate-stage-labels.ts
|   |-- candidate-stage-timeline.ts  candidate-decision-labels.ts
|   |-- candidate-decision-reason-select.ts  candidate-detail.ts  mapped-p-tag.ts
|-- docs/                         # README, setup, decisiones, inventario
```

## A.7 Frontend — Rutas activas

- `/recruitment/candidates/candidates`
- `/recruitment/candidates/applications`
- `/recruitment/candidates/interviews`
- `/recruitment/candidates/recruitment-agenda`

## A.8 Frontend — Patrón técnico y flujo

- Componentes **standalone**, `signal()` / `computed()`, `ApiResponseService`,
  `DialogHandlerService`, wrappers `@ui/*`. (No usar `PaginationStore` ni servicios
  `CandidateService`/`CandidateApplicationService` heredados.)
- Endpoints consumidos desde `core/constants/endpoints/reclutamiento.endpoints.ts`
  (mismos del backend, sección A.4).
- Etapas desde `core/enums/candidate-application-stage.ts` (10 valores: Nuevo,
  PreFiltro, EnEspera, EntrevistaReclutamiento, EntrevistaOperaciones, NoSePresento,
  Rechazado, Seleccionado, AltaEnProceso, Contratado).
- Flujo UI: crear candidato → crear postulación con CV → cambiar etapa →
  registrar feedback en entrevistas → avanzar a `Seleccionado` →
  `Procesar alta` (modal `candidate-process-hiring-modal`) → crea `Employee`.

## A.9 Resumen funcional

El módulo Candidates cubre el **ciclo completo de reclutamiento**: captura del
candidato, postulación a vacantes, pipeline validado de 9 etapas, feedback de
entrevistas, decisión y **alta como empleado**. El alta es el punto de integración
con la estructura global documentada en este reporte (secciones 3–7): al contratar
se genera el `Employee` y sus entidades relacionadas vía `EmployeeId`.
