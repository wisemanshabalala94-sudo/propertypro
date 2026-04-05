// Admin Dashboard Models - System Control Tower
// Comprehensive TypeScript interfaces for enterprise system administration

export interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  errorRate: number;
  lastIncident?: string;
}

export interface PlatformMetrics {
  totalUsers: number;
  activeUsers: number;
  totalProperties: number;
  totalRevenue: number;
  monthlyGrowth: number;
  userSatisfaction: number;
}

export interface SecurityAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
  affectedUsers?: number;
}

export interface ComplianceStatus {
  gdpr: 'compliant' | 'warning' | 'violation';
  hipaa?: 'compliant' | 'warning' | 'violation';
  pci: 'compliant' | 'warning' | 'violation';
  sox?: 'compliant' | 'warning' | 'violation';
  lastAudit: string;
  nextAudit: string;
}

export interface SystemAlert {
  id: string;
  type: 'performance' | 'security' | 'compliance' | 'operational';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
}

export interface UserManagement {
  totalUsers: number;
  activeUsers: number;
  pendingApprovals: number;
  suspendedUsers: number;
  recentSignups: UserSummary[];
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'staff' | 'tenant' | 'admin';
  status: 'active' | 'pending' | 'suspended';
  signupDate: string;
  lastLogin?: string;
}

export interface FinancialOverview {
  totalRevenue: number;
  monthlyRecurring: number;
  outstandingInvoices: number;
  paymentSuccessRate: number;
  chargebackRate: number;
  recentTransactions: TransactionSummary[];
}

export interface TransactionSummary {
  id: string;
  amount: number;
  type: 'payment' | 'refund' | 'chargeback';
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  userId: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
}

export interface BackupStatus {
  lastBackup: string;
  backupSize: string;
  status: 'success' | 'failed' | 'in_progress';
  nextScheduled: string;
  retentionDays: number;
}

export interface APIUsage {
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  topEndpoints: EndpointUsage[];
}

export interface EndpointUsage {
  endpoint: string;
  requests: number;
  averageTime: number;
  errorRate: number;
}

export interface DatabaseMetrics {
  connections: number;
  queryTime: number;
  storageUsed: string;
  backupStatus: BackupStatus;
}

export interface NotificationQueue {
  pending: number;
  sent: number;
  failed: number;
  averageDeliveryTime: number;
}

export interface EmergencyControl {
  lockdownActive: boolean;
  maintenanceMode: boolean;
  emergencyContacts: EmergencyContact[];
  incidentResponse: IncidentResponse;
}

export interface EmergencyContact {
  name: string;
  role: string;
  phone: string;
  email: string;
  priority: number;
}

export interface IncidentResponse {
  activeIncidents: number;
  responseTime: number;
  resolutionRate: number;
  lastDrill: string;
}

export interface AdminDashboardData {
  systemHealth: SystemHealth;
  platformMetrics: PlatformMetrics;
  securityAlerts: SecurityAlert[];
  complianceStatus: ComplianceStatus;
  systemAlerts: SystemAlert[];
  userManagement: UserManagement;
  financialOverview: FinancialOverview;
  auditLogs: AuditLog[];
  databaseMetrics: DatabaseMetrics;
  apiUsage: APIUsage;
  notificationQueue: NotificationQueue;
  emergencyControl: EmergencyControl;
}

export interface SystemConfiguration {
  maintenanceMode: boolean;
  emergencyMode: boolean;
  featureFlags: { [key: string]: boolean };
  rateLimits: { [key: string]: number };
  securityPolicies: SecurityPolicy[];
  notificationSettings: NotificationSettings;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  alertThresholds: { [key: string]: number };
  escalationRules: EscalationRule[];
}

export interface EscalationRule {
  id: string;
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  notifyRoles: string[];
  escalationTime: number;
}

export interface UserActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  metadata: { [key: string]: any };
}

