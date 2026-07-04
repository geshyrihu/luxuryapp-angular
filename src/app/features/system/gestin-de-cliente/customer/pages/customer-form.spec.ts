import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { FlatpickrDefaults } from "angularx-flatpickr";
import { MessageService } from "primeng/api";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { of } from "rxjs";
import { CustomInputMaskSignal } from "@ui/inputs/web/custom-input-mask-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomerForm } from "./customer-form";

describe("CustomerForm", () => {
  let component: CustomerForm;
  let fixture: ComponentFixture<CustomerForm>;

  beforeEach(async () => {
    TestBed.overrideComponent(CustomInputMaskSignal, {
      set: { template: "<div>Mock Mask</div>", imports: [] },
    });
    TestBed.overrideComponent(CustomInputSelectSignal, {
      set: { template: "<div>Mock Select</div>", imports: [] },
    });
    TestBed.overrideComponent(CustomInputNumberSignal, {
      set: { template: "<div>Mock Number</div>", imports: [] },
    });

    await TestBed.configureTestingModule({
      imports: [CustomerForm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
        {
          provide: DialogService,
          useValue: {
            open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }),
          },
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
        { provide: FlatpickrDefaults, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerForm);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
