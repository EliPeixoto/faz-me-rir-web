import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Pencil, Trash2, Plus, X, Filter, Search } from 'lucide-react';
import { Input } from './ui/Input';

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

interface ExpenseListProps {
  transactions: Transaction[];
  type: 'receita' | 'despesa';
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function ExpenseList({ transactions, type, onEdit, onDelete, onAdd }: ExpenseListProps) {
  // Estados dos filtros (valores temporários - inputs)
  const [descriptionFilter, setDescriptionFilter] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('');
  const [minValue, setMinValue] = React.useState('');
  const [maxValue, setMaxValue] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);

  // Estados dos filtros aplicados (valores que realmente filtram)
  const [appliedDescriptionFilter, setAppliedDescriptionFilter] = React.useState('');
  const [appliedCategoryFilter, setAppliedCategoryFilter] = React.useState('');
  const [appliedStatusFilter, setAppliedStatusFilter] = React.useState<string>('');
  const [appliedMinValue, setAppliedMinValue] = React.useState('');
  const [appliedMaxValue, setAppliedMaxValue] = React.useState('');
  const [appliedStartDate, setAppliedStartDate] = React.useState('');
  const [appliedEndDate, setAppliedEndDate] = React.useState('');

  // Filtragem usando os filtros aplicados
  const filteredTransactions = transactions
    .filter(t => t.type === type)
    .filter(t => {
      // Filtro de descrição
      if (appliedDescriptionFilter && !t.description.toLowerCase().includes(appliedDescriptionFilter.toLowerCase())) {
        return false;
      }
      
      // Filtro de categoria
      if (appliedCategoryFilter && !t.category.toLowerCase().includes(appliedCategoryFilter.toLowerCase())) {
        return false;
      }
      
      // Filtro de status
      if (appliedStatusFilter && t.status !== appliedStatusFilter) {
        return false;
      }
      
      // Filtro de valor mínimo
      if (appliedMinValue && t.amount < parseFloat(appliedMinValue)) {
        return false;
      }
      
      // Filtro de valor máximo
      if (appliedMaxValue && t.amount > parseFloat(appliedMaxValue)) {
        return false;
      }
      
      // Filtro de data inicial
      if (appliedStartDate && new Date(t.date) < new Date(appliedStartDate)) {
        return false;
      }
      
      // Filtro de data final
      if (appliedEndDate && new Date(t.date) > new Date(appliedEndDate)) {
        return false;
      }
      
      return true;
    });

  // Função para aplicar os filtros
  const applyFilters = () => {
    setAppliedDescriptionFilter(descriptionFilter);
    setAppliedCategoryFilter(categoryFilter);
    setAppliedStatusFilter(statusFilter);
    setAppliedMinValue(minValue);
    setAppliedMaxValue(maxValue);
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  };

  // Função para limpar todos os filtros
  const clearFilters = () => {
    // Limpar inputs
    setDescriptionFilter('');
    setCategoryFilter('');
    setStatusFilter('');
    setMinValue('');
    setMaxValue('');
    setStartDate('');
    setEndDate('');
    
    // Limpar filtros aplicados
    setAppliedDescriptionFilter('');
    setAppliedCategoryFilter('');
    setAppliedStatusFilter('');
    setAppliedMinValue('');
    setAppliedMaxValue('');
    setAppliedStartDate('');
    setAppliedEndDate('');
  };

  // Verifica se há filtros ativos
  const hasActiveFilters = appliedDescriptionFilter || appliedCategoryFilter || appliedStatusFilter || appliedMinValue || appliedMaxValue || appliedStartDate || appliedEndDate;

