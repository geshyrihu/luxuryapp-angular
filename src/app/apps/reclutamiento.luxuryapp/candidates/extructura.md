Problemas que resolvemos:
Flexibilidad de entrevistas: Ya no limitamos a 2 entrevistas fijas, permitimos múltiples entrevistas con diferentes tipos
Experiencia laboral estructurada: Datos consultables y reportables en lugar de texto libre
Gestión documental de contratación: Sistema completo para los 17 requisitos de alta
Base de talentos: Mecanismo para reutilizar candidatos excelentes descartados
Separación de responsabilidades: Evento de entrevista vs. Resultado de evaluación
📊 Nueva Arquitectura de Entidades
Diagrama de Relaciones
RecruitmentCandidates (1) ──< (N) RecruitmentCandidateWorkExperiences
│
└──< (N) RecruitmentCandidateApplications (N) >── (1) JobVacancyRequests
│
├──< (N) RecruitmentCandidateInterviews
│ │
│ └──< (1) RecruitmentCandidateInterviewResults
│
├──< (N) RecruitmentCandidateStageHistories
│
└──< (N) RecruitmentCandidateHiringDocuments

RecruitmentCandidateDecisionReasons (catálogo independiente)
💻 Código de las Entidades (C#)
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LuxuryApp.Infrastructure.Data.Entities.Recruitment;

#region 1. Candidato Principal
public class RecruitmentCandidate
{
public Guid Id { get; set; }
public string FirstName { get; set; } = null!;
public string LastName { get; set; } = null!;
public string? PhoneNumber { get; set; }
public string? Email { get; set; }
public int? Age { get; set; }
public string? CurrentAddress { get; set; }
public bool? LivesNearWorkplace { get; set; }
public string? Availability { get; set; }
public decimal? SalaryExpectation { get; set; }
public string? CvFileName { get; set; }
public int? RecruitmentSource { get; set; }
public string? GeneralComments { get; set; }

    // Base de Talentos
    public bool IsInTalentPool { get; set; }
    public string? TalentPoolNotes { get; set; }

    public int Status { get; set; } // Active, Inactive, Blacklisted

    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }

    // Navegación
    public ICollection<RecruitmentCandidateWorkExperience> WorkExperiences { get; set; } = new List<RecruitmentCandidateWorkExperience>();
    public ICollection<RecruitmentCandidateApplication> Applications { get; set; } = new List<RecruitmentCandidateApplication>();

}

public class RecruitmentCandidateConfiguration : IEntityTypeConfiguration<RecruitmentCandidate>
{
public void Configure(EntityTypeBuilder<RecruitmentCandidate> builder)
{
builder.ToTable("RecruitmentCandidates");
builder.HasKey(e => e.Id);

        builder.Property(e => e.FirstName).HasMaxLength(80).IsRequired();
        builder.Property(e => e.LastName).HasMaxLength(80).IsRequired();
        builder.Property(e => e.PhoneNumber).HasMaxLength(20);
        builder.Property(e => e.Email).HasMaxLength(120);
        builder.Property(e => e.CurrentAddress).HasMaxLength(250);
        builder.Property(e => e.Availability).HasMaxLength(150);
        builder.Property(e => e.SalaryExpectation).HasPrecision(18, 2);
        builder.Property(e => e.CvFileName).HasMaxLength(80);

        builder.HasIndex(e => e.Email);
        builder.HasIndex(e => e.PhoneNumber);
        builder.HasIndex(e => e.IsInTalentPool);
    }

}
#endregion

#region 2. Experiencia Laboral
public class RecruitmentCandidateWorkExperience
{
public Guid Id { get; set; }
public Guid CandidateId { get; set; }
public string CompanyName { get; set; } = null!;
public string JobPosition { get; set; } = null!;
public DateOnly StartDate { get; set; }
public DateOnly? EndDate { get; set; }
public decimal MonthlyNetSalary { get; set; }
public string DepartureReason { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }

    // Navegación
    public RecruitmentCandidate Candidate { get; set; } = null!;

}

public class RecruitmentCandidateWorkExperienceConfiguration : IEntityTypeConfiguration<RecruitmentCandidateWorkExperience>
{
public void Configure(EntityTypeBuilder<RecruitmentCandidateWorkExperience> builder)
{
builder.ToTable("RecruitmentCandidateWorkExperiences");
builder.HasKey(e => e.Id);

        builder.Property(e => e.CompanyName).HasMaxLength(150).IsRequired();
        builder.Property(e => e.JobPosition).HasMaxLength(100).IsRequired();
        builder.Property(e => e.MonthlyNetSalary).HasPrecision(18, 2).IsRequired();
        builder.Property(e => e.DepartureReason).HasMaxLength(500).IsRequired();

        builder.HasOne(e => e.Candidate)
            .WithMany(c => c.WorkExperiences)
            .HasForeignKey(e => e.CandidateId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => e.CandidateId);
    }

}
#endregion

