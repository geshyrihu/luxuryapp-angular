import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { vi } from "vitest";
import { TarjetaProducto } from "./tarjeta-producto";

describe("TarjetaProducto", () => {
  let component: TarjetaProducto;
  let fixture: ComponentFixture<TarjetaProducto>;
  let mockApiResponseS: any;
  let mockConfig: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetItem: vi.fn().mockResolvedValue(null),
    };
    mockConfig = {
      data: { productoId: "prod-1" },
    };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TarjetaProducto, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TarjetaProducto],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TarjetaProducto);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default values from config", () => {
    expect(component.productoId).toBe("prod-1");
    expect(component.producto).toBeUndefined();
  });

  it("ngOnInit should call api with productoId", () => {
    const mockProduct = { id: "prod-1", nombreProducto: "Test" };
    mockApiResponseS.onGetItem.mockResolvedValue(mockProduct);

    component.ngOnInit();

    expect(mockApiResponseS.onGetItem).toHaveBeenCalledWith("Productos/prod-1");
  });

  it("ngOnInit should set producto from api result", async () => {
    const mockProduct = { id: "prod-1", nombreProducto: "Test Producto" };
    mockApiResponseS.onGetItem.mockResolvedValue(mockProduct);

    component.ngOnInit();
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.producto).toEqual(mockProduct);
  });
});
