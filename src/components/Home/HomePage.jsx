import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiTrendingUp, FiDollarSign, FiBarChart2, FiUsers, FiClock, FiShield, FiStar } from 'react-icons/fi';
import './homePage.css';

// Counter component para animar números
const Counter = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    let raf;
    const animate = () => {
      start += increment;
      if (start < end) {
        setCount(Math.floor(start));
        raf = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return <span>{prefix}{count}{suffix}</span>;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  // Slides da propaganda
  const slides = [
    {
      title: "Automatize seu Marketing",
      description: "Gerencie suas campanhas de marketing digital de forma inteligente e eficiente",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      color: "#623FFB"
    },
    {
      title: "Controle Financeiro Completo",
      description: "Acompanhe seus gastos e resultados com precisão e facilidade",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80",
      color: "#00BFA5"
    },
    {
      title: "Gestão Empresarial Inteligente",
      description: "Tome decisões baseadas em dados e otimize seus resultados",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      color: "#FF6B6B"
    }
  ];

  // Rotação automática dos slides com pause no hover
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (!isPaused) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  }, [isPaused, slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Intersection Observer para animações de scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section com Slides */}
      <section 
        className="home-hero"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="home-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className="home-slide"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="home-slide-content">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <button 
                  className="home-cta-button"
                  onClick={() => navigate('/marketing/google/preencher-semana')}
                  style={{ backgroundColor: slide.color }}
                >
                  <span>Começar Agora</span> <FiArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="home-slide-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`home-slide-dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Seção de Recursos */}
      <section id="features" className="home-features animate-on-scroll">
        <h2 className="home-section-title">Por que escolher nosso sistema?</h2>
        <div className="home-features-grid">
          <div className="home-feature-card">
            <FiTrendingUp className="home-feature-icon" />
            <h3>Marketing Inteligente</h3>
            <p>Automatize suas campanhas e alcance mais clientes com menos esforço</p>
          </div>
          <div className="home-feature-card">
            <FiDollarSign className="home-feature-icon" />
            <h3>Gestão Financeira</h3>
            <p>Controle completo das suas finanças com relatórios detalhados</p>
          </div>
          <div className="home-feature-card">
            <FiBarChart2 className="home-feature-icon" />
            <h3>Análise de Dados</h3>
            <p>Visualize seus resultados e tome decisões baseadas em dados</p>
          </div>
          <div className="home-feature-card">
            <FiUsers className="home-feature-icon" />
            <h3>Gestão de Equipe</h3>
            <p>Organize sua equipe e otimize a produtividade</p>
          </div>
        </div>
      </section>

      {/* Seção de Benefícios */}
      <section id="benefits" className="home-benefits animate-on-scroll">
        <div className="home-benefits-content">
          <div className="home-benefits-text">
            <h2>Transforme sua Gestão Empresarial</h2>
            <p>Nossa plataforma oferece todas as ferramentas necessárias para impulsionar seu negócio</p>
            <ul className="home-benefits-list">
              <li><FiCheck /> Interface intuitiva e fácil de usar</li>
              <li><FiCheck /> Suporte técnico especializado</li>
              <li><FiCheck /> Atualizações constantes</li>
              <li><FiCheck /> Segurança de dados garantida</li>
            </ul>
            <button 
              className="home-benefits-button"
              onClick={() => navigate('/marketing/google/preencher-semana')}
            >
              <span>Experimente Grátis</span>
            </button>
          </div>
          <div className="home-benefits-image">
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
              alt="Dashboard da plataforma" 
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Seção de Estatísticas */}
      <section id="stats" className="home-stats home-stats-modern animate-on-scroll">
        <div className="home-stat-card-modern">
          <div className="icon-glass pulse"><FiClock className="home-stat-icon-modern" /></div>
          <h3><Counter end={50} suffix="%" /></h3>
          <p>Mais eficiência na gestão</p>
        </div>
        <div className="home-stat-card-modern">
          <div className="icon-glass pulse"><FiTrendingUp className="home-stat-icon-modern" /></div>
          <h3><Counter end={200} prefix="+" suffix="%" /></h3>
          <p>Aumento em vendas</p>
        </div>
        <div className="home-stat-card-modern">
          <div className="icon-glass pulse"><FiUsers className="home-stat-icon-modern" /></div>
          <h3><Counter end={1000} prefix="+" /></h3>
          <p>Empresas atendidas</p>
        </div>
        <div className="home-stat-card-modern">
          <div className="icon-glass pulse"><FiShield className="home-stat-icon-modern" /></div>
          <h3><Counter end={100} suffix="%" /></h3>
          <p>Segurança garantida</p>
        </div>
      </section>

      {/* Call to Action Final */}
      <section id="cta" className="home-cta home-cta-modern animate-on-scroll">
        <div className="cta-content">
          <h2 className="cta-title-gradient">Transforme o futuro da sua empresa hoje</h2>
          <p className="cta-subtitle">Automatize, cresça e lidere o seu mercado com tecnologia de ponta e gestão inteligente.</p>
          <button 
            className="home-cta-button home-cta-glow"
            onClick={() => navigate('/marketing/google/preencher-semana')}
          >
            <span>Comece Agora</span> <FiArrowRight />
          </button>
          <div className="cta-trust-badge">
            <FiStar className="star" />
            <span>Plataforma 5 estrelas por nossos clientes</span>
          </div>
        </div>
        <div className="cta-bg-animated"></div>
      </section>
    </div>
  );
};

export default HomePage; 