import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileContextMenu } from './context-menu';

describe('MobileContextMenu', () => {
  let component: MobileContextMenu;
  let fixture: ComponentFixture<MobileContextMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileContextMenu],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileContextMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
