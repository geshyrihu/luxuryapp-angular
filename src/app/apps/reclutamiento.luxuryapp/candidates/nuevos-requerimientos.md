# Nuevos Requerimientos — Candidates / Altas de Empleado

> Baseline inicial extraído de `nueva-extructuraV2.md` (ideas al aire) para ir
> debatiendo punto por punto. Este archivo es la fuente de requerimientos; el
> análisis de dónde encaja vive en `nueva-extructuraV2.md`.

## R-01 — Fuente de reclutamiento en Candidato
- Nuevo campo `RecruitmentSource` (enum: `Internal`, `External`) en la entidad Candidato.
- Debe poderse capturar en el formulario de registrar/editar candidato.
- NOTA: ya existe el enum `FuenteReclutamiento` y se usa en `RequestEmployeeRegister`.
  Decidir si se reutiliza o se crea uno nuevo para el candidato (pre-alta).

## R-02 — Captura de datos del "proceso de alta" y enrutamiento a entidades
El formulario de alta debe recolectar un conjunto amplio de datos y, al guardar,
escribirlos en las entidades correspondientes del empleado (NO necesariamente crear
entidades nuevas para todo). Grupos de datos:
- Identificación: Folio, RequestDate, nombres (paterno/materno), BirthDate, Age, NSS, RFC, CURP.
- Dirección: calle, colonia, municipio, CP, estado.
- Contacto: teléfono, email.
- Datos bancarios: banco, cuenta, CLABE.
- Beneficiario: nombre, teléfono, parentesco.
- Contacto de emergencia: nombre, teléfono, parentesco.
- Salud: medicación controlada, alergia a medicamentos, enfermedades crónicas.
- Datos de empresa: empresa, fecha de ingreso, tipo de contrato, puesto, dirección
  laboral, salario quincenal, turno.
- Fuente de reclutamiento.

## R-03 — Documentación de contratación (checklist de documentos)
- Entidad para registrar documentos del candidato/empleado: tipo (enum ~17 tipos),
  ruta/archivo, entregado (bool), fecha entrega, obligatorio (bool), notas.
- Versiones existentes a conciliar:
  - `nueva-extructuraV2.md`: `CandidateDocument` (entregado/validación simple).
  - `extructura.md`: `RecruitmentCandidateHiringDocument` (con validación, validado por, etc.).

## Pendientes de decisión (ver `nueva-extructuraV2.md` → "Decisiones abiertas")
- D1: RecruitmentSource en Candidato vs solo en alta.
- D2: ¿De dónde vienen los nombres del empleado? (ApplicationUser / PersonData / Candidate).
- D3: Beneficiario: reusar `EmployeeEmergencyContact` o entidad nueva.
- D4: ¿El alta escribe directo en entidades destino o vía `RequestEmployeeRegister` como orquestador?
- D5: ¿Versión de documentación a adoptar (simple vs con validación)?
- D6: ¿Refactor de nombres a `RecruitmentCandidate*` (extructura.md) o trabajo sobre esquema actual?
