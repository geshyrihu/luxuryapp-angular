import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BitacoraFiltroFechaForm } from './bitacora-filtro-fecha-form';

describe('BitacoraFiltroFechaForm', () => {
  let component: BitacoraFiltroFechaForm;
  let fixture: ComponentFixture<BitacoraFiltroFechaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BitacoraFiltroFechaForm],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BitacoraFiltroFechaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
