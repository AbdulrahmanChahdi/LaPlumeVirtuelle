import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>À propos</h3>
          <p>La Plume Virtuelle est votre bibliothèque numérique pour découvrir et profiter de contenus variés.</p>
        </div>
        <div class="footer-section">
          <h3>Contact</h3>
          <p>Email: contact&#64;laplumevirtuelle.com</p>
          <p>Téléphone: +33 1 23 45 67 89</p>
        </div>
        <div class="footer-section">
          <h3>Suivez-nous</h3>
          <div class="social-links">
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} La Plume Virtuelle. Tous droits réservés.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #111827;
      color: white;
      padding: 3rem 0 1rem;
      margin-top: auto;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .footer-section {
      h3 {
        color: white;
        font-size: 1.2rem;
        margin-bottom: 1rem;
        position: relative;

        &:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -0.5rem;
          width: 50px;
          height: 2px;
          background-color: #3B82F6;
        }
      }

      p {
        color: #D1D5DB;
        line-height: 1.6;
        margin-bottom: 0.5rem;
      }

      .social-links {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;

        a {
          color: white;
          font-size: 1.5rem;
          transition: color 0.3s ease;

          &:hover {
            color: #3B82F6;
          }
        }
      }
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      margin-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      p {
        color: #D1D5DB;
        font-size: 0.9rem;
      }
    }

    @media (max-width: 768px) {
      .footer {
        padding: 2rem 0 1rem;
      }

      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .footer-section {
        h3:after {
          left: 50%;
          transform: translateX(-50%);
        }

        .social-links {
          justify-content: center;
        }
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
