import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrimeNgCustomTableEmptyMessage } from './primeng-custom-table-emptymessage';

describe('PrimeNgCustomTableEmptyMessage', () => {
  let component: PrimeNgCustomTableEmptyMessage;
  let fixture: ComponentFixture<PrimeNgCustomTableEmptyMessage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PrimeNgCustomTableEmptyMessage],
    });
    fixture = TestBed.createComponent(PrimeNgCustomTableEmptyMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-empty-state inside a tr>td', () => {
    const el: HTMLElement = fixture.nativeElement;
    const tr = el.querySelector('tr');
    expect(tr).toBeTruthy();
    const td = tr!.querySelector('td');
    expect(td).toBeTruthy();
    const emptyState = td!.querySelector('app-empty-state');
    expect(emptyState).toBeTruthy();
  });

  it('should use default colspan 4', () => {
    const el: HTMLElement = fixture.nativeElement;
    const td = el.querySelector('td');
    expect(td!.getAttribute('colspan')).toBe('4');
  });

  it('should accept custom colspan', () => {
    fixture.componentRef.setInput('colspan', 7);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const td = el.querySelector('td');
    expect(td!.getAttribute('colspan')).toBe('7');
  });

  it('should show default title and message', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Sin registros');
    expect(el.textContent).toContain('No hay registros que mostrar.');
  });

  it('should accept custom icon/title/message', () => {
    fixture.componentRef.setInput('icon', 'material-symbols-light:account-balance-outline');
    fixture.componentRef.setInput('title', 'Sin bancos');
    fixture.componentRef.setInput('message', 'No hay bancos registrados.');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Sin bancos');
    expect(fixture.nativeElement.textContent).toContain('No hay bancos registrados.');
  });
});
