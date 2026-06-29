import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { vi } from "vitest";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogService } from "primeng/dynamicdialog";
import { ConfirmationService, MessageService } from "primeng/api";
import { GoogleCalendar } from "./google-calendar";
import { SignalRService } from "src/app/core/services/signalr.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { Subject } from "rxjs";

vi.mock("src/app/core/components/shared/pdf-viewer-modal/pdf-viewer-modal", () => ({
  PdfViewerModal: class PdfViewerModal {},
}));

vi.mock("@ionic/angular/standalone", async () => {
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

vi.mock("src/app/core/components/mobile/buttons", async () => {
  const mocks = await import("./ionic-mocks");
  return {
    IonButtonDelete: mocks.MockIonButtonDelete,
    IonButtonEdit: mocks.MockIonButtonEdit,
  };
});

vi.mock("src/app/core/services/api-response.service", () => ({
  ApiResponseService: class ApiResponseService {},
}));

vi.mock("src/app/core/services/customer-id.service", () => ({
  CustomerIdService: class CustomerIdService {},
}));

vi.mock("src/app/core/services/signalr.service", () => ({
  SignalRService: class SignalRService {},
}));

vi.mock("src/app/core/services/asp-role.service", () => ({
  AspRoleService: class AspRoleService {},
}));

vi.mock("src/app/core/services/date.service", () => ({
  DateService: class DateService {},
}));

vi.mock("src/app/core/services/dialog-handler.service", () => ({
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
          provide: ConfirmationService,
          useValue: {
            confirm: vi.fn(),
          },
        },
        {
          provide: MessageService,
          useValue: {
            add: vi.fn(),
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


