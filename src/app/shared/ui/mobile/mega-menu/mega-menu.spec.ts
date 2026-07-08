import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MobileMegaMenu } from './mega-menu';

describe('MobileMegaMenu', () => {
  let component: MobileMegaMenu;
  let fixture: ComponentFixture<MobileMegaMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileMegaMenu, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileMegaMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
