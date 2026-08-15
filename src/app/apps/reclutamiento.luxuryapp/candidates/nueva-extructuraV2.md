en la entidad candidatos debe haber una opcion para registrar se el candidato es
Nuevo campo: RecruitmentSource

Tipo: enum

Opciones:

Internal → Reclutado mediante procesos/campañas del área de Reclutamiento.

External → Reclutado por recomendación o medios externos.
Adaptarl a opcion en el formulario de registrar nuevo o editar candidato,

pARA EL PROCEDIMIENTO DE ALTAS DEBEMOS DE TENER TODOS ESTOS DATOS (REVISA EN LAS ENTIDADES ACTUALES MUCHOS en el sentido de propiedades viven ya en otras entidades, no significa que se tengan que cambiar a una nueva entidad precisamente si no de ver que en el proceso de solicitud de alta se hagan estas registros y se vallan a las entidades conrrespondientes )pero estos datos ya no son precisamente del candidato si ano ahora del empleado,
// Identificación
public Guid Id { get; set; }
public string Folio { get; set; }
public DateTime RequestDate { get; set; }

    // Datos personales
    public string FirstName { get; set; }
    public string LastNamePaterno { get; set; }
    public string LastNameMaterno { get; set; }
    public DateTime BirthDate { get; set; }
    public int Age { get; set; }
    public string NSS { get; set; }
    public string RFC { get; set; }
    public string CURP { get; set; }

    // Dirección
    public string StreetAddress { get; set; }
    public string Colonia { get; set; }
    public string Municipio { get; set; }
    public string PostalCode { get; set; }
    public string Estado { get; set; }

    // Contacto
    public string Phone { get; set; }
    public string Email { get; set; }

    // Datos bancarios
    public string BankName { get; set; }
    public string AccountNumber { get; set; }
    public string Clabe { get; set; }

    // Beneficiario
    public string BeneficiaryName { get; set; }
    public string BeneficiaryPhone { get; set; }
    public string BeneficiaryRelation { get; set; }

    // Contacto de emergencia
    public string EmergencyContactName { get; set; }
    public string EmergencyContactPhone { get; set; }
    public string EmergencyContactRelation { get; set; }

    // Salud
    public bool TakesControlledMedication { get; set; }
    public bool HasMedicationAllergy { get; set; }
    public string ChronicDiseases { get; set; }

    // Datos empresa
    public string Company { get; set; }
    public DateTime HireDate { get; set; }
    public string ContractType { get; set; }
    public string Position { get; set; }
    public string WorkAddress { get; set; }
    public decimal SalaryQnal { get; set; }
    public string Shift { get; set; }

    // Fuente de reclutamiento (nuevo campo)
    public RecruitmentSource Source { get; set; }

}

> **Revisado 2026-08-14 (U.4):** el candidato **solo** guarda su **CV** (Curriculum). El resto de documentos
> pertenece al **Empleado** en su expediente. Se usa `EmployeeDocument` (NO `CandidateDocument`, NO `CustomDocument`).
> `RecruitmentDocumentType` es el enum de tipos (renombrado desde `DocumentType`, que ya existe/ocupado en el hub).

ya que el candidato migrado a Empleado, debe de tener su archivo de documentacion,
public class EmployeeDocument
{
public int Id { get; set; }
public int EmployeeId { get; set; } // FK a Employee (uno a muchos: un empleado, N documentos)
public RecruitmentDocumentType Type { get; set; } // Enum (hub) con el tipo de documento
public string FilePath { get; set; } // Ruta o referencia al archivo
public bool IsDelivered { get; set; } // Si ya se entregó
public DateTime? DeliveredAt { get; set; } // Fecha de entrega
public bool IsMandatory { get; set; } // Si es requisito obligatorio
public string Notes { get; set; } // Observaciones (ej. documento ilegible, pendiente)
}

public enum RecruitmentDocumentType
{
ActaNacimiento = 1,
INE = 2,
ConstanciaFiscal = 3,
CURP = 4,
ComprobanteDomicilio = 5,
Curriculum = 6,
ConstanciaEstudios = 7,
ConstanciasLaborales = 8,
ConstanciaIMSS = 9,
ConstanciaInfonavit = 10,
ConstanciaFonacot = 11,
AntecedentesNoPenales = 12,
EstadoCuentaBancario = 13,
DocumentoMigratorio = 15,
TarjetaResidente = 16,
Pasaporte = 17
}
// Nota: Curriculum (=CV) pertenece al Candidato, no a EmployeeDocument.

---

# Análisis de estado actual y mapeo a entidades (a documentar, NO ejecutar)

> Orden de trabajo acordado:
> 1. **Requerimientos** → `nuevos-requerimientos.md` (baseline R-01..R-03).
> 2. **Análisis de entidades** (este archivo): ¿dónde encaja en las entidades empleado?
> 3. **Decisiones de diseño / Reglas de Negocio** (FASE 0).
> 4. **Estructura de servicios / DTOs / endpoints**.
> 5. **Frontend**.
> 6. **Plan formal + checklist → aprobación → ejecución** (prohibido antes).

## A. Hallazgo clave (evita duplicar)
`RequestEmployeeRegister` (tabla `StaffHiringRequests`) **YA CONTIENE**:
- `Folio`, `RequestDate`, `ExecutionDate`
- `TypeContractRegister` (Tipo de Contrato / ContractType)
- `Status`, `ApplicationUserId`, `EmployeeId`
- **`Fuente` de tipo enum `FuenteReclutamiento`** → el concepto "RecruitmentSource" ya existe en el proceso de alta.

Además ya existe el enum `FuenteReclutamiento`. Por tanto R-01 y parte de R-02 (Folio,
RequestDate, ContractType, Fuente) ya están cubiertos en el alta; falta exponerlos en
Candidato (pre-contratación) y completar el enrutamiento del resto de campos.

## B. Mapeo del "proceso de alta" (R-02) a entidades EXISTENTES

| Grupo | Campo (idea) | Entidad destino | Campo | Estado |
|---|---|---|---|---|
| Identificación | Folio | RequestEmployeeRegister | Folio | ✅ existe |
| Identificación | RequestDate | RequestEmployeeRegister | RequestDate | ✅ existe |
| Identificación | FirstName/LastNamePaterno/Materno | ⚠ GAP | — | PersonData NO tiene nombres; viven en `ApplicationUser` (vía `Employee.UserId`) / `Candidate`. **Decisión D2** |
| Identificación | BirthDate | PersonData | Birth | ✅ |
| Identificación | Age | derivable de BirthDate / Candidate.Age | — | ✅ derivable |
| Identificación | NSS | PersonData | NSS | ✅ |
| Identificación | RFC | PersonData | RFC | ✅ |
| Identificación | CURP | PersonData | Curp | ✅ |
| Dirección | StreetAddress/Colonia/Municipio/PostalCode/Estado | Address | Street / District(Colonia) / TownHall(Municipio) / ZIPCode / City/State | ✅ vía `Employee.AddressId` (Address es compartido System/Catalogs) |
| Contacto | Phone | PersonData.LocalPhone / Candidate.PhoneNumber | — | ✅ |
| Contacto | Email | ApplicationUser.Email / Candidate.Email | — | ✅ |
| Bancarios | BankName/AccountNumber/Clabe | EmployeeBankData | ✅ (tabla EmployeeBankData) | ✅ |
| Beneficiario | BeneficiaryName/Phone/Relation | ⚠ GAP | — | No hay entidad de beneficiario dedicada. `EmployeeEmergencyContact` tiene flag de beneficiario. **Decisión D3** |
| Emergencia | EmergencyContact* | EmployeeEmergencyContact | ✅ | ✅ |
| Salud | TakesControlledMedication/HasMedicationAllergy/ChronicDiseases | EmployeeClinicalData | ✅ (revisar campos exactos) | ✅ |
| Empresa | Company | Customer (cliente) asociado | — | ✅ |
| Empresa | HireDate | Employee | DateAdmission | ✅ |
| Empresa | ContractType | RequestEmployeeRegister.TypeContractRegister / WorkContract | — | ✅ |
| Empresa | Position | WorkPosition (JobPositions) | ✅ | ✅ |
| Empresa | WorkAddress | Address (otra) / WorkContract | — | ✅/⚠ |
| Empresa | SalaryQnal | Employee | Salary | ✅ |
| Empresa | Shift | WorkPosition | TurnoTrabajo (enum ShiftType) | ✅ vive solo en WorkPosition; WorkContract lo consume vía la posición |
| Fuente | Source | RequestEmployeeRegister | Fuente (FuenteReclutamiento) | ✅ existe |

**Conclusión:** la mayoría de los datos de R-02 ya tienen hogar en entidades empleado
activas. El trabajo real es **orquestar la captura en un formulario de alta que escriba
en `RequestEmployeeRegister` + (`PersonData`, `Address`, `EmployeeBankData`,
`EmployeeEmergencyContact`, `EmployeeClinicalData`, `Employee`, `WorkPosition`)** y no
crear entidades nuevas salvo los GAPs (nombres, beneficiario).

## C. Documentación de contratación (R-03) — REVISADO 2026-08-14 (U.4)
- **Principio:** el **Candidato** solo guarda su **CV** (componente `candidate-cv-upload`); el resto de documentos
  pertenece al **Empleado** en su expediente (NO al candidato). Por tanto **no** hay `RecruitmentCandidateHiringDocument`
  ligado al candidato.
- Entidad: **`EmployeeDocument`** ligada a `Employee` (FK `EmployeeId`, uno a muchos: un empleado → N documentos,
  uno por tipo). **`CustomDocument` (Operaciones) descartado 100%** (es para otro fin).
- Campos de `EmployeeDocument`:
  - `EmployeeId` (FK)
  - `DocumentTypeId` (enum **`RecruitmentDocumentType`**, renombrado desde `DocumentType` que ya existe/ocupado en el hub)
  - `FileName` / `FileUrl` (ruta relativa UUID)
  - `IsSubmitted`/`SubmittedAt`, `IsValidated`/`ValidatedAt`/`ValidatedByUserId`/`ValidationNotes`
- Relación: `Employee` (1) ──< (N) `EmployeeDocument`.
- `RecruitmentDocumentType` (~17 tipos: ActaNacimiento, INE, ConstanciaFiscal, CURP, ComprobanteDomicilio,
  ConstanciaEstudios, ConstanciasLaborales, ConstanciaIMSS, ConstanciaInfonavit, ConstanciaFonacot,
  AntecedentesNoPenales, EstadoCuentaBancario, DocumentoMigratorio, TarjetaResidente, Pasaporte). `Curriculum`
  (=CV) pertenece al Candidato, no a `EmployeeDocument`.
- Implicaciones de convenciones: archivos vía `IFileReadPathService`/`IFileWritePathService`; enum →
  `SelectItemEnumEndPoints` (hub); trazabilidad `CONVENTIONS.md`.

## D. Decisiones abiertas (requieren tu aprobación antes de planificar)
- **D1** — ¿`RecruitmentSource` en Candidato (pre-alta) o solo en alta? ¿Reusar `FuenteReclutamiento`?
- **D2** — ¿De dónde vienen los nombres del empleado (FirstName/LastNamePaterno/Materno)?
- **D3** — Beneficiario: ¿reusar `EmployeeEmergencyContact` (flag beneficiario) o entidad nueva?
- **D4** — ¿El alta escribe directo en entidades destino, o vía `RequestEmployeeRegister` como orquestador transaccional?
- **D5** — ¿Versión de documentación a adoptar (simple vs con validación)? ✅ **Resuelta**: versión con validación.
- **D6** — ¿Refactor de nombres a `RecruitmentCandidate*` (ver `extructura.md`) o trabajo sobre esquema actual (`Candidate`, `CandidateApplication`, ...)?

## E. Implicaciones de convenciones (CONVENTIONS.md) — recordatorio
- §3.7: cambios importantes requieren análisis previo + plan por fases + aprobación + ejecución. **Prohibido ejecutar hasta plan aprobado.**
- Enums → `GetDisplayName()` español; listados vía hubs centrales `SelectItemEnum`/`SelectItem` (nunca endpoint local ni modificar existentes).
- DTOs → 1 archivo = 1 DTO.
- Documentos → patrón de archivos seguro + componentes oficiales.
- Naming/ubicación según catálogos oficiales.

> Nota: la fila "Shift" en la sección B apuntaba a D6 por error; Shift es decisión
> independiente (¿`WorkContract` o `WorkPosition`?). Se tratará en el modelado de servicios.

## F. Resolución de decisiones (acordadas con el usuario)

### D1 — RecruitmentSource ✅
- Vive **solo en Candidato** (`Candidate.RecruitmentSource`).
- `RequestEmployeeRegister` ya tiene `Fuente` (enum `FuenteReclutamiento`): se mantiene y, al
  dar de alta, se **copia** `Candidate.RecruitmentSource` → `RequestEmployeeRegister.Fuente`.
- Candidato = fuente de verdad pre-alta; alta = copia. Sin duplicar lógica.

### D2 — Origen de nombres y aislamiento multi-edificio ⚠️ (análisis en F.1)
- Nombres del empleado: en el alta se **copian** de `Candidate` → `ApplicationUser` (y luego
  `PersonData`/`Employee`). El candidato es entidad **aislada** hasta el alta.
- **NO se recomienda** agregar `TypePerson` a `ApplicationUser` (ver F.1).

### D3 — Beneficiario ✅
- Reusar `EmployeeEmergencyContact` (ya tiene flag de beneficiario). Sin entidad nueva.

### D4 — Orquestador de alta ✅
- `RequestEmployeeRegister` = orquestador: tiene sus propias props
  (`Folio`, `RequestDate`, `TypeContractRegister`, `Fuente`, `Status`, `EmployeeId`) y el
  resto se distribuye a `PersonData`, `Address`, `EmployeeBankData`,
  `EmployeeEmergencyContact`, `EmployeeClinicalData`, `Employee`, `WorkPosition`.

