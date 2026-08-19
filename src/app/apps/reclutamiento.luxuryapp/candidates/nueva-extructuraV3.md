Perfecto. Con estas respuestas **ya no hay bloqueantes reales** para dejar el módulo de candidatos bien estructurado.

Solo te confirmo una cosa de **F13**:

> **Sí, yo lo dejaría obligatorio y con validación de mayoría de edad.**
> `BirthDate` obligatorio y validar que el candidato tenga al menos 18 años.

Si más adelante existe alguna excepción legal, se ajusta, pero como regla general es lo más sano.

---

# 1. Resumen ejecutivo de decisiones finales

## Candidato

### Identificación

- **Teléfono único**.
- Email obligatorio, pero **sin unicidad estricta**.
- Si existe otro candidato con el mismo email, se puede advertir en UI, pero no bloquear en base de datos.
- Teléfono normalizado y único.

### Datos personales

- Se guarda `BirthDate`.
- No se guarda `Age`.
- Edad calculada en DTO/servicio.
- `BirthDate` obligatorio.
- Validación de mayoría de edad.

### Contacto

- `PhoneNumber` obligatorio.
- `Email` obligatorio.

### CV

- Un solo CV por candidato.
- Se guarda solo el nombre/string del archivo en `Candidate.CvFileName`.
- No se requiere entidad de documentos por ahora.

### Estados del candidato

Se mantienen:

- `Active`
- `Archived`
- `Contratado`

Reglas:

- Un candidato `Active` puede tener procesos.
- Un candidato `Contratado` también puede tener procesos nuevos.
- Un candidato `Archived` no debería poder iniciar procesos nuevos.
- Si un candidato se contrata en un proceso, su estado maestro pasa a `Contratado`.

---

## Roles

Por lo que me dijiste en **F10**, no voy a modificar ahora `ApplicationRole` ni `ApplicationRoleEnum`.

Pero para el módulo de reclutamiento, la recomendación es:

- Usar `ApplicationRoleEnum` como referencia operativa.
- No depender del `Id` de `ApplicationRole` para el perfil del candidato.
- La entidad puente de candidato-rol guardará el enum.

---

## Proceso candidato-vacante

### Modelo único

- `CandidateProcess` será la única entidad operativa.
- Se retira `CandidateApplication`.

### Unicidad

- Un candidato solo puede tener **un proceso por `RequestPosition`**.
- Si la posición vuelve a necesitar cobertura, se crea un nuevo `RequestPosition`.

### Etapa inicial

- `Nuevo`.

### Pipeline final

```text
Nuevo
EnEspera
EntrevistaOperaciones
NoSePresento
Rechazado
Seleccionado
AltaEnProceso
Contratado
```

### Etapas terminales

- `NoSePresento`
- `Rechazado`
- `Contratado`

### Estado del proceso

Se separa etapa y estado.

Estados del proceso:

- `Abierto`
- `EnPausa`
- `Cerrado`

### Cierre de vacante

Si la vacante se cierra:

- Los procesos abiertos se cierran automáticamente.
- No se agrega etapa `Cancelado`.
- Se usa:
  - `ProcessStatus = Cerrado`
  - `ClosureReason = VacanteCerrada`

---

## Entrevistas

### Relación

- `CandidateInterview` apunta a `CandidateProcess`.
- Ya no apunta a `CandidateApplication`.

### Cantidad

- Una vacante puede tener muchas entrevistas.
- Un proceso debería tener **una sola entrevista activa** a la vez.

### Reprogramación

- Si una entrevista se reprograma:
  - La entrevista actual se cierra como `Reprogramada`.
  - Se crea una nueva entrevista.
  - La nueva entrevista referencia a la anterior con `RescheduledFromInterviewId`.

### Estados de entrevista

Se simplifican a:

- `Programada`
- `Realizada`
- `NoAsistio`
- `Reprogramada`
- `Cancelada`

### Cancelación

- Una entrevista cancelada **no requiere resultado**.

### Entrevistador

- No se puede reasignar el entrevistador.
- Si hay error, se cancela la entrevista y se crea una nueva.

---

## Resultados

### Relación

- Una entrevista tiene un único resultado.
- Relación 1 a 1.

### Decisiones

```text
Aprobado
Rechazado
EnEspera
NoSePresento
Reprogramar
```

### Motivo

- El motivo es obligatorio **solo si la decisión es `Rechazado`**.
- Para las demás decisiones, el motivo puede ser nulo.
- El motivo se maneja como enum fijo.

### Edición

- Resultado inmutable por defecto.

---

## Matriz de entrevistadores

