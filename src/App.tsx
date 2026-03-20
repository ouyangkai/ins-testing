import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Users, 
  Settings, 
  Activity, 
  FileText, 
  MessageSquare, 
  Layout, 
  Plus, 
  ChevronRight, 
  Search, 
  Mic, 
  Video, 
  Music, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Menu,
  X,
  Database,
  Lock,
  Zap,
  BarChart3,
  ExternalLink,
  MoreVertical,
  Send,
  Moon,
  Sun,
  Book,
  FileQuestion,
  Download,
  Share2,
  Trash2,
  Tag,
  History,
  Pin,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Settings2,
  Paperclip,
  Sparkles,
  Scissors
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, SourceItem, ThinkingStep, StudioTile, ChatMessage, TrainingSession, TrainingMaterial, QuestionBank, CrawlerConfig, PublicKnowledgeItem, BillingInfo, ModelRate, SubscriptionPlan, ConsumptionHistory, ChatHistory, Customer, CustomerTag } from './types';

// Role-specific icons
const ROLE_ICONS = {
  [UserRole.AGENT]: <Users className="w-5 h-5" />,
  [UserRole.TEAM_LEADER]: <Activity className="w-5 h-5" />,
  [UserRole.ADMINISTRATOR]: <Shield className="w-5 h-5" />,
  [UserRole.OPS]: <Database className="w-5 h-5" />,
};