### D5 — Documentación de contratación ✅
- Resuelta en sección C: se adopta la **versión con validación** (`RecruitmentCandidateHiringDocument`).

### D6 — Refactor de nombres ✅ (requiere plan de migración)
- Aprobar en principio adoptar `RecruitmentCandidate*` (de `extructura.md`).
- ⚠️ Impacto alto: renombra entidades, tablas, migraciones, servicios, DTOs, endpoints y
  frontend. Requiere **plan de migración aprobado** (§3.7 / Data Migration Protocol) y
  ejecutarse como fase dedicada, no mezclado con R-01..R-03.

### Shift (Turno) ✅
- Vive **solo** en `WorkPosition.TurnoTrabajo` (enum `ShiftType`: Matutino/Vespertino/
  Nocturno/Mixto). Son datos propios de la posición de trabajo.
- `WorkContract` **NO** almacena turno: lo consume a través de la relación con
  `WorkPosition` (un empleado cubriendo un puesto hereda esos datos únicos).
- En el alta (R-02): `Shift` → `WorkPosition.TurnoTrabajo`. `Employee` ya tiene navegación
  a `WorkPosition`, por lo que el turno se resuelve por ahí.
- Enum `ShiftType` → `[Display(Name=...)]` español y listado vía hub central `SelectItemEnum`.

## F.1 Análisis D2 — Aislamiento multi-edificio / historial (caso crítico)

**Escenario:** Persona es empleado en Edificio A (Cliente A) con historial; luego es
**candidato** en Edificio B (Cliente B) y finalmente se da de alta en B.

**¿Por qué no hay fuga de historial?**
- El sistema es multi-tenant por `Customer` (Cliente/Edificio). `Employee` es entidad de
  tenant (bajo `CustomerId`). Todas las entidades de historial
  (`VacationBalance`, `VacationRequest`, `Incident`, `NominaDetalle`, `IncidenciaNomina`,
  `PrestamoEmpleado`, `PerformanceEvaluation`, `WorkContract`, etc.) cuelgan de `EmployeeId`.
- El historial de A queda bajo `Employee_A` (Cliente A); el alta en B crea `Employee_B`
  (Cliente B) **partiendo de cero**. Separación natural por `EmployeeId` + `CustomerId`.

**Sobre `ApplicationUser` y `TypePerson` (recomendación: NO agregar):**
- `ApplicationUser` es la **identidad compartida** de la persona (login). Una misma persona
  puede ser, a la vez, empleado en A y candidato en B → un campo `TypePerson` de valor único
  **no representa ambos estados** (inconsistencia).
- Mejor: **no guardar el "tipo" en el usuario**. La condición se infiere de la existencia de
  registros:
  - ¿Es candidato? → existe `Candidate` activo (por Cliente).
  - ¿Es empleado? → existe `Employee` (por Cliente).
- Permisos por **roles/claims**, no por flag de tipo en el usuario.

**Sobre la búsqueda de usuario en el alta (corrige hallazgo previo):**
- El alta en B debe buscar `ApplicationUser` **por email Y por `CustomerId` de B** para no
  reusar por error el usuario de A. Esto corrige el hallazgo de `ProcessHiringAsync`
  (buscaba solo por email, ambiguo). En B se reusa el `ApplicationUser` existente (misma
  persona) pero se crea `Employee_B` nuevo por Cliente.

**Conclusión D2:** Candidato aislado; al alta copiar datos a `ApplicationUser` (existente o
nuevo, filtrando por Cliente) y crear `Employee` nuevo por Cliente. Historial aislado por
diseño (tenant + EmployeeId). No se agrega `TypePerson` a `ApplicationUser`.

## G. Modelado de Servicios / DTOs / Endpoints (FASE 4) — Estado actual vs Cambios

> Objetivo: distinguir lo que YA EXISTE de lo NUEVO / lo que se MODIFICA.
> Convenciones aplicables: DTO 1 archivo = 1 DTO; enums en hub `SelectItemEnum`;
> archivos vía `IFileReadPathService`/`IFileWritePathService`; `[FromForm]`+`DisableAntiforgery`.

### G.1 Inventario actual (existente, NO cambia de forma)

**Servicios (interfaces + impl):**
- `ICandidateAppService` / `CandidateAppService` — ficha maestra de candidato (CRUD, archive).
- `ICandidateApplicationAppService` / `CandidateApplicationAppService` — bandeja de postulaciones, `ChangeStage`, `RegisterDecision`, `UploadCv`, `ProcessHiring`.
- `ICandidateProcessAppService` / `CandidateProcessAppService` — **modelo fusionado** (ya tiene `ProcessHiringAsync`, `ResolveOrCreateEmployeeIdAsync`). Es el orquestador real hoy.
- `ICandidateInterviewAppService`, `ICandidateInterviewResultAppService`, `ICandidateWorkExperienceAppService`, `ICandidateDecisionReasonAppService`, `IInterviewerMatrixAppService`, `ICandidateAutomationService`.
- `Notifications`: `ICandidateNotificationCoordinatorService`, `IMultiChannelAlertService`.

**Grupos de endpoints (Minimal API):**
- `api/recruitment-candidates` (CandidateEndPoint)
- `api/recruitment-candidate-applications` (CandidateApplicationEndPoint)
- `api/recruitment-candidate-processes` (CandidateProcessEndPoint) ← orquestador de alta
- `api/recruitment-candidate-interviews`, `.../interview-results`, `.../work-experiences`, `.../decision-reasons`, `interviewer-matrix`

**Alta hoy:** `POST {id}/process-hiring` → `CandidateProcessAppService.ProcessHiringAsync`.

### G.2 Comportamiento actual del alta (`ProcessHiringAsync`)

1. Carga `CandidateProcess` (+ `Candidate`, `RequestPosition`→`WorkPosition`).
2. Valida `Stage == Seleccionado` y CV presente.
3. `ResolveOrCreateEmployeeIdAsync(candidate, customerId)`:
   - Busca `ApplicationUser` por **`Email` + `CustomerId` + `TypePerson.Employee`** → ya aislado multi-edificio (cumple D2). ✅
   - Si no existe: crea `ApplicationUser` (FirstName/LastName/Phone del candidato, `TypePerson.Employee`) y `Employee` (Salary 0, EducationLevel 0).
   - Crea `PersonData` **vacío** y `Address` **vacío** (solo esqueleto).
4. Arma `GetRequestEmployeeRegisterDTO` con: `PositionRequestId`, `CandidateName`, `ExecutionDate`, `Salary=""`, `TypeContractRegister`, `Boss`, `CustomerAddress`, `AdditionalInformation`, `EmployeeId`.
5. `requestEmployeeRegisterAppService.OnSolicitudAltaAsync(...)` → crea `RequestEmployeeRegister` (copia `Fuente` del candidato).
6. Cambia stage a `AltaEnProceso`.

**Brecha:** no distribuye bancarios, clínicos, emergencia/beneficiario, ni `WorkPosition.TurnoTrabajo`, ni documentos de contratación.

### G.3 Cambios requeridos

#### NUEVO (no existe hoy)
- **Entidad** `EmployeeDocument` (R-03, post-alta, ligada a `Employee`; reemplaza a `RecruitmentCandidateHiringDocument` que se descarta — ver U.4).
- **Servicio** `CandidateHiringDocumentAppService` (o métodos en `CandidateProcessAppService`):
  subir documento, listar por aplicación, validar (`IsValidated`, `ValidatedByUserId`, `ValidationNotes`).
- **Enum** `RecruitmentDocumentType` (~17 tipos de R-03). ⚠️ NO reusar `DocumentType` (existe en hub
  pero es de otro dominio: BuildingDocuments/Template/Manuals). Crear nuevo y registrar ruta en hub.
- **Enum** `ShiftType` (Matutino/Vespertino/Nocturno/Mixto) → propiedad `WorkPosition.TurnoTrabajo`.
  Registrar ruta en hub `SelectItemEnum`.
- **Prop** `Candidate.RecruitmentSource` (reusa enum `FuenteReclutamiento` ya en hub `fuente-reclutamiento`).
- **Endpoints** (grupo `recruitment-candidate-processes` o nuevo `recruitment-candidate-hiring-documents`):
  - `POST {applicationId}/hiring-documents` (multipart, `[FromForm]`+`DisableAntiforgery`)
  - `GET {applicationId}/hiring-documents`
  - `POST {documentId}/validate`

#### MODIFICADO (existe, se amplía)
- `Candidate` (entidad): +`RecruitmentSource`.
- `CandidateCreateOrUpdateDto`: +`RecruitmentSource` (enum `FuenteReclutamiento`, 1 archivo = 1 DTO).
- `CandidateApplicationProcessHiringDto` (o nuevo `SolicitudAltaCompletaDto`): ampliar con todos los
  campos de R-02: nombres (paterno/materno), BirthDate, NSS, RFC, CURP, dirección, teléfono,
  bancarios (BankName/AccountNumber/Clabe), beneficiario (en `EmployeeEmergencyContact`),
  emergencia, salud (control medication/alergia/crónicas), `WorkPosition.TurnoTrabajo` (ShiftType),
  `RecruitmentSource`.
- `GetRequestEmployeeRegisterDTO`: ampliar para transportar esos campos a `OnSolicitudAltaAsync`.
- `CandidateProcessAppService.ResolveOrCreateEmployeeIdAsync`: poblar `PersonData`
  (CURP/RFC/NSS/Birth), `Address`, y crear `EmployeeBankData`, `EmployeeClinicalData`,
  `EmployeeEmergencyContact` (beneficiario) en lugar de dejarlos vacíos.
- `CandidateProcessAppService.ProcessHiringAsync`: set `WorkPosition.TurnoTrabajo` y copiar
  `Candidate.RecruitmentSource` → `RequestEmployeeRegister.Fuente`.
- `RequestEmployeeRegisterAppService.OnSolicitudAltaAsync`: recibir y persistir la distribución real.
- Envolver la distribución en una **transacción** (orquestador atómico).

### G.4 Enums y rutas en hub central (`SelectItemEnumEndPoints`)
- Ya existe: `fuente-reclutamiento` (`FuenteReclutamiento`) → reusar para `Candidate.RecruitmentSource`.
- Nuevo: `recruitment-document-type` → `RecruitmentDocumentType`.
- Nuevo: `shift-type` → `ShiftType`.
- ❌ Prohibido modificar `DocumentType`/`SelectItemStatus` existentes; crear nuevos.

### G.5 Notas de convenciones
- DTOs: 1 archivo = 1 DTO (cada nuevo DTO en su archivo).
- Documentos: `IFileReadPathService`/`IFileWritePathService`; UI muestra `Name`; `WebButtonIconViewPdf`;
  endpoints multipart con `[FromForm]`+`DisableAntiforgery()`.
- Enums: `[Display(Name=...)]` en español + hub central (nunca endpoint local).
- D6 (renombres `RecruitmentCandidate*`): fase de migración aparte, NO mezclar con R-01..R-03.

> **Corrección a G.4 (Shift):** el hub `SelectItemEnum` **ya expone** `turno-trabajo`
> (`EnumSelectService.turnoTrabajo()`). Por tanto `WorkPosition.TurnoTrabajo` debe reusar el
> enum existente `TurnoTrabajo` y la ruta `turno-trabajo`; **NO crear** `ShiftType`/`shift-type`.
> Igual para `fuente-reclutamiento` (ya existe, se reusa para `Candidate.RecruitmentSource`).

## H. Frontend — Alta y edición de Candidato (alcance Reclutamiento, R-01)

> Alcance acotado: solo la ficha maestra del candidato (crear/editar). La asignación de
> vacante (`CandidateApplication`), documentos y alta de empleado se modeloan en fases posteriores.

### H.1 Inventario actual (existente, NO cambia de forma)
- `candidate/candidate-list.ts`: lista, archivar, abrir `CandidateForm`, abrir detalle.
  Tras crear candidato abre `CandidateApplicationForm` (asignar vacante) — **fuera de alcance**.
- `candidate/candidate-form.ts`: `FormGroup<CandidateFormGroup>` + `workExperiences` (FormArray);
  `onSubmit` arma `FormData` (multipart, por `CvFile`) y hace POST/PUT a
  `EndpointsReclutamiento.Candidates`. `onLoadData` patcha desde `CandidateDetail`.
- `candidate/candidate-detail.ts`: ficha de lectura.
- `core/services/enum-select.service.ts`: ya tiene `fuenteReclutamiento()` → hub `fuente-reclutamiento`.
- `core/enums/fuente-reclutamiento.ts`: enum local `FuenteReclutamiento { Internal=0, External }`.

### H.2 Estado actual
El formulario NO tiene `RecruitmentSource`. El `CandidateFormGroup`, `CandidateAddOrEdit`,
`CandidateDetail` y el `onSubmit` no lo consideran. El backend `CandidateCreateOrUpdateDto`
tampoco lo trae (ver G.3).

### H.3 Cambios requeridos — Candidato (R-01)

#### MODIFICADO (frontend)
- `candidate/interfaces/candidate-form.interface.ts` (`CandidateFormGroup`):
  + `recruitmentSource: FormControl<number | null>` (valor del enum).
- `candidate/candidate-form.ts`:
  - + `FormControl` `recruitmentSource` (noNullable, decidir si `Validators.required`).
  - Cargar opciones con `EnumSelectService.fuenteReclutamiento()` (hub, NO local).
  - Selector en `candidate-form.html` usando el patrón de selector de enums del módulo.
  - `onSubmit`: `formData.append("RecruitmentSource", String(this.form.controls.recruitmentSource.value))`.
  - `onLoadData`: `patchValue({ recruitmentSource: result.recruitmentSource })`.
- `candidate/interfaces/candidate.dto.ts`:
  - `CandidateAddOrEdit` + `recruitmentSource?: number`.
  - `CandidateDetail` + `recruitmentSource?: number`.
  - (Opcional) `CandidateListItem` + `recruitmentSource?: number` para columna en lista.
- `candidate/candidate-list.html` (+ desktop) — **opcional**: columna "Fuente".

