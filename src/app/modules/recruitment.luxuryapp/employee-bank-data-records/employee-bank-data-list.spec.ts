import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { vi } from "vitest";
import { EmployeeInternalService } from "../employees/employee-internal.service";
import { EmployeeBankDataList } from "./employee-bank-data-list";

describe("EmployeeBankDataList", () => {
  let fixture: ComponentFixture<EmployeeBankDataList>;
  let component: EmployeeBankDataList;
  let mockConfirmS: any;

  const mockEmployeeInternalS = {
    getBankData: vi
      .fn()
      .mockResolvedValue([{ id: "1", bankName: "Bank 1", bankAccount: "123" }]),
    deleteBankData: vi.fn().mockResolvedValue(true),
  };

  const mockDialogHandlerS = {
    openDialog: vi.fn().mockResolvedValue(true),
    sizeMd: "600px",
  };

  beforeEach(() => {
    mockConfirmS = { confirm: vi.fn().mockResolvedValue(true) };
    TestBed.overrideComponent(EmployeeBankDataList, {
      set: { template: "<div>Mock</div>", imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [EmployeeBankDataList],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: EmployeeInternalService, useValue: mockEmployeeInternalS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: PlatformService, useValue: { isMobile: () => false } },
        { provide: ConfirmService, useValue: mockConfirmS },
      ],
    });

    vi.clearAllMocks();
    fixture = TestBed.createComponent(EmployeeBankDataList);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signal values before init", () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(false);
  });

  it("should load bank data on init when employeeId is provided", () => {
    fixture.componentRef.setInput("employeeId", "emp-1");
    fixture.detectChanges();
    expect(mockEmployeeInternalS.getBankData).toHaveBeenCalledWith("emp-1");
  });

  it("should load data on onLoadData call", () => {
    mockEmployeeInternalS.getBankData.mockResolvedValue([
      { id: "2", bankName: "Bank 2" },
    ]);
    component.onLoadData("emp-2");
    expect(mockEmployeeInternalS.getBankData).toHaveBeenCalledWith("emp-2");
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
    expect(mockEmployeeInternalS.deleteBankData).toHaveBeenCalledWith("1");
  });

  it("should not delete on onDelete when confirmation is cancelled", async () => {
    component.dataSignal.set([{ id: "1" } as any]);
    mockConfirmS.confirm.mockResolvedValueOnce(false);

    await component.onDelete("1");

    expect(mockEmployeeInternalS.deleteBankData).not.toHaveBeenCalled();
  });
});
