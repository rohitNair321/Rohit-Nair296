import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  projects =  [
    {
      title: "E-Commerce Dashboard",
      description: "A comprehensive admin dashboard for an e-commerce platform built with Angular. Features include data visualization, product management, order tracking, and user management.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      technologies: ["Angular", "TypeScript", "RxJS", "NgRx", "Chart.js", "Angular Material"],
      liveDemo: "https://example.com",
      sourceCode: "https://github.com",
      featured: true
    },
    {
      title: "Task Management Application",
      description: "A Kanban-style task management application that helps teams track project progress. Includes features like drag-and-drop task management, user assignments, and deadline tracking.",
      image: "https://images.unsplash.com/photo-1611224885990-ab7363d7f2a1?q=80&w=2039&auto=format&fit=crop&ixlib=rb-4.0.3",
      technologies: ["Angular", "TypeScript", "Firebase", "Angular CDK", "SCSS"],
      liveDemo: "https://example.com",
      sourceCode: "https://github.com",
      featured: true
    },
    {
      title: "Weather Forecast App",
      description: "A responsive weather application that provides current weather information and 5-day forecasts for any location. Utilizes geolocation and weather APIs for accurate data.",
      image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      technologies: ["Angular", "TypeScript", "RxJS", "OpenWeatherMap API", "Progressive Web App"],
      liveDemo: "https://example.com",
      sourceCode: "https://github.com",
      featured: false
    },
    {
      title: "Personal Blog Platform",
      description: "A full-stack blog platform built with Angular frontend and Node.js backend. Features include article publishing, commenting system, and user authentication.",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      technologies: ["Angular", "Node.js", "Express", "MongoDB", "JWT Authentication"],
      liveDemo: "https://example.com",
      sourceCode: "https://github.com",
      featured: true
    },
    {
      title: "Fitness Tracking Application",
      description: "A fitness application that allows users to track workouts, set goals, and monitor progress. Includes features like workout timers, progress charts, and personalized recommendations.",
      image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      technologies: ["Angular", "TypeScript", "NgRx", "Firebase", "Chart.js"],
      liveDemo: "https://example.com",
      sourceCode: "https://github.com",
      featured: false
    },
    {
      title: "Real-Time Chat Application",
      description: "A real-time messaging application with features like group chats, direct messaging, and file sharing. Uses WebSockets for instant message delivery.",
      image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3",
      technologies: ["Angular", "Socket.io", "Node.js", "Express", "MongoDB"],
      liveDemo: "https://example.com",
      sourceCode: "https://github.com",
      featured: false
    }
  ]; // your projects array
  cardWidth = 320; // px, match your CSS .portfolio-card max-width
  cardGap = 32;    // px, match your CSS .portfolio-slider-inner gap (2rem = 32px)
  projectsPerView = 3; // or calculate based on screen size

  currentProjectIndex = 0;
  hoveredProject: any = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const animatedEls = this.el.nativeElement.querySelectorAll(
      '.animate-fade-in-left, .animate-fade-in-right, .animate-fade-in-up'
    );
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    animatedEls.forEach((el: Element) => observer.observe(el));
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  get visibleProjects() {
    return this.projects.slice(this.currentProjectIndex, this.currentProjectIndex + this.projectsPerView);
  }

  slideLeft() {
    if (this.currentProjectIndex > 0) {
      this.currentProjectIndex--;
    }
  }
  slideRight() {
    if (this.currentProjectIndex + this.projectsPerView < this.projects.length) {
      this.currentProjectIndex++;
    }
  }
}
