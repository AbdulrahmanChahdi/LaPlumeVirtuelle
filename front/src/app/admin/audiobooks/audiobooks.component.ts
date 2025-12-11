import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-audiobooks',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="audiobooks-admin">
      <div class="header">
        <h1>Gestion des Livres Audio</h1>
        <button class="btn-add" routerLink="new">Ajouter un livre audio</button>
      </div>

      <div class="content">
        <p>Cette section est en cours de développement.</p>
      </div>
    </div>
  `,
  styles: [`
    .audiobooks-admin {
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        margin: 0;
        color: #2c3e50;
      }

      .btn-add {
        background: #3498db;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background 0.3s ease;

        &:hover {
          background: #2980b9;
        }
      }
    }
  `]
})
export class AudiobooksComponent { }
