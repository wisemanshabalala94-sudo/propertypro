import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService, StaffMember, StaffAttendance, StaffLeaveRequest, MaintenanceRequest } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';

interface ShiftTaskLog {
  readonly description: string;
  readonly loggedAt: string;
  readonly maintenanceRequestId?: string;
}

interface ShiftSessionSummary {
  readonly startTime: string;
  readonly endTime: string;
  readonly totalHours: number;
  readonly isValidShift: boolean;
  readonly requiresAdminOverride: boolean;
  readonly tasksCompleted: readonly ShiftTaskLog[];
  readonly status: 'clocked-out';
}

interface LeaveForm {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="staff-page">
      <div class="staff-shell">

        <!-- Loading overlay -->
        @if (isLoading()) {
          <div class="loading-overlay">
            <div class="spinner"></div>
            <p>Loading your dashboard…</p>
          </div>
        }

        <!-- Error banner -->
        @if (errorMessage(); as msg) {
          <div class="error-banner">
            <span class="error-icon">!</span>
            <p>{{ msg }}</p>
            <button type="button" class="retry-button" (click)="loadDashboard()">Retry</button>
          </div>
        }

        <header class="hero-card">
          <p class="eyebrow">Staff shifts</p>
          <h1>Track shifts, time and task completion</h1>
          @if (staffMember(); as member) {
            <p>{{ member.job_title }}{{ member.department ? ' &middot; ' + member.department : '' }}</p>
          } @else {
            <p>
              PropertyPro validates shifts automatically. Any shift shorter than 8 hours is flagged for admin
              override before payroll processing.
            </p>
          }
        </header>

        <section class="panel-grid">
          <!-- Shift Controls Panel -->
          <article class="panel">
            <h2>Shift controls</h2>
            <div class="status-strip" [class.active]="isClockedIn()">
              <span class="status-dot"></span>
              <strong>{{ isClockedIn() ? 'Clocked in' : 'Not clocked in' }}</strong>
            </div>

            <dl class="meta-list">
              <div>
                <dt>Clock-in time</dt>
                <dd>{{ shiftStartTime() ?? 'Not started' }}</dd>
              </div>
              <div>
                <dt>Current duration</dt>
                <dd>{{ liveHoursWorked() }} hours</dd>
              </div>
              <div>
                <dt>Validation rule</dt>
                <dd>Minimum 8 hours</dd>
              </div>
            </dl>

            <div class="button-row">
              <button type="button" class="primary-button" (click)="clockIn()" [disabled]="isClockedIn() || isLoading()">
                Clock in
              </button>
              <button type="button" class="secondary-button" (click)="clockOut()" [disabled]="!isClockedIn()">
                Clock out
              </button>
            </div>

            @if (lastShift(); as summary) {
              <div class="summary-card" [class.flagged]="summary.requiresAdminOverride">
                <h3>Last submitted shift</h3>
                <p><strong>Start:</strong> {{ summary.startTime }}</p>
                <p><strong>End:</strong> {{ summary.endTime }}</p>
                <p><strong>Total:</strong> {{ summary.totalHours }} hours</p>
                <p><strong>Status:</strong> {{ summary.isValidShift ? 'Valid shift' : 'Flagged for review' }}</p>
                @if (summary.requiresAdminOverride) {
                  <div class="warning-box">
                    Shift duration is under 8 hours. An admin override is required before payroll approval.
                  </div>
                } @else {
                  <div class="success-box">
                    Shift meets the 8-hour requirement and is ready for admin validation.
                  </div>
                }
              </div>
            }
          </article>

          <!-- Task Logging Panel -->
          <article class="panel">
            <h2>Task logging</h2>
            <form [formGroup]="taskForm" (ngSubmit)="addTask()" class="task-form">
              <label class="field">
                <span>Completed task</span>
                <textarea rows="4" formControlName="description" placeholder="Describe work completed during the shift"></textarea>
              </label>
              @if (taskForm.controls.description.invalid && taskForm.controls.description.touched) {
                <small>Enter at least 5 characters before logging a task.</small>
              }

