import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, inject, ChangeDetectorRef } from '@angular/core'; // ChangeDetectorRef қосылды
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword implements AfterViewInit, OnDestroy {
  @ViewChild('bgCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  email: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  
  step: number = 1;
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef); // Change Detector-ды инжекциялау

  // --- Анимация логикасы (өзгеріссіз қалады) ---
  private ctx!: CanvasRenderingContext2D;
  private rafId!: number;
  private words: any[] = [];
  private wordList = ['apple','beautiful','curious','dream','elephant','freedom'];

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.words = Array.from({ length: 45 }, () => this.newWord(canvas, true));
    this.loop();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private onResize(): void {
    if (this.canvasRef) {
      const canvas = this.canvasRef.nativeElement;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  private newWord(canvas: HTMLCanvasElement, randomY = false): any {
    const text = this.wordList[Math.floor(Math.random() * this.wordList.length)];
    return {
      text,
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : canvas.height + 30,
      size: Math.random() * 13 + 11,
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

  // --- НЕГІЗГІ ЖІБЕРУ ФУНКЦИЯСЫ (ТҮЗЕТІЛГЕН) ---
  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.step === 1) {
      const url = 'http://127.0.0.1:8000/api/users/forgot-password/';
      this.http.post(url, { email: this.email }).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Код почтаңызға жіберілді!';
          this.step = 2; 
          this.cdr.detectChanges(); // КҮШПЕН ЖАҢАРТУ
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = err.error?.error || 'Қате орын алды';
          this.cdr.detectChanges(); // Қате шықса да жаңарту
        }
      });
    } else {
      const url = 'http://127.0.0.1:8000/api/users/verify-code/';
      const data = {
        email: this.email,
        code: this.verificationCode,
        new_password: this.newPassword
      };

      this.http.post(url, data).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Пароль сәтті өзгертілді!';
          this.cdr.detectChanges(); // КҮШПЕН ЖАҢАРТУ
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = err.error?.error || 'Код қате немесе мерзімі өтіп кеткен';
          this.cdr.detectChanges(); // КҮШПЕН ЖАҢАРТУ
        }
      });
    }
  }
}