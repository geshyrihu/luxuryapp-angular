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
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { ApplicationUserForm } from "./application-user-form";

describe("ApplicationUserForm", () => {
  let component: ApplicationUserForm;
  let fixture: ComponentFixture<ApplicationUserForm>;

  beforeEach(async () => {
    TestBed.overrideComponent(CustomInputMaskSignal, {
      set: { template: "<div>Mock Mask</div>", imports: [] },
    });
    TestBed.overrideComponent(CustomInputSelectSignal, {
      set: { template: "<div>Mock Select</div>", imports: [] },
    });

    await TestBed.configureTestingModule({
      imports: [ApplicationUserForm],
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

    fixture = TestBed.createComponent(ApplicationUserForm);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