              <!-- Link to maintenance request -->
              <label class="field">
                <span>Link to maintenance request (optional)</span>
                <select formControlName="maintenanceRequestId" class="select-field">
                  <option value="">— No maintenance request —</option>
                  @for (req of maintenanceRequests(); track req.id) {
                    <option [value]="req.id">{{ req.title }} ({{ req.status }})</option>
                  }
                </select>
              </label>

              <button type="submit" class="primary-button" [disabled]="isLoading()">Log task</button>
            </form>

            @if (taskSaveError()) {
              <div class="task-error-box">{{ taskSaveError() }}</div>
            }

            <div class="task-list-card">
              <div class="task-list-header">
                <h3>Current shift tasks</h3>
                <span>{{ tasks().length }} logged</span>
              </div>

              @if (tasks().length === 0) {
                <p class="empty-state">No tasks logged yet for this shift.</p>
              } @else {
                <ul class="task-list">
                  @for (task of tasks(); track task.loggedAt + task.description) {
                    <li>
                      <strong>{{ task.description }}</strong>
                      <span>{{ task.loggedAt }}</span>
                      @if (task.maintenanceRequestId) {
                        <span class="task-badge">Linked</span>
                      }
                    </li>
                  }
                </ul>
              }
            </div>
          </article>

          <!-- Attendance History Panel -->
          <article class="panel">
            <h2>Attendance history</h2>
            @if (attendanceRecords().length === 0) {
              <p class="empty-state">No attendance records found.</p>
            } @else {
              <ul class="attendance-list">
                @for (record of attendanceRecords(); track record.id) {
                  <li class="attendance-row">
                    <div class="attendance-date">
                      <strong>{{ record.attendance_date }}</strong>
                    </div>
                    <div class="attendance-times">
                      <span>In: {{ record.check_in_time ?? '—' }}</span>
                      <span>Out: {{ record.check_out_time ?? '—' }}</span>
                    </div>
                    <div class="attendance-meta">
                      <span class="attendance-status" [class.present]="record.status === 'present'" [class.late]="record.status === 'late'" [class.absent]="record.status === 'absent'">
                        {{ record.status }}
                      </span>
                      @if (record.hours_worked) {
                        <span>{{ record.hours_worked }}h</span>
                      }
                    </div>
                  </li>
                }
              </ul>
            }
          </article>

          <!-- Leave Requests Panel -->
          <article class="panel">
            <h2>Leave requests</h2>

            <!-- Existing leave requests -->
            @if (leaveRequests().length === 0) {
              <p class="empty-state">No leave requests submitted.</p>
            } @else {
              <ul class="leave-list">
                @for (leave of leaveRequests(); track leave.id) {
                  <li class="leave-row">
                    <div class="leave-dates">
                      <strong>{{ leave.start_date }}</strong>
                      <span>to</span>
                      <strong>{{ leave.end_date }}</strong>
                    </div>
                    <div class="leave-type">{{ leave.leave_type }}</div>
                    <div class="leave-days">{{ leave.num_days }} day{{ leave.num_days === 1 ? '' : 's' }}</div>
                    <span class="leave-status" [class.pending]="leave.status === 'pending'" [class.approved]="leave.status === 'approved'" [class.rejected]="leave.status === 'rejected'">
                      {{ leave.status }}
                    </span>
                  </li>
                }
              </ul>
            }

