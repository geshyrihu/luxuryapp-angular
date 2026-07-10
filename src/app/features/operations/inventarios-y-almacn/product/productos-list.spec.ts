import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { vi } from "vitest";
import { ProductosList } from "./productos-list";

describe("ProductosList", () => {
  let component: ProductosList;
  let fixture: ComponentFixture<ProductosList>;
  let mockApiResponseS: any;
  let mockAspRoleS: any;
  let mockAuthS: any;
  let mockDialogHandlerS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onDelete: vi.fn().mockResolvedValue(true),
    };
    mockAspRoleS = { hasRole: vi.fn().mockReturnValue(false) };
    mockAuthS = {
      userToken: {
        infoUserAuthDTO: { applicationUserId: "user-789" },
      },
    };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: "1200px",
    };
    mockTableScrollHeightS = { scrollHeight: signal("600px") };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(ProductosList, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [ProductosList],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AspRoleService, useValue: mockAspRoleS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ProductosList);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.filteredDataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.tablePrimeNgRows).toBe(30);
    expect(component.AspRole).toBeDefined();
    expect(component.account_id).toBe("user-789");
  });

  it("onLoadData should call api and set signals", async () => {
    const mockData = [{ id: 1, nombreProducto: "Prod A" }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    await component.onLoadData();

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith("Productos");
    expect(component.dataSignal()).toEqual(mockData);
    expect(component.filteredDataSignal()).toEqual(mockData);
  });

  it("onDelete should remove item from signals", async () => {
    component.dataSignal.set([{ id: "1" }, { id: "2" }]);
    component.filteredDataSignal.set([{ id: "1" }, { id: "2" }]);

    await component.onDelete("1");

    expect(mockApiResponseS.onDelete).toHaveBeenCalledWith("productos/1");
    expect(component.dataSignal().length).toBe(1);
    expect(component.dataSignal()[0].id).toBe("2");
    expect(component.filteredDataSignal().length).toBe(1);
  });
});
