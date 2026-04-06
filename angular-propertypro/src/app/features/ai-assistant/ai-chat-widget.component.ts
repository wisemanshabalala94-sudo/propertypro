import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QwenAiService, AiMessage } from '../../core/services/qwen-ai.service';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ai-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <button class="ai-fab" [class.ai-fab--active]="isOpen()" (click)="toggleChat()">
      @if (!isOpen()) { <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> }
      @else { <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
    </button>

    @if (isOpen()) {
      <div class="ai-chat">
        <div class="ai-chat__header">
          <div><div class="ai-chat__title">PropertyPro AI</div><div class="ai-chat__sub">{{ remainingQueries() }} queries left</div></div>
          <button class="ai-chat__close" (click)="clearChat()" title="New chat">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
          </button>
        </div>

        <div class="ai-chat__messages" #messagesContainer>
          @if (messages().length <= 1) {
            <div class="ai-chat__welcome">
              <p class="ai-chat__welcome-title">How can I help you?</p>
              <p class="ai-chat__welcome-text">Ask about navigation, documents, data insights, or take actions.</p>
            </div>
          }
          @for (msg of messages(); track msg.id) {
            <div class="ai-chat__msg" [class.ai-chat__msg--user]="msg.role === 'user'">
              <div class="ai-chat__msg-avatar">{{ msg.role === 'user' ? 'Y' : 'AI' }}</div>
              <div class="ai-chat__msg-bubble">
                <p>{{ msg.content }}</p>
                @if (msg.actionButtons) {
                  <div class="ai-chat__actions">
                    @for (a of msg.actionButtons; track a.label + a.action) {
                      <button class="ai-chat__action-btn" (click)="handleAction(a)">{{ a.label }}</button>
                    }
                  </div>
                }
                <span class="ai-chat__time">{{ msg.timestamp | date:'HH:mm' }}</span>
              </div>
            </div>
          }
          @if (isLoading()) {
            <div class="ai-chat__msg">
              <div class="ai-chat__msg-avatar">AI</div>
              <div class="ai-chat__msg-bubble ai-chat__msg-bubble--typing"><div class="ai-chat__typing"><span></span><span></span><span></span></div></div>
            </div>
          }
        </div>

        @if (messages().length <= 1 && suggested().length > 0) {
          <div class="ai-chat__suggestions">
            @for (q of suggested(); track q.question) {
              <button class="ai-chat__chip" (click)="ask(q.question)">{{ q.question }}</button>
            }
          </div>
        }

        @if (error()) { <div class="ai-chat__error">{{ error() }}</div> }

        <div class="ai-chat__input">
          <textarea class="ai-chat__textarea" [(ngModel)]="inputText" (keydown.enter)="onEnter($event)" placeholder="Ask PropertyPro AI..." [disabled]="isLoading() || !canQuery()" rows="1"></textarea>
          <button class="ai-chat__send" (click)="send()" [disabled]="!inputText.trim() || isLoading() || !canQuery()">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .ai-fab { position: fixed; bottom: 1.5rem; right: 1.5rem; width: 3.5rem; height: 3.5rem; border-radius: 50%; background: linear-gradient(135deg, #7C3AED, #6D28D9); color: white; border: none; box-shadow: 0 4px 12px rgba(124,58,237,0.3); cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 1000; transition: all 0.3s ease; }
    .ai-fab:hover { transform: scale(1.1); } .ai-fab--active { background: #4B5563; }
    .ai-chat { position: fixed; bottom: 6rem; right: 1.5rem; width: 360px; max-width: calc(100vw - 2rem); height: 500px; max-height: calc(100vh - 8rem); background: white; border-radius: 1rem; box-shadow: 0 20px 60px rgba(0,0,0,0.15); border: 1px solid #E5E7EB; display: flex; flex-direction: column; z-index: 999; overflow: hidden; }
    .ai-chat__header { padding: 1rem 1.25rem; background: linear-gradient(135deg, #7C3AED, #6D28D9); color: white; display: flex; justify-content: space-between; align-items: center; }
    .ai-chat__title { font-weight: 600; font-size: 0.95rem; } .ai-chat__sub { font-size: 0.7rem; opacity: 0.8; }
    .ai-chat__close { background: rgba(255,255,255,0.2); border: none; color: white; width: 2rem; height: 2rem; border-radius: 0.375rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .ai-chat__messages { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .ai-chat__welcome { text-align: center; padding: 1.5rem 1rem; color: #6B7280; }
    .ai-chat__welcome-title { font-weight: 600; color: #374151; margin-bottom: 0.5rem; }
    .ai-chat__welcome-text { font-size: 0.8rem; line-height: 1.5; }
    .ai-chat__msg { display: flex; gap: 0.5rem; align-items: flex-start; }
    .ai-chat__msg--user { flex-direction: row-reverse; }
    .ai-chat__msg-avatar { width: 1.75rem; height: 1.75rem; border-radius: 50%; background: #F3F4F6; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.65rem; font-weight: 700; color: #6B7280; }
    .ai-chat__msg--user .ai-chat__msg-avatar { background: #7C3AED; color: white; }
    .ai-chat__msg-bubble { background: #F3F4F6; border-radius: 0.75rem; padding: 0.625rem 0.875rem; max-width: 80%; font-size: 0.8rem; line-height: 1.5; color: #374151; }
    .ai-chat__msg--user .ai-chat__msg-bubble { background: #7C3AED; color: white; }
    .ai-chat__msg-bubble--typing { min-width: 3.5rem; }
    .ai-chat__typing { display: flex; gap: 0.2rem; padding: 0.25rem 0; }
    .ai-chat__typing span { width: 0.4rem; height: 0.4rem; background: #9CA3AF; border-radius: 50%; animation: typing 1.4s infinite; }
    .ai-chat__typing span:nth-child(2) { animation-delay: 0.2s; } .ai-chat__typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }
    .ai-chat__actions { display: flex; flex-wrap: wrap; gap: 0.25rem; margin-top: 0.375rem; }
    .ai-chat__action-btn { background: rgba(124,58,237,0.1); color: #7C3AED; border: 1px solid rgba(124,58,237,0.2); border-radius: 0.25rem; padding: 0.2rem 0.5rem; font-size: 0.7rem; cursor: pointer; }
    .ai-chat__action-btn:hover { background: rgba(124,58,237,0.2); }
    .ai-chat__time { font-size: 0.6rem; color: #9CA3AF; display: block; margin-top: 0.2rem; }
    .ai-chat__msg--user .ai-chat__time { color: rgba(255,255,255,0.6); }
    .ai-chat__suggestions { padding: 0.5rem 1rem; display: flex; flex-wrap: wrap; gap: 0.25rem; border-top: 1px solid #F3F4F6; }
    .ai-chat__chip { background: #F5F3FF; color: #7C3AED; border: 1px solid #EDE9FE; border-radius: 9999px; padding: 0.3rem 0.625rem; font-size: 0.7rem; cursor: pointer; }
    .ai-chat__chip:hover { background: #EDE9FE; }
    .ai-chat__error { margin: 0.5rem 1rem; padding: 0.5rem; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 0.375rem; color: #991B1B; font-size: 0.75rem; }
    .ai-chat__input { padding: 0.75rem 1rem; border-top: 1px solid #F3F4F6; display: flex; gap: 0.5rem; align-items: flex-end; }
    .ai-chat__textarea { flex: 1; border: 1px solid #D1D5DB; border-radius: 0.75rem; padding: 0.5rem 0.75rem; font-size: 0.8rem; resize: none; font-family: inherit; line-height: 1.4; }
    .ai-chat__textarea:focus { outline: none; border-color: #7C3AED; }
    .ai-chat__textarea:disabled { background: #F9FAFB; cursor: not-allowed; }
    .ai-chat__send { width: 2.25rem; height: 2.25rem; border-radius: 50%; background: #7C3AED; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ai-chat__send:hover { background: #6D28D9; } .ai-chat__send:disabled { background: #D1D5DB; cursor: not-allowed; }
    @media (max-width: 480px) { .ai-chat { bottom: 5rem; right: 0.5rem; left: 0.5rem; width: auto; height: calc(100vh - 7rem); } }
  `]
})
export class AiChatWidgetComponent implements OnInit, OnDestroy {
  private ai = inject(QwenAiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  protected isOpen = signal(false);
  protected inputText = signal('');
  isLoading = this.ai.isLoading;
  error = this.ai.error;
  remainingQueries = this.ai.remainingQueries;
  canQuery = this.ai.canQuery;
  messages = computed(() => this.ai.activeConversation()?.messages ?? []);
  suggested = computed(() => this.ai.getSuggestedQuestions(this.auth.getCurrentUser()?.role ?? 'tenant'));

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (user) this.ai.getOrCreateConversation(user.id, user.organizationId ?? '');
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  toggleChat(): void { this.isOpen.update(v => !v); }
  clearChat(): void {
    const user = this.auth.getCurrentUser();
    if (user) { this.ai.clearAllConversations(); this.ai.getOrCreateConversation(user.id, user.organizationId ?? ''); }
  }

  onEnter(event: Event): void {
    if (!(event as KeyboardEvent).shiftKey) { event.preventDefault(); void this.send(); }
  }

  async send(): Promise<void> {
    const content = this.inputText().trim();
    if (!content) return;
    const user = this.auth.getCurrentUser();
    if (!user) return;
    this.inputText.set('');
    await this.ai.sendMessage(content, user.role, window.location.pathname);
  }

  ask(question: string): void { this.inputText.set(question); void this.send(); }

  handleAction(action: { label: string; action: string }): void {
    const routeMap: Record<string, string> = {
      create_invoice: '/owner/dashboard',
      approve_tenant: '/admin/dashboard',
      generate_report: '/admin/dashboard',
      pay_rent: '/tenant/dashboard',
      maintenance: '/tenant/dashboard'
    };

    const destination = routeMap[action.action];
    if (destination) {
      void this.router.navigate([destination]);
    }
  }
}
