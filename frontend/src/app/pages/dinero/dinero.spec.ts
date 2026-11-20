import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dinero } from './dinero';

describe('Dinero', () => {
  let component: Dinero;
  let fixture: ComponentFixture<Dinero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dinero],
    }).compileComponents();

    fixture = TestBed.createComponent(Dinero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