            <!-- New leave request form -->
            <details class="leave-form-details">
              <summary>Request new leave</summary>
              <form [formGroup]="leaveFormGroup" (ngSubmit)="submitLeaveRequest()" class="leave-form">
                <label class="field">
                  <span>Leave type</span>
                  <select formControlName="leaveType" class="select-field">
                    <option value="annual">Annual</option>
                    <option value="sick">Sick</option>
                    <option value="personal">Personal</option>
                    <option value="parental">Parental</option>
                    <option value="bereavement">Bereavement</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <div class="field-row">
                  <label class="field">
                    <span>Start date</span>
                    <input type="date" formControlName="startDate" class="input-field" />
                  </label>
                  <label class="field">
                    <span>End date</span>
                    <input type="date" formControlName="endDate" class="input-field" />
                  </label>
                </div>
                <label class="field">
                  <span>Reason</span>
                  <textarea rows="3" formControlName="reason" placeholder="Reason for leave" class="textarea-field"></textarea>
                </label>
                @if (leaveFormGroup.invalid && leaveFormGroup.touched) {
                  <small>Fill in all required fields with valid dates.</small>
                }
                <button type="submit" class="primary-button" [disabled]="isLoading() || leaveFormGroup.invalid">Submit request</button>
              </form>
            </details>
          </article>
        </section>

        <!-- WiseWorx Footer -->
        <footer class="wiseworx-footer">
          <div class="wiseworx-logo">
            <svg width="140" height="36" viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="28" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="26" fill="#10b981">Wise</text>
              <text x="62" y="28" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="26" fill="#111827">Worx</text>
            </svg>
          </div>
          <p class="wiseworx-tagline">Property management, simplified.</p>
        </footer>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .staff-page {
      min-height: 100%;
      padding: 2rem 1rem 4rem;
      background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
      color: #111827;
    }

    .staff-shell {
      max-width: 1080px;
      margin: 0 auto;
      display: grid;
      gap: 1.5rem;
      position: relative;
    }

    /* Loading overlay */
    .loading-overlay {
      position: absolute;
      inset: 0;
      z-index: 50;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(248, 250, 252, 0.92);
      border-radius: 1.25rem;
      gap: 1rem;
    }

    .spinner {
      width: 2.5rem;
      height: 2.5rem;
      border: 3px solid #e5e7eb;
      border-top-color: #10b981;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-overlay p {
      color: #6b7280;
      font-weight: 600;
      margin: 0;
    }

