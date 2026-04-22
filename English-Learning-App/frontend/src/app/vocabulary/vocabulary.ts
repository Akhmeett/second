import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VocabularyService } from './vocabulary.service';

@Component({
  selector: 'app-vocabulary',
  imports: [CommonModule, FormsModule],
  templateUrl: './vocabulary.html',
  styleUrl: './vocabulary.css',
})
export class Vocabulary implements OnInit {

  words: any[] = [];
  isModalOpen = false;
  isEditing = false;
  editingId: number | null = null;
  selectedLevel = '';
  searchText = '';
  activeFilter = 'All';
  showSuccess = false;
  showConfirm = false;
  deletingId: number | null = null;

  newWord = {
    english: '',
    kazakh: '',
    example: '',
    level: ''
  };

  constructor(private vocabularyService: VocabularyService) {}

  ngOnInit() {
    this.loadWords();
  }

  loadWords() {
    this.vocabularyService.getWords().subscribe({
      next: (data) => this.words = data,
      error: (err) => console.error(err)
    });
  }

  get filteredWords() {
    return this.words.filter(word => {
      const matchSearch = word.english.toLowerCase()
        .includes(this.searchText.toLowerCase()) ||
        word.kazakh.toLowerCase()
        .includes(this.searchText.toLowerCase());
      const matchFilter =
        this.activeFilter === 'All' ||
        word.status === this.activeFilter ||
        word.level === this.activeFilter;
      return matchSearch && matchFilter;
    });
  }

  get learnedCount() {
    return this.words.filter(w => w.status === 'learned').length;
  }

  get reviewingCount() {
    return this.words.filter(w => w.status === 'reviewing').length;
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  openModal() {
    this.isModalOpen = true;
    this.isEditing = false;
  }

  openEditModal(word: any) {
    this.isModalOpen = true;
    this.isEditing = true;
    this.editingId = word.id;
    this.newWord = {
      english: word.english,
      kazakh: word.kazakh,
      example: word.example,
      level: word.level
    };
    this.selectedLevel = word.level;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditing = false;
    this.editingId = null;
    this.selectedLevel = '';
    this.newWord = { english: '', kazakh: '', example: '', level: '' };
  }

  selectLevel(level: string) {
    this.selectedLevel = level;
    this.newWord.level = level;
  }

  addWord() {
    if (!this.newWord.english || !this.newWord.kazakh || !this.selectedLevel) return;
    this.vocabularyService.addWord(this.newWord).subscribe({
      next: (newWord) => {
        this.words = [...this.words, newWord];
        this.closeModal();
        this.showSuccess = true;
        setTimeout(() => this.showSuccess = false, 3000);
      },
      error: (err) => console.error(err)
    });
  }

  updateWord() {
    if (!this.editingId) return;
    this.vocabularyService.updateWord(this.editingId, this.newWord).subscribe({
      next: () => {
        this.loadWords();
        this.closeModal();
      },
      error: (err) => console.error(err)
    });
  }

  deleteWord(id: number) {
    this.deletingId = id;
    this.showConfirm = true;
  }
  confirmDelete() {
  if (this.deletingId === null) return;

  this.vocabularyService.deleteWord(this.deletingId).subscribe({
    next: () => {
      
      this.words = this.words.filter(w => w.id != this.deletingId);
      
      
      this.showConfirm = false;
      this.deletingId = null;
    },
    error: (err) => {
      console.error('Backend-тен қате келді:', err);
      alert('Сервермен байланыс жоқ немесе ID табылмады');
      this.showConfirm = false;
    }
  });
}
  

  cancelDelete() {
    this.showConfirm = false;
    this.deletingId = null;
  }
}