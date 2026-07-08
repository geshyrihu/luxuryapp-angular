import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MobileSidebar } from './sidebar';

describe('MobileSidebar', () => {
  let component: MobileSidebar;
  let fixture: ComponentFixture<MobileSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileSidebar, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
