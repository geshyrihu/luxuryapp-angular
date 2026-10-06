import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlatformService } from '@core/services/platform.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'src/app/core/services/dialog-handler.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ConfirmService } from '@ui/buttons/shared/confirm.service';
import { VaultSecretsList } from './vault-secrets-list';

describe('VaultSecretsList', () => {
  let component: VaultSecretsList;
  let fixture: ComponentFixture<VaultSecretsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaultSecretsList],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { data: {}, params: {}, queryParams: {} }, params: of({}), queryParams: of({}) } },
        { provide: ModalController, useValue: {} },
        { provide: NgbModal, useValue: {} },
        { provide: PlatformService, useValue: { isMobile: () => false } },
        { provide: ConfirmService, useValue: { confirm: vi.fn().mockResolvedValue(true) } },
        { provide: 'HttpClientWithoutInterceptors', useValue: (globalThis as any).__mockHttpClient },
      ],
    });
    TestBed.overrideComponent(VaultSecretsList, { set: { template: '<div></div>', imports: [] } });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(VaultSecretsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
