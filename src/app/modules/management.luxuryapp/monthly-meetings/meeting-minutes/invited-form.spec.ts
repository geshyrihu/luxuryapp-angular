import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { vi } from "vitest";
import { InvitedForm } from "./invited-form";

describe("InvitedForm", () => {
  let component: InvitedForm;
  let fixture: ComponentFixture<InvitedForm>;
  let mockApiResponseS: any;
  let mockConfirmS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onDelete: vi.fn().mockResolvedValue(true),
      onPost: vi.fn().mockResolvedValue(true),
    };
    mockConfirmS = { confirm: vi.fn().mockResolvedValue(true) };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(InvitedForm, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [InvitedForm],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: ConfirmService, useValue: mockConfirmS }],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(InvitedForm);
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
