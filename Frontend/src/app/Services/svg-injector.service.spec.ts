import { TestBed } from '@angular/core/testing';

import { SvgInjectorService } from './svg-injector.service';

describe('SvgInjectorService', () => {
  let service: SvgInjectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SvgInjectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
