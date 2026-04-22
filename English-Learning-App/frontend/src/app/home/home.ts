import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  userName = 'Akhmet';

  stats = [
    { label: 'БАРЛЫҚ СӨЗ', value: 248, colorClass: 'stat-default' },
    { label: 'ҮЙРЕНІЛГЕН',  value: 182, colorClass: 'stat-green'   },
    { label: 'QUIZ НӘТИЖЕСІ', value: '86%', colorClass: 'stat-cyan' },
    { label: 'ҚАЙТАЛАЙТЫН', value: 34,  colorClass: 'stat-orange'  }
  ];

  todayWords = [
    { english: 'Perseverance', kazakh: 'Табандылық', level: 'B1' },
    { english: 'Eloquent',     kazakh: 'Шешен',      level: 'B1' },
    { english: 'Ambiguous',    kazakh: 'Екіұшты',    level: 'B1' }
  ];

  quizResults = [
    { title: 'Quiz #1 — A1 деңгейі', score: 9, total: 10, date: '01.04.2026' },
    { title: 'Quiz #2 — A2 деңгейі', score: 7, total: 10, date: '05.04.2026' },
    { title: 'Quiz #3 — B1 деңгейі', score: 8, total: 10, date: '10.04.2026' }
  ];

  getScoreClass(score: number, total: number): string {
    const ratio = score / total;
    if (ratio >= 0.9) return 'score-green';
    if (ratio >= 0.75) return 'score-yellow';
    return 'score-orange';
  }
}