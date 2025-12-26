import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Input, Select } from './ui/input';
import { Button } from './ui/button';
import { ArrowLeft, Calculator } from 'lucide-react';

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

interface ExpenseFormProps {
  transaction?: Transaction;
  type: 'receita' | 'despesa';
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

export function ExpenseForm({ transaction, type, onSave, onCancel }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<'pago' | 'pendente' | 'agendado'>('pago');
  const [paymentType, setPaymentType] = useState<'unica' | 'parcelada' | 'recorrente'>('unica');
  const [installments, setInstallments] = useState('');
  const [currentInstallment, setCurrentInstallment] = useState('1');
  const [dueDay, setDueDay] = useState('');
  const [autoDebit, setAutoDebit] = useState(false);
  const [valueType, setValueType] = useState<'monthly' | 'total'>('total');

  const [calculatedAmount, setCalculatedAmount] = useState('');

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setCategory(transaction.category);
      setAmount(transaction.amount.toString());
      setDate(transaction.date);
      setStatus(transaction.status);
      setPaymentType(transaction.paymentType || 'unica');
      setInstallments(transaction.installments?.toString() || '');
      setCurrentInstallment(transaction.currentInstallment?.toString() || '1');
      setDueDay(transaction.dueDay?.toString() || '');
      setAutoDebit(transaction.autoDebit || false);
      setValueType(transaction.valueType || 'total');
    } else {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, [transaction]);