- Se queda como está.
- Por ahora no requiere edificio/centro de trabajo.
- El servicio/UI seleccionará al usuario final por cliente, rol y edificio/centro si aplica.

---

## Borrado

- El borrado definitivo seguirá controlado por `SuperUsuario`.
- Si el sistema ya muestra reporte de cascadeo, está bien para desarrollo/pruebas.
- A nivel de entidad, no hace falta agregar soft delete por ahora.

---

# 2. Modelo final recomendado

```text
Candidate
 ├── CandidateWorkExperience
 ├── CandidateApplicationRole
 └── CandidateProcess
       ├── CandidateStageHistory
       └── CandidateInterview
             └── CandidateInterviewResult
```

Entidades externas relevantes:

- `RequestPosition`
- `InterviewerMatrix`
- `ApplicationRoleEnum` como referencia operativa

---

# 3. Entidades finales propuestas

Te dejo la estructura ya depurada.

> En varias clases omito los campos de auditoría para no hacer eterno el código, pero todas deberían mantener `CreatedAt`, `CreatedBy`, `UpdatedAt`, `UpdatedBy` si implementan `IAuditable`.

---

## 3.1 `Candidate`

```csharp
[Table("RecruitmentCandidates")]
public class Candidate : GuidIdEntity, IAuditable
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    [StringLength(80)]
    [Display(Name = "Nombre")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Los apellidos son obligatorios")]
    [StringLength(80)]
    [Display(Name = "Apellidos")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "La fecha de nacimiento es obligatoria")]
    [Display(Name = "Fecha de nacimiento")]
    public DateOnly BirthDate { get; set; }

    [Required(ErrorMessage = "El teléfono es obligatorio")]
    [StringLength(20)]
    [Display(Name = "Teléfono")]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(30)]
    [Display(Name = "Teléfono normalizado")]
    public string NormalizedPhoneNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "El correo es obligatorio")]
    [EmailAddress]
    [StringLength(120)]
    [Display(Name = "Correo electrónico")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(120)]
    [Display(Name = "Correo normalizado")]
    public string NormalizedEmail { get; set; } = string.Empty;

    [StringLength(250)]
    [Display(Name = "Dirección actual")]
    public string CurrentAddress { get; set; } = string.Empty;

    [StringLength(150)]
    [Display(Name = "Disponibilidad")]
    public string Availability { get; set; } = string.Empty;

    [Precision(18, 2)]
    [Display(Name = "Expectativa salarial")]
    public decimal? SalaryExpectation { get; set; }

    [Display(Name = "Resumen de experiencia")]
    public string ExperienceSummary { get; set; } = string.Empty;

    [Display(Name = "Comentarios generales")]
    public string GeneralComments { get; set; } = string.Empty;

    [StringLength(260)]
    [Display(Name = "CV principal")]
    public string CvFileName { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Fuente de reclutamiento")]
    public FuenteReclutamiento RecruitmentSource { get; set; }

    [Required]
    [Display(Name = "Estado")]
    public CandidateStatus Status { get; set; } = CandidateStatus.Active;

    [Display(Name = "En banco de talento")]
    public bool IsInTalentPool { get; set; }

    [StringLength(500)]
    [Display(Name = "Notas de banco de talento")]
    public string TalentPoolNotes { get; set; } = string.Empty;

    public HashSet<CandidateWorkExperience> WorkExperiences { get; set; } = [];
    public HashSet<CandidateApplicationRole> ApplicationRoles { get; set; } = [];
    public HashSet<CandidateProcess> Processes { get; set; } = [];

    // IAuditable fields...
}
```

### Reglas importantes

- `PhoneNumber` obligatorio.
- `NormalizedPhoneNumber` único.
- `Email` obligatorio.
- `NormalizedEmail` no único, pero indexado para búsquedas.
- `BirthDate` obligatorio.
- Validar edad mínima de 18 años.
- `Status` por defecto `Active`.

---

## 3.2 `CandidateApplicationRole`

La mantengo con nombre actual para no romper más, pero conceptualmente sería un perfil/rol apto del candidato.

```csharp
[Table("RecruitmentCandidateApplicationRoles")]
public class CandidateApplicationRole : GuidIdEntity, IAuditable
{
    [Required]
    [Display(Name = "Candidato")]
    public Guid CandidateId { get; set; }

    public Candidate Candidate { get; set; } = null!;

    [Required]
    [Display(Name = "Rol de aplicación")]
    public ApplicationRoleEnum Role { get; set; }

    [Display(Name = "Perfil principal")]
    public bool IsPrimary { get; set; }

    [StringLength(500)]
    [Display(Name = "Comentarios")]
    public string Comments { get; set; } = string.Empty;

    // IAuditable fields...
}
```

