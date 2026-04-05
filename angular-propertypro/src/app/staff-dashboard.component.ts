import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { SupabaseService, StaffMember, StaffAttendance, StaffLeaveRequest } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';

interface LeaveFormData {
  leaveType: 'annual' | 'sick' | 'personal' | 'parental' | 'bereavement' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
}

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="dashboard-page">

      @if (loading()) {
        <div class="loading-container"><div class="spinner"></div><p>Loading your dashboard...</p></div>
      } @else if (error()) {
        <div class="error-banner"><span>{{ error() }}</span><button class="btn btn-sm btn-secondary" (click)="loadData()">Retry</button></div>
      } @else {

      <!-- Header -->
      <header class="page-header">
        <div>
          <h1 class="page-title">Staff Dashboard</h1>
          <p class="page-subtitle">Welcome, {{ staffMember()?.job_title ?? 'Staff Member' }}</p>
        </div>
      </header>

      <!-- Shift Clock -->
      <section class="shift-clock-card">
        <div class="shift-clock-card__left">
          <div class="shift-clock-card__status" [class.active]="isClockedIn()">
            <span class="shift-clock-card__dot"></span>
            <span>{{ isClockedIn() ? 'Currently Clocked In' : 'Not Clocked In' }}</span>
          </div>
          <div class="shift-clock-card__time">
            <span class="shift-clock-card__hours">{{ liveHoursWorked() }}h</span>
            <span class="shift-clock-card__label">Hours worked today</span>
          </div>
          @if (shiftStartTime()) {
            <div class="text-sm text-gray-500">Clocked in at {{ shiftStartTime() }}</div>
          }
        </div>
        <div class="shift-clock-card__right">
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

      <!-- Tasks Tab -->
      @if (activeTab === 'tasks') {
        <section class="card mb-6">
          <div class="card-header">
            <h2 class="card-title">Current Tasks</h2>
            <span class="badge badge-purple">{{ tasks().length }} logged</span>
          </div>
          <div class="card-body">
            <form [formGroup]="taskForm" (ngSubmit)="addTask()" class="task-form">
              <div class="form-group mb-4">
                <label class="form-label">Task Description</label>
                <textarea class="form-textarea" formControlName="description" placeholder="Describe work completed..." rows="3"></textarea>
              </div>
              <button type="submit" class="btn btn-primary" [disabled]="taskForm.invalid">Log Task</button>
            </form>

            @if (tasks().length > 0) {
              <table class="data-table mt-6">
                <thead><tr><th>Task</th><th>Logged At</th></tr></thead>
                <tbody>
                  @for (task of tasks(); track task.loggedAt + task.description) {
                    <tr>
                      <td class="font-medium">{{ task.description }}</td>
                      <td class="text-gray-500">{{ task.loggedAt }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            } @else {
              <div class="empty-state py-8"><p class="text-gray-500">No tasks logged yet</p></div>
            }

            @if (lastShift()) {
              <div class="shift-summary mt-6 p-4 rounded-lg border" [class.border-red-300]="!lastShift()!.isValidShift" [class.border-green-300]="lastShift()!.isValidShift">
                <h3 class="font-semibold mb-2">Last Shift Summary</h3>
                <div class="grid-2 text-sm">
                  <div><span class="text-gray-500">Start:</span> <strong>{{ lastShift()!.startTime }}</strong></div>
                  <div><span class="text-gray-500">End:</span> <strong>{{ lastShift()!.endTime }}</strong></div>
                  <div><span class="text-gray-500">Duration:</span> <strong>{{ lastShift()!.totalHours }}h</strong></div>
                  <div>
                    <span class="text-gray-500">Status:</span>
                    @if (lastShift()!.isValidShift) {
                      <span class="badge badge-success">Valid (≥8h)</span>
                    } @else {
                      <span class="badge badge-error">Flagged (&lt;8h) — Admin override required</span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </section>
      }

      <!-- Attendance Tab -->
      @if (activeTab === 'attendance') {
        <section class="card mb-6">
          <div class="card-header"><h2 class="card-title">Attendance History</h2></div>
          <div class="card-body p-0">
            <table class="data-table">
              <thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr></thead>
              <tbody>
                @for (a of attendance(); track a.id) {
                  <tr>
                    <td class="font-medium">{{ formatDate(a.attendance_date) }}</td>
                    <td>{{ a.check_in_time ? formatTime(a.check_in_time) : '—' }}</td>
                    <td>{{ a.check_out_time ? formatTime(a.check_out_time) : '—' }}</td>
                    <td class="font-semibold">{{ a.hours_worked?.toFixed(1) ?? '—' }}h</td>
                    <td><span class="badge badge-{{ a.status === 'present' ? 'success' : a.status === 'late' ? 'warning' : 'error' }}">{{ a.status }}</span></td>
                  </tr>
                } @empty {
                  <tr><td colspan="5" class="text-center py-8 text-gray-500">No attendance records</td></tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }

      <!-- Leave Tab -->
      @if (activeTab === 'leave') {
        <section class="card mb-6">
          <div class="card-header">
            <h2 class="card-title">Leave Requests</h2>
            <button class="btn btn-primary btn-sm" (click)="showLeaveModal = true">Request Leave</button>
          </div>
          <div class="card-body p-0">
            <table class="data-table">
              <thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr></thead>
              <tbody>
                @for (l of leaveRequests(); track l.id) {
                  <tr>
                    <td class="font-medium">{{ l.leave_type }}</td>
                    <td>{{ formatDate(l.start_date) }}</td>
                    <td>{{ formatDate(l.end_date) }}</td>
                    <td>{{ l.num_days }}</td>
                    <td><span class="badge badge-{{ l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'error' : 'warning' }}">{{ l.status }}</span></td>
                  </tr>
                } @empty {
                  <tr><td colspan="5" class="text-center py-8 text-gray-500">No leave requests</td></tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }

      <!-- Payslips Tab -->
      @if (activeTab === 'payslips') {
        <section class="card mb-6">
          <div class="card-header"><h2 class="card-title">Payslips</h2></div>
          <div class="card-body">
            <div class="empty-state py-12">
              <div class="empty-state-icon">
                <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <p class="empty-state-title">No payslips available</p>
              <p class="empty-state-text">Your payslips will appear here once processed by payroll.</p>
            </div>
          </div>
        </section>
      }

      }

      <footer class="app-footer">
        <div class="app-footer__inner">
          <img src="/wiseworx-logo.svg" alt="WiseWorx logo" class="app-footer__logo" />
          <p class="app-footer__text">&copy; {{ currentYear }} WiseWorx. PropertyPro&trade; Platform.</p>
        </div>
      </footer>

      <!-- Leave Modal -->
      @if (showLeaveModal) {
        <div class="modal-overlay" (click)="showLeaveModal = false">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 class="font-semibold text-lg">Request Leave</h3>
              <button class="modal-close" (click)="showLeaveModal = false">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group mb-4">
                <label class="form-label">Leave Type</label>
                <select class="form-select" [(ngModel)]="leaveForm.leaveType">
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Leave</option>
                  <option value="parental">Parental Leave</option>
                  <option value="bereavement">Bereavement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="grid-2 mb-4">
                <div class="form-group">
                  <label class="form-label">Start Date</label>
                  <input type="date" class="form-input" [(ngModel)]="leaveForm.startDate" />
                </div>
                <div class="form-group">
                  <label class="form-label">End Date</label>
                  <input type="date" class="form-input" [(ngModel)]="leaveForm.endDate" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Reason</label>
                <textarea class="form-textarea" [(ngModel)]="leaveForm.reason" placeholder="Reason for leave..."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="showLeaveModal = false">Cancel</button>
              <button class="btn btn-primary" (click)="submitLeave()" [disabled]="!leaveForm.startDate || !leaveForm.endDate">Submit</button>
            </div>
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
    .shift-clock-card {
      max-width: 1280px; margin: 0 auto 1.5rem; padding: 0 2rem;
      background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
      border-radius: 1rem; display: flex; align-items: center; justify-content: space-between;
      padding: 2rem; color: white; box-shadow: 0 8px 24px rgba(124,58,237,0.2);
    }
    .shift-clock-card__left { display: flex; flex-direction: column; gap: 0.5rem; }
    .shift-clock-card__status { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; opacity: 0.8; }
    .shift-clock-card__status.active { opacity: 1; color: #D1FAE5; }
    .shift-clock-card__dot { width: 0.5rem; height: 0.5rem; border-radius: 50%; background: currentColor; }
    .shift-clock-card__time { display: flex; align-items: baseline; gap: 0.5rem; }
    .shift-clock-card__hours { font-size: 2rem; font-weight: 800; }
    .shift-clock-card__label { font-size: 0.875rem; opacity: 0.7; }
    .shift-clock-card__right { display: flex; gap: 0.75rem; }
    .tabs-bar { display: flex; border-bottom: 1px solid #E5E7EB; background: white; padding: 0 2rem; max-width: 1280px; margin: 0 auto; }
    .tab-item { padding: 0.875rem 1.25rem; font-size: 0.875rem; font-weight: 500; color: #6B7280; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; transition: all 0.2s ease; }
    .tab-item:hover { color: #1F2937; }
    .tab-item.active { color: #7C3AED; border-bottom-color: #7C3AED; }
    .mb-6 { margin-bottom: 1.5rem; } .mb-4 { margin-bottom: 1rem; } .mt-6 { margin-top: 1.5rem; } .mt-3 { margin-top: 0.75rem; } .p-0 { padding: 0; } .py-8 { padding: 2rem 0; } .py-12 { padding: 3rem 0; } .text-center { text-align: center; } .text-gray-500 { color: #6B7280; } .text-sm { font-size: 0.75rem; } .font-medium { font-weight: 500; } .font-semibold { font-weight: 600; } .text-lg { font-size: 1.125rem; } .p-4 { padding: 1rem; } .rounded-lg { border-radius: 0.5rem; } .border { border: 1px solid; } .border-red-300 { border-color: #FCA5A5; } .border-green-300 { border-color: #86EFAC; } .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; } .flex { display: flex; } .items-center { align-items: center; } .gap-0 { gap: 0; } .empty-state { text-align: center; } .empty-state-icon { color: #D1D5DB; margin-bottom: 1rem; } .empty-state-title { font-weight: 600; color: #374151; margin-bottom: 0.25rem; } .empty-state-text { font-size: 0.875rem; color: #6B7280; } .app-footer { padding: 1.5rem 2rem 2rem; } .app-footer__inner { max-width: 1280px; margin: 0 auto; padding: 1.25rem; border-radius: 0.75rem; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.04); border: 1px solid #E5E7EB; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; } .app-footer__logo { height: 2rem; width: auto; } .app-footer__text { margin: 0; color: #6B7280; font-size: 0.8rem; } .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; color: #6B7280; gap: 1rem; } .error-banner { margin: 2rem; padding: 1rem 1.5rem; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 0.5rem; display: flex; align-items: center; justify-content: space-between; color: #991B1B; } .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; } .modal { background: white; border-radius: 0.75rem; box-shadow: 0 25px 50px rgba(0,0,0,0.15); width: 100%; max-width: 28rem; } .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; justify-content: space-between; } .modal-body { padding: 1.5rem; } .modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #E5E7EB; display: flex; justify-content: flex-end; gap: 0.75rem; } .modal-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6B7280; } .task-form { display: flex; flex-direction: column; gap: 1rem; } .shift-summary { background: #F9FAFB; }
    @media (max-width: 768px) { .shift-clock-card { flex-direction: column; gap: 1.5rem; text-align: center; } .shift-clock-card__right { justify-content: center; } .grid-2 { grid-template-columns: 1fr; } }
  `]
})
export class StaffDashboardComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly supabase = inject(SupabaseService);
  private readonly authService = inject(AuthService);

  protected readonly taskForm = this.formBuilder.nonNullable.group({ description: ['', [Validators.required, Validators.minLength(5)]] });
  protected readonly isClockedIn = signal(false);
  protected readonly shiftStartTime = signal<string | null>(null);
  protected readonly shiftStartDate = signal<Date | null>(null);
  protected readonly tasks = signal<readonly { description: string; loggedAt: string }[]>([]);
  protected readonly lastShift = signal<{ startTime: string; endTime: string; totalHours: number; isValidShift: boolean; requiresAdminOverride: boolean; tasksCompleted: readonly { description: string; loggedAt: string }[]; status: string } | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly staffMember = signal<StaffMember | null>(null);
  protected readonly attendance = signal<StaffAttendance[]>([]);
  protected readonly leaveRequests = signal<StaffLeaveRequest[]>([]);
  protected readonly activeTab = signal('tasks');
  protected activeTab = 'tasks';
  protected readonly showLeaveModal = signal(false);
  protected showLeaveModal = false;
  protected readonly currentYear = new Date().getFullYear();

  protected leaveForm: LeaveFormData = { leaveType: 'annual', startDate: '', endDate: '', reason: '' };

  protected readonly liveHoursWorked = computed(() => {
    const start = this.shiftStartDate();
    if (!start) return '0.00';
    const hours = (Date.now() - start.getTime()) / 3600000;
    return hours.toFixed(2);
  });

  ngOnInit(): void { void this.loadData(); }

  async loadData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const user = this.authService.getCurrentUser();
      if (!user) { this.error.set('Not authenticated'); return; }
      const token = user.auth?.accessToken;
      const [staff, att, leaves] = await Promise.all([
        this.supabase.getStaffMemberById(user.id, token).catch(() => null),
        this.supabase.getStaffAttendance(user.id, token).catch(() => []),
        this.supabase.getStaffLeaveRequests(user.id, token).catch(() => [])
      ]);
      this.staffMember.set(staff);
      this.attendance.set(att);
      this.leaveRequests.set(leaves);

      // Restore last shift from localStorage
      const saved = localStorage.getItem('propertypro.staffShift.latest');
      if (saved) {
        try { this.lastShift.set(JSON.parse(saved)); } catch { /* ignore */ }
      }
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      this.loading.set(false);
    }
  }

  protected clockIn(): void {
    if (this.isClockedIn()) return;
    const now = new Date();
    this.shiftStartDate.set(now);
    this.shiftStartTime.set(this.formatDateTime(now));
    this.isClockedIn.set(true);
    this.tasks.set([]);
  }

  protected clockOut(): void {
    const startDate = this.shiftStartDate();
    const startTime = this.shiftStartTime();
    if (!this.isClockedIn() || !startDate || !startTime) return;
    const endDate = new Date();
    const totalHours = Number(((endDate.getTime() - startDate.getTime()) / 3600000).toFixed(2));
    const isValidShift = totalHours >= 8;
    const summary = {
      startTime, endTime: this.formatDateTime(endDate), totalHours,
      isValidShift, requiresAdminOverride: !isValidShift,
      tasksCompleted: this.tasks(), status: 'clocked-out'
    };
    localStorage.setItem('propertypro.staffShift.latest', JSON.stringify(summary));
    this.lastShift.set(summary);
    this.isClockedIn.set(false);
    this.shiftStartDate.set(null);
    this.shiftStartTime.set(null);

    // Submit to Supabase
    const user = this.authService.getCurrentUser();
    if (user?.auth?.accessToken) {
      void this.supabase.recordAttendance({
        organization_id: this.staffMember()?.organization_id ?? '',
        staff_member_id: this.staffMember()?.id ?? '',
        attendance_date: startDate.toISOString().split('T')[0],
        check_in_time: startDate.toISOString(),
        check_out_time: endDate.toISOString(),
        hours_worked: totalHours,
        status: totalHours >= 8 ? 'present' : 'late',
        notes: null
      }, user.auth.accessToken).catch(() => {});
    }
  }

  protected addTask(): void {
    this.taskForm.controls.description.markAsTouched();
    if (this.taskForm.invalid) return;
    const description = this.taskForm.controls.description.value.trim();
    if (!description) return;
    this.tasks.update(existing => [...existing, { description, loggedAt: this.formatDateTime(new Date()) }]);
    this.taskForm.reset({ description: '' });
  }

  protected async submitLeave(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user || !this.leaveForm.startDate || !this.leaveForm.endDate) return;
    const start = new Date(this.leaveForm.startDate);
    const end = new Date(this.leaveForm.endDate);
    const numDays = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;
    try {
      await this.supabase.createLeaveRequest({
        organization_id: this.staffMember()?.organization_id ?? '',
        staff_member_id: this.staffMember()?.id ?? '',
        leave_type: this.leaveForm.leaveType,
        start_date: this.leaveForm.startDate,
        end_date: this.leaveForm.endDate,
        num_days: numDays,
        reason: this.leaveForm.reason || null,
        status: 'pending',
        approved_by: null,
        approved_at: null
      }, user.auth?.accessToken);
      this.showLeaveModal = false;
      this.leaveForm = { leaveType: 'annual', startDate: '', endDate: '', reason: '' };
      await this.loadData();
    } catch (e) { /* silent */ }
  }

  private formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('en-ZA', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  private formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  private formatTime(d: string): string {
    return new Date(d).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  }
}