#### MODIFICADO (backend, ya en G.3)
- `Candidate` (entidad) + `RecruitmentSource` (enum `FuenteReclutamiento`).
- `CandidateCreateOrUpdateDto` + `RecruitmentSource` (enum `FuenteReclutamiento`).

#### NUEVO
- (Ninguno: se reusan enum local `FuenteReclutamiento` y `EnumSelectService.fuenteReclutamiento()`).
- Si se quiere mostrar la fuente como etiqueta en lista/detalle, reusar helper de badges
  existente (`candidate-status-tag` / `candidate-stage-badge` como referencia de patrón).

### H.4 Convenciones frontend
- Reusar `EnumSelectService` y el enum local; **NO** crear enum ni endpoint de selector local.
- El valor viaja como campo del `FormData` (multipart), coherente con `[FromForm]` del endpoint.
- Componentes standalone, `signal()`/`computed()`, `@ui/*`, `ApiResponseService`, `DialogHandlerService`.
- Definir obligatoriedad de `RecruitmentSource` en alta (sugerido: obligatorio).

### H.5 Fuera de alcance en esta iteración
- Asignación de vacante / `CandidateApplication` (pipeline de etapas).
- `RecruitmentCandidateHiringDocument` y su carga/validación (R-03).
- Formulario de "proceso de alta" del empleado y distribución a entidades (sección G.3).

## I. Frontend/Backend — Configurar entrevista a una vacante (alcance Reclutamiento)

> Verificación de las opciones que gestiona Reclutamiento para agendar/asignar una
> entrevista a una vacante. Convención recordatorio: los enums se obtienen vía el hub
> `SelectItemEnumEndPoints.cs` (API), no como lista hardcodeada en frontend.

### I.1 Opciones actuales (existentes, verificadas)

**Backend (`ScheduleRecruitmentInterviewRequest` + `CandidateProcessAppService.ScheduleAsync`):**
- `RecruitmentInterviewAt` (DateTime?) — fecha/hora entrevista de Reclutamiento.
- `OperationsInterviewAt` (DateTime?) — fecha/hora entrevista de Operaciones.
- `OperationsInterviewAssignedToUserId` (string?) — entrevistador asignado (operaciones).
- `Comment` — contexto.
- `CancelInterview` (bool) — cancelar cita.
- `ScheduleAsync` valida con `EnsureInterviewSchedulingAllowedAsync(requestPositionId, interviewer, fecha, processId)`,
  setea `CandidateProcess.ScheduledAt` + `InterviewerUserId` + `Status = Pendiente` y notifica.

**Frontend (`candidate-recruitment-interviews` → `CandidateRecruitmentScheduleModal`):**
- Acciones: `send` (Enviar a entrevista → etapa `EntrevistaReclutamiento`), `schedule`, `reschedule`, `assign`.
- Campos del formulario: `recruitmentInterviewAt`, `operationsInterviewAt`, `operationsInterviewAssignedToUserId`, `comment`.
- Entrevistador: **opciones vía API** `InterviewerMatrix.eligibleInterviewersByRequestPosition(requestPositionId)`
  → `SelectItemDto[]` (datos de la matriz, NO es un enum). Cumple convención (no hardcodeado).
- Cancelar entrevista (botón).

### I.2 De dónde vienen los valores (cumplimiento de convenciones)
- **Entrevistador**: datos desde `InterviewerMatrix` (`GetEligibleInterviewersByRequestPositionAsync`). ✅ correcto (no enum).
- **Etapa**: `CandidateApplicationStage` es enum **local en frontend** (`core/enums/candidate-application-stage.ts`); NO está en hub.
  Pre-existente; fuera de alcance de esta iteración.
- **Tipo de entrevista** (`CandidateInterviewType` = Reclutamiento/Operaciones): **NO está en hub**; hoy se infiere de
  la etapa/acción (no hay selector). Aceptable, pero si se quiere selector explícito hay que registrar ruta `interview-type`.
- **Rol del entrevistador** (`ApplicationRoleEnum`): sí está en hub (`application-roles`); el backend lo resuelve solo
  (`ResolveInterviewerRoleAsync`/`GetInterviewerRoleSafe`), el frontal no lo elige.
- **Estatus de cita** (`CandidateInterviewStatus`): el backend devuelve `agendaStatusLabel` (DisplayName) ya resuelto;
  el frontal solo muestra el label. ✅

### I.3 Decisiones de Reclutamiento (resueltas)
1. **Entrevistador:** por el momento solo se asigna entrevistador a nivel **Customer**
   (el de Operaciones vía `operationsInterviewAssignedToUserId`). El de Reclutamiento NO se asigna
   desde este modal. ✅ Mantener actual.
2. **Ubicación (Location):** NO se requiere capturarla; la dirección se obtiene automáticamente de
   `Customer.Address`. ✅ Gap cerrado, sin cambio.
3. **Tipo de entrevista (`CandidateInterviewType`):** el usuario indica que **NO debería existir como enum**.
   En su lugar debe haber un **registro** que documente cuándo se entrevistó al candidato y un check de
   **apto/no apto**. Ver sección J (nueva idea, nivel control).
4. **Cancelación:** ya existe (`CancelInterview` + `cancel-schedule`/`cancelInterview`). ✅

### I.4 Estado
- Casi todo el agendamiento ya existe y cumple la convención para el único select que aplica (entrevistador vía API).
- Nada NUEVO obligatorio para R-01..R-03 en este subalcance; los puntos I.3 son **decisiones de Reclutamiento** que
  deben cerrarse antes de modelar cambios en este flujo.

### I.5 Fuera de alcance
- Feedback de entrevista (`CandidateInterviewAppService.SubmitFeedbackAsync`) y resultados.
- Proceso de alta / distribución a empleado (sección G.3).

## J. Nueva idea — Registro de entrevista de Reclutamiento (apto/no apto) — nivel control

> Surge de I.3.3: en vez de un enum `CandidateInterviewType` (Reclutamiento/Operaciones) como
> discriminador, Reclutamiento debe **documentar la ocurrencia de la entrevista** (cuándo se
> entrevistó) y un **check de aptitud** (apto / no apto). Por el momento es un requerimiento de
> control, sin detalle técnico profundo.

### J.1 Lo que ya existe (no duplicar)
El módulo ya cuenta con:
- `CandidateInterview` (ocurrencia): `ScheduledAt`, `CompletedAt`, `FeedbackDate`, `Rating`,
  `FeedbackText`, `InterviewType`, `AssignedToUserId`.
- `CandidateInterviewResult` (resultado): `Decision` (Approved/Rejected/OnHold), `Score`,
  `Comments`, `DecisionReasonId`, `EvaluatedAt`, `EvaluatedByUserId`.

Es decir, "cuándo se entrevistó" y "resultado" ya tienen hogar. La brecha es semántica:
- Hoy el `InterviewType` (Reclutamiento/Operaciones) es un enum discriminador (lo que el usuario
  cuestiona). 
- Falta un flag explícito de **apto/no apto** ligado a la entrevista de Reclutamiento.

### J.2 Opciones a decidir en diseño (FASE 0, no ahora)
- **Opción A (recomendada, sin nueva entidad):** reusar `CandidateInterview` + `CandidateInterviewResult`;
  agregar `IsApto` (bool) / `Apto` al resultado de la entrevista de Reclutamiento. Evita duplicar
  y aprovecha la trazabilidad existente.
- **Opción B (entidad nueva):** `RecruitmentInterviewRecord` que documente fecha de entrevista de
  Reclutamiento + check apto/no apto + comentarios. Más explícito, pero solapa con `CandidateInterview`.

### J.3 Notas de convenciones
- Si se opta por un enum de resultado/aptitud, debe ir al hub `SelectItemEnum` (no local).
- Por ahora es **requerimiento de control**: no modelar aún tablas/campos; registrar la intención y
  resolver en FASE 0 (Reglas de Negocio).
- Relación con I.3.3: el enum `CandidateInterviewType` existente se replantea; la fuente de verdad
  pasa a ser el **registro de la entrevista + su aptitud**, no el tipo.

## K. Análisis de entidades de resultado/decisiones — "los dos filtros"

> Flujo descrito por el usuario:
> - **Filtro 1 (Reclutamiento):** busca gente, al encontrar a alguien apto lo registra como
>   candidato y lo **envía a entrevista** (con Operaciones / entrevistadores responsables de edificio).
> - **Filtro 2 (Entrevistador):** responde la entrevista con **feedback + decisión**
>   (Aprobado / Rechazado / En espera / No se presentó) y un **motivo**. Objetivo: tras la
>   entrevista, en **un solo formulario** devolver la respuesta a Reclutamiento.

### K.1 Entidades y enums ya existentes (verificados)
- `CandidateApplicationStage` (10 etapas): Nuevo, PreFiltro, EnEspera, EntrevistaReclutamiento,
  EntrevistaOperaciones, NoSePresento, Rechazado, Seleccionado, AltaEnProceso, Contratado.
- `CandidateDecision` (enum): **Aprobado / Rechazado / EnEspera / NoSePresento** → coincide con el flujo. ✅
- `CandidateInterview` (ocurrencia, tabla `RecruitmentCandidateInterviews`): tipo, entrevistador,
  fecha, estatus, notas, reagenda.
- `CandidateInterviewResult` (tabla `RecruitmentCandidateInterviewResults`): **nueva fuente de verdad**
  del resultado; `Decision`, `DecisionReasonId` (requerido), `AdditionalComment`, `EvaluatedAt`, `EvaluatedByUserId`.
- `CandidateInterviewFeedback` (tabla `RecruitmentCandidateInterviewFeedback`): **legacy**; también
  guarda `Decision` + `DecisionReasonId` + comentario. El doc dice Result lo sustituye → **redundante**.
- `CandidateDecisionReason` (catálogo `RecruitmentCandidateDecisionReasons`): `Code`, `Name`,
  `AppliesToDecision` (CandidateDecision), `IsActive`, `DisplayOrder`. Motivo filtrado por decisión.
- `CandidateApplication` (a nivel aplicación): `DecisionReasonId`, `DecisionComment` (espejo del
  último resultado, para listas rápidas).

### K.2 Clasificación de campos (necesario / útil / no necesario para el formulario único)

**`CandidateInterviewResult` (lo que llena el Filtro 2) — NECESARIO:**
| Campo | Necesario | Nota |
|---|---|---|
| InterviewId | ✅ | vincula a la entrevista |
| Decision (CandidateDecision) | ✅ | Aprobado/Rechazado/EnEspera/NoSePresento |
| DecisionReasonId (Motivo) | ❌ eliminar | Ya no se usa; se sustituye por `AdditionalComment` (ver K.6.2) |
| EvaluatedByUserId / EvaluatedAt | ✅ | trazabilidad de quién decide |
| AdditionalComment | 🟡 útil | comentario libre del entrevistador |

> Sobre "Motivo de la decisión": **SÍ es necesario** (auditoría, sobre todo para Rechazado/EnEspera/
> NoSePresento). Recomendación: requerido salvo cuando `Decision == Aprobado` (en Aprobado basta el
> comentario). Hoy la entidad lo marca `Required` siempre.

**`CandidateInterview` (ocurrencia del Filtro 1/2) — NECESARIO/ÚTIL:**
| Campo | Necesario | Nota |
|---|---|---|
| InterviewType | 🟡 útil | distingue EntrevistaReclutamiento vs Operaciones (ver J) |
| InterviewerUserId / InterviewerRole | ✅ | quién entrevistó |
| ScheduledAt | ✅ | cuándo se entrevistó |
| Status / ClosedAt | ✅ | cerrar la cita al responder |
| Notes | 🟡 útil | notas de la cita |
| ConfirmedAt / ScheduleStatus / ProposedRescheduleAt / RescheduleComment | 🟡 útil | reagenda/confirmación (no del formulario de respuesta) |
| CreatedAt/By/UpdatedAt/By | ❌ no del formulario | auditoría automática |

**`CandidateInterviewFeedback` (legacy) — NO NECESARIO:** duplica `CandidateInterviewResult`.
Recomendación: **deprecian y eliminar** del flujo; el formulario único escribe solo en `CandidateInterviewResult`.

**`CandidateApplication` (espejo) — NECESARIO mantener sincronizado:** `DecisionReasonId` /
`DecisionComment` se pueblan desde el `CandidateInterviewResult` para que Reclutamiento vea la
respuesta en la bandeja sin joins. No se capturan directamente en el formulario.

### K.3 Formulario único propuesto (Filtro 2 → respuesta a Reclutamiento)
Campos del formulario del entrevistador:
1. `Decision` (select, enum `CandidateDecision` → registrar ruta `candidate-decision` en hub si se usa select).
2. ~~`DecisionReasonId` (motivo)~~ **ELIMINADO**: ya no se usa motivo; solo `AdditionalComment`.
3. `AdditionalComment` (texto) — único campo de texto libre para justificar la decisión.
4. (Opcional) rating/score — hoy `CandidateInterviewResult` **NO** tiene `Rating` (el diseño viejo sí lo
   mencionaba). Decidir si se agrega.

Al guardar: escribe la decisión en el `CandidateProcess` (vía `ExecuteInterviewerActionAsync`, ver N.6),
cierra la cita y transiciona `CandidateApplicationStage`:
- Aprobado desde `EntrevistaReclutamiento` → `EntrevistaOperaciones` (requiere 2ª aprobación, L.3)
- Aprobado desde `EntrevistaOperaciones` → `Seleccionado`
- Rechazado → `Rechazado`
- EnEspera → `EnEspera`
- NoSePresento → `NoSePresento`

Reclutamiento ve la respuesta en su bandeja (stage + resultado), sin formularios extra.

### K.4 Relación con R-04 / J
El "apto/no apto" de la sección J **es** la `Decision` (Aprobado = apto, Rechazado/EnEspera/NoSePresento =
no apto / pendiente). No se necesita entidad nueva ni flag `IsApto` aparte: el `CandidateInterviewResult`
ya cubre ocurrencia + decisión. Se confirma **Opción A** (reusar `CandidateInterviewResult`).

