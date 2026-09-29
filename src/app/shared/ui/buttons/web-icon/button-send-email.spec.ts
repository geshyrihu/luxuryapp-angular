import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import Swal from 'sweetalert2';
import { WebButtonIconSendEmail } from './button-send-email';

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn() },
}));

describe('WebButtonIconSendEmail', () => {
  let component: WebButtonIconSendEmail;
  let fixture: ComponentFixture<WebButtonIconSendEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonIconSendEmail],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonIconSendEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not emit when confirmation is cancelled', async () => {
    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: false } as never);
    const confirmed = vi.fn();
    component.confirmed.subscribe(confirmed);

    fixture.nativeElement.querySelector('button').click();
    await Promise.resolve();

    expect(confirmed).not.toHaveBeenCalled();
  });

  it('emits after confirmation', async () => {
    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: true } as never);
    const confirmed = vi.fn();
    component.confirmed.subscribe(confirmed);

    fixture.nativeElement.querySelector('button').click();
    await Promise.resolve();

    expect(confirmed).toHaveBeenCalledOnce();
  });
});
