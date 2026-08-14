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

ya que el candidato migrado a Empleado, debe de tener su archivo de documentacion,
public class CandidateDocument
{
public int Id { get; set; }
public int CandidateId { get; set; } // FK a RecruitmentCandidate
public DocumentType Type { get; set; } // Enum con el tipo de documento
public string FilePath { get; set; } // Ruta o referencia al archivo
public bool IsDelivered { get; set; } // Si ya se entregó
public DateTime? DeliveredAt { get; set; } // Fecha de entrega
public bool IsMandatory { get; set; } // Si es requisito obligatorio
public string Notes { get; set; } // Observaciones (ej. documento ilegible, pendiente)
}

public enum DocumentType
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
