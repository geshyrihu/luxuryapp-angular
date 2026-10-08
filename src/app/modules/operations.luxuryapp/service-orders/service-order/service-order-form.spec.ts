import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig, DynamicDialogRef } from "@core/services/dialog-handler.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DateService } from "@core/services/date.service";
import { vi } from "vitest";
import { ServiceOrderForm } from "./service-order-form";

const apiMock = {
  onGetSelectItem: vi.fn().mockResolvedValue([]),
  onGetEnumSelectItem: vi.fn().mockResolvedValue([]),
};

describe("ServiceOrderForm", () => {
  let component: ServiceOrderForm;
  let fixture: ComponentFixture<ServiceOrderForm>;

  beforeEach(async () => {
    TestBed.overrideComponent(ServiceOrderForm, {
      set: { template: "<div></div>", imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [ServiceOrderForm],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiMock },
        {
          provide: DateService,
          useValue: {
            getDateFormat: (value: string) => value || null,
            getDateNow: () => "2026-10-07",
          },
        },
        { provide: CustomerIdService, useValue: { customerId: signal("customer-1") } },
        { provide: DynamicDialogConfig, useValue: { data: { id: 0 } } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } }],
    });

    fixture = TestBed.createComponent(ServiceOrderForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it("clears and disables provider when internal execution is selected", () => {
    component.form.controls.providerId.setValue(42);
    component.form.controls.provider.setValue("Proveedor X");

    component.form.controls.isInternalExecution.setValue(true);

    expect(component.form.controls.providerId.value).toBeNull();
    expect(component.form.controls.provider.value).toBeNull();
    expect(component.form.controls.providerId.disabled).toBe(true);
    expect(component.form.controls.provider.disabled).toBe(true);

    component.form.controls.isInternalExecution.setValue(false);
    expect(component.form.controls.providerId.enabled).toBe(true);
    expect(component.form.controls.provider.enabled).toBe(true);
  });

  it("always normalizes a missing request date to today's date", () => {
    expect(component.form.controls.requestDate.value).toBe("2026-10-07");
    expect(component["normalizeRequestDate"](null)).toBe("2026-10-07");
    expect(component["normalizeRequestDate"]("")).toBe("2026-10-07");
    expect(component["normalizeRequestDate"]("2026-10-03")).toBe("2026-10-03");
  });

  it("loads responsible users from employee-backed select items", async () => {
    await component["loadApplicationUsers"]();

    expect(apiMock.onGetSelectItem).toHaveBeenCalledWith(
      Endpoints.SelectItems.employeesByUserId("customer-1"),
    );
  });

  it("reflects API coherence rules immediately while editing", () => {
    component.form.controls.price.setValue(-1);
    expect(component.form.controls.price.hasError("min")).toBe(true);
    expect(component.form.hasError("negativePrice")).toBe(true);

    component.form.controls.price.setValue(0);
    component.form.controls.requestDate.setValue("2026-10-03");
    component.form.controls.executionDate.setValue("2026-10-02");
    expect(component.form.hasError("executionBeforeRequest")).toBe(true);

    component.form.controls.executionDate.setValue("");
    component.form.controls.status.setValue(1);
    expect(component.form.hasError("concludedWithoutExecution")).toBe(true);

    component.form.controls.activity.setValue("x".repeat(2001));
    component.form.controls.observations.setValue("x".repeat(4001));
    expect(component.form.controls.activity.hasError("maxlength")).toBe(true);
    expect(component.form.controls.observations.hasError("maxlength")).toBe(true);
  });

  it("exposes the missing responsible employee validation that blocks saving", () => {
    expect(component.form.controls.employeeResponsableId.hasError("required")).toBe(true);

    component.saveResponsibleUserId({ value: "employee-user-1", label: "Ana" });

    expect(component.form.controls.employeeResponsableId.valid).toBe(true);
    expect(component.form.invalid).toBe(true); // Other required fields remain incomplete.
  });
});
