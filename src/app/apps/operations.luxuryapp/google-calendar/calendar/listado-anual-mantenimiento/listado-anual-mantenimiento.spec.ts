import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { vi } from "vitest";
import { ListadoAnualMantenimiento } from "./listado-anual-mantenimiento";

vi.mock("ng2-pdf-viewer", () => ({ PdfViewerModule: class {} }));

const apiResponseSMock = {
  onGetList: vi.fn().mockResolvedValue([]),
  onDelete: vi.fn().mockResolvedValue(true),
  onGetEnumSelectItem: vi.fn().mockResolvedValue([]),
};
const authServiceMock = { applicationUserId: "user-1" };
const aspRoleSMock = { hasRole: vi.fn().mockReturnValue(false) };
const customerIdSignal = signal("cust-1");
const customerIdSMock = { customerId: customerIdSignal };
const dialogHandlerSMock = {
  openDialog: vi.fn().mockResolvedValue(true),
  sizeLg: "lg" as any,
};

describe("ListadoAnualMantenimiento", () => {
  let component: ListadoAnualMantenimiento;
  let fixture: ComponentFixture<ListadoAnualMantenimiento>;

  beforeEach(() => {
    TestBed.overrideComponent(ListadoAnualMantenimiento, {
      set: { template: "<div>Mock</div>", imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [ListadoAnualMantenimiento, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseSMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: AspRoleService, useValue: aspRoleSMock },
        { provide: CustomerIdService, useValue: customerIdSMock },
        { provide: DialogHandlerService, useValue: dialogHandlerSMock },
      ],
    });

    fixture = TestBed.createComponent(ListadoAnualMantenimiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have empty dataSignal initially", () => {
    expect(component.dataSignal()).toEqual([]);
  });

  it("should have loading as true initially", () => {
    expect(component.loading()).toBe(true);
  });

  it("should have monthControl default as current month + 1", () => {
    const expectedMonth = new Date().getMonth() + 1;
    expect(component.monthControl.value).toBe(expectedMonth);
  });

  it("onLoadData should call api and update dataSignal", async () => {
    const items = [{ id: 1, name: "Test" }];
    apiResponseSMock.onGetList.mockResolvedValue(items);
    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));
    expect(component.dataSignal()).toEqual(items);
  });

  it("calculateCustomerTotal should count items by category", () => {
    component.dataSignal.set([
      { inventoryCategory: "A" },
      { inventoryCategory: "B" },
      { inventoryCategory: "A" },
    ]);
    expect(component.calculateCustomerTotal("A")).toBe(2);
    expect(component.calculateCustomerTotal("B")).toBe(1);
    expect(component.calculateCustomerTotal("C")).toBe(0);
  });

  it("onDelete should remove item from dataSignal on success", async () => {
    component.dataSignal.set([{ id: 1 }, { id: 2 }, { id: 3 }]);
    apiResponseSMock.onDelete.mockResolvedValue(true);
    component.onDelete(2);
    await new Promise((resolve) => setTimeout(resolve));
    expect(component.dataSignal()).toEqual([{ id: 1 }, { id: 3 }]);
  });

  it("onDelete should not remove item on failure", async () => {
    component.dataSignal.set([{ id: 1 }, { id: 2 }]);
    apiResponseSMock.onDelete.mockResolvedValue(false);
    component.onDelete(1);
    await new Promise((resolve) => setTimeout(resolve));
    expect(component.dataSignal()).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("onModalForm should open dialog and reload on success", async () => {
    const loadSpy = vi.spyOn(component, "onLoadData");
    dialogHandlerSMock.openDialog.mockResolvedValue(true);
    component.onModalForm({
      id: 1,
      task: "edit",
      idMachinery: 5,
      title: "Test",
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(dialogHandlerSMock.openDialog).toHaveBeenCalled();
    expect(loadSpy).toHaveBeenCalled();
  });

  it("selectMonth should call onLoadData", () => {
    const spy = vi.spyOn(component, "onLoadData");
    component.selectMonth();
    expect(spy).toHaveBeenCalled();
  });

  it("onLoadEnumSelectItem should fetch months", async () => {
    const months = [{ value: 1, label: "Enero" }];
    apiResponseSMock.onGetEnumSelectItem.mockResolvedValue(months);
    component.onLoadEnumSelectItem();
    await new Promise((resolve) => setTimeout(resolve));
    expect(apiResponseSMock.onGetEnumSelectItem).toHaveBeenCalledWith(
      "e-month/false",
    );
    expect(component.months()).toEqual(months);
  });

  it("groupedData should group items by inventoryCategory", () => {
    component.dataSignal.set([
      { inventoryCategory: "CatA", name: "Item1" },
      { inventoryCategory: "CatB", name: "Item2" },
      { inventoryCategory: "CatA", name: "Item3" },
    ]);
    const grouped = component.groupedData();
    expect(grouped["CatA"]).toHaveLength(2);
    expect(grouped["CatB"]).toHaveLength(1);
  });

  it("globalFilterFields should return empty array when no data", () => {
    component.dataSignal.set([]);
    expect(component.globalFilterFields()).toEqual([]);
  });
});
