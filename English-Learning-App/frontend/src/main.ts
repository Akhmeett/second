import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app'; // Импортируем класс App из файла app.ts
import { appConfig } from './app/app.config'; // Импортируем конфиг из app.config.ts

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));