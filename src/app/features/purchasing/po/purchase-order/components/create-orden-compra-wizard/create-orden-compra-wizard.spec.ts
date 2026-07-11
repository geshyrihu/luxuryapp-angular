import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { ModalController } from "@ionic/angular/standalone";
import { MessageService } from "primeng/api";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { CreateOrdenCompraWizard } from "./create-orden-compra-wizard";

describe("CreateOrdenCompraWizard", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrdenCompraWizard],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        DialogService,
        { provide: ModalController, useValue: {} },
        { provide: DynamicDialogRef, useValue: { close: () => {} } },
        { provide: DynamicDialogConfig, useValue: { data: null } },
      ],
    }).compileComponents();
  });

  it("renderiza el autocomplete del paso 2", () => {
    const fixture = TestBed.createComponent(CreateOrdenCompraWizard);
    fixture.detectChanges();

    const cmp = fixture.componentInstance;
    cmp.activeIndex = 1;
    fixture.componentRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    // Regresión: con ng-content duplicado en base-input-signal, la rama
    // onlyInput del paso 2 renderizaba vacía (sin p-autocomplete).
    const input = el.querySelector(
      "custom-input-autocomplete-signal p-autocomplete input",
    );
    expect(input).not.toBeNull();
  });

  it("abre el detalle con productoId y productName del item seleccionado", () => {
    const fixture = TestBed.createComponent(CreateOrdenCompraWizard);
    fixture.detectChanges();

    const cmp = fixture.componentInstance;
    // Regresión: onProductSelect desempaquetaba dos veces el payload de
    // (propagar) y abría el dialog con productoId/productName undefined,
    // dejando el form del detalle inválido y "Guardar" deshabilitado.
    const openDialog = vi
      .spyOn(cmp.dialogHandlerS, "openDialog")
      .mockResolvedValue(null);

    cmp.onProductSelect({ value: "prod-1", label: "Producto Demo", image: "" });

    expect(openDialog).toHaveBeenCalledTimes(1);
    const data = openDialog.mock.calls[0][1] as any;
    expect(data.product.productoId).toBe("prod-1");
    expect(data.product.productName).toBe("Producto Demo");
  });
});
