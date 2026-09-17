import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { DialogService } from "@core/services/dialog-handler.service";
import { Subject } from "rxjs";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DateService } from "@core/services/date.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { SignalRService } from "@core/services/signalr.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { vi } from "vitest";
import { GoogleCalendar } from "./google-calendar";

vi.mock("@ui/web/pdf-viewer-modal/pdf-viewer-modal", () => ({
  PdfViewerModal: class PdfViewerModal {},
}));

vi.mock("@ionic/angular", async () => {
  const mocks = await import("./ionic-mocks");
  return {
    IonItem: mocks.MockIonItem,
    IonLabel: mocks.MockIonLabel,
    IonButton: mocks.MockIonButton,
    IonIcon: mocks.MockIonIcon,
    IonPopover: mocks.MockIonPopover,
    IonContent: mocks.MockIonContent,
    IonList: mocks.MockIonList,
    IonProgressBar: mocks.MockIonProgressBar,
    IonItemDivider: mocks.MockIonItemDivider,
    IonSearchbar: mocks.MockIonSearchbar,
    IonInfiniteScroll: mocks.MockIonInfiniteScroll,
    IonInfiniteScrollContent: mocks.MockIonInfiniteScrollContent,
  };
});

vi.mock("@core/components/mobile/buttons", async () => {
  const mocks = await import("./ionic-mocks");
  return {
    IonButtonDelete: mocks.MockIonButtonDelete,
    IonButtonEdit: mocks.MockIonButtonEdit,
  };
});

vi.mock("@core/http/services/api-response.service", () => ({
  ApiResponseService: class ApiResponseService {},
}));

vi.mock("@core/auth/services/customer-id.service", () => ({
  CustomerIdService: class CustomerIdService {},
}));

vi.mock("@core/services/signalr.service", () => ({
  SignalRService: class SignalRService {},
}));

vi.mock("@core/auth/services/asp-role.service", () => ({
  AspRoleService: class AspRoleService {},
}));

vi.mock("@core/services/date.service", () => ({
  DateService: class DateService {},
}));

vi.mock("@core/services/dialog-handler.service", () => ({
  DialogHandlerService: class DialogHandlerService {},
}));

describe("GoogleCalendar", () => {
  let fixture: ComponentFixture<GoogleCalendar>;
  let apiMock: {
    onGetList: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiMock = {
      onGetList: vi.fn().mockResolvedValue([]),
    };

    TestBed.configureTestingModule({
      imports: [GoogleCalendar, NoopAnimationsModule],
      providers: [
        { provide: ApiResponseService, useValue: apiMock },
        {
          provide: CustomerIdService,
          useValue: {
            customerId: signal("customer-1"),
          },
        },
        {
          provide: DialogService,
          useValue: {
            open: vi.fn(),
          },
        },
        {
          provide: SignalRService,
          useValue: {
            googleCalendarEventUpdate$: new Subject(),
          },
        },
        {
          provide: AspRoleService,
          useValue: {
            anyOf: vi.fn().mockReturnValue(true),
          },
        },
        {
          provide: DateService,
          useValue: {},
        },
        {
          provide: DialogHandlerService,
          useValue: {},
        },
        {
          provide: TableScrollHeightService,
          useValue: {
            scrollHeight: signal("500px"),
          },
        },
      ],
    });

    TestBed.overrideComponent(GoogleCalendar, {
      set: {
        template: `<div class="test-shell">Google Calendar List</div>`,
      },
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(GoogleCalendar);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it("renders without dependency injection errors", () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain("Google Calendar List");
  });
});
