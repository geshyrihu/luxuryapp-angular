import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DialogSize } from "src/app/core/enums/dialog-size";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { vi } from "vitest";
import { EmployeeEmergencyContactList } from "./employee-emergency-contact-list";

vi.mock("ionicons/icons", () => ({
  addIcons: vi.fn(),
  callOutline: "",
  peopleOutline: "",
}));

describe("EmployeeEmergencyContactList", () => {
  let fixture: ComponentFixture<EmployeeEmergencyContactList>;
  let component: EmployeeEmergencyContactList;

  const mockApiResponseS = {
    onGetItem: vi.fn().mockResolvedValue([]),
    onDelete: vi.fn().mockResolvedValue(true),
  };

  const mockDialogHandlerS = {
    openDialog: vi.fn().mockResolvedValue(true),
    sizeLg: DialogSize.lg,
  };

  beforeEach(() => {
    TestBed.overrideComponent(EmployeeEmergencyContactList, {
      set: { template: "<div>Mock</div>", imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [EmployeeEmergencyContactList],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
      ],
    });

    vi.clearAllMocks();
    fixture = TestBed.createComponent(EmployeeEmergencyContactList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("employeeId", 1);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signal values", () => {
    expect(component.loading()).toBe(true);
  });

  it("should load data on init when employeeId is valid", () => {
    expect(mockApiResponseS.onGetItem).toHaveBeenCalledTimes(2);
  });

  it("should load emergency contact data on onLoadDataEmergencyContact", () => {
    component.onLoadDataEmergencyContact();
    expect(mockApiResponseS.onGetItem).toHaveBeenCalled();
  });

  it("should load beneficiary data on onLoadDataBeneficiary", () => {
    component.onLoadDataBeneficiary();
    expect(mockApiResponseS.onGetItem).toHaveBeenCalled();
  });

  it("should open modal form on onModalForm", () => {
    component.onModalForm({ id: "1", title: "Edit", contacOfBeneficiary: 0 });
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalled();
  });

  it("should call onDelete with correct id", () => {
    component.onDelete("1", 0);
    expect(mockApiResponseS.onDelete).toHaveBeenCalled();
  });
});
