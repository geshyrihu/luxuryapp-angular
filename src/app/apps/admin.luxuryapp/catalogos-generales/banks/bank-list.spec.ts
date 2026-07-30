import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MessageService } from "primeng/api";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { of } from "rxjs";
import { Platform } from "@ionic/angular";
import { BankList } from "./bank-list";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";

describe("BankList", () => {
  let component: BankList;
  let fixture: ComponentFixture<BankList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankList, RouterModule.forRoot([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
        {
          provide: DialogService,
          useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) },
        },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: {}, params: {}, queryParams: {} },
            params: of({}),
            queryParams: of({}),
          },
        },
        {
          provide: "HttpClientWithoutInterceptors",
          useValue: (globalThis as any).__mockHttpClient,
        },
        { provide: Platform, useValue: { is: vi.fn().mockReturnValue(false) } },
        TableScrollHeightService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BankList);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    vi.spyOn(component.apiResponseS, "onGetList").mockResolvedValue([]);

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should load data on init", async () => {
    const banks = [
      { id: "1", code: "BOA", shortName: "Bank", largeName: "Bank Corp" },
    ];
    const onGetListSpy = vi
      .spyOn(component.apiResponseS, "onGetList")
      .mockResolvedValue(banks);

    fixture.detectChanges();
    await Promise.resolve();

    expect(onGetListSpy).toHaveBeenCalledOnce();
    expect(component.dataSignal()).toEqual(banks);
  });

  it("should remove bank from signal after successful delete", async () => {
    vi.spyOn(component.apiResponseS, "onGetList").mockResolvedValue([]);
    vi.spyOn(component.apiResponseS, "onDelete").mockResolvedValue(true);
    component.dataSignal.set([
      { id: "1", code: "BOA", shortName: "Bank A", largeName: "Bank A SA" },
      { id: "2", code: "JPM", shortName: "Bank B", largeName: "Bank B SA" },
    ]);

    await component.onDelete("1");

    expect(component.dataSignal()).toEqual([
      { id: "2", code: "JPM", shortName: "Bank B", largeName: "Bank B SA" },
    ]);
  });

  it("should reload data after modal returns success", async () => {
    const onLoadDataSpy = vi
      .spyOn(component, "onLoadData")
      .mockImplementation(() => undefined);
    vi.spyOn(component.dialogHandlerS, "openDialog").mockResolvedValue(true);

    await component.onModalForm({ id: "1", title: "Editar banco" });

    expect(component.dialogHandlerS.openDialog).toHaveBeenCalled();
    expect(onLoadDataSpy).toHaveBeenCalledOnce();
  });
}
