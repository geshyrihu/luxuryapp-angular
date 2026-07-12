import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { OrdenCompraDetalleForm } from "./orden-compra-detalle-form";

describe("OrdenCompraDetalleForm - repro submit inactivo", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenCompraDetalleForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        { provide: DynamicDialogRef, useValue: { close: () => {} } },
        {
          provide: DynamicDialogConfig,
          useValue: {
            data: {
              product: {
                productoId: "prod-1",
                productName: "Producto Demo",
                image: null,
                descuento: 0,
                ivaAplicado: 16,
                retencionIVAPorcentaje: 0,
                retencionISRPorcentaje: 0,
              },
              measurementUnits: [{ value: "u1", label: "Caja" }],
            },
          },
        },
      ],
    }).compileComponents();
  });

  it("habilita Guardar cuando los campos obligatorios tienen valor", () => {
    const fixture = TestBed.createComponent(OrdenCompraDetalleForm);
    fixture.detectChanges();

    const cmp = fixture.componentInstance;
    expect(cmp.form.invalid).toBe(true); // faltan precio y unidad de medida

    // Simula la captura del usuario en el input de Precio Unitario
    const priceInput: HTMLInputElement | null = fixture.nativeElement
      .querySelectorAll("p-inputnumber input")
      .item(1); // 0=cantidad, 1=precio unitario
    expect(priceInput).not.toBeNull();
    priceInput!.focus();
    priceInput!.value = "150";
    priceInput!.dispatchEvent(
      new InputEvent("input", { bubbles: true, data: "150" }),
    );
    priceInput!.dispatchEvent(new Event("blur", { bubbles: true }));
    fixture.detectChanges();
    expect(cmp.form.controls.unitPrice.value).toBe(150);

    // Unidad de medida via control (el overlay de p-select no abre en jsdom)
    cmp.form.controls.unidadMedidaId.setValue("u1");
    fixture.detectChanges();

    const btn: HTMLButtonElement | null =
      fixture.nativeElement.querySelector("il-button button");
    expect(cmp.form.valid).toBe(true);
    expect(btn?.disabled).toBe(false);
  });
});
