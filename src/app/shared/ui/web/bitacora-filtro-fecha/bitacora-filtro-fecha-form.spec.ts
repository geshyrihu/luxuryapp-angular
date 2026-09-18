import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from '@core/services/dialog-handler.service';
import { BitacoraFiltroFechaForm } from './bitacora-filtro-fecha-form';

describe('BitacoraFiltroFechaForm', () => {
  let component: BitacoraFiltroFechaForm;
  let fixture: ComponentFixture<BitacoraFiltroFechaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BitacoraFiltroFechaForm],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: { getInstance: vi.fn() } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
      ],
    });
    TestBed.overrideComponent(BitacoraFiltroFechaForm, { set: { template: '<div></div>', imports: [] } });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(BitacoraFiltroFechaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
