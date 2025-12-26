import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Input, Select } from './ui/input';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: 'receita' | 'despesa';
  status: 'pago' | 'pendente' | 'agendado';
}

interface CategoryBudget {
  category: string;
  budgeted: number;
  spent: number;
}

interface MonthlyNote {
  month: string;
  note: string;
}

interface PlanningProps {
  transactions: Transaction[];
}

export function Planning({ transactions }: PlanningProps) {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');
  const [monthlyNotes, setMonthlyNotes] = useState<MonthlyNote[]>([]);
  const [annualNote, setAnnualNote] = useState('');

  // Budget mock data - em produção viria do backend
  const categoryBudgets: CategoryBudget[] = [
    { category: 'Alimentação', budgeted: 800, spent: 0 },
    { category: 'Transporte', budgeted: 400, spent: 0 },
    { category: 'Moradia', budgeted: 1500, spent: 0 },
    { category: 'Saúde', budgeted: 300, spent: 0 },
    { category: 'Educação', budgeted: 200, spent: 0 },
    { category: 'Lazer', budgeted: 300, spent: 0 },
    { category: 'Contas', budgeted: 500, spent: 0 }
  ];

  const monthOptions = [
    { value: '0', label: 'Janeiro' },
    { value: '1', label: 'Fevereiro' },
    { value: '2', label: 'Março' },
    { value: '3', label: 'Abril' },
    { value: '4', label: 'Maio' },
    { value: '5', label: 'Junho' },
    { value: '6', label: 'Julho' },
    { value: '7', label: 'Agosto' },
    { value: '8', label: 'Setembro' },
    { value: '9', label: 'Outubro' },
    { value: '10', label: 'Novembro' },
    { value: '11', label: 'Dezembro' }
  ];

  const yearOptions = [
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcular gastos por categoria no mês selecionado
  const categorySpending = useMemo(() => {
    return categoryBudgets.map(budget => {
      const spent = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return (
            t.type === 'despesa' &&
            t.status === 'pago' &&
            t.category === budget.category &&
            transactionDate.getMonth() === selectedMonth &&
            transactionDate.getFullYear() === selectedYear
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      return { ...budget, spent };
    });
  }, [transactions, selectedMonth, selectedYear, categoryBudgets]);

  // Totais mensais
  const monthlyTotals = useMemo(() => {
    const budgeted = categorySpending.reduce((sum, cat) => sum + cat.budgeted, 0);
    const spent = categorySpending.reduce((sum, cat) => sum + cat.spent, 0);
    const remaining = budgeted - spent;
    
    return { budgeted, spent, remaining };
  }, [categorySpending]);

  // Totais anuais
  const annualTotals = useMemo(() => {
    const budgeted = categoryBudgets.reduce((sum, cat) => sum + cat.budgeted, 0) * 12;
    const spent = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          t.type === 'despesa' &&
          t.status === 'pago' &&
          transactionDate.getFullYear() === selectedYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { budgeted, spent, remaining: budgeted - spent };
  }, [transactions, selectedYear, categoryBudgets]);

  // Gastos por mês no ano
  const monthlyBreakdown = useMemo(() => {
    return monthOptions.map((month, index) => {
      const monthBudget = categoryBudgets.reduce((sum, cat) => sum + cat.budgeted, 0);
      const monthSpent = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return (
            t.type === 'despesa' &&
            t.status === 'pago' &&
            transactionDate.getMonth() === index &&
            transactionDate.getFullYear() === selectedYear
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month: month.label,
        budgeted: monthBudget,
        spent: monthSpent
      };
    });
  }, [transactions, selectedYear, categoryBudgets, monthOptions]);

  const getBudgetStatus = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    
    if (percentage >= 100) {
      return { color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle, label: 'Estourado' };
    } else if (percentage >= 80) {
      return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: AlertCircle, label: 'Atenção' };
    } else {
      return { color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle, label: 'No limite' };
    }
  };

  const currentMonthNote = monthlyNotes.find(
    n => n.month === `${selectedYear}-${selectedMonth}`
  )?.note || '';

  const handleMonthlyNoteChange = (note: string) => {
    const monthKey = `${selectedYear}-${selectedMonth}`;
    setMonthlyNotes(prev => {
      const existing = prev.find(n => n.month === monthKey);
      if (existing) {
        return prev.map(n => n.month === monthKey ? { ...n, note } : n);
      } else {
        return [...prev, { month: monthKey, note }];
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Planejamento Financeiro</h1>
        <p>Gerencie seus orçamentos mensais e anuais</p>
      </div>

      {/* Toggle entre Mensal e Anual */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('monthly')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'monthly'
              ? 'bg-[var(--primary-green)] text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Orçamento Mensal
        </button>
        <button
          onClick={() => setViewMode('annual')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'annual'
              ? 'bg-[var(--primary-green)] text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Orçamento Anual
        </button>
      </div>

      {/* ORÇAMENTO MENSAL */}
      {viewMode === 'monthly' && (
        <>
          {/* Seletores de Mês e Ano */}
          <Card>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Select
                    label="Mês"
                    options={monthOptions}
                    value={selectedMonth.toString()}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  />
                </div>
                <div className="flex-1">
                  <Select
                    label="Ano"
                    options={yearOptions}
                    value={selectedYear.toString()}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards de Resumo Mensal */}
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Orçamento Previsto</p>
                <h2 className="text-blue-600">{formatCurrency(monthlyTotals.budgeted)}</h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Gasto</p>
                <h2 className="text-red-600">{formatCurrency(monthlyTotals.spent)}</h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    monthlyTotals.remaining >= 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <TrendingUp className={`w-6 h-6 ${
                      monthlyTotals.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {monthlyTotals.remaining >= 0 ? 'Disponível' : 'Excedido'}
                </p>
                <h2 className={monthlyTotals.remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(Math.abs(monthlyTotals.remaining))}
                </h2>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Orçamento por Categoria */}
          <Card>
            <CardHeader>
              <h3>Orçamento por Categoria</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">Categoria</th>
                      <th className="px-6 py-3 text-right">Previsto</th>
                      <th className="px-6 py-3 text-right">Gasto</th>
                      <th className="px-6 py-3 text-right">Restante</th>
                      <th className="px-6 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categorySpending.map(category => {
                      const remaining = category.budgeted - category.spent;
                      const status = getBudgetStatus(category.spent, category.budgeted);
                      const StatusIcon = status.icon;

                      return (
                        <tr key={category.category} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-gray-900">{category.category}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-gray-600">{formatCurrency(category.budgeted)}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-gray-900">{formatCurrency(category.spent)}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(Math.abs(remaining))}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <div className={`w-8 h-8 rounded-lg ${status.bgColor} flex items-center justify-center`}>
                                <StatusIcon className={`w-4 h-4 ${status.color}`} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Anotações Mensais */}
          <Card>
            <CardHeader>
              <h3>Anotações do Mês</h3>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent resize-none"
                rows={4}
                placeholder="Adicione observações sobre o planejamento deste mês..."
                value={currentMonthNote}
                onChange={(e) => handleMonthlyNoteChange(e.target.value)}
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* ORÇAMENTO ANUAL */}
      {viewMode === 'annual' && (
        <>
          {/* Seletor de Ano */}
          <Card>
            <CardContent>
              <div className="max-w-xs">
                <Select
                  label="Ano"
                  options={yearOptions}
                  value={selectedYear.toString()}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Cards de Resumo Anual */}
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Previsto no Ano</p>
                <h2 className="text-blue-600">{formatCurrency(annualTotals.budgeted)}</h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Gasto no Ano</p>
                <h2 className="text-red-600">{formatCurrency(annualTotals.spent)}</h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    annualTotals.remaining >= 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <TrendingUp className={`w-6 h-6 ${
                      annualTotals.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {annualTotals.remaining >= 0 ? 'Disponível no Ano' : 'Excedido no Ano'}
                </p>
                <h2 className={annualTotals.remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(Math.abs(annualTotals.remaining))}
                </h2>
              </CardContent>
            </Card>
          </div>

          {/* Tabela Mês a Mês */}
          <Card>
            <CardHeader>
              <h3>Visão Mês a Mês</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">Mês</th>
                      <th className="px-6 py-3 text-right">Previsto</th>
                      <th className="px-6 py-3 text-right">Gasto</th>
                      <th className="px-6 py-3 text-right">Diferença</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {monthlyBreakdown.map((month, index) => {
                      const difference = month.budgeted - month.spent;
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-gray-900">{month.month}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-gray-600">{formatCurrency(month.budgeted)}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-gray-900">{formatCurrency(month.spent)}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className={difference >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {difference >= 0 ? '+' : '-'} {formatCurrency(Math.abs(difference))}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Anotações Anuais */}
          <Card>
            <CardHeader>
              <h3>Anotações do Ano</h3>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent resize-none"
                rows={4}
                placeholder="Adicione observações sobre o planejamento anual..."
                value={annualNote}
                onChange={(e) => setAnnualNote(e.target.value)}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
