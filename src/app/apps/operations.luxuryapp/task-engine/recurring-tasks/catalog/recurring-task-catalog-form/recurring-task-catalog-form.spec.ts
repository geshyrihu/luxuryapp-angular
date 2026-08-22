import { TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { RecurringTaskCatalogForm } from "./recurring-task-catalog-form";

describe("RecurringTaskCatalogForm", () => {
  const apiResponseS = {
    onGetList: vi.fn(),
    onGetEnumSelectItem: vi.fn(),
    onGetItem: vi.fn(),
  };

  beforeEach(() => {
    apiResponseS.onGetList.mockReset();
    apiResponseS.onGetEnumSelectItem.mockReset();
    apiResponseS.onGetItem.mockReset();
    apiResponseS.onGetEnumSelectItem.mockResolvedValue([
      { label: "Alta", value: 0 },
      { label: "Baja", value: 1 },
      { label: "Crítica", value: 2 },
    ]);
    apiResponseS.onGetList.mockResolvedValue([]);
    apiResponseS.onGetItem.mockResolvedValue(null);

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RecurringTaskCatalogForm],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseS },
        {
          provide: CustomerIdService,
          useValue: { customerId: () => "customer-1" },
        },
        { provide: AuthService, useValue: { applicationUserId: "user-1" } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
      ],
    }).overrideComponent(RecurringTaskCatalogForm, {
      set: { template: "" },
    });
  });

  it("filters public work groups from the selector", async () => {
    apiResponseS.onGetList.mockResolvedValueOnce([
      { id: "private-1", nameGroup: "Mantenimiento", visibility: "Privado" },
      { id: "public-1", nameGroup: "Comunidad", visibility: "Público" },
    ]);

    const fixture = TestBed.createComponent(RecurringTaskCatalogForm);
    const component = fixture.componentInstance;

    await component.loadWorkGroups();

    expect(apiResponseS.onGetList).toHaveBeenCalledWith(
      Endpoints.TaskGroups.list("customer-1", true, "user-1"),
    );
    expect(component.workGroups()).toEqual([
      { label: "Mantenimiento", value: "private-1" },
    ]);
  });

  it("loads criticalities from the enum select endpoint", async () => {
    const fixture = TestBed.createComponent(RecurringTaskCatalogForm);
    const component = fixture.componentInstance;

    await component.loadCriticalities();

    expect(apiResponseS.onGetEnumSelectItem).toHaveBeenCalledWith(
      Endpoints.SelectItems.priorityLevel,
    );
    expect(component.criticalities()).toEqual([
      { label: "Alta", value: 0 },
      { label: "Baja", value: 1 },
      { label: "Crítica", value: 2 },
    ]);
  });

  it("requires backup user only when criticality is critical", () => {
    const fixture = TestBed.createComponent(RecurringTaskCatalogForm);
    const component = fixture.componentInstance;

    component.form.patchValue({
      workGroupId: "group-1",
      title: "Cierre mensual",
      recurrenceRule: "FREQ=MONTHLY;BYMONTHDAY=-1",
      criticality: 2,
      startDate: new Date(2026, 0, 1),
    });

    expect(component.form.hasError("backupRequiredForCritical")).toBe(true);

    component.form.controls.backupUserId.setValue("backup-1");
    component.form.updateValueAndValidity();

    expect(component.form.hasError("backupRequiredForCritical")).toBe(false);

    component.form.controls.criticality.setValue(1);
    component.form.controls.backupUserId.setValue(null);
    component.form.updateValueAndValidity();

    expect(component.form.hasError("backupRequiredForCritical")).toBe(false);
  });

  it("submits through FormHelper.submitCrud with the catalog endpoint", () => {
    const submitSpy = vi
      .spyOn(FormHelper, "submitCrud")
      .mockImplementation(() => Promise.resolve());
    const fixture = TestBed.createComponent(RecurringTaskCatalogForm);
    const component = fixture.componentInstance;

    component.form.patchValue({
      workGroupId: "group-1",
      title: "Cierre mensual",
      recurrenceRule: "FREQ=MONTHLY;BYMONTHDAY=-1",
      criticality: 1,
      startDate: new Date(2026, 0, 1),
      advanceNoticeDays: 3,
    });

    component.onSubmit();

    expect(submitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: Endpoints.RecurringTaskCatalog.base,
        id: null,
      }),
    );

    submitSpy.mockRestore();
  });
});
