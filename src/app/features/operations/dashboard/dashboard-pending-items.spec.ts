import { IonicMocks } from 'src/app/core/testing/ionic-mocks';

vi.mock('@ionic/angular/standalone', () => ({ ...IonicMocks }));
vi.mock('@ionic/core', () => ({}));
vi.mock('@ionic/core/components', () => ({}));
vi.mock("@ui/web/pdf-viewer-modal/pdf-viewer-modal", () => ({
  PdfViewerModal: class {},
}));
vi.mock("heic2any", () => ({ default: vi.fn() }));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastController } from '@ionic/angular/standalone';
import { EApplicationRole } from 'src/app/core/enums/asp-net-roles.enum';
import { AspRoleService } from 'src/app/core/services/asp-role.service';
import { DashboardPendingItems } from './dashboard-pending-items';

describe('DashboardPendingItems', () => {
  let component: DashboardPendingItems;
  let fixture: ComponentFixture<DashboardPendingItems>;

  function setup(anyOfImpl?: (roles: EApplicationRole[]) => boolean) {
    const mockAspRoleS = {
      anyOf: vi.fn((roles: EApplicationRole[]) =>
        computed(() => anyOfImpl?.(roles) ?? false),
      ),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [DashboardPendingItems],
      providers: [
        { provide: AspRoleService, useValue: mockAspRoleS },
        { provide: MessageService, useValue: { add: vi.fn() } },
        { provide: ToastController, useValue: {} },
        { provide: DialogService, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
      ],
    });
    TestBed.compileComponents();

    fixture = TestBed.createComponent(DashboardPendingItems);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should show all modules for SuperUsuario', () => {
    setup(() => true);
    const modules = component.visibleModules();
    expect(modules).toContain('Minutas');
    expect(modules).toContain('Tickets');
    expect(modules).toContain('Mantenimiento');
    expect(modules).toContain('Legal');
    expect(modules).toContain('Polizas');
    expect(modules).toContain('Reclutamiento');
  });

  it('should only show Tickets for a user with no special roles', () => {
    setup(() => false);
    const modules = component.visibleModules();
    expect(modules).toEqual(['Tickets']);
  });

  it('should show Minutas for Administrador', () => {
    setup((roles) => {
      const minutaRoles: EApplicationRole[] = [
        EApplicationRole.SuperUsuario,
        EApplicationRole.Administrador,
        EApplicationRole.GerenteOperaciones,
        EApplicationRole.GerenteAtencion,
        EApplicationRole.Asistente,
      ];
      return roles.some((r) => minutaRoles.includes(r));
    });
    expect(component.visibleModules()).toContain('Minutas');
  });

  it('should show Legal only for SuperUsuario or Legal role', () => {
    setup((roles) => {
      return roles.includes(EApplicationRole.SuperUsuario) || roles.includes(EApplicationRole.Legal);
    });
    expect(component.visibleModules()).toContain('Legal');
    expect(component.visibleModules()).toContain('Polizas');
  });
});

