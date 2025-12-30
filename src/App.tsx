import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseForm } from './components/ExpenseForm';
import { Planning } from './components/Planning';
import { RecurringExpenses } from './components/RecurringExpenses';
import keycloak from './auth/keycloak';
import { ReceitasPage } from './pages/ReceitasPage';

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: 'receita' | 'despesa';
  status: 'pago' | 'pendente' | 'agendado';
  paymentType?: 'unica' | 'parcelada' | 'recorrente';
  installments?: number;
  currentInstallment?: number;
  dueDay?: number;
  autoDebit?: boolean;
  valueType?: 'monthly' | 'total';
}

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [showForm, setShowForm] = useState(false);

   if (!keycloak.authenticated) {
    keycloak.login();
    return null;
  }

  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };
  
  // Mock data - dados de exemplo
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      description: 'Salário Mensal',
      category: 'Salário',
      amount: 5000.00,
      date: '2025-12-01',
      type: 'receita',
      status: 'pago'
    },
    {
      id: '2',
      description: 'Freelance Website',
      category: 'Freelance',
      amount: 1500.00,
      date: '2025-12-05',
      type: 'receita',
      status: 'pago'
    },
    {
      id: '3',
      description: 'Aluguel',
      category: 'Moradia',
      amount: 1200.00,
      date: '2025-12-10',
      type: 'despesa',
      status: 'pago'
    },
    {
      id: '4',
      description: 'Supermercado',
      category: 'Alimentação',
      amount: 450.00,
      date: '2025-12-12',
      type: 'despesa',
      status: 'pago'
    },
    {
      id: '5',
      description: 'Conta de Luz',
      category: 'Contas',
      amount: 180.00,
      date: '2025-12-15',
      type: 'despesa',
      status: 'pendente'
    },
    {
      id: '6',
      description: 'Academia',
      category: 'Saúde',
      amount: 120.00,
      date: '2025-12-20',
      type: 'despesa',
      status: 'pendente'
    }
  ]);

  

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setShowForm(false);
    setEditingTransaction(undefined);
  };

  const handleAddTransaction = () => {
    setShowForm(true);
    setEditingTransaction(undefined);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleSaveTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      // Editar transação existente
      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id 
          ? { ...transactionData, id: editingTransaction.id }
          : t
      ));
    } else {
      // Adicionar nova transação
      const newTransaction: Transaction = {
        ...transactionData,
        id: Date.now().toString()
      };
      setTransactions([...transactions, newTransaction]);
    }
    
    setShowForm(false);
    setEditingTransaction(undefined);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTransaction(undefined);
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        currentView={currentView} 
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 p-8 max-w-[1176px]">
        {currentView === 'dashboard' && (
          <Dashboard transactions={transactions} />
        )}
        
       {currentView === 'receitas' && (
        <ReceitasPage />
        )}
        {currentView === 'despesas' && !showForm && (
          <ExpenseList
            transactions={transactions}
            type="despesa"
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            onAdd={handleAddTransaction}
          />
        )}
        
        {currentView === 'despesas' && showForm && (
          <ExpenseForm
            transaction={editingTransaction}
            type="despesa"
            onSave={handleSaveTransaction}
            onCancel={handleCancelForm}
          />
        )}

        {currentView === 'planejamento' && (
          <Planning transactions={transactions} />
        )}

        {currentView === 'configuracoes' && (
          <div className="space-y-6">
            <div>
              <h1 className="mb-2">Configurações</h1>
              <p>Em desenvolvimento...</p>
            </div>
          </div>
        )}

        {currentView === 'recorrentes' && (
          <RecurringExpenses />
        )}
      </main>
    </div>
  );
}