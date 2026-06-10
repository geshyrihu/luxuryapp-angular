import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { IonButtonViewPdf } from './ion-button-view-pdf';
import { DialogHandlerService } from '../../../services/dialog-handler.service';
import { vi } from 'vitest';

vi.mock('ng2-pdf-viewer', () => ({ PdfViewerModule: class {} }));

vi.mock('@ionic/angular/standalone', async () => {
  const { Component } = await import('@angular/core');

  @Component({ selector: 'ion-item', template: '<ng-content></ng-content>', standalone: true })
  class IonItemMock {}

  @Component({ selector: 'ion-label', template: '<ng-content></ng-content>', standalone: true })
  class IonLabelMock {}

  @Component({ selector: 'ion-icon', template: '', standalone: true })
  class IonIconMock {}

  return { IonItem: IonItemMock, IonLabel: IonLabelMock, IonIcon: IonIconMock };
});

const dialogHandlerServiceMock = {
  openDialog: vi.fn(),
  sizeFull: 'full',
};

describe('IonButtonViewPdf', () => {
  let component: IonButtonViewPdf;
  let fixture: ComponentFixture<IonButtonViewPdf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonButtonViewPdf],
      providers: [
        { provide: DialogHandlerService, useValue: dialogHandlerServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IonButtonViewPdf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have medium color by default', () => {
    expect(component.color()).toBe('medium');
  });

  it('should call dialogHandlerService.openDialog on viewPdf', () => {
    fixture.componentRef.setInput('url', 'http://example.com/file.pdf');
    fixture.componentRef.setInput('fileName', 'test-file');
    fixture.detectChanges();

    component.viewPdf();
    expect(dialogHandlerServiceMock.openDialog).toHaveBeenCalledWith(
      expect.any(Function),
      { pdfSrc: 'http://example.com/file.pdf', fileName: 'test-file' },
      'test-file',
      'full',
      true,
    );
  });

  it('should hide when mostrar() is false', () => {
    fixture.componentRef.setInput('mostrar', false);
    fixture.detectChanges();
    const item = fixture.nativeElement.querySelector('ion-item');
    expect(item).toBeNull();
  });
});
