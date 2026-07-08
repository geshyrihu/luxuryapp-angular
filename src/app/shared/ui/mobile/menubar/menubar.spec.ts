import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MobileMenubar } from './menubar';

describe('MobileMenubar', () => {
  let component: MobileMenubar;
  let fixture: ComponentFixture<MobileMenubar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileMenubar, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileMenubar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
