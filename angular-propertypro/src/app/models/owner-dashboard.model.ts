// Enterprise Owner Dashboard TypeScript Interfaces
// Comprehensive data models for BI command center functionality

export interface OwnerMetrics {
  businessHealthScore: number;
  totalPortfolioValue: number;
  monthlyRecurringRevenue: number;
  occupancyRate: number;
  outstandingReceivables: number;
  netOperatingIncome: number;
  cashOnHand: number;
}

export interface FinancialAnalytics {
  revenue: RevenueAnalytics;
  expenses: ExpenseAnalytics;
  cashFlow: CashFlowAnalytics;
}

export interface RevenueAnalytics {
  incomeStatement: IncomeStatementEntry[];
  collectionRate: number;
  revenueByProperty: PropertyRevenue[];
  yearOverYearGrowth: number;
  projectedVsActual: ProjectedVsActual;
}

export interface IncomeStatementEntry {
  month: string;
  income: number;
  expenses: number;
  noi: number;
}

export interface PropertyRevenue {
  propertyId: string;
  propertyName: string;
  revenue: number;
  percentage: number;
}

export interface ProjectedVsActual {
  projected: number;
  actual: number;
  variance: number;
  variancePercent: number;
}

export interface ExpenseAnalytics {
  categories: ExpenseCategory[];
  topVendors: VendorExpense[];
  costPerUnit: CostPerUnit;
  utilityTrends: UtilityTrend[];
  budgetVsActual: BudgetVsActual;
}

export interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface VendorExpense {
  vendorName: string;
  amount: number;
  category: string;
  rating: number;
}

export interface CostPerUnit {
  maintenance: number;
  utilities: number;
  insurance: number;
  total: number;
}

export interface UtilityTrend {
  utility: string;
  currentMonth: number;
  previousMonth: number;
  changePercent: number;
}

export interface BudgetVsActual {
  budgeted: number;
  actual: number;
  variance: number;
  status: 'under' | 'over' | 'on-track';
}

export interface CashFlowAnalytics {
  waterfall: CashFlowItem[];
  upcomingPayouts: UpcomingPayout[];
  reserveFund: number;
  capitalExpenditure: CapitalExpenditure[];
  taxLiability: TaxLiability;
}

export interface CashFlowItem {
  category: string;
  amount: number;
  type: 'inflow' | 'outflow';
}

export interface UpcomingPayout {
  date: string;
  amount: number;
  recipient: string;
  status: 'scheduled' | 'pending' | 'processed';
}

export interface CapitalExpenditure {
  item: string;
  budgeted: number;
  spent: number;
  remaining: number;
  completionPercent: number;
}

