import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomButtonConfirm } from './custom-button-confirm';
import { vi } from 'vitest';
import Swal from 'sweetalert2';

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe('CustomButtonConfirm', () => {
  let component: CustomButtonConfirm;
  let fixture: ComponentFixture<CustomButtonConfirm>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomButtonConfirm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomButtonConfirm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have success severity and check icon by default', () => {
    expect(component.severity()).toBe('success');
    expect(component.finalIcon()).toBe('check');
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
    await component.confirmAction(new MouseEvent('click'));
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit confirmed when cancel is clicked', async () => {
    const spy = vi.fn();
    component.confirmed.subscribe(spy);
    (Swal.fire as any).mockResolvedValue({ isConfirmed: false });
    await component.confirmAction(new MouseEvent('click'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('should use custom Swal text when provided', async () => {
    fixture.componentRef.setInput('swalText', 'Custom confirmation text');
    fixture.detectChanges();
    (Swal.fire as any).mockResolvedValue({ isConfirmed: false });
    await component.confirmAction(new MouseEvent('click'));
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      text: 'Custom confirmation text',
    }));
  });
});
