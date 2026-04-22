import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-level',
  imports: [],
  templateUrl: './quiz-level.html',
  styleUrl: './quiz-level.css',
})
export class QuizLevel {

  constructor(private router: Router) {}

  selectLevel(level: string) {
    this.router.navigate(['/app/quiz'], { queryParams: { level } });
  }
}