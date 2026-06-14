import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { Fondeos } from './fondeos';

vi.mock('ng2-pdf-viewer', () => ({ PdfViewerModule: class {} }));

describe('Fondeos', () => {
  let component: Fondeos;
  let fixture: ComponentFixture<Fondeos>;

  beforeEach(() => {
    TestBed.overrideComponent(Fondeos, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [Fondeos],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(Fondeos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('descargarPDF should call window.open with pdf url', () => {
    const spy = vi.spyOn(window, 'open').mockImplementation(() => null);
    component.descargarPDF();
    expect(spy).toHaveBeenCalledWith('assets/documents/FONDEOS2023.pdf', '_blank');
    spy.mockRestore();
  });
});
