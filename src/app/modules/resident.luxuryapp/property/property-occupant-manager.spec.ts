import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { vi } from "vitest";
import { PropertyOccupantManager } from "./property-occupant-manager";

describe("PropertyOccupantManager", () => {
  let component: PropertyOccupantManager;
  let fixture: ComponentFixture<PropertyOccupantManager>;
  let mockApiResponseS: any;
  let mockConfig: any;
  let mockRef: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onPost: vi.fn(),
      onPut: vi.fn(),
      onDelete: vi.fn().mockResolvedValue(true),
    };
    mockConfig = {
      data: { propertyId: "prop-1", propertyName: "Test Property" },
    };
    mockRef = { close: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(PropertyOccupantManager, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [PropertyOccupantManager],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: DynamicDialogRef, useValue: mockRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(PropertyOccupantManager);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.loading()).toBe(false);
    expect(component.occupants()).toEqual([]);
    expect(component.propertyId).toBe("prop-1");
    expect(component.propertyName).toBe("Test Property");
    expect(component.errorMensaje).toBeNull();
  });

  it("loadOccupants should call api and update occupants signal", () => {
    const mockOccupants = [{ id: "occ-1", fullName: "John Doe" }];
    mockApiResponseS.onGetList.mockResolvedValue(mockOccupants);

    component.loadOccupants();

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      "property-occupant/list/prop-1",
    );
  });

  it("resetForm should set occupantForm to defaults", () => {
    component.occupantForm.patchValue({ fullName: "Test" });
    component.resetForm();

    expect(component.occupantForm.getRawValue()).toEqual({
      id: null,
      fullName: "",
      email: "",
      phoneNumber: "",
      isOwner: false,
      isResident: false,
      isActive: true,
    });
  });

  it("closeDialog should call ref.close(true)", () => {
    component.closeDialog();
    expect(mockRef.close).toHaveBeenCalledWith(true);
  });
});