### K.5 Convenciones
- `CandidateDecision` y `CandidateApplicationStage`: si el frontal usa select, registrar rutas en hub
  (`candidate-decision`, y `application-stage` ya existente en frontend local — evaluar mover a hub).
- `CandidateDecisionReason`: catálogo propio (no enum) → sus propios endpoints / hub `SelectItem` dinámico;
  NO va al hub `SelectItemEnum`.
- Eliminar `CandidateInterviewFeedback` requiere plan de migración (borrado de tabla/uso) — fase aparte,
  **CONFIRMADO** (ver K.6.1).

### K.6 Decisiones confirmadas (cierre de este subalcance)
- **K.6.1 — Eliminar `CandidateInterviewFeedback` (legacy duplicado).** ✅ Se elimina del flujo; el
  formulario único (Filtro 2) escribe solo en `CandidateInterviewResult`. Requiere **plan de migración**
  (borrado de tabla `RecruitmentCandidateInterviewFeedback` + retiro de usos/endpoints) — fase aparte, no
  ejecutar sin aprobación (§3.7).
- **K.6.2 — Eliminar motivo de decisión; usar solo comentario.** ✅ Se **elimina** el uso de
  `DecisionReasonId` / catálogo `CandidateDecisionReason` en el flujo de respuesta. El entrevistador
  justificará con el campo libre `AdditionalComment` de `CandidateInterviewResult` (y el espejo
  `CandidateApplication.DecisionComment`). Razón: simplificar el formulario único (el usuario lo decidió).
  - **Impacto / migración (plan aparte, §3.7):** `CandidateInterviewResult.DecisionReasonId` deja de usarse
    (opción: hacerlo opcional/nullable o eliminar columna + FK); retirar el select de motivo del frontend;
    `CandidateDecisionReason` queda como catálogo huérfano (evaluar deprecar). `CandidateInterviewFeedback`
    (ya eliminado en K.6.1) también tenía `DecisionReasonId` Required → al desaparecer, sin conflicto.
- **K.6.3 — Formulario único Filtro 2 (respuesta a Reclutamiento):** Decision (enum, select del hub) +
   `AdditionalComment` (único campo libre; sustituye al motivo eliminado en K.6.2) → `CandidateInterviewResult` +
   cierre de `CandidateInterview` + transición de stage. Confirmado como diseño objetivo.

## L. Flujos de acción UI/UX (por actor y pantalla)

> Objetivo: mapear las acciones del sistema desde la vista del usuario (no por entidad), para que el
> sistema sea fluido y práctico, pero cubra las necesidades que venimos arrastrando. Esta sección es
> **diseño/análisis (NO ejecutar)**. Se apoya en las pantallas ya existentes (ver glob de `candidates/`).

### L.1 Actores y matriz de permisos (acción → rol)

| Acción | Reclutador/RRHH (Filtro 1) | Entrevistador (Filtro 2) | Validador Docs | Admin |
|---|---|---|---|---|
| Crear / editar candidato | ✅ | ❌ | ❌ | ✅ |
| Postular a vacante (`CandidateApplication`) | ✅ | ❌ | ❌ | ✅ |
| Pre-filtrar / enviar a entrevista (agendar) | ✅ | ❌ | ❌ | ❌ |
| Responder entrevista (feedback + decisión) | ❌ | ✅ | ❌ | ❌ |
| Procesar alta (R-02) | ✅ (solo en `Seleccionado`) | ❌ | ❌ | ❌ |
| Cargar documentos de contratación (R-03) | ✅ | ❌ | (solo sube) | ❌ |
| Validar documentos (R-03) | ❌ | ❌ | ✅ | ❌ |
| Gestionar catálogos (fuente, turno, docs) | ❌ | ❌ | ❌ | ✅ |

> Nota: los permisos se resuelven por **roles/claims** (F.1), NO por flag de tipo en usuario. El UI
> debe mostrar/ocultar botones según esta matriz. Hoy el doc no la tenía explícita → la agregamos aquí.

### L.2 Mapa de pantallas / bandejas (lo que ya existe)

- **Maestro de candidatos:** `candidate/candidate-list` (+ desktop/mobile), `candidate-form`, `candidate-detail`.
- **Bandeja de postulaciones + KPIs:** `candidate-application/*` (`candidate-application-list`, `-kpis`,
  `candidate-stage-change-modal`, `candidate-process-hiring-modal`).
- **Agenda de Reclutamiento:** `candidate-recruitment-interviews/*` (`CandidateRecruitmentScheduleModal`).
- **Cola del entrevistador:** `candidate-interviewer-queue/*`.
- **Pendientes y respuesta de entrevista:** `candidate-interview/*` (`candidate-interview-pending-list`,
  `-feedback-form`, `-response`, mobile/desktop).
- **Agenda general:** `recruitment-agenda-list`.
- **Candidatos por vacante:** `candidate-work-position-candidates`.
- **Compartido:** `recruitment-shared/*` (`candidate-cv-upload`, badges/stages/labels, timeline).

### L.3 Máquina de estados (transiciones de `CandidateApplicationStage`)

> ✅ **Confirmado 2026-08-14:** `EntrevistaOperaciones` es etapa **OBLIGATORIA** (dos aprobaciones). Aprobado
> desde `EntrevistaReclutamiento` → `EntrevistaOperaciones`; solo un segundo Aprobado desde
> `EntrevistaOperaciones` → `Seleccionado` (coincide con `ResolveDecisionTargetStage` y `CandidateStageValidator`).
> Esto encaja con el modelo de dos filtros: Reclutamiento (Filtro 1) y Entrevistador/Operaciones (Filtro 2).

| De | Acción (actor) | A |
|---|---|---|
| (alta) | Crear candidato + postular | `Nuevo` |
| `Nuevo` | Pre-filtrar (RRHH) | `PreFiltro` |
| `PreFiltro` | Enviar a entrevista (RRHH agenda) | `EntrevistaReclutamiento` |
| `EntrevistaReclutamiento` | Responder (Filtro 2) → Aprobado | `EntrevistaOperaciones` |
| `EntrevistaReclutamiento` | Responder → Rechazado | `Rechazado` |
| `EntrevistaReclutamiento` | Responder → EnEspera | `EnEspera` |
| `EntrevistaReclutamiento` | Responder → NoSePresento | `NoSePresento` |
| `EntrevistaOperaciones` | Responder (Filtro 2, Operaciones) → Aprobado | `Seleccionado` |
| `EntrevistaOperaciones` | Responder → Rechazado | `Rechazado` |
| `EntrevistaOperaciones` | Responder → EnEspera | `EnEspera` |
| `EntrevistaOperaciones` | Responder → NoSePresento | `NoSePresento` |
| `EnEspera` | Reagendar / reevaluar | `EntrevistaReclutamiento` |
| `Seleccionado` | Procesar alta (RRHH) | `AltaEnProceso` |
| `AltaEnProceso` | Documentos validados (Validador) | `Contratado` |
| cualquiera | Archivar | (fuera de pipeline / archive) |

### L.4 Flujos detallados

**Flujo A — Alta de candidato (RRHH)**
1. `candidate-form`: crear/editar; incluye `RecruitmentSource` (R-01, hub `fuente-reclutamiento`).
2. (Opcional) Postular a vacante → `CandidateApplication` (stage `Nuevo`).
3. Editar / Archivar desde `candidate-list`.
- ⚠️ Faltante: **detección de duplicados** (ver L.6).

**Flujo B — Pre-filtro y envío a entrevista (Filtro 1, RRHH)**
1. En bandeja, acción "Pre-filtrar" → `PreFiltro`.
2. "Enviar a entrevista" → `CandidateRecruitmentScheduleModal` (fecha reclutamiento, entrevistador de
   operaciones por `InterviewerMatrix`, comentario) → `EntrevistaReclutamiento` + notifica entrevistador.

**Flujo C — Entrevista y respuesta (Filtro 2, Entrevistador)**
1. Cola `candidate-interviewer-queue` / `candidate-interview-pending-list`.
2. Realizar entrevista → `candidate-interview-feedback-form` / `-response`.
3. Responder: `Decision` (enum hub `candidate-decision`) + `AdditionalComment` (sin motivo, K.6.2) →
   escribe `CandidateInterviewResult`, cierra `CandidateInterview`, transiciona stage (K.3) → notifica RRHH.
4. Reagenda si aplica (`ProposedRescheduleAt` + aprobación, ver L.6).

**Flujo D — Selección y Alta (RRHH)**
1. Tras Aprobado → `Seleccionado`.
2. "Procesar Alta" (solo en `Seleccionado`, G.2) → `candidate-process-hiring-modal` → R-02 **asistente
   multi-paso** (ver L.6) → `ProcessHiringAsync` crea `RequestEmployeeRegister` + esqueleto de `Employee`
   + distribuye datos; stage `AltaEnProceso`.
3. Carga documentos de contratación (R-03).

**Flujo E — Documentación y validación (post-alta, en el expediente del Empleado)**
1. Tras el alta (empleado creado), los documentos de contratación se suben/validan en el **expediente del Empleado**
   (`EmployeeFile`), no en Reclutamiento.
2. Subir / validar documentos (`EmployeeDocument` con `IsValidated`, `ValidatedByUserId`, `ValidationNotes`); el
   componente de carga reutilizable (`candidate-cv-upload`) sirve para CV y para documentos del empleado.
3. Los documentos son un **requisito pendiente** (con recordatorios vía notificaciones), **NO** bloquean `Contratado`.

**Flujo F — KPIs / dashboard (RRHH/Admin)**
- `candidate-application-kpis`: embudo de etapas, tiempos, fuentes.

### L.5 Acciones transversales (notificaciones / automatización)

Ya existen `ICandidateNotificationCoordinatorService`, `IMultiChannelAlertService`,
`ICandidateAutomationService`. Atarlas explícitamente a las transiciones para que el sistema sea fluido:

| Disparador (transición) | Notificación automática |
|---|---|
| B: agendar entrevista | Aviso al entrevistador asignado |
| C: entrevistador responde | Aviso a RRHH (nuevo stage + resultado) |
| D: procesar alta | Aviso a Validador (documentos pendientes) |
| E: documento validado / rechazado | Aviso a RRHH (y al candidato si aplica) |

### L.6 Guía experta — procesos omitidos / optimizables / innecesarios

> Como experto, reviso los flujos anteriores contra las necesidades que venimos arrastrando y señalo
> dónde falta lógica, qué se puede optimizar y qué sobra.

#### L.6.1 OMITIDOS (lógica de proceso que falta y conviene agregar)
1. **Detección de duplicados al crear candidato.** Hoy no se menciona: al dar de alta por email/CURP/RFC
   repetidos se generan candidatos basura en las bandejas. Recomiendo validación previa + sugerencia de
   fusión/liga al existente.
2. **Consentimiento / aviso de privacidad (LFPDPPP / IMSS).** Se capturan CURP, RFC y datos clínicos de
   salud. Falta un paso/checkbox de consentimiento y trazabilidad de cuándo se otorgó. Es omisión de
   cumplimiento, no solo UX.
3. **Reapertura / reagenda con aprobación.** `NoSePresento` suele reagendarse. Falta definir quién aprueba
   la reagenda y la vuelta a `EntrevistaReclutamiento`/`EnEspera`. Hoy `ProposedRescheduleAt` existe pero
   sin flujo de aprobación ni transición clara.
4. **Hand-off al módulo de Empleados.** Tras `Contratado`, el alta solo crea un esqueleto (G.2). Falta
   definir quién completa el `Employee` real (WorkContract, activación en nómina/operaciones). El flujo
   termina "en el aire".
5. **Origen de la postulación (portal vs alta manual RRHH).** Afecta el Flujo A y el campo `Fuente`
   (D1): si hay portal externo de auto-registro, el candidato se crea solo y RRHH solo califica.
6. **Catálogo de "NoSePresento" / motivos de cierre no decisionales.** Con K.6.2 eliminamos el motivo de
   decisión, pero `NoSePresento` suele necesitar un seguimiento (¿reasignar? ¿archivar?). Definir acción.

#### L.6.2 OPTIMIZABLES (lo que existe pero puede fluir mejor)
1. **Alta (R-02) como asistente multi-paso (stepper), no formulón plano.** 30+ campos en una vista = fricción
   y errores. Recomiendo stepper: Datos personales → Dirección → Contacto/Emergencia → Bancarios/Salud →
   Puesto/Turno → Confirmación, con guardado de borrador.
2. **Unificar `CandidateApplication` vs `CandidateProcess`.** G.1 admite que `CandidateProcessAppService` es
   el orquestador real mientras `CandidateApplicationAppService` maneja la bandeja. Riesgo de lógica duplicada
   y dos "procesos" confusos en el UI. Definir una sola fuente de verdad del proceso de contratación para el UI.
3. **Espejo `CandidateApplication` (`DecisionComment`).** K.2 lo mantiene para listas rápidas; pero en vez de
   duplicar desde `CandidateInterviewResult`, el listado puede leer el último resultado (si el join es barato).
   Evaluar para evitar desincronización.
4. **Componente de upload reutilizable.** `candidate-cv-upload` ya existe: reusarlo para CV y para documentos
   de contratación (R-03). No duplicar componente de carga.
5. **Filtros de bandeja compartidos.** `candidate-list`, `candidate-application-list`, `candidate-interviewer-queue`,
   `recruitment-agenda-list` deberían compartir un componente de filtros (stage, fuente, vacante, entrevistador,
   fecha) en vez de 4 implementaciones distintas.

#### L.6.3 INNECESARIOS / A ELIMINAR (ruido en el flujo)
1. **`CandidateInterviewFeedback` (legacy).** K.6.1 ya lo marca eliminar; confirmar retiro total del flujo.
2. **`CandidateDecisionReason` + select de motivo.** K.6.2 elimina el motivo de la decisión → el catálogo
   queda huérfano; deprecar/eliminar y NO mostrar el select en ningún modal (incluido el espejo).
