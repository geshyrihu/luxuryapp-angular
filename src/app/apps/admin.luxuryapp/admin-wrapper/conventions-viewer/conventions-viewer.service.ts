import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  type ConventionDomain,
  type ConventionTaskType,
  type SeverityType,
} from './conventions-viewer.utils';
import { ConventionRule } from './interfaces/convention-rule.interface';

@Injectable({
  providedIn: 'root',
})
export class ConventionsService {
  private readonly conventions: ConventionRule[] = [
    {
      id: 'core-single-source-of-truth',
      title: 'CONVENTIONS.md es indice rector y conjunto minimo universal',
      description:
        'El sistema oficial comienza en CONVENTIONS.md. Los documentos especializados desarrollan el detalle, pero no crean reglas nuevas por su cuenta.',
      severity: 'CRÍTICA',
      domain: 'core',
      taskTypes: ['operacion-transversal', 'documentacion'],
      technologies: ['Documentacion'],
      examples: {},
      sourceDocuments: ['CONVENTIONS.md', 'docs/conventions/core/precedencia-documental.md'],
      importance:
        'Evita contradicciones, obliga a consultar la misma jerarquia y elimina reglas paralelas.',
    },
    {
      id: 'core-do-not-assume-verify',
      title: 'No asumir: toda tecnologia, helper o contrato debe verificarse',
      description:
        'Ningun agente debe asumir librerias, helpers, rutas, DTOs, servicios o contratos. Si la regla o dependencia no existe en el sistema oficial, se consulta.',
      severity: 'CRÍTICA',
      domain: 'core',
      taskTypes: [
        'implementacion-backend',
        'implementacion-frontend',
        'implementacion-flutter',
        'auditoria',
      ],
      technologies: ['Angular', '.NET', 'Flutter', 'Documentacion'],
      examples: {
        dotnet: {
          code: `// OK
// Validar stack y catalogos antes de implementar

// NO
// Asumir que AutoMapper, MediatR o Dapper existen`,
          description: 'Toda dependencia o patron debe verificarse antes de codificar.',
        },
      },
      sourceDocuments: ['CONVENTIONS.md', 'docs/conventions/operations/available-features.md'],
      importance:
        'Reduce retrabajo, evita errores de compilacion y mantiene controlado el stack.',
    },
    {
      id: 'backend-minimal-api-stack',
      title: 'Backend oficial: .NET 10, Minimal APIs, EF Core y AOT-friendly',
      description:
        'El backend nuevo debe construirse con Minimal APIs, EF Core y patrones compatibles con AOT. No se permiten dependencias fuera del stack aprobado.',
      severity: 'CRÍTICA',
      domain: 'backend',
      taskTypes: ['implementacion-backend'],
      technologies: ['.NET', 'C#'],
      examples: {
        dotnet: {
          code: `// OK
app.MapGroup("api/admin/catalogs/banks")
  .MapGet("/", GetBanks)
  .MapPost("/", CreateBank);

// NO
[ApiController]
public class BanksController : ControllerBase { }`,
          description: 'Minimal APIs y rutas explicitas son el estandar del backend.',
        },
      },
      sourceDocuments: [
        'docs/conventions/backend/backend-rules.md',
        'docs/conventions/operations/available-features.md',
      ],
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
          code: `// OK
// Reportar impacto y proponer plan de migracion

// NO
public record SharedBankDto { } // editar directo`,
          description: 'Shared no se toca por conveniencia local de un modulo.',
        },
      },
      sourceDocuments: [
        'docs/conventions/backend/backend-rules.md',
        'docs/conventions/backend/backend-generic-services-catalog.md',
      ],
      importance:
        'Protege contratos vivos y evita romper modulos no visibles en el cambio actual.',
    },
    {
      id: 'backend-shared-services-first',
      title: 'Antes de crear proveedor nuevo, agota shared services backend',
      description:
        'Si ya existe servicio compartido, interfaz transversal o proveedor oficial, debe usarse antes de crear una variante local.',
      severity: 'ALTA',
      domain: 'backend',
      taskTypes: ['implementacion-backend', 'auditoria', 'documentacion'],
      technologies: ['.NET', 'C#'],
      examples: {
        dotnet: {
          code: `// OK
public class PurchaseOrderService(
  ICurrentUserService currentUserService,
  ITenantAccessor tenantAccessor,
  IHttpClientFactory httpClientFactory)
{
}

// NO
public class PurchaseOrderService()
{
  private readonly HttpClient _http = new();
}`,
          description:
            'Los clientes HTTP y servicios transversales deben salir del catalogo oficial.',
        },
      },
      sourceDocuments: [
        'docs/conventions/backend/backend-shared-services-catalog.md',
        'CONVENTIONS.md',
      ],
      importance:
        'Reduce duplicacion, protege shared sensible y vuelve repetible el criterio entre agentes.',
    },
    {
      id: 'backend-route-contract',
      title: 'Rutas publicas semanticas, kebab-case y consistentes con frontend',
      description:
        'Las rutas del backend deben ser semanticas, kebab-case y coincidir exactamente con las consumidas por frontend.',
      severity: 'ALTA',
      domain: 'backend',
      taskTypes: ['implementacion-backend', 'auditoria'],
      technologies: ['.NET', 'Angular'],
      examples: {
        dotnet: {
          code: `// OK
app.MapGroup("api/admin/catalogs/banks");

// NO
app.MapGroup("api/Banks");
app.MapGroup("api/[controller]");`,
          description: 'La ruta publica es contrato, no reflejo accidental de carpetas tecnicas.',
        },
        angular: {
          code: `// OK
export const ADMIN_ENDPOINTS = {
  banks: 'api/admin/catalogs/banks',
};

// NO
const endpoint = 'api/Banks';`,
          description: 'El string del frontend debe coincidir con backend.',
        },
      },
      sourceDocuments: [
        'docs/conventions/backend/backend-rules.md',
        'docs/conventions/frontend/frontend-api-endpoints.md',
      ],
      importance: 'Evita drift entre front y back y mantiene el contrato estable.',
    },
    {
      id: 'backend-dto-id-must-inherit-guid-base',
      title: 'Todo DTO backend que declare Id debe heredar de GuidIdEntityDTO',
      description:
        'Si un DTO local del modulo declara propiedad Id, la regla oficial es heredar de GuidIdEntityDTO.',
      severity: 'ALTA',
      domain: 'backend',
      taskTypes: ['implementacion-backend', 'auditoria', 'documentacion'],
      technologies: ['.NET', 'C#'],
      examples: {
        dotnet: {
          code: `// OK
public record BankDTO : GuidIdEntityDTO
{
  public string Code { get; set; }
}

// NO
public record BankDTO
{
  public Guid Id { get; set; }
}`,
          description: 'La base oficial para DTOs con Id es GuidIdEntityDTO.',
        },
      },
      sourceDocuments: [
        'CONVENTIONS.md',
        'docs/conventions/backend/backend-rules.md',
        'docs/conventions/backend/backend-module-structure.md',
      ],
      importance:
        'Uniforma contratos, reduce variaciones accidentales y facilita auditoria de DTOs.',
    },
    {
      id: 'backend-one-file-per-dto',
      title: 'En backend la regla oficial es un archivo por DTO',
      description:
        'Los DTOs locales del modulo no deben concentrarse todos en un solo archivo. Cada DTO vive en su propio archivo dentro de DTOs, salvo excepcion aprobada.',
      severity: 'ALTA',
      domain: 'backend',
      taskTypes: ['implementacion-backend', 'auditoria', 'documentacion'],
      technologies: ['.NET', 'C#'],
      examples: {
        dotnet: {
          code: `// OK
DTOs/
- BankDTO.cs
- BankAddOrEditDTO.cs
- BankSavedDTO.cs

// NO
DTOs/BankDtos.cs`,
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
      id: 'backend-fixed-namespaces-by-piece-type',
      title: 'En backend los namespaces son fijos por tipo de pieza',
      description:
        'DTOs, EndPoints, Interfaces, Mappings y Services usan namespaces oficiales fijos del proyecto. No se construyen siguiendo la ruta completa del modulo.',
      severity: 'ALTA',
      domain: 'backend',
      taskTypes: ['implementacion-backend', 'auditoria', 'documentacion'],
      technologies: ['.NET', 'C#'],
      examples: {
        dotnet: {
          code: `// OK
namespace LuxuryApp.Application.DTOs;
namespace LuxuryApp.Application.EndPoints;
namespace LuxuryApp.Application.Interfaces;
namespace LuxuryApp.Application.Mappings;
namespace LuxuryApp.Application.Services;

// NO
namespace LuxuryApp.Application.Moduls.CobranzaLuxuryApp.CobranzaOnline.DTOs;`,
          description: 'El namespace se define por tipo de pieza, no por profundidad de ruta.',
        },
      },
      sourceDocuments: [
        'CONVENTIONS.md',
        'docs/conventions/backend/backend-rules.md',
        'docs/conventions/backend/backend-namespaces.md',
      ],
      importance:
        'Elimina ambiguedad entre agentes y hace repetible la alineacion de codigo backend.',
    },
    {
      id: 'frontend-signals-standalone',
      title: 'Frontend oficial: Angular 22 con Signals, Standalone y control flow nuevo',
      description:
        'La implementacion frontend debe usar Signals, componentes standalone, OnPush y @if/@for/@switch. Los patrones antiguos quedan fuera del estandar nuevo.',
      severity: 'CRÍTICA',
      domain: 'frontend',
      taskTypes: ['implementacion-frontend'],
      technologies: ['Angular', 'TypeScript'],
      examples: {
        angular: {
          code: `// OK
users = signal<UserDto[]>([]);
query = signal('');

filtered = computed(() =>
  this.users().filter(user => user.name.includes(this.query()))
);

// NO
users$ = new BehaviorSubject<UserDto[]>([]);`,
          description: 'Signals y control flow nuevo son el estandar del proyecto.',
        },
      },
      sourceDocuments: [
        'docs/conventions/frontend/frontend-rules.md',
        'docs/conventions/operations/available-features.md',
      ],
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
- bank-form.ts
- bank-list.ts
- desktop/
- mobile/
- interfaces/`,
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
        'HTTP, paginacion, dialogs, fechas, enums, storage, tablas, PDFs y procesamiento de imagenes ya tienen piezas oficiales. Toda imagen se prepara con ImageProcessingService y imageFormDataInterceptor garantiza la cobertura de cargas multipart; no se crean conversiones HEIC ni compresores locales.',
      severity: 'ALTA',
      domain: 'frontend',
      taskTypes: ['implementacion-frontend', 'auditoria'],
      technologies: ['Angular', 'TypeScript'],
      examples: {
        angular: {
          code: `// OK
this.apiResponseService.onGetPaged<BankDto>('banks', request);

// NO
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
        'Desktop, mobile y capa adaptativa viven en shared/ui. Si ya existe componente o wrapper oficial, se consume antes de bajar directo a librerias base.',
      severity: 'CRÍTICA',
      domain: 'ui',
      taskTypes: ['implementacion-frontend', 'auditoria'],
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `// OK
import { LxStatusBadge } from '@ui/adaptive/status-badge/status-badge';

// NO
import { TagModule } from 'primeng/tag';`,
          description: 'El catalogo UI es la frontera oficial entre features y librerias visuales.',
        },
      },
      sourceDocuments: [
        'docs/conventions/ui/ui-shared-library-architecture.md',
        'docs/conventions/ui/ui-desktop-rules.md',
      ],
      importance:
        'Centraliza decisiones visuales y evita componentes paralelos.',
    },
    {
      id: 'ui-desktop-mobile-nature',
      title: 'Desktop y mobile tienen paradigmas distintos',
      description:
        'Desktop privilegia productividad y densidad de datos. Mobile privilegia claridad, touch y flujo vertical. El sistema visual debe respetar la naturaleza de cada plataforma.',
      severity: 'ALTA',
      domain: 'ui',
      taskTypes: ['implementacion-frontend', 'auditoria'],
      technologies: ['Angular', 'CSS'],
      examples: {
        angular: {
          code: `<!-- OK -->
@if (isMobile()) {
  <app-bank-list-mobile />
} @else {
  <app-bank-list-desktop />
}

<!-- NO -->
<p-table class="mobile-hack-table"></p-table>`,
          description: 'El patron adaptativo separa implementaciones, no las fuerza a ser iguales.',
        },
      },
      sourceDocuments: [
        'docs/conventions/ui/ui-mobile-rules.md',
        'docs/conventions/ui/ui-desktop-rules.md',
      ],
      importance: 'Evita Frankenstein visual y mejora UX real por plataforma.',
    },
    {
      id: 'ui-usage-catalog',
      title: 'Botones, cards, inputs y contenedores se eligen desde catalogo',
      description:
        'Las decisiones visuales no se improvisan: el sistema define que boton, card, tabla, dialog o input usar segun la necesidad y la plataforma.',
      severity: 'ALTA',
      domain: 'ui',
      taskTypes: ['implementacion-frontend', 'auditoria', 'documentacion'],
      technologies: ['Angular', 'CSS'],
      examples: {
        angular: {
          code: `<!-- OK -->
<il-button-primary (clicked)="save()">Guardar</il-button-primary>
<iw-button-edit aria-label="Editar registro" />
<custom-input-text-signal [control]="form.controls.name" />

<!-- NO -->
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
      id: 'ui-icon-catalog',
      title: 'Iconos: Material Symbols Light, siempre desde el catalogo',
      description:
        'Un solo paquete de iconos (material-symbols-light) y una sola fuente de valores (app-icon.catalog.ts). Un nombre de icono inexistente NO falla: no rompe la compilacion, no avisa por consola, no pone una prueba en rojo. Simplemente no dibuja. En 2026-08-11 se hallaron 606 iconos en blanco en produccion por esa causa. Ojo con PrimeNG: su input icon espera una CLASE CSS, no un identificador de Iconify.',
      severity: 'CRÍTICA',
      domain: 'ui',
      taskTypes: ['implementacion-frontend', 'auditoria', 'documentacion'],
      technologies: ['Angular', 'CSS'],
      examples: {
        angular: {
          code: `<!-- OK: valor declarado en el catalogo -->
<app-icon icon="material-symbols-light:add" />

<!-- OK: dentro de PrimeNG va por plantilla, sin el input icon -->
<p-button label="Agregar">
  <ng-template #icon>
    <app-icon icon="material-symbols-light:add" />
  </ng-template>
</p-button>

<!-- NO: PrimeNG lo pinta como clase CSS -> span vacio -->
<p-button icon="material-symbols-light:add" label="Agregar" />

<!-- NO: paquetes retirados -->
<i class="pi pi-plus"></i>
<app-icon icon="mdi:plus" />

<!-- NO: nombre inventado, se renderiza vacio y nadie se entera -->
<app-icon icon="material-symbols-light:file-pdf-box" />`,
          description:
            'Alta de icono nuevo: verificar contra el set real de Iconify ANTES de usarlo, dar de alta el concepto en el catalogo, y usarlo desde ahi. Validar con npm run audit:icon-names.',
        },
      },
      relatedRules: ['ui-catalog-first', 'styles-controlled-layer'],
      sourceDocuments: [
        'docs/conventions/ui/icon-usage-rule.md',
        'CONVENTIONS.md',
      ],
      importance:
        'Es la unica regla visual cuyo incumplimiento es invisible para el compilador, para la consola y para las pruebas: solo se ve abriendo la pantalla. Por eso se valida con un gate y no con revision.',
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
          code: `// OK
// token base -> core/_colors.scss
// variable CSS -> theme/_variables.scss
// override web -> web/_prime-button.scss

// NO
// meter cualquier cambio global en styles.scss`,
          description: 'Los estilos globales tienen capas y responsabilidades claras.',
        },
      },
      sourceDocuments: [
        'docs/conventions/styles/styles-rules.md',
        'docs/conventions/styles/styles-structure.md',
      ],
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
          code: `/* OK */
color: var(--ds-text-primary);
background: var(--ds-bg-surface);

/* NO */
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
      taskTypes: [
        'implementacion-backend',
        'implementacion-frontend',
        'implementacion-flutter',
        'auditoria',
      ],
      technologies: ['Angular', '.NET', 'Flutter', 'Documentacion'],
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
        'La auditoria oficial siempre es completa, clasifica hallazgos, deja plan por fases con checklist y, si hay alto riesgo o legacy fuerte, marca requiere plan de migracion.',
      severity: 'CRÍTICA',
      domain: 'audit',
      taskTypes: ['auditoria'],
      technologies: ['Documentacion', 'Angular', '.NET', 'Flutter'],
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
      id: 'operations-plan-protocol',
      title: 'Todo plan debe seguir protocolo oficial y no estructura improvisada',
      description:
        'Los planes de remediacion, implementacion o migracion deben incluir objetivo, alcance, restricciones, fases, checklist, criterios de paso, riesgos y cierre esperado.',
      severity: 'ALTA',
      domain: 'operations',
      taskTypes: ['documentacion', 'auditoria', 'operacion-transversal'],
      technologies: ['Documentacion'],
      examples: {
        angular: {
          code: `# Plan de Remediacion - Modulo X
## Resumen Ejecutivo
## Fase 0. Criterios de control
## Fase 1
## Riesgos
## Cierre esperado`,
          description: 'El plan oficial debe ser trazable, aprobable y ejecutable.',
        },
      },
      sourceDocuments: [
        'docs/conventions/operations/plan-creation-protocol.md',
        'docs/conventions/operations/plan-agent-instructions.md',
      ],
      importance:
        'Evita planes incompletos, duplicados o contradictorios y conserva la trazabilidad.',
    },
    {
      id: 'core-compliance-cycle',
      title: 'Toda remediacion o migracion sensible sigue el ciclo de compliance',
      description:
        'Diagnostico, reporte, plan, aprobacion, ejecucion y revalidacion no son opcionales en cambios sensibles.',
      severity: 'CRÍTICA',
      domain: 'core',
      taskTypes: ['auditoria', 'documentacion', 'operacion-transversal'],
      technologies: ['Documentacion', 'Angular', '.NET', 'Flutter'],
      examples: {
        dotnet: {
          code: `1. Leer convenciones y stack
2. Auditar o diagnosticar
3. Reportar hallazgos
4. Crear plan por fases
5. Esperar aprobacion
6. Ejecutar
7. Reauditar`,
          description: 'El flujo formal evita criterios o atajos distintos entre agentes.',
        },
      },
      sourceDocuments: ['docs/conventions/core/compliance-protocol.md', 'CONVENTIONS.md'],
      importance:
        'Uniforma el comportamiento operativo de todos los agentes frente a cambios sensibles.',
    },
    {
      id: 'operations-guides-protocol',
      title: 'Las guias operativas deben tener limites, diagnostico y senales de escala',
      description:
        'Una guia reutilizable para agentes debe definir alcance permitido, alcance prohibido, patron de diagnostico, protocolo de intervencion, validaciones y senales de alto riesgo.',
      severity: 'MEDIA',
      domain: 'operations',
      taskTypes: ['documentacion', 'operacion-transversal'],
      technologies: ['Documentacion'],
      examples: {
        angular: {
          code: `## Regla de Oro
Diagnosticar primero, corregir despues.

## Alcance Prohibido
- no tocar formulas de negocio

## Senales de Alto Riesgo
- cambio transversal
- contrato compartido`,
          description: 'La guia operativa oficial funciona como protocolo defensivo.',
        },
      },
      sourceDocuments: [
        'docs/conventions/operations/guides-creation-protocol.md',
        'docs/guides/GUIDE_AGENT_INSTRUCTIONS.md',
      ],
      importance:
        'Permite que distintos agentes ejecuten intervenciones sensibles con el mismo criterio.',
    },
    {
      id: 'operations-module-documentation-levels',
      title: 'La documentacion de modulo tiene niveles oficiales y nunca se duplica',
      description:
        'El README y la documentacion tecnica del modulo tienen ubicaciones y cobertura definidas. Si ya existe un documento oficial, se actualiza.',
      severity: 'MEDIA',
      domain: 'operations',
      taskTypes: ['documentacion', 'auditoria'],
      technologies: ['Documentacion'],
      examples: {
        angular: {
          code: `// OK
api/LuxuryApp.Application/Moduls/ModuloLuxuryApp/README.md
api/LuxuryApp.Application/Moduls/ModuloLuxuryApp/Docs/documentacion-modulo.md

// NO
README-v2.md
documentacion-final-modulo.md`,
          description: 'La documentacion del modulo debe mantenerse en el archivo oficial.',
        },
      },
      sourceDocuments: ['docs/conventions/operations/module-documentation-instructions.md'],
      importance:
        'Evita dispersion documental y ayuda a que auditoria y remediacion apunten al mismo documento.',
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
      id: 'audit-business-invariants',
      title: 'Toda auditoria debe validar reglas de negocio, duplicidades y solapamientos',
      description:
        'El auditor debe identificar reglas criticas del modulo y probar escenarios negativos: duplicados, solapamientos, doble submit, concurrencia, transiciones invalidas y huecos de validacion entre capas.',
      severity: 'CRÍTICA',
      domain: 'audit',
      taskTypes: ['auditoria'],
      technologies: ['Angular', '.NET', 'SQL', 'Documentacion'],
      examples: {
        angular: {
          code: `// Validar invariantes criticas del modulo
// Amenidades: impedir reservas solapadas
// Vacaciones: impedir dos solicitudes aprobadas el mismo dia
// Pagos: impedir doble aplicacion por doble click o reintento`,
          description:
            'La auditoria debe probar escenarios negativos, duplicidades y huecos de validacion entre capas.',
        },
      },
      sourceDocuments: [
        'docs/conventions/audit/audit-module-conventions.md',
        'docs/conventions/audit/audit-checklist.md',
      ],
      importance:
        'Evita falsos positivos de auditoria y detecta fallos reales de flujo y negocio.',
    },
    {
      id: 'operations-available-features',
      title: 'Antes de codificar, consulta features disponibles y checklist',
      description:
        'El sistema operacional define que dependencias y patrones estan aprobados, y que validaciones minimas deben completarse antes de escribir codigo.',
      severity: 'ALTA',
      domain: 'operations',
      taskTypes: [
        'implementacion-backend',
        'implementacion-frontend',
        'implementacion-flutter',
      ],
      technologies: ['Documentacion'],
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
      technologies: ['Documentacion'],
      examples: {},
      sourceDocuments: ['docs/conventions/operations/module-documentation-instructions.md'],
      importance: 'Evita dispersion documental y mantiene trazabilidad.',
    },
    {
      id: 'core-viewer-subordinated-governance',
      title: 'El conventions-viewer es capa subordinada y debe mantenerse sincronizado',
      description:
        'El viewer no es fuente de verdad. Si cambia una regla oficial, debe evaluarse y actualizarse su representacion visual y operativa para no propagar gobernanza vieja o incompleta.',
      severity: 'ALTA',
      domain: 'core',
      taskTypes: ['documentacion', 'operacion-transversal', 'auditoria'],
      technologies: ['Angular', 'Documentacion'],
      examples: {
        angular: {
          code: `// Cambio oficial en convenciones
// 1. actualizar CONVENTIONS.md
// 2. actualizar documento especializado
// 3. revisar conventions-viewer
// 4. validar filtros, dataset y etiquetas`,
          description:
            'La sincronizacion del viewer forma parte del mantenimiento del sistema de convenciones.',
        },
      },
      sourceDocuments: [
        'CONVENTIONS.md',
        'docs/conventions/ui/conventions-viewer-governance.md',
      ],
      importance:
        'Evita que agentes o developers consulten una capa visual con taxonomia vieja o reglas incompletas.',
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
          code: `// OK
// Si no existe la regla para una estructura nueva:
// 1. proponerla
// 2. esperar aprobacion
// 3. registrarla en el sistema oficial

// NO
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
    {
      id: 'backend-dto-one-file-per-dto',
      title: 'DTOs: 1 Archivo = 1 DTO (REGLA CRÍTICA)',
      description:
        'Cada DTO debe estar en su propio archivo. NUNCA múltiples DTOs (records, classes) en un mismo archivo. Esto facilita navegación, reduce conflictos de PR, sigue Single Responsibility y mejora indexación de IDEs.',
      severity: 'CRÍTICA',
      domain: 'backend',
      taskTypes: ['implementacion-backend', 'auditoria'],
      technologies: ['.NET', 'C#'],
      examples: {
        dotnet: {
          code: `// ❌ MAL: ReportResultItemDTO.cs (múltiples DTOs)
public record ReportResultItemDTO { ... }
public record ReportImageDTO { ... }      // ← PROHIBIDO
public record ReportFilterDTO { ... }     // ← PROHIBIDO

// ✅ BIEN: Archivo separado para cada DTO
// ReportResultItemDTO.cs → solo ReportResultItemDTO
// ReportImageDTO.cs → solo ReportImageDTO
// ReportFilterDTO.cs → solo ReportFilterDTO`,
          description:
            '1 archivo = 1 DTO. Nunca múltiples registros o clases DTO en un mismo archivo. Facilita mantenimiento y reduce conflictos.',
        },
      },
      sourceDocuments: [
        'docs/conventions/backend/dto-file-organization-rule.md',
        'docs/conventions/backend/backend-rules.md',
        'CONVENTIONS.md §6.1',
      ],
      importance:
        'Cumplimiento obligatorio en toda auditoría. Violación = Hallazgo CRÍTICO. Refactorizar en 1-2 sprints.',
    },
    {
      id: 'backend-multipart-fromform',
      title: 'Endpoints multipart/form-data exigen [FromForm] (HTTP 415)',
      description:
        'Todo endpoint Minimal API cuyo DTO reciba archivos (IFormFile) debe declarar [FromForm] en el parámetro DTO y usar .DisableAntiforgery(). Sin [FromForm], ASP.NET Core asume cuerpo JSON y responde 415 Unsupported Media Type (content-length: 0) aunque el multipart enviado por el frontend este bien formado. [FromBody] = JSON; [FromForm] = multipart. El frontend nunca fija Content-Type manual al enviar FormData (el navegador agrega el boundary). Diagnóstico rapido: 415 con content-length 0 en POST/PUT multipart == endpoint sin [FromForm]. Caso real 2026-08-12: módulo RecepcionPipasAgua, subida de fotos fallaba por esto; fix replicando el patrón de TasksEndpoints.cs.',
      severity: 'CRÍTICA',
      domain: 'backend',
      taskTypes: ['implementacion-backend', 'auditoria'],
      technologies: ['.NET', 'C#'],
      examples: {
        dotnet: {
          code: `// ✅ CORRECTO (patrón vigente en TasksEndpoints.cs)
group.MapPost("", async ([FromForm] RecepcionPipaAguaAddDTO DTO, IRecepcionPipasAguaAppService appService) =>
    TypedResults.Ok(await appService.AddAsync(DTO)))
    .DisableAntiforgery();

// ❌ PROHIBIDO → responde 415 al recibir FormData
group.MapPost("", async (RecepcionPipaAguaAddDTO DTO, IRecepcionPipasAguaAppService appService) => ...);`,
          description:
            'Endpoint con IFormFile sin [FromForm] = 415 Unsupported Media Type. Auditoría: hallazgo CRÍTICO.',
        },
      },
      sourceDocuments: [
        'docs/conventions/backend/backend-rules.md',
        'docs/conventions/backend/document-read-write-pattern.md',
        'CONVENTIONS.md §6.1',
      ],
      importance:
        'Evita el 415 en subidas de archivos/imágenes. Revisar todo MapPost/MapPut con DTO de IFormFile.',
    },
    {
      id: 'operations-fase-0-mandatory',
      title: 'FASE 0: Business Rules Discovery es obligatoria antes de cualquier plan',
      description:
        'Toda solicitud de modulo nuevo, migracion mayor o caracteristica transversal requiere completar FASE 0 antes de escribir el plan formal. FASE 0 incluye Problem Statement, Matriz de Reglas de Negocio (4 niveles), y Pre-Mortem. Sin FASE 0, el plan es rechazado.',
      severity: 'CRÍTICA',
      domain: 'operations',
      taskTypes: ['creacion-modulo-fase-0'],
      technologies: ['Documentacion'],
      examples: {
        dotnet: {
          code: `// FASE 0 - Estructura obligatoria:
// 0.1 Problem Statement + KPIs
// "Actualmente [ACTOR] sufre [PROBLEMA] cuando [ACCION], resultando [CONSECUENCIA]"
// KPIs: baseline → target, timeline, verificacion

// 0.2 Matriz de Reglas (4 Niveles)
// RN-MOD-001 (Nivel 1 - Invariante): "Todo X debe..."
// RN-MOD-010 (Nivel 2 - Flujo): "X transiciona: STATE1 → STATE2"
// RN-MOD-020 (Nivel 3 - Seguridad): "Solo ROLE puede..."
// RN-MOD-030 (Nivel 4 - Validacion): "Campo X debe ser..."`

,
          description: 'FASE 0 es documentacion, no codigo. Pero es obligatoria y verificable.',
        },
      },
      sourceDocuments: [
        'docs/conventions/operations/fase-0-business-rules-discovery.md',
        'docs/conventions/operations/plan-creation-protocol.md',
        'CONVENTIONS.md',
      ],
      importance:
        'Evita planes incompletos, reduce retrabajo en implementacion y garantiza trazabilidad auditoria→codigo.',
    },
    {
      id: 'operations-business-rules-four-levels',
      title: 'Reglas de Negocio: 4 niveles jerarquicos obligatorios (RN-MOD-NNN)',
      description:
        'Toda Regla de Negocio se numera RN-MOD-NNN y se clasifica en: Nivel 1 (Invariantes), Nivel 2 (Flujo/Estados), Nivel 3 (Seguridad/RBAC), Nivel 4 (Validacion de Datos). Esta taxonomia es obligatoria en FASE 0, plan y auditoria.',
      severity: 'CRÍTICA',
      domain: 'operations',
      taskTypes: ['creacion-modulo-fase-0', 'auditoria'],
      technologies: ['Documentacion'],
      examples: {
        dotnet: {
          code: `// Nivel 1 - Invariantes de Dominio (nunca cambian)
// RN-ACC-001: "Todo visitante debe tener QR único válido"

// Nivel 2 - Flujo y Estados
// RN-ACC-010: "Visitante: PENDING → CHECKED_IN → ACTIVE → CHECKED_OUT"

// Nivel 3 - Seguridad/Autorización (RBAC)
// RN-ACC-020: "Solo Admin/Manager pueden GENERAR QR"

// Nivel 4 - Validación de Datos
// RN-ACC-030: "QR expira en 24h (configurable por tenant)"`,
          description: 'Los 4 niveles cubren dominio, flujo, seguridad y validacion.',
        },
      },
      sourceDocuments: [
        'docs/conventions/operations/fase-0-business-rules-discovery.md',
        'docs/reporte_maestro/AUDIT_AGENT_INSTRUCTIONS.md',
      ],
      importance:
        'Garantiza consistencia entre plan, codigo e auditoria. Cada RN es trazable de principio a fin.',
    },
    {
      id: 'audit-fase-0-traceability',
      title: 'Auditoria verifica trazabilidad: FASE 0 → Plan → Codigo',
      description:
        'Cuando se audita un modulo, toda Regla de Negocio debe trazarse: existe en FASE 0 → mapeada en plan (seccion 3) → implementada en codigo (archivo:linea). Si una RN no aparece en codigo, es un hallazgo de auditoria.',
      severity: 'ALTA',
      domain: 'audit',
      taskTypes: ['auditoria', 'creacion-modulo-fase-0'],
      technologies: ['Documentacion', '.NET', 'Angular'],
      examples: {
        dotnet: {
          code: `// AUDITORIA: Verificar trazabilidad
// RN-ACC-001 (FASE 0) → Plan Sección 3 → Codigo:
// backend: api/LuxuryApp.Application/Services/VisitorAccessService.cs:42
// frontend: client/angular/.../visitor-access/services/visitor-access.service.ts:15

// Si RN no está en codigo → Hallazgo crítico
// Accion: Plan de remediacion`,
          description: 'La trazabilidad es el puente entre reglas y implementacion.',
        },
      },
      sourceDocuments: [
        'docs/reporte_maestro/AUDIT_AGENT_INSTRUCTIONS.md',
        'docs/conventions/audit/audit-module-conventions.md',
      ],
      importance:
        'Detecta brechas entre lo planeado y lo implementado. Garantiza que codigo cumple reglas de negocio.',
    },
    {
      id: 'audit-framework-exhaustive-2026-08-10',
      title: 'Framework de Auditoria Exhaustiva (CRÍTICA)',
      description:
        'Use el framework de auditoria completo de 2026-08-10: AUDIT_PROMPT_COMPREHENSIVE.md (template), AUDIT_CHECKLIST_COMPLETO.md (checklist interactivo), EJEMPLO_AUDITORIA_CANDIDATES.md (aplicacion real). Audite 4 niveles de RN y busque 6 tipos de errores de lógica.',
      severity: 'CRÍTICA',
      domain: 'audit',
      taskTypes: ['auditoria', 'documentacion'],
      technologies: ['Documentacion'],
      examples: {},
      sourceDocuments: [
        'docs/audit/AUDIT_PROMPT_COMPREHENSIVE.md',
        'docs/audit/AUDIT_CHECKLIST_COMPLETO.md',
        'docs/audit/EJEMPLO_AUDITORIA_CANDIDATES.md',
        'docs/audit/20260810-auditoria-conventions-md.md',
      ],
      importance:
        'Estandariza auditoria exhaustiva. Busca: estructura (entidades, DTOs), validaciones, permisos, flujos, errores lógica, inconsistencias front/back.',
    },
    {
      id: 'documentation-module-structure-six-documents',
      title: 'Documentacion de Modulo Existente: 6 documentos obligatorios (§4.7)',
      description:
        'Todo modulo documentado tiene estructura de 6 documentos: Backend README (Nivel 1) + Técnica (Nivel 2), Frontend README + Setup + Decisiones, y Auditoria ejecutada. Esta estructura es obligatoria segun CONVENTIONS.md §4.5 y §4.7.',
      severity: 'CRÍTICA',
      domain: 'operations',
      taskTypes: ['documentacion', 'auditoria'],
      technologies: ['Documentacion', '.NET', 'Angular'],
      examples: {
        dotnet: {
          code: `Backend Nivel 1: api/Moduls/[Module]/README.md
          - Propósito, endpoints (tabla), actores, dependencias, RNs

Backend Nivel 2: api/Moduls/[Module]/Docs/documentacion-[modulo].md
          - Técnico: entidades, validaciones, flujos, servicios, BD, performance`,
          description: 'Backend requiere 2 documentos con roles diferenciados.',
        },
        angular: {
          code: `Frontend README: client/angular/.../[modulo]/docs/README.md
          - Rutas, componentes, servicios, data flow, debug tips

Frontend Setup: client/angular/.../[modulo]/docs/setup.md
          - Onboarding 30 min para dev nuevo, primer cambio

Frontend Decisiones: client/angular/.../[modulo]/docs/decisiones.md
          - Matriz: "¿Dónde pongo feature X?" con ejemplos`,
          description: 'Frontend requiere 3 documentos: operativo, onboarding, matriz.',
        },
      },
      sourceDocuments: [
        'CONVENTIONS.md §4.5',
        'CONVENTIONS.md §4.7',
        'docs/conventions/operations/module-documentation-instructions.md',
        'docs/guides/GUIA_DELEGACION_DOCUMENTACION_MODULOS.md',
      ],
      importance:
        'Asegura consistencia en documentacion de modulos. Centraliza: operativo, onboarding, matriz decisiones, auditoria en ubicaciones predecibles.',
    },
    {
      id: 'documentation-precedence-module-docs',
      title: 'Precedencia Documental: [module]/docs/ es nivel 4 oficial',
      description:
        'En jerarquia de precedencia (CONVENTIONS.md §2), documentacion descentralizada en [module]/docs/ (backend y frontend) es nivel 4 oficial, ENTRE documentos especializados (nivel 3) y documentacion tecnica de apoyo (nivel 5).',
      severity: 'ALTA',
      domain: 'operations',
      taskTypes: ['documentacion', 'auditoria', 'operacion-transversal'],
      technologies: ['Documentacion'],
      examples: {},
      sourceDocuments: [
        'CONVENTIONS.md §2 (Precedencia Documental)',
        'CONVENTIONS.md §4.7 (Documentacion de Modulo Existente)',
      ],
      importance:
        'Resuelve ambigüedad sobre autoridad de documentos. Si hay conflicto entre docs/architecture y [module]/docs, documentacion de modulo es fuente de verdad operativa (vivo), arquitectura es permanente (decisiones).',
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
