import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alimentacion } from './alimentacion';

describe('Alimentacion', () => {
  let component: Alimentacion;
  let fixture: ComponentFixture<Alimentacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alimentacion],
    }).compileComponents();

    fixture = TestBed.createComponent(Alimentacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
