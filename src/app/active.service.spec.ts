import { TestBed } from '@angular/core/testing';

import { ActiveService } from './active.service';

describe('ActiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActiveService = TestBed.get(ActiveService);
    expect(service).toBeTruthy();
  });
});
