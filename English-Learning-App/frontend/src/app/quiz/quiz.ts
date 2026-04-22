import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Question {
  word: string;
  options: string[];
  correct: string;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit {
  level = 'A1';
  questions: Question[] = [];
  currentIndex = 0;
  correct = 0;
  wrong = 0;
  selected: string | null = null;
  answered = false;
  loading = true;

  // URL для сохранения результатов
  private saveResultUrl = 'http://127.0.0.1:8000/api/quiz/save-result/';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      if (p['level']) this.level = p['level'];
      this.loadWords();
    });
  }

  loadWords() {
    this.loading = true;
    const apiUrl = `http://127.0.0.1:8000/api/quiz/words/?level=${this.level}`;

    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.questions = data.map(item => ({
          word: item.english,
          correct: item.kazakh,
          options: this.generateOptions(item.kazakh, data)
        }));
        this.loading = false;
        this.cdr.detectChanges();  
      },
      error: (err) => {
        console.error('Ошибка загрузки слов:', err);
        this.loading = false;
        this.cdr.detectChanges();  
      }
    });
  }

  generateOptions(correct: string, allData: any[]): string[] {
    let options = [correct];
    let otherWords = allData
      .filter(item => item.kazakh !== correct)
      .map(item => item.kazakh);
    otherWords.sort(() => Math.random() - 0.5);
    options.push(...otherWords.slice(0, 3));
    return options.sort(() => Math.random() - 0.5);
  }

  get current(): Question {
    return this.questions[this.currentIndex] ?? { word: '', options: [], correct: '' };
  }

  get left(): number {
    return this.questions.length - this.currentIndex - 1;
  }

  get progress(): number {
    if (this.questions.length === 0) return 0;
    return ((this.currentIndex + 1) / this.questions.length) * 100;
  }

  selectAnswer(option: string) {
    if (this.answered || !this.current) return;
    this.selected = option;
    this.answered = true;
    if (option === this.current.correct) {
      this.correct++;
    } else {
      this.wrong++;
    }
  }

  next() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.selected = null;
      this.answered = false;
    } else {
      // Сохраняем результаты в БД перед переходом
      this.saveResultsToBackend();
      
      this.router.navigate(['/app/quiz-result'], {
        queryParams: { correct: this.correct, wrong: this.wrong, total: this.questions.length }
      });
    }
  }

  // Метод для отправки данных в Django
  private saveResultsToBackend() {
    const total = this.questions.length;
    const score = this.correct;
    const percentage = total > 0 ? (score / total) * 100 : 0;

    const payload = {
      score: score,
      total_questions: total,
      percentage: Math.round(percentage * 100) / 100 // Округляем до 2 знаков
    };

    this.http.post(this.saveResultUrl, payload).subscribe({
      next: (res) => console.log('Результат успешно сохранен в Django:', res),
      error: (err) => console.error('Ошибка сохранения в Django:', err)
    });
  }

  skip() {
    this.wrong++;
    this.next();
  }

  getClass(option: string): string {
    if (!this.answered) return 'answer-btn';
    if (option === this.current.correct) return 'answer-btn correct';
    if (option === this.selected) return 'answer-btn wrong';
    return 'answer-btn';
  }
}