import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Mesanio } from './mesanio';
import { FiltroCalendarService } from '../../services/filtro-calendar.service';
import { vi } from 'vitest';

const filtroCalendarMock = {
  fechaInicial: new Date(2024, 5, 15),
};

describe('Mesanio', () => {
  let component: Mesanio;
  let fixture: ComponentFixture<Mesanio>;

  beforeEach(() => {
    TestBed.overrideComponent(Mesanio, {
      set: {
        template: '<div>Mock Mesanio</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [Mesanio],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FiltroCalendarService, useValue: filtroCalendarMock },
      ],
    });
    fixture = TestBed.createComponent(Mesanio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize periodo from service fechaInicial', () => {
    expect(component.periodo).toBe('2024-06');
  });

  it('should parse date to YYYY-MM format', () => {
    const result = component.onParseToInputMonth(new Date(2023, 0, 1));
    expect(result).toBe('2023-01');
  });

  it('should emit periodo on change', () => {
    const spy = vi.fn();
    component.periodoEmit.subscribe(spy);
    component.periodo = '2024-07';
    component.onChangePeriodo();
    expect(spy).toHaveBeenCalledWith('2024-07');
  });
});
