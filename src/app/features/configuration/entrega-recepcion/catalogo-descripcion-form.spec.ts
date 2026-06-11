import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CatalogoDescripcionForm } from './catalogo-descripcion-form';

describe('CatalogoDescripcionForm', () => {
  let component: CatalogoDescripcionForm;
  let fixture: ComponentFixture<CatalogoDescripcionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoDescripcionForm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogoDescripcionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

