import { CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TicketFilterService } from "src/app/core/services/ticket-filter.service";
import { vi } from "vitest";
import { HeaderCustomer } from "./haeder-customer";

// Mock de Ionic
vi.mock("@ionic/angular/standalone", async () => {
  const { Component } = await import("@angular/core");
  @Component({ selector: "ion-spinner", template: "", standalone: true })
  class Mock {}
  return {
    IonSpinner: Mock,
    IonButton: Mock,
    IonIcon: Mock,
    IonItem: Mock,
    IonLabel: Mock,
    IonContent: Mock,
    IonList: Mock,
    IonPopover: Mock,
  };
});

describe("HeaderCustomer", () => {
  let component: HeaderCustomer;
  let fixture: ComponentFixture<HeaderCustomer>;
  let apiResponseServiceMock: any;
  let customerIdServiceMock: any;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  beforeEach(async () => {
    const customerIdSignal = signal<string>("");

    customerIdServiceMock = {
      customerId: customerIdSignal,
    };

    apiResponseServiceMock = {
      onGetItem: vi.fn().mockImplementation(() =>
        Promise.resolve({
          nameCustomer: "Test Customer Name",
          photoPath: "test-photo-path.png",
        }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [HeaderCustomer],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
        { provide: CustomerIdService, useValue: customerIdServiceMock },
        { provide: TicketFilterService, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderCustomer);
    component = fixture.componentInstance;
  });

  it("debe crearse correctamente", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("debe cargar los datos del cliente cuando customerId cambia", async () => {
    fixture.detectChanges(); // Init

    // Act
    customerIdServiceMock.customerId.set("test-customer-id");

    // Esperar a que el effect y la promesa se procesen
    await delay(50);
    fixture.detectChanges();

    expect(apiResponseServiceMock.onGetItem).toHaveBeenCalled();
    expect(component.nameCustomer()).toBe("Test Customer Name");
    expect(component.logoCustomer()).toBe("test-photo-path.png");
  });

  it("debe mostrar el nombre del cliente en el template", async () => {
    customerIdServiceMock.customerId.set("test-customer-id");
    fixture.detectChanges();

    await delay(50);
    fixture.detectChanges();

    const h4 = fixture.nativeElement.querySelector("h4");
    expect(h4.textContent).toContain("Test Customer Name");
  });

  it("debe mostrar el título y subtítulo pasados por input", () => {
    fixture.componentRef.setInput("title", "Custom Title");
    fixture.componentRef.setInput("subTitle", "Custom Subtitle");
    fixture.detectChanges();

    const headings = fixture.nativeElement.querySelectorAll("h4");
    const p = fixture.nativeElement.querySelector("p");

    expect(headings[1].textContent).toContain("Custom Title");
    expect(p.textContent).toContain("Custom Subtitle");
  });

  it("debe reaccionar a cambios en customerId", async () => {
    fixture.detectChanges();

    const newCustomerData = {
      nameCustomer: "New Customer Name",
      photoPath: "new-photo-path.png",
    };
    apiResponseServiceMock.onGetItem.mockResolvedValue(newCustomerData);

    // Cambiar el signal del mock
    customerIdServiceMock.customerId.set("new-id");

    await delay(50);
    fixture.detectChanges();

    expect(component.nameCustomer()).toBe("New Customer Name");
  });
});
