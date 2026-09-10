import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { FiestasCristianas } from './fiestas-cristianas';

vi.mock('ng2-pdf-viewer', () => ({ PdfViewerModule: class {} }));

describe('FiestasCristianas', () => {
  let component: FiestasCristianas;
  let fixture: ComponentFixture<FiestasCristianas>;

  beforeEach(() => {
    TestBed.overrideComponent(FiestasCristianas, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [FiestasCristianas],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(FiestasCristianas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
