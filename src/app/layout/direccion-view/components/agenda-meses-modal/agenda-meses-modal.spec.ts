import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AgendaMesesModal } from './agenda-meses-modal';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { vi } from 'vitest';

describe('AgendaMesesModal', () => {
  let component: AgendaMesesModal;
  let fixture: ComponentFixture<AgendaMesesModal>;

  const apiResponseServiceMock = {
    onGetItem: vi.fn().mockResolvedValue([]),
  };

  const dynamicDialogRefMock = {
    close: vi.fn(),
  };

  beforeEach(() => {
    TestBed.overrideComponent(AgendaMesesModal, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [AgendaMesesModal],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
        { provide: DynamicDialogRef, useValue: dynamicDialogRefMock },
      ],
    });

    fixture = TestBed.createComponent(AgendaMesesModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
