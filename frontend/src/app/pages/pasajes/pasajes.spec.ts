import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pasajes } from './pasajes';

describe('Pasajes', () => {
  let component: Pasajes;
  let fixture: ComponentFixture<Pasajes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pasajes],
    }).compileComponents();

    fixture = TestBed.createComponent(Pasajes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
