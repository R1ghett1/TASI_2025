import React from 'react';
// Importe ícones se estiver usando Font Awesome.
// Ex: import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Ex: import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-app-footer" id="contact">
      <div className="footer-content-wrapper">
        <div className="footer-section-group about-section">
          <h3 className="footer-brand-logo">R1ghett1</h3>
          <p>Eleve seu desempenho. Encontre os melhores produtos para seu treino e viva seu máximo potencial.</p>
          <div className="footer-social-links">
            {/* Usando imagens para simplificar, mas Font Awesome ou SVGs seriam melhores */}
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/ios-filled/25/ffffff/facebook-new.png" alt="Facebook" />
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/ios-filled/25/ffffff/instagram-new--v1.png" alt="Instagram" />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/ios-filled/25/ffffff/twitterx.png" alt="Twitter" />
            </a>
          </div>
        </div>

        <div className="footer-section-group quick-links">
          <h4>Links Rápidos</h4>
          <ul>
            <li><a href="/">Início</a></li>
            <li><a href="/produtos">Produtos</a></li>
            <li><a href="#destaques">Destaques</a></li>
            <li><a href="#about">Sobre Nós</a></li>
    
          </ul>
        </div>

        <div className="footer-section-group contact-info">
          <h4>Fale Conosco</h4>
          <p><i className="fas fa-map-marker-alt"></i> Marcondes Salgado, 1771 - Bauru, São Paulo</p>
          <p><i className="fas fa-envelope"></i> contato@r1ghett1.com</p>
          <p><i className="fas fa-phone"></i> (14) 99195-5393</p>
        </div>
      </div>

      <div className="footer-copyright-bar">
        <p>&copy; Righetti {currentYear} — Todos os direitos reservados.</p>
        <p>
          <a href="/politica-de-privacidade">Política de Privacidade</a> |{' '}
          <a href="/termos-de-servico">Termos de Serviço</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;