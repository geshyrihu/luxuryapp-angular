import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BankForm } from './bank-form';

describe('BankForm', () => {
  let component: BankForm;
  let fixture: ComponentFixture<BankForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankForm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { data: {}, params: {}, queryParams: {} }, params: of({}), queryParams: of({}) } },
        { provide: 'HttpClientWithoutInterceptors', useValue: (globalThis as any).__mockHttpClient },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BankForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form group', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('code')).toBeDefined();
    expect(component.form.get('shortName')).toBeDefined();
    expect(component.form.get('largeName')).toBeDefined();
  });

  it('should have submitting signal initialized as false', () => {
    expect(component.submitting()).toBe(false);
  });

  it('should have form with required validators on code', () => {
    const control = component.form.get('code');
    expect(control?.hasError('required')).toBe(true);
  });

  it('should have form with maxLength validator on code', () => {
    const control = component.form.get('code');
    control?.setValue('TOOLONG');
    expect(control?.hasError('maxlength')).toBe(true);
  });

  it('should have form with required validators on shortName', () => {
    const control = component.form.get('shortName');
    expect(control?.hasError('required')).toBe(true);
  });

  it('should have form with minLength validator on shortName', () => {
    const control = component.form.get('shortName');
    control?.setValue('BOA');
    expect(control?.hasError('minlength')).toBe(true);
  });

  it('should have form with required validators on largeName', () => {
    const control = component.form.get('largeName');
    expect(control?.hasError('required')).toBe(true);
  });

  it('should form be invalid when empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should form be valid when all fields filled correctly', () => {
    component.form.patchValue({
      code: 'BOA',
      shortName: 'Bank of America',
      largeName: 'The Bank of America Corporation'
    });
    expect(component.form.valid).toBe(true);
  });

  it('should have id property initialized as empty string', () => {
    expect(component.id).toBe('');
  });
});