    /* Error banner */
    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #fef2f2;
      border: 1px solid #fca5a5;
      border-radius: 0.95rem;
      padding: 0.85rem 1rem;
    }

    .error-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background: #dc2626;
      color: #fff;
      font-weight: 700;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .error-banner p {
      flex: 1;
      margin: 0;
      color: #b91c1c;
      font-weight: 600;
    }

    .retry-button {
      border: 0;
      border-radius: 999px;
      background: #dc2626;
      color: #fff;
      padding: 0.5rem 1rem;
      font-weight: 700;
      font: inherit;
      cursor: pointer;
      flex-shrink: 0;
    }

    .hero-card,
    .panel,
    .task-list-card,
    .summary-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 1.25rem;
      box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
    }

    .hero-card,
    .panel {
      padding: 1.5rem;
    }

    .eyebrow {
      margin: 0 0 0.5rem;
      color: #10b981;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.08em;
      font-size: 0.9rem;
    }

    h1,
    h2,
    h3,
    p {
      margin-top: 0;
    }

    .panel-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    }

    .status-strip {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      border-radius: 999px;
      background: #f3f4f6;
      color: #4b5563;
      padding: 0.65rem 0.95rem;
      margin-bottom: 1rem;
    }

    .status-strip.active {
      background: rgba(16, 185, 129, 0.12);
      color: #047857;
    }

    .status-dot {
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 50%;
      background: currentColor;
      display: inline-block;
    }

    .meta-list {
      display: grid;
      gap: 0.75rem;
      margin: 0 0 1.25rem;
    }

    .meta-list div {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      border-bottom: 1px solid #f3f4f6;
      padding-bottom: 0.75rem;
    }

    dt {
      color: #6b7280;
      font-weight: 600;
    }

    dd {
      margin: 0;
      font-weight: 700;
    }

    .button-row {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .primary-button,
    .secondary-button {
      border: 0;
      border-radius: 999px;
      padding: 0.9rem 1.2rem;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .primary-button {
      background: #10b981;
      color: #ffffff;
    }

    .secondary-button {
      background: #e5e7eb;
      color: #111827;
    }

    .primary-button:disabled,
    .secondary-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .task-form {
      display: grid;
      gap: 1rem;
    }

    .field {
      display: grid;
      gap: 0.5rem;
    }

    .field span {
      font-weight: 600;
      color: #374151;
    }

    textarea,
    .textarea-field {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #d1d5db;
      border-radius: 0.95rem;
      padding: 0.9rem 1rem;
      font: inherit;
      resize: vertical;
      min-height: 120px;
    }

    textarea:focus,
    .textarea-field:focus {
      outline: 2px solid rgba(16, 185, 129, 0.2);
      border-color: #10b981;
      outline-offset: 1px;
    }

    .select-field,
    .input-field {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #d1d5db;
      border-radius: 0.95rem;
      padding: 0.75rem 1rem;
      font: inherit;
      background: #fff;
    }

    .select-field:focus,
    .input-field:focus {
      outline: 2px solid rgba(16, 185, 129, 0.2);
      border-color: #10b981;
      outline-offset: 1px;
    }

    .field-row {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: 1fr 1fr;
    }

    small {
      color: #dc2626;
    }

    .task-error-box {
      margin-top: 0.75rem;
      border-radius: 0.85rem;
      padding: 0.75rem 1rem;
      background: #fef2f2;
      color: #b91c1c;
      font-weight: 600;
    }

    .task-list-card {
      margin-top: 1.25rem;
      padding: 1rem;
      background: #f9fafb;
    }

    .task-list-header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .task-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.75rem;
    }

    .task-list li {
      border: 1px solid #e5e7eb;
      background: #ffffff;
      border-radius: 0.95rem;
      padding: 0.9rem 1rem;
      display: grid;
      gap: 0.35rem;
      align-items: center;
    }

    .task-list span,
    .empty-state {
      color: #6b7280;
    }

    .task-badge {
      display: inline-block;
      background: rgba(16, 185, 129, 0.12);
      color: #047857;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 999px;
      padding: 0.2rem 0.6rem;
      justify-self: start;
    }

    .summary-card {
      margin-top: 1.25rem;
      padding: 1rem;
    }

    .summary-card.flagged {
      border-color: #fca5a5;
      background: #fff7ed;
    }

    .warning-box,
    .success-box {
      border-radius: 0.85rem;
      padding: 0.9rem 1rem;
      font-weight: 600;
    }

    .warning-box {
      background: #fef2f2;
      color: #b91c1c;
    }

    .success-box {
      background: #ecfdf5;
      color: #065f46;
    }

    /* Attendance list */
    .attendance-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.75rem;
    }

    .attendance-row {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 1rem;
      align-items: center;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      border-radius: 0.95rem;
      padding: 0.75rem 1rem;
    }

    .attendance-times {
      display: flex;
      gap: 0.75rem;
      color: #6b7280;
      font-size: 0.85rem;
    }

    .attendance-meta {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .attendance-status {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      border-radius: 999px;
      padding: 0.2rem 0.6rem;
    }

    .attendance-status.present {
      background: rgba(16, 185, 129, 0.12);
      color: #047857;
    }

    .attendance-status.late {
      background: rgba(245, 158, 11, 0.12);
      color: #b45309;
    }

    .attendance-status.absent {
      background: rgba(239, 68, 68, 0.12);
      color: #b91c1c;
    }

    /* Leave list */
    .leave-list {
      list-style: none;
      padding: 0;
      margin: 0 0 1rem;
      display: grid;
      gap: 0.75rem;
    }

    .leave-row {
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      gap: 1rem;
      align-items: center;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      border-radius: 0.95rem;
      padding: 0.75rem 1rem;
    }

    .leave-dates {
      display: flex;
      gap: 0.4rem;
      align-items: center;
      font-size: 0.9rem;
    }

    .leave-dates span {
      color: #9ca3af;
    }

    .leave-type {
      color: #6b7280;
      text-transform: capitalize;
    }

    .leave-days {
      color: #6b7280;
      font-weight: 600;
    }

    .leave-status {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      border-radius: 999px;
      padding: 0.2rem 0.6rem;
    }

    .leave-status.pending {
      background: rgba(245, 158, 11, 0.12);
      color: #b45309;
    }

    .leave-status.approved {
      background: rgba(16, 185, 129, 0.12);
      color: #047857;
    }

    .leave-status.rejected {
      background: rgba(239, 68, 68, 0.12);
      color: #b91c1c;
    }

    /* Leave form details */
    .leave-form-details {
      border: 1px dashed #d1d5db;
      border-radius: 0.95rem;
      padding: 0.75rem 1rem;
    }

    .leave-form-details summary {
      cursor: pointer;
      font-weight: 700;
      color: #374151;
    }

    .leave-form {
      display: grid;
      gap: 1rem;
      margin-top: 1rem;
    }

    /* WiseWorx footer */
    .wiseworx-footer {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 1.25rem;
      box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .wiseworx-logo {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .wiseworx-tagline {
      margin: 0;
      color: #6b7280;
      font-size: 0.85rem;
      font-weight: 500;
    }
  `]
})
export class StaffDashboardComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  // ---- Core shift signals (preserved from original) ----
  protected readonly isClockedIn = signal(false);
  protected readonly shiftStartTime = signal<string | null>(null);
  protected readonly shiftStartDate = signal<Date | null>(null);
  protected readonly tasks = signal<readonly ShiftTaskLog[]>([]);
  protected readonly lastShift = signal<ShiftSessionSummary | null>(null);

  // ---- New data signals ----
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly staffMember = signal<StaffMember | null>(null);
  protected readonly attendanceRecords = signal<StaffAttendance[]>([]);
  protected readonly leaveRequests = signal<StaffLeaveRequest[]>([]);
  protected readonly maintenanceRequests = signal<MaintenanceRequest[]>([]);
  protected readonly taskSaveError = signal<string | null>(null);

  // ---- Task form ----
  protected readonly taskForm = this.formBuilder.nonNullable.group({
    description: ['', [Validators.required, Validators.minLength(5)]],
    maintenanceRequestId: ['']
  });

  // ---- Leave form ----
  protected readonly leaveFormGroup = this.formBuilder.nonNullable.group({
    leaveType: ['annual', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    reason: ['']
  });

  protected readonly liveHoursWorked = computed(() => {
    const start = this.shiftStartDate();
    if (!start) {
      return '0.00';
    }
    const hours = (Date.now() - start.getTime()) / 3600000;
    return hours.toFixed(2);
  });

  async ngOnInit(): Promise<void> {
    await this.loadDashboard();
  }

  async loadDashboard(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const currentUser = this.auth.getCurrentUser();
      if (!currentUser) {
        this.errorMessage.set('You must be signed in to view this dashboard.');
        return;
      }

      const accessToken = currentUser.auth?.accessToken;
      const profileId = currentUser.id;

      // Fetch staff member record
      const member = await this.supabase.getStaffMemberById(profileId, accessToken);
      this.staffMember.set(member);

      if (member) {
        // Fetch attendance, leave requests in parallel
        const [attendance, leaves, maintRequests] = await Promise.all([
          this.supabase.getStaffAttendance(member.id, accessToken).catch(() => [] as StaffAttendance[]),
          this.supabase.getStaffLeaveRequests(member.id, accessToken).catch(() => [] as StaffLeaveRequest[]),
          this.supabase.getMaintenanceRequests(undefined, member.organization_id, accessToken).catch(() => [] as MaintenanceRequest[])
        ]);

        this.attendanceRecords.set(attendance);
        this.leaveRequests.set(leaves);
        this.maintenanceRequests.set(maintRequests);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard data.';
      this.errorMessage.set(message);
    } finally {
      this.isLoading.set(false);
    }
  }

  protected clockIn(): void {
    if (this.isClockedIn()) {
      return;
    }

    const now = new Date();
    this.shiftStartDate.set(now);
    this.shiftStartTime.set(this.formatDateTime(now));
    this.isClockedIn.set(true);
    this.tasks.set([]);
    this.lastShift.set(null);
    this.taskSaveError.set(null);
  }

  protected clockOut(): void {
    const startDate = this.shiftStartDate();
    const startTime = this.shiftStartTime();

    if (!this.isClockedIn() || !startDate || !startTime) {
      return;
    }

    const endDate = new Date();
    const totalHours = Number(((endDate.getTime() - startDate.getTime()) / 3600000).toFixed(2));
    const isValidShift = totalHours >= 8;

    const summary: ShiftSessionSummary = {
      startTime,
      endTime: this.formatDateTime(endDate),
      totalHours,
      isValidShift,
      requiresAdminOverride: !isValidShift,
      tasksCompleted: this.tasks(),
      status: 'clocked-out'
    };

    localStorage.setItem('propertypro.staffShift.latest', JSON.stringify(summary));
    this.lastShift.set(summary);
    this.isClockedIn.set(false);
    this.shiftStartDate.set(null);
    this.shiftStartTime.set(null);
  }

  protected async addTask(): Promise<void> {
    this.taskForm.controls.description.markAsTouched();
    this.taskSaveError.set(null);

    if (this.taskForm.invalid) {
      return;
    }

    const description = this.taskForm.controls.description.value.trim();
    if (!description) {
      return;
    }

    const maintenanceReqId = this.taskForm.controls.maintenanceRequestId.value || undefined;

    const nextTask: ShiftTaskLog = {
      description,
      loggedAt: this.formatDateTime(new Date()),
      maintenanceRequestId: maintenanceReqId
    };

    this.tasks.update((existing) => [...existing, nextTask]);

    // If linked to a maintenance request, update its status to in_progress
    if (maintenanceReqId) {
      try {
        const currentUser = this.auth.getCurrentUser();
        await this.supabase.updateMaintenanceRequest(
          maintenanceReqId,
          { status: 'in_progress' },
          currentUser?.auth?.accessToken
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to link task to maintenance request.';
        this.taskSaveError.set(msg);
      }
    }

    this.taskForm.reset({ description: '', maintenanceRequestId: '' });
  }

  protected async submitLeaveRequest(): Promise<void> {
    this.leaveFormGroup.markAllAsTouched();

    if (this.leaveFormGroup.invalid) {
      return;
    }

    const member = this.staffMember();
    if (!member) {
      this.errorMessage.set('No staff member record found. Cannot submit leave request.');
      return;
    }

    const formValue = this.leaveFormGroup.getRawValue();
    const start = new Date(formValue.startDate);
    const end = new Date(formValue.endDate);
    const numDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1);

    try {
      this.isLoading.set(true);
      const currentUser = this.auth.getCurrentUser();

      const newLeave = await this.supabase.createLeaveRequest({
        organization_id: member.organization_id,
        staff_member_id: member.id,
        leave_type: formValue.leaveType as StaffLeaveRequest['leave_type'],
        start_date: formValue.startDate,
        end_date: formValue.endDate,
        num_days: numDays,
        reason: formValue.reason || null,
        status: 'pending'
      }, currentUser?.auth?.accessToken);

      // Prepend to the list
      this.leaveRequests.update((existing) => [newLeave, ...existing]);
      this.leaveFormGroup.reset({
        leaveType: 'annual',
        startDate: '',
        endDate: '',
        reason: ''
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit leave request.';
      this.errorMessage.set(msg);
    } finally {
      this.isLoading.set(false);
    }
  }

  private formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('en-ZA', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  }
}
