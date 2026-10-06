import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { CustomToastService } from "@core/services/custom-toast.service";
import { DateService } from "@core/services/date.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { SwalService } from "@core/services/swal.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { vi } from "vitest";
import { PresentacionJuntaComite } from "./presentacion-junta-comite";

describe("PresentacionJuntaComite", () => {
  let component: PresentacionJuntaComite;
  let fixture: ComponentFixture<PresentacionJuntaComite>;
  let mockApiResponseS: any;
  let mockConfirmS: any;
  let mockSwalS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onDelete: vi.fn().mockResolvedValue(true),
      onPost: vi.fn().mockResolvedValue(true),
    };
    mockConfirmS = { confirm: vi.fn().mockResolvedValue(true) };
    mockSwalS = { confirm: vi.fn().mockResolvedValue(true) };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(PresentacionJuntaComite, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [PresentacionJuntaComite],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        {
          provide: DialogHandlerService,
          useValue: {
            openDialog: vi.fn().mockResolvedValue(true),
            sizeXl: "xl",
          },
        },
        {
          provide: AuthService,
          useValue: {
            applicationUserId: "user-1",
            userToken: {
              infoUserAuthDTO: { applicationUserId: "user-1" },
            },
          },
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
          provide: CustomerIdService,
          useValue: { customerId: signal("cust-123") },
        },
        {
          provide: CustomToastService,
          useValue: { showInfo: vi.fn(), showError: vi.fn() },
        },
        { provide: DateService, useValue: { parseDate: vi.fn() } },
        { provide: PlatformService, useValue: { isMobile: vi.fn(() => false) } },
        { provide: ConfirmService, useValue: mockConfirmS },
        { provide: SwalService, useValue: mockSwalS }],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(PresentacionJuntaComite);
    component = fixture.componentInstance;
  });

  it("onDeleteItem should not delete when confirmation is cancelled", async () => {
    mockConfirmS.confirm.mockResolvedValueOnce(false);

    await component.onDeleteItem("1");

    expect(mockApiResponseS.onDelete).not.toHaveBeenCalled();
  });

  it("onDeleteFile should not delete when confirmation is cancelled", async () => {
    mockConfirmS.confirm.mockResolvedValueOnce(false);

    await component.onDeleteFile("1", "Portada");

    expect(mockApiResponseS.onDelete).not.toHaveBeenCalled();
  });

  it("onValidarPresentacion should not post when confirmation is cancelled", async () => {
    mockSwalS.confirm.mockResolvedValueOnce(false);

    await component.onValidarPresentacion("1");

    expect(mockApiResponseS.onPost).not.toHaveBeenCalled();
  });

  it("onOnlyValidate should not post when confirmation is cancelled", async () => {
    mockSwalS.confirm.mockResolvedValueOnce(false);

    await component.onOnlyValidate("1");

    expect(mockApiResponseS.onPost).not.toHaveBeenCalled();
  });
});
