import { IonicMocks } from "src/app/core/testing/ionic-mocks";

vi.mock("@ionic/angular/standalone", () => ({ ...IonicMocks }));
vi.mock("@ionic/core", () => ({}));
vi.mock("@ionic/core/components", () => ({}));
vi.mock("@ui/web/pdf-viewer-modal/pdf-viewer-modal", () => ({
  PdfViewerModal: class {},
}));
vi.mock("heic2any", () => ({ default: vi.fn() }));

import { computed } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { ToastController } from "@ionic/angular/standalone";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { ApplicationRole } from "src/app/core/interfaces/asp-net-roles.enum";
import { DashboardPendingItems } from "./dashboard-pending-items";

describe("DashboardPendingItems", () => {
  let component: DashboardPendingItems;
  let fixture: ComponentFixture<DashboardPendingItems>;

  function setup(anyOfImpl?: (roles: ApplicationRole[]) => boolean) {
    const mockAspRoleS = {
      anyOf: vi.fn((roles: ApplicationRole[]) =>
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

  it("should create", () => {
    setup();
    expect(component).toBeTruthy();
  });

  it("should show all modules for SuperUsuario", () => {
    setup(() => true);
    const modules = component.visibleModules();
    expect(modules).toContain("Minutas");
    expect(modules).toContain("Tickets");
    expect(modules).toContain("Mantenimiento");
    expect(modules).toContain("Legal");
    expect(modules).toContain("Polizas");
    expect(modules).toContain("Reclutamiento");
  });

  it("should only show Tickets for a user with no special roles", () => {
    setup(() => false);
    const modules = component.visibleModules();
    expect(modules).toEqual(["Tickets"]);
  });

  it("should show Minutas for Administrador", () => {
    setup((roles) => {
      const minutaRoles: ApplicationRole[] = [
        ApplicationRole.SuperUsuario,
        ApplicationRole.Administrador,
        ApplicationRole.GerenteOperaciones,
        ApplicationRole.GerenteAtencion,
        ApplicationRole.Asistente,
      ];
      return roles.some((r) => minutaRoles.includes(r));
    });
    expect(component.visibleModules()).toContain("Minutas");
  });

  it("should show Legal only for SuperUsuario or Legal role", () => {
    setup((roles) => {
      return (
        roles.includes(ApplicationRole.SuperUsuario) ||
        roles.includes(ApplicationRole.Legal)
      );
    });
    expect(component.visibleModules()).toContain("Legal");
    expect(component.visibleModules()).toContain("Polizas");
  });
});