3. **Enum `CandidateInterviewType` como discriminador Reclutamiento/Operaciones.** Sección J: mejor un
   registro de la ocurrencia + aptitud (Opción A). El tipo como enum para separar flujos es innecesario;
   distinguir por etapa/acción.
4. **Campos de auditoría en formularios.** `CreatedAt/By`, `UpdatedAt/By` NO van en ningún formulario (K.2 lo
   nota); confirmar que ningún modal los exponga.
5. **Edición manual de `Fuente` en el alta.** D1: `Fuente` se **copia** desde `Candidate.RecruitmentSource`; el
   UI de alta NO debe permitir editarla (se hereda). Evita edición redundante/inconsistente.

## M. Clarificación de conceptos: crear candidato vs postular vs agendar

> Resuelve la duda planteada: ¿son lo mismo, separados o se unifican?

- **Crear candidato** → entidad maestra `Candidate` (datos del candidato + `RecruitmentSource`). Es el **Paso 1**.
- **Postular a vacante (`CandidateApplication`)** → en el backend **NO** crea una entidad `CandidateApplication`
  aparte; `CandidateApplicationAppService.CreateFromFormAsync` crea un **`CandidateProcess`** que vincula
  `CandidateId` + `RequestPositionId` (vacante abierta) en etapa `Nuevo`. **Esto es el "registro de agenda para
  una vacante abierta"** que menciona el usuario.
- **Pre-filtrar / enviar a entrevista (agendar)** → acciones sobre ese `CandidateProcess`:
  `ScheduleAsync` / `ChangeStageAsync` a `EntrevistaReclutamiento`. El `CandidateApplicationForm` ya permite
  hacer **ambas a la vez** (postular + agendar cita en el mismo submit, ver `CreateFromFormAsync` línea ~838).
  `PreFiltro` es una etapa intermedia manual entre `Nuevo` y `EntrevistaReclutamiento`.

**Conclusión:** son **SEPARADOS** (candidato ≠ proceso/vacante ≠ cita) pero el flujo es secuencial y el UI actual
los combina. Recomiendo **mostrarlos como pasos distintos en el UI** (no ocultar que son 3 objetos) para evitar
la confusión, aunque el submit pueda crear el `CandidateProcess` y agendar en uno solo.

> ⚠️ Naming: `CandidateApplication` (frontend/servicio) vs `CandidateProcess` (backend orquestador).
> **Resuelto 2026-08-14:** `CandidateProcess` es la ÚNICA fuente de verdad del proceso de contratación;
> `CandidateApplication` se deprecia (ver Q.3). Los componentes `candidate-application-*` del frontend pasan
> a operar sobre `CandidateProcess`.

## N. Reglas de negocio de agenda (CERRADAS / confirmadas 2026-08-14 — a implementar en fase aprobada)

> **Cierre:** estas reglas fueron confirmadas por el usuario el 2026-08-14 como el comportamiento obligatorio
> del agendamiento y la respuesta de entrevista. No se ejecutan aún (§3.7); quedan como especificación de
> validación para la fase de implementación. Estado por regla:
> - N.1 Duplicado candidato (tel/email) — **Confirmada (FALTA backend)**.
> - N.2 Misma vacante 1 sola vez — **Confirmada (YA EXISTE)**.
> - N.3 Mismo candidato no 2 entrevistas mismo día — **Confirmada (FALTA)**.
> - N.4 Ventana horaria Lun-Vie 7-17 / Sáb 7-14 / Dom no — **Confirmada (FALTA)**.
> - N.5 `PresentationStartAt` + alta desde esa fecha — **Confirmada (NUEVO CAMPO)**.
> - N.6 Migrar feedback legacy + quitar motivo — **Confirmada (crítica)**.

### N.1 Duplicado de candidato por teléfono/email (nivel `Candidate`) — FALTA
- Regla: no registrar dos `Candidate` con mismo `PhoneNumber` o `Email` (normalizado a minúsculas).
- Hoy `employee-provider-form.ts` ya hace búsqueda previa (`searchExistingPhone` / `searchExistingPerson` y
  `employee-internal/check-duplicate`), pero **falta validación backend al crear `Candidate`**.
- Propuesta: `EnsureCandidateNotDuplicateAsync(phone, email)` → 409 CANDIDATE_DUPLICATE.
- Nota: "dos cves" se interpreta como dos registros/clave de candidato (mismo teléfono o correo).

### N.2 Un candidato no se asigna a la misma vacante más de una vez — ✅ YA EXISTE
- `CandidateProcessAppService.CreateAsync` valida `CandidateId` + `RequestPositionId` con `ClosedAt == null`
  → 409 `CANDIDATE_PROCESS_DUPLICATED` (línea ~804). Cumple la regla.

### N.3 No agendar a un candidato dos entrevistas el mismo día (rango coherente) — FALTA
- `EnsureInterviewSchedulingAllowedAsync` (línea ~1981) hoy solo valida conflicto por **entrevistador**
  (`InterviewerUserId` + `ScheduledAt`), NO por **candidato**.
- Propuesta: agregar validación de `CandidateProcess` activos del mismo `CandidateId` con `ScheduledAt` en el
  mismo día y solapando ventana coherente (p. ej. misma fecha, ±2h) → 409 `CANDIDATE_SCHEDULE_CONFLICT`.

### N.4 Ventana horaria de agendamiento — FALTA
- Regla: Lun–Vie 07:00–17:00; Sáb 07:00–14:00; **Dom prohibido**.
- Hoy `EnsureInterviewSchedulingAllowedAsync` solo valida "no en el pasado". Agregar validación de
  día/hora contra la ventana permitida → 400 `SCHEDULE_OUTSIDE_WINDOW`.

### N.5 Decisión del entrevistador + fecha/hora de presentación a trabajar — NUEVO CAMPO
- Al responder el formulario (Filtro 2) además de `Decision` + `AdditionalComment` (sin motivo, K.6.2) debe
  capturar **`PresentationStartAt`** (fecha y hora en que el candidato se presenta a trabajar).
- Al guardar: notifica a Reclutamiento (ya existe coordinador de notificaciones) y el proceso **queda en
  espera** hasta esa fecha.
- **Disparador del alta (confirmado 2026-08-14):** es **manual**. El usuario va a la lista de empleados /
  vacante abierta y desde ahí dispara la "solicitud de alta", la cual abre el stepper (P). El botón se
  habilita solo desde `PresentationStartAt` (fecha de presentación). No hay job automático.
- Conecta con L.6.3.4 (campos de auditoría fuera de formularios) y L.6.1.4 (hand-off a empleados).

### N.6 Migración de la respuesta de entrevistador (confirmada 2026-08-14)
- **Fuente de verdad:** `CandidateProcessAppService.ExecuteInterviewerActionAsync` (nuevo). El frontend
  `candidate-interview-feedback-form.ts` debe migrarse a este endpoint (hoy usa el legacy `SubmitFeedbackAsync`).
- **Eliminar motivo por completo (K.6.2 confirmado):** quitar `decisionReasonId` de `ExecuteInterviewerActionAsync`
  (incl. `REASON_REQUIRED`), de `SubmitFeedbackAsync` y del catálogo `CandidateDecisionReason` (deprecar). El
  formulario envía solo `Decision` + `AdditionalComment` + `PresentationStartAt`.
- **Deprecar/eliminar** el servicio legacy `CandidateInterviewAppService` (`[Obsolete]`) y la entidad
  `CandidateInterviewFeedback` (K.6.1), alineado a `CandidateProcess` como única fuente de verdad (Q.3).

## O. Análisis del proceso de Alta actual (robustecer con R-02)

> El usuario pide analizar "lo básico que está actualmente" (`employee-provider-form.html`) y robustecerlo
> con los requerimientos anteriores (R-02). Análisis, NO ejecutar.

### O.1 Lo que hay hoy (dos entradas de alta distintas)
- **(a) `employee-provider-form` (supplier.luxuryapp):** registra empleado directo
  (`createEmployee`/`createEmployeeExternal`) y luego opcionalmente `solicitudAlta` (RequestEmployeeRegister)
  con datos mínimos (`positionRequestId`, `typeContractRegister`, `boss`, `customerAddress`,
  `additionalInformation`). Fase 1 solo captura nombre/apellidos/tel/birth/email/role/foto + detección de
  duplicados. Pre-llena desde candidato aprobado (`vacancyCandidates`).
- **(b) Reclutamiento `CandidateProcessAppService.ProcessHiringAsync`:** desde `Seleccionado`, crea
  `RequestEmployeeRegister` + esqueleto de `Employee` (PersonData/Address vacíos) y copia `Fuente` (D1).

### O.2 Brechas frente a R-02 (de G.3)
- El alta hoy **NO distribuye** bancarios, clínicos, emergencia/beneficiario, ni `WorkPosition.TurnoTrabajo`,
  ni documentos de contratación (R-03).
- `employee-provider-form` Fase 1 omite dirección, bancarios, salud, emergencia, beneficiario y fuente.
- Ambas entradas de alta son **disjuntas** y podrían duplicar lógica; conviene unificar criterio.

### O.3 Propuesta de robustecimiento (sin ejecutar)
- Unificar en un **asistente de alta (stepper, ver L.6.2)** que recoja todos los campos R-02 y los distribuya a
  `PersonData`, `Address`, `EmployeeBankData`, `EmployeeClinicalData`, `EmployeeEmergencyContact`
  (beneficiario, D3), `Employee`, `WorkPosition.TurnoTrabajo`, y copie `Fuente` → `RequestEmployeeRegister.Fuente` (D1).
- **Disparar el alta desde `PresentationStartAt` (N.5)**, no al momento de la decisión.
- Envolver la distribución en **transacción atómica** (G.3).
- El alta de Reclutamiento parte de `CandidateProcessAppService.ProcessHiringAsync` (desde `Seleccionado`),
  **NO** del formulario `employee-provider-form` (ese es para `EmployeeExternal`/ExternalStaff, personal que
  **nunca** entra a Reclutamiento — ver O.5). Expandir `ProcessHiringAsync` con las secciones R-02, no reusar
  el de proveedor.
- Considerar **consentimiento de privacidad** (L.6.1.2) en la Fase 1 (captura CURP/RFC/datos clínicos).

### O.4 Estado
- (a) y (b) coexisten; se recomienda definir una sola fuente de verdad del alta (ver L.6.2.2) antes de ampliar
  campos, para no duplicar la orquestación.

### O.5 Aclaración de nombres: `employee-provider-form` / `EmployeeExternal` NO son Reclutamiento
- `EmployeeExternal` (tabla `ExternalStaff`) = personal externo/subcontratado vinculado a un `Provider`
  (`ProviderId`); **no** pasa por `CandidateProcess` ni por el alta de Reclutamiento.
- `employee-provider-form` (supplier.luxuryapp) registra ese personal externo (`createEmployeeExternal` /
  `solicitudAlta` de otro dominio). La Fase 1 de ese formulario (registro de persona + detección de duplicados)
  es útil como **patrón**, pero su entidad y flujo son distintos al alta de Reclutamiento.
- El análisis de robustecimiento del **ALTA de Reclutamiento** se hace sobre `ProcessHiringAsync` y el stepper
  del `CandidateProcess`. Si algún componente de Reclutamiento se nombró "provider" por error, conviene
  renombrar en la fase de limpieza (no mezclar dominios).

## P. Stepper de Alta R-02 (diseño detallado — NO ejecutar)

> Propósito: capturar todos los datos del empleado (R-02) divididos en pasos en lugar de un formulón plano
> (L.6.2.1), y distribuirlos a las entidades reales (G.3) en una transacción atómica. Dominio Reclutamiento
> (no ExternalStaff, ver O.5).
>
> **Disparador (confirmado 2026-08-14):** **manual**, desde la lista de empleados / vacante abierta
> ("solicitud de alta") que abre el stepper. El botón se habilita solo desde `PresentationStartAt` (N.5) y con
> `CandidateProcess.CurrentStage == Seleccionado` (G.2). Pre-llena pasos 1 y 3 desde `Candidate`.
> **DTO de transporte:** `SolicitudAltaCompletaDto` (nuevo, G.3) → `ProcessHiringAsync` distribuye.

### P.1 Paso 1 — Datos personales (→ `ApplicationUser` / `PersonData`)
| Campo R-02 | Destino | Origen precarga |
|---|---|---|
| FirstName / LastNamePaterno / LastNameMaterno | `ApplicationUser` (+ `Employee`) — D2 | `Candidate` |
| BirthDate | `PersonData.Birth` | `Candidate.BirthDate` (si existe) |
| Age | derivable de BirthDate | automático |
| NSS | `PersonData.NSS` | — |
| RFC | `PersonData.RFC` | — |
| CURP | `PersonData.Curp` | — |
| Folio / RequestDate | `RequestEmployeeRegister` | **generados por el sistema** (no se capturan) |

> Validación: RFC/CURP con formato MX; CURP única por Customer.
> **Consentimiento de privacidad (L.6.1.2, resuelto):** check obligatorio "Acepto aviso de privacidad" +
> `PrivacyConsentAt` (fecha) capturado en este paso al manejar CURP/RFC/datos clínicos; se persiste en la
> solicitud de alta / `CandidateProcess`.

### P.2 Paso 2 — Dirección (→ `Address`)
| Campo R-02 | Destino (`Address`) |
|---|---|
| StreetAddress | Street |
| Colonia | District |
| Municipio | TownHall |
| PostalCode | ZIPCode |
| Estado | City/State |

> Se crea un `Address` nuevo (compartido System/Catalogs vía `Employee.AddressId`).

### P.3 Paso 3 — Contacto / Emergencia / Beneficiario
| Campo R-02 | Destino |
|---|---|
| Phone | `PersonData.LocalPhone` (o `Candidate.PhoneNumber`) |
| Email | `ApplicationUser.Email` |
| EmergencyContactName / Phone / Relation | `EmployeeEmergencyContact` (flag emergencia) |
| BeneficiaryName / Phone / Relation | `EmployeeEmergencyContact` (flag beneficiario) — D3 |

