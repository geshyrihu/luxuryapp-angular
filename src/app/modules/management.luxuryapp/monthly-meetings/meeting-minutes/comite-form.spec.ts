import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { vi } from "vitest";
import { ComiteForm } from "./comite-form";

describe("ComiteForm", () => {
  let component: ComiteForm;
  let fixture: ComponentFixture<ComiteForm>;
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
    TestBed.overrideComponent(ComiteForm, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [ComiteForm],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        {
          provide: CustomerIdService,
          useValue: { customerId: signal("cust-123") },
        },
        { provide: ConfirmService, useValue: mockConfirmS }],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ComiteForm);
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
