import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SwalService } from "@core/services/swal.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { vi } from "vitest";
import { AreaDetailsTable } from "./meeting-area-table";

describe("AreaDetailsTable", () => {
  let component: AreaDetailsTable;
  let fixture: ComponentFixture<AreaDetailsTable>;
  let mockConfirmS: any;
  let mockSwalS: any;

  beforeEach(() => {
    mockConfirmS = { confirm: vi.fn().mockResolvedValue(true) };
    mockSwalS = { confirm: vi.fn().mockResolvedValue(true) };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(AreaDetailsTable, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [AreaDetailsTable],
      providers: [
        { provide: ConfirmService, useValue: mockConfirmS },
        { provide: SwalService, useValue: mockSwalS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(AreaDetailsTable);
    component = fixture.componentInstance;
  });

  it("onDeleteDetail should not emit when confirmation is cancelled", async () => {
    mockConfirmS.confirm.mockResolvedValueOnce(false);
    const spy = vi.spyOn(component.deleteDetail, "emit");

    await component.onDeleteDetail(1);

    expect(spy).not.toHaveBeenCalled();
  });

  it("onDeleteDetail should emit when confirmation is accepted", async () => {
    const spy = vi.spyOn(component.deleteDetail, "emit");

    await component.onDeleteDetail(1);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it("onDeleteSeguimiento should not emit when confirmation is cancelled", async () => {
    mockConfirmS.confirm.mockResolvedValueOnce(false);
    const spy = vi.spyOn(component.deleteSeguimiento, "emit");

    await component.onDeleteSeguimiento(7);

    expect(spy).not.toHaveBeenCalled();
  });

  it("onSendAreaEmail should not emit when confirmation is cancelled", async () => {
    mockSwalS.confirm.mockResolvedValueOnce(false);
    const spy = vi.spyOn(component.sendAreaEmail, "emit");

    await component.onSendAreaEmail();

    expect(spy).not.toHaveBeenCalled();
  });
});