> Precarga Phone/Email desde `Candidate`. Beneficiario y emergencia conviven en la misma entidad con flags.

### P.4 Paso 4 — Bancarios / Salud
| Campo R-02 | Destino |
|---|---|
| BankName / AccountNumber / Clabe | `EmployeeBankData` |
| TakesControlledMedication | `EmployeeClinicalData` |
| HasMedicationAllergy | `EmployeeClinicalData` |
| ChronicDiseases | `EmployeeClinicalData` |

### P.5 Paso 5 — Puesto / Turno / Empresa (→ `WorkPosition`, `RequestEmployeeRegister`, `Employee`)
| Campo R-02 | Destino |
|---|---|
| Position (vacante) | `WorkPosition` (JobPositions) |
| ContractType | `RequestEmployeeRegister.TypeContractRegister` / `WorkContract` |
| Shift (Turno) | `WorkPosition.TurnoTrabajo` (enum `TurnoTrabajo`, hub `turno-trabajo`) |
| Company | `Customer` asociado |
| HireDate | `Employee.DateAdmission` (sugiere default = `PresentationStartAt`) |
| SalaryQnal | `Employee.Salary` |
| WorkAddress | `Address` (otra) / `WorkContract` |
| **Fuente** | `RequestEmployeeRegister.Fuente` — **auto-copia** de `Candidate.RecruitmentSource` (D1); NO editable |

### P.6 Paso 6 — Confirmación
- Resumen de lo capturado por paso (solo lectura).
- Botón "Confirmar alta" → `ProcessHiringAsync`:
  - Crea/actualiza `ApplicationUser`, `Employee`, `PersonData`, `Address`, `EmployeeBankData`,
    `EmployeeClinicalData`, `EmployeeEmergencyContact` (×2 flags), `RequestEmployeeRegister`, y setea
    `WorkPosition.TurnoTrabajo`.
  - Copia `Candidate.RecruitmentSource` → `RequestEmployeeRegister.Fuente` (D1).
  - **Transacción atómica** (G.3).
  - Transiciona `CandidateProcess` a `AltaEnProceso` y luego documentos en el expediente del Empleado (R-03 / Flujo E, **post-alta**, no bloquea `Contratado`).

### P.7 Consideraciones de UI/UX
- Cada paso valida antes de "Siguiente"; permitir "Atrás" y **guardar borrador** (no perder 30+ campos).
- Stepper reutilizable en móvil y desktop (ya hay variantes `.mobile`/`.desktop` en el módulo).
- Componente de upload reutilizable (`candidate-cv-upload`) para los documentos de R-03 del Flujo E.
- Estados/permisos: solo Reclutador (L.1) puede Iniciar alta; validador solo documentos.

### P.8 Estado
- Diseño detallado cerrado como propuesta. Implementación pendiente de **plan de fase aprobado** (§3.7),
  incluida la migración D6 (renombre `RecruitmentCandidate*`) y la creación de `SolicitudAltaCompletaDto`.

## Q. Re-análisis del flujo actual — discrepancias y pendientes

> Revisión de código real (backend) contra lo documentado. Objetivo: detectar divergencias y deudas.

### Q.1 Discrepancias (código vs diseño documentado)
- **D1 — `EntrevistaOperaciones` es OBLIGATORIA en el código (no opcional).** `ResolveDecisionTargetStage`
  (línea ~1386): Aprobado desde `EntrevistaReclutamiento` → `EntrevistaOperaciones` (NO a `Seleccionado`);
  solo un segundo Aprobado desde `EntrevistaOperaciones` → `Seleccionado`. `CandidateStageValidator`
  (línea ~19-22) también lo exige. **Contradice L.3 / K.3 / K.4** (que dicen Aprobado → `Seleccionado`
  directo). La sección L.3 está desactualizada: el flujo real tiene **dos aprobaciones**.
- **D2 — `CandidateStageValidator` está muerto para decisiones.** `RegisterDecisionAsync` (línea ~1087)
  asigna `CurrentStage` directo, sin llamar al validador; este solo se usa en `ChangeStageAsync`. Riesgo de
  deriva de la máquina de estados.
- **D3 — Dos caminos de respuesta de entrevistador (deuda).** El frontend `candidate-interview-feedback-form.ts`
  usa `CandidateInterviews.submitFeedback` → `CandidateInterviewAppService.SubmitFeedbackAsync`, servicio
  marcado `[Obsolete]`. Existe además `CandidateProcessAppService.ExecuteInterviewerActionAsync` (nuevo).
- **D4 — El motivo de decisión AÚN se requiere en el código (contradice K.6.2).** Tres sitios:
  `SubmitFeedbackAsync` (línea ~34), `ExecuteInterviewerActionAsync` (`REASON_REQUIRED`, línea ~1130), y el
  catálogo `CandidateDecisionReason` sigue activo. K.6.2 aún no se implementa.
- **D5 — Solapamiento de candidato (N.3) solo en ruta legacy.** `CreateInterviewAsync` (~251) tiene
  `INTERVIEW_OVERLAP` (±1h) pero la ruta canónica `ScheduleAsync`/`ChangeStageAsync` →
  `EnsureInterviewSchedulingAllowedAsync` (~1981) SOLO valida por entrevistador. N.3 debe moverse ahí.
- **D6 — Ventana horaria (N.4) no implementada en ninguna ruta** (solo "no en pasado").
- **D7 — `PresentationStartAt` NO existe** en `CandidateProcess` (campo nuevo, N.5). Confirmado pendiente.
- **D8 — `CandidateApplication` vs `CandidateProcess` coexisten** con puente `CandidateId`+`RequestPositionId`
  (ver M). Falta decidir fuente de verdad.
- **D9 — "Confirmación de recepción" (`ConfirmedAt`/`ReceptionConfirmedAt`) existe en código (~46, ~432) pero
  no está modelado como paso en L.4 C.** Definir si es un paso explícito.
- **D10 — L.3 (máquina de estados) desactualizada** vs validador real. Corregir.
- **D11 — `ExecuteInterviewerActionAsync.SubmitFeedback` hardcodea `Decision = EnEspera`** (línea ~1141)
  aunque el frontend envía la decisión real. Revisar si es acción parcial o bug.

### Q.2 Qué falta por revisar y definir (pendientes)
1. D1/Q.1: ¿`EntrevistaOperaciones` obligatoria o directo a `Seleccionado`? (afecta L.3, K.3, K.4)
2. D3/Q.2: Consolidar un solo camino de respuesta de entrevistador.
3. D4/Q.3: Confirmar eliminación total del motivo + limpieza de 3 sitios y catálogo.
4. D5/D6/Q.4: Implementar N.3 (solapamiento candidato) y N.4 (ventana) en `EnsureInterviewSchedulingAllowedAsync`.
5. D7/Q.5: Diseñar `PresentationStartAt` + mecanismo de disparo de alta.
6. D8/Q.6: Decidir fuente de verdad `CandidateApplication` vs `CandidateProcess`.
7. D9: Modelar "confirmación de recepción" si aplica.
8. D11: Aclarar `ExecuteInterviewerActionAsync.SubmitFeedback`.
9. L.6.1.4: hand-off a módulo de Empleados tras `Contratado`.
10. L.6.1.2: consentimiento de privacidad en alta.

### Q.3 Resolución de preguntas (confirmadas 2026-08-14)
1. **Entrevista Operaciones = OBLIGATORIA.** Se mantiene el flujo de dos aprobaciones
   (Reclutamiento → EntrevistaOperaciones → Seleccionado). Actualiza L.3 y K.3; `CandidateStageValidator` y
   `ResolveDecisionTargetStage` ya son coherentes con esto.
2. **Respuesta de entrevistador → `ExecuteInterviewerActionAsync`.** Deprecar el legacy
   `CandidateInterviewAppService.SubmitFeedbackAsync` (y la entidad `CandidateInterviewFeedback`). El frontend
   migra a `ExecuteInterviewerActionAsync` (ver N.6).
3. **Motivo de decisión → ELIMINAR TODO.** Quitar de `ExecuteInterviewerActionAsync`, `SubmitFeedbackAsync` y
   deprecar catálogo `CandidateDecisionReason` (K.6.2 plenamente confirmado).
4. **Alta = MANUAL desde lista de empleados / vacante abierta** ("solicitud de alta" abre el stepper P). El
   botón se habilita desde `PresentationStartAt` (N.5). Sin job automático.
5. **Fuente de verdad = `CandidateProcess`.** `CandidateApplication` se deprecia (ver M).

### Q.4 Resolución de pendientes (2026-08-14, respuestas del usuario)
- **N.3 / N.4 — SÍ implementar.** El solapamiento de candidato (mismo día, rango coherente) y la ventana
  horaria (Lun–Vie 7–17, Sáb 7–14, Dom no) se implementan en `EnsureInterviewSchedulingAllowedAsync`
  (ruta canónica `ScheduleAsync`/`ChangeStageAsync`), no solo en la legacy `CreateInterviewAsync`.
- **`PresentationStartAt` (N.5) — SÍ.** Campo nuevo en `CandidateProcess`; el botón "solicitud de alta" se
  habilita desde esa fecha. Diseño en N.5 / P.
- **D11 — Acordado.** Corregir que `ExecuteInterviewerActionAsync.SubmitFeedback` hardcodea
  `Decision = EnEspera`; debe respetar la decisión real del formulario, ya que esta es la ruta fuente de
  verdad (Q.3.2).
- **L.6.1.4 (hand-off a Empleados) — Ya resuelto por el código actual.** `ResolveOrCreateEmployeeIdAsync`
  reusa/reactiva el `ApplicationUser` y `Employee` por `Customer` (Cliente): si ya existe para ese cliente, no
  crea usuario nuevo, solo lo vincula a la nueva vacante. No requiere trabajo extra, solo documentar.
- **D9 — Resuelto:** NO es necesario como paso/acción separada. La decisión ya codifica asistencia
  (`NoSePresento` = no asistió; Aprobado/Rechazado/EnEspera = asistió). La **fecha de la respuesta** ya
  queda en `DecisionSentAt` (marcado al enviar la decisión). `ReceptionConfirmedAt`/`ConfirmedAt`
  (confirmación de recepción) se marcan **obsoletos / sin UI**; su borrado de BD es tarea de migración
  (usuario). No se repropósito.
- **D2 — Resuelto:** `RegisterDecisionAsync` debe validar con `CandidateStageValidator` (única fuente de
  verdad de transiciones), eliminando la lógica duplicada.
- **L.6.1.2 — Resuelto:** SÍ se agrega check "Acepto aviso de privacidad" + fecha en Paso 1 del stepper (P.1).

> **Nota de comunicación (idioma):** el usuario prefiere que, en la conversación, los nombres de tablas y
> procesos se expresen en **español** (el código fuente sigue en inglés según convenciones). En adelante se
> usará, p. ej., "tabla `CandidateProcess` (Proceso de Candidato)", "solicitud de alta", "etapa Entrevista
> Operaciones", etc.

## R. Auditoría de nombres / dominios (Reclutamiento) — hallazgos

> Revisión de componentes/servicios del módulo frente a la decisión Q.3.5 (`CandidateProcess` = única fuente
> de verdad; `CandidateApplication` se deprecia) y la aclaración O.5 (`EmployeeExternal`/proveedor es otro
> dominio). Documentación, NO ejecutar renombres sin plan de fase (§3.7).

### R.1 — Confusión de dominio "provider" (HALLAZGO PRINCIPAL)
- `candidate-recruitment-interviews.ts` → `openAltaForm` (línea ~170) abre **`EmployeeProviderForm`**
  (de `supplier.luxuryapp/provider`), que es del dominio **ExternalStaff / Proveedor** (`EmployeeExternal`,
  tabla `ExternalStaff`), **NO de Reclutamiento**.
- **Verificación 2026-08-14:** `EmployeeProviderForm` solo tiene un uso activo fuera de su módulo:
  `candidate-recruitment-interviews.ts` (`openAltaForm`, línea 176). Los componentes de
  `recursos-humanos.luxuryapp/.../hr-employees` son **migración antigua inconclusa** (confirmado por el
  usuario) → **se omiten**, no son fuente de verdad. El alta de Reclutamiento está cableada al form de
  proveedor vía el board de Reclutamiento; el stepper (P) la reemplaza en ese `openAltaForm`.
- O sea: el "Alta de Candidato" de Reclutamiento hoy está cableado al formulario de proveedor. Esto contradice
  O.5 (proveedor nunca entra a Reclutamiento).
- **Decisión:** reemplazar `openAltaForm` para que abra el **stepper de alta (P)** sobre `CandidateProcess` /
  `ProcessHiringAsync`, y **eliminar la dependencia** de Reclutamiento hacia `EmployeeProviderForm`. El form
  de proveedor queda solo para su dominio.

### R.2 — Componentes `candidate-application-*` mal nombrados vs fuente de verdad
- `candidate-application-list`, `candidate-application-form`, `candidate-application-kpis`,
  `candidate-stage-change-modal`, `candidate-process-hiring-modal` dicen "application" pero operan sobre el
  **Proceso de Candidato** (`CandidateProcess`). Con Q.3.5, deberían llamarse `candidate-process-*` (o
  aclararse). Renombrar requiere migración de rutas/imports.
- `CandidateApplicationAppService` (servicio) y entidad `CandidateApplication` → **deprecar** (M/Q.3.5).

### R.3 — Enum `CandidateApplicationStage` (etapas del pipeline)
- Nombre histórico "Application"; hoy la fuente de verdad es el Proceso. Ideal: `CandidateProcessStage`.
- Usado en muchos lados (badges, timeline, labels, modals). Renombrar = migración amplia. **Recomendación:**
  dejar el nombre de la etapa (es aceptable como "etapa de la postulación/proceso") y solo renombrar los
  componentes/servicios de UI que dicen "application" refiriéndose al proceso (R.2).

