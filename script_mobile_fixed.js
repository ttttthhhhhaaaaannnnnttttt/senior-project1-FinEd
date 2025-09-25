class FinEdApp {
    constructor() {
        this.currentPage = 'welcome-page';
        this.userData = {
            name: '',
            email: '',
            dateOfBirth: '',
            university: '',
            allowance: 0,
            warningAmount: 0,
            balance: 0,
            income: 0,
            expenses: 0
        };
        this.transactions = [];
        this.goals = [];
        this.budgets = {};
        this.budgetPlans = []; // New: Budget plans array
        this.goalPlans = []; // New: Goal plans array
        this.alarms = [];
        this.alertHistory = [];
        this.settings = { spendingAlerts: true };
        this._lastWarnState = false;
        
        // New data structures for enhanced functionality
        this.emergencyFunds = [];
        this.investmentPlans = [];
        this.spendingChart = null;
        this.incomeExpenseChart = null;
        
        // Language system
        this.currentLanguage = localStorage.getItem('finedLanguage') || 'en';
        this.translations = this.initializeTranslations();
        
        // Authentication
        this.isAuthenticated = false;
        this.authMethod = null; // 'manual' or 'google'
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        
        // Initially hide navigation for welcome page
        this.controlNavigationVisibility('welcome-page');
        
        // Check for existing session
        const session = this.validateSession();
        if (session) {
            this.userData.email = session.userId;
            this.authMethod = session.authMethod;
            this.isAuthenticated = true;
            this.loadUserData();
            this.showPage('home-page');
            this.updateUI();
        } else {
            this.startWelcomeSequence();
        }
        
        this.updateLanguage();
        this.initializeGoogleAuth();
    }

    initializeTranslations() {
        return {
            en: {
                // Navigation
                'Home': 'Home',
                'Expense': 'Expense',
                'Income': 'Income',
                'Progress': 'Progress',
                'Investment': 'Investment',
                'Emergency': 'Emergency',
                'Alerts': 'Alerts',
                
                // Welcome & Auth
                'Finance + Education': 'Finance + Education',
                'Welcome Back': 'Welcome Back',
                'Sign in to continue your financial journey': 'Sign in to continue your financial journey',
                'Sign In': 'Sign In',
                'Create Account': 'Create Account',
                'Join FinEd to start managing your finances': 'Join FinEd to start managing your finances',
                'Sign Up': 'Sign Up',
                
                // Profile
                'Complete Your Profile': 'Complete Your Profile',
                'Help us personalize your experience': 'Help us personalize your experience',
                'Full Name': 'Full Name',
                'Date of Birth': 'Date of Birth',
                'University': 'University',
                'Monthly Allowance': 'Monthly Allowance',
                'Warning Amount (Alert when expenses exceed this)': 'Warning Amount (Alert when expenses exceed this)',
                'Language': 'Language',
                'Save Profile': 'Save Profile',
                'Delete Profile': 'Delete Profile',
                
                // Home
                'Hello, Student!': 'Hello, Student!',
                'Here\'s your financial overview': 'Here\'s your financial overview',
                'Current Balance': 'Current Balance',
                'Expenses': 'Expenses',
                'Overview': 'Overview',
                'Recent': 'Recent',
                'Budget': 'Budget',
                'Manage your spending': 'Manage your spending',
                'Goals': 'Goals',
                'Track your savings': 'Track your savings',
                'Reports': 'Reports',
                'View your progress': 'View your progress',
                'Wallet': 'Wallet',
                'Manage accounts': 'Manage accounts',
                
                // Budget Plans
                'Create Budget Plan': 'Create Budget Plan',
                'Plan Name': 'Plan Name',
                'Budget Amount': 'Budget Amount',
                'Time Period': 'Time Period',
                'Budget Plans': 'Budget Plans',
                
                // Goal Plans
                'Create Goal Plan': 'Create Goal Plan',
                'Goal Name': 'Goal Name',
                'Target Amount': 'Target Amount',
                'Current Amount': 'Current Amount',
                'Target Date': 'Target Date',
                'Priority': 'Priority',
                
                // Emergency & Investment
                'Emergency Fund': 'Emergency Fund',
                'Investment Portfolio': 'Investment Portfolio',
                'Add Emergency Fund': 'Add Emergency Fund',
                'Add Investment Plan': 'Add Investment Plan',
                'Fund Name': 'Fund Name',
                'Description': 'Description',
                'Create Emergency Fund': 'Create Emergency Fund',
                'Investment Name': 'Investment Name',
                'Investment Type': 'Investment Type',
                'Initial Investment': 'Initial Investment',
                'Risk Level': 'Risk Level',
                'Investment Goal': 'Investment Goal',
                'Create Investment Plan': 'Create Investment Plan',
                
                // Investment
                'Portfolio Value': 'Portfolio Value',
                'Investment Categories': 'Investment Categories',
                'Stocks': 'Stocks',
                'Bonds': 'Bonds',
                'Crypto': 'Crypto',
                'Mutual Funds': 'Mutual Funds',
                'Performance': 'Performance',
                'Investment Goals': 'Investment Goals',
                'Learn About Investing': 'Learn About Investing',
                
                // Forms
                'Category': 'Category',
                'Source': 'Source',
                'Date': 'Date',
                'Add Expense': 'Add Expense',
                'Add Income': 'Add Income',
                
                // Progress
                'Monthly Summary': 'Monthly Summary',
                'Spending by Category': 'Spending by Category',
                'Savings': 'Savings',
                
                // Alerts
                'Alert Status': 'Alert Status',
                'Spending Alerts': 'Spending Alerts',
                'Get notified when you exceed your spending limit': 'Get notified when you exceed your spending limit',
                'Goal Reminders': 'Goal Reminders',
                'Remind me about my financial goals': 'Remind me about my financial goals',
                'Budget Alerts': 'Budget Alerts',
                'Alert when approaching budget limits': 'Alert when approaching budget limits',
                'Alert History': 'Alert History',
                
                // Language
                'Language': 'Language',
                'English': 'English',
                'Thai': 'Thai'
            },
            th: {
                // Navigation
                'Home': 'หน้าหลัก',
                'Expense': 'รายจ่าย',
                'Income': 'รายรับ',
                'Progress': 'ความคืบหน้า',
                'Investment': 'การลงทุน',
                'Emergency': 'ฉุกเฉิน',
                'Alerts': 'การแจ้งเตือน',
                
                // Welcome & Auth
                'Finance + Education': 'การเงิน + การศึกษา',
                'Welcome Back': 'ยินดีต้อนรับกลับ',
                'Sign in to continue your financial journey': 'เข้าสู่ระบบเพื่อดำเนินการทางการเงินต่อ',
                'Sign In': 'เข้าสู่ระบบ',
                'Create Account': 'สร้างบัญชี',
                'Join FinEd to start managing your finances': 'เข้าร่วม FinEd เพื่อเริ่มจัดการการเงินของคุณ',
                'Sign Up': 'สมัครสมาชิก',
                
                // Profile
                'Complete Your Profile': 'กรอกข้อมูลโปรไฟล์',
                'Help us personalize your experience': 'ช่วยเราปรับแต่งประสบการณ์ของคุณ',
                'Full Name': 'ชื่อ-นามสกุล',
                'Date of Birth': 'วันเกิด',
                'University': 'มหาวิทยาลัย',
                'Monthly Allowance': 'เงินรายเดือน',
                'Warning Amount (Alert when expenses exceed this)': 'จำนวนเงินเตือน (แจ้งเตือนเมื่อค่าใช้จ่ายเกิน)',
                'Language': 'ภาษา',
                'Save Profile': 'บันทึกโปรไฟล์',
                'Delete Profile': 'ลบโปรไฟล์',
                
                // Home
                'Hello, Student!': 'สวัสดี นักศึกษา!',
                'Here\'s your financial overview': 'นี่คือภาพรวมการเงินของคุณ',
                'Current Balance': 'ยอดเงินปัจจุบัน',
                'Expenses': 'รายจ่าย',
                'Overview': 'ภาพรวม',
                'Recent': 'ล่าสุด',
                'Budget': 'งบประมาณ',
                'Manage your spending': 'จัดการการใช้จ่าย',
                'Goals': 'เป้าหมาย',
                'Track your savings': 'ติดตามการออม',
                'Reports': 'รายงาน',
                'View your progress': 'ดูความคืบหน้า',
                'Wallet': 'กระเป๋าเงิน',
                'Manage accounts': 'จัดการบัญชี'
            }
        };
    }

    // Enhanced updateFinancialData with proper balance calculation
    updateFinancialData() {
        this.userData.income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        this.userData.expenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        // Fixed balance calculation - always show remaining amount
        this.userData.balance = this.userData.income - this.userData.expenses;
    }

    addSampleData() {
        // Sample transactions
        if (this.transactions.length === 0) {
            this.transactions = [
                {
                    id: 1,
                    type: 'income',
                    amount: 5000,
                    source: 'allowance',
                    description: 'Monthly allowance',
                    date: '2024-01-01',
                    timestamp: new Date('2024-01-01').toISOString()
                },
                {
                    id: 2,
                    type: 'expense',
                    amount: 150,
                    category: 'food',
                    description: 'Lunch',
                    date: '2024-01-02',
                    timestamp: new Date('2024-01-02').toISOString()
                }
            ];
        }

        // Sample emergency funds
        if (this.emergencyFunds.length === 0) {
            this.emergencyFunds = [
                {
                    id: 1,
                    name: 'Medical Emergency',
                    targetAmount: 3000,
                    currentAmount: 1250,
                    priority: 'high',
                    description: 'For unexpected medical expenses'
                }
            ];
        }

        // Sample investment plans
        if (this.investmentPlans.length === 0) {
            this.investmentPlans = [
                {
                    id: 1,
                    name: 'Tech Stocks',
                    type: 'stocks',
                    amount: 1350,
                    risk: 'medium',
                    goal: 'Long-term growth investment'
                },
                {
                    id: 2,
                    name: 'Government Bonds',
                    type: 'bonds',
                    amount: 800,
                    risk: 'low',
                    goal: 'Safe investment with steady returns'
                }
            ];
        }

        // Sample budget plans
        if (this.budgetPlans.length === 0) {
            this.budgetPlans = [
                {
                    id: 1,
                    name: 'Food Budget',
                    category: 'food',
                    amount: 1500,
                    period: 'monthly',
                    description: 'Monthly food and dining budget',
                    spent: 450,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Transportation Budget',
                    category: 'transport',
                    amount: 800,
                    period: 'monthly',
                    description: 'Monthly transportation costs',
                    spent: 200,
                    createdAt: new Date().toISOString()
                }
            ];
        }

        // Sample goal plans
        if (this.goalPlans.length === 0) {
            this.goalPlans = [
                {
                    id: 1,
                    name: 'New Laptop',
                    targetAmount: 25000,
                    currentAmount: 8500,
                    targetDate: '2024-12-31',
                    priority: 'high',
                    description: 'Save for a new laptop for studies',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Study Abroad Fund',
                    targetAmount: 100000,
                    currentAmount: 15000,
                    targetDate: '2025-06-30',
                    priority: 'medium',
                    description: 'Save for study abroad program',
                    createdAt: new Date().toISOString()
                }
            ];
        }
    }

    setupEventListeners() {
        // Welcome page auto-transition
        setTimeout(() => {
            if (this.currentPage === 'welcome-page') {
                this.showPage('login-page');
            }
        }, 3000);

        // Auth navigation
        document.getElementById('go-to-signup')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('signup-page');
        });

        document.getElementById('go-to-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('login-page');
        });

        // Form submissions
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('signup-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        document.getElementById('profile-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileSave();
        });

        document.getElementById('expense-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleExpenseAdd();
        });

        document.getElementById('salary-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleIncomeAdd();
        });

        // Budget Plan Modal
        document.getElementById('add-budget-btn')?.addEventListener('click', () => {
            this.showModal('budget-plan-modal');
        });

        document.getElementById('close-budget-plan-modal')?.addEventListener('click', () => {
            this.hideModal('budget-plan-modal');
        });

        document.getElementById('budget-plan-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBudgetPlanAdd();
        });

        // Goal Plan Modal
        document.getElementById('add-goal-btn')?.addEventListener('click', () => {
            this.showModal('goal-plan-modal');
        });

        document.getElementById('close-goal-plan-modal')?.addEventListener('click', () => {
            this.hideModal('goal-plan-modal');
        });

        document.getElementById('goal-plan-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleGoalPlanAdd();
        });

        // Emergency Fund Modal
        document.getElementById('add-emergency-fund-btn')?.addEventListener('click', () => {
            this.showModal('emergency-fund-modal');
        });

        document.getElementById('close-emergency-fund-modal')?.addEventListener('click', () => {
            this.hideModal('emergency-fund-modal');
        });

        document.getElementById('emergency-fund-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEmergencyFundAdd();
        });

        // Investment Plan Modal
        document.getElementById('add-investment-plan-btn')?.addEventListener('click', () => {
            this.showModal('investment-plan-modal');
        });

        document.getElementById('close-investment-plan-modal')?.addEventListener('click', () => {
            this.hideModal('investment-plan-modal');
        });

        document.getElementById('investment-plan-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleInvestmentPlanAdd();
        });

        // Profile management
        document.getElementById('open-profile')?.addEventListener('click', () => {
            this.showPage('profile-page');
            this.prefillProfile();
        });

        document.getElementById('delete-profile-btn')?.addEventListener('click', () => {
            this.deleteProfile();
        });

        // Language switcher
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const language = btn.dataset.lang;
                this.changeLanguage(language);
                this.updateLanguageButtons();
            });
        });

        // Bottom navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                this.showPage(page + '-page');
                this.updateNavigation(btn);
            });
        });

        // Back buttons
        document.querySelectorAll('.btn-back').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showPage('home-page');
            });
        });

        // New page back buttons
        document.getElementById('budget-back-btn')?.addEventListener('click', () => {
            this.showPage('home-page');
        });

        document.getElementById('goals-back-btn')?.addEventListener('click', () => {
            this.showPage('home-page');
        });

        document.getElementById('report-back-btn')?.addEventListener('click', () => {
            this.showPage('home-page');
        });

        document.getElementById('wallet-back-btn')?.addEventListener('click', () => {
            this.showPage('home-page');
        });

        // Home page quick actions
        document.getElementById('add-income-btn')?.addEventListener('click', () => {
            this.showPage('salary-page');
        });

        document.getElementById('add-expense-btn')?.addEventListener('click', () => {
            this.showPage('expense-page');
        });

        // Overview cards navigation
        document.getElementById('go-to-budget')?.addEventListener('click', () => {
            this.showPage('budget-page');
        });

        document.getElementById('go-to-goals')?.addEventListener('click', () => {
            this.showPage('goals-page');
        });

        document.getElementById('go-to-reports')?.addEventListener('click', () => {
            this.showPage('report-page');
        });

        document.getElementById('go-to-wallet')?.addEventListener('click', () => {
            this.showPage('wallet-page');
        });

        // Enhanced tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                this.switchTab(tabName);
                this.updateTabButtons(btn);
            });
        });

        // Warning alert close
        document.getElementById('close-warning')?.addEventListener('click', () => {
            this.hideWarningAlert();
        });

        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        const expenseDateEl = document.getElementById('expense-date');
        const salaryDateEl = document.getElementById('salary-date');
        const goalDateEl = document.getElementById('goal-plan-date');
        
        if (expenseDateEl) expenseDateEl.value = today;
        if (salaryDateEl) salaryDateEl.value = today;
        if (goalDateEl) {
            // Set default goal date to 6 months from now
            const futureDate = new Date();
            futureDate.setMonth(futureDate.getMonth() + 6);
            goalDateEl.value = futureDate.toISOString().split('T')[0];
        }

        // Modal click outside to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    // NEW: Budget Plan functionality
    handleBudgetPlanAdd() {
        const name = document.getElementById('budget-plan-name').value;
        const category = document.getElementById('budget-plan-category').value;
        const amount = parseFloat(document.getElementById('budget-plan-amount').value);
        const period = document.getElementById('budget-plan-period').value;
        const description = document.getElementById('budget-plan-description').value;

        if (!name || !category || !amount || !period) {
            alert('Please fill in all required fields');
            return;
        }

        const newBudgetPlan = {
            id: Date.now(),
            name,
            category,
            amount,
            period,
            description,
            spent: 0, // Track how much has been spent
            createdAt: new Date().toISOString()
        };

        this.budgetPlans.push(newBudgetPlan);
        this.saveUserData();
        this.hideModal('budget-plan-modal');
        this.updateBudgetPage();
        
        // Reset form
        document.getElementById('budget-plan-form').reset();
        
        alert('Budget plan created successfully!');
    }

    // NEW: Goal Plan functionality
    handleGoalPlanAdd() {
        const name = document.getElementById('goal-plan-name').value;
        const targetAmount = parseFloat(document.getElementById('goal-plan-target').value);
        const currentAmount = parseFloat(document.getElementById('goal-plan-current').value) || 0;
        const targetDate = document.getElementById('goal-plan-date').value;
        const priority = document.getElementById('goal-plan-priority').value;
        const description = document.getElementById('goal-plan-description').value;

        if (!name || !targetAmount || !targetDate || !priority) {
            alert('Please fill in all required fields');
            return;
        }

        const newGoalPlan = {
            id: Date.now(),
            name,
            targetAmount,
            currentAmount,
            targetDate,
            priority,
            description,
            createdAt: new Date().toISOString()
        };

        this.goalPlans.push(newGoalPlan);
        this.saveUserData();
        this.hideModal('goal-plan-modal');
        this.updateGoalsPage();
        
        // Reset form
        document.getElementById('goal-plan-form').reset();
        
        alert('Goal plan created successfully!');
    }

    // Enhanced user data management
    loadUserByEmail(email) {
        const users = JSON.parse(localStorage.getItem('finedUsers') || '{}');
        return users[email] || null;
    }

    saveUserData() {
        const users = JSON.parse(localStorage.getItem('finedUsers') || '{}');
        users[this.userData.email] = {
            ...this.userData,
            transactions: this.transactions,
            emergencyFunds: this.emergencyFunds,
            investmentPlans: this.investmentPlans,
            goals: this.goals,
            budgets: this.budgets,
            budgetPlans: this.budgetPlans, // NEW: Save budget plans
            goalPlans: this.goalPlans, // NEW: Save goal plans
            alarms: this.alarms,
            alertHistory: this.alertHistory,
            settings: this.settings
        };
        localStorage.setItem('finedUsers', JSON.stringify(users));
    }

    loadUserData() {
        if (this.userData.email) {
            const userData = this.loadUserByEmail(this.userData.email);
            if (userData) {
                this.transactions = userData.transactions || [];
                this.emergencyFunds = userData.emergencyFunds || [];
                this.investmentPlans = userData.investmentPlans || [];
                this.goals = userData.goals || [];
                this.budgets = userData.budgets || {};
                this.budgetPlans = userData.budgetPlans || []; // NEW: Load budget plans
                this.goalPlans = userData.goalPlans || []; // NEW: Load goal plans
                this.alarms = userData.alarms || [];
                this.alertHistory = userData.alertHistory || [];
                this.settings = userData.settings || { spendingAlerts: true };
            }
        }
    }

    // Enhanced password hashing with salt
    hashPassword(password) {
        const salt = this.generateSalt();
        const hash = this.simpleHash(password + salt);
        return { hash, salt };
    }

    verifyPassword(password, storedPassword) {
        if (typeof storedPassword === 'string') {
            // Legacy password format (base64)
            return btoa(password) === storedPassword;
        }
        // New format with salt
        const hash = this.simpleHash(password + storedPassword.salt);
        return hash === storedPassword.hash;
    }

    generateSalt() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Session management
    createSession() {
        const sessionId = this.generateSessionId();
        const sessionData = {
            userId: this.userData.email,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
            authMethod: this.authMethod
        };
        
        localStorage.setItem('finedSession', JSON.stringify({
            sessionId,
            ...sessionData
        }));
        
        return sessionId;
    }

    validateSession() {
        const session = JSON.parse(localStorage.getItem('finedSession') || '{}');
        if (!session.sessionId || !session.expiresAt) {
            return false;
        }
        
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        
        if (now > expiresAt) {
            this.clearSession();
            return false;
        }
        
        return session;
    }

    clearSession() {
        localStorage.removeItem('finedSession');
        this.isAuthenticated = false;
        this.authMethod = null;
    }

    generateSessionId() {
        return 'sess_' + Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15) + 
               Date.now().toString(36);
    }

    // Enhanced data encryption for sensitive information
    encryptSensitiveData(data) {
        // Simple encryption (in production, use proper encryption libraries)
        const key = this.userData.email + 'finedkey';
        let encrypted = '';
        for (let i = 0; i < data.length; i++) {
            encrypted += String.fromCharCode(
                data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        return btoa(encrypted);
    }

    decryptSensitiveData(encryptedData) {
        try {
            const key = this.userData.email + 'finedkey';
            const data = atob(encryptedData);
            let decrypted = '';
            for (let i = 0; i < data.length; i++) {
                decrypted += String.fromCharCode(
                    data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
                );
            }
            return decrypted;
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }

    // Enhanced expense handling with budget tracking
    handleExpenseAdd() {
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const description = document.getElementById('expense-description').value;
        const date = document.getElementById('expense-date').value;

        if (!amount || !category || !date) {
            alert('Please fill in all required fields');
            return;
        }

        const expense = {
            id: Date.now(),
            type: 'expense',
            amount,
            category,
            description,
            date,
            timestamp: new Date().toISOString()
        };

        this.transactions.push(expense);
        
        // Update budget plan spending
        this.updateBudgetPlanSpending(category, amount);
        
        this.updateFinancialData();
        this.saveUserData();
        this.updateUI();
        this.checkWarningAlert();
        
        // Update chart if on progress page
        if (this.currentPage === 'progress-page') {
            this.createSpendingChart();
        }

        // Reset form
        document.getElementById('expense-form').reset();
        document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];

        this.showPage('home-page');
        alert('Expense added successfully!');
    }

    // NEW: Update budget plan spending when expense is added
    updateBudgetPlanSpending(category, amount) {
        this.budgetPlans.forEach(plan => {
            if (plan.category === category) {
                plan.spent = (plan.spent || 0) + amount;
            }
        });
    }

    // Enhanced income handling
    handleIncomeAdd() {
        const amount = parseFloat(document.getElementById('salary-amount').value);
        const source = document.getElementById('salary-source').value;
        const description = document.getElementById('salary-description').value;
        const date = document.getElementById('salary-date').value;

        if (!amount || !source || !date) {
            alert('Please fill in all required fields');
            return;
        }

        const income = {
            id: Date.now(),
            type: 'income',
            amount,
            source,
            description,
            date,
            timestamp: new Date().toISOString()
        };

        this.transactions.push(income);
        this.updateFinancialData();
        this.saveUserData();
        this.updateUI();
        
        // Update chart if on progress page
        if (this.currentPage === 'progress-page') {
            this.createSpendingChart();
        }

        // Reset form
        document.getElementById('salary-form').reset();
        document.getElementById('salary-date').value = new Date().toISOString().split('T')[0];

        this.showPage('home-page');
        alert('Income added successfully!');
    }

    // Enhanced profile management
    handleProfileSave() {
        const name = document.getElementById('profile-name').value;
        const dateOfBirth = document.getElementById('profile-date-of-birth').value;
        const university = document.getElementById('profile-university').value;
        const allowance = parseFloat(document.getElementById('profile-allowance').value) || 0;
        const warningAmount = parseFloat(document.getElementById('profile-warning-amount').value) || 0;

        this.userData.name = name;
        this.userData.dateOfBirth = dateOfBirth;
        this.userData.university = university;
        this.userData.allowance = allowance;
        this.userData.warningAmount = warningAmount;

        this.saveUserData();
        this.updateUI();
        this.showPage('home-page');
        alert('Profile saved successfully!');
    }

    prefillProfile() {
        document.getElementById('profile-name').value = this.userData.name || '';
        document.getElementById('profile-date-of-birth').value = this.userData.dateOfBirth || '';
        document.getElementById('profile-university').value = this.userData.university || '';
        document.getElementById('profile-allowance').value = this.userData.allowance || '';
        document.getElementById('profile-warning-amount').value = this.userData.warningAmount || '';
    }

    deleteProfile() {
        if (confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
            const users = JSON.parse(localStorage.getItem('finedUsers') || '{}');
            delete users[this.userData.email];
            localStorage.setItem('finedUsers', JSON.stringify(users));
            
            // Reset app state
            this.userData = {
                name: '',
                email: '',
                dateOfBirth: '',
                university: '',
                allowance: 0,
                warningAmount: 0,
                balance: 0,
                income: 0,
                expenses: 0
            };
            this.transactions = [];
            this.emergencyFunds = [];
            this.investmentPlans = [];
            this.goals = [];
            this.budgets = {};
            this.budgetPlans = [];
            this.goalPlans = [];
            this.alarms = [];
            this.alertHistory = [];
            this.isAuthenticated = false;
            this.authMethod = null;
            
            this.showPage('login-page');
            alert('Profile deleted successfully');
        }
    }

    // Enhanced UI Updates with fixed balance display
    updateUI() {
        // Update balance display - FIXED: Always show current balance
        const balanceEl = document.getElementById('current-balance');
        const incomeEl = document.getElementById('total-income');
        const expensesEl = document.getElementById('total-expenses');
        const userNameEl = document.getElementById('user-name');
        const alertRemainingBalanceEl = document.getElementById('alert-remaining-balance');

        if (balanceEl) balanceEl.textContent = this.userData.balance.toFixed(2);
        if (incomeEl) incomeEl.textContent = this.userData.income.toFixed(2);
        if (expensesEl) expensesEl.textContent = this.userData.expenses.toFixed(2);
        if (userNameEl) userNameEl.textContent = this.userData.name || 'Student';
        
        // FIXED: Update remaining balance in alert
        if (alertRemainingBalanceEl) {
            alertRemainingBalanceEl.textContent = this.userData.balance.toFixed(2);
        }

        // Update progress page
        const progressIncomeEl = document.getElementById('progress-income');
        const progressExpensesEl = document.getElementById('progress-expenses');
        const progressSavingsEl = document.getElementById('progress-savings');

        if (progressIncomeEl) progressIncomeEl.textContent = this.userData.income.toFixed(2);
        if (progressExpensesEl) progressExpensesEl.textContent = this.userData.expenses.toFixed(2);
        if (progressSavingsEl) progressSavingsEl.textContent = this.userData.balance.toFixed(2);

        this.updateEmergencyFundDisplay();
        this.updateInvestmentDisplay();
    }

    // Enhanced Budget Page with budget plans
    updateBudgetPage() {
        // Update monthly budget display
        const monthlyBudgetEl = document.getElementById('monthly-budget');
        const budgetRemainingEl = document.getElementById('budget-remaining');
        
        const totalBudget = this.userData.allowance || 0;
        const remaining = totalBudget - this.userData.expenses;
        
        if (monthlyBudgetEl) monthlyBudgetEl.textContent = totalBudget.toFixed(2);
        if (budgetRemainingEl) budgetRemainingEl.textContent = remaining.toFixed(2);
        
        // Update budget plans list
        const budgetListEl = document.getElementById('budget-list');
        if (budgetListEl) {
            if (this.budgetPlans.length === 0) {
                budgetListEl.innerHTML = '<p class="no-budgets">No budget plans set yet</p>';
            } else {
                budgetListEl.innerHTML = this.budgetPlans.map(plan => {
                    const progress = plan.amount > 0 ? (plan.spent / plan.amount) * 100 : 0;
                    const remaining = plan.amount - plan.spent;
                    const statusClass = progress > 100 ? 'over-budget' : progress > 80 ? 'warning' : 'good';
                    
                    return `
                        <div class="budget-plan-item ${statusClass}">
                            <div class="budget-plan-header">
                                <h4>${plan.name}</h4>
                                <span class="budget-plan-period">${plan.period}</span>
                            </div>
                            <div class="budget-plan-category">${plan.category}</div>
                            <div class="budget-plan-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                                </div>
                                <div class="budget-plan-amounts">
                                    <span class="spent">฿${plan.spent.toFixed(2)}</span>
                                    <span class="total">/ ฿${plan.amount.toFixed(2)}</span>
                                </div>
                            </div>
                            <div class="budget-plan-remaining ${remaining < 0 ? 'negative' : ''}">
                                Remaining: ฿${remaining.toFixed(2)}
                            </div>
                            ${plan.description ? `<p class="budget-plan-description">${plan.description}</p>` : ''}
                        </div>
                    `;
                }).join('');
            }
        }
    }

    // Enhanced Goals Page with goal plans
    updateGoalsPage() {
        const activeGoalsEl = document.getElementById('active-goals-count');
        const totalSavedEl = document.getElementById('total-saved');
        
        if (activeGoalsEl) activeGoalsEl.textContent = this.goalPlans.length;
        
        const totalSaved = this.goalPlans.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
        if (totalSavedEl) totalSavedEl.textContent = totalSaved.toFixed(2);
        
        // Update goals list
        const goalsListEl = document.getElementById('goals-list');
        if (goalsListEl) {
            if (this.goalPlans.length === 0) {
                goalsListEl.innerHTML = '<p class="no-goals">No goals set yet</p>';
            } else {
                goalsListEl.innerHTML = this.goalPlans.map(goal => {
                    const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                    const remaining = goal.targetAmount - goal.currentAmount;
                    const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
                    const priorityClass = goal.priority === 'high' ? 'high-priority' : goal.priority === 'medium' ? 'medium-priority' : 'low-priority';
                    
                    return `
                        <div class="goal-plan-item ${priorityClass}">
                            <div class="goal-plan-header">
                                <h4>${goal.name}</h4>
                                <span class="goal-priority ${goal.priority}">${goal.priority}</span>
                            </div>
                            <div class="goal-plan-amounts">
                                <span class="current">฿${goal.currentAmount.toFixed(2)}</span>
                                <span class="target">/ ฿${goal.targetAmount.toFixed(2)}</span>
                            </div>
                            <div class="goal-plan-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                                </div>
                                <span class="progress-percentage">${progress.toFixed(1)}%</span>
                            </div>
                            <div class="goal-plan-details">
                                <div class="remaining-amount">Remaining: ฿${remaining.toFixed(2)}</div>
                                <div class="target-date">Target: ${new Date(goal.targetDate).toLocaleDateString()}</div>
                                <div class="days-left ${daysLeft < 30 ? 'urgent' : ''}">${daysLeft} days left</div>
                            </div>
                            ${goal.description ? `<p class="goal-plan-description">${goal.description}</p>` : ''}
                            <div class="goal-plan-actions">
                                <button class="btn-small btn-primary" onclick="app.addToGoal(${goal.id})">Add Money</button>
                                <button class="btn-small btn-secondary" onclick="app.editGoal(${goal.id})">Edit</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    // NEW: Add money to goal
    addToGoal(goalId) {
        const amount = prompt('Enter amount to add to this goal:');
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
            const goal = this.goalPlans.find(g => g.id === goalId);
            if (goal) {
                goal.currentAmount += parseFloat(amount);
                this.saveUserData();
                this.updateGoalsPage();
                alert(`Added ฿${parseFloat(amount).toFixed(2)} to ${goal.name}!`);
            }
        }
    }

    // NEW: Edit goal (placeholder for future enhancement)
    editGoal(goalId) {
        alert('Edit goal functionality coming soon!');
    }

    // Chart functionality for progress page
    createSpendingChart() {
        const canvas = document.getElementById('spending-chart');
        if (!canvas) return;

        // Destroy existing chart if it exists
        if (this.spendingChart) {
            this.spendingChart.destroy();
        }

        // Get expense transactions and group by category
        const expenseTransactions = this.transactions.filter(t => t.type === 'expense');
        const categoryTotals = {};
        
        expenseTransactions.forEach(transaction => {
            const category = transaction.category;
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            categoryTotals[category] += transaction.amount;
        });

        // Prepare data for chart
        const categories = Object.keys(categoryTotals);
        const amounts = Object.values(categoryTotals);
        
        // If no data, show empty state
        if (categories.length === 0) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#666';
            ctx.font = '14px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText('No spending data available', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Color palette for categories
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
            '#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56'
        ];

        // Create the chart
        const ctx = canvas.getContext('2d');
        this.spendingChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
                datasets: [{
                    data: amounts,
                    backgroundColor: colors.slice(0, categories.length),
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ฿${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    // Update progress page data and chart
    updateProgressPage() {
        // Update progress summary
        const progressIncomeEl = document.getElementById('progress-income');
        const progressExpensesEl = document.getElementById('progress-expenses');
        const progressSavingsEl = document.getElementById('progress-savings');

        if (progressIncomeEl) progressIncomeEl.textContent = this.userData.income.toFixed(2);
        if (progressExpensesEl) progressExpensesEl.textContent = this.userData.expenses.toFixed(2);
        if (progressSavingsEl) progressSavingsEl.textContent = this.userData.balance.toFixed(2);

        // Create/update the spending chart
        this.createSpendingChart();
    }

    // Update Report Page
    updateReportPage() {
        const reportIncomeEl = document.getElementById('report-income');
        const reportExpensesEl = document.getElementById('report-expenses');
        const reportSavingsEl = document.getElementById('report-savings');
        
        if (reportIncomeEl) reportIncomeEl.textContent = this.userData.income.toFixed(2);
        if (reportExpensesEl) reportExpensesEl.textContent = this.userData.expenses.toFixed(2);
        if (reportSavingsEl) reportSavingsEl.textContent = this.userData.balance.toFixed(2);
        
        // Create income vs expenses chart
        this.createIncomeExpenseChart();
        
        // Generate basic insights
        this.generateFinancialInsights();
    }

    // Create Income vs Expense Chart
    createIncomeExpenseChart() {
        const canvas = document.getElementById('income-expense-chart');
        if (!canvas) return;

        // Destroy existing chart if it exists
        if (this.incomeExpenseChart) {
            this.incomeExpenseChart.destroy();
        }

        const ctx = canvas.getContext('2d');
        this.incomeExpenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Income', 'Expenses', 'Savings'],
                datasets: [{
                    data: [this.userData.income, this.userData.expenses, this.userData.balance],
                    backgroundColor: ['#28a745', '#dc3545', '#007bff'],
                    borderColor: ['#1e7e34', '#c82333', '#0056b3'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '฿' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    // Generate Financial Insights
    generateFinancialInsights() {
        const insightsEl = document.getElementById('insights-list');
        if (!insightsEl) return;

        const insights = [];
        
        // Savings rate insight
        if (this.userData.income > 0) {
            const savingsRate = (this.userData.balance / this.userData.income) * 100;
            if (savingsRate > 20) {
                insights.push('Great job! You\'re saving more than 20% of your income.');
            } else if (savingsRate > 10) {
                insights.push('Good savings rate! Try to increase it to 20% for better financial health.');
            } else {
                insights.push('Consider increasing your savings rate to at least 10% of your income.');
            }
        }
        
        // Spending pattern insight
        if (this.userData.expenses > this.userData.income) {
            insights.push('Warning: Your expenses exceed your income. Review your spending habits.');
        }
        
        // Budget insight
        if (this.userData.allowance > 0 && this.userData.expenses > this.userData.allowance) {
            insights.push('You\'ve exceeded your monthly allowance. Consider creating a budget plan.');
        }

        // Budget plan insights
        const overBudgetPlans = this.budgetPlans.filter(plan => plan.spent > plan.amount);
        if (overBudgetPlans.length > 0) {
            insights.push(`You've exceeded the budget for ${overBudgetPlans.length} category(ies). Review your spending.`);
        }

        // Goal insights
        const nearTargetGoals = this.goalPlans.filter(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return progress > 80;
        });
        if (nearTargetGoals.length > 0) {
            insights.push(`You're close to achieving ${nearTargetGoals.length} goal(s)! Keep it up!`);
        }

        if (insights.length === 0) {
            insights.push('Keep tracking your expenses to generate personalized insights.');
        }

        insightsEl.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <i class="fas fa-lightbulb"></i>
                <p>${insight}</p>
            </div>
        `).join('');
    }

    // Update Wallet Page
    updateWalletPage() {
        const walletBalanceEl = document.getElementById('wallet-balance');
        const mainAccountBalanceEl = document.getElementById('main-account-balance');
        
        if (walletBalanceEl) walletBalanceEl.textContent = this.userData.balance.toFixed(2);
        if (mainAccountBalanceEl) mainAccountBalanceEl.textContent = this.userData.balance.toFixed(2);
        
        // Update wallet activity with recent transactions
        const walletActivityEl = document.getElementById('wallet-activity');
        if (walletActivityEl) {
            const recentTransactions = this.transactions
                .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date))
                .slice(0, 5);
                
            if (recentTransactions.length === 0) {
                walletActivityEl.innerHTML = '<p class="no-activity">No recent activity</p>';
            } else {
                walletActivityEl.innerHTML = recentTransactions.map(transaction => {
                    const isIncome = transaction.type === 'income';
                    const sign = isIncome ? '+' : '-';
                    const amountClass = isIncome ? 'income' : 'expense';
                    
                    return `
                        <div class="wallet-activity-item">
                            <div class="activity-info">
                                <h4>${transaction.description || (isIncome ? transaction.source : transaction.category)}</h4>
                                <p>${new Date(transaction.date).toLocaleDateString()}</p>
                            </div>
                            <div class="activity-amount ${amountClass}">
                                ${sign}฿${transaction.amount.toFixed(2)}
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    updateRecentTransactions() {
        const container = document.getElementById('recent-transactions');
        if (!container) return;

        const recentTransactions = this.transactions
            .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date))
            .slice(0, 10); // Show more transactions

        if (recentTransactions.length === 0) {
            container.innerHTML = '<p class="no-transactions">No recent transactions</p>';
            return;
        }

        container.innerHTML = recentTransactions.map(transaction => {
            const isIncome = transaction.type === 'income';
            const icon = isIncome ? 'fa-arrow-up' : 'fa-arrow-down';
            const amountClass = isIncome ? 'income' : 'expense';
            const sign = isIncome ? '+' : '-';
            
            // Format timestamp properly
            const transactionDate = new Date(transaction.timestamp || transaction.date);
            const dateStr = transactionDate.toLocaleDateString();
            const timeStr = transactionDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            return `
                <div class="transaction-item">
                    <div class="transaction-icon ${amountClass}">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.description || (isIncome ? transaction.source : transaction.category)}</h4>
                        <p class="transaction-date">${dateStr}</p>
                        <p class="transaction-time">${timeStr}</p>
                        <p class="transaction-category">${isIncome ? transaction.source : transaction.category}</p>
                    </div>
                    <div class="transaction-amount ${amountClass}">
                        ${sign}฿${transaction.amount.toFixed(2)}
                    </div>
                </div>
            `;
        }).join('');
    }

    updateEmergencyFundDisplay() {
        const totalFund = this.emergencyFunds.reduce((sum, fund) => sum + fund.currentAmount, 0);
        const totalTarget = this.emergencyFunds.reduce((sum, fund) => sum + fund.targetAmount, 0);
        
        const fundAmountEl = document.getElementById('emergency-fund-amount');
        const fundTargetEl = document.getElementById('emergency-fund-target');
        const fundProgressEl = document.getElementById('emergency-fund-progress');
        
        if (fundAmountEl) fundAmountEl.textContent = totalFund.toFixed(2);
        if (fundTargetEl) fundTargetEl.textContent = totalTarget.toFixed(2);
        if (fundProgressEl) {
            const percentage = totalTarget > 0 ? (totalFund / totalTarget) * 100 : 0;
            fundProgressEl.style.width = `${Math.min(percentage, 100)}%`;
        }
    }

    updateInvestmentDisplay() {
        const totalValue = this.investmentPlans.reduce((sum, plan) => sum + plan.amount, 0);
        const portfolioValueEl = document.getElementById('portfolio-value');
        
        if (portfolioValueEl) {
            portfolioValueEl.textContent = totalValue.toFixed(2);
        }
    }

    // Enhanced warning system with fixed balance display
    checkWarningAlert() {
        if (this.userData.warningAmount > 0 && this.userData.expenses > this.userData.warningAmount) {
            this.showWarningAlert();
        }
    }

    showWarningAlert() {
        const alert = document.getElementById('warning-alert');
        if (alert) {
            alert.classList.add('show');
            // Update the remaining balance in the alert
            const alertRemainingBalanceEl = document.getElementById('alert-remaining-balance');
            if (alertRemainingBalanceEl) {
                alertRemainingBalanceEl.textContent = this.userData.balance.toFixed(2);
            }
        }
    }

    hideWarningAlert() {
        const alert = document.getElementById('warning-alert');
        if (alert) {
            alert.classList.remove('show');
        }
    }

    // Enhanced modal functionality
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Enhanced tab switching
    switchTab(tabName) {
        // Hide all tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        // Show selected tab pane
        const targetPane = document.getElementById(tabName + '-tab');
        if (targetPane) {
            targetPane.classList.add('active');
        }

        // Update tab content based on selection
        if (tabName === 'recent') {
            this.updateRecentTransactions();
        } else if (tabName === 'emergency') {
            this.updateEmergencyFundDisplay();
        } else if (tabName === 'investment') {
            this.updateInvestmentDisplay();
        }
    }

    updateTabButtons(activeBtn) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    // Page navigation
    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }

        // Control navigation bar visibility
        this.controlNavigationVisibility(pageId);

        // Update UI when showing specific pages
        if (pageId === 'home-page') {
            this.updateUI();
            this.updateRecentTransactions();
        } else if (pageId === 'progress-page') {
            this.updateProgressPage();
        } else if (pageId === 'budget-page') {
            this.updateBudgetPage();
        } else if (pageId === 'goals-page') {
            this.updateGoalsPage();
        } else if (pageId === 'report-page') {
            this.updateReportPage();
        } else if (pageId === 'wallet-page') {
            this.updateWalletPage();
        }
    }

    controlNavigationVisibility(pageId) {
        const bottomNav = document.querySelector('.bottom-nav');
        const pagesWithoutNav = ['welcome-page', 'loading-page', 'login-page', 'signup-page', 'profile-page'];
        
        if (bottomNav) {
            if (pagesWithoutNav.includes(pageId)) {
                bottomNav.style.display = 'none';
            } else {
                bottomNav.style.display = 'flex';
            }
        }
    }

    updateNavigation(activeBtn) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    startWelcomeSequence() {
        // Show welcome page for 3 seconds, then transition to login
        setTimeout(() => {
            this.showPage('login-page');
        }, 3000);
    }

    // Enhanced authentication
    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Simple validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        // Check stored credentials
        const storedUser = this.loadUserByEmail(email);
        if (storedUser && this.verifyPassword(password, storedUser.password)) {
            this.userData = { ...this.userData, ...storedUser };
            this.authMethod = 'manual';
            this.isAuthenticated = true;
            this.createSession();
            this.loadUserData(); // Load user's budget and goal plans
            this.updateFinancialData(); // Recalculate balance
            this.showPage('home-page');
            this.updateUI();
        } else {
            alert('Invalid email or password');
        }
    }

    handleSignup() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        // Simple validation
        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        // Password strength validation
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        // Check if user already exists
        if (this.loadUserByEmail(email)) {
            alert('User with this email already exists');
            return;
        }

        // Create new user with enhanced password security
        this.userData.name = name;
        this.userData.email = email;
        this.userData.password = this.hashPassword(password);
        this.authMethod = 'manual';
        this.isAuthenticated = true;
        this.createSession();

        this.showPage('profile-page');
        this.prefillProfile();
    }

    // Emergency Fund functionality
    handleEmergencyFundAdd() {
        const name = document.getElementById('emergency-fund-name').value;
        const targetAmount = parseFloat(document.getElementById('emergency-fund-target-amount').value);
        const currentAmount = parseFloat(document.getElementById('emergency-fund-current-amount').value);
        const priority = document.getElementById('emergency-fund-priority').value;
        const description = document.getElementById('emergency-fund-description').value;

        if (!name || !targetAmount || !currentAmount || !priority) {
            alert('Please fill in all required fields');
            return;
        }

        const newFund = {
            id: Date.now(),
            name,
            targetAmount,
            currentAmount,
            priority,
            description,
            createdAt: new Date().toISOString()
        };

        this.emergencyFunds.push(newFund);
        this.saveUserData();
        this.hideModal('emergency-fund-modal');
        this.updateEmergencyFundDisplay();
        
        // Reset form
        document.getElementById('emergency-fund-form').reset();
        
        alert('Emergency fund created successfully!');
    }

    // Investment Plan functionality
    handleInvestmentPlanAdd() {
        const name = document.getElementById('investment-plan-name').value;
        const type = document.getElementById('investment-plan-type').value;
        const amount = parseFloat(document.getElementById('investment-plan-amount').value);
        const risk = document.getElementById('investment-plan-risk').value;
        const goal = document.getElementById('investment-plan-goal').value;

        if (!name || !type || !amount || !risk) {
            alert('Please fill in all required fields');
            return;
        }

        const newPlan = {
            id: Date.now(),
            name,
            type,
            amount,
            risk,
            goal,
            createdAt: new Date().toISOString()
        };

        this.investmentPlans.push(newPlan);
        this.saveUserData();
        this.hideModal('investment-plan-modal');
        this.updateInvestmentDisplay();
        
        // Reset form
        document.getElementById('investment-plan-form').reset();
        
        alert('Investment plan created successfully!');
    }

    // Language system
    changeLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('finedLanguage', language);
        this.updateLanguage();
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.translations[this.currentLanguage][key];
            if (translation) {
                element.textContent = translation;
            }
        });
    }

    updateLanguageButtons() {
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-lang="${this.currentLanguage}"]`)?.classList.add('active');
    }

    // Google Auth placeholder
    initializeGoogleAuth() {
        // Google Auth initialization would go here
        // This is a placeholder for the actual Google Auth implementation
    }
}

// Initialize the app
const app = new FinEdApp();

// Make app globally available for onclick handlers
window.app = app;

