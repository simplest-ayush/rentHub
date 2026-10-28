import { TestBed } from '@angular/core/testing';
import { SharedModule } from './shared-module';

describe('SharedModule', () => {
  it('should compile and be importable', () => {
    TestBed.configureTestingModule({ imports: [SharedModule] });
    expect(TestBed.inject(SharedModule)).toBeTruthy();
  });
});