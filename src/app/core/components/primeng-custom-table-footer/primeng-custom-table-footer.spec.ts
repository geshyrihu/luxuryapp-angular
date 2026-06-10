import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrimeNgCustomTableFooter } from './primeng-custom-table-footer';

describe('PrimeNgCustomTableFooter', () => {
  let component: PrimeNgCustomTableFooter;
  let fixture: ComponentFixture<PrimeNgCustomTableFooter>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PrimeNgCustomTableFooter],
    });
    fixture = TestBed.createComponent(PrimeNgCustomTableFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "0 registros" when data is empty', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('0 registros');
  });

  it('should display count when data is provided', () => {
    fixture.componentRef.setInput('data', [{ id: 1 }, { id: 2 }, { id: 3 }]);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('3 registros');
  });

  it('should display 0 when data is null', () => {
    fixture.componentRef.setInput('data', null);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('0 registros');
  });

  it('should display count for single item', () => {
    fixture.componentRef.setInput('data', [{ id: 1 }]);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('1 registros');
  });
});