### Reglas

- Un candidato no debe tener el mismo `Role` duplicado.
- Un candidato puede tener varios roles.
- Solo un rol puede ser `IsPrimary = true`.
- Si quieres, más adelante puedes renombrar la entidad a `CandidateRoleProfile`, pero es cosmético.

---

## 3.3 `CandidateWorkExperience`

```csharp
[Table("RecruitmentCandidateWorkExperiences")]
public class CandidateWorkExperience : GuidIdEntity, IAuditable
{
    [Required]
    [Display(Name = "Candidato")]
    public Guid CandidateId { get; set; }

    public Candidate Candidate { get; set; } = null!;

    [Required(ErrorMessage = "La empresa es obligatoria")]
    [StringLength(150)]
    [Display(Name = "Empresa")]
    public string CompanyName { get; set; } = string.Empty;

    [Required(ErrorMessage = "El puesto es obligatorio")]
    [StringLength(150)]
    [Display(Name = "Puesto")]
    public string JobPosition { get; set; } = string.Empty;

    [Required(ErrorMessage = "La fecha de inicio es obligatoria")]
    [Display(Name = "Fecha de inicio")]
    public DateOnly StartDate { get; set; }

    [Display(Name = "Fecha de término")]
    public DateOnly? EndDate { get; set; }

    [Precision(18, 2)]
    [Display(Name = "Salario neto mensual")]
    public decimal? MonthlyNetSalary { get; set; }

    [StringLength(500)]
    [Display(Name = "Motivo de salida")]
    public string DepartureReason { get; set; } = string.Empty;

    // IAuditable fields...
}
```

### Reglas

- `EndDate == null` significa trabajo actual.
- Si `EndDate != null`:
  - `EndDate >= StartDate`
  - `DepartureReason` obligatorio
- Salario opcional.

---

## 3.4 `CandidateProcess`

Esta es la entidad central.

```csharp
[Table("RecruitmentCandidateProcesses")]
public class CandidateProcess : GuidIdEntity, IAuditable
{
    [Required]
    [Display(Name = "Candidato")]
    public Guid CandidateId { get; set; }

    public Candidate Candidate { get; set; } = null!;

    [Required]
    [Display(Name = "Vacante")]
    public Guid RequestPositionId { get; set; }

    public RequestPosition RequestPosition { get; set; } = null!;

    [Required]
    [Display(Name = "Etapa actual")]
    public CandidateProcessStage CurrentStage { get; set; } = CandidateProcessStage.Nuevo;

    [Required]
    [Display(Name = "Estado del proceso")]
    public CandidateProcessStatus ProcessStatus { get; set; } = CandidateProcessStatus.Abierto;

    [Required]
    [Display(Name = "Fecha de registro")]
    public DateOnly RegisterDate { get; set; }

    [StringLength(1000)]
    [Display(Name = "Notas iniciales")]
    public string InitialNotes { get; set; } = string.Empty;

    // Selección / alta / contratación
    [Display(Name = "Seleccionado para alta")]
    public bool SelectedForHiring { get; set; }

    [Display(Name = "Fecha de selección")]
    public DateOnly? SelectedAt { get; set; }

    [Display(Name = "Alta solicitada el")]
    public DateTime? HiringRequestedAt { get; set; }

    [Display(Name = "Fecha de ingreso contratada")]
    public DateOnly? HiredEntryDate { get; set; }

    // Cierre
    [Display(Name = "Cerrado el")]
    public DateTime? ClosedAt { get; set; }

    [Display(Name = "Motivo de cierre")]
    public CandidateClosureReason? ClosureReason { get; set; }

    // Última decisión consolidada
    [Display(Name = "Decisión final")]
    public CandidateDecision? FinalDecision { get; set; }

    [Display(Name = "Motivo de decisión final")]
    public CandidateRejectionReason? FinalDecisionReason { get; set; }

    [StringLength(1000)]
    [Display(Name = "Comentario de decisión final")]
    public string FinalDecisionComment { get; set; } = string.Empty;

    [Display(Name = "Decisión enviada el")]
    public DateTime? FinalDecisionAt { get; set; }

    [Display(Name = "Decisión enviada por")]
    public string FinalDecisionByUserId { get; set; } = string.Empty;

    public HashSet<CandidateStageHistory> StageHistory { get; set; } = [];
    public HashSet<CandidateInterview> Interviews { get; set; } = [];

    // IAuditable fields...
}
```

### Reglas