### R.4 — Identificador `candidateApplicationId` en frontend
- Muchos componentes usan `focusedCandidateApplicationId` / `candidateApplicationId` para referirse al proceso
  (p. ej. `candidate-work-position-candidates.ts`, `candidate-recruitment-interviews.ts`). Con `CandidateProcess`
  como fuente de verdad debería ser `candidateProcessId`. El backend ya acepta ambos
  (`ResolveProcessFromIdentifiersAsync`), pero el frontend debe migrar a `candidateProcessId`.

### R.5 — Legacy a deprecar (ya en N.6 / K.6.1)
- `CandidateInterviewAppService` (`[Obsolete]`), entidad `CandidateInterviewFeedback`, catálogo
  `CandidateDecisionReason` (K.6.2). Deben desaparecer del flujo; reemplazados por `CandidateProcess`
  (`ExecuteInterviewerActionAsync`) y `AdditionalComment`.

### R.6 — Grupos de endpoints
- `api/recruitment-candidate-applications` (legacy) vs `api/recruitment-candidate-processes` (orquestador).
  Deprecar el grupo "applications" a favor de "processes".

### R.7 — `EmployeeProviderForm` está BIEN nombrado para su dominio
- No renombrar el form de proveedor; el problema es que Reclutamiento lo invoca (R.1). Corregir la dependencia,
  no el nombre.

### R.8 Estado / siguientes pasos de nombres
- Los renombres (R.2, R.4, R.6) y deprecaciones (R.2 servicio, R.5) se ejecutan en la **fase de migración**
  aprobada (§3.7), no ahora. Lo urgente es R.1 (desacoplar Reclutamiento del form de proveedor) porque es un
  error de dominio activo en el flujo de alta.

### R.9 Regla: transiciones de etapa automáticas (aclaración del usuario, 2026-08-14)
- Las etapas del pipeline (`CandidateApplicationStage`) deben avanzar **automáticamente según las acciones del
  flujo** (pre-filtro, agendar, decisión del entrevistador, alta) y **NO deben moverse manualmente** por
  ningún usuario.
- Consecuencia: el `candidate-stage-change-modal` (cambio manual libre de etapa) debe **deprecarse/eliminarse**;
  la etapa es consecuencia de las acciones Filtro 1 / Filtro 2, no un valor que se fije a mano.
- Excepción permitida: acciones de negocio que implícitamente cambian etapa (p. ej. RRHH "Pre-filtro" o
  "Enviar a entrevista" son acciones que disparan la transición, no un selector libre de etapa).

## S. Borrador de plan por fases (§3.7 — pendiente de aprobación, NO ejecutar)

> Reúne lo acordado en A–R en fases ejecutables. Cada fase requiere aprobación antes de ejecutarse. Las
> migraciones de BD las maneja el usuario (§3.7 / Data Migration Protocol). Código en inglés; discusión en español.

### Fase 0 — Desacoplar dominio erróneo y transiciones automáticas
- **R.1:** `candidate-recruitment-interviews.ts` → `openAltaForm` deja de abrir `EmployeeProviderForm`
  (ExternalStaff); abre el **stepper de alta (P)** sobre `CandidateProcess` / `ProcessHiringAsync`. Eliminar
  la dependencia a `supplier.luxuryapp/provider`.
- **R.9:** deprecar/eliminar `candidate-stage-change-modal` (cambio manual libre de etapa); la etapa es
  automática por acciones.
- Los componentes de `recursos-humanos/.../hr-employees` se omiten (migración antigua inconclusa).

### Fase 1 — Reglas de agenda + respuesta de entrevistador
- **N.1:** backend anti-duplicado de `Candidate` por tel/email (`EnsureCandidateNotDuplicateAsync`).
- **N.3:** solapamiento de candidato (mismo día, rango coherente) en `EnsureInterviewSchedulingAllowedAsync`.
- **N.4:** ventana horaria (Lun–Vie 7–17, Sáb 7–14, Dom no) en `EnsureInterviewSchedulingAllowedAsync`.
- **N.5:** campo `PresentationStartAt` en `CandidateProcess`; habilitar botón de alta desde esa fecha.
- **N.6 / K.6.1 / K.6.2:** migrar respuesta a `ExecuteInterviewerActionAsync`; eliminar `decisionReasonId` en 3
  sitios; deprecar catálogo `CandidateDecisionReason`, servicio legacy `CandidateInterviewAppService` y entidad
  `CandidateInterviewFeedback`.
- **D11:** corregir hardcodeo `Decision = EnEspera` en `ExecuteInterviewerActionAsync.SubmitFeedback`.
- **D2:** `RegisterDecisionAsync` valida con `CandidateStageValidator`.

### Fase 2 — Stepper de alta R-02
- **P (pasos 1–6)** sobre `CandidateProcess` / `ProcessHiringAsync`; distribución atómica a `PersonData`,
  `Address`, `EmployeeBankData`, `EmployeeClinicalData`, `EmployeeEmergencyContact` (D3), `Employee`,
  `WorkPosition.TurnoTrabajo`; copia `Fuente` → `RequestEmployeeRegister.Fuente` (D1).
- **L.6.1.2:** check "Acepto aviso de privacidad" + `PrivacyConsentAt` en Paso 1.
- **D9:** `ReceptionConfirmedAt`/`ConfirmedAt` obsoletos (sin UI); fecha de respuesta ya en `DecisionSentAt`.
- **U (Documentos):** Candidato = solo CV. Crear entidad `EmployeeDocument` (FK `EmployeeId`, enum
  `RecruitmentDocumentType`; **CustomDocument descartado**) post-hire. El alta **no** obliga subirlos; tras el alta
  se pregunta Sí/Parcial/No y se cargan en el expediente como requisito pendiente (no bloquea `Contratado`).

### Fase 3 — Renombres / deprecaciones (fuente de verdad `CandidateProcess`)
- **R.2:** renombrar componentes `candidate-application-*` → `candidate-process-*`; deprecar
  `CandidateApplicationAppService` + entidad `CandidateApplication`.
- **R.4:** `candidateApplicationId` → `candidateProcessId` en frontend.
- **R.6:** deprecar grupo `recruitment-candidate-applications` a favor de `recruitment-candidate-processes`.
- **R.3:** dejar nombre enum `CandidateApplicationStage` (etapa del pipeline); no renombrar masivamente.

### Fase 4 — Notificaciones (convención + gaps + limpieza)
> Depende de Fase 1 (feedback/K.6.2), Fase 2 (alta) y Fase 3 (R.2). Ver sección T.
- **T.3.1 (Gap):** agregar `NotifyProcessHiringStartedAsync` (inicio de alta → Validador/HR con link a
  documentos) y `NotifyProcessDocumentValidatedAsync` / `NotifyProcessDocumentRejectedAsync` (o
  `NotifyProcessDocumentStatusChangedAsync`) para cubrir L.5 D/E.
- **T.5 (Convención de asuntos):** centralizar `BuildSubject(direction, event, process, decision)` con los
  prefijos `LBG - AGENDA PARA VACANTE {folio}` (Reclutamiento→Entrevistador) y
  `{Cliente} | CANDIDATO {folio} {Decision}` (Entrevistador→Reclutamiento, decisión = `Display(Name)` del enum
  en español). Aplicar a email + in-app + Slack (mismo `title`). Revisar cuerpos de `IRecruitmentEmailService`.
- **T.3.4:** quitar `decisionReasonName` de `NotifyProcessInterviewFeedbackSubmittedAsync` (K.6.2/N.6).
- **T.3.2 / T.3.3:** al ejecutar R.2, eliminar los métodos "Application" duplicados de
  `CandidateNotificationCoordinatorService` y de `ICandidateNotificationCoordinatorService`.

### Fase 5 — Validaciones finales y documentación
- **KPIs (X):** renombrar `candidate-application-kpis`→`candidate-process-kpis` + DTO (R.2); añadir KPIs de
  alta/documentación pendiente y tiempo de contratación (X.3.1/X.3.2). Bandejas apuntan a `CandidateProcess`.
- Filtros de bandeja compartidos (L.6.2.5).
- Documentar en `CONVENTIONS.md` / docs según corresponda.
- **Separado:** D6 (renombre `RecruitmentCandidate*`) = migración mayor, fase dedicada.

### Fase 6 — Nuevos requerimientos (W) — definidos 2026-08-14
- **W.1:** notificación al cargar documentos desde el entrevistador → Reclutamiento (`NotifyInterviewerDocumentUploadedAsync`,
  asunto T.5). Storage físico en `private/rrhh/employees/{employeeId}/documents` (CONVENTIONS); BD guarda solo
  nombre de archivo; entidad `EmployeeDocument`.
- **W.2:** **Alta directa sin candidato**: entrada que crea `Employee` vía `ProcessHiringAsync` sin `Candidate`;
  el stepper R-02 se abre directo. `ProcessHiringAsync` debe soportar sin candidato.
- **W.3:** **Bandeja nueva dedicada** `recruitment-alta-tracking` (filtrada por `AltaEnProceso` + documentos
  pendientes de `EmployeeDocument`).

### Estado
- Borrador. **Pendiente de aprobación** para iniciar Fase 0. Ninguna ejecución hasta entonces (§3.7).

## T. Verificación del sistema de notificaciones

> Confronta la estructura/requerimientos reales (interfaz + implementación) contra el diseño L.5. Análisis, NO ejecutar.

### T.1 Estructura actual
- Coordinador `CandidateNotificationCoordinatorService` implementa `ICandidateNotificationCoordinatorService`.
- **3 canales:** In-App/Push (`INotificationDispatcher`; `CandidateChannels = InApp, Push, PushWeb`),
  Email (`IRecruitmentEmailService`) y Slack/Teams (`IMultiChannelAlertService.SendAlertAsync`, webhooks).
- **Destinatarios** resueltos por rol/cliente: responsables del cliente (`GetApplicationStakeholdersAsync`),
  reclutadores (`GetRecruitersAsync`), operaciones + entrevistadores (`GetOperationsStakeholdersRecruitersAndInterviewersAsync`),
  entrevistador asignado. URLs de acción a la app (`RecruitmentInterviewsUrl`, `WorkPositionCandidatesUrl`, `InterviewerResponseUrl`).
- Existe un **segundo juego de métodos por `candidateApplicationId`** que solo delegan a los de `candidateProcessId`
  (p. ej. `NotifyApplicationCreatedAsync` → `NotifyProcessCreatedAsync`). Refleja la duplicidad `CandidateApplication`/`CandidateProcess` (R.2).

### T.2 Cobertura vs flujo (L.5)
| Transición (L.5) | Método existente | Estado |
|---|---|---|
| Proceso creado / postulación | `NotifyProcessCreatedAsync` | ✅ existe y se usa (`CreateFromFormAsync`) |
| Agenda pendiente / recordatorio / vencida / escalado (Ops) | `NotifyProcessOperationsInterview*Async` | ✅ (automatización/jobs) |
| Enviar a entrevista Operaciones | `NotifyProcessSentToOperationsInterviewAsync` | ✅ |
| Agendar/reagendar cita (Filtro 1) | `NotifyProcessInterviewScheduledAsync` | ✅ (en `ScheduleAsync`) |
| Cancelar cita | `NotifyProcessInterviewCancelledAsync` | ✅ (en `CancelScheduleAsync`) |
| Confirmación de recepción | `NotifyProcessReceptionConfirmedAsync` | ✅ (en `SubmitFeedback`) |
| Feedback/decision (Filtro 2 → RRHH) | `NotifyProcessInterviewFeedbackSubmittedAsync` | ✅ (en `SubmitFeedback`) |
| Decisión revertida | `NotifyProcessInterviewDecisionRevertedAsync` | ✅ |
| **L.5 D: procesar alta → aviso a Validador (docs pendientes)** | — | ❌ **FALTA** |
| **L.5 E: documento validado/rechazado → RRHH + candidato** | — | ❌ **FALTA** |

### T.3 Hallazgos / deuda
- **T.3.1 (Gap):** faltan notificaciones del alta de empleado. Proponer `NotifyProcessHiringStartedAsync`
  (inicio de alta → Validador/HR con link a documentos) y `NotifyProcessDocumentValidatedAsync` /
  `NotifyProcessDocumentRejectedAsync` (o `NotifyProcessDocumentStatusChangedAsync`).
- **T.3.2 (Duplicidad):** métodos "Application" solo delegan a los "Process"; al deprecar `CandidateApplication`
  (R.2) se eliminan.
- **T.3.3:** los métodos "Application" están en la interfaz; al limpiar R.2 hay que quitarlos también de `ICandidateNotificationCoordinatorService`.
- **T.3.4:** `NotifyProcessInterviewFeedbackSubmittedAsync` recibe `decisionReasonName`. Con K.6.2 (eliminar
  motivo) ese parámetro debe quitarse de la firma y del cuerpo del email al migrar (N.6).

### T.4 Recomendación
- Mantener la estructura de 3 canales; solo **agregar los 2 métodos faltantes (T.3.1)** y **eliminar los
  duplicados "Application" (T.3.2/3.3)** al ejecutar R.2. Ajustar firma de feedback (T.3.4) en N.6.
- **Implementar la convención de asuntos por dirección (T.5).**

### T.5 Convención de asuntos / dirección (requerimiento 2026-08-14, resuelto)
- El **asunto del email** y el **título in-app/Slack** siguen una convención por **dirección del evento**
  (aplica a los 3 canales, pues el mismo `title` los alimenta):
  - **Reclutamiento → Entrevistador:** `LBG - AGENDA PARA VACANTE {FolioVacante}` (+ sufijo de evento:
    PROGRAMADA / RECORDATORIO / CANCELADA / VENCIDA / ESCALADA). `LBG` = marca del grupo (Luxury Building
    Group), ya usada en la app.
  - **Entrevistador → Reclutamiento:** `{NombreCortoCliente} | CANDIDATO {FolioVacante} {Decision}`, con
    `Decision` = `CandidateDecision.GetDisplayName()` en español → **Aprobado / En espera / Rechazado /
    No se presento** (confirmado: usar el `Display(Name)` del enum, no textos libres). Eventos de RRHH no
    decisión usan sufijo coherente: `RECEPCIÓN CONFIRMADA` / `DECISIÓN REVERTIDA`.
  - **Interno (Reclutamiento → RRHH / Operaciones / stakeholders):** variante coherente, p. ej.
    `LBG - {Evento} | {NombreCortoCliente} | VAC {FolioVacante}`.
  - `CANDIDATO` = solo `{FolioVacante}` (confirmado).
