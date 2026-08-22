import { TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { RecurringTaskCatalogList } from "./recurring-task-catalog-list";

describe("RecurringTaskCatalogList", () => {
  const apiResponseS = {
    onGetList: vi.fn(),
    onPatch: vi.fn(),
  };

  beforeEach(() => {
    apiResponseS.onGetList.mockReset();
    apiResponseS.onPatch.mockReset();
    apiResponseS.onGetList.mockResolvedValue([]);
    apiResponseS.onPatch.mockResolvedValue(true);

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RecurringTaskCatalogList],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseS },
        {
          provide: CustomerIdService,
          useValue: { customerId: () => "customer-1" },
        },
        {
          provide: DialogHandlerService,
          useValue: {
            sizeLg: "lg",
            openDialog: vi.fn().mockResolvedValue(false),
          },
        },
        {
          provide: TableScrollHeightService,
          useValue: { scrollHeight: "400px" },
        },
      ],
    }).overrideComponent(RecurringTaskCatalogList, {
      set: { template: "" },
    });
  });

  it("loads templates by selected customer and active filter", async () => {
    apiResponseS.onGetList.mockResolvedValueOnce([
      {
        id: "template-1",
        customerId: "customer-1",
        title: "Bitácora diaria",
        description: "",
        recurrenceRule: "FREQ=DAILY",
        criticality: 1,
        advanceNoticeDays: 3,
        startDate: "2026-01-01",
        endDate: null,
        workGroupId: "group-1",
        workGroupName: "Operaciones",
        backupUserId: null,
        expectedDeliverableName: "",
        requiresAttachment: false,
        status: "Active",
      },
    ]);

    const fixture = TestBed.createComponent(RecurringTaskCatalogList);
    const component = fixture.componentInstance;

    await component.onLoadData(true);

    expect(apiResponseS.onGetList).toHaveBeenCalledWith(
      Endpoints.RecurringTaskCatalog.list("customer-1", undefined, true),
    );
    expect(component.data()).toHaveLength(1);
  });

  it("toggles status through PATCH and reloads the list", async () => {
    const fixture = TestBed.createComponent(RecurringTaskCatalogList);
    const component = fixture.componentInstance;
    const loadSpy = vi.spyOn(component, "onLoadData").mockResolvedValue();

    await component.onToggleStatus("template-1");

    expect(apiResponseS.onPatch).toHaveBeenCalledWith(
      Endpoints.RecurringTaskCatalog.toggleStatus("template-1"),
      {},
    );
    expect(loadSpy).toHaveBeenCalled();

    loadSpy.mockRestore();
  });
});
