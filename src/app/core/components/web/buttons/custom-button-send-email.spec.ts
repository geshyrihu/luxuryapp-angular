import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomButtonSendEmail } from './custom-button-send-email';
import { vi } from 'vitest';
import Swal from 'sweetalert2';

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe('CustomButtonSendEmail', () => {
  let component: CustomButtonSendEmail;
  let fixture: ComponentFixture<CustomButtonSendEmail>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomButtonSendEmail],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomButtonSendEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have rounded true by default', () => {
    expect(component.rounded()).toBe(true);
  });

  it('should default finalIcon to mdi:email-outline', () => {
    expect(component.finalIcon()).toBe('mdi:email-outline');
  });

  it('should show confirmation dialog on click', async () => {
    (Swal.fire as any).mockResolvedValue({ isConfirmed: false });
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('should emit confirmed when accept is clicked', async () => {
    const spy = vi.fn();
    component.confirmed.subscribe(spy);
    (Swal.fire as any).mockResolvedValue({ isConfirmed: true });
    await component.confirmSend(new MouseEvent('click'));
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit confirmed when cancel is clicked', async () => {
    const spy = vi.fn();
    component.confirmed.subscribe(spy);
    (Swal.fire as any).mockResolvedValue({ isConfirmed: false });
    await component.confirmSend(new MouseEvent('click'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('should use custom confirm message when provided', async () => {
    fixture.componentRef.setInput('confirmMessage', 'Custom message');
    fixture.detectChanges();
    (Swal.fire as any).mockResolvedValue({ isConfirmed: false });
    await component.confirmSend(new MouseEvent('click'));
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      text: 'Custom message',
    }));
  });
});
