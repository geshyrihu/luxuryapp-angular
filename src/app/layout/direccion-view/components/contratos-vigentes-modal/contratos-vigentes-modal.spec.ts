import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ContratosVigentesModal } from './contratos-vigentes-modal';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { vi } from 'vitest';

describe('ContratosVigentesModal', () => {
  let component: ContratosVigentesModal;
  let fixture: ComponentFixture<ContratosVigentesModal>;

  const apiResponseServiceMock = {
    onGetItem: vi.fn().mockResolvedValue(null),
  };

  beforeEach(() => {
    TestBed.overrideComponent(ContratosVigentesModal, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [ContratosVigentesModal],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
      ],
    });

    fixture = TestBed.createComponent(ContratosVigentesModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
