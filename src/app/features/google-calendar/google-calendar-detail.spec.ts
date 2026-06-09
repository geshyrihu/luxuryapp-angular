import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { GoogleCalendarDetail } from "./google-calendar-detail";

describe("GoogleCalendarDetail", () => {
  let fixture: ComponentFixture<GoogleCalendarDetail>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [GoogleCalendarDetail, NoopAnimationsModule],
      providers: [
        {
          provide: DynamicDialogConfig,
          useValue: {
            data: { id: "test-event-123" },
          },
        },
        {
          provide: DynamicDialogRef,
          useValue: {
            close: vi.fn(),
          },
        },
      ],
    });

    TestBed.overrideComponent(GoogleCalendarDetail, {
      set: {
        template: `<div class="test-shell">Google Calendar Detail</div>`,
      },
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(GoogleCalendarDetail);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it("renders without dependency injection errors", () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain("Google Calendar Detail");
  });
});
