import { Component, Input, HostBinding, OnInit, ViewChild, ElementRef, Injector } from '@angular/core';
import { CommonApp } from 'src/app/core/services/common';

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
  messages: {
    text: string, 
    sender: 'user' | 'bot', 
    timestamp: Date,
    loading?: boolean,  // Add loading state
    error?: boolean     // Add error state
  }[] = [];
  newMessage: string = '';
  isSending = false;

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

  // async sendMessage() {
  //   const message = this.newMessage.trim();
  //   if (!message || this.isSending) return;

  //   // Add user message
  //   this.messages.push({
  //     text: message,
  //     sender: 'user',
  //     timestamp: new Date()
  //   });
    
  //   // Add temporary bot message with loading state
  //   this.messages.push({
  //     text: '',
  //     sender: 'bot',
  //     timestamp: new Date(),
  //     loading: true
  //   });
    
  //   this.newMessage = '';
  //   this.isSending = true;
  //   this.scrollToBottom();

  //   try {
  //     // Call Gemini service
  //     const response = await this.aiServices.sendMessage(message).toPromise();
      
  //     // Replace loading message with actual response
  //     const lastIndex = this.messages.length - 1;
  //     this.messages[lastIndex] = {
  //       text: response?.reply || "I couldn't process that request",
  //       sender: 'bot',
  //       timestamp: new Date()
  //     };
      
  //   } catch (error) {
  //     // Replace with error message
  //     const lastIndex = this.messages.length - 1;
  //     this.messages[lastIndex] = {
  //       text: "I'm having trouble connecting. Please try again later.",
  //       sender: 'bot',
  //       timestamp: new Date(),
  //       error: true
  //     };
  //   } finally {
  //     this.isSending = false;
  //     this.scrollToBottom();
  //   }
  // }

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
    this.aiServices.sendMessage(message).subscribe({
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