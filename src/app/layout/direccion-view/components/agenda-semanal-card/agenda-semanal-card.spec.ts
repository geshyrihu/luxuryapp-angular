import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AgendaSemanalCard } from './agenda-semanal-card';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { vi } from 'vitest';

describe('AgendaSemanalCard', () => {
  let component: AgendaSemanalCard;
  let fixture: ComponentFixture<AgendaSemanalCard>;

  const apiResponseServiceMock = {
    onGetItem: vi.fn().mockResolvedValue([]),
  };

  const dialogHandlerServiceMock = {
    openDialog: vi.fn(),
  };

  beforeEach(() => {
    TestBed.overrideComponent(AgendaSemanalCard, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [AgendaSemanalCard],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
        { provide: DialogHandlerService, useValue: dialogHandlerServiceMock },
      ],
    });

    fixture = TestBed.createComponent(AgendaSemanalCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
