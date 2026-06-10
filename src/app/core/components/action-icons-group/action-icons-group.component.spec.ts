import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionIconsGroupComponent } from './action-icons-group.component';

describe('ActionIconsGroupComponent', () => {
  let component: ActionIconsGroupComponent;
  let fixture: ComponentFixture<ActionIconsGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActionIconsGroupComponent],
    });
    fixture = TestBed.createComponent(ActionIconsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
