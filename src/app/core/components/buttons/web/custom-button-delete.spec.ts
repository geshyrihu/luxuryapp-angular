import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomButtonDelete } from './custom-button-delete';
import { vi } from 'vitest';
import Swal from 'sweetalert2';

// Mock de Swal
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe('CustomButtonDelete', () => {
  let component: CustomButtonDelete;
  let fixture: ComponentFixture<CustomButtonDelete>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomButtonDelete],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomButtonDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have danger severity and rounded true by default', () => {
    expect(component.severity()).toBe('danger');
    expect(component.rounded()).toBe(true);
  });

  it('should default finalIcon to mdi:delete', () => {
    expect(component.finalIcon()).toBe('mdi:delete');
  });

  it('should show confirmation dialog on click', async () => {
    (Swal.fire as any).mockResolvedValue({ isConfirmed: false });
    
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('should emit confirmed when accept is clicked in dialog', async () => {
    const spy = vi.fn();
    component.confirmed.subscribe(spy);
    (Swal.fire as any).mockResolvedValue({ isConfirmed: true });

    await component.confirmDelete(new MouseEvent('click'));
    
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit confirmed when cancel is clicked in dialog', async () => {
    const spy = vi.fn();
    component.confirmed.subscribe(spy);
    (Swal.fire as any).mockResolvedValue({ isConfirmed: false });

    await component.confirmDelete(new MouseEvent('click'));
    
    expect(spy).not.toHaveBeenCalled();
  });

  it('should use confirmLinkedMessage when isLinked is true', async () => {
    fixture.componentRef.setInput('isLinked', true);
    fixture.detectChanges();
    (Swal.fire as any).mockResolvedValue({ isConfirmed: false });

    await component.confirmDelete(new MouseEvent('click'));
    
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      text: component.confirmLinkedMessage()
    }));
  });
});
