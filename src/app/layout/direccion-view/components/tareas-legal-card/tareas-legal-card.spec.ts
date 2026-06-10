import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TareasLegalCard } from './tareas-legal-card';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { vi } from 'vitest';

describe('TareasLegalCard', () => {
  let component: TareasLegalCard;
  let fixture: ComponentFixture<TareasLegalCard>;

  const apiResponseServiceMock = {
    onGetItem: vi.fn().mockResolvedValue(null),
  };

  beforeEach(() => {
    TestBed.overrideComponent(TareasLegalCard, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [TareasLegalCard],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
      ],
    });

    fixture = TestBed.createComponent(TareasLegalCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
