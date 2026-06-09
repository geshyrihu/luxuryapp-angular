import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { vi } from "vitest";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { GoogleCalendarForm } from "./google-calendar-form";

vi.mock("src/app/core/services/api-response.service", () => ({
  ApiResponseService: class ApiResponseService {},
}));

vi.mock("src/app/core/services/asp-role.service", () => ({
  AspRoleService: class AspRoleService {},
}));

vi.mock("src/app/core/services/date.service", () => ({
  DateService: class DateService {},
}));

vi.mock("src/app/core/services/enum-select.service", () => ({
  EnumSelectService: class EnumSelectService {},
}));

describe("GoogleCalendarForm", () => {
  let fixture: ComponentFixture<GoogleCalendarForm>;
  let apiMock: {
    onGetList: ReturnType<typeof vi.fn>;
    onGetItem: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiMock = {
      onGetList: vi.fn().mockResolvedValue([]),
      onGetItem: vi.fn().mockResolvedValue({}),
    };

    TestBed.configureTestingModule({
      imports: [GoogleCalendarForm, NoopAnimationsModule],
      providers: [
        { provide: ApiResponseService, useValue: apiMock },
        {
          provide: DynamicDialogConfig,
          useValue: {
            data: { customerId: "test-customer-123" },
          },
        },
        {
          provide: DynamicDialogRef,
          useValue: {
            close: vi.fn(),
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
          useValue: {
            getDateFormat: vi.fn().mockReturnValue("dd/MM/yyyy"),
          },
        },
        {
          provide: EnumSelectService,
          useValue: {
            getSubjectTypeGoogleCalendarEnum: vi.fn().mockReturnValue(of([])),
            getModalityGoogleCalendarEnum: vi.fn().mockReturnValue(of([])),
            recurrence: vi.fn().mockReturnValue(of([])),
          },
        },
      ],
    });

    TestBed.overrideComponent(GoogleCalendarForm, {
      set: {
        template: `<div class="test-shell">Google Calendar Form</div>`,
      },
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(GoogleCalendarForm);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it("renders without dependency injection errors", () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain("Google Calendar Form");
  });
});
