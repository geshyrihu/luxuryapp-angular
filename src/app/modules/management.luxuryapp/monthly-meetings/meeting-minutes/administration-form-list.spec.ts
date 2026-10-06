import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { vi } from "vitest";
import { AdministrationFormList } from "./administration-form-list";

describe("AdministrationFormList", () => {
  let component: AdministrationFormList;
  let fixture: ComponentFixture<AdministrationFormList>;
  let mockApiResponseS: any;
  let mockConfirmS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onGetSelectItem: vi.fn().mockResolvedValue([]),
      onDelete: vi.fn().mockResolvedValue(true),
      onPost: vi.fn().mockResolvedValue(true),
    };
    mockConfirmS = { confirm: vi.fn().mockResolvedValue(true) };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(AdministrationFormList, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [AdministrationFormList],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        {
          provide: CustomerIdService,
          useValue: { customerId: signal("cust-123") },
        },
        { provide: ConfirmService, useValue: mockConfirmS }],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(AdministrationFormList);
    component = fixture.componentInstance;
  });

  it("onDelete should not delete when confirmation is cancelled", async () => {
    mockConfirmS.confirm.mockResolvedValueOnce(false);

    await component.onDelete(1);

    expect(mockConfirmS.confirm).toHaveBeenCalledOnce();
    expect(mockApiResponseS.onDelete).not.toHaveBeenCalled();
  });

  it("onDelete should delete when confirmation is accepted", async () => {
    await component.onDelete(1);

    expect(mockApiResponseS.onDelete).toHaveBeenCalledOnce();
  });
});