- Etapa inicial: `Nuevo`.
- Estado inicial: `Abierto`.
- Un candidato puede tener varios procesos activos.
- Un candidato solo puede tener un proceso por `RequestPosition`.
- No se puede crear proceso si el candidato está `Archived`.
- Sí se puede crear proceso si el candidato está `Active` o `Contratado`.
- No se puede crear proceso si la vacante está cerrada.
- Cada cambio de etapa debe generar historial.

---

## 3.5 `CandidateStageHistory`

```csharp
[Table("RecruitmentCandidateStageHistory")]
public class CandidateStageHistory : GuidIdEntity, IAuditable
{
    [Required]
    [Display(Name = "Proceso")]
    public Guid CandidateProcessId { get; set; }

    public CandidateProcess CandidateProcess { get; set; } = null!;

    [Display(Name = "Etapa origen")]
    public CandidateProcessStage? FromStage { get; set; }

    [Required]
    [Display(Name = "Etapa destino")]
    public CandidateProcessStage ToStage { get; set; }

    [StringLength(1000)]
    [Display(Name = "Comentario")]
    public string Comment { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Cambiado por")]
    public string ChangedByUserId { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Cambiado el")]
    public DateTime ChangedAt { get; set; }

    // IAuditable fields...
}
```

### Reglas

- `CandidateProcessId` obligatorio.
- Ya no debe existir `CandidateApplicationId`.
- Insertar un registro por cada cambio de etapa.
- No editable.
- No eliminable.

---

## 3.6 `CandidateInterview`

```csharp
[Table("RecruitmentCandidateInterviews")]
public class CandidateInterview : GuidIdEntity, IAuditable
{
    [Required]
    [Display(Name = "Proceso")]
    public Guid CandidateProcessId { get; set; }

    public CandidateProcess CandidateProcess { get; set; } = null!;

    [Required]
    [Display(Name = "Etapa de la entrevista")]
    public CandidateProcessStage StageAtInterview { get; set; }

    [Required]
    [Display(Name = "Modalidad")]
    public CandidateInterviewModality Modality { get; set; }

    [Required]
    [Display(Name = "Entrevistador")]
    public string InterviewerUserId { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Rol del entrevistador")]
    public ApplicationRoleEnum InterviewerRole { get; set; }

    [Required(ErrorMessage = "La fecha y hora de la entrevista es obligatoria")]
    [Display(Name = "Fecha de entrevista")]
    public DateTime ScheduledAt { get; set; }

    [StringLength(250)]
    [Display(Name = "Lugar")]
    public string Location { get; set; } = string.Empty;

    [StringLength(500)]
    [Display(Name = "Liga de reunión")]
    public string MeetingLink { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Estado")]
    public CandidateInterviewStatus Status { get; set; } = CandidateInterviewStatus.Programada;

    [Display(Name = "Entrevista previa reprogramada")]
    public Guid? RescheduledFromInterviewId { get; set; }

    public CandidateInterview? RescheduledFromInterview { get; set; }

    [StringLength(500)]
    [Display(Name = "Comentario de reagenda")]
    public string RescheduleComment { get; set; } = string.Empty;

    [Display(Name = "Cerrada el")]
    public DateTime? ClosedAt { get; set; }

    [StringLength(1000)]
    [Display(Name = "Notas")]
    public string Notes { get; set; } = string.Empty;

    public CandidateInterviewResult? Result { get; set; }

    // IAuditable fields...
}
```

### Reglas

- Apunta a `CandidateProcess`.
- Una sola entrevista activa por proceso.
- El entrevistador no se reasigna.
- Si hay que cambiar entrevistador, cancelar y crear nueva.
- Si se reprograma:
  - La entrevista vieja se cierra como `Reprogramada`.
  - Se crea una nueva entrevista con `RescheduledFromInterviewId`.

---

## 3.7 `CandidateInterviewResult`

```csharp
[Table("RecruitmentCandidateInterviewResults")]
public class CandidateInterviewResult : GuidIdEntity, IAuditable
{
    [Required]
    [Display(Name = "Entrevista")]
    public Guid InterviewId { get; set; }

    public CandidateInterview Interview { get; set; } = null!;

    [Required]
    [Display(Name = "Entrevistador")]
    public string InterviewerUserId { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Rol del entrevistador")]
    public ApplicationRoleEnum InterviewerRole { get; set; }

    [Required]
    [Display(Name = "Decisión")]
    public CandidateDecision Decision { get; set; }

    [Display(Name = "Motivo")]
    public CandidateRejectionReason? DecisionReason { get; set; }

    [StringLength(1000)]
    [Display(Name = "Comentario adicional")]
    public string AdditionalComment { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Enviado el")]
    public DateTime SentAt { get; set; }

    [Required]
    [Display(Name = "Evaluada el")]
    public DateTime EvaluatedAt { get; set; }

    [Required]
    [Display(Name = "Evaluada por")]
    public string EvaluatedByUserId { get; set; } = string.Empty;

    // IAuditable fields...
}
```

