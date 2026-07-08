import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebInputPassword } from './input-password';

describe('WebInputPassword', () => {
  let component: WebInputPassword;
  let fixture: ComponentFixture<WebInputPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInputPassword],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebInputPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
