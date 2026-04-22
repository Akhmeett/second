import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizLevel } from './quiz-level';

describe('QuizLevel', () => {
  let component: QuizLevel;
  let fixture: ComponentFixture<QuizLevel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizLevel],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizLevel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
