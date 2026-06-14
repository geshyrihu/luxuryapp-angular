import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { vi } from "vitest";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { OrgChart } from "./org-chart";
import { IWorkPositionOrgChartNode } from "./models/org-chart.interfaces";

vi.mock("src/app/core/services/api-response.service", () => ({
  ApiResponseService: class ApiResponseService {},
}));

vi.mock("src/app/core/services/asp-role.service", () => ({
  AspRoleService: class AspRoleService {},
}));

vi.mock("src/app/core/services/customer-id.service", () => ({
  CustomerIdService: class CustomerIdService {},
}));

describe("OrgChart", () => {
  const createNode = (
    partial: Partial<IWorkPositionOrgChartNode>,
  ): IWorkPositionOrgChartNode => ({
    workPositionId: "",
    folio: "",
    roleDisplayName: "",
    departmentName: "Operaciones",
    hierarchyLevel: 0,
    sortOrder: 0,
    hasEmployee: false,
    state: "Activo",
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
          workPositionId: "root-1",
          folio: "DIR-01",
          roleDisplayName: "Direccion Operativa",
          departmentName: "Direcciones",
          hasEmployee: true,
          employeeName: "Ada Lovelace",
          children: [
            createNode({
              workPositionId: "child-1",
              folio: "SUP-01",
              roleDisplayName: "Supervisor",
              hasEmployee: false,
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
          Organigrama de Puestos
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
    expect(apiMock.onGetList).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.activeTab()).toBe("edit");
    expect(fixture.componentInstance.editMode()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain(
      "Organigrama de Puestos",
    );
  });

  it("builds an accessible label for regular nodes", () => {
    const label = fixture.componentInstance.getNodeAriaLabel(
      createNode({
        workPositionId: "child-1",
        employeeName: "Ada Lovelace",
        roleDisplayName: "Supervisor",
        departmentName: "Operaciones",
      }),
    );

    expect(label).toContain("Ada Lovelace");
    expect(label).toContain("puesto Supervisor");
    expect(label).toContain("departamento Operaciones");
  });

  it("clears selection on escape while editing", () => {
    const component = fixture.componentInstance;
    const selected = createNode({
      workPositionId: "child-1",
      folio: "SUP-01",
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
      workPositionId: "child-1",
      folio: "SUP-01",
    });

    apiMock.onPatch.mockResolvedValue(false);
    vi.spyOn(component.messageS, "add");

    component.selectedOrigin.set(selected);
    component.selectedDest.set(selected);

    await (component as any).executeReassign("child-1", null, 0);

    expect(component.selectedOrigin()?.workPositionId).toBe("child-1");
    expect(component.selectedDest()?.workPositionId).toBe("child-1");
    expect(component.messageS.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: "error",
      }),
    );
  });

  it("describes row drag guidance while dragging another node", () => {
    const component = fixture.componentInstance;
    const origin = createNode({
      workPositionId: "origin-1",
      folio: "GER-01",
    });
    const target = createNode({
      workPositionId: "target-1",
      folio: "SUP-01",
    });

    component.editMode.set(true);
    component.draggingNode.set(origin);
    component.dragHoverNodeId.set(target.workPositionId);
    component.dragHoverEdge.set("before");

    expect(component.shouldShowReorderAffordances(target)).toBe(true);
    expect(component.isReorderHover(target, "before")).toBe(true);
    expect(component.getDragGuideMessage()).toContain("GER-01");
    expect(component.getDragGuideMessage()).toContain("fila");
    expect(component.getDragGuideMessage()).toContain("zona raiz");
  });
});