#region 3. Aplicación a Vacante
public class RecruitmentCandidateApplication
{
public Guid Id { get; set; }
public Guid CandidateId { get; set; }
public Guid JobVacancyRequestId { get; set; }
public DateOnly ApplicationDate { get; set; }
public int CurrentStage { get; set; } // Enum: Applied, RRHHInterview, OperationsInterview, Approved, Hired, Rejected
public int? LastDecision { get; set; }
public Guid? LastDecisionReasonId { get; set; }
public string? LastDecisionComment { get; set; }
public bool SelectedForHiring { get; set; }
public DateTime? HiringRequestedAt { get; set; }
public DateTime? ClosedAt { get; set; }

    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }

    // Navegación
    public RecruitmentCandidate Candidate { get; set; } = null!;
    public JobVacancyRequest JobVacancyRequest { get; set; } = null!;
    public RecruitmentCandidateDecisionReason? LastDecisionReason { get; set; }
    public ICollection<RecruitmentCandidateInterview> Interviews { get; set; } = new List<RecruitmentCandidateInterview>();
    public ICollection<RecruitmentCandidateStageHistory> StageHistories { get; set; } = new List<RecruitmentCandidateStageHistory>();
    public ICollection<RecruitmentCandidateHiringDocument> HiringDocuments { get; set; } = new List<RecruitmentCandidateHiringDocument>();

}

public class RecruitmentCandidateApplicationConfiguration : IEntityTypeConfiguration<RecruitmentCandidateApplication>
{
public void Configure(EntityTypeBuilder<RecruitmentCandidateApplication> builder)
{
builder.ToTable("RecruitmentCandidateApplications");
builder.HasKey(e => e.Id);

        builder.HasOne(e => e.Candidate)
            .WithMany(c => c.Applications)
            .HasForeignKey(e => e.CandidateId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.JobVacancyRequest)
            .WithMany()
            .HasForeignKey(e => e.JobVacancyRequestId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.LastDecisionReason)
            .WithMany()
            .HasForeignKey(e => e.LastDecisionReasonId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => new { e.CandidateId, e.JobVacancyRequestId });
        builder.HasIndex(e => e.CurrentStage);
    }

}
#endregion

#region 4. Entrevistas (Flexible)
public class RecruitmentCandidateInterview
{
public Guid Id { get; set; }
public Guid CandidateApplicationId { get; set; }
public int InterviewType { get; set; } // Enum: RRHH, Operations, Technical, Client
public string AssignedToUserId { get; set; } = null!;
public DateTime ScheduledAt { get; set; }
public DateTime? CompletedAt { get; set; }
public int Status { get; set; } // Enum: Scheduled, Completed, NoShow, Cancelled, Rescheduled
public string? Location { get; set; }
public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }

    // Navegación
    public RecruitmentCandidateApplication CandidateApplication { get; set; } = null!;
    public RecruitmentCandidateInterviewResult? Result { get; set; }

}

public class RecruitmentCandidateInterviewConfiguration : IEntityTypeConfiguration<RecruitmentCandidateInterview>
{
public void Configure(EntityTypeBuilder<RecruitmentCandidateInterview> builder)
{
builder.ToTable("RecruitmentCandidateInterviews");
builder.HasKey(e => e.Id);

        builder.Property(e => e.AssignedToUserId).HasMaxLength(450).IsRequired();
        builder.Property(e => e.Location).HasMaxLength(200);

        builder.HasOne(e => e.CandidateApplication)
            .WithMany(a => a.Interviews)
            .HasForeignKey(e => e.CandidateApplicationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => e.CandidateApplicationId);
        builder.HasIndex(e => e.AssignedToUserId);
        builder.HasIndex(e => e.ScheduledAt);
        builder.HasIndex(e => e.Status);
    }

}
#endregion

#region 5. Resultado de Entrevista
public class RecruitmentCandidateInterviewResult
{
public Guid Id { get; set; }
public Guid InterviewId { get; set; }
public int Decision { get; set; } // Enum: Approved, Rejected, OnHold
public Guid DecisionReasonId { get; set; }
public string? Comments { get; set; }
public int? Score { get; set; }
public DateTime EvaluatedAt { get; set; }
public string EvaluatedByUserId { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }

    // Navegación
    public RecruitmentCandidateInterview Interview { get; set; } = null!;
    public RecruitmentCandidateDecisionReason DecisionReason { get; set; } = null!;

}

