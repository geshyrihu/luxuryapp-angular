import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ConventionRule {
  id: string;
  section: number;
  title: string;
  description: string;
  severity: 'CRÍTICA' | 'ALTA' | 'MEDIA' | 'BAJA';
  technologies: string[];
  examples: {
    angular?: { code: string; description: string };
    dotnet?: { code: string; description: string };
    flutter?: { code: string; description: string };
  };
  relatedSections?: number[];
  importance: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConventionsService {
  private readonly conventions: ConventionRule[] = [
    // Sección 1: Stack y Arquitectura
    {
      id: 'stack-backend-dotnet',
      section: 1,
      title: 'Backend: .NET 10, Native AOT, Minimal APIs, EF Core 10',
      description:
        'Backend obligatorio con .NET 10, Minimal APIs (no MVC), EF Core 10, Vertical Slice Architecture, Native AOT compatible.',
      severity: 'CRÍTICA',
      technologies: ['.NET', 'C#'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN (.NET 10)
#nullable disable
using LuxuryApp.Application.EndPoints.Users;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();  // Native OpenAPI
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseHttpsRedirection();
app.MapOpenApi();
app.MapEndpoints();  // Auto-discovery IEndpointModule

app.Run();

// ❌ MAL (MVC Controller)
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase { }`,
          description: 'Minimal APIs, sin MVC controllers, Native AOT compatible',
        },
      },
      relatedSections: [9],
      importance: 'Performance nativo, startup rápido, footprint pequeño',
    },

    {
      id: 'stack-frontend-angular',
      section: 1,
      title: 'Frontend: Angular 22 (Standalone, Signals, New Control Flow)',
      description:
        'Angular 22 obligatorio con: standalone components (implícito), Signals (signal/computed/effect), New Control Flow (@if/@for/@switch), OnPush, Strict TypeScript.',
      severity: 'CRÍTICA',
      technologies: ['Angular', 'TypeScript'],
      examples: {
        angular: {
          code: `// ✅ BIEN (Angular 22 Standalone)
import { signal, computed } from '@angular/core';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, CustomInputComponent],
  templateUrl: './user-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  users = signal<UserDTO[]>([]);
  filter = signal('');

  filteredUsers = computed(() =>
    this.users().filter(u =>
      u.name.includes(this.filter())
    )
  );
}

<!-- Template: New Control Flow -->
@if (filteredUsers().length > 0) {
  @for (user of filteredUsers(); track user.id) {
    <app-user-card [user]="user" />
  }
} @else {
  <p>No hay usuarios</p>
}`,
          description: 'Standalone implícito, Signals, @if/@for sin *ngIf/*ngFor',
        },
      },
      relatedSections: [2, 15],
      importance: 'Moderna, performance, tree-shakeable, menor boilerplate',
    },

    {
      id: 'stack-design-system',
      section: 1,
      title: 'Design System: @ui/* Centralizado (PrimeNG/Ionic)',
      description:
        'Catálogo único de componentes en @ui/*. PROHIBIDO importar primeng o @ionic directamente. Todos los componentes pasan por wrapper en catálogo.',
      severity: 'CRÍTICA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `// ✅ BIEN (@ui/*)
import { CustomInputComponent } from '@ui/shared/custom-input/custom-input';
import { MobileListItem } from '@ui/mobile/list-item/list-item';

@Component({
  selector: 'app-form',
  imports: [CustomInputComponent, MobileListItem],
  template: '<app-custom-input />'
})
export class Form { }

// ❌ MAL (importación directa)
import { InputTextModule } from 'primeng/inputtext';
import { IonInput } from '@ionic/angular';`,
          description: 'Catálogo centralizado permite refactor visual global sin impacto en features',
        },
      },
      relatedSections: [5],
      importance: 'Consistencia visual, cambios de diseño centralizados, no-breaking',
    },

    {
      id: 'stack-guid-v7',
      section: 1,
      title: 'IDs: Guid.CreateVersion7() (Backend) / string (Frontend)',
      description:
        'Backend: usar Guid.CreateVersion7() (sortable, monotonic). Frontend: string para IDs que vienen del backend. NUNCA hardcodear IDs, usar tokens.',
      severity: 'ALTA',
      technologies: ['.NET', 'Angular'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN (Guid v7 - sortable)
public class User
{
    public Guid Id { get; set; } = Guid.CreateVersion7();  // Sortable
    public string Name { get; set; }
}

// ❌ MAL (GUID v4 - random)
public Guid Id { get; set; } = Guid.NewGuid();  // Random, no sortable`,
          description: 'Guid v7 es sortable (mejor para índices), v4 es random',
        },
        angular: {
          code: `// ✅ BIEN (string IDs del backend)
export interface UserDTO {
  id: string;  // ← Del backend (Guid.CreateVersion7())
  name: string;
}

@Component(...)
export class UserDetails {
  userId = input<string>();  // ← String del backend
}`,
          description: 'Frontend recibe IDs como string del backend',
        },
      },
      relatedSections: [9],
      importance: 'Performance (sortable GUIDs), no collision, sequence tracking',
    },

    // Sección 2: Angular 22 (Completas)
    {
      id: 'angular-signals-api',
      section: 2,
      title: 'Signals API: signal(), computed(), effect(), linkedSignal, resource',
      description:
        'Reemplazar RxJS con Signals. signal() para estado, computed() para derivaciones, effect() para side effects, resource() para async.',
      severity: 'ALTA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `// ✅ BIEN (Signals)
import { signal, computed, effect, resource } from '@angular/core';

export class UserComponent {
  users = signal<UserDTO[]>([]);
  filter = signal('');

  // Derivación
  filteredUsers = computed(() =>
    this.users().filter(u =>
      u.name.toLowerCase().includes(this.filter().toLowerCase())
    )
  );

  // Async con resource
  usersResource = resource({
    request: () => ({ filter: this.filter() }),
    loader: ({ request }) => this.api.getUsers(request.filter),
  });

  // Side effect
  constructor() {
    effect(() => {
      console.log('Filter changed:', this.filter());
    });
  }
}

// ❌ MAL (RxJS)
users$ = this.api.getUsers().pipe(
  combineLatestWith(this.filter$),
  map(([users, filter]) => users.filter(u => u.name.includes(filter)))
);`,
          description: 'Signals: simpler, mejor performance que RxJS en este contexto',
        },
      },
      relatedSections: [8],
      importance: 'Performance, simpler mental model, built-in Angular 16+',
    },

    {
      id: 'angular-input-output-model',
      section: 2,
      title: 'Input/Output/Model: Usar input()/output()/model() (NO @Input/@Output)',
      description:
        'PROHIBIDO @Input/@Output/@ViewChild. Usar signal-based API: input(), output(), model() desde Angular 17.1+.',
      severity: 'ALTA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `// ✅ BIEN (Signal-based)
import { Component, input, output, model } from '@angular/core';

@Component({
  selector: 'app-user-form',
  template: '<input [ngModel]="name()" (ngModelChange)="name.set($event)">'
})
export class UserForm {
  name = model('');  // input + output combinados
  userId = input<string>();  // readonly input
  saved = output<UserDTO>();

  onSave() {
    this.saved.emit(/* data */);
  }
}

// ❌ MAL (@Input/@Output)
@Component(...)
export class UserFormOld {
  @Input() name = '';
  @Output() saved = new EventEmitter<UserDTO>();
  @ViewChild('input') inputRef!: ElementRef;
}`,
          description: 'Signal-based: no decorators, cleaner, better type safety',
        },
      },
      relatedSections: [8],
      importance: 'Cleaner API, better type inference, no decorators',
    },

    {
      id: 'angular-defer',
      section: 2,
      title: 'Performance: @defer para Lazy Loading de Componentes',
      description:
        '@defer hace lazy loading automático de componentes. when/on triggers para cargar on-demand. Reduce bundle inicial.',
      severity: 'ALTA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `<!-- ✅ BIEN (@defer) -->
<!-- Lazy load en primer scroll -->
@defer (on viewport) {
  <app-heavy-chart-component />
} @placeholder {
  <p>Cargando gráfico...</p>
}

<!-- Lazy load en click -->
@defer (on interaction) {
  <app-modal-content />
} @placeholder {
  <button>Click para abrir</button>
}

<!-- Lazy load con timeout -->
@defer (on timer(5000)) {
  <app-notifications />
}

<!-- ❌ MAL (eager loading todo) -->
<app-heavy-chart-component />  <!-- Carga inmediatamente -->
<app-notifications />           <!-- Carga inmediatamente -->`,
          description: '@defer: automatic code-splitting, cargar cuando se necesita',
        },
      },
      relatedSections: [15],
      importance: 'Performance: bundle más pequeño, carga lo que se usa',
    },

    {
      id: 'angular-formhelper',
      section: 2,
      title: 'Forms: FormHelper.submitCrud() para CRUD Estándar',
      description:
        'Formularios CRUD usan FormHelper.submitCrud(). Validación automática, loading, error handling, toast notifications.',
      severity: 'ALTA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `// ✅ BIEN (FormHelper)
import { FormHelper } from '@core/helpers/form-helper';

@Component({...})
export class UserFormComponent {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private formHelper: FormHelper) {}

  onSubmit() {
    this.formHelper.submitCrud({
      form: this.form,
      api: this.apiResponseService,
      endpoint: 'users',
      method: this.isEdit ? 'put' : 'post',
      successMessage: 'Usuario guardado',
      onSuccess: () => this.router.navigate(['/users']),
    });
  }
}

