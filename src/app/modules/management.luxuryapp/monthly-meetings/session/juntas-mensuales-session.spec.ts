import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DateService } from "@core/services/date.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { SignalRService } from "@core/services/signalr.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { of } from "rxjs";
import { vi } from "vitest";
import { JuntasMensualesSession } from "./juntas-mensuales-session";

describe("JuntasMensualesSession", () => {
  let component: JuntasMensualesSession;
  let fixture: ComponentFixture<JuntasMensualesSession>;
  let mockApiResponseS: any;
  let mockConfirmS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onGetItem: vi.fn().mockResolvedValue(null),
      onPost: vi.fn().mockResolvedValue(true),
    };
    mockConfirmS = { confirm: vi.fn().mockResolvedValue(true) };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(JuntasMensualesSession, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [JuntasMensualesSession],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        {
          provide: CustomerIdService,
          useValue: { customerId: signal("cust-123") },
        },
        {
          provide: AspRoleService,
          useValue: {
            hasRole: vi.fn().mockReturnValue(false),
            hasAny: vi.fn().mockReturnValue(false),
            anyOf: vi.fn().mockReturnValue(signal(false)),
          },
        },
        {
          provide: DialogHandlerService,
          useValue: {
            openDialog: vi.fn().mockResolvedValue(true),
            sizeMd: "md",
            sizeXl: "xl",
          },
        },
        { provide: DateService, useValue: { parseDate: vi.fn() } },
        { provide: Router, useValue: { navigate: vi.fn() } },
        {
          provide: SignalRService,
          useValue: { googleCalendarEventUpdate$: of({ customerId: "cust-123" }) },
        },
        { provide: ConfirmService, useValue: mockConfirmS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(JuntasMensualesSession);
    component = fixture.componentInstance;
  });

  it("onCancel should not post when confirmation is cancelled", async () => {
    mockConfirmS.confirm.mockResolvedValueOnce(false);
    component.selectedDetail.set({ id: "1" } as any);

    await component.onCancel();

    expect(mockConfirmS.confirm).toHaveBeenCalledOnce();
    expect(mockApiResponseS.onPost).not.toHaveBeenCalled();
  });

  it("onCancel should post when confirmation is accepted", async () => {
    component.selectedDetail.set({ id: "1" } as any);

    await component.onCancel();

    expect(mockApiResponseS.onPost).toHaveBeenCalledOnce();
  });

  it("onCancel should no-op when no session is selected", async () => {
    component.selectedDetail.set(null);

    await component.onCancel();

    expect(mockConfirmS.confirm).not.toHaveBeenCalled();
    expect(mockApiResponseS.onPost).not.toHaveBeenCalled();
  });
});
