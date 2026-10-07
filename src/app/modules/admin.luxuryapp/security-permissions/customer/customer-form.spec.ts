import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { LuxInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { LuxInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { FlatpickrDefaults } from "angularx-flatpickr";
import { of } from "rxjs";
import { CustomerForm } from "./customer-form";

describe("CustomerForm", () => {
  let component: CustomerForm;
  let fixture: ComponentFixture<CustomerForm>;

  beforeEach(async () => {
    TestBed.overrideComponent(InputMask, {
      set: { template: "<div>Mock Mask</div>", imports: [] },
    });
    TestBed.overrideComponent(LuxInputSelectSignal, {
      set: { template: "<div>Mock Select</div>", imports: [] },
    });
    TestBed.overrideComponent(LuxInputNumberSignal, {
      set: { template: "<div>Mock Number</div>", imports: [] },
    });

    await TestBed.configureTestingModule({
      imports: [CustomerForm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
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
