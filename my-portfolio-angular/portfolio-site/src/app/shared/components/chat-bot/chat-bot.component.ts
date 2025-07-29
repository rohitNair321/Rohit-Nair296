import { Component, Input, HostBinding, OnInit, ViewChild, ElementRef, Injector } from '@angular/core';
import { CommonApp } from 'src/app/core/services/common';
import { AiRequest } from 'src/app/core/services/open-ai.service';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent extends CommonApp implements OnInit {
  @Input() position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' = 'bottom-right';
  @Input() primaryColor = '#3f51b5';
  @Input() title = 'How can I help you?';
  @Input() placeholder = 'Type your message...';
  
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  isOpen = false;
  showWelcomeBubble = true;
  messages: {
    text: string, 
    sender: 'user' | 'bot', 
    timestamp: Date,
    loading?: boolean,  // Add loading state
    error?: boolean     // Add error state
  }[] = [];
  newMessage: string = '';
  isSending = false;
  
  versionList: any[] = [
    {
      name: 'v1.5-beta',
      model: 'v1.5b'
    },
    {
      name: 'v1.5-stb',
      model: 'v1.5s'
    },
    {
      name: 'v2.5-stb',
      model: 'v2.5s'
    }
  ];
  selectedVersion: string = this.versionList[0].model;
  currentReq: AiRequest = {
    message: '',
    modelVersion: this.selectedVersion
  };

  @HostBinding('style') get hostStyles() {
    return {
      'position': 'fixed',
      [this.position.split('-')[0]]: '20px',
      [this.position.split('-')[1]]: '20px'
    };
  }

  constructor(public override injector: Injector) {
    super(injector);
  } // Inject service

  ngOnInit() {
    this.setThemeColors();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.showWelcomeBubble = !this.showWelcomeBubble;
    if (this.isOpen && this.messages.length === 0) {
      this.addWelcomeMessage();
    }
    setTimeout(() => this.scrollToBottom(), 100);
  }

  addWelcomeMessage() {
    this.messages.push({
      text: "Hello! I'm AiNg, Rohit's portfolio assistant. Ask me about Rohit's professional journey.",
      sender: 'bot',
      timestamp: new Date()
    });
  }


  onVersionChange(event: Event): void {
    this.selectedVersion = (event.target as HTMLSelectElement).value;
  }

 sendMessage() {
    const message = this.newMessage.trim();
    if (!message || this.isSending) {
      return;
    }

    // 1) Push the user's message
    this.messages.push({
      text: message,
      sender: 'user',
      timestamp: new Date()
    });

    // 2) Push a placeholder for the bot's reply
    this.messages.push({
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      loading: true
    });

    // 3) Reset input & state, scroll down
    this.newMessage = '';
    this.isSending = true;
    this.scrollToBottom();

    // 4) Call the backend via ChatService
    this.currentReq.message = message;
    this.currentReq.modelVersion = this.selectedVersion;
    this.aiServices.sendMessage(this.currentReq).subscribe({
      next: (resp) => {
        // Replace the loading placeholder with actual text
        const idx = this.messages.length - 1;
        this.messages[idx] = {
          text: resp.answer || "Sorry, I couldn't answer that.",
          sender: 'bot',
          timestamp: new Date()
        };
      },
      error: (err) => {
        const idx = this.messages.length - 1;
        this.messages[idx] = {
          text: "Something went wrong. Please try again later.",
          sender: 'bot',
          timestamp: new Date(),
          error: true
        };
        console.error('Chat Error:', err);
      },
      complete: () => {
        this.isSending = false;
        this.scrollToBottom();
      }
    });
  }


  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      } catch(err) { }
    }, 100);
  }

  private setThemeColors(): void {
    document.documentElement.style.setProperty('--primary-color', this.primaryColor);
    
    // Set complementary text color
    const rgb = parseInt(this.primaryColor.substring(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    
    document.documentElement.style.setProperty(
      '--text-on-primary', 
      luminance < 120 ? '#ffffff' : '#000000'
    );
  }
}