import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { CustomToastService } from "@core/services/custom-toast.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { SwalService } from "@core/services/swal.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { vi } from "vitest";
import { MinutaPdfService } from "./minuta-pdf.service";
import { MinutasList } from "./minutas-list";

describe("MinutasList", () => {
  let component: MinutasList;
  let fixture: ComponentFixture<MinutasList>;
  let mockApiResponseS: any;
  let mockConfirmS: any;
  let mockSwalS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onDelete: vi.fn().mockResolvedValue(true),
      onPost: vi.fn().mockResolvedValue(true),
      exportToExcel: vi.fn(),
    };
    mockConfirmS = { confirm: vi.fn().mockResolvedValue(true) };
    mockSwalS = { confirm: vi.fn().mockResolvedValue(true) };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(MinutasList, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [MinutasList],
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
            sizeFull: "full",
          },
        },
        { provide: CustomToastService, useValue: { showInfo: vi.fn(), showError: vi.fn() } },
        { provide: MinutaPdfService, useValue: { downloadMinuta: vi.fn() } },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ConfirmService, useValue: mockConfirmS },
        { provide: SwalService, useValue: mockSwalS }],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(MinutasList);
    component = fixture.componentInstance;
  });

  it("onDelete should not delete when confirmation is cancelled", async () => {
    mockConfirmS.confirm.mockResolvedValueOnce(false);
    component.dataSignal.set([{ id: "1" } as any]);

    await component.onDelete("1");

    expect(mockApiResponseS.onDelete).not.toHaveBeenCalled();
    expect(component.dataSignal().length).toBe(1);
  });

  it("onDelete should remove item when confirmation is accepted", async () => {
    component.dataSignal.set([{ id: "1" } as any, { id: "2" } as any]);

    await component.onDelete("1");

    expect(mockApiResponseS.onDelete).toHaveBeenCalledOnce();
    expect(component.dataSignal().length).toBe(1);
  });

  it("onSendEmailMeeting should not post when confirmation is cancelled", async () => {
    mockSwalS.confirm.mockResolvedValueOnce(false);

    await component.onSendEmailMeeting("1");

    expect(mockApiResponseS.onPost).not.toHaveBeenCalled();
  });
});
