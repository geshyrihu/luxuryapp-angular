import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileActionMenu } from './action-menu-mobile';

describe('MobileActionMenu', () => {
  let component: MobileActionMenu;
  let fixture: ComponentFixture<MobileActionMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileActionMenu],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileActionMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