public class RecruitmentCandidateInterviewResultConfiguration : IEntityTypeConfiguration<RecruitmentCandidateInterviewResult>
{
public void Configure(EntityTypeBuilder<RecruitmentCandidateInterviewResult> builder)
{
builder.ToTable("RecruitmentCandidateInterviewResults");
builder.HasKey(e => e.Id);

        builder.Property(e => e.EvaluatedByUserId).HasMaxLength(450).IsRequired();

        builder.HasOne(e => e.Interview)
            .WithOne(i => i.Result)
            .HasForeignKey(e => e.InterviewId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.DecisionReason)
            .WithMany()
            .HasForeignKey(e => e.DecisionReasonId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.InterviewId).IsUnique();
    }

}
#endregion

#region 6. Historial de Etapas
public class RecruitmentCandidateStageHistory
{
public Guid Id { get; set; }
public Guid CandidateApplicationId { get; set; }
public int? FromStage { get; set; }
public int ToStage { get; set; }
public string? Comment { get; set; }
public string ChangedByUserId { get; set; } = null!;
public DateTime ChangedAt { get; set; }

    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }

    // Navegación
    public RecruitmentCandidateApplication CandidateApplication { get; set; } = null!;

}

public class RecruitmentCandidateStageHistoryConfiguration : IEntityTypeConfiguration<RecruitmentCandidateStageHistory>
{
public void Configure(EntityTypeBuilder<RecruitmentCandidateStageHistory> builder)
{
builder.ToTable("RecruitmentCandidateStageHistories");
builder.HasKey(e => e.Id);

        builder.Property(e => e.ChangedByUserId).HasMaxLength(450).IsRequired();

        builder.HasOne(e => e.CandidateApplication)
            .WithMany(a => a.StageHistories)
            .HasForeignKey(e => e.CandidateApplicationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => e.CandidateApplicationId);
    }

}
#endregion

#region 7. Documentos de Contratación
public class RecruitmentCandidateHiringDocument
{
public Guid Id { get; set; }
public Guid CandidateApplicationId { get; set; }
public int DocumentType { get; set; } // Enum con los 17 tipos de documentos
public string FileName { get; set; } = null!;
public string? FileUrl { get; set; }
public bool IsSubmitted { get; set; }
public bool IsValidated { get; set; }
public string? ValidationNotes { get; set; }
public DateTime? SubmittedAt { get; set; }
public DateTime? ValidatedAt { get; set; }
public string? ValidatedByUserId { get; set; }

    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }

    // Navegación
    public RecruitmentCandidateApplication CandidateApplication { get; set; } = null!;

}

public class RecruitmentCandidateHiringDocumentConfiguration : IEntityTypeConfiguration<RecruitmentCandidateHiringDocument>
{
public void Configure(EntityTypeBuilder<RecruitmentCandidateHiringDocument> builder)
{
builder.ToTable("RecruitmentCandidateHiringDocuments");
builder.HasKey(e => e.Id);

        builder.Property(e => e.FileName).HasMaxLength(200).IsRequired();
        builder.Property(e => e.FileUrl).HasMaxLength(500);
        builder.Property(e => e.ValidatedByUserId).HasMaxLength(450);

        builder.HasOne(e => e.CandidateApplication)
            .WithMany(a => a.HiringDocuments)
            .HasForeignKey(e => e.CandidateApplicationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => new { e.CandidateApplicationId, e.DocumentType });
        builder.HasIndex(e => e.IsSubmitted);
        builder.HasIndex(e => e.IsValidated);
    }

}
#endregion

#region 8. Catálogo de Razones de Decisión (Existente, actualizado)
public class RecruitmentCandidateDecisionReason
{
public Guid Id { get; set; }
public string Code { get; set; } = null!;
public string Name { get; set; } = null!;
public int AppliesToDecision { get; set; } // 0=Aprobación, 1=Rechazo, 2=EnEspera
public bool IsActive { get; set; }
public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }

}

public class RecruitmentCandidateDecisionReasonConfiguration : IEntityTypeConfiguration<RecruitmentCandidateDecisionReason>
{
public void Configure(EntityTypeBuilder<RecruitmentCandidateDecisionReason> builder)
{
builder.ToTable("RecruitmentCandidateDecisionReasons");
builder.HasKey(e => e.Id);

        builder.Property(e => e.Code).HasMaxLength(50).IsRequired();
        builder.Property(e => e.Name).HasMaxLength(120).IsRequired();

        builder.HasIndex(e => e.Code).IsUnique();
        builder.HasIndex(e => e.AppliesToDecision);
    }

}
#endregion
