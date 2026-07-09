import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonLabelDelete } from './button-delete';
import { ConfirmService } from '../shared/confirm.service';

describe('MobileButtonLabelDelete', () => {
  let component: MobileButtonLabelDelete;
  let fixture: ComponentFixture<MobileButtonLabelDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonLabelDelete],
      providers: [
        { provide: ConfirmService, useValue: { confirm: () => Promise.resolve(true) } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonLabelDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
