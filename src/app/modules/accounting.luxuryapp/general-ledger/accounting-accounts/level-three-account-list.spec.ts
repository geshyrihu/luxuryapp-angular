import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlatformService } from '@core/services/platform.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from '@core/services/dialog-handler.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ConfirmService } from '@ui/buttons/shared/confirm.service';
import { LevelThreeAccountList } from './level-three-account-list';

describe('LevelThreeAccountList', () => {
  let component: LevelThreeAccountList;
  let fixture: ComponentFixture<LevelThreeAccountList>;
  let mockConfirmS: any;

  beforeEach(async () => {
    mockConfirmS = { confirm: vi.fn().mockResolvedValue(true) };
    await TestBed.configureTestingModule({
      imports: [LevelThreeAccountList],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { data: {}, params: {}, queryParams: {} }, params: of({}), queryParams: of({}) } },
        { provide: ModalController, useValue: {} },
        { provide: NgbModal, useValue: {} },
        { provide: PlatformService, useValue: { isMobile: () => false } },
        { provide: ConfirmService, useValue: mockConfirmS },
        { provide: 'HttpClientWithoutInterceptors', useValue: (globalThis as any).__mockHttpClient },
      ],
    });
    TestBed.overrideComponent(LevelThreeAccountList, { set: { template: '<div></div>', imports: [] } });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(LevelThreeAccountList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onDelete should not delete when confirmation is cancelled', async () => {
    mockConfirmS.confirm.mockResolvedValueOnce(false);
    const spy = vi.spyOn((component as any).apiResponseS, 'onDelete');

    await component.onDelete('1');

    expect(mockConfirmS.confirm).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });
});
