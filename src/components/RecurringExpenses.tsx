import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar, 
  CreditCard, 
  Home,
  Repeat,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

interface RecurringExpense {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: 'fixa' | 'parcelada' | 'assinatura';
  frequency: 'mensal' | 'anual' | 'semestral';
  paymentType: 'unica' | 'mensal' | 'recorrente';
  dueDay: number;
  installments?: number;
  currentInstallment?: number;
  startDate: string;
  endDate?: string;
  status: 'ativa' | 'pausada' | 'finalizada';
  autoDebit: boolean;
}

interface PaymentHistory {
  recurringExpenseId: string;
  month: string;
  paid: boolean;
  paidDate?: string;
}

export function RecurringExpenses() {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<RecurringExpense | undefined>();
  const [viewType, setViewType] = useState<'all' | 'fixa' | 'parcelada' | 'assinatura'>('all');

  // Mock data - dados de exemplo
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([
    {
      id: '1',
      description: 'Aluguel Apartamento',
      category: 'Moradia',
      amount: 1200.00,
      type: 'fixa',
      frequency: 'mensal',
      paymentType: 'mensal',
      dueDay: 10,
      startDate: '2025-01-01',
      status: 'ativa',
      autoDebit: false
    },
    {
      id: '2',
      description: 'Condomínio',
      category: 'Moradia',
      amount: 350.00,
      type: 'fixa',
      frequency: 'mensal',
      paymentType: 'mensal',
      dueDay: 15,
      startDate: '2025-01-01',
      status: 'ativa',
      autoDebit: true
    },
    {
      id: '3',
      description: 'Netflix',
      category: 'Entretenimento',
      amount: 55.90,
      type: 'assinatura',
      frequency: 'mensal',
      paymentType: 'mensal',
      dueDay: 5,
      startDate: '2025-01-01',
      status: 'ativa',
      autoDebit: true
    },
    {
      id: '4',
      description: 'Spotify Premium',
      category: 'Entretenimento',
      amount: 34.90,
      type: 'assinatura',
      frequency: 'mensal',
      paymentType: 'mensal',
      dueDay: 12,
      startDate: '2025-01-01',
      status: 'ativa',
      autoDebit: true
    },
    {
      id: '5',
      description: 'Fatura Cartão - Notebook',
      category: 'Eletrônicos',
      amount: 450.00,
      type: 'parcelada',
      frequency: 'mensal',
      paymentType: 'recorrente',
      dueDay: 20,
      installments: 12,
      currentInstallment: 5,
      startDate: '2025-08-01',
      endDate: '2026-07-01',
      status: 'ativa',
      autoDebit: true
    },
    {
      id: '6',
      description: 'Academia Smart Fit',
      category: 'Saúde',
      amount: 89.90,
      type: 'assinatura',
      frequency: 'mensal',
      paymentType: 'mensal',
      dueDay: 25,
      startDate: '2025-01-01',
      status: 'ativa',
      autoDebit: false
    }
  ]);

  // Mock payment history
  const [paymentHistory] = useState<PaymentHistory[]>([
    { recurringExpenseId: '1', month: '2025-12', paid: true, paidDate: '2025-12-10' },
    { recurringExpenseId: '2', month: '2025-12', paid: true, paidDate: '2025-12-15' },
    { recurringExpenseId: '3', month: '2025-12', paid: true, paidDate: '2025-12-05' },
    { recurringExpenseId: '4', month: '2025-12', paid: true, paidDate: '2025-12-12' },
    { recurringExpenseId: '5', month: '2025-12', paid: false },
    { recurringExpenseId: '6', month: '2025-12', paid: false }
  ]);

  // Filtrar despesas por tipo
  const filteredExpenses = viewType === 'all' 
    ? recurringExpenses 
    : recurringExpenses.filter(e => e.type === viewType);

  // Calcular totais
  const calculateTotals = () => {
    const monthlyTotal = recurringExpenses
      .filter(e => e.status === 'ativa')
      .reduce((sum, e) => {
        if (e.frequency === 'mensal') return sum + e.amount;
        if (e.frequency === 'anual') return sum + (e.amount / 12);
        if (e.frequency === 'semestral') return sum + (e.amount / 6);
        return sum;
      }, 0);

    const fixedTotal = recurringExpenses
      .filter(e => e.type === 'fixa' && e.status === 'ativa')
      .reduce((sum, e) => sum + e.amount, 0);

    const subscriptionsTotal = recurringExpenses
      .filter(e => e.type === 'assinatura' && e.status === 'ativa')
      .reduce((sum, e) => sum + e.amount, 0);

    const installmentsTotal = recurringExpenses
      .filter(e => e.type === 'parcelada' && e.status === 'ativa')
      .reduce((sum, e) => sum + e.amount, 0);

    return { monthlyTotal, fixedTotal, subscriptionsTotal, installmentsTotal };
  };

  const totals = calculateTotals();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'fixa': return 'Despesa Fixa';
      case 'parcelada': return 'Parcelada';
      case 'assinatura': return 'Assinatura';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fixa': return Home;
      case 'parcelada': return CreditCard;
      case 'assinatura': return Repeat;
      default: return Calendar;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-700';
      case 'pausada': return 'bg-yellow-100 text-yellow-700';
      case 'finalizada': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatus = (expenseId: string) => {
    const payment = paymentHistory.find(
      p => p.recurringExpenseId === expenseId && p.month === '2025-12'
    );
    return payment?.paid ? 'pago' : 'pendente';
  };

  const handleAddExpense = () => {
    setShowForm(true);
    setEditingExpense(undefined);
  };

  const handleEditExpense = (expense: RecurringExpense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa recorrente?')) {
      setRecurringExpenses(recurringExpenses.filter(e => e.id !== id));
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingExpense(undefined);
  };

  // Form states
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    amount: '',
    type: 'fixa' as 'fixa' | 'parcelada' | 'assinatura',
    frequency: 'mensal' as 'mensal' | 'anual' | 'semestral',
    paymentType: 'mensal' as 'unica' | 'mensal' | 'recorrente',
    dueDay: '',
    installments: '',
    startDate: '',
    autoDebit: false,
    valueType: 'monthly' as 'monthly' | 'total' // Valor mensal ou total
  });

  const [calculatedAmount, setCalculatedAmount] = useState('');

  // Calcular valor automaticamente baseado no tipo
  React.useEffect(() => {
    if (formData.paymentType === 'recorrente' && formData.amount && formData.installments) {
      const amount = parseFloat(formData.amount);
      const installments = parseInt(formData.installments);
      
      if (formData.valueType === 'total') {
        // Dividir valor total pelas parcelas
        const monthlyValue = amount / installments;
        setCalculatedAmount(monthlyValue.toFixed(2));
      } else {
        // Multiplicar valor mensal pelas parcelas
        const totalValue = amount * installments;
        setCalculatedAmount(totalValue.toFixed(2));
      }
    } else {
      setCalculatedAmount('');
    }
  }, [formData.amount, formData.installments, formData.valueType, formData.paymentType]);

  React.useEffect(() => {
    if (editingExpense) {
      setFormData({
        description: editingExpense.description,
        category: editingExpense.category,
        amount: editingExpense.amount.toString(),
        type: editingExpense.type,
        frequency: editingExpense.frequency,
        paymentType: editingExpense.paymentType,
        dueDay: editingExpense.dueDay.toString(),
        installments: editingExpense.installments?.toString() || '',
        startDate: editingExpense.startDate,
        autoDebit: editingExpense.autoDebit,
        valueType: 'monthly' // Valor mensal por padrão
      });
    } else {
      setFormData({
        description: '',
        category: '',
        amount: '',
        type: 'fixa',
        frequency: 'mensal',
        paymentType: 'mensal',
        dueDay: '',
        installments: '',
        startDate: '',
        autoDebit: false,
        valueType: 'monthly' // Valor mensal por padrão
      });
    }
  }, [editingExpense]);

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();

    const newExpense: RecurringExpense = {
      id: editingExpense?.id || Date.now().toString(),
      description: formData.description,
      category: formData.category,
      amount: parseFloat(formData.amount),
      type: formData.type,
      frequency: formData.frequency,
      paymentType: formData.paymentType,
      dueDay: parseInt(formData.dueDay),
      installments: formData.installments ? parseInt(formData.installments) : undefined,
      currentInstallment: formData.installments ? 1 : undefined,
      startDate: formData.startDate,
      status: 'ativa',
      autoDebit: formData.autoDebit
    };

    if (formData.type === 'parcelada' && formData.installments) {
      const endDate = new Date(formData.startDate);
      endDate.setMonth(endDate.getMonth() + parseInt(formData.installments));
      newExpense.endDate = endDate.toISOString().split('T')[0];
    }

    if (editingExpense) {
      setRecurringExpenses(recurringExpenses.map(e => 
        e.id === editingExpense.id ? newExpense : e
      ));
    } else {
      setRecurringExpenses([...recurringExpenses, newExpense]);
    }

    handleCancelForm();
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="mb-2">
            {editingExpense ? 'Editar Despesa Recorrente' : 'Nova Despesa Recorrente'}
          </h1>
          <p>Cadastre despesas fixas, assinaturas e parcelamentos</p>
        </div>

        <Card>
          <CardContent>
            <form onSubmit={handleSaveExpense} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">Descrição</label>
                  <Input
                    type="text"
                    placeholder="Ex: Aluguel, Netflix, Parcela Notebook"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Moradia">Moradia</option>
                    <option value="Contas">Contas</option>
                    <option value="Entretenimento">Entretenimento</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Educação">Educação</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Eletrônicos">Eletrônicos</option>
                    <option value="Seguros">Seguros</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent bg-white"
                    required
                  >
                    <option value="fixa">Despesa Fixa</option>
                    <option value="assinatura">Assinatura/Mensalidade</option>
                    <option value="parcelada">Parcelamento Cartão</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Valor {formData.type === 'parcelada' && '(por parcela)'}</label>
                  <Input
                    type="number"
                    placeholder="0,00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2">Frequência</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent bg-white"
                    required
                  >
                    <option value="mensal">Mensal</option>
                    <option value="semestral">Semestral</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Tipo de Pagamento</label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent bg-white"
                    required
                  >
                    <option value="unica">Única</option>
                    <option value="mensal">Mensal</option>
                    <option value="recorrente">Recorrente</option>
                  </select>
                </div>

                {formData.paymentType === 'recorrente' && (
                  <>
                    <div>
                      <label className="block mb-2">Número de Meses</label>
                      <Input
                        type="number"
                        placeholder="Ex: 12"
                        value={formData.installments}
                        onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                        min="2"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2">Forma de Cálculo</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="valueType"
                            value="monthly"
                            checked={formData.valueType === 'monthly'}
                            onChange={(e) => setFormData({ ...formData, valueType: 'monthly' })}
                            className="w-4 h-4 text-[var(--primary-green)] border-gray-300 focus:ring-[var(--primary-green)]"
                          />
                          <span className="text-gray-700">Valor Mensal x Meses = Total</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="valueType"
                            value="total"
                            checked={formData.valueType === 'total'}
                            onChange={(e) => setFormData({ ...formData, valueType: 'total' })}
                            className="w-4 h-4 text-[var(--primary-green)] border-gray-300 focus:ring-[var(--primary-green)]"
                          />
                          <span className="text-gray-700">Valor Total ÷ Meses = Mensal</span>
                        </label>
                      </div>
                      
                      {calculatedAmount && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-900">
                            {formData.valueType === 'monthly' 
                              ? `Valor Total: ${formatCurrency(parseFloat(calculatedAmount))}`
                              : `Valor Mensal: ${formatCurrency(parseFloat(calculatedAmount))}`
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="block mb-2">Dia do Vencimento</label>
                  <Input
                    type="number"
                    placeholder="1-31"
                    value={formData.dueDay}
                    onChange={(e) => setFormData({ ...formData, dueDay: e.target.value })}
                    min="1"
                    max="31"
                    required
                  />
                </div>

                {formData.type === 'parcelada' && formData.paymentType !== 'recorrente' && (
                  <div>
                    <label className="block mb-2">Número de Parcelas</label>
                    <Input
                      type="number"
                      placeholder="Ex: 12"
                      value={formData.installments}
                      onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                      min="2"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block mb-2">Data de Início</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <input
                  type="checkbox"
                  id="autoDebit"
                  checked={formData.autoDebit}
                  onChange={(e) => setFormData({ ...formData, autoDebit: e.target.checked })}
                  className="w-4 h-4 text-[var(--primary-green)] border-gray-300 rounded focus:ring-[var(--primary-green)]"
                />
                <label htmlFor="autoDebit" className="text-gray-700">
                  Débito automático ativado
                </label>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <Button type="button" onClick={handleCancelForm} variant="secondary">
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingExpense ? 'Salvar Alterações' : 'Cadastrar Despesa'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Despesas Fixas e Recorrentes</h1>
          <p>Controle suas despesas fixas, assinaturas e parcelamentos</p>
        </div>
        <Button onClick={handleAddExpense}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Despesa
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--primary-green-light)] flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[var(--primary-green)]" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Total Mensal</p>
            <h2 className="text-gray-900">{formatCurrency(totals.monthlyTotal)}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Despesas Fixas</p>
            <h2 className="text-gray-900">{formatCurrency(totals.fixedTotal)}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Repeat className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Assinaturas</p>
            <h2 className="text-gray-900">{formatCurrency(totals.subscriptionsTotal)}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Parcelamentos</p>
            <h2 className="text-gray-900">{formatCurrency(totals.installmentsTotal)}</h2>
          </CardContent>
        </Card>
      </div>

      {/* Filtros por tipo */}
      <div className="flex gap-2">
        <Button 
          onClick={() => setViewType('all')}
          variant={viewType === 'all' ? 'primary' : 'secondary'}
        >
          Todas ({recurringExpenses.length})
        </Button>
        <Button 
          onClick={() => setViewType('fixa')}
          variant={viewType === 'fixa' ? 'primary' : 'secondary'}
        >
          <Home className="w-4 h-4 mr-2" />
          Fixas ({recurringExpenses.filter(e => e.type === 'fixa').length})
        </Button>
        <Button 
          onClick={() => setViewType('assinatura')}
          variant={viewType === 'assinatura' ? 'primary' : 'secondary'}
        >
          <Repeat className="w-4 h-4 mr-2" />
          Assinaturas ({recurringExpenses.filter(e => e.type === 'assinatura').length})
        </Button>
        <Button 
          onClick={() => setViewType('parcelada')}
          variant={viewType === 'parcelada' ? 'primary' : 'secondary'}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Parceladas ({recurringExpenses.filter(e => e.type === 'parcelada').length})
        </Button>
      </div>

      {/* Lista de Despesas Recorrentes */}
      <Card>
        <CardHeader>
          <h3>Despesas Cadastradas</h3>
        </CardHeader>
        <CardContent className="p-0">
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                Nenhuma despesa recorrente cadastrada
              </p>
              <Button onClick={handleAddExpense} variant="secondary">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Despesa
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">Tipo</th>
                    <th className="px-6 py-3 text-left">Descrição</th>
                    <th className="px-6 py-3 text-left">Categoria</th>
                    <th className="px-6 py-3 text-right">Valor</th>
                    <th className="px-6 py-3 text-center">Vencimento</th>
                    <th className="px-6 py-3 text-center">Parcelas</th>
                    <th className="px-6 py-3 text-center">Status Dez/25</th>
                    <th className="px-6 py-3 text-center">Situação</th>
                    <th className="px-6 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredExpenses.map(expense => {
                    const TypeIcon = getTypeIcon(expense.type);
                    const paymentStatus = getPaymentStatus(expense.id);

                    return (
                      <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-700 text-sm">
                              {getTypeLabel(expense.type)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-gray-900">{expense.description}</p>
                            {expense.autoDebit && (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Débito automático
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-600">{expense.category}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-red-600">{formatCurrency(expense.amount)}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="text-gray-600">Dia {expense.dueDay}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {expense.type === 'parcelada' ? (
                            <span className="text-gray-700">
                              {expense.currentInstallment}/{expense.installments}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {paymentStatus === 'pago' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                              <CheckCircle2 className="w-3 h-3" />
                              Pago
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                              <Clock className="w-3 h-3" />
                              Pendente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs ${getStatusColor(expense.status)}`}>
                            {expense.status === 'ativa' ? 'Ativa' : expense.status === 'pausada' ? 'Pausada' : 'Finalizada'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditExpense(expense)}
                              className="p-2 text-gray-600 hover:text-[var(--primary-green)] hover:bg-gray-100 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações adicionais */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-2">Sobre Despesas Recorrentes</h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• <strong>Despesas Fixas:</strong> Valores mensais regulares como aluguel, condomínio, internet</li>
                <li>• <strong>Assinaturas:</strong> Serviços recorrentes como streaming, academia, software</li>
                <li>• <strong>Parcelamentos:</strong> Compras divididas no cartão de crédito com número definido de parcelas</li>
                <li>• O sistema mantém o histórico de pagamentos e alerta sobre vencimentos próximos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}