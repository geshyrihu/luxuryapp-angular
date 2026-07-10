import { CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TicketFilterService } from "src/app/core/services/ticket-filter.service";
import { vi } from "vitest";
import { ReportHeader } from "./report-header";

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

describe("ReportHeader", () => {
  let component: ReportHeader;
  let fixture: ComponentFixture<ReportHeader>;
  let apiResponseServiceMock: any;
  let customerIdServiceMock: any;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  beforeEach(async () => {
    customerIdServiceMock = {
      customerId: signal(""),
    };

    apiResponseServiceMock = {
      onGetItem: vi.fn().mockImplementation(() =>
        Promise.resolve({
          nameCustomer: "API Customer Name",
          photoPath: "api-photo-path.png",
        }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [ReportHeader],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
        { provide: CustomerIdService, useValue: customerIdServiceMock },
        { provide: TicketFilterService, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportHeader);
    component = fixture.componentInstance;
  });

  it("debe crearse correctamente", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("debe mostrar logo por defecto si no hay datos", () => {
    fixture.detectChanges();
    expect(component.logoUrl()).toBe("assets/images/default-avatar.png");
  });

  it("debe priorizar datos de la API sobre los inputs", async () => {
    fixture.componentRef.setInput("nameCustomer", "Input Name");
    fixture.componentRef.setInput("logoCustomer", "input-logo.png");

    customerIdServiceMock.customerId.set("test-id");
    fixture.detectChanges();

    await delay(50);
    fixture.detectChanges();

    expect(component.nameCustomer()).toBe("API Customer Name");
    expect(component.logoUrl()).toBe("api-photo-path.png");
  });

  it("debe usar inputs si la API no ha cargado datos", () => {
    fixture.componentRef.setInput("nameCustomer", "Input Name");
    fixture.componentRef.setInput("logoCustomer", "input-logo.png");
    fixture.detectChanges();

    expect(component.nameCustomer()).toBe("Input Name");
    expect(component.logoUrl()).toBe("input-logo.png");
  });

  it("debe resetear datos si customerId se limpia", async () => {
    customerIdServiceMock.customerId.set("test-id");
    fixture.detectChanges();
    await delay(50);
    fixture.detectChanges();
    expect(component.nameCustomer()).toBe("API Customer Name");

    customerIdServiceMock.customerId.set("");
    fixture.detectChanges();
    // No necesitamos delay real aquí porque el reset es síncrono en el effect
    // Pero el effect corre en el siguiente microtick
    await delay(50);
    fixture.detectChanges();

    expect(component.nameCustomer()).toBe("");
    expect(component.logoUrl()).toBe("assets/images/default-avatar.png");
  });
});
