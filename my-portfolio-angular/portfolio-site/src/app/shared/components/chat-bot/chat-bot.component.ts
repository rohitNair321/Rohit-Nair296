import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent {
  @Input() position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' = 'bottom-right';
  @Input() primaryColor = '#3f51b5';
  @Input() title = 'How can I help you?';
  @Input() placeholder = 'Type your message...';
  
  isOpen = false;
  messages: {text: string, sender: 'user' | 'bot', timestamp: Date}[] = [];
  newMessage: string = '';

  @HostBinding('style') get hostStyles() {
    return {
      'position': 'fixed',
      [this.position.split('-')[0]]: '20px',
      [this.position.split('-')[1]]: '20px'
    };
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.addWelcomeMessage();
    }
  }

  addWelcomeMessage() {
    this.messages.push({
      text: "Hello! I'm your portfolio assistant. Ask me anything!",
      sender: 'bot',
      timestamp: new Date()
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      // Add user message
      this.messages.push({
        text: this.newMessage,
        sender: 'user',
        timestamp: new Date()
      });
      
      // Temporary mock response
      this.mockBotResponse();
      
      this.newMessage = '';
    }
  }

  private mockBotResponse() {
    setTimeout(() => {
      this.messages.push({
        text: "Thanks for your message! This is a demo response.",
        sender: 'bot',
        timestamp: new Date()
      });
    }, 1000);
  }
}