export interface PerformanceMetrics {
  id: string;
  timestamp: string;
  metric: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

export interface SystemResourceUsage {
  cpu: {
    usage: number;
    cores: number;
    loadAverage: number[];
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    inbound: number;
    outbound: number;
    connections: number;
  };
}

export interface IncidentReport {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  reportedBy: string;
  assignedTo?: string;
  createdDate: string;
  resolvedDate?: string;
  resolution?: string;
  affectedSystems: string[];
  timeline: IncidentTimelineEntry[];
}

export interface IncidentTimelineEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export interface ComplianceAudit {
  id: string;
  auditType: 'gdpr' | 'hipaa' | 'pci' | 'sox' | 'custom';
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  scheduledDate: string;
  completedDate?: string;
  auditor: string;
  findings: AuditFinding[];
  recommendations: string[];
  nextAuditDate: string;
}

export interface AuditFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  evidence: string[];
  remediation: string;
  status: 'open' | 'in_progress' | 'resolved';
}

export interface DataRetentionPolicy {
  id: string;
  dataType: string;
  retentionPeriod: number; // days
  encryptionRequired: boolean;
  backupRequired: boolean;
  complianceFrameworks: string[];
  lastReviewed: string;
  nextReview: string;
}

export interface AccessControlList {
  id: string;
  resource: string;
  permissions: Permission[];
  roles: string[];
  conditions?: AccessCondition[];
}

export interface Permission {
  id: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
  resource: string;
  conditions?: string[];
}

export interface AccessCondition {
  id: string;
  type: 'time' | 'location' | 'device' | 'network';
  value: string;
  operator: 'equals' | 'contains' | 'range' | 'regex';
}

export interface SecurityIncident {
  id: string;
  type: 'brute_force' | 'sql_injection' | 'xss' | 'unauthorized_access' | 'data_breach' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedResources: string[];
  attackerInfo?: AttackerInfo;
  detectionMethod: string;
  responseActions: string[];
  status: 'detected' | 'investigating' | 'contained' | 'resolved';
  timestamp: string;
  resolvedDate?: string;
}

export interface AttackerInfo {
  ipAddress: string;
  userAgent: string;
  location?: string;
  knownMalicious: boolean;
  previousIncidents: number;
}

export interface BackupConfiguration {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  schedule: string;
  retention: number;
  destinations: string[];
  encryption: boolean;
  compression: boolean;
  lastSuccessful?: string;
  lastFailed?: string;
}

export interface DisasterRecoveryPlan {
  id: string;
  name: string;
  description: string;
  rto: number; // Recovery Time Objective in hours
  rpo: number; // Recovery Point Objective in hours
  procedures: RecoveryProcedure[];
  contactList: EmergencyContact[];
  lastTested: string;
  nextTest: string;
}

export interface RecoveryProcedure {
  id: string;
  step: number;
  description: string;
  responsible: string;
  estimatedTime: number;
  dependencies: string[];
}

export interface SystemIntegration {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'database' | 'file_transfer' | 'message_queue';
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  endpoint: string;
  authentication: string;
  lastSync: string;
  errorCount: number;
  throughput: number;
  latency: number;
}

export interface MonitoringDashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  refreshRate: number;
  permissions: string[];
  createdBy: string;
  lastModified: string;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'alert' | 'log';
  title: string;
  dataSource: string;
  configuration: { [key: string]: any };
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AdminNotification {
  id: string;
  type: 'alert' | 'report' | 'reminder' | 'update';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  expiresAt?: string;
}

export interface SystemMaintenance {
  id: string;
  title: string;
  description: string;
  type: 'scheduled' | 'emergency' | 'preventive';
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  affectedSystems: string[];
  impact: 'none' | 'low' | 'medium' | 'high' | 'critical';
  notificationSent: boolean;
  rollbackPlan?: string;
}

export interface AdminUserProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'super_admin' | 'security_admin' | 'system_admin' | 'compliance_admin' | 'support_admin';
  permissions: string[];
  twoFactorEnabled: boolean;
  lastLogin: string;
  loginAttempts: number;
  accountLocked: boolean;
  preferences: AdminPreferences;
}

export interface AdminPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    alertTypes: string[];
  };
  dashboard: {
    defaultView: string;
    refreshRate: number;
    widgets: string[];
  };
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  component: string;
  message: string;
  context: { [key: string]: any };
  userId?: string;
  sessionId?: string;
  requestId?: string;
  stackTrace?: string;
}

