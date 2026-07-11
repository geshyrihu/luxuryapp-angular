import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { FiestasJudias } from './fiestas-judias';

vi.mock('ng2-pdf-viewer', () => ({ PdfViewerModule: class {} }));

describe('FiestasJudias', () => {
  let component: FiestasJudias;
  let fixture: ComponentFixture<FiestasJudias>;

  beforeEach(() => {
    TestBed.overrideComponent(FiestasJudias, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [FiestasJudias],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(FiestasJudias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