// ❌ MAL (manual sin helper)
onSubmit() {
  if (this.form.invalid) return;
  this.api.post('users', this.form.value).subscribe(
    () => this.showToast('Guardado'),
    (error) => this.showError(error),
  );
}`,
          description: 'FormHelper: CRUD con validación, loading, error handling automático',
        },
      },
      relatedSections: [4],
      importance: 'DRY: evita repetir código CRUD, consistencia en UX',
    },

    {
      id: 'angular-mobile-version',
      section: 2,
      title: 'Mobile: Versión Móvil Obligatoria en Cada CRUD',
      description:
        'Cada módulo CRUD debe tener versión móvil. Patrón B (§15): XWebComponent + XMobileComponent con wrapper adaptativo.',
      severity: 'ALTA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `// ✅ BIEN (Patrón B: Web + Mobile)
// user-list.ts (adaptativo)
import { UserListWeb } from './user-list-web';
import { UserListMobile } from './user-list-mobile';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, UserListWeb, UserListMobile],
  template: \`
    @if (isMobile()) {
      <app-user-list-mobile />
    } @else {
      <app-user-list-web />
    }
  \`,
})
export class UserList {
  isMobile = computed(() => this.viewport.isMobile());
  constructor(private viewport: ViewportService) {}
}

// ❌ MAL (solo desktop)
export class UserList {
  // Solo p-table, sin versión mobile
}`,
          description: 'Patrón B: adaptativo, X-Web + X-Mobile reutilizables',
        },
      },
      relatedSections: [15],
      importance: 'UX consistente mobile/desktop, no gap funcional por plataforma',
    },

    {
      id: 'angular-strict-ts',
      section: 2,
      title: 'TypeScript Strict Mode Obligatorio',
      description:
        'Todos los proyectos Angular DEBEN tener "strict": true en tsconfig.json. Cero tolerancia con "any".',
      severity: 'CRÍTICA',
      technologies: ['Angular', 'TypeScript'],
      examples: {
        angular: {
          code: `// ✅ BIEN
interface UserDTO {
  id: string;
  name: string;
  email: string;
}

export class UserService {
  getUser(id: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(\`/api/users/\${id}\`);
  }
}`,
          description: 'Tipos explícitos en todas partes',
        },
      },
      relatedSections: [7, 8],
      importance:
        'Evita bugs en runtime, mejora mantenibilidad, IDE tooling completo',
    },

    {
      id: 'angular-onpush',
      section: 2,
      title: 'ChangeDetectionStrategy.OnPush Obligatorio',
      description:
        'TODOS los componentes Angular DEBEN usar ChangeDetectionStrategy.OnPush. Optimiza performance.',
      severity: 'CRÍTICA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `// ✅ BIEN
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.html',
  styleUrls: ['./user-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,  // ← OBLIGATORIO
})
export class UserCard {
  @Input() user!: UserDTO;
}`,
          description:
            'Strategy OnPush reduce ciclos de detección de cambios 70-90%',
        },
      },
      relatedSections: [15],
      importance:
        'Performance crítico en listas grandes (1000+ items), UI responsive',
    },

    {
      id: 'angular-standalone',
      section: 2,
      title: 'Componentes Standalone Obligatorios',
      description:
        'Angular 22: TODOS los componentes nuevos DEBEN ser standalone (implícito). NgModules solo para compatibilidad legacy.',
      severity: 'ALTA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `// ✅ BIEN (Standalone - Angular 22)
@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule, CustomInputComponent],
  templateUrl: './user-form.html',
  // standalone: true  ← Implícito en Angular 22, no hace falta
})
export class UserForm { }

// ❌ MAL (NgModule - Legacy)
@NgModule({
  declarations: [UserForm],
  imports: [CommonModule],
})
export class UserModule { }`,
          description: 'Componentes independientes, standalone es implícito, sin NgModule boilerplate',
        },
      },
      relatedSections: [3],
      importance: 'Reduce boilerplate 50%, facilita tree-shaking, lazy loading',
    },

    {
      id: 'angular-control-flow',
      section: 2,
      title: 'Control Flow con @if, @for (NO *ngIf, *ngFor)',
      description:
        'Angular 17+: Usa @if/@else/@for/@switch en lugar de directivas antiguas. Más limpio, mejor performance.',
      severity: 'ALTA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `<!-- ✅ BIEN (Angular 17+) -->
@if (users$ | async as users) {
  <div class="grid">
    @for (user of users; track user.id) {
      <app-user-card [user]="user" />
    }
  </div>
} @else {
  <p>No hay usuarios</p>
}

<!-- ❌ MAL (Antiguo) -->
<div class="grid" *ngIf="users$ | async as users">
  <app-user-card *ngFor="let user of users; trackBy: trackByUserId" [user]="user" />
</div>`,
          description:
            'Sintaxis moderna, mejor performance, sin trackBy confuso',
        },
      },
      relatedSections: [3, 8],
      importance:
        'Sintaxis más clara, evita bugs de rendering, better DOM handling',
    },

    // Sección 5: Catálogo UI
    {
      id: 'ui-catalog-only',
      section: 5,
      title: 'Nunca Importes PrimeNG/Ionic Directamente',
      description:
        'TODOS los componentes UI deben venir de @ui/* (catálogo centralizado). NUNCA importes primeng o ionic directamente.',
      severity: 'CRÍTICA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `// ✅ BIEN (Usar catálogo @ui/*)