export interface AdminAuditTrail {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  changes: AuditChange[];
  ipAddress: string;
  userAgent: string;
  justification?: string;
}

export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
  reason?: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  version: string;
  requirements: ComplianceRequirement[];
  lastUpdated: string;
  nextReview: string;
  status: 'active' | 'deprecated' | 'superseded';
}

export interface ComplianceRequirement {
  id: string;
  requirement: string;
  description: string;
  category: string;
  priority: 'mandatory' | 'recommended' | 'optional';
  implementation: string;
  evidence: string[];
  status: 'implemented' | 'partial' | 'not_implemented' | 'not_applicable';
}

export interface RiskAssessment {
  id: string;
  asset: string;
  threat: string;
  vulnerability: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  likelihood: 'low' | 'medium' | 'high' | 'very_high';
  riskScore: number;
  mitigation: string[];
  owner: string;
  reviewDate: string;
  status: 'open' | 'mitigated' | 'accepted' | 'transferred';
}

export interface SecurityControl {
  id: string;
  name: string;
  type: 'preventive' | 'detective' | 'corrective';
  category: 'access_control' | 'cryptography' | 'physical_security' | 'operational_security' | 'communications_security';
  description: string;
  implementation: string;
  effectiveness: 'low' | 'medium' | 'high';
  status: 'implemented' | 'planned' | 'not_implemented';
  lastTested: string;
  nextTest: string;
}

export interface IncidentResponsePlan {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  phases: ResponsePhase[];
  roles: IncidentRole[];
  communicationPlan: CommunicationPlan;
  lastUpdated: string;
  lastTested: string;
}

export interface ResponsePhase {
  id: string;
  name: string;
  order: number;
  description: string;
  actions: string[];
  timeLimit: number;
  responsible: string[];
}

export interface IncidentRole {
  id: string;
  role: string;
  primaryContact: string;
  backupContact: string;
  responsibilities: string[];
}

export interface CommunicationPlan {
  id: string;
  stakeholders: Stakeholder[];
  templates: CommunicationTemplate[];
  escalationMatrix: EscalationMatrix;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  contactInfo: {
    email: string;
    phone: string;
    sms?: string;
  };
  notificationPreference: string[];
}

export interface CommunicationTemplate {
  id: string;
  type: 'initial_notification' | 'status_update' | 'resolution' | 'escalation';
  subject: string;
  template: string;
  variables: string[];
}

export interface EscalationMatrix {
  levels: EscalationLevel[];
  timeBasedEscalation: TimeBasedEscalation[];
}

export interface EscalationLevel {
  level: number;
  triggers: string[];
  notify: string[];
  timeLimit: number;
}

export interface TimeBasedEscalation {
  timeElapsed: number;
  escalateTo: string[];
  message: string;
}

export interface AdminTrainingRecord {
  id: string;
  adminId: string;
  trainingType: string;
  courseName: string;
  completionDate: string;
  expiryDate?: string;
  score?: number;
  certificate?: string;
  status: 'completed' | 'in_progress' | 'expired' | 'failed';
}

export interface SystemHealthCheck {
  id: string;
  timestamp: string;
  component: string;
  checkType: 'connectivity' | 'performance' | 'security' | 'compliance' | 'capacity';
  status: 'pass' | 'fail' | 'warning';
  details: string;
  responseTime?: number;
  errorMessage?: string;
  recommendations?: string[];
}