### Reglas

- Uno a uno con `CandidateInterview`.
- `DecisionReason` obligatorio solo si `Decision == Rechazado`.
- Resultado inmutable.
- Ya no se necesita `ReceptionConfirmedAt`.
- Las entrevistas canceladas no requieren resultado.

---

## 3.8 `InterviewerMatrix`

Se queda como está.

```csharp
[Table("RecruitmentInterviewerMatrix")]
public class InterviewerMatrix : GuidIdEntity
{
    [Required]
    [Display(Name = "Cliente")]
    public Guid CustomerId { get; set; }

    [Required]
    [Display(Name = "Rol del puesto")]
    public ApplicationRoleEnum WorkPositionRole { get; set; }

    [Required]
    [Display(Name = "Rol del entrevistador")]
    public ApplicationRoleEnum InterviewerRole { get; set; }
}
```

Si más adelante quieres control administrativo, se le podría agregar:

- `IsActive`
- `Priority`

Pero por ahora se queda igual.

---

# 4. Enums finales recomendados

---

## 4.1 `CandidateStatus`

```csharp
public enum CandidateStatus
{
    [Display(Name = "Activo")]
    Active,

    [Display(Name = "Archivado")]
    Archived,

    [Display(Name = "Contratado")]
    Contratado
}
```

---

## 4.2 `FuenteReclutamiento`

```csharp
public enum FuenteReclutamiento
{
    [Display(Name = "Interno")]
    Internal,

    [Display(Name = "Externo")]
    External
}
```

---

## 4.3 `CandidateProcessStage`

Reemplaza a `CandidateApplicationStage`.

```csharp
public enum CandidateProcessStage
{
    [Display(Name = "Nuevo")]
    Nuevo,

    [Display(Name = "En espera")]
    EnEspera,

    [Display(Name = "Entrevista Operaciones")]
    EntrevistaOperaciones,

    [Display(Name = "No se presentó")]
    NoSePresento,

    [Display(Name = "Rechazado")]
    Rechazado,

    [Display(Name = "Seleccionado")]
    Seleccionado,

    [Display(Name = "Alta en proceso")]
    AltaEnProceso,

    [Display(Name = "Contratado")]
    Contratado
}
```

### Extension helper recomendada

```csharp
public static class CandidateProcessStageExtensions
{
    public static bool IsTerminal(this CandidateProcessStage stage)
    {
        return stage is CandidateProcessStage.NoSePresento
            or CandidateProcessStage.Rechazado
            or CandidateProcessStage.Contratado;
    }
}
```

---

## 4.4 `CandidateProcessStatus`

Nuevo.

```csharp
public enum CandidateProcessStatus
{
    [Display(Name = "Abierto")]
    Abierto,

    [Display(Name = "En pausa")]
    EnPausa,

    [Display(Name = "Cerrado")]
    Cerrado
}
```

---

## 4.5 `CandidateClosureReason`

Nuevo.

```csharp
public enum CandidateClosureReason
{
    [Display(Name = "Vacante cerrada")]
    VacanteCerrada,

    [Display(Name = "Rechazo")]
    Rechazo,

    [Display(Name = "No se presentó")]
    NoSePresento,

    [Display(Name = "Contratación")]
    Contratacion,

    [Display(Name = "Cancelación manual")]
    CancelacionManual,

    [Display(Name = "Otro")]
    Otro
}
```

---

## 4.6 `CandidateInterviewStatus`

Simplificado.

```csharp
public enum CandidateInterviewStatus
{
    [Display(Name = "Programada")]
    Programada,

    [Display(Name = "Realizada")]
    Realizada,

    [Display(Name = "No asistió")]
    NoAsistio,

    [Display(Name = "Reprogramada")]
    Reprogramada,

    [Display(Name = "Cancelada")]
    Cancelada
}
```

---

## 4.7 `CandidateDecision`

Con la nueva opción `Reprogramar`.

```csharp
public enum CandidateDecision
{
    [Display(Name = "Aprobado")]
    Aprobado,

    [Display(Name = "Rechazado")]
    Rechazado,

    [Display(Name = "En espera")]
    EnEspera,

    [Display(Name = "No se presentó")]
    NoSePresento,

    [Display(Name = "Reprogramar")]
    Reprogramar
}
```

