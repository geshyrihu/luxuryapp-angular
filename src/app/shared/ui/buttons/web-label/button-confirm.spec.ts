import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonLabelConfirm } from './button-confirm';

describe('WebButtonLabelConfirm', () => {
  let component: WebButtonLabelConfirm;
  let fixture: ComponentFixture<WebButtonLabelConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonLabelConfirm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonLabelConfirm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
