import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentPreviewer } from './document-previewer';

describe('DocumentPreviewer', () => {
  let component: DocumentPreviewer;
  let fixture: ComponentFixture<DocumentPreviewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentPreviewer],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentPreviewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
