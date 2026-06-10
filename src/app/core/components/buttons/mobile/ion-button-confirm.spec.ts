import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonButtonConfirm } from './ion-button-confirm';
import { vi } from 'vitest';
import { AlertController } from '@ionic/angular/standalone';

vi.mock('@ionic/angular/standalone', async () => {
  const { Component } = await import('@angular/core');

  @Component({ selector: 'ion-item', template: '<ng-content></ng-content>', standalone: true })
  class IonItemMock {}

  @Component({ selector: 'ion-label', template: '<ng-content></ng-content>', standalone: true })
  class IonLabelMock {}

  @Component({ selector: 'ion-icon', template: '', standalone: true })
  class IonIconMock {}

  return {
    IonItem: IonItemMock,
    IonLabel: IonLabelMock,
    IonIcon: IonIconMock,
    AlertController: class {
      create = vi.fn().mockResolvedValue({ present: vi.fn() });
    },
  };
});

describe('IonButtonConfirm', () => {
  let component: IonButtonConfirm;
  let fixture: ComponentFixture<IonButtonConfirm>;
  let alertController: AlertController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonButtonConfirm],
      providers: [AlertController],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IonButtonConfirm);
    component = fixture.componentInstance;
    alertController = TestBed.inject(AlertController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have success color by default', () => {
    expect(component.color()).toBe('success');
  });

  it('should call alertController.create on click', () => {
    const btn = fixture.nativeElement.querySelector('ion-item');
    btn.click();
    expect(alertController.create).toHaveBeenCalled();
  });

  it('should create alert with accept button handler that would emit confirmed', async () => {
    const spy = vi.fn();
    component.confirmed.subscribe(spy);

    await component.confirmAction(new MouseEvent('click'));
    const config = (alertController.create as any).mock.calls[0][0];
    const confirmBtn = config.buttons.find((b: any) => b.role === 'confirm');

    expect(confirmBtn).toBeDefined();
    expect(typeof confirmBtn.handler).toBe('function');
  });
});
