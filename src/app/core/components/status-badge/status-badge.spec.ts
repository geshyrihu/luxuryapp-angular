import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadge, EStatus } from './status-badge';

describe('StatusBadge', () => {
  let component: StatusBadge;
  let fixture: ComponentFixture<StatusBadge>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatusBadge],
    });
    fixture = TestBed.createComponent(StatusBadge);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('status', EStatus.Pendiente);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return Pendiente status text for EStatus.Pendiente', () => {
    fixture.componentRef.setInput('status', EStatus.Pendiente);
    fixture.detectChanges();
    expect(component.getStatusText()).toBe('PENDIENTE');
  });

  it('should return Concluido status text for EStatus.Concluido', () => {
    fixture.componentRef.setInput('status', EStatus.Concluido);
    fixture.detectChanges();
    expect(component.getStatusText()).toBe('CONCLUIDO');
  });

  it('should return danger badge class for Pendiente status', () => {
    fixture.componentRef.setInput('status', EStatus.Pendiente);
    fixture.detectChanges();
    expect(component.getBadgeClass()).toBe('badge badge-danger');
  });

  it('should return success badge class for Concluido status', () => {
    fixture.componentRef.setInput('status', EStatus.Concluido);
    fixture.detectChanges();
    expect(component.getBadgeClass()).toBe('badge badge-success');
  });

  it('should return neutral badge class for unknown status', () => {
    fixture.componentRef.setInput('status', 999);
    fixture.detectChanges();
    expect(component.getBadgeClass()).toBe('badge badge-neutral');
    expect(component.getStatusText()).toBe('DESCONOCIDO');
  });

  it('should emit statusClick when clickable', () => {
    fixture.componentRef.setInput('status', EStatus.Pendiente);
    fixture.componentRef.setInput('itemId', 'guid-123');
    fixture.componentRef.setInput('clickable', true);
    fixture.detectChanges();

    const spy = vi.fn();
    component.statusClick.subscribe(spy);
    component.onStatusClick();

    expect(spy).toHaveBeenCalledWith({ id: 'guid-123', status: EStatus.Pendiente });
  });

  it('should not emit statusClick when clickable is false', () => {
    fixture.componentRef.setInput('status', EStatus.Pendiente);
    fixture.componentRef.setInput('clickable', false);
    fixture.detectChanges();

    const spy = vi.fn();
    component.statusClick.subscribe(spy);
    component.onStatusClick();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should handle visibility config correctly', () => {
    fixture.componentRef.setInput('status', 'interno');
    fixture.componentRef.setInput('isVisibility', true);
    fixture.detectChanges();

    expect(component.getBadgeClass()).toBe('badge badge-secondary');
    expect(component.getStatusText()).toBe('INTERNO');
  });

  it('should handle empresa config correctly', () => {
    fixture.componentRef.setInput('status', 0);
    fixture.componentRef.setInput('isEmpresa', true);
    fixture.detectChanges();

    expect(component.getBadgeClass()).toBe('badge badge-primary');
    expect(component.getStatusText()).toBe('COBRANZA');
  });

  it('should have default tooltip text', () => {
    expect(component.tooltip()).toBe('Actualizar estatus');
  });
});