  // Calcular valor automaticamente para parceladas e recorrentes
  useEffect(() => {
    if ((paymentType === 'parcelada' || paymentType === 'recorrente') && amount && installments) {
      const amountValue = parseFloat(amount);
      const installmentsValue = parseInt(installments);
      
      if (valueType === 'total') {
        // Dividir valor total pelas parcelas
        const monthlyValue = amountValue / installmentsValue;
        setCalculatedAmount(monthlyValue.toFixed(2));
      } else {
        // Multiplicar valor mensal pelas parcelas
        const totalValue = amountValue * installmentsValue;
        setCalculatedAmount(totalValue.toFixed(2));
      }
    } else {
      setCalculatedAmount('');
    }
  }, [amount, installments, valueType, paymentType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData: Omit<Transaction, 'id'> = {
      description,
      category,
      amount: parseFloat(amount),
      date,
      type,
      status,
      paymentType
    };

    // Adicionar campos opcionais apenas se preenchidos
    if (paymentType === 'parcelada') {
      transactionData.installments = parseInt(installments);
      transactionData.currentInstallment = parseInt(currentInstallment);
    }

    if (paymentType === 'recorrente') {
      transactionData.installments = parseInt(installments);
      transactionData.dueDay = parseInt(dueDay);
      transactionData.autoDebit = autoDebit;
      transactionData.valueType = valueType;
    }

    onSave(transactionData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const receitaCategories = [
    { value: '', label: 'Selecione uma categoria' },
    { value: 'Salário', label: 'Salário' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Investimentos', label: 'Investimentos' },
    { value: 'Vendas', label: 'Vendas' },
    { value: 'Outros', label: 'Outros' }
  ];

  const despesaCategories = [
    { value: '', label: 'Selecione uma categoria' },
    { value: 'Alimentação', label: 'Alimentação' },
    { value: 'Transporte', label: 'Transporte' },
    { value: 'Moradia', label: 'Moradia' },
    { value: 'Saúde', label: 'Saúde' },
    { value: 'Educação', label: 'Educação' },
    { value: 'Lazer', label: 'Lazer' },
    { value: 'Contas', label: 'Contas' },
    { value: 'Entretenimento', label: 'Entretenimento' },
    { value: 'Eletrônicos', label: 'Eletrônicos' },
    { value: 'Seguros', label: 'Seguros' },
    { value: 'Outros', label: 'Outros' }
  ];

  const statusOptions = [
    { value: 'pago', label: 'Pago' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'agendado', label: 'Agendado' }
  ];

  const paymentTypeOptions = [
    { value: 'unica', label: 'Única' },
    { value: 'parcelada', label: 'Parcelada' },
    { value: 'recorrente', label: 'Recorrente (Mensal)' }
  ];

  const categories = type === 'receita' ? receitaCategories : despesaCategories;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="mb-2">
            {transaction ? 'Editar' : 'Adicionar'} {type === 'receita' ? 'Receita' : 'Despesa'}
          </h1>
          <p>
            Preencha os dados da {type === 'receita' ? 'receita' : 'despesa'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h3>Informações Básicas</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Descrição"
                  type="text"
                  placeholder="Ex: Pagamento de aluguel"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <Select
                label="Categoria"
                options={categories}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />

              <Select
                label="Tipo de Pagamento"
                options={paymentTypeOptions}
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as 'unica' | 'parcelada' | 'recorrente')}
                required
              />

              <Input
                label={
                  paymentType === 'parcelada' 
                    ? 'Valor da Parcela' 
                    : paymentType === 'recorrente' && valueType === 'monthly'
                    ? 'Valor Mensal'
                    : 'Valor'
                }
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />

              <Input
                label="Data"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <Select
                label="Status"
                options={statusOptions}
                value={status}
                onChange={(e) => setStatus(e.target.value as 'pago' | 'pendente' | 'agendado')}
                required
              />
            </div>

            {/* Campos para Parcelada */}
            {paymentType === 'parcelada' && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="mb-4 flex items-center gap-2 text-gray-700">
                  <Calculator className="w-4 h-4" />
                  Informações de Parcelamento
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Número de Parcelas"
                    type="number"
                    placeholder="Ex: 12"
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                    min="2"
                    required
                  />

                  <Input
                    label="Parcela Atual"
                    type="number"
                    placeholder="Ex: 1"
                    value={currentInstallment}
                    onChange={(e) => setCurrentInstallment(e.target.value)}
                    min="1"
                    max={installments || undefined}
                    required
                  />
                </div>

                {installments && amount && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Valor Total do Parcelamento:</strong> {formatCurrency(parseFloat(amount) * parseInt(installments))}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Campos para Recorrente */}
            {paymentType === 'recorrente' && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="mb-4 flex items-center gap-2 text-gray-700">
                  <Calculator className="w-4 h-4" />
                  Informações de Recorrência
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Número de Meses"
                    type="number"
                    placeholder="Ex: 12"
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                    min="1"
                    required
                  />

                  <Input
                    label="Dia do Vencimento"
                    type="number"
                    placeholder="Ex: 15"
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    min="1"
                    max="31"
                    required
                  />

                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm text-gray-700">Forma de Cálculo</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="valueType"
                          value="monthly"
                          checked={valueType === 'monthly'}
                          onChange={(e) => setValueType('monthly')}
                          className="w-4 h-4 text-[var(--primary-green)] border-gray-300 focus:ring-[var(--primary-green)]"
                        />
                        <span className="text-gray-700">Valor Mensal x Meses = Total</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="valueType"
                          value="total"
                          checked={valueType === 'total'}
                          onChange={(e) => setValueType('total')}
                          className="w-4 h-4 text-[var(--primary-green)] border-gray-300 focus:ring-[var(--primary-green)]"
                        />
                        <span className="text-gray-700">Valor Total ÷ Meses = Mensal</span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoDebit}
                        onChange={(e) => setAutoDebit(e.target.checked)}
                        className="w-4 h-4 text-[var(--primary-green)] border-gray-300 rounded focus:ring-[var(--primary-green)]"
                      />
                      <span className="text-gray-700">Débito automático ativado</span>
                    </label>
                  </div>
                </div>

                {calculatedAmount && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      {valueType === 'monthly' 
                        ? `💰 Valor Total: ${formatCurrency(parseFloat(calculatedAmount))}`
                        : `💰 Valor Mensal: ${formatCurrency(parseFloat(calculatedAmount))}`
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button type="submit" className="flex-1">
                {transaction ? 'Atualizar' : 'Salvar'} {type === 'receita' ? 'Receita' : 'Despesa'}
              </Button>
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