export interface TaxLiability {
  quarterly: number;
  annual: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface PortfolioMetrics {
  occupancy: OccupancyAnalytics;
  units: UnitAnalytics;
}

export interface OccupancyAnalytics {
  heatmap: OccupancyHeatmapItem[];
  averageDaysVacant: number;
  turnoverRate: number;
  rentPerSqFt: RentPerSqFt[];
  valueAppreciation: ValueAppreciation[];
}

export interface OccupancyHeatmapItem {
  propertyId: string;
  propertyName: string;
  occupied: number;
  total: number;
  rate: number;
  color: string;
}

export interface RentPerSqFt {
  propertyId: string;
  propertyName: string;
  rentPerSqFt: number;
  marketAverage: number;
  premium: number;
}

export interface ValueAppreciation {
  propertyId: string;
  propertyName: string;
  initialValue: number;
  currentValue: number;
  appreciation: number;
  annualRate: number;
}

export interface UnitAnalytics {
  vacant: VacantUnit[];
  becomingVacant: BecomingVacantUnit[];
  leaseExpirations: LeaseExpiration[];
  rollSummary: RollSummary;
}

export interface VacantUnit {
  unitId: string;
  propertyName: string;
  unitNumber: string;
  daysVacant: number;
  lastOccupied: string;
  reason: string;
}

export interface BecomingVacantUnit {
  unitId: string;
  propertyName: string;
  unitNumber: string;
  moveOutDate: string;
  daysUntilVacant: number;
  tenantName: string;
}

export interface LeaseExpiration {
  unitId: string;
  propertyName: string;
  unitNumber: string;
  expirationDate: string;
  daysUntilExpiration: number;
  tenantName: string;
  renewalStatus: 'pending' | 'renewed' | 'not-renewing';
}

export interface RollSummary {
  totalUnits: number;
  occupied: number;
  vacant: number;
  underLease: number;
  monthToMonth: number;
  annualLeases: number;
}

export interface TenantQuality {
  creditDistribution: CreditScoreDistribution[];
  paymentHistory: PaymentHistory[];
  latePaymentStats: LatePaymentStats;
  riskIndicators: RiskIndicator[];
  satisfactionScores: SatisfactionScores;
}

export interface CreditScoreDistribution {
  range: string;
  count: number;
  percentage: number;
  color: string;
}

export interface PaymentHistory {
  tenantId: string;
  tenantName: string;
  paymentHistory: PaymentRecord[];
  onTimeRate: number;
  averageDaysLate: number;
}

export interface PaymentRecord {
  date: string;
  amount: number;
  status: 'on-time' | 'late' | 'partial';
  daysLate?: number;
}

export interface LatePaymentStats {
  totalLatePayments: number;
  averageDaysLate: number;
  latePaymentRate: number;
  trend: 'improving' | 'worsening' | 'stable';
}

export interface RiskIndicator {
  tenantId: string;
  tenantName: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
  score: number;
}

export interface SatisfactionScores {
  overallScore: number;
  responseRate: number;
  categories: SatisfactionCategory[];
  trends: SatisfactionTrend[];
}

export interface SatisfactionCategory {
  category: string;
  score: number;
  count: number;
}

export interface SatisfactionTrend {
  period: string;
  value: number;
  change: number;
}

export interface OperationsDashboard {
  workOrders: WorkOrderAnalytics;
}

export interface WorkOrderAnalytics {
  openCount: number;
  averageResponseTime: number;
  costTrends: CostTrend[];
  vendorRatings: VendorRating[];
  preventiveSchedule: PreventiveMaintenance[];
  emergencyIncidents: EmergencyIncident[];
}

export interface CostTrend {
  period: string;
  value: number;
  change: number;
}

export interface VendorRating {
  vendorId: string;
  vendorName: string;
  rating: number;
  reviewCount: number;
  responseTime: number;
  qualityScore: number;
}

export interface PreventiveMaintenance {
  item: string;
  frequency: string;
  lastCompleted: string;
  nextDue: string;
  assignedTo: string;
  status: 'upcoming' | 'due' | 'overdue' | 'completed';
}

export interface EmergencyIncident {
  date: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  responseTime: string;
  resolutionTime: string;
  cost: number;
}

export interface ComplianceLegal {
  leaseCompliance: LeaseCompliance;
  inspectionDueDates: InspectionDueDate[];
  certificateExpirations: CertificateExpiration[];
  pendingLegal: PendingLegalCase[];
  regulatoryChanges: RegulatoryChange[];
}

export interface LeaseCompliance {
  compliant: number;
  nonCompliant: number;
  underReview: number;
  total: number;
  complianceRate: number;
}

export interface InspectionDueDate {
  propertyId: string;
  propertyName: string;
  inspectionType: string;
  dueDate: string;
  daysUntilDue: number;
  status: 'scheduled' | 'overdue' | 'completed';
  inspector: string;
}

export interface CertificateExpiration {
  type: string;
  issuer: string;
  expirationDate: string;
  daysUntilExpiration: number;
  status: 'valid' | 'expiring' | 'expired';
  renewalCost: number;
}

export interface PendingLegalCase {
  caseId: string;
  type: string;
  status: 'active' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  dueDate: string;
}

export interface RegulatoryChange {
  regulation: string;
  effectiveDate: string;
  impact: string;
  actionRequired: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface QuickActions {
  generateReports: ReportGeneration[];
  approveRequests: ApprovalRequest[];
  sendNotifications: NotificationTemplate[];
  scheduleInspections: InspectionSchedule[];
  createLease: LeaseTemplate[];
  addProperty: AddPropertyWizard;
}

export interface ReportGeneration {
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastGenerated: string;
  nextScheduled: string;
}

export interface ApprovalRequest {
  id: string;
  type: string;
  amount: number;
  requester: string;
  submittedDate: string;
  urgency: 'low' | 'medium' | 'high';
  description: string;
}

export interface NotificationTemplate {
  name: string;
  description: string;
  recipientCount: number;
  lastSent: string;
  status: 'scheduled' | 'sent' | 'draft';
}

export interface InspectionSchedule {
  propertyId: string;
  propertyName: string;
  inspectionType: string;
  scheduledDate: string;
  inspector: string;
  estimatedCost: number;
}

export interface LeaseTemplate {
  name: string;
  type: 'residential' | 'commercial';
  term: number;
  lastUsed: string;
  usageCount: number;
}

export interface AddPropertyWizard {
  step: number;
  totalSteps: number;
  currentData: Record<string, any>;
}

export interface NotificationAlert {
  rentPayments: RentPaymentNotification[];
  maintenance: MaintenanceNotification[];
  renewals: RenewalNotification[];
  budgetWarnings: BudgetWarning[];
  complianceDeadlines: ComplianceDeadline[];
}

export interface RentPaymentNotification {
  tenantId: string;
  tenantName: string;
  amount: number;
  dueDate: string;
  status: 'received' | 'overdue' | 'partial';
  daysOverdue: number;
}

export interface MaintenanceNotification {
  propertyId: string;
  propertyName: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedDate: string;
  assignedTo: string;
  status: 'reported' | 'in-progress' | 'completed';
}

export interface RenewalNotification {
  tenantId: string;
  tenantName: string;
  unitId: string;
  expirationDate: string;
  daysUntilExpiration: number;
  status: 'sent' | 'responded' | 'pending';
}

export interface BudgetWarning {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  threshold: number;
  status: 'warning' | 'critical' | 'exceeded';
}

export interface ComplianceDeadline {
  item: string;
  type: string;
  dueDate: string;
  daysUntilDue: number;
  status: 'upcoming' | 'due' | 'overdue';
}