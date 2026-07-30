import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  type ConventionDomain,
  type ConventionTaskType,
  type SeverityType,
} from './conventions-viewer.utils';

export interface ConventionRule {
  id: string;
  title: string;
  description: string;
  severity: SeverityType;
  domain: ConventionDomain;
  taskTypes: ConventionTaskType[];
  technologies: string[];
  examples: {
    angular?: { code: string; description: string };
    dotnet?: { code: string; description: string };
    flutter?: { code: string; description: string };
  };
  relatedRules?: string[];
  sourceDocuments?: string[];
  importance: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConventionsService {
  private readonly conventions: ConventionRule[] = [
    {
      id: 'core-single-source-of-truth',
      title: 'CONVENTIONS.md es indice rector + reglas minimas universales',
      description:
        'El sistema oficial de reglas comienza en CONVENTIONS.md. Los documentos especializados desarrollan el detalle, pero no crean reglas nuevas por su cuenta.',
      severity: 'CRÍTICA',
      domain: 'core',
      taskTypes: ['operacion-transversal', 'documentacion'],
      technologies: ['Documentación'],
      examples: {},
      sourceDocuments: ['CONVENTIONS.md', 'docs/conventions/core/precedencia-documental.md'],
      importance:
        'Evita contradicciones, obliga a que todos los agentes consulten la misma jerarquia y elimina reglas paralelas.',
    },
    {
      id: 'core-do-not-assume-verify',
      title: 'No asumir: toda tecnologia, helper o contrato debe verificarse',
      description:
        'Ningun agente debe asumir librerias instaladas, helpers existentes, rutas, DTOs o contratos. Si la regla o dependencia no existe en el sistema oficial, se consulta.',
      severity: 'CRÍTICA',
      domain: 'core',
      taskTypes: ['implementacion-backend', 'implementacion-frontend', 'implementacion-flutter', 'auditoria'],
      technologies: ['Angular', '.NET', 'Flutter', 'Documentación'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN
// Primero valida el catalogo de features disponibles
// y luego implementa con stack oficial

// ❌ MAL
// Asumir que AutoMapper, MediatR o Dapper existen y codear directo`,
          description: 'Toda dependencia o patron debe validarse antes de codificar.',
        },
      },
      sourceDocuments: ['CONVENTIONS.md', 'docs/conventions/operations/available-features.md'],
      importance:
        'Reduce rework, evita compilaciones fallidas y mantiene el stack bajo control.',
    },
    {
      id: 'backend-minimal-api-stack',
      title: 'Backend oficial: .NET 10, Minimal APIs, EF Core, AOT-friendly',
      description:
        'El backend nuevo debe construirse con Minimal APIs, EF Core y patrones compatibles con AOT. No se permiten dependencias fuera del stack aprobado.',
      severity: 'CRÍTICA',
      domain: 'backend',
      taskTypes: ['implementacion-backend'],
      technologies: ['.NET', 'C#'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN
app.MapGroup("api/admin/catalogs/banks")
   .MapGet("/", GetBanks)
   .MapPost("/", CreateBank);

// ❌ MAL
[ApiController]
[Route("api/[controller]")]
public class BanksController : ControllerBase { }`,
          description: 'Minimal APIs y rutas explicitas son el estandar del proyecto.',
        },
      },
      sourceDocuments: ['docs/conventions/backend/backend-rules.md', 'docs/conventions/operations/available-features.md'],
      importance:
        'Conserva consistencia arquitectonica y evita introducir deuda en el stack backend.',
    },
    {
      id: 'backend-shared-protection',
      title: 'Nada shared o contractual se toca sin analisis de impacto',
      description:
        'DTOs shared, interfaces transversales, servicios base, helpers comunes y contratos serializados no se modifican sin analisis previo y aprobacion explicita.',
      severity: 'CRÍTICA',
      domain: 'backend',
      taskTypes: ['implementacion-backend', 'auditoria', 'documentacion'],
      technologies: ['.NET', 'C#'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN
// Reportar impacto y proponer plan de migracion antes de tocar Shared

// ❌ MAL
public record SharedBankDto { ... } // editar directo sin analisis`,
          description: 'Shared no se toca por conveniencia local de un modulo.',
        },
      },
      sourceDocuments: ['docs/conventions/backend/backend-rules.md', 'docs/conventions/backend/backend-generic-services-catalog.md'],
      importance:
        'Protege contratos vivos y evita romper modulos no visibles en el cambio actual.',
    },
    {
      id: 'backend-route-contract',
      title: 'Rutas publicas semanticas, kebab-case y consistentes con frontend',
      description:
        'Las rutas del backend deben ser semanticas, kebab-case y coincidir exactamente con las consumidas por frontend. Cambios sobre rutas existentes requieren plan de migracion si hay consumidores activos.',
      severity: 'ALTA',
      domain: 'backend',
      taskTypes: ['implementacion-backend', 'auditoria'],
      technologies: ['.NET', 'Angular'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN
app.MapGroup("api/admin/catalogs/banks");

// ❌ MAL
app.MapGroup("api/Banks");
app.MapGroup("api/[controller]");`,
          description: 'La ruta publica es contrato, no reflejo accidental de carpetas tecnicas.',
        },
        angular: {
          code: `// ✅ BIEN
export const ADMIN_ENDPOINTS = {
  banks: 'api/admin/catalogs/banks',
};

// ❌ MAL
const endpoint = 'api/Banks';`,
          description: 'El string del frontend debe coincidir caracter por caracter con backend.',
        },
      },
      sourceDocuments: ['docs/conventions/backend/backend-rules.md', 'docs/conventions/frontend/frontend-api-endpoints.md'],
      importance:
        'Evita drift entre front y back y mantiene el contrato estable.',
    },
    {
      id: 'backend-dto-id-must-inherit-guid-base',
      title: 'Todo DTO backend que declare Id debe heredar de GuidIdEntityDTO',
      description:
        'Si un DTO local del modulo declara propiedad Id, la regla oficial es heredar de GuidIdEntityDTO. No se permite redefinir un Id aislado en DTOs del stack backend.',
      severity: 'ALTA',
      domain: 'backend',
      taskTypes: ['implementacion-backend', 'auditoria', 'documentacion'],
      technologies: ['.NET', 'C#'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN
public record BankDTO : GuidIdEntityDTO
{
    public string Code { get; set; }
}

// ❌ MAL
public record BankDTO
{
    public Guid Id { get; set; }
    public string Code { get; set; }
}`,
          description: 'La base oficial para DTOs con Id en backend es GuidIdEntityDTO.',
        },
      },
      sourceDocuments: [
        'CONVENTIONS.md',
        'docs/conventions/backend/backend-rules.md',
        'docs/conventions/backend/backend-module-structure.md',
      ],
      importance:
        'Uniforma contratos, reduce variaciones accidentales y facilita auditoria de DTOs del backend.',
    },
    {
      id: 'backend-one-file-per-dto',
      title: 'En backend la regla oficial es un archivo por DTO',
      description:
        'Los DTOs locales del modulo no deben concentrarse todos en un solo archivo. Cada DTO vive en su propio archivo dentro de la carpeta DTOs, salvo excepcion aprobada expresamente.',
      severity: 'ALTA',
      domain: 'backend',
      taskTypes: ['implementacion-backend', 'auditoria', 'documentacion'],
      technologies: ['.NET', 'C#'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN
DTOs/
├── BankDTO.cs
├── BankAddOrEditDTO.cs
└── BankSavedDTO.cs

// ❌ MAL
DTOs/BankDtos.cs
// contiene BankDTO, BankAddOrEditDTO y BankSavedDTO juntos`,
          description: 'La granularidad oficial de DTOs backend es un archivo por contrato.',
        },
      },
      sourceDocuments: [
        'CONVENTIONS.md',
        'docs/conventions/backend/backend-rules.md',
        'docs/conventions/backend/backend-module-structure.md',
      ],
      importance:
        'Mejora trazabilidad, busqueda semantica, diff limpio y mantenimiento por modulo.',
    },
    {
      id: 'frontend-signals-standalone',
      title: 'Frontend oficial: Angular 22 con Signals, Standalone y control flow nuevo',
      description:
        'La implementacion frontend debe usar Signals, componentes standalone, OnPush y `@if/@for/@switch`. Los patrones antiguos quedan fuera del estandar nuevo.',
      severity: 'CRÍTICA',
      domain: 'frontend',
      taskTypes: ['implementacion-frontend'],
      technologies: ['Angular', 'TypeScript'],
      examples: {
        angular: {
          code: `// ✅ BIEN
users = signal<UserDto[]>([]);
query = signal('');

filtered = computed(() =>
  this.users().filter(user => user.name.includes(this.query()))
);

// ❌ MAL
users$ = new BehaviorSubject<UserDto[]>([]);`,
          description: 'Signals y control flow nuevo son el estandar del proyecto.',
        },
      },
      sourceDocuments: ['docs/conventions/frontend/frontend-rules.md', 'docs/conventions/operations/available-features.md'],
      importance:
        'Alinea todas las features al modelo reactivo y de rendimiento oficial.',
    },
    {
      id: 'frontend-feature-structure-banks',
      title: 'La estructura de feature debe seguir patrones vivos como banks',
      description:
        'Las features frontend no se inventan desde cero. Deben seguir la estructura vigente observada en el proyecto, usando raiz de feature, desktop, mobile e interfaces cuando aplique.',
      severity: 'ALTA',
      domain: 'frontend',
      taskTypes: ['implementacion-frontend', 'documentacion'],
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `client/angular/src/app/apps/admin.luxuryapp/catalogos-generales/banks/
├── bank-form.ts
├── bank-list.ts
├── desktop/
├── mobile/
└── interfaces/`,
          description: 'La estructura viva del proyecto es la referencia primaria.',
        },
      },
      sourceDocuments: ['docs/conventions/frontend/frontend-feature-structure.md'],
      importance:
        'Evita que cada feature nazca con una estructura distinta y reduce deuda de organizacion.',
    },
    {
      id: 'frontend-generic-services-first',
      title: 'Antes de crear servicios nuevos, agota el catalogo generico frontend',
      description:
        'HTTP, paginacion, dialogs, fechas, enums, storage, tablas y PDFs ya tienen piezas oficiales. No se crean alternativas locales si el catalogo cubre el caso.',
      severity: 'ALTA',
      domain: 'frontend',
      taskTypes: ['implementacion-frontend', 'auditoria'],
      technologies: ['Angular', 'TypeScript'],
      examples: {
        angular: {
          code: `// ✅ BIEN
this.apiResponseService.onGetPaged<BankDto>('banks', request);

// ❌ MAL
this.http.get('/api/admin/catalogs/banks');`,
          description: 'El catalogo generico debe agotarse antes de crear servicios ad hoc.',
        },
      },
      sourceDocuments: ['docs/conventions/frontend/frontend-generic-services-catalog.md'],
      importance:
        'Reduce duplicacion y mantiene comportamiento transversal consistente.',
    },
    {
      id: 'ui-catalog-first',
      title: 'Toda feature consume primero desde shared/ui',
      description:
        'Desktop, mobile y capa adaptativa viven en `shared/ui`. Si ya existe componente o wrapper oficial, se consume ese antes de bajar directo a librerias base.',
      severity: 'CRÍTICA',
      domain: 'ui',
      taskTypes: ['implementacion-frontend', 'auditoria'],
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `// ✅ BIEN
import { LxStatusBadge } from '@ui/adaptive/status-badge/status-badge';

// ❌ MAL
import { TagModule } from 'primeng/tag';`,
          description: 'El catalogo UI es la frontera oficial entre features y librerias visuales.',
        },
      },
      sourceDocuments: ['docs/conventions/ui/ui-shared-library-architecture.md', 'docs/conventions/ui/ui-desktop-rules.md'],
      importance:
        'Centraliza decisiones visuales y evita componentes paralelos.',
    },
    {
      id: 'ui-desktop-mobile-nature',
      title: 'Desktop y mobile tienen paradigmas distintos; no se fuerza paridad exacta',
      description:
        'Desktop privilegia productividad y densidad de datos. Mobile privilegia claridad, touch y flujo vertical. El sistema visual debe respetar la naturaleza de cada plataforma.',
      severity: 'ALTA',
      domain: 'ui',
      taskTypes: ['implementacion-frontend', 'auditoria'],
      technologies: ['Angular', 'CSS'],
      examples: {
        angular: {
          code: `<!-- ✅ BIEN -->
@if (isMobile()) {
  <app-bank-list-mobile />
} @else {
  <app-bank-list-desktop />
}

<!-- ❌ MAL -->
<p-table class="mobile-hack-table"></p-table>`,
          description: 'El patron adaptativo separa implementaciones, no las fuerza a ser iguales.',
        },
      },
      sourceDocuments: ['docs/conventions/ui/ui-mobile-rules.md', 'docs/conventions/ui/ui-desktop-rules.md'],
      importance:
        'Evita Frankenstein visual y mejora UX real por plataforma.',
    },
    {
      id: 'ui-usage-catalog',
      title: 'Botones, cards, inputs y contenedores se eligen desde un catalogo de uso',
      description:
        'Las decisiones visuales no se improvisan: el sistema define que boton, card, tabla, dialog o input usar segun la necesidad y la plataforma.',
      severity: 'ALTA',
      domain: 'ui',
      taskTypes: ['implementacion-frontend', 'auditoria', 'documentacion'],
      technologies: ['Angular', 'CSS'],
      examples: {
        angular: {
          code: `<!-- ✅ BIEN -->
<il-button-primary (clicked)="save()">Guardar</il-button-primary>
<iw-button-edit aria-label="Editar registro" />
<custom-input-text-signal [control]="form.controls.name" />

<!-- ❌ MAL -->
<button>Guardar</button>
<input type="text" />`,
          description: 'Cada necesidad tiene componentes aprobados por catalogo.',
        },
      },
      sourceDocuments: ['docs/conventions/ui/ui-usage-catalog.md'],
      importance:
        'Vuelve repetibles las decisiones de UI y reduce divergencia entre agentes.',
    },
    {
      id: 'styles-controlled-layer',
      title: 'src/styles es una capa global controlada',
      description:
        'No se agregan archivos, tokens ni overrides arbitrarios sin revisar impacto. Toda modificacion debe respetar jerarquia de capas y tokens.',
      severity: 'ALTA',
      domain: 'styles',
      taskTypes: ['implementacion-frontend', 'auditoria'],
      technologies: ['CSS'],
      examples: {
        angular: {
          code: `// ✅ BIEN
// token base -> core/_colors.scss
// variable CSS -> theme/_variables.scss
// override web -> web/_prime-button.scss

// ❌ MAL
// meter cualquier cambio global en styles.scss`,
          description: 'Los estilos globales tienen capas y responsabilidades claras.',
        },
      },
      sourceDocuments: ['docs/conventions/styles/styles-rules.md', 'docs/conventions/styles/styles-structure.md'],
      importance:
        'Evita hardcodes, caos de cascada y proliferacion de estilos fuera de capa.',
    },
    {
      id: 'styles-token-governance',
      title: 'Colores, spacing, radius y superficies salen de tokens oficiales',
      description:
        'No se introducen hardcodes si ya existe token equivalente. Las decisiones visuales base deben vivir en el sistema de tokens y theming.',
      severity: 'ALTA',
      domain: 'styles',
      taskTypes: ['implementacion-frontend', 'auditoria', 'documentacion'],
      technologies: ['CSS'],
      examples: {
        angular: {
          code: `/* ✅ BIEN */
color: var(--ds-primary-text);
background: var(--primary-500);

/* ❌ MAL */
color: #ffffff;
background: #1B365D;`,
          description: 'Los tokens son el lenguaje visual oficial del proyecto.',
        },
      },
      sourceDocuments: ['docs/conventions/styles/styles-tokens-theming.md'],
      importance:
        'Permite consistencia visual y facilita auditoria, theming y mantenimiento.',
    },
    {
      id: 'catalogs-name-location-matter',
      title: 'Naming, folders y files son parte del contrato de calidad',
      description:
        'No basta con que el codigo funcione: nombres, ubicaciones y tipos de archivo deben respetar catalogos oficiales por stack y por dominio maestro.',
      severity: 'ALTA',
      domain: 'catalogs',
      taskTypes: ['implementacion-backend', 'implementacion-frontend', 'implementacion-flutter', 'auditoria'],
      technologies: ['Angular', '.NET', 'Flutter', 'Documentación'],
      examples: {},
      sourceDocuments: [
        'docs/conventions/catalogs/naming-conventions.md',
        'docs/conventions/catalogs/folder-structure-conventions.md',
        'docs/conventions/catalogs/file-structure-conventions.md',
      ],
      importance:
        'La estructura y el naming reducen confusion operativa y facilitan auditorias.',
    },
    {
      id: 'audit-complete-only',
      title: 'Solo existe auditoria completa; no se remedia durante la auditoria',
      description:
        'La auditoria oficial siempre es completa, clasifica hallazgos, deja plan por fases con checklist y, si hay alto riesgo o legacy fuerte, marca `requiere plan de migracion`.',
      severity: 'CRÍTICA',
      domain: 'audit',
      taskTypes: ['auditoria'],
      technologies: ['Documentación', 'Angular', '.NET', 'Flutter'],
      examples: {},
      sourceDocuments: [
        'docs/conventions/audit/audit-module-conventions.md',
        'docs/conventions/audit/audit-checklist.md',
        'docs/conventions/AUDIT_LAYERS_CHECKLIST.md',
      ],
      importance:
        'Evita mezclar diagnostico con ejecucion y reduce remediaciones peligrosas.',
    },
    {
      id: 'audit-ui-styles-included',
      title: 'Toda auditoria debe revisar tambien UI y styles cuando apliquen',
      description:
        'La auditoria de modulo no se limita a logica o servicios: debe revisar tambien consumo de shared/ui, cumplimiento visual y uso correcto de styles y tokens.',
      severity: 'ALTA',
      domain: 'audit',
      taskTypes: ['auditoria'],
      technologies: ['Angular', 'CSS'],
      examples: {},
      sourceDocuments: ['docs/conventions/audit/audit-module-conventions.md'],
      importance:
        'Evita que un modulo apruebe funcionalmente pero quede fuera del sistema visual oficial.',
    },
    {
      id: 'operations-available-features',
      title: 'Antes de codificar, consulta features disponibles y checklist de implementacion',
      description:
        'El sistema operacional define que dependencias y patrones estan aprobados, y que validaciones minimas deben completarse antes de escribir codigo.',
      severity: 'ALTA',
      domain: 'operations',
      taskTypes: ['implementacion-backend', 'implementacion-frontend', 'implementacion-flutter'],
      technologies: ['Documentación'],
      examples: {},
      sourceDocuments: [
        'docs/conventions/operations/available-features.md',
        'docs/conventions/operations/implementation-checklist.md',
      ],
      importance:
        'Obliga a preparar bien la implementacion y reduce errores por stack no verificado.',
    },
    {
      id: 'operations-update-existing-docs',
      title: 'No se crean documentos duplicados; se actualiza el existente oficial',
      description:
        'La documentacion de modulos, planes, auditorias y convenciones debe respetar ubicacion, naming y estructura minima. Si ya existe el documento oficial, se actualiza.',
      severity: 'MEDIA',
      domain: 'operations',
      taskTypes: ['documentacion', 'auditoria'],
      technologies: ['Documentación'],
      examples: {},
      sourceDocuments: ['docs/conventions/operations/module-documentation-instructions.md'],
      importance:
        'Evita dispersion documental y mantiene trazabilidad.',
    },
    {
      id: 'flutter-governed-growth',
      title: 'Flutter crece bajo reglas aprobadas, no por improvisacion',
      description:
        'Flutter aun esta en consolidacion, pero ya debe respetar arquitectura, servicios genericos, prohibiciones explicitas y aprobacion previa de reglas faltantes.',
      severity: 'ALTA',
      domain: 'flutter',
      taskTypes: ['implementacion-flutter', 'documentacion'],
      technologies: ['Flutter', 'Dart'],
      examples: {
        flutter: {
          code: `// ✅ BIEN
// Si no existe la regla para una estructura nueva:
// 1. proponerla
// 2. esperar aprobacion
// 3. registrarla en el sistema oficial

// ❌ MAL
// inventar carpeta, patron o servicio por intuicion`,
          description: 'Flutter no es zona libre: sigue el mismo modelo de gobernanza.',
        },
      },
      sourceDocuments: [
        'docs/conventions/flutter/flutter-rules.md',
        'docs/conventions/flutter/flutter-feature-structure.md',
        'docs/conventions/flutter/flutter-generic-services-catalog.md',
      ],
      importance:
        'Permite que Flutter crezca ordenado desde ahora y no repita el desorden historico.',
    },
  ];

  getConventions(): Observable<ConventionRule[]> {
    return of(this.conventions);
  }

  searchConventions(query: string): Observable<ConventionRule[]> {
    const lowerQuery = query.toLowerCase();

    return of(
      this.conventions.filter((convention) => {
        const inTaskTypes = convention.taskTypes.some((taskType) =>
          taskType.toLowerCase().includes(lowerQuery),
        );

        return (
          convention.title.toLowerCase().includes(lowerQuery) ||
          convention.description.toLowerCase().includes(lowerQuery) ||
          convention.domain.toLowerCase().includes(lowerQuery) ||
          convention.technologies.some((technology) =>
            technology.toLowerCase().includes(lowerQuery),
          ) ||
          inTaskTypes
        );
      }),
    );
  }

  getBySeverity(severity: SeverityType): Observable<ConventionRule[]> {
    return of(this.conventions.filter((convention) => convention.severity === severity));
  }

  getByTechnology(technology: string): Observable<ConventionRule[]> {
    return of(
      this.conventions.filter((convention) =>
        convention.technologies.some(
          (item) => item.toLowerCase() === technology.toLowerCase(),
        ),
      ),
    );
  }
}