import { CustomInputComponent } from '@ui/shared/custom-input/custom-input';
import { MobileListItem } from '@ui/mobile/list-item/list-item';

@Component({
  selector: 'app-form',
  imports: [CustomInputComponent, MobileListItem],
  template: '<app-custom-input />',
})
export class FormComponent { }

// ❌ MAL (Importación directa)
import { InputTextModule } from 'primeng/inputtext';
import { IonInput } from '@ionic/angular';`,
          description:
            'Centralizar UI en @ui/ permite cambios globales de diseño en 1 lugar',
        },
      },
      relatedSections: [6],
      importance:
        'Consistency global, cambios de design centralizados, evita duplicación',
    },

    // Sección 6: Wrappers
    {
      id: 'wrapper-suffix',
      section: 6,
      title: 'Wrappers DEBEN tener sufijo "-wrapper"',
      description:
        'Componentes wrapper para temas, layout, etc. DEBEN nombrarse con sufijo "-wrapper" (NO prefijo "wrapper-")',
      severity: 'ALTA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `// ✅ BIEN
// admin-wrapper.ts
// auth-wrapper.ts
// mobile-wrapper.ts

// ❌ MAL
// wrapper-admin.ts (prefijo, no sufijo)
// wrapper-mobile.ts`,
          description:
            'Convención clara: nombre-wrapper = estructura, no confundir con otros patrones',
        },
      },
      relatedSections: [7],
      importance: 'Naming consistency, fácil búsqueda, identifica propósito',
    },

    // Sección 7: Naming
    {
      id: 'naming-no-component-suffix',
      section: 7,
      title: 'Naming: SIN sufijo "Component"',
      description:
        'Archivos: user.ts (NO user.component.ts). El suffijo .component es innecesario, confunde en imports.',
      severity: 'MEDIA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `// ✅ BIEN (Sin sufijo .component)
// src/app/features/users/user.ts
// src/app/features/users/user-list.ts
// src/app/shared/ui/buttons/primary-button.ts

import { UserList } from '@features/users/user-list';

// ❌ MAL (.component innecesario)
// src/app/features/users/user.component.ts
// import { UserComponentList } from '@features/users/user-list.component';`,
          description:
            'Nombre sin sufijo es más limpio, imports más legibles',
        },
      },
      relatedSections: [8],
      importance: 'Consistency de naming, imports más legibles',
    },

    // Sección 9: Backend / Minimal APIs
    {
      id: 'minimal-api-only',
      section: 9,
      title: 'Backend: Minimal APIs OBLIGATORIO (NO MVC)',
      description:
        '.NET 10: TODOS los endpoints DEBEN ser Minimal APIs. MVC controllers están PROHIBIDOS (excepto legacy compatibility).',
      severity: 'CRÍTICA',
      technologies: ['.NET', 'C#'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN (Minimal API)
namespace LuxuryApp.Application.Endpoints.Users;

public class GetUserEndpoint : IEndpointModule
{
    public void MapEndpoint(RouteGroupBuilder group) =>
        group
            .WithName("GetUser")
            .WithOpenApi()
            .MapGet("/{id}")
            .Produces<ApiResponseDTO<UserDTO>>()
            .WithSummary("Obtener usuario por ID")
            .HandlerAsync(HandleAsync);

    public async Task<IResult> HandleAsync(
        string id,
        [FromServices] IUserRepository repository) =>
        (await repository.GetAsync(id)) is UserDTO user
            ? Results.Ok(new ApiResponseDTO<UserDTO>(data: user))
            : Results.NotFound();
}

// ❌ MAL (MVC Controller)
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDTO>> Get(string id) { }
}`,
          description: 'Minimal APIs: menos boilerplate, better performance',
        },
      },
      relatedSections: [16, 18],
      importance:
        'Arquitectura moderna, mejor performance, control explícito del routing',
    },

    {
      id: 'primary-constructors',
      section: 9,
      title: 'Primary Constructors: 100% Obligatorio',
      description:
        'C# 12: TODOS los servicios DEBEN usar Primary Constructors. Inyección más limpia.',
      severity: 'ALTA',
      technologies: ['.NET', 'C#'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN (Primary Constructor)
public class UserService(
    IUserRepository repository,
    ILogger<UserService> logger)
{
    public async Task<UserDTO> GetUserAsync(string id)
    {
        logger.LogInformation("Fetching user {UserId}", id);
        return await repository.GetAsync(id);
    }
}

// ❌ MAL (Tradicional)
public class UserService
{
    private readonly IUserRepository _repository;
    private readonly ILogger<UserService> _logger;

    public UserService(IUserRepository repository, ILogger<UserService> logger)
    {
        _repository = repository;
        _logger = logger;
    }
}`,
          description: 'Primary constructors: menos líneas, más limpio',
        },
      },
      relatedSections: [1],
      importance: 'Reduce boilerplate, mejor legibilidad, patrón moderno C# 12',
    },

    {
      id: 'api-response-dto',
      section: 9,
      title: 'ApiResponseDTO<T>: 100% de Endpoints',
      description:
        'TODOS los endpoints DEBEN retornar ApiResponseDTO<T>. Contrato consistente: data, success, message, errors.',
      severity: 'CRÍTICA',
      technologies: ['.NET'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN (Sempre ApiResponseDTO)
public class CreateUserEndpoint : IEndpointModule
{
    public async Task<IResult> HandleAsync(
        CreateUserRequest request,
        [FromServices] IUserService service)
    {
        var result = await service.CreateAsync(request);
        return result.IsSuccess
            ? Results.Created(\$"/users/{result.Data.Id}",
                new ApiResponseDTO<UserDTO>(data: result.Data))
            : Results.BadRequest(
                new ApiResponseDTO<UserDTO>(
                    success: false,
                    message: result.Error,
                    errors: new[] { result.Error }));
    }
}

// ❌ MAL (Respuesta inconsistente)
public async Task<UserDTO> CreateUser(CreateUserRequest request) { }
public async Task<IResult> DeleteUser(string id) { }`,
          description:
            'Contrato consistente en todos los endpoints, facilita frontend',
        },
      },
      relatedSections: [1, 16],
      importance:
        'API consistency, error handling uniforme, frontend puede asumir estructura',
    },

    // Sección 16: Testing
    {
      id: 'testing-coverage',
      section: 16,
      title: 'Testing: Cobertura Mínima 70%',
      description:
        'Todos los módulos DEBEN tener ≥70% code coverage. Tests unitarios + integración. Medido en CI/CD.',
      severity: 'ALTA',
      technologies: ['.NET', 'Angular'],
      examples: {
        dotnet: {
          code: `// Backend xUnit Test
public class UserServiceTests
{
    private readonly UserService _service;
    private readonly Mock<IUserRepository> _repositoryMock;

    public UserServiceTests()
    {
        _repositoryMock = new Mock<IUserRepository>();
        _service = new UserService(_repositoryMock.Object);
    }

    [Fact]
    public async Task GetUserAsync_WithValidId_ReturnsUser()
    {
        // Arrange
        var userId = "123";
        var expectedUser = new UserDTO { Id = userId, Name = "John" };
        _repositoryMock.Setup(r => r.GetAsync(userId))
            .ReturnsAsync(expectedUser);

        // Act
        var result = await _service.GetUserAsync(userId);

        // Assert
        Assert.Equal(expectedUser.Id, result.Id);
        _repositoryMock.Verify(r => r.GetAsync(userId), Times.Once);
    }
}`,
          description: 'Patrón AAA: Arrange → Act → Assert',
        },
        angular: {
          code: `// Angular Jasmine Test
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch user by id', () => {
    const userId = '123';
    const mockUser = { id: userId, name: 'John' };

    service.getUser(userId).subscribe((user) => {
      expect(user.id).toBe(userId);
    });

    const req = httpMock.expectOne(\`/api/users/\${userId}\`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  afterEach(() => httpMock.verify());
});`,
          description: 'Tests Angular con HttpTestingController',
        },
      },
      relatedSections: [9],
      importance:
        'Confiabilidad del código, documentación viva, catch bugs early',
    },

    // Sección 9: Backend (Completas)
    {
      id: 'backend-enum-string',
      section: 9,
      title: 'Enums en BD: Almacenar como string (NO enteros)',
      description:
        'Enums siempre se guardan como string en base de datos. Legibilidad en SQL, no magic numbers. Sincronizar valores C# ↔ TypeScript.',
      severity: 'ALTA',
      technologies: ['.NET'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN (string enum)
public enum UserRole
{
    [Display(Name = "Administrador")]
    Admin = 1,

    [Display(Name = "Usuario")]
    User = 2,
}

// En BD: guardar "Admin" o "User", NO 1 o 2

// ❌ MAL (entero en BD)
public enum UserRole { Admin = 1, User = 2 }
// Resultado: BD tiene 1, 2 (no se entiende qué significa)`,
          description: 'String enum: legible en SQL, sincronizar con frontend',
        },
      },
      relatedSections: [1],
      importance: 'Legibilidad SQL, debugging fácil, sincronización clara',
    },

    {
      id: 'backend-json-source-generator',
      section: 9,
      title: 'JSON: Source Generators (NUNCA reflexión)',
      description:
        'Usar [JsonSerializable] source generators. PROHIBIDO System.Text.Json con reflexión. Mejor performance, AOT-safe.',
      severity: 'ALTA',
      technologies: ['.NET'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN (Source Generator)
[JsonSerializable]
public class UserDTO
{
    public string Id { get; set; }
    public string Name { get; set; }
}

var options = new JsonSerializerOptions
{
    TypeInfoResolver = UserDTOJsonSerializerContext.Default
};
var json = JsonSerializer.Serialize(user, options);

// ❌ MAL (Reflexión)
var json = JsonSerializer.Serialize(user);  // Sin TypeInfoResolver`,
          description: 'Source generators: AOT-safe, mejor performance',
        },
      },
      relatedSections: [1],
      importance: 'AOT compatible, faster serialization, compile-time validation',
    },

    {
      id: 'backend-cache-hybrid',
      section: 9,
      title: 'Caché: HybridCache (NO IMemoryCache/IDistributedCache directo)',
      description:
        'Usar HybridCache (.NET 9+) en lugar de MemoryCache o DistributedCache directo. Combina L1 en-memory + L2 distribuido automáticamente.',
      severity: 'ALTA',
      technologies: ['.NET'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN (HybridCache)
public class UserRepository(HybridCache cache, IDbConnection db)
{
    public async Task<UserDTO> GetAsync(string id)
    {
        return await cache.GetOrCreateAsync(
            $"user:{id}",
            async ct => await db.QuerySingleAsync<UserDTO>(
                "SELECT * FROM Users WHERE Id = @id",
                new { id },
                cancellationToken: ct
            ),
            options: new HybridCacheEntryOptions { LocalCacheDuration = TimeSpan.FromMinutes(5) }
        );
    }
}

// ❌ MAL (MemoryCache directo)
_cache.Set(\$"user:{id}", user);  // Solo en-memory, no distribuido`,
          description: 'HybridCache: L1 en-memory + L2 distribuido automático',
        },
      },
      relatedSections: [1],
      importance: 'Performance en-memory + distribuido, scalable',
    },

    {
      id: 'backend-timeprovider',
      section: 9,
      title: 'Tiempo: NUNCA DateTime.UtcNow, Inyectar TimeProvider',
      description:
        'Inyectar ITimeProvider para testabilidad. PROHIBIDO DateTime.UtcNow o Task.Delay() directo. Permite mocks en tests.',
      severity: 'ALTA',
      technologies: ['.NET'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN (TimeProvider inyectado)
public class UserService(IUserRepository repo, TimeProvider timeProvider)
{
    public async Task<UserDTO> CreateAsync(CreateUserRequest request)
    {
        var user = new User
        {
            Id = Guid.CreateVersion7(),
            CreatedAt = timeProvider.GetUtcNow(),  // Inyectado
            Name = request.Name,
        };
        return await repo.CreateAsync(user);
    }
}

// Testing: mockear hora
var mockTime = new FakeTimeProvider(new DateTime(2026, 1, 1));
var service = new UserService(mockRepo, mockTime);

// ❌ MAL (DateTime.UtcNow directo)
var user = new User { CreatedAt = DateTime.UtcNow };  // No testeable`,
          description: 'TimeProvider: inyectable, testeable, mockeable',
        },
      },
      relatedSections: [16],
      importance: 'Testabilidad crítica, tiempo determinístico en tests',
    },

    {
      id: 'backend-efcore-notracking',
      section: 9,
      title: 'EF Core: .AsNoTracking() en Lecturas, Compiled Queries en Hot Paths',
      description:
        'Lecturas: .AsNoTracking(). Includes complejos: .AsSplitQuery(). Value objects: [ComplexType]. Hot paths: compiled queries.',
      severity: 'ALTA',
      technologies: ['.NET'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN (AsNoTracking + AsSplitQuery)
public class UserRepository(ApplicationDbContext db)
{
    public async Task<List<UserDTO>> GetAllAsync()
    {
        return await db.Users
            .AsNoTracking()  // No necesita seguimiento
            .Include(u => u.Orders)
                .ThenInclude(o => o.Items)
            .AsSplitQuery()  // Evita cartesian explosion
            .Select(u => new UserDTO { ... })
            .ToListAsync();
    }
}

// Hot path: compiled query
private static readonly Func<AppDb, string, Task<User?>> GetUserById =
    EF.CompileAsyncQuery((AppDb db, string id) =>
        db.Users.AsNoTracking().FirstOrDefault(u => u.Id == id)
    );

// ❌ MAL (con tracking innecesario)
var users = db.Users.Include(u => u.Orders).ToList();  // Tracking + N+1`,
          description: 'AsNoTracking: mejor performance, AsSplitQuery: evita cart product',
        },
      },
      relatedSections: [1],
      importance: 'Performance crítico en queries grandes, evita N+1',
    },

    // Sección 15: Responsive
    {
      id: 'responsive-mobile-first',
      section: 15,
      title: 'Responsive: Mobile-First (375px Base, Luego Tablet, Desktop)',
      description:
        'Base 375px (mobile), luego 768px (tablet), luego 1024px+ (desktop). Media queries deben ser min-width progresivo.',
      severity: 'ALTA',
      technologies: ['CSS', 'Angular'],
      examples: {
        angular: {
          code: `/* ✅ BIEN (Mobile-first) */
.container {
  width: 100%;
  padding: 1rem;
  /* Default: 375px mobile */
}

/* Tablet: 768px */
@media (min-width: 768px) {
  .container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 1.5rem;
  }
}

/* Desktop: 1024px */
@media (min-width: 1024px) {
  .container {
    grid-template-columns: repeat(3, 1fr);
    padding: 2rem;
    max-width: 1200px;
  }
}

/* ❌ MAL (Desktop-first) */
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 2rem;
}

@media (max-width: 1023px) {
  .container {
    grid-template-columns: repeat(2, 1fr);
  }
}`,
          description: 'Mobile-first: base 375px, luego media queries min-width',
        },
      },
      relatedSections: [3],
      importance: 'Performance: mobile es 60% tráfico, mejor UX móvil',
    },

    {
      id: 'responsive-patrón-b',
      section: 15,
      title: 'Patrón B: Componentes Separados (X-Web + X-Mobile)',
      description:
        'Para layouts muy diferentes: XWebComponent + XMobileComponent. Wrapper adaptativo decide cuál usar. Máximo rendimiento.',
      severity: 'ALTA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `// ✅ BIEN (Patrón B)
// user-list-web.ts (desktop)
@Component({
  selector: 'app-user-list-web',
  template: '<p-table [value]="users">...</p-table>'
})
export class UserListWeb { }

// user-list-mobile.ts (mobile)
@Component({
  selector: 'app-user-list-mobile',
  template: '<ion-list><ion-item *ngFor>...</ion-item></ion-list>'
})
export class UserListMobile { }

// user-list.ts (adaptativo)
@Component({
  selector: 'app-user-list',
  template: '@if (isMobile()) { <app-user-list-mobile /> } @else { <app-user-list-web /> }'
})
export class UserList {
  isMobile = computed(() => window.innerWidth < 768);
}

// ❌ MAL (un componente para ambos)
@Component({
  template: '<!-- p-table en mobile (terrible UX) -->'
})
export class UserList { }`,
          description: 'Componentes separados: máxima optimización, mejor UX por plataforma',
        },
      },
      relatedSections: [3],
      importance: 'UX óptimo por plataforma, bundle reduction, performance',
    },

    // Sección 16: Testing
    {
      id: 'testing-xunit-stack',
      section: 16,
      title: 'Testing Stack: xUnit, FluentAssertions, Moq, EF InMemory, Bogus',
      description:
        'Backend: xUnit para tests, FluentAssertions para assertions claras, Moq para mocks, EF InMemory para datos de test, Bogus para fixtures.',
      severity: 'ALTA',
      technologies: ['.NET'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN (xUnit + FluentAssertions + Moq)
public class UserServiceTests
{
    [Fact]
    public async Task CreateAsync_WithValidData_ReturnsUser()
    {
        // Arrange
        var request = new CreateUserRequest { Name = "John" };
        var repository = new Mock<IUserRepository>();
        var service = new UserService(repository.Object);

        // Act
        var result = await service.CreateAsync(request);

        // Assert
        result.Should()
            .NotBeNull()
            .And.HaveProperty(u => u.Name).Which.Should().Be("John");

        repository.Verify(
            r => r.CreateAsync(It.Is<User>(u => u.Name == "John")),
            Times.Once
        );
    }
}

// ❌ MAL (Assert tradicional)
Assert.NotNull(result);
Assert.Equal("John", result.Name);  // Menos legible`,
          description: 'xUnit + FluentAssertions: assertions claras, Moq para aislar',
        },
      },
      relatedSections: [1],
      importance: '70% cobertura obligatoria, tests mantenibles',
    },

    {
      id: 'testing-arrange-act-assert',
      section: 16,
      title: 'Testing: Patrón AAA (Arrange-Act-Assert)',
      description:
        'Todo test sigue: Arrange (setup), Act (ejecución), Assert (verificación). Una asertión por test si es posible.',
      severity: 'MEDIA',
      technologies: ['.NET'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN (AAA pattern)
[Fact]
public async Task GetAsync_WithValidId_ReturnsUser()
{
    // ARRANGE
    var userId = Guid.CreateVersion7();
    var expectedUser = new Bogus.Faker<UserDTO>()
        .RuleFor(u => u.Id, () => userId.ToString())
        .RuleFor(u => u.Name, f => f.Name.FirstName())
        .Generate();

    var repository = new Mock<IUserRepository>();
    repository
        .Setup(r => r.GetAsync(userId, default))
        .ReturnsAsync(expectedUser);

    var service = new UserService(repository.Object);

    // ACT
    var result = await service.GetAsync(userId);

    // ASSERT
    result.Should().BeEquivalentTo(expectedUser);
}

// ❌ MAL (sin separación clara)
[Fact]
public void Test() {
    var user = new User { Id = 1, Name = "John" };
    Assert.Equal("John", user.Name);
    Assert.NotNull(user);
    var result = Service.Create(user);
    Assert.NotNull(result);
}`,
          description: 'AAA: Arrange → Act → Assert, una idea por test',
        },
      },
      relatedSections: [1],
      importance: 'Legibilidad de tests, mantenibilidad a largo plazo',
    },

    // Sección 20: Planes
    {
      id: 'plan-structure',
      section: 20,
      title: 'Planes: Estructura Estándar 11 Secciones',
      description:
        'Todos los planes de implementación DEBEN seguir estructura: Resumen → Alcance → Fases → Timeline → Recursos → Riesgos → etc.',
      severity: 'MEDIA',
      technologies: ['Documentación'],
      examples: {
        angular: {
          code: `# Plan: Implementar Módulo Cobranza

## 1. Resumen Ejecutivo
[1-2 párrafos del qué y por qué]

## 2. Alcance
- ✅ Frontend: lista, CRUD, reportes
- ✅ Backend: Minimal APIs, paginación
- ❌ No incluye: integración contable

## 3. Arquitectura
[Diagrama: frontend + backend]

## 4. Fases
### Fase 1: Backend (SP: 8)
### Fase 2: Frontend (SP: 13)
### Fase 3: Testing & QA (SP: 5)

## 5. Timeline
- Semana 1-2: Backend
- Semana 2-3: Frontend
- Semana 3: QA

[continúa...]`,
          description: '11 secciones obligatorias en docs/plans/',
        },
      },
      relatedSections: [19, 21],
      importance: 'Claridad de requerimientos, timeline realista, tracking',
    },

    // Sección 9: Paginación Canónica
    {
      id: 'pagination-canonical',
      section: 9,
      title: 'Paginación Canónica: PaginationCommonDTO',
      description:
        'Contrato único de paginación (Frontend + Backend). Request: page, recordsNumber (≤200), filter, sortField, sortOrder. Response: ApiResponseDTO<PagedResultDTO<T>>. Backend: BindAsync (no [AsParameters]). Frontend: PaginationStore con Signals.',
      severity: 'ALTA',
      technologies: ['.NET', 'Angular'],
      examples: {
        dotnet: {
          code: `// Backend: Endpoint con BindAsync
public class GetUsersEndpoint : IEndpointModule
{
    public void MapEndpoint(RouteGroupBuilder group) =>
        group.MapGet("/")
            .Produces<ApiResponseDTO<PagedResultDTO<UserDTO>>>()
            .HandlerAsync(HandleAsync);

    public async Task<IResult> HandleAsync(
        PaginationCommonDTO pagination,  // ← BindAsync automático
        [FromServices] IUserRepository repository,
        CancellationToken ct)
    {
        var (items, total) = await repository
            .QueryAsNoTracking()
            .Where(u => u.Name.Contains(pagination.Filter ?? ""))
            .OrderBy(pagination.SortField ?? "name")
            .Paginate(pagination)  // Skip/Take
            .ToPagedResultAsync(total, ct);

        return Results.Ok(new ApiResponseDTO<PagedResultDTO<UserDTO>>(
            data: new { Items = items, TotalRecords = total }));
    }
}

// Query: GET /api/users?page=1&recordsNumber=30&filter=john&sortField=name
// Response: { data: { items: [...], totalRecords: 150 }, success: true }`,
          description: 'BindAsync lee defaults cuando faltan parámetros (page=1, recordsNumber=30)',
        },
        angular: {
          code: `// Frontend: PaginationStore con Signals
export class PaginationStore<T> {
  private items = signal<T[]>([]);
  private totalRecords = signal(0);
  private currentRequest = signal<PaginationRequest>(defaultPaginationRequest());

  items$ = this.items.asReadonly();
  totalRecords$ = this.totalRecords.asReadonly();
  pageCount = computed(() =>
    Math.ceil(this.totalRecords() / this.currentRequest().recordsNumber)
  );

  constructor(private api: ApiService) {}

  loadPage(req: PaginationRequest) {
    this.api.getUsers(req).subscribe(response => {
      this.items.set(response.items);
      this.totalRecords.set(response.totalRecords);
    });
  }
}

// Uso en componente
export class UsersListComponent {
  store = inject(PaginationStore<UserDTO>);

  ngOnInit() {
    this.store.loadPage(defaultPaginationRequest());
  }

  onSearch(query: string) {
    this.store.loadPage({
      ...this.store.currentRequest$(),
      page: 1,
      filter: query,
    });
  }
}`,
          description: 'Signals en lugar de Observables, Store gestiona estado paginado',
        },
      },
      relatedSections: [9, 4],
      importance:
        'Performance (Skip/Take en BD), UX consistente, contrato único evita bugs front-back',
    },

    // Sección 3: UX/UI — PrimeNG e Ionic
    {
      id: 'ui-primeng-table',
      section: 3,
      title: 'p-table: Virtual Scrolling, Filtros por Columna, Exportación',
      description:
        'p-table DEBE tener: virtual scrolling (rows grandes), filtros por columna, exportación CSV/Excel, lazy loading con paginación backend.',
      severity: 'ALTA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `<!-- ✅ BIEN (p-table con virtual scroll + lazy) -->
<p-table
  [value]="items$()"
  [lazy]="true"
  [virtualScroll]="true"
  [rows]="30"
  [totalRecords]="totalRecords$()"
  (onLazyLoad)="onLazyLoad($event)"
>
  <p-column field="name" header="Nombre" [sortable]="true" [filter]="true"></p-column>
  <p-column field="email" header="Email" [sortable]="true" [filter]="true"></p-column>
  <p-toolbar>
    <ng-template pTemplate="left">
      <button (click)="exportCSV()">Exportar CSV</button>
    </ng-template>
  </p-toolbar>
</p-table>

<!-- ❌ MAL (sin virtual scroll, datos en memoria) -->
<table *ngFor="let item of itemsLocal">
  <tr>...</tr>
</table>`,
          description: 'Virtual scrolling para listas grandes, lazy loading con backend',
        },
      },
      relatedSections: [15],
      importance: 'Performance en listas 1000+, mejor UX, escalable',
    },

    {
      id: 'ui-ionic-patterns',
      section: 3,
      title: 'Ionic 8: ion-infinite-scroll, ion-refresher, ion-item-sliding',
      description:
        'Mobile: OBLIGATORIO usar ion-infinite-scroll (lazy loading), ion-refresher (pull-to-refresh), ion-item-sliding (swipe actions).',
      severity: 'ALTA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `<!-- ✅ BIEN (Ionic patterns) -->
<ion-content>
  <ion-refresher (ionRefresh)="doRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>

  <ion-item-group *ngFor="let item of items">
    <ion-item-sliding>
      <ion-item>{{ item.name }}</ion-item>
      <ion-item-options side="end">
        <ion-item-option (click)="delete(item.id)">Delete</ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-item-group>

  <ion-infinite-scroll (ionInfinite)="loadMore($event)">
    <ion-infinite-scroll-content></ion-infinite-scroll-content>
  </ion-infinite-scroll>
</ion-content>`,
          description: 'Pull-to-refresh, swipe actions, infinite scroll en mobile',
        },
      },
      relatedSections: [15],
      importance: 'UX mobile nativo, esperado por usuarios móviles',
    },

    // Sección 4: Acceso a API
    {
      id: 'api-access-service',
      section: 4,
      title: 'Acceso API: SOLO ApiResponseService (NO HttpClient directo)',
      description:
        'PROHIBIDO HttpClient directo o *-api.service.ts. Todo HTTP pasa por ApiResponseService con métodos: onGetList, onGetPaged, onGetItem, onPost, onPut, onPatch, onDelete.',
      severity: 'CRÍTICA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `// ✅ BIEN (ApiResponseService)
import { ApiResponseService } from '@core/services';

@Injectable()
export class UserFacade {
  constructor(private api: ApiResponseService) {}

  getUsers(pagination: PaginationRequest) {
    return this.api.onGetPaged<UserDTO>(
      'users',
      pagination
    );
  }

  createUser(user: CreateUserRequest) {
    return this.api.onPost<UserDTO>('users', user);
  }
}

// ❌ MAL (HttpClient directo)
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserApiService {
  constructor(private http: HttpClient) {}
  getUsers() {
    return this.http.get('/api/users');
  }
}`,
          description: 'Centralizar HTTP en service único, error handling consistente',
        },
      },
      relatedSections: [9],
      importance: 'Consistencia de API, error handling centralizado, logging automático',
    },

    {
      id: 'api-endpoint-naming',
      section: 4,
      title: 'Nomenclatura Endpoints: api/{dominio}/{recurso}, kebab-case, plural',
      description:
        'Endpoints: kebab-case, recurso plural, sin [controller], sin PascalCase. Patrón: api/admin/banks, api/cobranza/collection-cases. Front/back deben coincidir exacto.',
      severity: 'ALTA',
      technologies: ['.NET', 'Angular'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN (Nomenclatura canónica)
app.MapGroup("api/admin/catalogs/banks")
    .WithName("Banks")
    .MapGet("/", GetBanksEndpoint.Handler)
    .MapPost("/", CreateBankEndpoint.Handler);

app.MapGroup("api/cobranza/collection-cases")
    .WithName("CollectionCases")
    .MapGet("/{id}", GetCollectionCaseEndpoint.Handler);

// ❌ MAL
app.MapGroup("api/[controller]")  // [controller] prohibido
app.MapGroup("api/Banks")         // PascalCase prohibido
app.MapGroup("api/admin/bank")    // singular prohibido`,
          description: 'Rutas consistentes, kebab-case, plurales, sin tokens',
        },
        angular: {
          code: `// ✅ BIEN (Endpoint strings coinc iden exacto)
const endpoints = {
  BANKS: 'api/admin/catalogs/banks',              // Exacto
  COLLECTION_CASES: 'api/cobranza/collection-cases',  // Exacto
};

// ❌ MAL
const endpoints = {
  BANKS: 'api/admin/Bank',      // PascalCase, singular
  BANKS: 'api/Banks',           // Sin dominio
};`,
          description: 'Strings de endpoint deben coincidir char-by-char',
        },
      },
      relatedSections: [9],
      importance: 'Consistencia front-back, naming intuitivo, evita bugs de typo',
    },

    // Sección 10: Encoding
    {
      id: 'encoding-utf8-nobom',
      section: 10,
      title: 'UTF-8 sin BOM en Todos los Archivos',
      description:
        'TODOS los archivos DEBEN ser UTF-8 sin BOM. Escaneo automático pre-commit. Permitidos emojis en comentarios.',
      severity: 'CRÍTICA',
      technologies: ['Documentación', 'Código'],
      examples: {
        angular: {
          code: `// ✅ BIEN (UTF-8 sin BOM)
// 🚀 Feature: Nueva funcionalidad
// 💡 Nota: Este es un ejemplo
// ⚠️ Advertencia: No olvidar validar

export class UserComponent {
  // 📝 TODO: Implementar loading state
}

<!-- ❌ MAL: BOM (byte order mark) al inicio del archivo -->
<!-- Invisible pero causa problemas en builds -->`,
          description: 'UTF-8 sin BOM, emojis permitidos en comentarios',
        },
      },
      relatedSections: [],
      importance: 'Evita mojibake, compatible con todos linters, CI/CD limpio',
    },

    // Sección 13: Flutter
    {
      id: 'flutter-null-safety',
      section: 13,
      title: 'Flutter 3.x: Null-Safe, Records, Sealed Classes',
      description:
        'Flutter obligatorio 3.x+ con Dart 3: null-safety total, records para DTOs, sealed classes para variantes.',
      severity: 'CRÍTICA',
      technologies: ['Flutter', 'Dart'],
      examples: {
        angular: {
          code: `// ✅ BIEN (Null-safe, records)
// En Dart 3
sealed class Result<T> {
  const Result();
}

class Success<T> extends Result<T> {
  final T data;
  const Success(this.data);
}

class Error<T> extends Result<T> {
  final String message;
  const Error(this.message);
}

typedef UserRecord = ({String id, String name, String email});

final user = (id: '1', name: 'John', email: 'john@example.com');

// ❌ MAL (dinámico)
var user = {'id': '1', 'name': 'John'};  // Perdes type safety`,
          description: 'Null-safe obligatorio, records para data, sealed para variantes',
        },
      },
      relatedSections: [2],
      importance: 'Type safety, elimina null errors, mejor performance',
    },

    {
      id: 'flutter-responsive',
      section: 13,
      title: 'Flutter: Componentes Responsive (375px + 768px)',
      description:
        'Componentes adaptativos con adaptive_* widgets. Mismo código UI genera diferentes layouts según breakpoint. Layout tree computed',
      severity: 'ALTA',
      technologies: ['Flutter'],
      examples: {
        angular: {
          code: `// ✅ BIEN (adaptive layout)
import 'package:flutter/material.dart';

class AdaptiveUserList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isMobile = size.width < 768;

    return isMobile
        ? UserListMobile(users: users)
        : UserListDesktop(users: users);
  }
}

class UserListMobile extends StatelessWidget {
  final List<User> users;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: users.length,
      itemBuilder: (context, index) =>
          UserTileMobile(user: users[index]),
    );
  }
}`,
          description: 'Layout adaptativo sin duplicate code, computed trees',
        },
      },
      relatedSections: [15],
      importance: 'UX consistente en mobile/tablet/desktop desde un código',
    },

    // Sección 14: Organización
    {
      id: 'org-apps-portal',
      section: 14,
      title: 'Organización: Cada Rol en App Portal Propia',
      description:
        'Una funcionalidad con múltiples roles NO se implementa en una sola carpeta. Cada rol tiene su app portal (admin, cobranza, resident, etc.). Componentes compartidos en shared/ui/.',
      severity: 'CRÍTICA',
      technologies: ['Angular'],
      examples: {
        angular: {
          code: `// ✅ BIEN (apps separadas por rol)
client/angular/src/app/
├── apps/
│   ├── admin/
│   │   └── cobranza-module/  (vista admin de cobranza)
│   ├── cobranza/
│   │   └── cobranza-module/  (vista agente de cobranza)
│   └── resident/
│       └── cobranza-module/  (vista residente de cobranza)
└── shared/
    └── ui/
        └── cobranza-card/    (componente compartido)

// ❌ MAL (todo en una carpeta)
client/angular/src/app/
├── features/
│   └── cobranza/
│       ├── admin-view/
│       ├── agent-view/
│       └── resident-view/    (duplicación de código)`,
          description: 'Apps separadas por rol, componentes compartidos centralizados',
        },
      },
      relatedSections: [],
      importance: 'Escalabilidad, permisos claros, no duplicación cross-role',
    },

    // Sección 19: Auditoría
    {
      id: 'audit-by-role',
      section: 19,
      title: 'Auditoría por Rol: Automática en Pre-Commit',
      description:
        'Todos los commits ejecutan auditoría automática según rol (frontend, backend, mobile, full-stack). Bloquea si hay 🔴 CRÍTICA.',
      severity: 'ALTA',
      technologies: ['Git Hooks', 'Automatización'],
      examples: {
        angular: {
          code: `# Dev hace commit
git commit -m "feat: new component"

# Hook automáticamente ejecuta:
npm run audit:frontend

# Output:
✅ Auditoría por rol pasada
✅ Sin mojibake
[feature/frontend-xyz abc123] feat: new component

# Si falla:
❌ AUDITORÍA FRONTEND FALLIDA

🔴 CRÍTICA (1):
  1. Strict TypeScript
     "strict": true no está configurado`,
          description:
            'Pre-commit hook detecta rama → ejecuta auditoría → bloquea si CRÍTICA',
        },
      },
      relatedSections: [2, 9, 15],
      importance:
        'Prevenir commits incumplidores, feedback inmediato, calidad consistent',
    },

    // Sección 8: Botones
    {
      id: 'button-icon-naming',
      section: 8,
      title: 'Botones: iw-*, il-*, ili-* patterns',
      description: 'iw-button-* (icon only), il-button-* (label+icon), ili-button-* (ionic).',
      severity: 'MEDIA',
      technologies: ['Angular'],
      examples: {
        angular: { code: '<!-- iw-button-delete: solo icono -->\n<!-- il-button-edit: label+icon -->', description: 'Button naming patterns' },
      },
      relatedSections: [3],
      importance: 'UI consistency',
    },

    // Sección 11: Documentación
    {
      id: 'docs-spanish',
      section: 11,
      title: 'Documentación: Español, Emojis, Mermaid, Bloques Alert',
      description: 'Documentación SOLO español México. Emojis, Mermaid, [!NOTE]/[!TIP]/[!WARNING]/[!IMPORTANT].',
      severity: 'MEDIA',
      technologies: ['Documentación'],
      examples: {
        angular: { code: '# Guía\n> [!IMPORTANT]\n> Critical info\n\n```mermaid\nflowchart TD\n    A[Start]\n```', description: 'Spanish-first documentation with rich formatting' },
      },
      relatedSections: [],
      importance: 'Clarity and consistency',
    },

    // Sección 12: Skills
    {
      id: 'skills-knowledge-base',
      section: 12,
      title: 'Skills: Base de Conocimiento Modular',
      description: 'skills/ con README.md. Subdirectories: core/, backend-dotnet/, frontend-angular/, shared-infra/',
      severity: 'MEDIA',
      technologies: ['Documentación'],
      examples: {
        angular: { code: 'skills/\n  ├── core/\n  ├── backend-dotnet/\n  ├── frontend-angular/\n  └── shared-infra/', description: 'Atomic knowledge lookup' },
      },
      relatedSections: [],
      importance: 'Avoid duplication',
    },

    // Sección 17: Git
    {
      id: 'git-workflow',
      section: 17,
      title: 'Git: Branch pattern feature/COD-ticket-desc',
      description: 'Branches: feature/LUX-123-desc. Commits: tipo: desc (imperativo, ≤72 chars).',
      severity: 'MEDIA',
      technologies: ['Git'],
      examples: {
        angular: { code: 'feature/LUX-123-auth\nfix/LUX-456-bug\n\ngit commit -m "feat: auth OAuth"', description: 'Git naming conventions' },
      },
      relatedSections: [],
      importance: 'Traceability',
    },

    // Sección 18: Infraestructura
    {
      id: 'infra-shared',
      section: 18,
      title: 'Infraestructura: File Storage, Notifications, ICurrentUserService',
      description: '3-tier file storage, Notifications (Email/Push/SignalR), ICurrentUserService (NO IHttpContextAccessor).',
      severity: 'ALTA',
      technologies: ['.NET'],
      examples: {
        dotnet: { code: 'public interface ICurrentUserService\n{\n    string UserId { get; }\n}\n\npublic interface IEmailService { }\n\n// ❌ Never: IHttpContextAccessor in services', description: 'Centralized infrastructure services' },
      },
      relatedSections: [1],
      importance: 'Scalability, decoupling',
    },

    // Sección 18.2 — Email Template Standard
    {
      id: 'email-template-standard',
      section: 18,
      title: 'Email Templates: Estándar de Creación',
      description: 'Plantillas Razor en SendEmailGlobal/Features/{Feature}/SendEmail/Templates/{Feature}Email.cshtml, usando layout compartido _EmailLayout.cshtml, modelo fuertemente tipado como record con [Display], estilos inline, español, colas corporativas.',
      severity: 'ALTA',
      technologies: ['.NET', 'Razor', 'ASP.NET Core'],
      examples: {
        dotnet: { code: 'Layout = "/Infrastructure/Email/Templates/Shared/_EmailLayout.cshtml";\nViewData["Title"] = "Recordatorio de Cobranza";\n@model CollectionNotificationEmailDTO\n<p>Estimado(a) <strong>@Model.FullName</strong>,</p>', description: 'Email template structure with shared layout and strongly-typed record DTO' },
      },
      relatedSections: [9],
      importance: 'Consistent email rendering, Outlook compatibility, maintainability',
    },

    // Sección 21: Documentación Módulos
    {
      id: 'module-docs',
      section: 21,
      title: 'Módulo Docs: Raíz, Prefijo tipo-modulo-nombre.md',
      description: 'En raíz del módulo. Nombre: tipo-modulo-nombre.md (tipos: reglas-negocio, arquitectura).',
      severity: 'MEDIA',
      technologies: ['Documentación'],
      examples: {
        angular: { code: 'reglas-negocio-cobranza.md\narquitectura-cobranza.md\n\n# ❌ MAL\ncobranza-guide.md (sin prefijo)', description: 'Module documentation location and naming' },
      },
      relatedSections: [11],
      importance: 'Discoverability',
    },

    // Sección 22: Guías Operativas
    {
      id: 'guide-operational',
      section: 22,
      title: 'Guías Operativas: 13-15 Secciones para Intervención Sensible',
      description: 'Pre-requisitos, scope, arquitectura, procedimiento, rollback, validación (13-15 secciones).',
      severity: 'MEDIA',
      technologies: ['Documentación'],
      examples: {
        angular: { code: '# Guía: Migrar MVC → Minimal API\n\n## Pre-requisitos\n## Scope\n## Arquitectura\n## Procedimiento\n## Rollback\n## Validación', description: 'Structured operational guide template' },
      },
      relatedSections: [20],
      importance: 'Safe interventions',
    },

    // Sección 9 Extensions — Shared Project
    {
      id: 'shared-extensions',
      section: 9,
      title: 'LuxuryApp.Shared.Extensions: Utilidades Centralizadas',
      description:
        'La carpeta `api/LuxuryApp.Shared/Extensions/` contiene extensiones helper sin lógica de negocio. ' +
        'Cuando se retornan listas o colecciones que contienen valores de enum, DEBE usarse `.GetDisplayName()` para devolver el nombre legible (el valor de `[Display(Name = "...")]`) en lugar del nombre técnico del enum. ' +
        'Cuando se retornan listas o colecciones que contienen números telefónicos, DEBE usarse `.GetCelFormtat()` para formatear el número mexicano como `(XX) XXXX- XXXX`. ' +
        'Nuevas extensiones se agregan como clases `static` con sufijo `Extension(s)` en `LuxuryApp.Shared.Extensions`. Los métodos son `public static`. No se inyectan dependencias en clases de extensión.',
      severity: 'ALTA',
      technologies: ['.NET', 'C#'],
      examples: {
        dotnet: {
          code: `// ✅ BIEN (GetDisplayName en listas de enum)
var statusList = statuses.Select(s => s.GetDisplayName()).ToList();
// Resultado: ["Activo", "Inactivo", "Pendiente"] (no ["Active", "Inactive", "Pending"])

// ✅ BIEN (GetCelFormtat en listas de teléfonos)
var phoneList = users.Select(u => u.Phone.GetCelFormtat()).ToList();
// Resultado: ["(55) 1234- 5678", "(33) 9876- 5432"] (formato mexicano)

// ❌ MAL (nombre técnico del enum)
var statusList = statuses.Select(s => s.ToString()).ToList();
// Resultado: ["Active", "Inactive", "Pending"] (sin DisplayName)

// ❌ MAL (teléfono sin formatear)
var phoneList = users.Select(u => u.Phone).ToList();
// Resultado: ["5512345678", "3398765432"] (sin formato, ilegible)`,
          description: 'GetDisplayName() devuelve el valor de [Display(Name = "...")], no el nombre técnico del enum. GetCelFormtat() formatea números mexicanos como (XX) XXXX- XXXX',
        },
      },
      relatedSections: [9],
      importance: 'Nombres legibles en UI, consistencia con DisplayAttribute, teléfonos en formato mexicano',
    },
  ];

  getConventions(): Observable<ConventionRule[]> {
    return of(this.conventions);
  }

  getConventionBySection(section: number): Observable<ConventionRule[]> {
    return of(this.conventions.filter((c) => c.section === section));
  }

  searchConventions(query: string): Observable<ConventionRule[]> {
    const lowerQuery = query.toLowerCase();
    return of(
      this.conventions.filter(
        (c) =>
          c.title.toLowerCase().includes(lowerQuery) ||
          c.description.toLowerCase().includes(lowerQuery) ||
          c.technologies.some((t) => t.toLowerCase().includes(lowerQuery)),
      ),
    );
  }

  getBySeverity(
    severity: 'CRÍTICA' | 'ALTA' | 'MEDIA' | 'BAJA',
  ): Observable<ConventionRule[]> {
    return of(this.conventions.filter((c) => c.severity === severity));
  }

  getByTechnology(technology: string): Observable<ConventionRule[]> {
    return of(
      this.conventions.filter((c) =>
        c.technologies.some((t) => t.toLowerCase() === technology.toLowerCase()),
      ),
    );
  }
}
