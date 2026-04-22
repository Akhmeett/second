import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quiz-result',
  imports: [CommonModule],
  templateUrl: './quiz-result.html',
  styleUrl: './quiz-result.css',
})
export class QuizResult implements OnInit {

  correct = 0;
  wrong = 0;
  total = 10;
  level = 'A1';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      this.correct = +p['correct'] || 0;
      this.wrong   = +p['wrong']   || 0;
      this.total   = +p['total']   || 10;
      this.level   = p['level']    || 'A1';
    });
  }

  get percent(): number {
    return Math.round((this.correct / this.total) * 100);
  }

  get emoji(): string {
    if (this.percent >= 80) return '🏆';
    if (this.percent >= 50) return '';
    return '';
  }

  get message(): string {
    if (this.percent >= 80) return 'Nice!';
    if (this.percent >= 50) return 'Not bad!';
    return 'Badly!';
  }

  retry() {
    this.router.navigate(['/app/quiz-level']);
  }

  home() {
    this.router.navigate(['/app/home']);
  }
}