import { Platform } from '@angular/cdk/platform';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { CustomToastService } from './custom-toast.service';

vi.mock('@ionic/angular/standalone', () => ({
  ToastController: class {},
}));

import { ToastController } from '@ionic/angular/standalone';

const toastControllerMock = {
  create: vi.fn().mockResolvedValue({ present: vi.fn() }),
};

describe('CustomToastService', () => {
  let service: CustomToastService;
  let messageServiceMock: { add: ReturnType<typeof vi.fn> };
  let platformMock: { ANDROID: boolean; IOS: boolean };

  beforeEach(() => {
    messageServiceMock = { add: vi.fn() };
    platformMock = { ANDROID: false, IOS: false };

    TestBed.configureTestingModule({
      providers: [
        CustomToastService,
        { provide: MessageService, useValue: messageServiceMock },
        { provide: Platform, useValue: platformMock },
        { provide: ToastController, useValue: toastControllerMock },
      ],
    });

    service = TestBed.inject(CustomToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('desktop mode', () => {
    beforeEach(() => {
      platformMock.ANDROID = false;
      platformMock.IOS = false;
    });

    it('showSuccess should call MessageService with success severity', () => {
      service.showSuccess('Operacion exitosa', 'Detalle');
      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Operacion exitosa',
        detail: 'Detalle',
        life: 3000,
      });
    });

    it('showError should call MessageService with error severity', () => {
      service.showError('Error', 'Detalle del error');
      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Detalle del error',
        life: 3000,
      });
    });

    it('showInfo should call MessageService with info severity', () => {
      service.showInfo('Info');
      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Info',
        detail: undefined,
        life: 3000,
      });
    });

    it('showWarn should call MessageService with warn severity', () => {
      service.showWarn('Advertencia');
      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'warn',
        summary: 'Advertencia',
        detail: undefined,
        life: 3000,
      });
    });

    it('should use custom life duration when provided', () => {
      service.show({
        severity: 'success',
        summary: 'Test',
        detail: '',
        life: 5000,
      } as any);
      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Test',
        detail: '',
        life: 5000,
      });
    });
  });

  describe('mobile mode', () => {
    beforeEach(() => {
      platformMock.ANDROID = true;
    });

    it('showSuccess should create Ionic toast with success color', async () => {
      await service.showSuccess('Hecho');
      expect(toastControllerMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ color: 'success', position: 'top' }),
      );
    });

    it('showError should create Ionic toast with danger color', async () => {
      await service.showError('Error');
      expect(toastControllerMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ color: 'danger' }),
      );
    });

    it('showWarn should create Ionic toast with warning color', async () => {
      await service.showWarn('Cuidado');
      expect(toastControllerMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ color: 'warning' }),
      );
    });

    it('showInfo should create Ionic toast with primary color', async () => {
      await service.showInfo('Informacion');
      expect(toastControllerMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ color: 'primary' }),
      );
    });
  });
});
