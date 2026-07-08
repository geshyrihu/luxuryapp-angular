import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebInputToggleSwitch } from './input-toggle-switch';

describe('WebInputToggleSwitch', () => {
  let component: WebInputToggleSwitch;
  let fixture: ComponentFixture<WebInputToggleSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInputToggleSwitch],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebInputToggleSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
