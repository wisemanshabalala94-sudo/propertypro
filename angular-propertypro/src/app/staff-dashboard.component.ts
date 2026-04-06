import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { SupabaseService, StaffMember, StaffAttendance, StaffLeaveRequest, Task } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';

interface LeaveForm { leaveType: string; startDate: string; endDate: string; reason: string; }

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="dashboard-page">
      @if (loading()) { <div class="loading-container"><div class="spinner"></div><p>Loading dashboard...</p></div> }
      @else if (error()) { <div class="error-banner"><span>{{ error() }}</span><button class="btn btn-sm btn-secondary" (click)="loadData()">Retry</button></div> }
      @else {

      <header class="page-header">
        <div><h1 class="page-title">Staff Dashboard</h1><p class="page-subtitle">{{ staffMember()?.job_title ?? 'Staff Member' }}</p></div>
      </header>

      <!-- Shift Clock -->
      <section class="shift-card">
        <div>
          <div class="shift-status" [class.active]="isClockedIn()"><span class="shift-dot"></span>{{ isClockedIn() ? 'Clocked In' : 'Not Clocked In' }}</div>
          <div class="shift-hours"><span>{{ liveHoursWorked() }}h</span><span class="shift-label">Hours today</span></div>
          @if (shiftStartTime()) { <div class="text-sm text-gray-500">In: {{ shiftStartTime() }}</div> }
        </div>
        <div class="flex gap-2">
          <button class="btn btn-primary btn-lg" (click)="clockIn()" [disabled]="isClockedIn()">Clock In</button>
          <button class="btn btn-secondary btn-lg" (click)="clockOut()" [disabled]="!isClockedIn()">Clock Out</button>
        </div>
      </section>

      <!-- Tabs -->
      <div class="tabs-bar">
        <button class="tab-item" [class.active]="activeTab === 'tasks'" (click)="activeTab = 'tasks'">Tasks</button>
        <button class="tab-item" [class.active]="activeTab === 'attendance'" (click)="activeTab = 'attendance'">Attendance</button>
        <button class="tab-item" [class.active]="activeTab === 'leave'" (click)="activeTab = 'leave'">Leave</button>
        <button class="tab-item" [class.active]="activeTab === 'payslips'" (click)="activeTab = 'payslips'">Payslips</button>
      </div>

      <!-- Tasks -->
      @if (activeTab === 'tasks') {
        <section class="card mb-6">
          <div class="card-header"><h2 class="card-title">Task Queue</h2><span class="badge badge-purple">{{ tasks().length }} logged</span></div>
          <div class="card-body">
            <form [formGroup]="taskForm" (ngSubmit)="addTask()" class="task-form">
              <div class="form-group mb-4"><label class="form-label">Task Description</label><textarea class="form-textarea" formControlName="description" placeholder="Describe work completed..." rows="3"></textarea></div>
              <button type="submit" class="btn btn-primary" [disabled]="taskForm.invalid">Log Task</button>
            </form>
            @if (tasks().length > 0) {
              <table class="data-table mt-6"><thead><tr><th>Task</th><th>Logged At</th></tr></thead>
                <tbody>@for (t of tasks(); track t.loggedAt + t.description) { <tr><td class="font-medium">{{ t.description }}</td><td class="text-gray-500">{{ t.loggedAt }}</td></tr> }</tbody>
              </table>
            } @else { <div class="empty-state py-8"><p class="text-gray-500">No tasks logged yet</p></div> }
            @if (lastShift()) {
              <div class="shift-summary mt-6 p-4 rounded-lg border" [class.border-red-300]="!lastShift()!.isValid" [class.border-purple-300]="lastShift()!.isValid">
                <h3 class="font-semibold mb-2">Last Shift</h3>
                <div class="grid-2 text-sm">
                  <div><span class="text-gray-500">Start:</span> <strong>{{ lastShift()!.start }}</strong></div>
                  <div><span class="text-gray-500">End:</span> <strong>{{ lastShift()!.end }}</strong></div>
                  <div><span class="text-gray-500">Duration:</span> <strong>{{ lastShift()!.hours }}h</strong></div>
                  <div><span class="text-gray-500">Status:</span> @if (lastShift()!.isValid) { <span class="badge badge-success">Valid (≥8h)</span> } @else { <span class="badge badge-error">Flagged (&lt;8h)</span> }</div>
                </div>
              </div>
            }
          </div>
        </section>
      }

      <!-- Attendance -->
      @if (activeTab === 'attendance') {
        <section class="card mb-6">
          <div class="card-header"><h2 class="card-title">Attendance History</h2></div>
          <div class="card-body p-0">
            <table class="data-table"><thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr></thead>
              <tbody>
                @for (a of attendance(); track a.id) {
                  <tr><td class="font-medium">{{ fmtDate(a.attendance_date) }}</td><td>{{ a.check_in_time ? fmtTime(a.check_in_time) : '—' }}</td><td>{{ a.check_out_time ? fmtTime(a.check_out_time) : '—' }}</td><td class="font-semibold">{{ a.hours_worked?.toFixed(1) ?? '—' }}h</td><td><span class="badge badge-{{ a.status === 'present' ? 'success' : a.status === 'late' ? 'warning' : 'error' }}">{{ a.status }}</span></td></tr>
                } @empty { <tr><td colspan="5" class="text-center py-8 text-gray-500">No records</td></tr> }
              </tbody>
            </table>
          </div>
        </section>
      }

      <!-- Leave -->
      @if (activeTab === 'leave') {
        <section class="card mb-6">
          <div class="card-header"><h2 class="card-title">Leave Requests</h2><button class="btn btn-primary btn-sm" (click)="showLeave = true">Request Leave</button></div>
          <div class="card-body p-0">
            <table class="data-table"><thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr></thead>
              <tbody>
                @for (l of leaveRequests(); track l.id) {
                  <tr><td class="font-medium">{{ l.leave_type }}</td><td>{{ fmtDate(l.start_date) }}</td><td>{{ fmtDate(l.end_date) }}</td><td>{{ l.num_days }}</td><td><span class="badge badge-{{ l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'error' : 'warning' }}">{{ l.status }}</span></td></tr>
                } @empty { <tr><td colspan="5" class="text-center py-8 text-gray-500">No requests</td></tr> }
              </tbody>
            </table>
          </div>
        </section>
      }

      <!-- Payslips -->
      @if (activeTab === 'payslips') {
        <section class="card mb-6">
          <div class="card-header"><h2 class="card-title">Payslips</h2></div>
          <div class="card-body">
            <div class="empty-state py-12">
              <svg width="48" height="48" fill="none" stroke="#D1D5DB" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <p class="font-semibold text-gray-700 mt-2">No payslips available</p>
              <p class="text-gray-500">Payslips will appear here once processed.</p>
            </div>
          </div>
        </section>
      }

      }

      <footer class="app-footer"><div class="app-footer__inner"><img src="/wiseworx-logo.svg" alt="WiseWorx logo" class="app-footer__logo" /><p class="app-footer__text">&copy; {{ currentYear }} WiseWorx. PropertyPro&trade; Platform.</p></div></footer>

      <!-- Leave Modal -->
      @if (showLeave) {
        <div class="modal-overlay" (click)="showLeave = false">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header"><h3 class="font-semibold text-lg">Request Leave</h3><button class="modal-close" (click)="showLeave = false">&times;</button></div>
            <div class="modal-body">
              <div class="form-group mb-4"><label class="form-label">Leave Type</label><select class="form-select" [(ngModel)]="leaveForm.leaveType"><option value="annual">Annual</option><option value="sick">Sick</option><option value="personal">Personal</option><option value="parental">Parental</option><option value="other">Other</option></select></div>
              <div class="grid-2 mb-4"><div class="form-group"><label class="form-label">Start</label><input type="date" class="form-input" [(ngModel)]="leaveForm.startDate" /></div><div class="form-group"><label class="form-label">End</label><input type="date" class="form-input" [(ngModel)]="leaveForm.endDate" /></div></div>
              <div class="form-group"><label class="form-label">Reason</label><textarea class="form-textarea" [(ngModel)]="leaveForm.reason"></textarea></div>
            </div>
            <div class="modal-footer"><button class="btn btn-secondary" (click)="showLeave = false">Cancel</button><button class="btn btn-primary" (click)="submitLeave()" [disabled]="!leaveForm.startDate || !leaveForm.endDate">Submit</button></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-page { min-height: 100vh; background: #F9FAFB; }
    .page-header { padding: 2rem 2rem 1rem; max-width: 1280px; margin: 0 auto; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1F2937; margin: 0; }
    .page-subtitle { font-size: 0.875rem; color: #6B7280; margin: 0.25rem 0 0; }
    .shift-card { max-width: 1280px; margin: 0 auto 1.5rem; padding: 0 2rem; background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%); border-radius: 1rem; display: flex; align-items: center; justify-content: space-between; padding: 2rem; color: white; box-shadow: 0 8px 24px rgba(124,58,237,0.2); }
    .shift-status { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; opacity: 0.8; }
    .shift-status.active { opacity: 1; color: #D1FAE5; }
    .shift-dot { width: 0.5rem; height: 0.5rem; border-radius: 50%; background: currentColor; }
    .shift-hours { display: flex; align-items: baseline; gap: 0.5rem; } .shift-hours span:first-child { font-size: 2rem; font-weight: 800; } .shift-label { font-size: 0.875rem; opacity: 0.7; }
    .tabs-bar { display: flex; border-bottom: 1px solid #E5E7EB; background: white; padding: 0 2rem; max-width: 1280px; margin: 0 auto; }
    .tab-item { padding: 0.875rem 1.25rem; font-size: 0.875rem; font-weight: 500; color: #6B7280; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; }
    .tab-item:hover { color: #1F2937; } .tab-item.active { color: #7C3AED; border-bottom-color: #7C3AED; }
    .mb-6 { margin-bottom: 1.5rem; } .mb-4 { margin-bottom: 1rem; } .mt-6 { margin-top: 1.5rem; } .mt-3 { margin-top: 0.75rem; } .mt-2 { margin-top: 0.5rem; } .p-0 { padding: 0; } .p-4 { padding: 1rem; } .py-8 { padding: 2rem 0; } .py-12 { padding: 3rem 0; } .text-center { text-align: center; } .text-gray-500 { color: #6B7280; } .text-gray-700 { color: #374151; } .text-sm { font-size: 0.75rem; } .text-lg { font-size: 1.125rem; } .font-medium { font-weight: 500; } .font-semibold { font-weight: 600; } .rounded-lg { border-radius: 0.5rem; } .border { border: 1px solid; } .border-red-300 { border-color: #FCA5A5; } .border-purple-300 { border-color: #C4B5FD; } .flex { display: flex; } .items-center { align-items: center; } .gap-2 { gap: 0.5rem; } .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; } .empty-state { text-align: center; } .task-form { display: flex; flex-direction: column; gap: 1rem; } .shift-summary { background: #F9FAFB; }
    .app-footer { padding: 1.5rem 2rem 2rem; } .app-footer__inner { max-width: 1280px; margin: 0 auto; padding: 1.25rem; border-radius: 0.75rem; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.04); border: 1px solid #E5E7EB; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; } .app-footer__logo { height: 2rem; width: auto; } .app-footer__text { margin: 0; color: #6B7280; font-size: 0.8rem; }
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; color: #6B7280; gap: 1rem; }
    .error-banner { margin: 2rem; padding: 1rem 1.5rem; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 0.5rem; display: flex; align-items: center; justify-content: space-between; color: #991B1B; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
    .modal { background: white; border-radius: 0.75rem; box-shadow: 0 25px 50px rgba(0,0,0,0.15); width: 100%; max-width: 28rem; }
    .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; justify-content: space-between; }
    .modal-body { padding: 1.5rem; } .modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #E5E7EB; display: flex; justify-content: flex-end; gap: 0.75rem; }
    .modal-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6B7280; }
    @media (max-width: 768px) { .shift-card { flex-direction: column; gap: 1.5rem; text-align: center; } .grid-2 { grid-template-columns: 1fr; } }
  `]
})
export class StaffDashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);

  protected readonly taskForm = this.fb.nonNullable.group({ description: ['', [Validators.required, Validators.minLength(5)]] });
  protected readonly isClockedIn = signal(false);
  protected readonly shiftStartTime = signal<string | null>(null);
  protected readonly shiftStartDate = signal<Date | null>(null);
  protected readonly tasks = signal<readonly { description: string; loggedAt: string }[]>([]);
  protected readonly lastShift = signal<{ start: string; end: string; hours: number; isValid: boolean } | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly staffMember = signal<StaffMember | null>(null);
  protected readonly attendance = signal<StaffAttendance[]>([]);
  protected readonly leaveRequests = signal<StaffLeaveRequest[]>([]);
  protected activeTab = 'tasks';
  protected showLeave = false;
  protected leaveForm: LeaveForm = { leaveType: 'annual', startDate: '', endDate: '', reason: '' };
  protected readonly currentYear = new Date().getFullYear();

  protected readonly liveHoursWorked = computed(() => {
    const s = this.shiftStartDate();
    if (!s) return '0.00';
    return ((Date.now() - s.getTime()) / 3600000).toFixed(2);
  });

  ngOnInit(): void { void this.loadData(); }

  async loadData(): Promise<void> {
    this.loading.set(true); this.error.set(null);
    try {
      const user = this.auth.getCurrentUser();
      if (!user) { this.error.set('Not authenticated'); return; }
      const token = user.auth?.accessToken;
      const [staff, att, leaves] = await Promise.all([
        this.supabase.getStaffMemberById(user.id, token).catch(() => null),
        this.supabase.getStaffAttendance(user.id, token).catch(() => []),
        this.supabase.getStaffLeaveRequests(user.id, token).catch(() => [])
      ]);
      this.staffMember.set(staff); this.attendance.set(att); this.leaveRequests.set(leaves);
      const saved = localStorage.getItem('propertypro.shift');
      if (saved) try { this.lastShift.set(JSON.parse(saved)); } catch { /* ignore */ }
    } catch (e) { this.error.set(e instanceof Error ? e.message : 'Failed'); }
    finally { this.loading.set(false); }
  }

  protected clockIn(): void {
    if (this.isClockedIn()) return;
    const now = new Date();
    this.shiftStartDate.set(now); this.shiftStartTime.set(this.fmtDT(now)); this.isClockedIn.set(true); this.tasks.set([]);
  }

  protected clockOut(): void {
    const sd = this.shiftStartDate(); const st = this.shiftStartTime();
    if (!this.isClockedIn() || !sd || !st) return;
    const end = new Date(); const hrs = +(((end.getTime() - sd.getTime()) / 3600000).toFixed(2));
    const summary = { start: st, end: this.fmtDT(end), hours: hrs, isValid: hrs >= 8 };
    localStorage.setItem('propertypro.shift', JSON.stringify(summary));
    this.lastShift.set(summary); this.isClockedIn.set(false); this.shiftStartDate.set(null); this.shiftStartTime.set(null);

    const user = this.auth.getCurrentUser();
    if (user?.auth?.accessToken) {
      void this.supabase.recordAttendance({ organization_id: this.staffMember()?.organization_id ?? '', staff_member_id: this.staffMember()?.id ?? '', attendance_date: sd.toISOString().split('T')[0], check_in_time: sd.toISOString(), check_out_time: end.toISOString(), hours_worked: hrs, status: hrs >= 8 ? 'present' : 'late', notes: null }, user.auth.accessToken).catch(() => {});
    }
  }

  protected addTask(): void {
    this.taskForm.controls.description.markAsTouched();
    if (this.taskForm.invalid) return;
    const d = this.taskForm.controls.description.value.trim();
    if (!d) return;
    this.tasks.update(e => [...e, { description: d, loggedAt: this.fmtDT(new Date()) }]);
    this.taskForm.reset({ description: '' });
  }

  protected async submitLeave(): Promise<void> {
    const user = this.auth.getCurrentUser();
    if (!user || !this.leaveForm.startDate || !this.leaveForm.endDate) return;
    const s = new Date(this.leaveForm.startDate); const e = new Date(this.leaveForm.endDate);
    const days = Math.ceil((e.getTime() - s.getTime()) / 86400000) + 1;
    try {
      await this.supabase.createLeaveRequest({ organization_id: this.staffMember()?.organization_id ?? '', staff_member_id: this.staffMember()?.id ?? '', leave_type: this.leaveForm.leaveType, start_date: this.leaveForm.startDate, end_date: this.leaveForm.endDate, num_days: days, reason: this.leaveForm.reason || null, status: 'pending', approved_by: null, approved_at: null }, user.auth?.accessToken);
      this.showLeave = false; this.leaveForm = { leaveType: 'annual', startDate: '', endDate: '', reason: '' };
      await this.loadData();
    } catch { /* silent */ }
  }

  private fmtDT(d: Date): string { return new Intl.DateTimeFormat('en-ZA', { dateStyle: 'medium', timeStyle: 'short' }).format(d); }
  private fmtDate(d: string): string { return new Date(d).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' }); }
  private fmtTime(d: string): string { return new Date(d).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }); }
}
