import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModuleAppRolUpdate } from './module-app-rol-update';

describe('ModuleAppRolUpdate', () => {
  let component: ModuleAppRolUpdate;
  let fixture: ComponentFixture<ModuleAppRolUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleAppRolUpdate],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModuleAppRolUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

