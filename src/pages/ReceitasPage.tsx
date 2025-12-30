import React from "react";
import { ExpenseList } from "../components/ExpenseList";
import { receitasService } from "../services/receitas.service";
import { receitaToTransaction, type Transaction } from "../mappers/receitaToTransaction";
import type { ReceitaDto } from "../types/receita";

export function ReceitasPage() {
  const [receitas, setReceitas] = React.useState<ReceitaDto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function carregar() {
    try {
      setLoading(true);
      setError(null);
      const data = await receitasService.listar();
      setReceitas(data);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar receitas");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    carregar();
  }, []);

  const transactions: Transaction[] = receitas.map(receitaToTransaction);

  const onDelete = async (id: string) => {
    try {
      await receitasService.deletar(Number(id));
      await carregar();
    } catch (e: any) {
      alert(e?.message ?? "Erro ao deletar receita");
    }
  };

  const onEdit = (t: Transaction) => {
    // Aqui você abre seu modal/form de edição.
    // Se você já tem ExpenseForm, eu encaixo para você no próximo passo.
    console.log("editar", t);
    alert("Próximo passo: ligar o formulário de edição.");
  };

  const onAdd = () => {
    // Aqui você abre seu modal/form de criação.
    console.log("adicionar");
    alert("Próximo passo: ligar o formulário de criação.");
  };

  if (loading) return <div className="p-6">Carregando receitas...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <ExpenseList
        transactions={transactions}
        type="receita"
        onEdit={onEdit}
        onDelete={onDelete}
        onAdd={onAdd}
      />
    </div>
  );
}
