📄 Estructura Global – Entidad Employees

1. Objetivo
   Analizar la funcionalidad y flujo de la entidad Employees.

Rastrear todas las entidades relacionadas directa e indirectamente mediante la propiedad public Guid EmployeeId o public Guid? EmployeeId.

Documentar las relaciones en un mapa claro que permita entender cómo se conectan los datos de empleados con procesos de altas, bajas, modificaciones de salarios, puestos de trabajo, datos personales, datos laborales, datos bancarios, etc.

2. Metodología
   Revisión de código: buscar en todo el repositorio referencias a EmployeeId.

Clasificación de relaciones:

Directas → entidades que contienen explícitamente EmployeeId.

Indirectas → entidades que se relacionan con otras que a su vez tienen EmployeeId.

Agrupación funcional: organizar las entidades relacionadas por categorías (personales, laborales, bancarias, administrativas).

Documentación: reflejar cada relación en este archivo con descripción breve de su propósito.

3. Entidad Principal: Employees
   Contiene los datos base del trabajador.

Actúa como nodo central de todas las relaciones.

4. Relaciones Directas (ejemplos de estructura)
   EmployeePersonalData → Información personal (CURP, RFC, NSS, dirección, contacto).

EmployeeJobData → Puesto, área, fecha de ingreso, tipo de contrato.

EmployeeSalaryHistory → Registro de salarios, modificaciones, vigencias.

EmployeeBankData → Banco, cuenta, CLABE.

EmployeeEmergencyContacts → Contactos de emergencia.

EmployeeHealthData → Enfermedades crónicas, alergias, medicamentos.

5. Relaciones Indirectas
   RecruitmentCandidates → candidatos que al ser contratados generan un EmployeeId.

PayrollMovements → movimientos de nómina asociados al empleado.

AttendanceRecords → registros de asistencia vinculados al empleado.

TrainingRecords → capacitaciones asignadas al empleado.

TerminationRecords → bajas o fin de relación laboral.

6. Flujo Funcional
   Alta de empleado → se genera EmployeeId y se crean registros en entidades relacionadas.

Modificación → cambios en salario, puesto, datos personales o bancarios.

Baja → se registra en TerminationRecords y se bloquean relaciones activas.

Historial → todas las entidades mantienen trazabilidad mediante EmployeeId.

7. Representación Visual (sugerencia)
   Diagrama tipo ERD simplificado con Employees al centro y flechas hacia las entidades relacionadas.

 Clasificación por colores:

Azul → datos personales.

Verde → datos laborales.

Naranja → datos financieros.

Rojo → bajas/terminaciones.

---

# 8. Análisis de relaciones (resultado del rastreo de código)

Se buscó `public Guid EmployeeId` / `public Guid? EmployeeId` en todo el repositorio
(.NET, capa `LuxuryApp.Infrastructure.Data\Data\Entities`). Se encontraron **19 entidades**
relacionadas directamente más la entidad central `Employee`.

## 8.1 Entidad central: `Employee`

- Tabla: `Employees` (`ExpedientedelEmpleado/Employee.cs`).
- Datos base del trabajador: `UserId` (vínculo a `ApplicationUser`), `NumberEmployee`,
  `DateAdmission`, `Salary`, `EducationLevel`, `AddressId`.
- Navegaciones declaradas: `WorkPosition`, `Address`, `EmergencyContact`
  (`HashSet<EmployeeEmergencyContact>`), `PerformanceEvaluations`
  (`HashSet<PerformanceEvaluation>`).
- Actúa como nodo central: todas las entidades siguientes tienen `EmployeeId` + navegación `Employee`.

> Nota: los ejemplos del prompt (`EmployeePersonalData`, `EmployeeJobData`,
> `EmployeeSalaryHistory`, `EmployeeHealthData`) **no existen como entidades separadas**.
> En el código real se mapean a: `PersonData` (datos personales), `WorkPosition` +
> campos de `Employee` (datos de puesto), `RequestSalaryModification` + campo `Salary`
> (historial/modificación de sueldo), y `EmployeeClinicalData` (datos de salud).

## 8.2 Relaciones Directas (entidades con `EmployeeId`)

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

## 8.3 Relaciones Indirectas (referencias detectadas en código)

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

> Nota: los ejemplos del prompt `RecruitmentCandidates`, `PayrollMovements`,
> `AttendanceRecords`, `TrainingRecords`, `TerminationRecords` **no existen como entidades
> con `EmployeeId`** en el código actual. El flujo equivalente es:
> `RequestEmployeeRegister` (altas), `RequestDismissal`/`TerminationRequests` (bajas),
> `RequestSalaryModification` (movimientos salariales).

## 8.4 Mapa ERD (texto)

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

## 8.5 Conclusión del flujo funcional

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
