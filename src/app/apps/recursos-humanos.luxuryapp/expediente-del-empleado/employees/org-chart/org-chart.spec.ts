import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { vi } from "vitest";
import { IRoleOrgChartNode } from "./interfaces/org-chart.interfaces";
import { OrgChart } from "./org-chart";

vi.mock("src/app/core/http/services/api-response.service", () => ({
  ApiResponseService: class ApiResponseService {},
}));

vi.mock("src/app/core/auth/services/asp-role.service", () => ({
  AspRoleService: class AspRoleService {},
}));

vi.mock("src/app/core/auth/services/customer-id.service", () => ({
  CustomerIdService: class CustomerIdService {},
}));

describe("OrgChart", () => {
  const createNode = (
    partial: Partial<IRoleOrgChartNode>,
  ): IRoleOrgChartNode => ({
    roleId: "",
    roleDisplayName: "",
    departmentName: "Operaciones",
    hierarchyLevel: 0,
    sortOrder: 0,
    members: [],
    children: [],
    ...partial,
  });

  let fixture: ComponentFixture<OrgChart>;
  let apiMock: {
    onGetList: ReturnType<typeof vi.fn>;
    onPatch: ReturnType<typeof vi.fn>;
  };

  beforeAll(() => {
    class ResizeObserverMock {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }

    Object.defineProperty(globalThis, "ResizeObserver", {
      value: ResizeObserverMock,
      configurable: true,
    });

    if (!SVGElement.prototype.getBBox) {
      Object.defineProperty(SVGElement.prototype, "getBBox", {
        value: () => ({ x: 0, y: 0, width: 260, height: 146 }),
        configurable: true,
      });
    }
  });

  beforeEach(async () => {
    apiMock = {
      onGetList: vi.fn().mockResolvedValue([
        createNode({
          roleId: "role-root",
          roleDisplayName: "Dirección Operativa",
          departmentName: "Direcciones",
          members: [
            {
              workPositionId: "wp-root",
              folio: "DIR-01",
              hasEmployee: true,
              employeeName: "Ada Lovelace",
              state: "Activo",
            },
          ],
          children: [
            createNode({
              roleId: "role-child",
              roleDisplayName: "Supervisor",
              members: [
                {
                  workPositionId: "wp-child",
                  folio: "SUP-01",
                  hasEmployee: false,
                  state: "Activo",
                },
              ],
            }),
          ],
        }),
      ]),
      onPatch: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [OrgChart, NoopAnimationsModule],
      providers: [
        { provide: ApiResponseService, useValue: apiMock },
        {
          provide: CustomerIdService,
          useValue: {
            customerId: signal("customer-1"),
          },
        },
        {
          provide: AspRoleService,
          useValue: {
            hasRole: vi.fn().mockReturnValue(true),
          },
        },
      ],
    });

    TestBed.overrideComponent(OrgChart, {
      set: {
        template: `<div class="org-chart-test-shell">
          Organigrama de Roles
        </div>`,
      },
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(OrgChart);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it("renders without dependency injection errors", () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(apiMock.onGetList).toHaveBeenCalledWith(
      Endpoints.OrgChart.getTree("customer-1"),
    );
    expect(fixture.componentInstance.activeTab()).toBe("edit");
    expect(fixture.componentInstance.editMode()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain(
      "Organigrama de Roles",
    );
  });

  it("builds an accessible label for role nodes with roster summary", () => {
    const label = fixture.componentInstance.getNodeAriaLabel(
      createNode({
        roleId: "role-child",
        roleDisplayName: "Supervisor",
        departmentName: "Operaciones",
        members: [
          {
            workPositionId: "wp-1",
            folio: "SUP-01",
            hasEmployee: false,
            state: "Activo",
          },
        ],
      }),
    );

    expect(label).toContain("Rol Supervisor");
    expect(label).toContain("departamento Operaciones");
    expect(label).toContain("1 miembro · 1 vacantes");
  });

  it("clears selection on escape while editing", () => {
    const component = fixture.componentInstance;
    const selected = createNode({
      roleId: "role-child",
      roleDisplayName: "Supervisor",
    });

    component.editMode.set(true);
    component.selectedOrigin.set(selected);
    component.selectedDest.set(selected);

    component.onEscapePressed();

    expect(component.selectedOrigin()).toBeNull();
    expect(component.selectedDest()).toBeNull();
  });

  it("keeps the current selection when a reassignment fails", async () => {
    const component = fixture.componentInstance;
    const selected = createNode({
      roleId: "role-child",
      roleDisplayName: "Supervisor",
    });

    apiMock.onPatch.mockResolvedValue(false);
    vi.spyOn(component.messageS, "add");

    component.selectedOrigin.set(selected);
    component.selectedDest.set(selected);

    await (component as any).executeReassign("role-child", null, 0);

    expect(component.selectedOrigin()?.roleId).toBe("role-child");
    expect(component.selectedDest()?.roleId).toBe("role-child");
    expect(component.messageS.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: "error",
      }),
    );
  });

  it("sends role reassignment to the customer-scoped endpoint", async () => {
    const component = fixture.componentInstance;

    apiMock.onPatch.mockResolvedValue(true);

    await (component as any).executeReassign("role-child", "role-root", 2);

    expect(apiMock.onPatch).toHaveBeenCalledWith(
      Endpoints.OrgChart.reassign("customer-1"),
      {
        roleId: "role-child",
        newReportsToRoleId: "role-root",
        sortOrder: 2,
      },
    );
  });

  it("describes row drag guidance while dragging another role", () => {
    const component = fixture.componentInstance;
    const origin = createNode({
      roleId: "role-origin",
      roleDisplayName: "Gerencia",
    });
    const target = createNode({
      roleId: "role-target",
      roleDisplayName: "Supervisión",
    });

    component.editMode.set(true);
    component.draggingNode.set(origin);
    component.dragHoverNodeId.set(target.roleId);
    component.dragHoverEdge.set("before");

    expect(component.shouldShowReorderAffordances(target)).toBe(true);
    expect(component.isReorderHover(target, "before")).toBe(true);
    expect(component.getDragGuideMessage()).toContain("Gerencia");
    expect(component.getDragGuideMessage()).toContain("fila");
    expect(component.getDragGuideMessage()).toContain("zona raíz");
  });
});
