import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { vi } from "vitest";
import { PropiedadesList } from "./propiedades-list";

vi.mock("ng2-pdf-viewer", () => ({ PdfViewerModule: class {} }));

describe("PropiedadesList", () => {
  let component: PropiedadesList;
  let fixture: ComponentFixture<PropiedadesList>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockAspRoleS: any;
  let mockCustomerIdS: any;
  let mockDialogHandlerS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onDelete: vi.fn().mockResolvedValue(true),
      onDownloadFile: vi.fn(),
      onPostFile: vi.fn().mockResolvedValue(true),
    };
    mockAuthS = { userToken: null };
    mockAspRoleS = { hasRole: vi.fn().mockReturnValue(false) };
    mockCustomerIdS = { customerId: signal("cust-123") };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: "1200px",
    };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(PropiedadesList, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [PropiedadesList],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: AspRoleService, useValue: mockAspRoleS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(PropiedadesList);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.tablePrimeNgRows).toBe(30);
    expect(component.AspRole).toBeDefined();
  });

  it("onLoadData should call api with customerId", () => {
    component.onLoadData();
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      "properties/list/cust-123",
    );
  });

  it("onDelete should remove item from dataSignal", async () => {
    component.dataSignal.set([
      { id: "1", fullName: "Prop A" },
      { id: "2", fullName: "Prop B" },
    ]);

    await component.onDelete("1");

    expect(mockApiResponseS.onDelete).toHaveBeenCalledWith("properties/1");
    expect(component.dataSignal().length).toBe(1);
    expect(component.dataSignal()[0].id).toBe("2");
  });
});
