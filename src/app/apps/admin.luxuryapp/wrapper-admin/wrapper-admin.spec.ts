import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { of } from "rxjs";
import { WrapperAdmin } from "./wrapper-admin";

describe("SettingsHome", () => {
  let component: WrapperAdmin;
  let fixture: ComponentFixture<WrapperAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrapperAdmin],
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WrapperAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
