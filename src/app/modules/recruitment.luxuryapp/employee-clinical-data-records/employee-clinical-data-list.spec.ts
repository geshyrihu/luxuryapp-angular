import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { vi } from "vitest";
import { EmployeeInternalService } from "../employee/employee-internal.service";
import { EmployeeClinicalDataList } from "./employee-clinical-data-list";

describe("EmployeeClinicalDataList", () => {
  let fixture: ComponentFixture<EmployeeClinicalDataList>;
  let component: EmployeeClinicalDataList;

  const mockEmployeeInternalS = {
    getClinicalData: vi
      .fn()
      .mockResolvedValue([{ id: "1", name: "Clinical 1" }]),
    deleteClinicalData: vi.fn().mockResolvedValue(true),
  };

  const mockDialogHandlerS = {
    openDialog: vi.fn().mockResolvedValue(true),
    sizeMd: this.dialogHandlerS.sizeMd,
  };

  beforeEach(() => {
    TestBed.overrideComponent(EmployeeClinicalDataList, {
      set: { template: "<div>Mock</div>", imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [EmployeeClinicalDataList],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: EmployeeInternalService, useValue: mockEmployeeInternalS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: PlatformService, useValue: { isMobile: () => false } },
        { provide: ConfirmService, useValue: { confirm: vi.fn().mockResolvedValue(true) } },
      ],
    });

    vi.clearAllMocks();
    fixture = TestBed.createComponent(EmployeeClinicalDataList);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signal values before init", () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(false);
  });

  it("should load clinical data on init when employeeId is provided", () => {
    fixture.componentRef.setInput("employeeId", "emp-1");
    fixture.detectChanges();
    expect(mockEmployeeInternalS.getClinicalData).toHaveBeenCalledWith("emp-1");
  });

  it("should load data on onLoadData call", () => {
    component.onLoadData("emp-2");
    expect(mockEmployeeInternalS.getClinicalData).toHaveBeenCalledWith("emp-2");
    expect(component.loading()).toBe(true);
  });

  it("should open modal form on onModalForm", () => {
    fixture.componentRef.setInput("employeeId", "emp-1");
    component.onModalForm({ id: "1", title: "Edit" });
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalled();
  });

  it("should remove item on onDelete when result is true", async () => {
    component.dataSignal.set([{ id: "1" } as any, { id: "2" } as any]);
    await component.onDelete("1");
    expect(mockEmployeeInternalS.deleteClinicalData).toHaveBeenCalledWith("1");
  });
});
