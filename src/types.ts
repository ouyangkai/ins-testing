export enum UserRole {
  AGENT = 'Agent',
  TEAM_LEADER = 'Team Leader',
  ADMINISTRATOR = 'Administrator',
  OPS = 'Ops',
}

export interface SourceItem {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'url' | 'case';
  status?: 'processing' | 'ready' | 'error';
  progress?: number;
}

export interface ThinkingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

export interface StudioTile {
  id: string;
  title: string;
  type: 'audio' | 'video' | 'note' | 'chart' | 'config' | 'material-gen' | 'report-gen' | 'metric' | 'billing' | 'routing';
  content?: any;
}

export interface SubscriptionPlan {
  id: string;
  name: 'Basic' | 'Professional' | 'Elite' | 'Enterprise';
  price: number;
  tokens: number;
  description: string;
}

export interface ConsumptionHistory {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export interface BillingInfo {
  tier: 'Basic' | 'Professional' | 'Elite' | 'Enterprise';
  tokenQuota: number;
  tokenUsed: number;
  creditsRemaining: number;
  walletBalance: number;
  history: ConsumptionHistory;
}

export interface UsageEvent {
  id: string;
  traceId: string;
  agentId: string;
  model: string;
  cost: number;
  timestamp: string;
  isCached: boolean;
}

export interface ModelRate {
  id: string;
  name: string;
  provider: string;
  inputPrice: number; // per 1M tokens
  outputPrice: number; // per 1M tokens
  weight: number;
}

export interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
  status?: 'normal' | 'warning' | 'critical';
}

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  type: 'financial' | 'risk' | 'asset' | 'comprehensive';
  agents: string[]; // e.g., ["研究智能体", "精算智能体", "撰写智能体"]
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  thinkingSteps?: ThinkingStep[];
  citations?: { id: string; sourceId: string; page: number }[];
}

export interface TrainingSession {
  id: string;
  date: string;
  scenario: string;
  score: number;
  feedback: string;
  status: 'completed' | 'ongoing';
}

export interface TrainingMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'audio' | 'doc';
  updatedAt: string;
  author: string;
}

export interface QuestionBank {
  id: string;
  title: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  updatedAt: string;
}

export interface CrawlerConfig {
  id: string;
  url: string;
  name: string;
  schedule: string; // e.g., "Daily at 02:00"
  status: 'active' | 'paused' | 'error';
  lastRun?: string;
}

export interface PublicKnowledgeItem {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'url' | 'video' | 'audio';
  updatedAt: string;
  category: string;
}

export interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  lastMessage: string;
}

export interface CustomerTag {
  id: string;
  label: string;
  source: 'ai' | 'manual';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  wechatId?: string;
  status: 'active' | 'inactive' | 'pending';
  lastContact: string;
  tags: CustomerTag[];
  chatHistoryIds: string[];
}
