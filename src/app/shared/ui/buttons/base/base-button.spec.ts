import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BaseButton } from './base-button';

describe('BaseButton', () => {
  let component: BaseButton;
  let fixture: ComponentFixture<BaseButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseButton],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
