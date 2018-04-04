import { TestBed, inject } from '@angular/core/testing';

import { HttppService } from './httpp.service';

describe('HttppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttppService]
    });
  });

  it('should be created', inject([HttppService], (service: HttppService) => {
    expect(service).toBeTruthy();
  }));
});