---

## 4.8 `CandidateRejectionReason`

Te recomiendo renombrar `InterviewRejectionReason` a algo más claro, y quitar `NoSePresento` de los motivos de rechazo, porque `NoSePresento` ya es una decisión.

```csharp
public enum CandidateRejectionReason
{
    [Display(Name = "Falta de experiencia")]
    FaltaExperiencia,

    [Display(Name = "No cumple perfil")]
    NoCumplePerfil,

    [Display(Name = "Salario fuera de presupuesto")]
    SalarioFueraPresupuesto,

    [Display(Name = "Actitud no adecuada")]
    ActitudNoAdecuada,

    [Display(Name = "Falta de documentación")]
    FaltaDocumentacion,

    [Display(Name = "Mejor candidato seleccionado")]
    MejorCandidatoSeleccionado,

    [Display(Name = "Desinterés del candidato")]
    DesinteresDelCandidato,

    [Display(Name = "Otro")]
    Otro
}
```

Si prefieres no renombrar, puedes dejar `InterviewRejectionReason`, pero yo aprovecharía para renombrarlo porque aún no hay producción.

---

## 4.9 `CandidateInterviewModality`

Se mantiene.

```csharp
public enum CandidateInterviewModality
{
    [Display(Name = "Presencial")]
    Presencial,

    [Display(Name = "Virtual")]
    Virtual
}
```

---

# 5. Índices y validaciones recomendadas

## `Candidate`

### Índices

- Índice único sobre `NormalizedPhoneNumber`.
- Índice no único sobre `NormalizedEmail`.

### Validaciones

- `FirstName` obligatorio.
- `LastName` obligatorio.
- `PhoneNumber` obligatorio.
- `Email` obligatorio.
- `BirthDate` obligatorio.
- Edad >= 18.
- Teléfono normalizado antes de guardar.
- Email normalizado antes de guardar.

---

## `CandidateApplicationRole`

### Índices

- Único: `CandidateId + Role`
- Único filtrado: `CandidateId` donde `IsPrimary == true`

### Validaciones

- No duplicar rol por candidato.
- Solo un perfil principal.

---

## `CandidateWorkExperience`

### Validaciones

- `StartDate` obligatorio.
- `CompanyName` obligatorio.
- `JobPosition` obligatorio.
- Si `EndDate != null`:
  - `EndDate >= StartDate`
  - `DepartureReason` obligatorio

---

## `CandidateProcess`

### Índices

- Único: `CandidateId + RequestPositionId`

### Validaciones

- Candidato existente.
- Vacante existente.
- Candidato no puede estar `Archived`.
- Vacante no puede estar cerrada.
- Etapa inicial `Nuevo`.
- Estado inicial `Abierto`.
- No permitir más de un proceso para el mismo `RequestPosition`.

---

## `CandidateInterview`

### Índices

- Índice simple sobre `CandidateProcessId`.
- Índice único filtrado por proceso cuando `Status == Programada`, para garantizar una sola entrevista activa.

### Validaciones

- `CandidateProcessId` obligatorio.
- `InterviewerUserId` obligatorio.
- `ScheduledAt` obligatorio.
- Proceso debe estar abierto.
- No debe existir otra entrevista `Programada` activa para el mismo proceso.
- El entrevistador no debería modificarse después de creada.

---

## `CandidateInterviewResult`

### Índices

- Único: `InterviewId`

### Validaciones

- `InterviewId` obligatorio.
- `Decision` obligatorio.
- Si `Decision == Rechazado`, `DecisionReason` obligatorio.
- Si `Decision != Rechazado`, `DecisionReason` puede ser nulo.
- Resultado no editable después de creado.

---

# 6. State machine del proceso

## Etapa inicial

```text
Nuevo
```

---

## Transiciones recomendadas

### Desde `Nuevo`

- `Nuevo -> EntrevistaOperaciones`
  - Cuando se agenda la primera entrevista.
- `Nuevo -> Rechazado`
  - Si se rechaza manualmente sin entrevista.
- `Nuevo -> EnEspera`
  - Si se deja en pausa.

---

### Desde `EntrevistaOperaciones`

Según resultado de entrevista:

- `Aprobado` → `Seleccionado`
- `Rechazado` → `Rechazado`
- `NoSePresento` → `NoSePresento`
- `EnEspera` → `EnEspera`
- `Reprogramar` → sigue en `EntrevistaOperaciones`, pero con nueva entrevista

---

### Desde `EnEspera`