export default function App() {
  const [role, setRole] = useState<UserRole>(UserRole.AGENT);
  const [tlViewMode, setTlViewMode] = useState<'management' | 'personal'>('management');
  const [tlManagementTab, setTlManagementTab] = useState<'monitoring' | 'materials' | 'questions' | 'resources'>('monitoring');
  const [agentViewMode, setAgentViewMode] = useState<'chat' | 'training'>('chat');
  const [agentTab, setAgentTab] = useState<'chat' | 'knowledge' | 'customers' | 'sessions'>('chat');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    { id: 'h1', title: '关于香港重疾险的咨询', timestamp: '2024-03-18 14:30', lastMessage: '好的，我会再考虑一下。' },
    { id: 'h2', title: '张先生的保单分析', timestamp: '2024-03-17 10:15', lastMessage: '解析完成，请查看报告。' },
    { id: 'h3', title: '优才计划申请流程', timestamp: '2024-03-16 16:45', lastMessage: '需要准备哪些材料？' },
  ]);
  const [customers, setCustomers] = useState<Customer[]>([
    { 
      id: 'c1', 
      name: '张伟', 
      email: 'zhangwei@example.com', 
      phone: '13800138000', 
      status: 'active', 
      lastContact: '2024-03-18',
      wechatId: 'wx_zhang123',
      tags: [
        { id: 't1', label: '高净值客户', source: 'ai' },
        { id: 't2', label: '关注重疾险', source: 'ai' },
        { id: 't3', label: '性格谨慎', source: 'manual' },
      ],
      chatHistoryIds: ['h1', 'h2']
    },
    { 
      id: 'c2', 
      name: '李娜', 
      email: 'lina@example.com', 
      phone: '13900139000', 
      wechatId: 'nana_li',
      status: 'pending', 
      lastContact: '2024-03-15',
      tags: [
        { id: 't4', label: '潜在优才', source: 'ai' },
        { id: 't5', label: '咨询频繁', source: 'ai' },
      ],
      chatHistoryIds: ['h3']
    },
    { 
      id: 'c3', 
      name: '王芳', 
      email: 'wangfang@example.com', 
      phone: '13700137000', 
      wechatId: 'wf_888',
      status: 'active', 
      lastContact: '2024-03-10',
      tags: [
        { id: 't6', label: '老客户', source: 'manual' },
      ],
      chatHistoryIds: []
    },
  ]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [customerToDeleteId, setCustomerToDeleteId] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    wechatId: '',
    status: 'active' as 'active' | 'pending' | 'inactive',
    chatHistoryIds: [] as string[]
  });
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingChatTitle, setEditingChatTitle] = useState('');
  const [agentTrainingTab, setAgentTrainingTab] = useState<'simulation' | 'test'>('simulation');
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeThinkingSteps, setActiveThinkingSteps] = useState<ThinkingStep[]>([]);
  const [studioTiles, setStudioTiles] = useState<StudioTile[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([
    { id: '1', date: '2024-03-15', scenario: '高净值客户异议处理', score: 92, feedback: '表达流畅，逻辑严密，但在税务细节上可更精准。', status: 'completed' },
    { id: '2', date: '2024-03-16', scenario: '重疾险条款深度解析', score: 85, feedback: '对核心条款理解到位，但需加强对等待期的解释。', status: 'completed' },
  ]);
  const [teamMaterials, setTeamMaterials] = useState<TrainingMaterial[]>([
    { id: 'm1', title: '2024 香港保险市场趋势分析', type: 'pdf', updatedAt: '2024-03-10', author: '组长' },
    { id: 'm2', title: '高净值客户沟通话术 (视频)', type: 'video', updatedAt: '2024-03-12', author: '组长' },
    { id: 'm3', title: '重疾险条款对比手册', type: 'doc', updatedAt: '2024-03-14', author: 'AI 生成' },
  ]);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([
    { id: 'q1', title: '基础合规知识测试', questionCount: 20, difficulty: 'easy', updatedAt: '2024-03-01' },
    { id: 'q2', title: '进阶异议处理实战', questionCount: 15, difficulty: 'hard', updatedAt: '2024-03-05' },
  ]);
  const [opsTab, setOpsTab] = useState<'crawler' | 'knowledge'>('crawler');
  const [opsViewMode, setOpsViewMode] = useState<'chat' | 'dashboard'>('dashboard');
  const [adminViewMode, setAdminViewMode] = useState<'chat' | 'dashboard'>('dashboard');
  const [adminTab, setAdminTab] = useState<'billing' | 'models' | 'subscription'>('billing');
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    tier: 'Professional',
    tokenQuota: 50000000,
    tokenUsed: 12500000,
    creditsRemaining: 3450,
    walletBalance: 125.50,
    history: {
      daily: 1250000,
      weekly: 8500000,
      monthly: 35000000,
      yearly: 420000000
    }
  });
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([
    { id: 'p1', name: 'Basic', price: 200, tokens: 10000000, description: '基础 Agent 访问, 基础 RAG 检索' },
    { id: 'p2', name: 'Professional', price: 1000, tokens: 50000000, description: '专家级 Agent, RAG 加速, 标准媒体生成' },
    { id: 'p3', name: 'Elite', price: 3500, tokens: 200000000, description: '全量 Agent, 自定义知识库, 高级视频生成' },
    { id: 'p4', name: 'Enterprise', price: 0, tokens: 0, description: '跨实体管理, VPC 安全, 定制 SLA' },
  ]);
  const [modelRates, setModelRates] = useState<ModelRate[]>([
    { id: 'm1', name: 'GPT-4o', provider: 'OpenAI', inputPrice: 5.0, outputPrice: 15.0, weight: 0.8 },
    { id: 'm2', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', inputPrice: 3.0, outputPrice: 15.0, weight: 0.7 },
    { id: 'm3', name: 'Gemini 2.5 Flash', provider: 'Google', inputPrice: 0.1, outputPrice: 0.4, weight: 0.9 },
  ]);
  const [selectedModel, setSelectedModel] = useState<string>('m1');
  const [isAddCrawlerModalOpen, setIsAddCrawlerModalOpen] = useState(false);
  const [crawlerForm, setCrawlerForm] = useState({
    name: '',
    url: '',
    frequency: '24小时'
  });
  const [crawlerConfigs, setCrawlerConfigs] = useState<CrawlerConfig[]>([
    { id: 'c1', name: '香港特区政府 (IRD)', url: 'https://www.ird.gov.hk', schedule: '每日 02:00', status: 'active', lastRun: '2024-03-17 02:00' },
    { id: 'c2', name: '保险业监管局 (IA)', url: 'https://www.ia.org.hk', schedule: '每 4 小时', status: 'active', lastRun: '2024-03-18 08:00' },
    { id: 'c3', name: '入境事务处 (ImmD)', url: 'https://www.immd.gov.hk', schedule: '每周一 01:00', status: 'paused' },
  ]);
  const [publicKnowledge, setPublicKnowledge] = useState<PublicKnowledgeItem[]>([
    { id: 'pk1', title: '2024 全球宏观经济展望', type: 'pdf', updatedAt: '2024-03-15', category: '市场研究' },
    { id: 'pk2', title: '保险产品合规销售指引 (2.0)', type: 'doc', updatedAt: '2024-03-10', category: '合规政策' },
    { id: 'pk3', title: '高净值客户资产配置案例集', type: 'video', updatedAt: '2024-03-12', category: '实战案例' },
  ]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial data based on role and view mode
    loadRoleData(role, tlViewMode);
  }, [role, tlViewMode]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeThinkingSteps]);

  const loadRoleData = (selectedRole: UserRole, viewMode: 'management' | 'personal') => {
    // Determine effective role for data loading
    const effectiveRole = (selectedRole === UserRole.TEAM_LEADER && viewMode === 'personal') 
      ? UserRole.AGENT 
      : selectedRole;

    // Mock initial data
    const initialSources: Record<UserRole, SourceItem[]> = {
      [UserRole.AGENT]: [
        { id: '1', title: '客户 PDF 保单 (张先生)', type: 'pdf', status: 'ready' },
        { id: '2', title: '体检报告_2024.pdf', type: 'pdf', status: 'ready' },
        { id: '3', title: '香港优才申请文档.docx', type: 'doc', status: 'processing', progress: 65 },
      ],
      [UserRole.TEAM_LEADER]: [
        { id: 't1', title: '团队公库: 成功案例 A', type: 'case', status: 'ready' },
        { id: 't2', title: '异议话术锦囊.pdf', type: 'pdf', status: 'ready' },
      ],
      [UserRole.ADMINISTRATOR]: [
        { id: 'a1', title: 'GPT-4o 配置', type: 'url', status: 'ready' },
        { id: 'a2', title: 'Claude 3.5 配置', type: 'url', status: 'ready' },
      ],
      [UserRole.OPS]: [
        { id: 'o1', title: 'IRD 官网监测', type: 'url', status: 'ready' },
        { id: 'o2', title: 'IA 政策更新流', type: 'url', status: 'ready' },
      ],
    };

    const initialTiles: Record<UserRole, StudioTile[]> = {
      [UserRole.AGENT]: [
        { id: 's1', title: 'Audio Overview', type: 'audio' },
        { id: 's2', title: 'Video Explainer', type: 'video' },
        { id: 's5', title: '方案报表创作 (多智能体协作)', type: 'report-gen' },
        { id: 's3', title: 'PHS 个人成长 (专业健康分)', type: 'metric' },
        { id: 's4', title: 'AI 模拟对练', type: 'audio' },
      ],
      [UserRole.TEAM_LEADER]: [
        { id: 'st4', title: 'AIDI 团队效能 (AI 依赖指数)', type: 'metric' },
        { id: 'st1', title: '行为热力监控 (Sandler 漏斗)', type: 'chart' },
        { id: 'st2', title: '成功案例 Studio', type: 'note' },
        { id: 'st3', title: '资料生成 (音/视)', type: 'material-gen' },
      ],
      [UserRole.ADMINISTRATOR]: [
        { id: 'sa1', title: 'API 监控', type: 'chart' },
        { id: 'sa2', title: '权限矩阵', type: 'config' },
      ],
      [UserRole.OPS]: [
        { id: 'so1', title: 'WeKnora 语义预览', type: 'note' },
        { id: 'so2', title: '知识质量报表', type: 'chart' },
        { id: 'so3', title: '公共知识生成 (音/视)', type: 'material-gen' },
      ],
    };

    setSources(initialSources[effectiveRole]);
    setStudioTiles(initialTiles[effectiveRole]);
    
    const welcomeText = (selectedRole === UserRole.TEAM_LEADER)
      ? `您好，组长。当前处于${viewMode === 'management' ? '管理模式' : '个人业务模式'}。您可以实时监控团队 AIDI 指数及合规风险。`
      : `您好，我是桥思 AI。作为全方位财富管理顾问，我已为您准备好了相关的资源和工具，助您从“产品推销”向“专业顾问”转型。`;

    setMessages([{
      id: 'welcome',
      role: 'assistant',
      text: welcomeText
    }]);
  };

  const startTraining = (scenario: string) => {
    setCurrentScenario(scenario);
    setIsTrainingActive(true);
    setAgentViewMode('chat');
    setMessages([{
      id: 'sim-start',
      role: 'assistant',
      text: `[模拟开始] 场景：${scenario}\n\n您好，我是您的客户。我最近在考虑配置一份保险，但对目前的方案还有些疑虑。请开始您的讲解。`
    }]);
  };

  const loadChat = (chatId: string) => {
    const chat = chatHistory.find(h => h.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages([
        { id: 'welcome', role: 'assistant', text: `已加载历史对话：${chat.title}\n\n最后一条消息：${chat.lastMessage}` },
        { id: 'history-1', role: 'user', text: '这是之前的对话记录片段...' },
        { id: 'history-2', role: 'assistant', text: '好的，我已为您调取了该会话的上下文。请问我们从哪里继续？' }
      ]);
    }
  };

  const startNewChat = () => {
    const newId = `h${Date.now()}`;
    const newChat: ChatHistory = {
      id: newId,
      title: '新对话',
      timestamp: new Date().toLocaleString(),
      lastMessage: ''
    };
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newId);
    setAgentTab('chat');
    setAgentViewMode('chat');
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      text: '您好，我是桥思 AI。新会话已开启，请问有什么可以帮您？'
    }]);
  };

  const addTag = (customerId: string, label: string) => {
    if (!label.trim()) return;
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          tags: [...c.tags, { id: `t${Date.now()}`, label: label.trim(), source: 'manual' }]
        };
      }
      return c;
    }));
    setNewTagLabel('');
  };

  const removeTag = (customerId: string, tagId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          tags: c.tags.filter(t => t.id !== tagId)
        };
      }
      return c;
    }));
  };

  const deleteCustomer = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    // Delete associated chat history
    const historyIdsToDelete = customer.chatHistoryIds;
    setChatHistory(prev => prev.filter(h => !historyIdsToDelete.includes(h.id)));

    // If current chat is being deleted, clear messages
    if (currentChatId && historyIdsToDelete.includes(currentChatId)) {
      setMessages([]);
      setCurrentChatId(null);
    }

    // Delete customer
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    if (selectedCustomerId === customerId) {
      setSelectedCustomerId(null);
    }
  };

  const openCustomerModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setCustomerForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        wechatId: customer.wechatId || '',
        status: customer.status,
        chatHistoryIds: customer.chatHistoryIds
      });
    } else {
      setEditingCustomer(null);
      setCustomerForm({
        name: '',
        email: '',
        phone: '',
        wechatId: '',
        status: 'active',
        chatHistoryIds: []
      });
    }
    setIsCustomerModalOpen(true);
  };

  const saveCustomer = () => {
    if (!customerForm.name.trim()) return;

    if (editingCustomer) {
      // Update
      setCustomers(prev => prev.map(c => {
        if (c.id === editingCustomer.id) {
          // If chat histories changed, trigger AI persona generation again
          const hasChatHistoryChanged = JSON.stringify(c.chatHistoryIds) !== JSON.stringify(customerForm.chatHistoryIds);
          const aiTags = hasChatHistoryChanged && customerForm.chatHistoryIds.length > 0 ? [
            { id: `t_ai_${Date.now()}_1`, label: 'AI 分析: 意向更新', source: 'ai' },
            { id: `t_ai_${Date.now()}_2`, label: 'AI 分析: 关注点偏移', source: 'ai' }
          ] : c.tags.filter(t => t.source === 'ai');

          return {
            ...c,
            ...customerForm,
            tags: [...c.tags.filter(t => t.source === 'manual'), ...aiTags]
          };
        }
        return c;
      }));
    } else {
      // Create
      const newId = `c${Date.now()}`;
      
      // Mock AI Persona Generation based on chat history
      const aiTags: CustomerTag[] = customerForm.chatHistoryIds.length > 0 ? [
        { id: `t_ai_${Date.now()}_1`, label: 'AI 分析: 意向强烈', source: 'ai' },
        { id: `t_ai_${Date.now()}_2`, label: 'AI 分析: 关注分红', source: 'ai' }
      ] : [];

      const newCustomer: Customer = {
        id: newId,
        ...customerForm,
        lastContact: new Date().toISOString().split('T')[0],
        tags: aiTags,
        chatHistoryIds: customerForm.chatHistoryIds
      };
      setCustomers(prev => [newCustomer, ...prev]);
    }
    setIsCustomerModalOpen(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Simulate Thinking UX
    const steps: ThinkingStep[] = [
      { id: '1', label: 'WeKnora 检索相关条例...', status: 'active' },
      { id: '2', label: '多智能体协作分析 (研究/精算)...', status: 'pending' },
      { id: '3', label: '审计智能体合规性检查...', status: 'pending' },
      { id: '4', label: '生成结构化分析建议...', status: 'pending' },
    ];
    setActiveThinkingSteps(steps);

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 1000));
      setActiveThinkingSteps(prev => prev.map((s, idx) => {
        if (idx === i) return { ...s, status: 'completed' };
        if (idx === i + 1) return { ...s, status: 'active' };
        return s;
      }));
    }

    await new Promise(r => setTimeout(r, 500));
    setIsThinking(false);
    setActiveThinkingSteps([]);
    
    const aiMsg: ChatMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'assistant', 
      text: `根据您的询问，我已通过 WeKnora 深度解析了相关文档。以下是针对该情况的对比分析：\n\n1. **税务豁免**：根据 IRD 2026 最新条例，A 产品在特定条件下具有更高的豁免额度 [1]。\n2. **保障范围**：B 产品在重疾保障方面更为全面 [2]。\n\n建议您可以生成一份 Audio Overview 供客户参考。`,
      citations: [
        { id: 'c1', sourceId: '1', page: 12 },
        { id: 'c2', sourceId: '2', page: 5 }
      ]
    };
    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <div className="triple-pane-container">
      {/* Sidebar / Role Switcher */}
      <div className={`pane-left ${!isSidebarOpen ? 'w-16' : 'w-72'} border-r border-app-border shadow-xl shadow-black/20`}>
        <div className="p-4 border-b border-app-border flex items-center justify-between bg-app-pane backdrop-blur-md">
          <div className={`flex items-center gap-2 overflow-hidden ${!isSidebarOpen ? 'hidden' : ''}`}>
            <div className="w-8 h-8 bg-app-accent rounded-lg flex items-center justify-center text-app-bg font-bold shadow-lg shadow-app-accent/20">B</div>
            <span className="font-bold text-lg tracking-tight text-app-text">Bridge & Counsel</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-app-bg rounded-lg transition-colors text-app-text-muted">
            {isSidebarOpen ? <Menu className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-app-pane/50">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between px-2">
            <label className={`text-[10px] font-bold uppercase tracking-widest text-app-text-muted ${!isSidebarOpen ? 'hidden' : ''}`}>
              界面风格
            </label>
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 bg-app-bg rounded-xl text-app-text hover:bg-app-border transition-all shadow-sm"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>

          {/* Credit & Token Dashboard (Agent & Team Leader) */}
          {(role === UserRole.AGENT || role === UserRole.TEAM_LEADER) && isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-app-bg/50 rounded-2xl border border-app-border space-y-4"
            >
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-app-text-muted">信用分与 Token 看板</label>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${billingInfo.creditsRemaining < 500 ? 'bg-red-500/20 text-red-400' : 'bg-app-accent/20 text-app-accent'}`}>
                  {billingInfo.tier}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-app-text-muted">Token 额度</span>
                    <span className="text-app-text font-medium">{(billingInfo.tokenUsed / 1000000).toFixed(1)}M / {(billingInfo.tokenQuota / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="h-1 w-full bg-app-bg rounded-full overflow-hidden">
                    <div className="h-full bg-app-accent" style={{ width: `${(billingInfo.tokenUsed / billingInfo.tokenQuota) * 100}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-app-text-muted">弹性信用分 (Credits)</span>
                    <span className="text-app-text font-bold text-app-accent">{billingInfo.creditsRemaining}</span>
                  </div>
                  <div className="h-1 w-full bg-app-bg rounded-full overflow-hidden">
                    <div className={`h-full ${billingInfo.creditsRemaining < 500 ? 'bg-red-500' : 'bg-app-accent'}`} style={{ width: `${(billingInfo.creditsRemaining / 5000) * 100}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-app-border">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-app-text-muted">钱包余额</span>
                    <span className="text-sm font-bold text-app-text">${billingInfo.walletBalance.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => setShowRechargeModal(true)}
                    className="px-3 py-1.5 bg-app-accent text-app-bg text-[10px] font-bold rounded-lg hover:scale-105 transition-all"
                  >
                    充值 / 加速
                  </button>
                </div>
              </div>

              {billingInfo.creditsRemaining < 500 && (
                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 text-red-400" />
                  <p className="text-[9px] text-red-400 leading-tight">额度低于 15%，请及时充值或联系管理员优化资源分配。</p>
                </div>
              )}
            </motion.div>
          )}

          {/* User Login Simulation (Dropdown) */}
          <div className="space-y-2">
            <label className={`text-[10px] font-bold uppercase tracking-widest text-app-text-muted ${!isSidebarOpen ? 'hidden' : ''}`}>
              模拟用户登录
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className={`w-full appearance-none bg-app-bg border border-app-border rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-app-accent/10 outline-none cursor-pointer transition-all text-app-text ${!isSidebarOpen ? 'px-2' : 'pl-10 pr-10'}`}
              >
                {Object.values(UserRole).map((r) => (
                  <option key={r} value={r} className="bg-app-pane">{r}</option>
                ))}
              </select>
              <div className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-accent ${!isSidebarOpen ? 'hidden' : ''}`}>
                {ROLE_ICONS[role]}
              </div>
              <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-text-muted ${!isSidebarOpen ? 'hidden' : ''}`}>
                <ChevronRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>

          {/* Team Leader View Mode Toggle */}
          {role === UserRole.TEAM_LEADER && isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-1 bg-app-bg rounded-xl flex gap-1"
            >
              <button
                onClick={() => setTlViewMode('management')}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                  tlViewMode === 'management' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted hover:text-app-text'
                }`}
              >
                管理模式
              </button>
              <button
                onClick={() => setTlViewMode('personal')}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                  tlViewMode === 'personal' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted hover:text-app-text'
                }`}
              >
                个人业务
              </button>
            </motion.div>
          )}

          {/* Sidebar Content Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={`text-[10px] font-bold uppercase tracking-widest text-app-text-muted ${!isSidebarOpen ? 'hidden' : ''}`}>
                {(role === UserRole.AGENT || (role === UserRole.TEAM_LEADER && tlViewMode === 'personal')) ? '最近对话历史' : 
                 (role === UserRole.TEAM_LEADER && tlViewMode === 'management') ? '团队知识资产' : 
                 role === UserRole.ADMINISTRATOR ? '订阅用户概览' : '爬虫与数据源'}
              </label>
              <div className="flex items-center gap-1">
                {(role === UserRole.AGENT || (role === UserRole.TEAM_LEADER && tlViewMode === 'personal')) && isSidebarOpen && (
                  <button 
                    onClick={() => setAgentTab('sessions')}
                    className="p-1 hover:bg-app-bg rounded text-app-text-muted"
                    title="会话管理"
                  >
                    <Layout className="w-3.5 h-3.5" />
                  </button>
                )}
                {(role === UserRole.AGENT || (role === UserRole.TEAM_LEADER && tlViewMode === 'personal')) && isSidebarOpen && (
                  <button 
                    onClick={startNewChat}
                    className="p-1 hover:bg-app-bg rounded text-app-text-muted"
                    title="开启新对话"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
                {role !== UserRole.ADMINISTRATOR && role !== UserRole.AGENT && !(role === UserRole.TEAM_LEADER && tlViewMode === 'personal') && (
                  <button className="p-1 hover:bg-app-bg rounded text-app-text-muted">
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Administrator Sidebar: Subscription Statistics */}
            {role === UserRole.ADMINISTRATOR && isSidebarOpen && (
              <div className="space-y-3">
                <div className="p-3 bg-app-bg/40 rounded-xl border border-app-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-app-text-muted font-bold">活跃用户总数</span>
                    <span className="text-xs font-bold text-app-accent">1,284</span>
                  </div>
                  <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-app-border">
                    <div className="bg-emerald-500 w-[60%]" />
                    <div className="bg-app-accent w-[30%]" />
                    <div className="bg-amber-500 w-[10%]" />
                  </div>
                  <div className="mt-2 flex justify-between text-[8px] text-app-text-muted">
                    <span>Pro: 60%</span>
                    <span>Elite: 30%</span>
                    <span>Basic: 10%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-app-bg/40 rounded-xl border border-app-border/50">
                    <p className="text-[8px] text-app-text-muted uppercase font-bold">本月新增</p>
                    <p className="text-sm font-bold text-emerald-500">+124</p>
                  </div>
                  <div className="p-2 bg-app-bg/40 rounded-xl border border-app-border/50">
                    <p className="text-[8px] text-app-text-muted uppercase font-bold">流失率</p>
                    <p className="text-sm font-bold text-red-400">1.2%</p>
                  </div>
                </div>

                <div className="p-3 bg-app-bg/40 rounded-xl border border-app-border/50">
                  <p className="text-[10px] text-app-text-muted font-bold mb-2">营收趋势 (ARR)</p>
                  <div className="flex items-end gap-1 h-12">
                    {[30, 45, 35, 60, 55, 80, 75].map((h, i) => (
                      <div key={i} className="flex-1 bg-app-accent/30 rounded-t-sm hover:bg-app-accent transition-all" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Agent Sidebar: Chat History */}
            {(role === UserRole.AGENT || (role === UserRole.TEAM_LEADER && tlViewMode === 'personal')) && (
              <div className="space-y-2">
                {chatHistory.map(chat => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={chat.id}
                    className={`group relative flex items-start gap-3 p-3 rounded-xl border border-transparent transition-all cursor-pointer ${
                      !isSidebarOpen ? 'justify-center' : 'bg-app-bg/40 hover:bg-app-bg hover:border-app-accent/20 hover:shadow-sm'
                    }`}
                    onClick={() => {
                      if (editingChatId !== chat.id) {
                        setAgentTab('chat');
                        setAgentViewMode('chat');
                        loadChat(chat.id);
                        setSelectedCustomerId(null);
                      }
                    }}
                  >
                    <div className="mt-0.5">
                      <MessageSquare className="w-4 h-4 text-app-accent" />
                    </div>
                    {isSidebarOpen && (
                      <div className="flex-1 min-w-0">
                        {editingChatId === chat.id ? (
                          <input
                            autoFocus
                            className="w-full bg-transparent text-xs font-medium border-b border-app-accent outline-none text-app-text"
                            value={editingChatTitle}
                            onChange={(e) => setEditingChatTitle(e.target.value)}
                            onBlur={() => {
                              setChatHistory(prev => prev.map(h => h.id === chat.id ? { ...h, title: editingChatTitle } : h));
                              setEditingChatId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setChatHistory(prev => prev.map(h => h.id === chat.id ? { ...h, title: editingChatTitle } : h));
                                setEditingChatId(null);
                              }
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium truncate text-app-text flex-1">{chat.title}</p>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingChatId(chat.id);
                                  setEditingChatTitle(chat.title);
                                }}
                                className="p-1 hover:bg-app-pane rounded text-app-text-muted"
                              >
                                <Settings className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setChatHistory(prev => prev.filter(h => h.id !== chat.id));
                                }}
                                className="p-1 hover:bg-app-pane rounded text-app-text-muted"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                        <p className="text-[10px] text-app-text-muted mt-1 truncate">
                          {chat.timestamp}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Knowledge Sources / Configs (Hidden for Admin/Agent in Sidebar as requested) */}
            {role !== UserRole.ADMINISTRATOR && role !== UserRole.AGENT && !(role === UserRole.TEAM_LEADER && tlViewMode === 'personal') && (
              <div className="space-y-2">
                {sources.map(source => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={source.id}
                    className={`group relative flex items-start gap-3 p-3 rounded-xl border border-transparent transition-all cursor-pointer ${
                      !isSidebarOpen ? 'justify-center' : 'bg-app-bg/40 hover:bg-app-bg hover:border-app-accent/20 hover:shadow-sm'
                    }`}
                  >
                    <div className="mt-0.5">
                      {source.type === 'pdf' && <FileText className="w-4 h-4 text-red-500" />}
                      {source.type === 'doc' && <FileText className="w-4 h-4 text-blue-500" />}
                      {source.type === 'url' && <Zap className="w-4 h-4 text-amber-500" />}
                      {source.type === 'case' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    {isSidebarOpen && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate text-app-text">{source.title}</p>
                          {source.status === 'processing' && (
                            <div className="mt-1.5 w-full bg-app-border rounded-full h-1">
                              <div className="bg-app-accent h-1 rounded-full" style={{ width: `${source.progress}%` }}></div>
                            </div>
                          )}
                          <p className="text-[10px] text-app-text-muted mt-1">
                            {source.status === 'ready' ? 'WeKnora 已解析' : `正在提取语义 (${source.progress}%)`}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle Pane: Interaction & Thinking */}
      <div className="pane-middle">
        {/* Header */}
        <header className="h-16 bg-app-pane border-b border-app-border px-6 flex items-center justify-between shrink-0 transition-all duration-300 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-app-text">
              {isTrainingActive ? `模拟对练: ${currentScenario}` : 
               role === UserRole.AGENT ? (agentViewMode === 'chat' ? '智能顾问空间' : 'AI 模拟对练中心') : 
               role === UserRole.TEAM_LEADER ? (tlViewMode === 'personal' ? '组长对话空间' : '管理与教练中心') : 
               role === UserRole.ADMINISTRATOR ? (adminViewMode === 'chat' ? '合规对话空间' : '治理与合规沙盒') : 
               (opsViewMode === 'chat' ? '运营对话空间' : '知识管道与 ETL 监控')}
            </h2>
            {isTrainingActive && (
              <button 
                onClick={() => {
                  setIsTrainingActive(false);
                  setAgentViewMode('training');
                }}
                className="px-3 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-lg border border-red-500/20"
              >
                结束对练并评分
              </button>
            )}
            {selectedCustomerId && agentTab === 'chat' && (
              <button 
                onClick={() => setAgentTab('customers')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-app-bg hover:bg-app-border text-app-text-muted hover:text-app-text rounded-lg transition-all border border-app-border text-[10px] font-bold"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                返回客户详情
              </button>
            )}
              {role === UserRole.AGENT && !isTrainingActive && (
                <div className="flex bg-app-bg p-1 rounded-lg">
                  <button 
                    onClick={() => { setAgentViewMode('chat'); setAgentTab('chat'); setSelectedCustomerId(null); }}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${agentViewMode === 'chat' && agentTab === 'chat' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                  >
                    对话
                  </button>
                  <button 
                    onClick={() => { setAgentViewMode('chat'); setAgentTab('customers'); }}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${agentViewMode === 'chat' && agentTab === 'customers' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                  >
                    客户
                  </button>
                  <button 
                    onClick={() => { setAgentViewMode('chat'); setAgentTab('knowledge'); }}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${agentViewMode === 'chat' && agentTab === 'knowledge' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                  >
                    知识库
                  </button>
                  <button 
                    onClick={() => setAgentViewMode('training')}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${agentViewMode === 'training' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                  >
                    对练
                  </button>
                </div>
              )}
              {role === UserRole.TEAM_LEADER && (
                <div className="flex bg-app-bg p-1 rounded-lg">
                  <button 
                    onClick={() => { setTlViewMode('personal'); setAgentTab('chat'); setAgentViewMode('chat'); setSelectedCustomerId(null); }}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${tlViewMode === 'personal' && agentTab === 'chat' && agentViewMode === 'chat' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                  >
                    对话
                  </button>
                  {tlViewMode === 'personal' && (
                    <>
                      <button 
                        onClick={() => { setAgentTab('customers'); setAgentViewMode('chat'); }}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${agentTab === 'customers' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                      >
                        客户
                      </button>
                      <button 
                        onClick={() => { setAgentTab('knowledge'); setAgentViewMode('chat'); }}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${agentTab === 'knowledge' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                      >
                        知识库
                      </button>
                      <button 
                        onClick={() => setAgentViewMode('training')}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${agentViewMode === 'training' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                      >
                        对练
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => setTlViewMode('management')}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${tlViewMode === 'management' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                  >
                    管理
                  </button>
                </div>
              )}
              {role === UserRole.ADMINISTRATOR && (
                <div className="flex bg-app-bg p-1 rounded-lg">
                  <button 
                    onClick={() => setAdminViewMode('chat')}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${adminViewMode === 'chat' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                  >
                    对话
                  </button>
                  <button 
                    onClick={() => setAdminViewMode('dashboard')}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${adminViewMode === 'dashboard' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                  >
                    沙盒
                  </button>
                </div>
              )}
              {role === UserRole.OPS && (
                <div className="flex bg-app-bg p-1 rounded-lg">
                  <button 
                    onClick={() => setOpsViewMode('chat')}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${opsViewMode === 'chat' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                  >
                    对话
                  </button>
                  <button 
                    onClick={() => setOpsViewMode('dashboard')}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${opsViewMode === 'dashboard' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                  >
                    工作台
                  </button>
                </div>
              )}
            <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Guardian Active</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-app-text-muted" />
              <input 
                type="text" 
                placeholder="搜索..." 
                className="pl-9 pr-4 py-1.5 bg-app-bg border border-app-border rounded-full text-xs focus:ring-2 focus:ring-app-accent/10 text-app-text w-48 shadow-inner"
              />
            </div>
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 hover:bg-app-bg rounded-full text-app-text-muted transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button className="p-2 hover:bg-app-bg rounded-full text-app-text-muted transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Role Specific Dashboard Overlays */}
        {((role === UserRole.AGENT && agentViewMode === 'training') || (role === UserRole.TEAM_LEADER && tlViewMode === 'personal' && agentViewMode === 'training')) && (
          <div className="absolute inset-0 z-10 bg-app-bg/95 backdrop-blur-md p-8 overflow-y-auto transition-all duration-300">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <h3 className="text-lg font-bold text-app-text">AI 模拟对练中心</h3>
                  <div className="flex bg-app-bg p-1 rounded-xl shadow-inner">
                    <button 
                      onClick={() => setAgentTrainingTab('simulation')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${agentTrainingTab === 'simulation' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted hover:text-app-text'}`}
                    >
                      模拟对练
                    </button>
                    <button 
                      onClick={() => setAgentTrainingTab('test')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${agentTrainingTab === 'test' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted hover:text-app-text'}`}
                    >
                      AI 知识测试
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setAgentViewMode('chat')}
                    className="p-2 hover:bg-app-pane rounded-full text-app-text-muted transition-colors"
                    title="返回工作模式"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {agentTrainingTab === 'simulation' ? (
                <>
                  {/* Stats Summary */}
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: '累计对练', value: '24 次', icon: <Activity className="w-4 h-4" /> },
                      { label: '平均得分', value: '89.5', icon: <BarChart3 className="w-4 h-4" /> },
                      { label: '最高得分', value: '98', icon: <CheckCircle2 className="w-4 h-4" /> },
                      { label: '待提升项', value: '3 个', icon: <AlertCircle className="w-4 h-4" /> },
                    ].map((stat, i) => (
                      <div key={i} className="bg-app-pane p-4 rounded-xl border border-app-border shadow-sm">
                        <div className="text-app-accent mb-2">{stat.icon}</div>
                        <p className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest">{stat.label}</p>
                        <p className="text-xl font-bold text-app-text">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-app-text">对练历史记录</h4>
                    <button 
                      onClick={() => startTraining('高净值客户异议处理')}
                      className="px-4 py-2 bg-app-accent text-app-bg text-xs font-bold rounded-xl shadow-lg shadow-app-accent/20 hover:scale-105 transition-all"
                    >
                      开始新对练
                    </button>
                  </div>

                  {/* History Table */}
                  <div className="bg-app-pane rounded-2xl shadow-sm border border-app-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-app-bg text-[10px] font-bold text-app-text-muted uppercase tracking-widest">
                          <tr>
                            <th className="px-6 py-3">日期</th>
                            <th className="px-6 py-3">对练场景</th>
                            <th className="px-6 py-3">得分</th>
                            <th className="px-6 py-3">状态</th>
                            <th className="px-6 py-3 text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-app-border">
                          {trainingSessions.map(session => (
                            <tr key={session.id} className="hover:bg-app-bg transition-colors">
                              <td className="px-6 py-4 text-xs text-app-text">{session.date}</td>
                              <td className="px-6 py-4 text-xs font-medium text-app-text">{session.scenario}</td>
                              <td className="px-6 py-4">
                                <span className={`text-xs font-bold ${session.score >= 90 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                  {session.score}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full">
                                  {session.status === 'completed' ? '已完成' : '进行中'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button className="p-1 hover:bg-app-bg rounded text-app-text-muted">
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Analytics Chart Mockup */}
                  <div className="bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-bold text-app-text">能力维度分析</h4>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-app-accent rounded-full"></div>
                          <span className="text-[10px] font-bold text-app-text-muted">当前水平</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-app-border rounded-full"></div>
                          <span className="text-[10px] font-bold text-app-text-muted">行业基准</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-64 flex items-center justify-center relative">
                      {/* Radar Chart Mockup */}
                      <div className="w-48 h-48 border-2 border-app-border rounded-full flex items-center justify-center">
                        <div className="w-32 h-32 border-2 border-app-border rounded-full flex items-center justify-center">
                          <div className="w-16 h-16 border-2 border-app-border rounded-full"></div>
                        </div>
                        {/* Data Polygon */}
                        <svg className="absolute inset-0 w-full h-full overflow-visible">
                          <polygon 
                            points="150,50 250,100 230,200 150,250 70,200 50,100" 
                            className="fill-app-accent/20 stroke-app-accent stroke-2"
                            transform="translate(70, 0)"
                          />
                        </svg>
                      </div>
                      {/* Labels */}
                      <span className="absolute top-0 text-[10px] font-bold text-app-text-muted uppercase">专业知识</span>
                      <span className="absolute right-0 top-1/2 text-[10px] font-bold text-app-text-muted uppercase rotate-90 translate-x-8">沟通技巧</span>
                      <span className="absolute bottom-0 text-[10px] font-bold text-app-text-muted uppercase">异议处理</span>
                      <span className="absolute left-0 top-1/2 text-[10px] font-bold text-app-text-muted uppercase -rotate-90 -translate-x-8">合规意识</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-app-text">可用知识测试题库</h4>
                    <p className="text-[10px] text-app-text-muted uppercase font-bold tracking-widest">共 {questionBanks.length} 个题库</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {questionBanks.map(bank => (
                      <div key={bank.id} className="bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-app-accent-soft text-app-accent rounded-xl">
                            <FileQuestion className="w-6 h-6" />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                            bank.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-500' :
                            bank.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {bank.difficulty.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-app-text">{bank.title}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-[10px] text-app-text-muted">题目数量: {bank.questionCount}</p>
                          <p className="text-[10px] text-app-text-muted">更新于: {bank.updatedAt}</p>
                        </div>
                        <div className="mt-6">
                          <button className="w-full py-2 bg-app-accent text-app-bg text-xs font-bold rounded-lg hover:bg-app-accent/90 transition-all">
                            开始测试
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Agent: Session Management Overlay */}
        {((role === UserRole.AGENT && agentTab === 'sessions') || (role === UserRole.TEAM_LEADER && tlViewMode === 'personal' && agentTab === 'sessions')) && agentViewMode === 'chat' && (
          <div className="absolute inset-0 z-10 bg-app-bg/95 backdrop-blur-md p-8 overflow-y-auto transition-all duration-300">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-app-text">会话管理中心</h3>
                <button 
                  onClick={() => setAgentTab('chat')}
                  className="p-2 hover:bg-app-pane rounded-full text-app-text-muted transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-app-pane rounded-2xl shadow-sm border border-app-border overflow-hidden">
                <div className="p-4 border-b border-app-border flex items-center justify-between bg-app-bg/50">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-muted" />
                    <input 
                      type="text" 
                      placeholder="搜索历史会话..." 
                      className="w-full bg-app-bg border border-app-border rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-app-accent transition-all"
                    />
                  </div>
                  <button onClick={startNewChat} className="px-4 py-2 bg-app-accent text-app-bg text-xs font-bold rounded-xl flex items-center gap-2">
                    <Plus className="w-4 h-4" /> 开启新对话
                  </button>
                </div>
                <div className="divide-y divide-app-border">
                  {chatHistory.map(chat => (
                    <div key={chat.id} className="p-4 hover:bg-app-bg transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => { loadChat(chat.id); setAgentTab('chat'); setSelectedCustomerId(null); }}>
                        <div className="w-10 h-10 bg-app-bg rounded-xl flex items-center justify-center text-app-text-muted group-hover:text-app-accent transition-colors">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-app-text">{chat.title}</p>
                          <p className="text-[10px] text-app-text-muted mt-1 line-clamp-1">{chat.lastMessage || '暂无消息'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-[10px] text-app-text-muted font-medium">{chat.timestamp}</span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-app-pane rounded-lg text-app-text-muted">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setChatHistory(prev => prev.filter(h => h.id !== chat.id)); }}
                            className="p-2 hover:bg-app-pane rounded-lg text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agent: Customer Management Overlay */}
        {((role === UserRole.AGENT && agentTab === 'customers') || (role === UserRole.TEAM_LEADER && tlViewMode === 'personal' && agentTab === 'customers')) && agentViewMode === 'chat' && (
          <div className="absolute inset-0 z-10 bg-app-bg/95 backdrop-blur-md p-8 overflow-y-auto transition-all duration-300">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {selectedCustomerId && (
                    <button 
                      onClick={() => setSelectedCustomerId(null)}
                      className="p-2 hover:bg-app-pane rounded-full text-app-text-muted transition-colors"
                    >
                      <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                  )}
                  <h3 className="text-lg font-bold text-app-text">
                    {selectedCustomerId ? '客户详情' : '客户管理中心'}
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  {!selectedCustomerId && (
                    <button 
                      onClick={() => openCustomerModal()}
                      className="px-4 py-2 bg-app-accent text-app-bg text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-app-accent/20"
                    >
                      <Plus className="w-4 h-4" /> 新建客户
                    </button>
                  )}
                  <button 
                    onClick={() => { setAgentTab('chat'); setSelectedCustomerId(null); }}
                    className="p-2 hover:bg-app-pane rounded-full text-app-text-muted transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              {!selectedCustomerId ? (
                <>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: '总客户数', value: customers.length, icon: <Users className="w-4 h-4" /> },
                      { label: '本月新增', value: '12', icon: <Plus className="w-4 h-4" /> },
                      { label: '待跟进', value: '5', icon: <Clock className="w-4 h-4" /> },
                      { label: '活跃度', value: '85%', icon: <Activity className="w-4 h-4" /> },
                    ].map((stat, i) => (
                      <div key={i} className="bg-app-pane p-4 rounded-xl border border-app-border shadow-sm">
                        <div className="text-app-accent mb-2">{stat.icon}</div>
                        <p className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest">{stat.label}</p>
                        <p className="text-xl font-bold text-app-text">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-app-pane rounded-2xl shadow-sm border border-app-border overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-app-bg text-[10px] font-bold text-app-text-muted uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-3">姓名</th>
                          <th className="px-6 py-3">联系方式</th>
                          <th className="px-6 py-3">状态</th>
                          <th className="px-6 py-3">最后联系</th>
                          <th className="px-6 py-3 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-app-border">
                        {customers.map(customer => (
                          <tr key={customer.id} className="hover:bg-app-bg transition-colors cursor-pointer" onClick={() => setSelectedCustomerId(customer.id)}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-app-accent/10 text-app-accent rounded-full flex items-center justify-center font-bold text-xs">
                                  {customer.name[0]}
                                </div>
                                <span className="text-xs font-medium text-app-text">{customer.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-xs text-app-text">{customer.phone}</p>
                              <p className="text-[10px] text-app-text-muted">{customer.email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                customer.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                {customer.status === 'active' ? '活跃' : '跟进中'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-app-text-muted">{customer.lastContact}</td>
                            <td className="px-6 py-4 text-right">
                              <button className="p-1 hover:bg-app-bg rounded text-app-text-muted">
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-3 gap-8">
                  {/* Left: Customer Info & Tags */}
                  <div className="col-span-1 space-y-6">
                    <div className="bg-app-pane p-6 rounded-2xl border border-app-border shadow-sm">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-app-accent/10 text-app-accent rounded-full flex items-center justify-center font-bold text-2xl">
                          {customers.find(c => c.id === selectedCustomerId)?.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-bold text-app-text">{customers.find(c => c.id === selectedCustomerId)?.name}</h4>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => openCustomerModal(customers.find(c => c.id === selectedCustomerId))}
                                className="p-2 hover:bg-app-bg rounded-lg text-app-text-muted transition-colors"
                                title="编辑客户"
                              >
                                <Settings className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  setCustomerToDeleteId(selectedCustomerId);
                                  setIsDeleteConfirmOpen(true);
                                }}
                                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                title="删除客户"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-app-text-muted">{customers.find(c => c.id === selectedCustomerId)?.phone}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-app-text-muted">邮箱</span>
                            <span className="text-app-text font-medium">{customers.find(c => c.id === selectedCustomerId)?.email}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-app-text-muted">微信号</span>
                            <span className="text-app-text font-medium">{customers.find(c => c.id === selectedCustomerId)?.wechatId || '-'}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-app-text-muted">状态</span>
                            <span className={`px-2 py-0.5 rounded-full font-bold ${
                              customers.find(c => c.id === selectedCustomerId)?.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {customers.find(c => c.id === selectedCustomerId)?.status === 'active' ? '活跃' : '跟进中'}
                            </span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-app-border">
                          <p className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest mb-2">客户画像 (标签)</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {customers.find(c => c.id === selectedCustomerId)?.tags?.map(tag => (
                              <div 
                                key={tag.id} 
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${
                                  tag.source === 'ai' ? 'bg-app-accent/10 text-app-accent' : 'bg-app-bg border border-app-border text-app-text'
                                }`}
                              >
                                {tag.source === 'ai' && <Zap className="w-3 h-3" />}
                                {tag.label}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); removeTag(selectedCustomerId, tag.id); }}
                                  className="ml-1 hover:text-red-400 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={newTagLabel}
                              onChange={(e) => setNewTagLabel(e.target.value)}
                              placeholder="新增标签..."
                              className="flex-1 bg-app-bg border border-app-border rounded-lg px-3 py-1.5 text-[10px] focus:outline-none focus:border-app-accent"
                              onKeyDown={(e) => e.key === 'Enter' && addTag(selectedCustomerId, newTagLabel)}
                            />
                            <button 
                              onClick={() => addTag(selectedCustomerId, newTagLabel)}
                              className="p-1.5 bg-app-accent text-app-bg rounded-lg hover:opacity-90 transition-opacity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Chat History */}
                  <div className="col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-app-text flex items-center gap-2">
                        <History className="w-4 h-4" /> 对话历史
                      </h4>
                    </div>
                    <div className="bg-app-pane rounded-2xl border border-app-border shadow-sm overflow-hidden">
                      <div className="divide-y divide-app-border">
                        {customers.find(c => c.id === selectedCustomerId)?.chatHistoryIds?.length ? (
                          customers.find(c => c.id === selectedCustomerId)?.chatHistoryIds?.map(historyId => {
                            const history = chatHistory.find(h => h.id === historyId);
                            if (!history) return null;
                            return (
                              <div key={history.id} className="p-4 hover:bg-app-bg transition-colors flex items-center justify-between group cursor-pointer" onClick={() => { loadChat(history.id); setAgentTab('chat'); }}>
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-app-bg rounded-lg flex items-center justify-center text-app-text-muted group-hover:text-app-accent transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-app-text">{history.title}</p>
                                    <p className="text-[10px] text-app-text-muted mt-0.5">{history.timestamp}</p>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-app-text-muted opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-8 text-center">
                            <p className="text-xs text-app-text-muted">暂无对话历史</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteConfirmOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-app-pane w-full max-w-sm rounded-2xl border border-app-border shadow-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-app-text mb-2">确认删除客户？</h3>
              <p className="text-xs text-app-text-muted mb-6">此操作将永久删除该客户的所有信息及其关联的历史对话记录，且无法撤销。</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-app-border text-app-text text-sm font-bold rounded-xl hover:bg-app-bg transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    if (customerToDeleteId) {
                      deleteCustomer(customerToDeleteId);
                      setIsDeleteConfirmOpen(false);
                      setCustomerToDeleteId(null);
                    }
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Customer Create/Edit Modal */}
        {isCustomerModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCustomerModalOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-app-pane w-full max-w-md rounded-2xl border border-app-border shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-app-border flex items-center justify-between">
                <h3 className="text-lg font-bold text-app-text">{editingCustomer ? '编辑客户' : '新建客户'}</h3>
                <button onClick={() => setIsCustomerModalOpen(false)} className="text-app-text-muted hover:text-app-text">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest">姓名</label>
                  <input 
                    type="text" 
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-app-accent"
                    placeholder="请输入姓名"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest">电话</label>
                    <input 
                      type="text" 
                      value={customerForm.phone}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-app-accent"
                      placeholder="电话号码"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest">微信号</label>
                    <input 
                      type="text" 
                      value={customerForm.wechatId}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, wechatId: e.target.value }))}
                      className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-app-accent"
                      placeholder="微信号"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest">邮箱</label>
                  <input 
                    type="email" 
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-app-accent"
                    placeholder="电子邮箱"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest">关联历史对话</label>
                  <div className="max-h-32 overflow-y-auto border border-app-border rounded-xl bg-app-bg p-2 space-y-1">
                    {chatHistory.map(history => (
                      <label key={history.id} className="flex items-center gap-2 p-2 hover:bg-app-pane rounded-lg cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={customerForm.chatHistoryIds.includes(history.id)}
                          onChange={(e) => {
                            const ids = e.target.checked 
                              ? [...customerForm.chatHistoryIds, history.id]
                              : customerForm.chatHistoryIds.filter(id => id !== history.id);
                            setCustomerForm(prev => ({ ...prev, chatHistoryIds: ids }));
                          }}
                          className="w-4 h-4 rounded border-app-border text-app-accent focus:ring-app-accent"
                        />
                        <span className="text-xs text-app-text truncate">{history.title}</span>
                      </label>
                    ))}
                  </div>
                  {customerForm.chatHistoryIds.length > 0 && !editingCustomer && (
                    <p className="text-[10px] text-app-accent italic mt-1 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> 保存后将基于所选对话自动生成画像
                    </p>
                  )}
                </div>
              </div>
              <div className="p-6 bg-app-bg border-t border-app-border flex gap-3">
                <button 
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-app-border text-app-text text-sm font-bold rounded-xl hover:bg-app-pane transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={saveCustomer}
                  className="flex-1 px-4 py-2.5 bg-app-accent text-app-bg text-sm font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-app-accent/20"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Agent: Knowledge Management Overlay */}
        {((role === UserRole.AGENT && agentTab === 'knowledge') || (role === UserRole.TEAM_LEADER && tlViewMode === 'personal' && agentTab === 'knowledge')) && agentViewMode === 'chat' && (
          <div className="absolute inset-0 z-10 bg-app-bg/95 backdrop-blur-md p-8 overflow-y-auto transition-all duration-300">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-app-text">私人知识库管理</h3>
                <button 
                  onClick={() => setAgentTab('chat')}
                  className="p-2 hover:bg-app-pane rounded-full text-app-text-muted transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-app-text">已上传资源</h4>
                    <button className="px-4 py-2 bg-app-accent text-app-bg text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-app-accent/20">
                      <Plus className="w-4 h-4" /> 上传文档
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {sources.map(source => (
                      <div key={source.id} className="bg-app-pane p-4 rounded-xl border border-app-border flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${
                            source.type === 'pdf' ? 'bg-red-500/10 text-red-500' :
                            source.type === 'doc' ? 'bg-blue-500/10 text-blue-500' : 'bg-app-bg text-app-text-muted'
                          }`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-app-text">{source.title}</p>
                            <p className="text-[10px] text-app-text-muted mt-1">
                              {source.status === 'ready' ? 'WeKnora 已解析' : `正在提取语义 (${source.progress}%)`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-app-bg rounded-lg text-app-text-muted">
                            <Settings className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-app-bg rounded-lg text-app-text-muted">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-app-pane p-6 rounded-2xl border border-app-border space-y-4">
                    <h4 className="text-sm font-bold text-app-text">知识库概览</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] text-app-text-muted">存储占用</span>
                        <span className="text-lg font-bold text-app-accent">45%</span>
                      </div>
                      <div className="h-2 w-full bg-app-bg rounded-full overflow-hidden">
                        <div className="h-full bg-app-accent" style={{ width: '45%' }}></div>
                      </div>
                      <p className="text-[10px] text-app-text-muted leading-relaxed">
                        私人知识库仅对您个人可见，AI 将优先检索此处内容以提供个性化建议。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {role === UserRole.TEAM_LEADER && tlViewMode === 'management' && (
          <div className="absolute inset-0 z-10 bg-app-bg/95 backdrop-blur-md p-8 overflow-y-auto transition-all duration-300">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <h3 className="text-lg font-bold text-app-text">管理与教练中心</h3>
                  <div className="flex bg-app-bg p-1 rounded-xl shadow-inner">
                    <button 
                      onClick={() => setTlManagementTab('monitoring')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${tlManagementTab === 'monitoring' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted hover:text-app-text'}`}
                    >
                      团队监控
                    </button>
                    <button 
                      onClick={() => setTlManagementTab('resources')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${tlManagementTab === 'resources' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted hover:text-app-text'}`}
                    >
                      资源统筹
                    </button>
                    <button 
                      onClick={() => setTlManagementTab('materials')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${tlManagementTab === 'materials' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted hover:text-app-text'}`}
                    >
                      培训资料
                    </button>
                    <button 
                      onClick={() => setTlManagementTab('questions')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${tlManagementTab === 'questions' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted hover:text-app-text'}`}
                    >
                      测试题库
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setTlViewMode('personal');
                    if (messages.length === 1) {
                      setMessages(prev => [...prev, { id: 'tl-chat', role: 'assistant', text: '正在进入对话模式...' }]);
                    }
                  }} 
                  className="text-xs font-bold text-app-accent flex items-center gap-1 hover:underline"
                >
                  进入对话模式 <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              {tlManagementTab === ('billing' as any) && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border">
                      <h4 className="text-sm font-bold mb-6 text-app-text">团队效能热力图 (ROI 分析)</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {[...Array(25)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`aspect-square rounded-lg transition-all cursor-help ${
                              i % 7 === 0 ? 'bg-red-500/40' : i % 3 === 0 ? 'bg-emerald-500/40' : 'bg-app-accent/20'
                            }`}
                            title={`AgentID: ${i + 100}\n调用量: ${Math.floor(Math.random() * 1000)}\n业务转化: ${Math.floor(Math.random() * 10)}`}
                          ></div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between text-[10px] text-app-text-muted">
                        <span>低 ROI (高消耗)</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-red-500/40 rounded-sm"></div>
                          <div className="w-2 h-2 bg-app-accent/20 rounded-sm"></div>
                          <div className="w-2 h-2 bg-emerald-500/40 rounded-sm"></div>
                        </div>
                        <span>高 ROI (高产出)</span>
                      </div>
                    </div>

                    <div className="bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border">
                      <h4 className="text-sm font-bold mb-6 text-app-text">动态配额调度 (Credit Lending)</h4>
                      <div className="space-y-4">
                        {[
                          { name: '代理人 1', quota: 85, used: 70 },
                          { name: '代理人 2', quota: 40, used: 38 },
                          { name: '代理人 3', quota: 60, used: 15 },
                        ].map(agent => (
                          <div key={agent.name} className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-app-text font-medium">{agent.name}</span>
                                <span className="text-app-text-muted">{agent.used}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-app-bg rounded-full overflow-hidden">
                                <div className={`h-full ${agent.used > 80 ? 'bg-red-400' : 'bg-app-accent'} rounded-full`} style={{ width: `${agent.used}%` }}></div>
                              </div>
                            </div>
                            <button className="px-2 py-1 bg-app-accent/10 text-app-accent text-[10px] font-bold rounded hover:bg-app-accent/20">
                              调整
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border border-red-500/20">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-bold text-red-400 flex items-center gap-2">
                        <Zap className="w-4 h-4" /> 异常熔断与报警 (Circuit Breaker)
                      </h4>
                      <span className="text-[10px] text-app-text-muted">实时监控 Prompt 死循环与 API 攻击</span>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-400">
                            <AlertCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-app-text">代理人 2: 疑似 Prompt 死循环</p>
                            <p className="text-[10px] text-app-text-muted">TraceID: AX-9928 | 连续调用 15 次 | 预计损失: $12.50</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-red-500 text-app-bg text-xs font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">
                          一键中止 (Kill Switch)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tlManagementTab === 'monitoring' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-app-pane p-4 rounded-2xl shadow-sm border border-app-border">
                      <p className="text-[10px] text-app-text-muted uppercase font-bold tracking-widest mb-1">团队平均 PHS</p>
                      <p className="text-2xl font-bold text-app-accent">86.4</p>
                      <p className="text-[10px] text-emerald-500 font-bold mt-1">↑ 2.4%</p>
                    </div>
                    <div className="bg-app-pane p-4 rounded-2xl shadow-sm border border-app-border">
                      <p className="text-[10px] text-app-text-muted uppercase font-bold tracking-widest mb-1">AIDI 依赖指数</p>
                      <p className="text-2xl font-bold text-red-400">72%</p>
                      <p className="text-[10px] text-red-400 font-bold mt-1">⚠️ 预警: 技能留存下降</p>
                    </div>
                    <div className="bg-app-pane p-4 rounded-2xl shadow-sm border border-app-border">
                      <p className="text-[10px] text-app-text-muted uppercase font-bold tracking-widest mb-1">合规异常触发</p>
                      <p className="text-2xl font-bold text-amber-500">3</p>
                      <p className="text-[10px] text-amber-500 font-bold mt-1">需实时干预</p>
                    </div>
                    <div className="bg-app-pane p-4 rounded-2xl shadow-sm border border-app-border">
                      <p className="text-[10px] text-app-text-muted uppercase font-bold tracking-widest mb-1">报表生成量</p>
                      <p className="text-2xl font-bold text-app-text">124</p>
                      <p className="text-[10px] text-app-text-muted font-bold mt-1">本月累计</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-sm font-bold text-app-text">桑德勒 (Sandler) 销售漏斗热力图</h4>
                        <span className="text-[10px] text-app-text-muted">执行质量监控</span>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: '建立信任 (Bonding)', value: 95, color: 'bg-emerald-500' },
                          { label: '前期契约 (Up-Front Contract)', value: 82, color: 'bg-app-accent' },
                          { label: '挖掘痛点 (Pain)', value: 64, color: 'bg-amber-500' },
                          { label: '预算确认 (Budget)', value: 45, color: 'bg-red-400' },
                          { label: '决策流程 (Decision)', value: 38, color: 'bg-red-500' },
                        ].map(step => (
                          <div key={step.label} className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-app-text font-medium">{step.label}</span>
                              <span className="text-app-text-muted">{step.value}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-app-bg rounded-full overflow-hidden">
                              <div className={`h-full ${step.color} rounded-full`} style={{ width: `${step.value}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-sm font-bold text-app-text">实时合规异常报告</h4>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="space-y-3">
                        {[
                          { agent: '代理人 1', time: '2 分钟前', issue: '触发“承诺收益”红线', action: '已自动拦截并引导' },
                          { agent: '代理人 3', time: '15 分钟前', issue: '未执行前期契约话术', action: '建议主管干预' },
                          { agent: '代理人 2', time: '1 小时前', issue: 'PII 信息处理异常', action: '系统已脱敏' },
                        ].map((alert, i) => (
                          <div key={i} className="p-3 bg-app-bg rounded-xl border border-app-border space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-app-text">{alert.agent}</span>
                              <span className="text-[9px] text-app-text-muted">{alert.time}</span>
                            </div>
                            <p className="text-[10px] text-red-400 font-medium">{alert.issue}</p>
                            <p className="text-[9px] text-app-text-muted italic">{alert.action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-bold text-app-text">团队 PHS & AIDI 趋势关联分析</h4>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-app-accent rounded-full"></div>
                          <span className="text-[10px] text-app-text-muted">PHS</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-[10px] text-app-text-muted">AIDI</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-48 flex items-end gap-2">
                      {[...Array(24)].map((_, i) => (
                        <div key={i} className="flex-1 flex flex-col gap-0.5 h-full justify-end">
                          <div className="w-full bg-red-400/20 rounded-t-sm relative group">
                            <div className="absolute bottom-0 left-0 right-0 bg-red-400 rounded-t-sm transition-all duration-500" style={{ height: `${10 + Math.random() * 60}%` }}></div>
                          </div>
                          <div className="w-full bg-app-accent/20 rounded-t-sm relative group">
                            <div className="absolute bottom-0 left-0 right-0 bg-app-accent rounded-t-sm transition-all duration-500" style={{ height: `${20 + Math.random() * 80}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tlManagementTab === 'resources' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-app-pane p-6 rounded-2xl border border-app-border space-y-4">
                      <h4 className="text-sm font-bold text-app-text">团队 Token 消耗概览</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] text-app-text-muted">总配额使用率</span>
                          <span className="text-lg font-bold text-app-accent">68%</span>
                        </div>
                        <div className="h-2 w-full bg-app-bg rounded-full overflow-hidden">
                          <div className="h-full bg-app-accent" style={{ width: '68%' }}></div>
                        </div>
                        <p className="text-[10px] text-app-text-muted leading-relaxed">
                          团队当前消耗主要集中在“方案报表创作”模块。预计本月 25 日将耗尽基础配额。
                        </p>
                      </div>
                    </div>
                    <div className="bg-app-pane p-6 rounded-2xl border border-app-border space-y-4">
                      <h4 className="text-sm font-bold text-app-text">LangGraph 协作成本分析</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-app-text-muted">Planner / Executor 通讯成本</span>
                          <span className="text-app-text font-bold">$12.40 / 日</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-app-text-muted">平均单次任务 Token 消耗</span>
                          <span className="text-app-text font-bold">45.2K</span>
                        </div>
                        <div className="pt-2 border-t border-app-border">
                          <p className="text-[9px] text-emerald-500 font-bold">语义缓存命中率: 42% (已节省约 $150/月)</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-app-pane p-6 rounded-2xl border border-app-border space-y-4">
                      <h4 className="text-sm font-bold text-app-text">预算预警与自动加速</h4>
                      <div className="flex items-center justify-between p-3 bg-app-bg rounded-xl border border-app-border">
                        <span className="text-[10px] text-app-text">余额不足自动充值</span>
                        <div className="w-8 h-4 bg-app-accent rounded-full relative">
                          <div className="absolute right-1 top-1 w-2 h-2 bg-app-bg rounded-full shadow-sm"></div>
                        </div>
                      </div>
                      <button className="w-full py-2 bg-app-accent text-app-bg text-[10px] font-bold rounded-lg">
                        申请额外团队额度
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {tlManagementTab === 'materials' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-app-text">团队培训资料库</h4>
                    <button className="px-4 py-2 bg-app-accent text-app-bg text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-app-accent/20 hover:scale-105 transition-all">
                      <Plus className="w-4 h-4" /> 上传新资料
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {teamMaterials.map(material => (
                      <div key={material.id} className="bg-app-pane p-4 rounded-xl border border-app-border flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${
                            material.type === 'pdf' ? 'bg-red-500/10 text-red-500' :
                            material.type === 'video' ? 'bg-blue-500/10 text-blue-500' :
                            material.type === 'audio' ? 'bg-amber-500/10 text-amber-500' : 'bg-app-bg text-app-text-muted'
                          }`}>
                            {material.type === 'pdf' && <FileText className="w-5 h-5" />}
                            {material.type === 'video' && <Video className="w-5 h-5" />}
                            {material.type === 'audio' && <Music className="w-5 h-5" />}
                            {material.type === 'doc' && <Book className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-app-text">{material.title}</p>
                            <p className="text-[10px] text-app-text-muted mt-1">更新于: {material.updatedAt} • 作者: {material.author}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-app-bg rounded-lg text-app-text-muted transition-colors" title="生成音视频">
                            <Zap className="w-4 h-4 text-app-accent" />
                          </button>
                          <button className="p-2 hover:bg-app-bg rounded-lg text-app-text-muted transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-app-bg rounded-lg text-app-text-muted transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-app-bg rounded-lg text-app-text-muted transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tlManagementTab === 'questions' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-app-text">团队测试题库</h4>
                    <button className="px-4 py-2 bg-app-accent text-app-bg text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-app-accent/20 hover:scale-105 transition-all">
                      <Plus className="w-4 h-4" /> 新建题库
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {questionBanks.map(bank => (
                      <div key={bank.id} className="bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-app-accent-soft text-app-accent rounded-xl">
                            <FileQuestion className="w-6 h-6" />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                            bank.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-500' :
                            bank.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {bank.difficulty.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-app-text">{bank.title}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-[10px] text-app-text-muted">题目数量: {bank.questionCount}</p>
                          <p className="text-[10px] text-app-text-muted">更新于: {bank.updatedAt}</p>
                        </div>
                        <div className="mt-6 flex gap-2">
                          <button className="flex-1 py-2 bg-app-bg text-app-text text-xs font-bold rounded-lg hover:bg-app-border transition-all">
                            编辑题目
                          </button>
                          <button className="flex-1 py-2 bg-app-accent-soft text-app-accent text-xs font-bold rounded-lg hover:bg-app-accent/20 transition-all">
                            发布测试
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {role === UserRole.ADMINISTRATOR && adminViewMode === 'dashboard' && (
          <div className="absolute inset-0 z-10 bg-app-bg/95 backdrop-blur-md p-8 overflow-y-auto transition-all duration-300">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <h3 className="text-lg font-bold text-app-text">Guardian 全局治理与财务看板</h3>
                  <div className="flex bg-app-bg p-1 rounded-xl shadow-inner">
                    <button 
                      onClick={() => setAdminTab('billing')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${adminTab === 'billing' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                    >
                      财务分摊
                    </button>
                    <button 
                      onClick={() => setAdminTab('subscription' as any)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${adminTab === ('subscription' as any) ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                    >
                      订阅管理
                    </button>
                    <button 
                      onClick={() => setAdminTab('models')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${adminTab === 'models' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted'}`}
                    >
                      模型管理
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setAdminViewMode('chat');
                    if (messages.length === 1) {
                      setMessages(prev => [...prev, { id: 'admin-chat', role: 'assistant', text: '正在进入对话模式...' }]);
                    }
                  }} 
                  className="text-xs font-bold text-app-accent flex items-center gap-1 hover:underline"
                >
                  进入对话模式 <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {adminTab === 'models' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    {/* Routing & Selection */}
                    <div className="col-span-2 space-y-6">
                      <div className="bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-sm font-bold text-app-text">路由权重与模型选择 (Routing & Selection)</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-app-text-muted font-bold">自动负载均衡</span>
                            <div className="w-8 h-4 bg-app-accent rounded-full relative cursor-pointer">
                              <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-app-bg rounded-full shadow-sm" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {modelRates.map(m => (
                            <div 
                              key={m.id} 
                              onClick={() => setSelectedModel(m.id)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                                selectedModel === m.id 
                                  ? 'bg-app-accent/5 border-app-accent shadow-sm' 
                                  : 'bg-app-bg border-app-border hover:border-app-accent/20'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                    selectedModel === m.id ? 'bg-app-accent text-app-bg' : 'bg-app-pane text-app-text-muted group-hover:text-app-accent'
                                  }`}>
                                    <Zap className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-bold text-app-text">{m.name}</p>
                                      {selectedModel === m.id && (
                                        <span className="px-1.5 py-0.5 bg-app-accent text-app-bg text-[8px] font-bold rounded uppercase">Default</span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-app-text-muted">{m.provider} · {m.id.toUpperCase()}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6">
                                  <div className="text-right">
                                    <p className="text-[9px] text-app-text-muted uppercase font-bold">Input/Output</p>
                                    <p className="text-xs font-mono text-app-text">${m.inputPrice}/${m.outputPrice}</p>
                                  </div>
                                  <div className="w-32 space-y-1">
                                    <div className="flex justify-between text-[9px]">
                                      <span className="text-app-text-muted">权重</span>
                                      <span className="text-app-accent font-bold">{m.weight * 100}%</span>
                                    </div>
                                    <div className="h-1 bg-app-border rounded-full overflow-hidden">
                                      <div className="bg-app-accent h-full" style={{ width: `${m.weight * 100}%` }} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {selectedModel === m.id && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  className="pt-4 border-t border-app-accent/10 flex gap-4"
                                >
                                  <div className="flex-1 space-y-2">
                                    <label className="text-[10px] text-app-text-muted font-bold">权重调节</label>
                                    <input 
                                      type="range" 
                                      className="w-full accent-app-accent" 
                                      value={m.weight * 100} 
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => {
                                        const newWeight = parseInt(e.target.value) / 100;
                                        setModelRates(prev => prev.map(rate => rate.id === m.id ? { ...rate, weight: newWeight } : rate));
                                      }}
                                    />
                                  </div>
                                  <div className="flex items-end">
                                    <button className="px-3 py-1.5 bg-app-bg border border-app-border rounded-lg text-[10px] font-bold text-app-text hover:border-app-accent transition-colors">
                                      高级配置
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar: Base Config & Strategy */}
                    <div className="space-y-6">
                      <div className="bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-sm font-bold text-app-text">系统底座配置 (Endpoints)</h4>
                          <button className="p-1.5 bg-app-bg rounded-lg text-app-text-muted hover:text-app-accent">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          {[
                            { name: 'OpenAI API v1', status: 'connected', latency: '124ms' },
                            { name: 'Anthropic Claude v3', status: 'connected', latency: '245ms' },
                            { name: 'Google Vertex AI', status: 'connected', latency: '180ms' },
                            { name: 'Azure OpenAI', status: 'error', latency: '--' },
                          ].map((config, i) => (
                            <div key={i} className="p-3 bg-app-bg rounded-xl border border-app-border flex items-center justify-between group">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${config.status === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                <div>
                                  <p className="text-xs text-app-text font-medium">{config.name}</p>
                                  <p className="text-[9px] text-app-text-muted">{config.latency}</p>
                                </div>
                              </div>
                              <button className="p-1 hover:bg-app-pane rounded text-app-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                                <Settings className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border">
                        <h4 className="text-sm font-bold mb-4 text-app-text">自动切换策略</h4>
                        <div className="space-y-4">
                          <div className="p-3 bg-app-bg rounded-xl border border-app-border">
                            <p className="text-[10px] font-bold text-app-text-muted mb-2 uppercase">故障转移 (Failover)</p>
                            <p className="text-[10px] text-app-text leading-relaxed">
                              当主模型连续 3 次请求失败或延迟超过 2000ms 时，自动降级至备选模型。
                            </p>
                          </div>
                          <div className="p-3 bg-app-bg rounded-xl border border-app-border">
                            <p className="text-[10px] font-bold text-app-text-muted mb-2 uppercase">成本优化 (Cost Optimization)</p>
                            <p className="text-[10px] text-app-text leading-relaxed">
                              针对非关键任务（如摘要生成），优先路由至成本最低的可用模型。
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {adminTab === 'subscription' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    {subscriptionPlans.map(plan => (
                      <div key={plan.id} className="bg-app-pane p-6 rounded-2xl border border-app-border space-y-4">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-app-text">{plan.name}</h5>
                          <Settings className="w-4 h-4 text-app-text-muted cursor-pointer" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-app-accent">${plan.price}</p>
                          <p className="text-[10px] text-app-text-muted">/ 每月</p>
                        </div>
                        <div className="pt-4 border-t border-app-border space-y-2">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-app-text-muted">Token 额度</span>
                            <span className="text-app-text font-bold">{(plan.tokens / 1000000).toFixed(0)}M</span>
                          </div>
                          <p className="text-[10px] text-app-text-muted leading-relaxed">{plan.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-app-pane p-6 rounded-2xl border border-app-border">
                    <h4 className="text-sm font-bold mb-4 text-app-text">计费策略配置</h4>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-app-text-muted">超出配额计费模式</label>
                        <div className="flex gap-4">
                          <button className="flex-1 py-3 px-4 bg-app-accent text-app-bg text-xs font-bold rounded-xl">按量计费 (PAYG)</button>
                          <button className="flex-1 py-3 px-4 bg-app-bg border border-app-border text-app-text-muted text-xs font-bold rounded-xl">强制升级订阅</button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-app-text-muted">PAYG 费率系数</label>
                        <div className="flex items-center gap-4">
                          <input type="range" className="flex-1 accent-app-accent" defaultValue={1.2} step={0.1} min={1} max={2} />
                          <span className="text-sm font-bold text-app-accent">1.2x</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {adminTab === 'billing' && (
                <>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border">
                      <h4 className="text-sm font-bold mb-6 text-app-text">多维度费用分摊 (Multi-Entity Allocation)</h4>
                      <div className="h-64 flex items-end gap-4">
                        {[
                          { label: '信托 A', value: 85, color: 'bg-app-accent' },
                          { label: '信托 B', value: 45, color: 'bg-emerald-500' },
                          { label: '离岸公司 C', value: 65, color: 'bg-amber-500' },
                          { label: 'LP 实体 D', value: 30, color: 'bg-red-400' },
                        ].map(entity => (
                          <div key={entity.label} className="flex-1 flex flex-col items-center gap-2">
                            <div className={`w-full ${entity.color} rounded-t-xl transition-all duration-700`} style={{ height: `${entity.value}%` }}></div>
                            <span className="text-[10px] text-app-text-muted font-bold">{entity.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border">
                      <h4 className="text-sm font-bold mb-6 text-app-text">财务摘要 (Financial Summary)</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-app-bg rounded-xl border border-app-border">
                          <p className="text-[10px] text-app-text-muted uppercase mb-1">本月总支出</p>
                          <p className="text-xl font-bold text-app-text">$42,850.00</p>
                        </div>
                        <div className="p-4 bg-app-bg rounded-xl border border-app-border">
                          <p className="text-[10px] text-app-text-muted uppercase mb-1">平均 Token 成本</p>
                          <p className="text-xl font-bold text-app-text">$0.08 / 1K</p>
                        </div>
                        <button className="w-full py-2 bg-app-accent text-app-bg text-xs font-bold rounded-lg mt-2">
                          导出财务报表
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border">
                      <h4 className="text-sm font-bold mb-6 text-app-text">PII 脱敏与隐私监测</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-app-bg rounded-xl border border-app-border">
                          <div className="flex items-center gap-3">
                            <Lock className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs text-app-text">PII 脱敏网关状态</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-500">运行正常</span>
                        </div>
                        <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                          <p className="text-[10px] text-red-400 font-bold mb-1">拦截记录 (最近 1 小时)</p>
                          <ul className="text-[9px] text-app-text-muted space-y-1">
                            <li>• 拦截 12 次 身份证号 (HKID) 泄露风险</li>
                            <li>• 拦截 5 次 银行账号泄露风险</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-app-pane p-6 rounded-2xl shadow-sm border border-app-border">
                      <h4 className="text-sm font-bold mb-6 text-app-text">供应商 SLA 与跨境流量监测</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-app-text-muted">腾讯云 CCN 跨境流量</span>
                          <span className="text-[10px] font-bold text-app-accent">1.2 GB / 5 GB</span>
                        </div>
                        <div className="h-1.5 w-full bg-app-bg rounded-full overflow-hidden">
                          <div className="h-full bg-app-accent" style={{ width: '24%' }}></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="p-2 bg-app-bg rounded-lg border border-app-border">
                            <p className="text-[9px] text-app-text-muted">API 可用性</p>
                            <p className="text-xs font-bold text-emerald-500">99.98%</p>
                          </div>
                          <div className="p-2 bg-app-bg rounded-lg border border-app-border">
                            <p className="text-[9px] text-app-text-muted">平均延迟</p>
                            <p className="text-xs font-bold text-app-text">142ms</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {role === UserRole.OPS && opsViewMode === 'dashboard' && (
          <div className="absolute inset-0 z-10 bg-app-bg/95 backdrop-blur-md p-8 overflow-y-auto transition-all duration-300">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <h3 className="text-lg font-bold text-app-text">运营与知识管道管理</h3>
                  <div className="flex bg-app-bg p-1 rounded-xl shadow-inner">
                    <button 
                      onClick={() => setOpsTab('crawler')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${opsTab === 'crawler' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted hover:text-app-text'}`}
                    >
                      爬虫管理
                    </button>
                    <button 
                      onClick={() => setOpsTab('knowledge')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${opsTab === 'knowledge' ? 'bg-app-pane text-app-accent shadow-sm' : 'text-app-text-muted hover:text-app-text'}`}
                    >
                      公共知识库
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setOpsViewMode('chat');
                    if (messages.length === 1) {
                      setMessages(prev => [...prev, { id: 'ops-chat', role: 'assistant', text: '正在进入对话模式...' }]);
                    }
                  }} 
                  className="text-xs font-bold text-app-accent flex items-center gap-1 hover:underline"
                >
                  进入对话模式 <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {opsTab === 'crawler' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-app-text">爬虫链接与定时任务</h4>
                    <button 
                      onClick={() => setIsAddCrawlerModalOpen(true)}
                      className="px-4 py-2 bg-app-accent text-app-bg text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-app-accent/20 hover:scale-105 transition-all"
                    >
                      <Plus className="w-4 h-4" /> 新增爬虫链接
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {crawlerConfigs.map(config => (
                      <div key={config.id} className="bg-app-pane p-5 rounded-2xl border border-app-border flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${config.status === 'active' ? 'bg-app-accent-soft text-app-accent' : 'bg-app-bg text-app-text-muted'}`}>
                            <Database className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-app-text">{config.name}</p>
                            <p className="text-[10px] text-app-text-muted mt-1">{config.url}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest">抓取频率</p>
                            <p className="text-xs font-medium text-app-text mt-1 flex items-center gap-1 justify-end">
                              <Clock className="w-3 h-3" /> {config.schedule}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest">状态</p>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full mt-1 inline-block ${
                              config.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' :
                              config.status === 'paused' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'
                            }`}>
                              {config.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-app-bg rounded-lg text-app-text-muted">
                              <Settings className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-app-bg rounded-lg text-app-text-muted">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {opsTab === 'knowledge' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-app-text">公共知识库维护</h4>
                    <button className="px-4 py-2 bg-app-accent text-app-bg text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-app-accent/20 hover:scale-105 transition-all">
                      <Plus className="w-4 h-4" /> 添加公共资源
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {publicKnowledge.map(item => (
                      <div key={item.id} className="bg-app-pane p-4 rounded-xl border border-app-border flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${
                            item.type === 'pdf' ? 'bg-red-500/10 text-red-500' :
                            item.type === 'video' ? 'bg-blue-500/10 text-blue-500' :
                            item.type === 'audio' ? 'bg-amber-500/10 text-amber-500' : 'bg-app-bg text-app-text-muted'
                          }`}>
                            {item.type === 'pdf' && <FileText className="w-5 h-5" />}
                            {item.type === 'video' && <Video className="w-5 h-5" />}
                            {item.type === 'audio' && <Music className="w-5 h-5" />}
                            {item.type === 'doc' && <Book className="w-5 h-5" />}
                            {item.type === 'url' && <Database className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-app-text">{item.title}</p>
                              <span className="text-[10px] px-1.5 py-0.5 bg-app-bg text-app-text-muted rounded font-medium">{item.category}</span>
                            </div>
                            <p className="text-[10px] text-app-text-muted mt-1">更新于: {item.updatedAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-app-bg rounded-lg text-app-text-muted transition-colors" title="生成音视频资料">
                            <Zap className="w-4 h-4 text-app-accent" />
                          </button>
                          <button className="p-2 hover:bg-app-bg rounded-lg text-app-text-muted transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-app-bg rounded-lg text-app-text-muted transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-app-bg rounded-lg text-app-text-muted transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-app-bg/50">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-app-accent text-app-bg rounded-2xl rounded-tr-none p-4 shadow-lg shadow-app-accent/10' : 'bg-app-pane border border-app-border rounded-2xl rounded-tl-none p-5 shadow-sm text-app-text'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 items-center">
                    {msg.citations && msg.citations.map(cit => (
                      <button key={cit.id} className="flex items-center gap-1.5 px-2 py-1 bg-app-bg hover:bg-app-border border border-app-border rounded text-[10px] font-mono text-app-text-muted transition-colors">
                        <FileText className="w-3 h-3" />
                        Source {cit.sourceId} (P.{cit.page})
                      </button>
                    ))}
                    {msg.role === 'assistant' && Math.random() > 0.7 && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-bold text-emerald-500">
                        <Zap className="w-3 h-3" />
                        语义缓存命中，本次免费
                      </div>
                    )}
                    {msg.role === 'assistant' && (
                      <span className="text-[9px] text-app-text-muted font-mono opacity-40">TraceID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                    )}
                  </div>
                  {msg.role === 'assistant' && (
                    <div className="mt-4 pt-4 border-t border-app-border/50 flex items-center gap-4">
                      <div className="flex items-center gap-3 text-app-text-muted">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(msg.text);
                          }}
                          className="p-1 hover:text-app-accent transition-colors" 
                          title="复制内容"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:text-emerald-500 transition-colors" title="有帮助">
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:text-red-500 transition-colors" title="无帮助">
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Thinking UX */}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-3 max-w-[80%]"
            >
              <div className="flex items-center gap-3 text-app-accent">
                <div className="flex gap-1">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-current rounded-full" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-current rounded-full" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-current rounded-full" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Logic Bus 推理中</span>
              </div>
              <div className="space-y-2 pl-6 border-l-2 border-app-accent/20">
                {activeThinkingSteps.map(step => (
                  <div 
                    key={step.id} 
                    className={`thinking-node ${
                      step.status === 'active' ? 'thinking-node-active' : 
                      step.status === 'completed' ? 'thinking-node-completed' : 'text-app-text-muted'
                    }`}
                  >
                    {step.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {step.label}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 shrink-0 bg-app-pane border-t border-app-border">
          <div className="max-w-4xl mx-auto relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder={
                role === UserRole.AGENT ? '以财富管理顾问身份提问...' :
                role === UserRole.TEAM_LEADER ? (tlViewMode === 'personal' ? '以个人业务顾问身份提问...' : '以管理中心身份提问...') :
                role === UserRole.ADMINISTRATOR ? '以系统管理员身份提问...' :
                role === UserRole.OPS ? '以运营专家身份提问...' : '提问...'
              }
              className="w-full px-4 pt-4 pb-14 bg-app-bg border border-app-border rounded-2xl shadow-sm focus:ring-2 focus:ring-app-accent/10 focus:border-app-accent/20 resize-none h-32 text-sm text-app-text transition-all placeholder:text-app-text-muted"
            />
            
            <div className="absolute left-4 bottom-4 flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                  className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${isPlusMenuOpen ? 'bg-app-accent/10 text-app-accent' : 'hover:bg-app-pane text-app-text-muted'}`}
                  title="更多操作"
                >
                  <Plus className="w-5 h-5" />
                </button>
                
                <AnimatePresence>
                  {isPlusMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsPlusMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-0 mb-2 w-48 bg-app-pane border border-app-border rounded-xl shadow-xl z-20 overflow-hidden"
                      >
                        <button 
                          className="w-full px-4 py-3 text-left text-sm text-app-text hover:bg-app-accent/5 flex items-center gap-3 transition-colors"
                          onClick={() => setIsPlusMenuOpen(false)}
                        >
                          <Paperclip className="w-4 h-4 text-app-text-muted" />
                          <span>上传附件</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                  className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-2 border ${isToolsMenuOpen ? 'bg-app-accent/10 text-app-accent border-app-accent/20' : 'hover:bg-app-pane text-app-text-muted border-transparent hover:border-app-border'}`}
                  title="工具"
                >
                  <Settings2 className="w-4 h-4" />
                  <span className="text-xs font-medium">工具</span>
                </button>

                <AnimatePresence>
                  {isToolsMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsToolsMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-0 mb-2 w-48 bg-app-pane border border-app-border rounded-xl shadow-xl z-20 overflow-hidden"
                      >
                        <button 
                          className="w-full px-4 py-3 text-left text-sm text-app-text hover:bg-app-accent/5 flex items-center gap-3 transition-colors"
                          onClick={() => {
                            setIsToolsMenuOpen(false);
                            setIsThinking(true);
                            setActiveThinkingSteps([
                              { id: 'a1', label: '正在提取会话核心要点...', status: 'active' },
                              { id: 'a2', label: '分析客户意向与潜在风险...', status: 'pending' },
                              { id: 'a3', label: '生成下一步跟进建议...', status: 'pending' },
                            ]);
                            
                            setTimeout(() => {
                              const analysisMsg: ChatMessage = {
                                id: `session-analysis-${Date.now()}`,
                                role: 'assistant',
                                text: `### 会话分析报告\n\n**核心要点：**\n1. 客户对香港重疾险的分红机制表现出浓厚兴趣。\n2. 关注点集中在等待期及跨境理赔的便捷性。\n\n**意向评估：** 强烈 (8/10)\n\n**建议行动：**\n- 发送最新的分红实现率报告。\n- 预约下周二进行视频会议，深入解析理赔流程。`
                              };
                              setMessages(prev => [...prev, analysisMsg]);
                              setIsThinking(false);
                            }, 2500);
                          }}
                        >
                          <Settings2 className="w-4 h-4 text-app-text-muted" />
                          <span>会话分析</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="absolute right-4 bottom-4 flex items-center gap-2">
              <button className="p-2 hover:bg-app-pane rounded-full text-app-text-muted transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className="p-2 bg-app-accent text-app-bg rounded-xl shadow-lg shadow-app-accent/20 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-app-text-muted mt-3 uppercase tracking-widest">
            Powered by WeKnora & LangChain
          </p>
        </div>
      </div>

      {/* Right Pane: Studio */}
      <div className="pane-right">
        <div className="p-6 border-b border-app-border flex items-center justify-between bg-app-pane backdrop-blur-md">
          <h2 className="font-bold text-app-text tracking-tight">Studio 创作空间</h2>
          <Layout className="w-5 h-5 text-app-text-muted" />
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-app-pane/20">
          {studioTiles.map(tile => (
            <motion.div
              key={tile.id}
              whileHover={{ y: -2 }}
              className="glass-card group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    tile.type === 'audio' ? 'bg-app-accent/10 text-app-accent' :
                    tile.type === 'video' ? 'bg-red-500/10 text-red-400' :
                    tile.type === 'chart' ? 'bg-app-accent/10 text-app-accent' : 'bg-app-bg text-app-text-muted'
                  }`}>
                    {tile.type === 'audio' && <Music className="w-4 h-4" />}
                    {tile.type === 'video' && <Video className="w-4 h-4" />}
                    {tile.type === 'chart' && <BarChart3 className="w-4 h-4" />}
                    {tile.type === 'note' && <FileText className="w-4 h-4" />}
                    {tile.type === 'config' && <Lock className="w-4 h-4" />}
                    {tile.type === 'material-gen' && <Zap className="w-4 h-4" />}
                    {tile.type === 'report-gen' && <FileText className="w-4 h-4" />}
                    {tile.type === 'metric' && <Activity className="w-4 h-4" />}
                  </div>
                  <h3 className="text-sm font-bold text-app-text">{tile.title}</h3>
                </div>
                <MoreVertical className="w-4 h-4 text-app-text-muted group-hover:text-app-text" />
              </div>

              {/* Tile Content Mockups */}
              {tile.type === 'audio' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-8 flex items-end gap-0.5">
                      {[...Array(20)].map((_, i) => (
                        <div key={i} className="flex-1 bg-app-accent/20 rounded-t-sm" style={{ height: `${Math.random() * 100}%` }}></div>
                      ))}
                    </div>
                  </div>
                  <div className="p-2 bg-app-bg rounded-lg border border-app-border flex items-center justify-between">
                    <span className="text-[10px] text-app-text-muted">预计消耗</span>
                    <span className="text-[10px] font-bold text-app-accent">10 Credits</span>
                  </div>
                  <button className="w-full py-2 bg-app-accent text-app-bg text-xs font-bold rounded-lg hover:bg-app-accent/90 transition-colors">
                    生成 Audio Overview
                  </button>
                </div>
              )}

              {tile.type === 'video' && (
                <div className="space-y-3">
                  <div className="aspect-video bg-app-bg rounded-xl border border-app-border flex items-center justify-center group-hover:bg-app-bg/50 transition-colors">
                    <Video className="w-8 h-8 text-app-text-muted opacity-20" />
                  </div>
                  <div className="p-2 bg-app-bg rounded-lg border border-app-border flex items-center justify-between">
                    <span className="text-[10px] text-app-text-muted">预计消耗 (50页源文件)</span>
                    <span className="text-[10px] font-bold text-red-400">50 Credits</span>
                  </div>
                  <button className="w-full py-2 bg-red-500 text-app-bg text-xs font-bold rounded-lg hover:bg-red-500/90 transition-colors">
                    生成说明视频 (Veo 3.1)
                  </button>
                </div>
              )}
              {tile.type === 'report-gen' && (
                <div className="space-y-3">
                  <div className="p-3 bg-app-bg rounded-xl border border-app-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-app-text-muted">当前进度</span>
                      <span className="text-[10px] font-bold text-app-accent">85%</span>
                    </div>
                    <div className="h-1 w-full bg-app-border rounded-full overflow-hidden">
                      <div className="h-full bg-app-accent" style={{ width: '85%' }}></div>
                    </div>
                    <div className="flex gap-1">
                      {['研究', '精算', '撰写'].map(agent => (
                        <span key={agent} className="px-1.5 py-0.5 bg-app-accent/5 text-app-accent text-[8px] rounded border border-app-accent/10">{agent}智能体</span>
                      ))}
                    </div>
                  </div>
                  <button className="w-full py-2 bg-app-accent text-app-bg text-xs font-bold rounded-lg hover:bg-app-accent/90 transition-colors">
                    生成全方位财富管理报告
                  </button>
                </div>
              )}

              {tile.type === 'metric' && (
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-app-text-muted uppercase font-bold tracking-widest">
                        {tile.title.includes('PHS') ? '个人成长 (PHS)' : '团队效能 (AIDI)'}
                      </p>
                      <p className={`text-2xl font-bold ${tile.title.includes('AIDI') ? 'text-red-400' : 'text-app-accent'}`}>
                        {tile.title.includes('PHS') ? '88' : '72%'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] font-bold ${tile.title.includes('AIDI') ? 'text-red-400' : 'text-app-accent'}`}>
                        {tile.title.includes('PHS') ? '+12% vs 昨' : '依赖度上升 ⚠️'}
                      </p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-app-bg rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${tile.title.includes('AIDI') ? 'bg-red-400' : 'bg-app-accent'}`} style={{ width: tile.title.includes('PHS') ? '88%' : '72%' }}></div>
                  </div>
                  {tile.title.includes('AIDI') && (
                    <p className="text-[9px] text-red-400/80 italic">警告：依赖度上升但技能留存下降，建议实时干预。</p>
                  )}
                </div>
              )}

              {tile.type === 'material-gen' && (
                <div className="space-y-4">
                  <p className="text-[10px] text-app-text-muted">基于选定培训资料生成多媒体课件</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2 bg-app-accent/10 text-app-accent text-[10px] font-bold rounded-lg flex items-center justify-center gap-1">
                      <Music className="w-3 h-3" /> 生成音频
                    </button>
                    <button className="py-2 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1">
                      <Video className="w-3 h-3" /> 生成视频
                    </button>
                  </div>
                </div>
              )}

              {tile.type === 'config' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-app-bg rounded-lg border border-app-border">
                    <span className="text-[10px] font-medium text-app-text-muted">移民 Agent</span>
                    <div className="w-8 h-4 bg-app-accent rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-app-bg rounded-lg border border-app-border">
                    <span className="text-[10px] font-medium text-app-text-muted">病历库访问</span>
                    <div className="w-8 h-4 bg-app-border rounded-full relative">
                      <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}

              {tile.type === 'note' && (
                <div className="space-y-2">
                  <p className="text-[10px] text-app-text-muted italic">"WeKnora 已自动模糊客户姓名、保费等隐私信息..."</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-app-accent">
                    <span>一键去私密化</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer Audio Bar */}
        <div className="p-4 bg-app-pane border-t border-app-border text-app-text shrink-0 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-app-accent/10 text-app-accent rounded-lg">
              <Music className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Now Playing</p>
              <p className="text-xs font-medium truncate">AI 专家辩论: 方案优劣分析</p>
            </div>
            <button className="px-3 py-1 bg-app-accent text-app-bg rounded-full text-[10px] font-bold hover:bg-app-accent/90 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
      {/* Recharge & Acceleration Modal */}
      <AnimatePresence>
        {showRechargeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-app-pane w-full max-w-2xl rounded-3xl border border-app-border overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-app-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-app-accent" />
                  <h3 className="text-lg font-bold text-app-text">充值与加速 (Recharge & Accelerate)</h3>
                </div>
                <button onClick={() => setShowRechargeModal(false)} className="p-2 hover:bg-app-bg rounded-xl transition-all">
                  <X className="w-5 h-5 text-app-text-muted" />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
                {/* Consumption History */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-app-text-muted uppercase tracking-widest">Token 消耗历史反馈</label>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: '今日消耗', value: billingInfo.history?.daily, unit: 'Tokens' },
                      { label: '本周累计', value: billingInfo.history?.weekly, unit: 'Tokens' },
                      { label: '本月累计', value: billingInfo.history?.monthly, unit: 'Tokens' },
                      { label: '年度累计', value: billingInfo.history?.yearly, unit: 'Tokens' },
                    ].map(item => (
                      <div key={item.label} className="bg-app-bg p-4 rounded-2xl border border-app-border text-center">
                        <p className="text-[10px] text-app-text-muted mb-1">{item.label}</p>
                        <p className="text-sm font-bold text-app-text">{(item.value! / 1000000).toFixed(2)}M</p>
                        <p className="text-[8px] text-app-text-muted opacity-60">{item.unit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subscription Upgrade */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-app-text-muted uppercase tracking-widest">升级订阅计划</label>
                  <div className="grid grid-cols-2 gap-4">
                    {subscriptionPlans.filter(p => p.name !== billingInfo.tier).map(plan => (
                      <button key={plan.id} className="p-6 bg-app-bg border border-app-border rounded-2xl text-left hover:border-app-accent transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-bold text-app-text">{plan.name}</h4>
                          <span className="text-xs font-bold text-app-accent">${plan.price}/mo</span>
                        </div>
                        <p className="text-[10px] text-app-text-muted mb-4 leading-relaxed">{plan.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-app-text">{(plan.tokens / 1000000).toFixed(0)}M Tokens</span>
                          <ArrowRight className="w-4 h-4 text-app-accent opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pay-as-you-go */}
                <div className="p-6 bg-app-accent/5 border border-app-accent/20 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-app-text">按流量计费 (Pay-as-you-go)</h4>
                    <p className="text-xs text-app-text-muted">超出配额后，将自动从弹性信用钱包扣除，费率为标准费率的 1.2x。</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs font-bold text-app-text">当前状态</p>
                      <p className="text-[10px] text-emerald-500 font-bold">已开启</p>
                    </div>
                    <div className="w-10 h-5 bg-app-accent rounded-full relative">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-app-bg rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-app-border bg-app-bg/30 flex justify-end gap-4">
                <button 
                  onClick={() => setShowRechargeModal(false)}
                  className="px-6 py-2 text-xs font-bold text-app-text-muted hover:text-app-text transition-all"
                >
                  取消
                </button>
                <button className="px-8 py-2 bg-app-accent text-app-bg text-xs font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-app-accent/20">
                  确认变更
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isAddCrawlerModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsAddCrawlerModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-app-pane border border-app-border rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-app-border flex items-center justify-between bg-app-bg/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-app-accent-soft text-app-accent rounded-xl">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-app-text">新增爬虫链接</h3>
                </div>
                <button onClick={() => setIsAddCrawlerModalOpen(false)} className="p-2 hover:bg-app-bg rounded-xl transition-all">
                  <X className="w-5 h-5 text-app-text-muted" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-app-text-muted uppercase tracking-wider">链接名称</label>
                  <input 
                    type="text" 
                    placeholder="例如：香港特区政府 (IRD)"
                    className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm text-app-text focus:outline-none focus:border-app-accent transition-all"
                    value={crawlerForm.name}
                    onChange={(e) => setCrawlerForm({ ...crawlerForm, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-app-text-muted uppercase tracking-wider">目标 URL</label>
                  <input 
                    type="text" 
                    placeholder="https://www.example.com"
                    className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm text-app-text focus:outline-none focus:border-app-accent transition-all"
                    value={crawlerForm.url}
                    onChange={(e) => setCrawlerForm({ ...crawlerForm, url: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-app-text-muted uppercase tracking-wider">抓取频率</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['24小时', '每周', '每月'].map(freq => (
                      <button
                        key={freq}
                        onClick={() => setCrawlerForm({ ...crawlerForm, frequency: freq })}
                        className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                          crawlerForm.frequency === freq 
                            ? 'bg-app-accent border-app-accent text-app-bg' 
                            : 'bg-app-bg border-app-border text-app-text-muted hover:border-app-accent/50'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-app-border bg-app-bg/30 flex justify-end gap-4">
                <button 
                  onClick={() => setIsAddCrawlerModalOpen(false)}
                  className="px-6 py-2 text-xs font-bold text-app-text-muted hover:text-app-text transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    if (crawlerForm.name && crawlerForm.url) {
                      const newCrawler: CrawlerConfig = {
                        id: `c${crawlerConfigs.length + 1}`,
                        name: crawlerForm.name,
                        url: crawlerForm.url,
                        schedule: `每 ${crawlerForm.frequency}`,
                        status: 'active',
                        lastRun: '-'
                      };
                      setCrawlerConfigs(prev => [...prev, newCrawler]);
                      setIsAddCrawlerModalOpen(false);
                      setCrawlerForm({ name: '', url: '', frequency: '24小时' });
                    }
                  }}
                  className="px-8 py-2 bg-app-accent text-app-bg text-xs font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-app-accent/20"
                >
                  确认新增
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

