import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonIconConfirm } from './button-confirm';

describe('WebButtonIconConfirm', () => {
  let component: WebButtonIconConfirm;
  let fixture: ComponentFixture<WebButtonIconConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonIconConfirm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonIconConfirm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