- `EnEspera -> EntrevistaOperaciones`
- `EnEspera -> Rechazado`
- `EnEspera -> Seleccionado` si se reactiva directamente

---

### Desde `Seleccionado`

- `Seleccionado -> AltaEnProceso`
- `Seleccionado -> Rechazado` si se cae la selección

---

### Desde `AltaEnProceso`

- `AltaEnProceso -> Contratado`
- `AltaEnProceso -> Rechazado` si la alta no procede

---

### Etapas terminales

- `Rechazado`
- `NoSePresento`
- `Contratado`

---

# 7. State machine de entrevista

## Estado inicial

```text
Programada
```

---

## Transiciones

### `Programada -> Realizada`

Cuando el resultado es:

- `Aprobado`
- `Rechazado`
- `EnEspera`

### `Programada -> NoAsistio`

Cuando el resultado es:

- `NoSePresento`

### `Programada -> Reprogramada`

Cuando el resultado es:

- `Reprogramar`

### `Programada -> Cancelada`

Cuando se cancela sin evaluación.

---

# 8. Efectos automáticos al guardar un resultado

Esto debería resolverlo un servicio de dominio, no la entidad de forma aislada.

---

## Si `Decision = Aprobado`

- Entrevista → `Realizada`
- Proceso → `Seleccionado`
- Proceso sigue `Abierto`
- `SelectedForHiring = true`
- `SelectedAt = hoy`
- Actualizar `RequestPosition.SelectionDate = hoy`
- Insertar historial de etapa

---

## Si `Decision = Rechazado`

- Entrevista → `Realizada`
- Proceso → `Rechazado`
- Proceso → `Cerrado`
- `ClosureReason = Rechazo`
- `ClosedAt = ahora`
- Insertar historial de etapa

---

## Si `Decision = NoSePresento`

- Entrevista → `NoAsistio`
- Proceso → `NoSePresento`
- Proceso → `Cerrado`
- `ClosureReason = NoSePresento`
- `ClosedAt = ahora`
- Insertar historial de etapa

---

## Si `Decision = EnEspera`

- Entrevista → `Realizada`
- Proceso → `EnEspera`
- Proceso puede seguir `Abierto` o pasar a `EnPausa` si así lo deciden.
- Insertar historial de etapa

---

## Si `Decision = Reprogramar`

- Entrevista actual → `Reprogramada`
- Entrevista actual → `ClosedAt = ahora`
- Se guarda resultado con `Decision = Reprogramar`
- Se crea una nueva entrevista:
  - `Status = Programada`
  - `RescheduledFromInterviewId = entrevista anterior`
  - `StageAtInterview = EntrevistaOperaciones`
- Proceso sigue en `EntrevistaOperaciones`

---

# 9. Integración con `RequestPosition`

Con tu confirmación de **F9**, la propuesta queda así:

---

## Cuando el proceso pasa a `Seleccionado`

Actualizar en `RequestPosition`:

```csharp
SelectionDate = DateOnly.FromDateTime(DateTime.UtcNow);
```

---

## Cuando el proceso pasa a `AltaEnProceso`

No necesariamente se toca `RequestPosition`.

A nivel proceso:

```csharp
HiringRequestedAt = DateTime.UtcNow;
```

Si el enum `Status` de `RequestPosition` tiene un estado tipo `AltaEnProceso` o similar, también podría actualizarse.

---

## Cuando el proceso pasa a `Contratado`

Actualizar en `RequestPosition`:

```csharp
EntryDate = process.HiredEntryDate ?? DateOnly.FromDateTime(DateTime.UtcNow);
DateFinish = DateOnly.FromDateTime(DateTime.UtcNow);
Status = estado final equivalente;
```

Esto depende del enum `Status` que tengas en `RequestPosition`.

---

## Cuando la vacante se cierra sin contratación

Si `RequestPosition` se cierra:

```csharp
DateFinish = hoy;
```

Y todos sus procesos abiertos deben:

```csharp
ProcessStatus = Cerrado;
ClosureReason = VacanteCerrada;
ClosedAt = ahora;
```

La etapa actual puede quedarse como iba; no hace falta moverla a una etapa `Cancelado`.

---

# 10. Qué entidades desaparecen

Ya puedes eliminar:

- `CandidateApplication`
- `CandidateInterviewFeedback`
- `CandidateDecisionReason`

También puedes eliminar estos enums si ya no se usan:

- `CandidateApplicationStage`
- `CandidateInterviewScheduleStatus`

Y reemplazar:

- `CandidateApplicationStage` por `CandidateProcessStage`
- `InterviewRejectionReason` por `CandidateRejectionReason` si aceptas el rename

