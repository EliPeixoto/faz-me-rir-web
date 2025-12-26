import { useState, useEffect, type FormEvent } from "react";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Input, Select } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: "receita" | "despesa";
  status: "pago" | "pendente" | "agendado";
  paymentType?: "unica" | "parcelada" | "recorrente";
  installments?: number;
  currentInstallment?: number;
  dueDay?: number;
  autoDebit?: boolean;
  valueType?: "monthly" | "total";
}

interface ExpenseFormProps {
  transaction?: Transaction;
  type: "receita" | "despesa";
  onSave: (transaction: Omit<Transaction, "id">) => void;
  onCancel: () => void;
}

export function ExpenseForm({
  transaction,
  type,
  onSave,
  onCancel,
}: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] =
    useState<"pago" | "pendente" | "agendado">("pago");
  const [paymentType, setPaymentType] =
    useState<"unica" | "parcelada" | "recorrente">("unica");
  const [installments, setInstallments] = useState("");
  const [currentInstallment, setCurrentInstallment] = useState("1");
  const [dueDay, setDueDay] = useState("");
  const [autoDebit, setAutoDebit] = useState(false);
  const [valueType, setValueType] =
    useState<"monthly" | "total">("total");


  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setCategory(transaction.category);
      setAmount(transaction.amount.toString());
      setDate(transaction.date);
      setStatus(transaction.status);
      setPaymentType(transaction.paymentType || "unica");
      setInstallments(transaction.installments?.toString() || "");
      setCurrentInstallment(
        transaction.currentInstallment?.toString() || "1"
      );
      setDueDay(transaction.dueDay?.toString() || "");
      setAutoDebit(transaction.autoDebit || false);
      setValueType(transaction.valueType || "total");
    } else {
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [transaction]);

  useEffect(() => {
    if (
      (paymentType === "parcelada" || paymentType === "recorrente") &&
      amount &&
      installments
    ) {

    } else {

    }
  }, [amount, installments, valueType, paymentType]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const data: Omit<Transaction, "id"> = {
      description,
      category,
      amount: parseFloat(amount),
      date,
      type,
      status,
      paymentType,
    };

    if (paymentType === "parcelada") {
      data.installments = parseInt(installments);
      data.currentInstallment = parseInt(currentInstallment);
    }

    if (paymentType === "recorrente") {
      data.installments = parseInt(installments);
      data.dueDay = parseInt(dueDay);
      data.autoDebit = autoDebit;
      data.valueType = valueType;
    }

    onSave(data);
  };

  const categories =
    type === "receita"
      ? [
          { value: "", label: "Selecione uma categoria" },
          { value: "Salário", label: "Salário" },
          { value: "Freelance", label: "Freelance" },
          { value: "Investimentos", label: "Investimentos" },
          { value: "Outros", label: "Outros" },
        ]
      : [
          { value: "", label: "Selecione uma categoria" },
          { value: "Alimentação", label: "Alimentação" },
          { value: "Transporte", label: "Transporte" },
          { value: "Moradia", label: "Moradia" },
          { value: "Lazer", label: "Lazer" },
          { value: "Outros", label: "Outros" },
        ];

  const statusOptions = [
    { value: "pago", label: "Pago" },
    { value: "pendente", label: "Pendente" },
    { value: "agendado", label: "Agendado" },
  ];

  const paymentTypeOptions = [
    { value: "unica", label: "Única" },
    { value: "parcelada", label: "Parcelada" },
    { value: "recorrente", label: "Recorrente (Mensal)" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1>
          {transaction ? "Editar" : "Adicionar"}{" "}
          {type === "receita" ? "Receita" : "Despesa"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <h3>Informações Básicas</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select
                  options={categories}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tipo de Pagamento
                </label>
                <Select
                  options={paymentTypeOptions}
                  value={paymentType}
                  onChange={(e) =>
                    setPaymentType(
                      e.target.value as
                        | "unica"
                        | "parcelada"
                        | "recorrente"
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {paymentType === "parcelada"
                    ? "Valor da Parcela"
                    : paymentType === "recorrente" &&
                      valueType === "monthly"
                    ? "Valor Mensal"
                    : "Valor"}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  options={statusOptions}
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as
                        | "pago"
                        | "pendente"
                        | "agendado"
                    )
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t">
              <Button type="submit" className="flex-1">
                Salvar
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