export interface AdminDashboardConfiguration {
  id: string;
  adminId: string;
  layout: 'default' | 'compact' | 'detailed';
  visiblePanels: string[];
  refreshRates: { [panel: string]: number };
  alertThresholds: { [metric: string]: number };
  customWidgets: DashboardWidget[];
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export interface SystemScalingConfiguration {
  id: string;
  component: string;
  autoScaling: boolean;
  minInstances: number;
  maxInstances: number;
  scalingTriggers: ScalingTrigger[];
  currentInstances: number;
  lastScaled: string;
}

export interface ScalingTrigger {
  id: string;
  metric: string;
  operator: '>' | '<' | '>=' | '<=';
  threshold: number;
  action: 'scale_up' | 'scale_down';
  cooldown: number;
}

export interface AdminSession {
  id: string;
  adminId: string;
  startTime: string;
  endTime?: string;
  ipAddress: string;
  userAgent: string;
  actions: SessionAction[];
  securityEvents: SecurityEvent[];
}

export interface SessionAction {
  id: string;
  timestamp: string;
  action: string;
  target: string;
  result: 'success' | 'failure';
  details?: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  blocked: boolean;
}

export interface AdminAccessReview {
  id: string;
  adminId: string;
  reviewDate: string;
  reviewer: string;
  accessLevel: string;
  permissions: string[];
  changes: AccessChange[];
  nextReview: string;
  status: 'approved' | 'modified' | 'revoked';
}

export interface AccessChange {
  id: string;
  permission: string;
  action: 'added' | 'removed' | 'modified';
  reason: string;
  approvedBy: string;
}

export interface SystemDocumentation {
  id: string;
  title: string;
  category: 'architecture' | 'security' | 'operations' | 'compliance' | 'disaster_recovery';
  content: string;
  version: string;
  lastUpdated: string;
  updatedBy: string;
  reviewers: string[];
  status: 'draft' | 'review' | 'approved' | 'archived';
}

export interface AdminOnboardingTask {
  id: string;
  adminId: string;
  task: string;
  description: string;
  category: 'security' | 'compliance' | 'operations' | 'tools';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  dueDate: string;
  completedDate?: string;
  assignedBy: string;
  resources: string[];
}

export interface SystemPerformanceBenchmark {
  id: string;
  timestamp: string;
  benchmark: string;
  metric: string;
  value: number;
  baseline: number;
  deviation: number;
  status: 'within_range' | 'warning' | 'critical';
  recommendations?: string[];
}

export interface AdminFeedbackLoop {
  id: string;
  adminId: string;
  feedbackType: 'bug_report' | 'feature_request' | 'usability_issue' | 'performance_issue';
  subject: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'submitted' | 'reviewing' | 'in_progress' | 'implemented' | 'declined';
  submittedDate: string;
  resolvedDate?: string;
  resolution?: string;
  satisfaction?: number;
}

export interface SystemCapacityPlanning {
  id: string;
  component: string;
  currentUsage: number;
  projectedUsage: number;
  capacityLimit: number;
  growthRate: number;
  timeToCapacity: number;
  recommendations: CapacityRecommendation[];
  lastUpdated: string;
}

export interface CapacityRecommendation {
  id: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  cost: number;
  timeline: string;
  impact: string;
}

export interface AdminKnowledgeBase {
  id: string;
  title: string;
  category: 'troubleshooting' | 'best_practices' | 'security' | 'compliance' | 'tools';
  content: string;
  tags: string[];
  author: string;
  createdDate: string;
  lastUpdated: string;
  viewCount: number;
  helpfulCount: number;
  status: 'published' | 'draft' | 'archived';
}

export interface SystemChangeManagement {
  id: string;
  title: string;
  description: string;
  type: 'enhancement' | 'bug_fix' | 'security_patch' | 'infrastructure' | 'configuration';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'proposed' | 'approved' | 'scheduled' | 'in_progress' | 'completed' | 'rolled_back';
  requestedBy: string;
  approvedBy?: string;
  scheduledDate?: string;
  completedDate?: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  rollbackPlan: string;
  testingPlan: string;
  communicationPlan: string;
}

export interface AdminProductivityMetrics {
  id: string;
  adminId: string;
  period: string;
  tasksCompleted: number;
  averageResolutionTime: number;
  customerSatisfaction: number;
  automationRate: number;
  errorRate: number;
  overtimeHours: number;
  trainingHours: number;
}

export interface SystemSustainabilityMetrics {
  id: string;
  timestamp: string;
  energyConsumption: number;
  carbonFootprint: number;
  wasteGenerated: number;
  recyclingRate: number;
  efficiencyScore: number;
  greenInitiatives: string[];
  targets: SustainabilityTarget[];
}

export interface SustainabilityTarget {
  id: string;
  metric: string;
  current: number;
  target: number;
  deadline: string;
  status: 'on_track' | 'behind' | 'achieved';
}

export interface AdminMentalHealthSupport {
  id: string;
  adminId: string;
  stressLevel: number;
  workLifeBalance: number;
  supportSessions: number;
  lastCheckIn: string;
  resourcesAccessed: string[];
  flags: MentalHealthFlag[];
}

export interface MentalHealthFlag {
  id: string;
  type: 'high_stress' | 'burnout_risk' | 'work_life_imbalance' | 'isolation';
  severity: 'low' | 'medium' | 'high';
  detectedDate: string;
  addressed: boolean;
  notes?: string;
}

export interface SystemEthicalAI {
  id: string;
  component: string;
  aiModel: string;
  ethicalChecks: EthicalCheck[];
  biasAssessment: BiasAssessment;
  transparencyScore: number;
  accountabilityMeasures: string[];
  lastAudit: string;
}

export interface EthicalCheck {
  id: string;
  check: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  mitigation?: string;
}

export interface BiasAssessment {
  id: string;
  assessmentDate: string;
  biasDetected: boolean;
  biasTypes: string[];
  severity: 'low' | 'medium' | 'high';
  mitigationPlan: string;
}

export interface AdminFutureOfWork {
  id: string;
  adminId: string;
  remoteWorkReadiness: number;
  digitalLiteracy: number;
  adaptabilityScore: number;
  innovationContribution: number;
  crossFunctionalSkills: string[];
  careerDevelopmentPlan: CareerMilestone[];
}

export interface CareerMilestone {
  id: string;
  milestone: string;
  targetDate: string;
  status: 'planned' | 'in_progress' | 'achieved';
  skillsRequired: string[];
  resources: string[];
}

export interface SystemQuantumReadiness {
  id: string;
  component: string;
  quantumVulnerability: number;
  migrationPlan: QuantumMigrationStep[];
  quantumResistantAlgorithms: string[];
  timeline: string;
  budget: number;
  status: 'assessing' | 'planning' | 'implementing' | 'complete';
}

export interface QuantumMigrationStep {
  id: string;
  step: string;
  priority: 'low' | 'medium' | 'high';
  complexity: 'low' | 'medium' | 'high';
  timeline: string;
  dependencies: string[];
}

export interface AdminHolographicInterface {
  id: string;
  adminId: string;
  deviceId: string;
  hologramSettings: HologramSettings;
  gestureControls: boolean;
  voiceCommands: boolean;
  lastCalibration: string;
  usageStats: HologramUsageStats;
}

export interface HologramSettings {
  resolution: string;
  colorDepth: string;
  refreshRate: number;
  projectionDistance: number;
  ambientLighting: boolean;
  multiUserSupport: boolean;
}

export interface HologramUsageStats {
  totalSessions: number;
  averageSessionTime: number;
  mostUsedFeatures: string[];
  gestureAccuracy: number;
  voiceRecognitionRate: number;
}

export interface SystemNeuralNetwork {
  id: string;
  networkName: string;
  type: 'predictive' | 'anomaly_detection' | 'optimization' | 'natural_language';
  status: 'training' | 'active' | 'maintenance' | 'error';
  accuracy: number;
  lastTrained: string;
  dataSources: string[];
  ethicalCompliance: boolean;
  performanceMetrics: NeuralPerformanceMetric[];
}

export interface NeuralPerformanceMetric {
  id: string;
  metric: string;
  value: number;
  target: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface AdminConsciousnessExpansion {
  id: string;
  adminId: string;
  consciousnessLevel: number;
  awarenessDomains: string[];
  intuitionAccuracy: number;
  creativeProblemSolving: number;
  holisticUnderstanding: number;
  universalConnection: number;
  enlightenmentDate?: string;
}

export interface SystemUniversalHarmony {
  id: string;
  component: string;
  harmonyScore: number;
  universalAlignment: number;
  cosmicBalance: number;
  interdimensionalStability: number;
  enlightenmentAchieved: boolean;
  universalConsciousness: number;
}