---

# 11. Qué campos desaparecen o se mueven

## En `Candidate`

Desaparece:

- `Age`

Se agrega:

- `BirthDate`
- `NormalizedPhoneNumber`
- `NormalizedEmail`

---

## En `CandidateProcess`

Desaparecen:

- `ScheduledAt`
- `InterviewerUserId`
- `Status` basado en `CandidateInterviewStatus`
- `RescheduledAt`
- `RescheduleComment`
- `ConfirmedAt`

Se conservan/mejoran:

- `CurrentStage`
- `ProcessStatus`
- `RegisterDate`
- `ClosedAt`
- `ClosureReason`
- `FinalDecision`
- `FinalDecisionReason`
- `FinalDecisionComment`
- `FinalDecisionAt`
- `FinalDecisionByUserId`
- `InitialNotes`

---

## En `CandidateInterview`

Desaparecen:

- `CandidateApplicationId`
- `ScheduledDate`
- `ScheduledTime`
- `ScheduleStatus`
- `ProposedRescheduleAt`
- `ConfirmedAt`

Se agrega:

- `CandidateProcessId`
- `ScheduledAt`
- `StageAtInterview`
- `RescheduledFromInterviewId`
- `Status` simplificado

---

## En `CandidateInterviewResult`

Desaparece:

- `ReceptionConfirmedAt`

Se cambia:

- `DecisionReason` pasa a ser nullable
- Se agrega `Reprogramar` a `CandidateDecision`

---

# 12. Reglas de servicio importantes que deberías implementar

## Crear candidato

- Normalizar email y teléfono.
- Validar teléfono único.
- Validar mayoría de edad.
- Crear con `Status = Active`.

---

## Actualizar candidato

- Si cambia teléfono, volver a validar unicidad.
- Si cambia email, normalizar y advertir duplicado en UI si aplica.
- No permitir archivar si tiene procesos abiertos, a menos que primero se cierren.

---

## Crear proceso

- Validar que el candidato no esté `Archived`.
- Validar que la vacante esté activa.
- Validar que no exista ya un proceso para ese candidato y ese `RequestPosition`.
- Crear con:
  - `CurrentStage = Nuevo`
  - `ProcessStatus = Abierto`
- Insertar historial inicial.

---

## Agendar entrevista

- Validar proceso abierto.
- Validar que no haya otra entrevista activa.
- Obtener entrevistador por matriz o fallback.
- Crear entrevista en `Programada`.
- Si el proceso estaba en `Nuevo`, mover a `EntrevistaOperaciones`.

---

## Registrar resultado

- Validar que la entrevista esté `Programada`.
- Validar que no tenga resultado previo.
- Validar motivo si es rechazo.
- Actualizar entrevista.
- Actualizar proceso.
- Insertar historial.
- Publicar evento/notificación si aplica.

---

## Cerrar vacante

- Cerrar procesos abiertos.
- Marcar `ClosureReason = VacanteCerrada`.

---

## Contratar

- Mover proceso a `Contratado`.
- Cerrar proceso.
- `ClosureReason = Contratacion`.
- Actualizar `Candidate.Status = Contratado`.
- Actualizar `RequestPosition` con fechas de selección/ingreso/cierre.

---

# 13. Modelo final en una frase

> `Candidate` es la ficha maestra de la persona, `CandidateProcess` es el proceso de reclutamiento de ese candidato contra una vacante concreta, `CandidateInterview` representa cada cita dentro de ese proceso, y `CandidateInterviewResult` guarda el desenlace de cada entrevista.

---

# 14. Ya está listo para implementarse

Con esto, el módulo queda:

- sin legacy
- sin estados mezclados
- sin dos modelos paralelos
- con pipeline claro
- con entrevistas trazables
- con reagenda histórica
- con decisión y motivo bien tipados
- con integración clara hacia `RequestPosition`

---

## Si quieres, el siguiente paso puede ser cualquiera de estos:

1. **Generarte las entidades C# finales completas**, ya con auditoría incluida.
2. **Generarte las configuraciones EF Core** con índices únicos y relaciones.
3. **Generarte los comandos/handlers** para crear candidato, proceso, entrevista y resultado.
4. **Generarte la máquina de estados en código**.

Si quieres, en el siguiente mensaje te armo directamente:

- **entidades finales**
- **enums finales**
- **configuraciones EF Core**
- **validaciones**

todo en un solo bloque listo para copiar.
> Ejecutado: `2026-08-16`
> Referencia: `docs/plans/20260815-candidates-refactor-v3-plan.md`
