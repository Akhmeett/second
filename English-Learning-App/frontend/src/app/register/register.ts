import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

interface Word {
  text: string; x: number; y: number;
  size: number; speed: number; opacity: number; angle: number;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements AfterViewInit, OnDestroy {

  @ViewChild('bgCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  private ctx!: CanvasRenderingContext2D;
  private rafId!: number;
  private words: Word[] = [];
  private wordList = [
    'apple','beautiful','curious','dream','elephant','freedom',
    'grammar','hello','idea','journey','knowledge','language',
    'memory','nature','ocean','practice','quiet','rainbow',
    'A','B','C','D','E','F','G','H','I','J','K','L','M',
    'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
  ];

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize(canvas);
    this.words = Array.from({ length: 45 }, () => this.newWord(canvas, true));
    this.loop();
    window.addEventListener('resize', () => this.resize(canvas));
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  private resize(canvas: HTMLCanvasElement): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private newWord(canvas: HTMLCanvasElement, randomY = false): Word {
    const text = this.wordList[Math.floor(Math.random() * this.wordList.length)];
    const isLetter = text.length === 1;
    return {
      text,
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : canvas.height + 30,
      size: isLetter ? Math.random() * 60 + 36 : Math.random() * 13 + 11,
      speed: Math.random() * 0.5 + 0.25,
      opacity: Math.random() * 0.13 + 0.05,
      angle: (Math.random() - 0.5) * 0.3
    };
  }

  private loop(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < this.words.length; i++) {
      const w = this.words[i];
      this.ctx.save();
      this.ctx.translate(w.x, w.y);
      this.ctx.rotate(w.angle);
      this.ctx.globalAlpha = w.opacity;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = `700 ${w.size}px sans-serif`;
      this.ctx.fillText(w.text, 0, 0);
      this.ctx.restore();
      w.y -= w.speed;
      if (w.y < -80) this.words[i] = this.newWord(canvas, false);
    }
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Парольдер сәйкес емес!';
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    this.http.post('http://127.0.0.1:8000/api/users/register/', {
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Тіркелу сәтті! Кіруге өтіңіз.';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.email?.[0] || err.error?.username?.[0] || 'Тіркелу қатесі. Қайта көріңіз!';
        this.cdr.detectChanges();
      }
    });
  }
}