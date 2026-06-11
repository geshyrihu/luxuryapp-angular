import { TestBed } from '@angular/core/testing';
import { ImageCompressionService } from './image-compression.service';

describe('ImageCompressionService', () => {
  let service: ImageCompressionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageCompressionService],
    });
    service = TestBed.inject(ImageCompressionService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