- **Tokens disponibles hoy:** `LBG` (constante/marca), `Customer.NombreCorto` (`GetCustomerName`, línea 837),
  `GetVacancyFolio` (línea 830), `GetCandidateName`, `CandidateDecision`.
- **Estado:** los títulos actuales (líneas 41–515) son genéricos y **NO cumplen** la convención. Centralizar
  un `BuildSubject(direction, event, process, decision)` y reemplazar los `title`; al corregirlo se corrigen
  los 3 canales.
- **Cuerpo coherente:** el contenido debe ser coherente al evento (agendada → fecha/hora/puesto; decisión →
  decisión + comentario). Revisar plantillas de `IRecruitmentEmailService` (DTOs).

## U. Análisis del flujo de documentos (R-03) — 2026-08-14

> Confronta C, L.4 (Flujo E) y P contra el principio confirmado: **Candidato = solo CV; Empleado = todos los
> demás documentos**. Análisis, NO ejecutar.

### U.1 Hallazgos
- **No existe entidad de archivo de documentos del Empleado.** `EmployeeFile` (RecursosHumanos) es un
  **agregador de solo lectura** de datos estructurados del empleado (header, datos personales, bancarios,
  clínicos, contrato, etc.); no guarda archivos. Tampoco hay `RecruitmentCandidateHiringDocument`/`CandidateDocument`
  físicos (solo en diseño).
- Existe un patrón de documento genérico en Operaciones: `CustomDocument` (`Tenant/Operations/CustomDocuments`).
  Podría servir de base para `EmployeeDocument`, o crear una entidad dedicada en RRHH.
- El **CV del candidato** sí existe (componente `candidate-cv-upload`); es el único documento del candidato.

### U.2 Regla de negocio (confirmada)
- Candidato → solo **CV**.
- Empleado → documentos de contratación (~17 tipos INE, comprobante domicilio, RFC, CURP, acta nacimiento,
  certificados, comprobante bancario, foto, etc.) en su **expediente**.

### U.3 Momento de entrada / no obligatoriedad en alta
- Enviar el alta (stepper R-02) **no obliga** subir todos los documentos (el candidato puede no tenerlos en ese
  momento). Se capturan **después del alta**, como empleado, en el expediente, con recordatorios.
- La transición `AltaEnProceso` → `Contratado` **no** se bloquea por documentos faltantes; los documentos son un
  **requisito pendiente** (estado en el expediente), no una condición de la etapa.

### U.4 Decisiones (resueltas 2026-08-14)
- **U.4.1:** `EmployeeDocument` ligada a `Employee` vía `EmployeeId` (un empleado → N documentos, uno por
  `RecruitmentDocumentType`). **`CustomDocument` (Operaciones) descartado 100%** (es para otro fin).
- **U.4.2:** El alta crea el empleado y luego se suben los documentos. Tras enviar el alta, el usuario recibe:
  "¿Tienes los documentos para cargar ahora?" con opciones **Sí / Parcial / No**; Sí/Parcial abren carga
  inmediata, No deja pendiente con recordatorio (Flujo E).
- **U.4.3:** catálogo `RecruitmentDocumentType` (~17 tipos, véase borrador al inicio) es el enum para los
  documentos del empleado (`EmployeeDocument.DocumentTypeId`). Renombrado desde `DocumentType` (ya existe/ocupado
  en el hub). `Curriculum` (=CV) pertenece al Candidato, no a `EmployeeDocument`.

## V. Validación de datos del candidato / empleado (análisis, NO ejecutar)

> Alcance acordado: validación de **datos** (RFC, CURP, campos requeridos, formatos) en alta/stepper.
> Ver también U (documentos) y N (reglas de agenda).

### V.1 Estado actual
- **Completitud:** `EmployeeDataValidationService.GetMissingDataReportAsync` (Admin/AppImplementationTracking)
  revisa **presencia** de CURP/RFC/NSS/tipo de sangre/salario/dirección/contactos de emergencia del empleado.
  Es un reporte de "datos faltantes", reutilizable para la completitud post-alta.
- **Formato:** **NO hay validadores centralizados** de formato (CURP 18, RFC 12/13, NSS 11, CLABE 18, CP 5,
  teléfono 10 dígitos). Los formularios solo usan `Validators.required` (p. ej. RFC en `proveedor-form.ts`).
  El backend no valida formato al crear candidato ni al dar de alta. **Gap.**

### V.2 Campos y reglas propuestas
| Campo | Regla de formato | Obligatorio | Etapa |
|---|---|---|---|
| FirstName / LastNameP/M | texto, no vacío | Sí | Candidato + Alta |
| Email | formato email + único por Customer (N.1) | Sí | Candidato + Alta |
| PhoneNumber | 10 dígitos MX | Sí | Candidato + Alta |
| BirthDate | fecha válida, edad derivable | Sí | Alta |
| NSS | 11 dígitos | Sí | Alta |
| RFC | 12–13 alfanuméricos (persona física) | Sí | Alta |
| CURP | 18 alfanuméricos + única por Customer | Sí | Alta |
| Address (calle/colonia/municipio/CP) | CP = 5 dígitos | Sí | Alta |
| EmployeeBankData (CLABE/cuenta) | CLABE = 18 dígitos | Sí | Alta |
| EmployeeClinicalData (tipoSangre, alergias, crónicos) | enums/booleanos | Parcial | Alta |
| EmployeeEmergencyContact (nombre/tel/parentesco) | tel válido | Sí (al menos 1) | Alta |
| Salary (>0), WorkPosition, Turno | numérico / catálogo | Sí | Alta |

### V.3 Dónde se aplica
- **Frontend:** validadores reactivos en cada paso del stepper (P.1–P.5) + `ApiResponseService.validateForm` ya usado.
- **Backend (autoritativo, no confiar en cliente):** validación en DTOs de `ProcessHiringAsync` (atributos o
  FluentValidation) y al crear `Candidate` (N.1).
- **Completitud post-alta:** reusar `EmployeeDataValidationService` para el reporte de pendientes (empleado ya
  creado) — complementa la carga de documentos (U).

### V.4 Gaps / deuda
- **V.4.1:** crear utilidad compartida de formato MX (`MexicanDataValidators`: CURP, RFC, NSS, CLABE, CP, teléfono)
  reutilizable en frontend y backend.
- **V.4.2:** unicidad de CURP y RFC **por Customer** en backend (no solo en UI).
- **V.4.3:** el backend hoy no valida nada de formato en alta; al implementar P (Fase 2) debe incluir validación
  server-side.
- **V.4.4:** el reporte `GetMissingDataReportAsync` no valida formato, solo presencia; al usarlo, complementar con
  V.4.1.

### V.5 Recomendación
Centralizar validación en un servicio/util compartido, aplicado en: creación de Candidato (mínimo: nombre/email/
tel), stepper de Alta (P, completo) y reporte de completitud de empleado. Backend como fuente autoritativa.

## W. Pendientes de definir — nuevos requerimientos (2026-08-14)

> Requisitos planteados por el usuario. Análisis, NO ejecutar. Cada uno tiene una decisión abierta.

### W.1 Notificación al cargar documentos desde el lado del entrevistador
- **Requisito:** siempre que el **entrevistador** cargue documentos, debe llegar una **notificación a Reclutamiento**.
- **Análisis:** hoy no existe este evento. Las notificaciones de documentos (T.3.1) cubren alta→validador y
  documento validado/rechazado→RRHH, pero no "entrevistador sube documento → Reclutamiento".
- **Resuelto (2026-08-14):** los documentos físicos se guardan en `private/rrhh/employees/{employeeId}/documents`
  (ruta definida en CONVENTIONS vía `IFileWritePathService`/`IFileReadPathService`); en la BD solo se guarda el
  **nombre de archivo + extensión**. Entidad = `EmployeeDocument` (por empleado). El entrevistador sube al
  expediente del empleado (post-alta / durante el alta). **Pendiente:** agregar método
  `NotifyInterviewerDocumentUploadedAsync` (Entrevistador→Reclutamiento; asunto T.5:
  `[Cliente] | CANDIDATO [folio] DOCUMENTO CARGADO`) y permitir que el entrevistador suba a `EmployeeDocument`.

### W.2 Alta de persona que NO pasó por el proceso de candidato/entrevista
- **Requisito:** si se contrata a alguien que no se registró como candidato ni pasó entrevista, **igual debe pasar
  por el alta** (stepper R-02 / `ProcessHiringAsync`); ¿cómo se maneja esta situación alterna?
- **Análisis:** el alta hoy parte de un `CandidateProcess` en etapa `Seleccionado`. Para quien viene "por fuera":
  - **(a) Candidato "de paso" + `CandidateProcess`** (etapa `Seleccionado` o directo a `AltaEnProceso`) y luego
    abrir el stepper. Reusa toda la orquestación y conserva trazabilidad.
  - **(b) Entrada "Alta directa"** que crea el `Employee` vía `ProcessHiringAsync` sin `Candidate`, usando el
    stepper directamente.
- **Resuelto (2026-08-14):** **(b) Alta directa sin candidato.** Entrada "Alta directa" que crea el `Employee` vía
  `ProcessHiringAsync` **sin** crear `Candidate`/`CandidateProcess`. El stepper R-02 se abre directo desde esta
  entrada. `ProcessHiringAsync` debe soportar ser invocado sin candidato (o con datos mínimos).

### W.3 Componente de seguimiento de "Altas en proceso"
- **Requisito:** Reclutamiento debe tener un componente (o ampliar el existente) para **seguimiento de candidatos
  que ya son solicitudes de alta**, hasta cerrar el proceso de alta y documentación completa (etapas
  `AltaEnProceso` → `Contratado` + documentos validados).
- **Análisis:** hoy `candidate-process-list` / `candidate-application-list` muestran candidatos, pero no una
  bandeja dedicada de "altas en proceso / documentación pendiente". El Flujo E deja los documentos como requisito
  pendiente en el expediente.
- **Resuelto (2026-08-14):** **Bandeja nueva dedicada** `recruitment-alta-tracking`, filtrada por etapa
  `AltaEnProceso` + documentos pendientes de `EmployeeDocument`, hasta cerrar alta y documentación completa.

### W.4 Estado
- Los tres requerimientos fueron **definidos** (2026-08-14); su implementación va en Fase 6 del plan. No ejecutar
  hasta aprobar plan (§3.7).

## X. Análisis de KPIs (2026-08-14)

> Revisión del componente `candidate-application/candidate-application-kpis.ts` (Legacy, consume
> `EndpointsReclutamiento.CandidateProcesses.kpis`). Análisis, NO ejecutar.

### X.1 KPIs existentes
- **Tarjetas:** Vacantes abiertas, Vacantes sin postulación, Postulaciones activas, En Entrevista Operaciones,
  Vencidas/Overdue, Tasa de selección, Tiempo Vacante→1ª Postulación (prom/mediana/P90, SLA ≤7d), Vacantes en SLA.
- **Funnel/pipeline:** Nuevo → Pre-Filtro → En Espera → Entr. Reclutamiento → Entr. Operaciones → Seleccionado →
  Alta en Proceso → Contratado → Rechazado/No se presentó (cubre todo el pipeline, incl. Operaciones obligatoria).
- **Desglose de agenda Ops:** Agendadas / Con feedback / Pend. agenda / Sin entrevistador / Vencidas.
- **Fuentes (top 6):** total de postulaciones + tasa de conversión.
- **Actividad:** postulaciones últimos 7d / 30d.
- **Fuente de datos:** `EndpointsReclutamiento.CandidateProcesses.kpis` → ya consulta **`CandidateProcess`** (bien
  alineado con Q.3.5). DTO: `CandidateApplicationKpisDto` (debe renombrarse a `CandidateProcessKpisDto` por R.2).

### X.2 Cobertura vs flujo
- Funnel completo ✅; SLA a 1ª postulación ✅; tasa de selección ✅; agenda Ops ✅; fuentes ✅; actividad ✅.

### X.3 Gaps / mejoras
- **X.3.1:** falta KPI de **altas en proceso / documentación pendiente** (documentos faltantes por empleado, % de
  altas completas, tiempo de completitud de alta). Necesario para la bandeja W.3. Proponer tarjeta "Altas en
  proceso" + "Documentación pendiente".
- **X.3.2:** falta KPI de **tiempo de contratación** (postulación → Contratado) y **tiempo de alta**
  (Seleccionado → Contratado + docs).
- **X.3.3:** SLA de entrevista (tiempo a agendar / a feedback) queda implícito en "vencidas"; podría explicitarse.
- **X.3.4:** renombrar componente `candidate-application-kpis` → `candidate-process-kpis` y DTO (R.2). El botón
  `runAutomation` usa `CandidateApplications.runAutomation` (legacy) → migrar a `CandidateProcess`.

### X.4 Recomendación
- Mantener las KPIs actuales (ya sobre `CandidateProcess`); añadir X.3.1/X.3.2 en backend (extender DTO del
  endpoint `CandidateProcesses.kpis`) + cards. Renombrar componente/DTO en Fase 3 (R.2).
- Los hallazgos de auditoría frontend (hex hardcodeados, inline px, `*ngIf`) son remediación de convenciones,
  aparte del diseño de KPIs.

### X.5 Plan
- **Fase 3 (R.2):** renombrar `candidate-application-kpis` → `candidate-process-kpis` + DTO.
- **Fase 5/6:** extender endpoint `CandidateProcesses.kpis` y agregar cards de alta/documentación pendiente y
  tiempo de contratación (X.3.1/X.3.2).