  // Extrair categorias únicas para o filtro
  const uniqueCategories = Array.from(new Set(transactions.filter(t => t.type === type).map(t => t.category)));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago':
        return 'bg-green-100 text-green-700';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700';
      case 'agendado':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pago':
        return 'Pago';
      case 'pendente':
        return 'Pendente';
      case 'agendado':
        return 'Agendado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">{type === 'receita' ? 'Receitas' : 'Despesas'}</h1>
          <p>Gerencie suas {type === 'receita' ? 'receitas' : 'despesas'}</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowFilters(!showFilters)} 
            variant={showFilters ? 'primary' : 'secondary'}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 px-1.5 py-0.5 bg-white/30 rounded-full text-xs">
                ativa
              </span>
            )}
          </Button>
          <Button onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar {type === 'receita' ? 'Receita' : 'Despesa'}
          </Button>
        </div>
      </div>

      {/* Painel de Filtros */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3>Filtros de Busca</h3>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="secondary" className="text-sm">
                  <X className="w-4 h-4 mr-1" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Filtro de Descrição */}
              <div>
                <label className="block mb-2 text-sm text-gray-700">Descrição</label>
                <Input
                  type="text"
                  placeholder="Buscar por descrição..."
                  value={descriptionFilter}
                  onChange={(e) => setDescriptionFilter(e.target.value)}
                />
              </div>

              {/* Filtro de Categoria */}
              <div>
                <label className="block mb-2 text-sm text-gray-700">Categoria</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent bg-white"
                >
                  <option value="">Todas as categorias</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Filtro de Status */}
              <div>
                <label className="block mb-2 text-sm text-gray-700">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent bg-white"
                >
                  <option value="">Todos os status</option>
                  <option value="pago">Pago</option>
                  <option value="pendente">Pendente</option>
                  <option value="agendado">Agendado</option>
                </select>
              </div>

              {/* Filtro de Valor Mínimo */}
              <div>
                <label className="block mb-2 text-sm text-gray-700">Valor Mínimo</label>
                <Input
                  type="number"
                  placeholder="R$ 0,00"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  step="0.01"
                  min="0"
                />
              </div>

              {/* Filtro de Valor Máximo */}
              <div>
                <label className="block mb-2 text-sm text-gray-700">Valor Máximo</label>
                <Input
                  type="number"
                  placeholder="R$ 0,00"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                  step="0.01"
                  min="0"
                />
              </div>

              {/* Filtro de Data Inicial */}
              <div>
                <label className="block mb-2 text-sm text-gray-700">Data Inicial</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* Filtro de Data Final */}
              <div>
                <label className="block mb-2 text-sm text-gray-700">Data Final</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Contador de Resultados */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Exibindo <span className="text-[var(--primary-green)]">{filteredTransactions.length}</span> de {transactions.filter(t => t.type === type).length} {type === 'receita' ? 'receitas' : 'despesas'}
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="mt-6 flex gap-3 justify-end">
              <Button onClick={clearFilters} variant="secondary">
                <X className="w-4 h-4 mr-2" />
                Limpar
              </Button>
              <Button onClick={applyFilters}>
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h3>Lista de {type === 'receita' ? 'Receitas' : 'Despesas'}</h3>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                Nenhuma {type === 'receita' ? 'receita' : 'despesa'} registrada
              </p>
              <Button onClick={onAdd} variant="secondary">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar {type === 'receita' ? 'Receita' : 'Despesa'}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">Descrição</th>
                    <th className="px-6 py-3 text-left">Categoria</th>
                    <th className="px-6 py-3 text-right">Valor</th>
                    <th className="px-6 py-3 text-left">Data</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map(transaction => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900">{transaction.description}</p>
                          {transaction.paymentType === 'parcelada' && transaction.installments && (
                            <span className="inline-flex items-center gap-1 text-xs text-blue-600 mt-1">
                              Parcela {transaction.currentInstallment}/{transaction.installments}
                            </span>
                          )}
                          {transaction.paymentType === 'recorrente' && (
                            <span className="inline-flex items-center gap-1 text-xs text-purple-600 mt-1">
                              Recorrente ({transaction.installments} meses)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600">{transaction.category}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className={type === 'receita' ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(transaction.amount)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                          {getStatusLabel(transaction.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEdit(transaction)}
                            className="p-2 text-gray-600 hover:text-[var(--primary-green)] hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(transaction.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}