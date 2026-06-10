import { IonicMocks } from 'src/app/core/testing/ionic-mocks';

vi.mock('@ionic/angular/standalone', () => ({ ...IonicMocks }));
vi.mock('@ionic/core', () => ({}));
vi.mock('@ionic/core/components', () => ({}));
vi.mock("src/app/core/components/pdf-viewer-modal/pdf-viewer-modal", () => ({
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
import { ContainerDashboard } from './container-dashboard';
import { DashboardPendingItems } from './dashboard-pending-items';

describe('ContainerDashboard', () => {
  let component: ContainerDashboard;
  let fixture: ComponentFixture<ContainerDashboard>;
  let mockAspRoleS: any;

  beforeEach(async () => {
    mockAspRoleS = { hasAny: vi.fn(), anyOf: vi.fn(() => computed(() => false)), roleSignal: vi.fn(() => signal(null)) };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ContainerDashboard],
      providers: [
        { provide: AspRoleService, useValue: mockAspRoleS },
        { provide: MessageService, useValue: { add: vi.fn() } },
        { provide: ToastController, useValue: {} },
        { provide: DialogService, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
      ],
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(ContainerDashboard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render MiEdificio when user is Condomino', () => {
    mockAspRoleS.hasAny.mockImplementation((roles: EApplicationRole[]) => {
      return roles.includes(EApplicationRole.Condomino);
    });
    fixture.detectChanges();
    expect(component.componentToRender().name).toContain('MiEdificio');
  });

  it('should render MiEdificio when user is Comite', () => {
    mockAspRoleS.hasAny.mockImplementation((roles: EApplicationRole[]) => {
      return roles.includes(EApplicationRole.Comite);
    });
    fixture.detectChanges();
    expect(component.componentToRender().name).toContain('MiEdificio');
  });

  it('should render DashboardPendingItems when user is neither Condomino nor Comite', () => {
    mockAspRoleS.hasAny.mockReturnValue(false);
    fixture.detectChanges();
    expect(component.componentToRender()).toBe(DashboardPendingItems);
  });
});
