import { Injectable, signal, computed } from '@angular/core';

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actionButtons?: AiAction[];
}

export interface AiAction {
  label: string;
  action: string;
  data?: Record<string, unknown>;
}

export interface AiConversation {
  id: string;
  userId: string;
  organizationId: string;
  messages: AiMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AiSuggestedQuestion {
  question: string;
  category: 'navigation' | 'data' | 'action' | 'insight';
}

export interface AiDocumentTemplate {
  type: 'lease' | 'rent_notice' | 'maintenance_schedule' | 'privacy_policy' | 'proof_of_address' | 'income_verification';
  data: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class QwenAiService {
  private readonly conversations = signal<Map<string, AiConversation>>(new Map());
  private readonly activeConversationId = signal<string | null>(null);
  private readonly isLoading = signal(false);
  private readonly error = signal<string | null>(null);
  private readonly queriesUsed = signal(0);
  private readonly monthlyLimit = signal(100);

  readonly activeConversation = computed(() => {
    const id = this.activeConversationId();
    if (!id) return null;
    return this.conversations().get(id) ?? null;
  });

  readonly remainingQueries = computed(() => this.monthlyLimit() - this.queriesUsed());
  readonly canQuery = computed(() => this.remainingQueries() > 0 && !this.isLoading());

  private getSystemPrompt(role: string, currentPage: string): string {
    return `You are PropertyPro AI, an expert property management assistant for WiseWorx.
User role: ${role}
Current page: ${currentPage}

Rules:
1. Be concise and professional
2. Always provide actionable advice
3. For South African legal questions, add a disclaimer
4. For document generation, provide structured content
5. Never share sensitive information`;
  }

  private getSuggestedQuestionSet(role: string): AiSuggestedQuestion[] {
    const base: Record<string, AiSuggestedQuestion[]> = {
      owner: [
        { question: 'How do I approve a tenant?', category: 'action' },
        { question: "What's my occupancy rate?", category: 'data' },
        { question: 'Generate a rent increase notice', category: 'action' },
        { question: 'Where do I view reports?', category: 'navigation' },
        { question: 'How do I create an invoice?', category: 'navigation' },
        { question: 'Show cash flow forecast', category: 'insight' }
      ],
      tenant: [
        { question: 'How do I pay my rent?', category: 'navigation' },
        { question: 'Submit maintenance request', category: 'navigation' },
        { question: 'When is my next payment due?', category: 'data' },
        { question: 'Generate proof of address', category: 'action' },
        { question: 'What are my lease terms?', category: 'data' },
        { question: 'Contact property manager', category: 'navigation' }
      ],
      staff: [
        { question: 'How do I clock in?', category: 'navigation' },
        { question: 'What tasks are assigned to me?', category: 'data' },
        { question: 'How do I request leave?', category: 'navigation' },
        { question: 'Where is my payslip?', category: 'data' },
        { question: 'Complete maintenance job', category: 'navigation' }
      ],
      admin: [
        { question: 'How do I add a user?', category: 'navigation' },
        { question: 'Show platform revenue', category: 'data' },
        { question: 'How do I reconcile payments?', category: 'navigation' },
        { question: 'Generate compliance report', category: 'action' },
        { question: 'What are the RLS policies?', category: 'insight' }
      ]
    };
    return base[role] ?? base.tenant;
  }

  getSuggestedQuestions(role: string): AiSuggestedQuestion[] {
    return this.getSuggestedQuestionSet(role);
  }

  private generateId(): string { return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }

  private detectAction(content: string): AiAction[] | undefined {
    const actions: AiAction[] = [];
    const lower = content.toLowerCase();
    if (lower.includes('create invoice')) actions.push({ label: '📄 Create Invoice', action: 'create_invoice' });
    if (lower.includes('approve') && lower.includes('tenant')) actions.push({ label: '✅ Approve Tenant', action: 'approve_tenant' });
    if (lower.includes('generate report')) actions.push({ label: '📊 Generate Report', action: 'generate_report' });
    if (lower.includes('pay') && lower.includes('rent')) actions.push({ label: '💳 Pay Rent', action: 'pay_rent' });
    if (lower.includes('maintenance')) actions.push({ label: '🔧 Maintenance', action: 'maintenance' });
    return actions.length > 0 ? actions : undefined;
  }

  private async callQwenApi(messages: { role: string; content: string }[]): Promise<string> {
    try {
      const response = await fetch('/api/qwen/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Qwen proxy error: ${response.status} ${errorText}`);
      }

      const data = await response.json() as { content?: string };
      return data.content ?? 'I could not process your request. Please try again.';
    } catch (err) {
      const lastMsg = messages[messages.length - 1]?.content.toLowerCase() ?? '';
      if (lastMsg.includes('pay') || lastMsg.includes('rent')) {
        return 'To pay your rent, go to your Dashboard > Payments tab and click "Pay Now". You can pay via Paystack using card or bank transfer. Would you like me to take you there?';
      }
      if (lastMsg.includes('maintenance') || lastMsg.includes('repair')) {
        return 'To submit a maintenance request, go to your Dashboard > Maintenance tab and click "New Request". Select the category, priority, and describe the issue. You can also attach photos.';
      }
      if (lastMsg.includes('invoice') || lastMsg.includes('bill')) {
        return 'To create an invoice, go to your Dashboard > Financials > Create Invoice. Enter the tenant, amount, due date, and invoice type. The system will automatically generate a payment reference.';
      }
      if (lastMsg.includes('report') || lastMsg.includes('analytics')) {
        return 'To view reports, go to your Dashboard > Reports. Available reports include: Financial Summary, Occupancy Analysis, Maintenance Overview, and Tenant Payment History. Would you like me to generate a specific report?';
      }
      if (lastMsg.includes('approve') || lastMsg.includes('tenant')) {
        return 'To approve a tenant application, go to Admin Dashboard > Applications. Review the applicant\'s documents, credit score, and references. Click "Approve" to accept or "Reject" with a reason.';
      }
      if (lastMsg.includes('occupancy') || lastMsg.includes('vacancy')) {
        return 'Your current occupancy rate is calculated from active leases divided by total units. Check your Owner Dashboard for real-time occupancy metrics and trends.';
      }
      return 'I understand your question. As PropertyPro AI, I can help you navigate the platform, generate documents, and provide insights about your property data. Could you provide more details about what you need?';
    }
  }

  generateDocument(template: AiDocumentTemplate): string {
    const { type, data } = template;
    const date = new Date().toLocaleDateString('en-ZA');
    switch (type) {
      case 'lease':
        return `LEASE AGREEMENT\n\nDate: ${date}\nProperty: ${data.property ?? 'N/A'}\nUnit: ${data.unit ?? 'N/A'}\nTenant: ${data.tenant ?? 'N/A'}\nMonthly Rent: R${data.rent ?? '0'}\nDeposit: R${data.deposit ?? '0'}\n\nTerms: 12 months, 30 days notice required.\n\nThis agreement is governed by the Rental Housing Act of South Africa.\n\nPropertyPro by WiseWorx`;
      case 'proof_of_address':
        return `PROOF OF ADDRESS\n\nDate: ${date}\n\nThis confirms ${data.tenant ?? 'the tenant'} resides at:\n${data.address ?? 'N/A'}, ${data.city ?? ''}\n\nResident since: ${data.moveInDate ?? 'N/A'}\n\nPropertyPro by WiseWorx`;
      case 'privacy_policy':
        return `PRIVACY POLICY - PROPERTYPRO\n\nEffective: ${date}\n\nWe collect information for property management: name, ID, contact details, employment and income info, bank details.\n\nWe comply with POPIA. Your data is encrypted and stored securely.\n\nContact: privacy@wiseworx.co.za\n\nPropertyPro by WiseWorx`;
      default:
        return `Generated document: ${type} on ${date}`;
    }
  }

  createConversation(userId: string, organizationId: string): string {
    const id = this.generateId();
    const conversation: AiConversation = {
      id, userId, organizationId,
      messages: [{ id: this.generateId(), role: 'system', content: 'I\'m PropertyPro AI. How can I help you today?', timestamp: new Date() }],
      createdAt: new Date(), updatedAt: new Date()
    };
    const current = this.conversations();
    current.set(id, conversation);
    this.conversations.set(new Map(current));
    this.activeConversationId.set(id);
    return id;
  }

  getOrCreateConversation(userId: string, organizationId: string): string {
    for (const [id, conv] of this.conversations()) {
      if (conv.userId === userId && conv.organizationId === organizationId) {
        this.activeConversationId.set(id);
        return id;
      }
    }
    return this.createConversation(userId, organizationId);
  }

  switchConversation(id: string): void {
    if (this.conversations().has(id)) this.activeConversationId.set(id);
  }

  async sendMessage(content: string, userRole: string, currentPage: string): Promise<AiMessage | null> {
    if (!this.canQuery()) { this.error.set('Monthly query limit reached.'); return null; }
    this.isLoading.set(true); this.error.set(null);

    try {
      const convId = this.activeConversationId();
      if (!convId) return null;
      const conv = this.conversations().get(convId);
      if (!conv) return null;

      const userMessage: AiMessage = { id: this.generateId(), role: 'user', content, timestamp: new Date() };
      conv.messages.push(userMessage);

      const apiMessages = [
        { role: 'system', content: this.getSystemPrompt(userRole, currentPage) },
        ...conv.messages.map(m => ({ role: m.role, content: m.content }))
      ];

      const responseContent = await this.callQwenApi(apiMessages);
      const actionButtons = this.detectAction(responseContent);
      const assistantMessage: AiMessage = { id: this.generateId(), role: 'assistant', content: responseContent, timestamp: new Date(), actionButtons };

      conv.messages.push(assistantMessage);
      conv.updatedAt = new Date();
      this.queriesUsed.update(n => n + 1);

      const updated = this.conversations();
      updated.set(convId, { ...conv });
      this.conversations.set(new Map(updated));
      return assistantMessage;
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed');
      return null;
    } finally { this.isLoading.set(false); }
  }

  getSuggestedQuestions(role: string): AiSuggestedQuestion[] { return this.getSuggestedQuestions(role); }
  clearConversation(id: string): void {
    const c = this.conversations(); c.delete(id);
    this.conversations.set(new Map(c));
    if (this.activeConversationId() === id) this.activeConversationId.set(null);
  }
  clearAllConversations(): void { this.conversations.set(new Map()); this.activeConversationId.set(null); }
  resetQueries(): void { this.queriesUsed.set(0); }
}
