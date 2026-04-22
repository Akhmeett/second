import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Profile } from './profile/profile';
import { Quiz } from './quiz/quiz';
import { Vocabulary } from './vocabulary/vocabulary';
import { Layout } from './layout/layout';
import { QuizLevel } from './quiz-level/quiz-level';
import { QuizResult } from './quiz-result/quiz-result';
import { Register } from './register/register';
import { ForgotPassword } from './forgot-password/forgot-password';
export const routes: Routes = [
    {path: '', component: Login},
    {path: 'register', component: Register },          
    {path: 'forgot-password', component: ForgotPassword },

    {path: 'app', component:Layout,
        children: [
            {path:'home', component: Home},
            {path:'profile', component:Profile},
            {path:'quiz', component: Quiz},
            {path:'vocabulary',component:Vocabulary},
            {path:'quiz-level',component:QuizLevel},
            {path:'quiz-result',component:QuizResult}
        ]
    }
];
