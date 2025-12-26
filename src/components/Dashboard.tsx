import React from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Repeat } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: 'receita' | 'despesa';
  status: 'pago' | 'pendente' | 'agendado';
}

interface DashboardProps {
  transactions: Transaction[];
}

export function Dashboard({ transactions }: DashboardProps) {
  const totalReceitas = transactions
    .filter(t => t.type === 'receita' && t.status === 'pago')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDespesas = transactions
    .filter(t => t.type === 'despesa' && t.status === 'pago')
    .reduce((sum, t) => sum + t.amount, 0);

  // Mock de despesas recorrentes - em uma aplicação real viria do estado do App
  const totalDespesasRecorrentes = 2380.70; // Aluguel + Condomínio + Netflix + Spotify + Notebook + Academia

  const saldo = totalReceitas - totalDespesas;

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Dashboard</h1>
        <p>Visão geral das suas finanças</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Saldo Atual</p>
            <h2 className={saldo >= 0 ? 'text-[var(--primary-green)]' : 'text-red-500'}>
              {formatCurrency(saldo)}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total de Receitas</p>
            <h2 className="text-green-600">{formatCurrency(totalReceitas)}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total de Despesas</p>
            <h2 className="text-red-600">{formatCurrency(totalDespesas)}</h2>
          </CardContent>
        </Card>
      </div>

      {/* Card de Despesas Recorrentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3>Despesas Recorrentes Mensais</h3>
            <Repeat className="w-5 h-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-700 mb-1">Despesas Fixas</p>
              <p className="text-purple-900">{formatCurrency(1550.00)}</p>
              <p className="text-xs text-purple-600 mt-1">Aluguel + Condomínio</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 mb-1">Assinaturas</p>
              <p className="text-blue-900">{formatCurrency(180.70)}</p>
              <p className="text-xs text-blue-600 mt-1">Netflix, Spotify, Academia</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-700 mb-1">Parcelamentos</p>
              <p className="text-orange-900">{formatCurrency(450.00)}</p>
              <p className="text-xs text-orange-600 mt-1">Notebook (5/12)</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Compromissos Mensais</p>
              <p className="text-gray-400 text-xs mt-1">Despesas que se repetem automaticamente</p>
            </div>
            <h3 className="text-red-600">{formatCurrency(totalDespesasRecorrentes)}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3>Transações Recentes</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center py-8 text-gray-500">Nenhuma transação registrada</p>
            ) : (
              recentTransactions.map(transaction => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === 'receita' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      {transaction.type === 'receita' ? (
                        <ArrowUpRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`${
                      transaction.type === 'receita' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'receita' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}