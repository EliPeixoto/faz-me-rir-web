import type { ReceitaDto } from "../types/receita";

export type Transaction = {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: "receita" | "despesa";
  status: "pago" | "pendente" | "agendado";
};

function mapStatusBackendToUI(status?: string): Transaction["status"] {
  // Ajuste aqui conforme seu backend:
  // Ex.: "RECEBIDO" -> "pago"
  // Se não tiver status no backend, deixamos "pago" por padrão.
  if (!status) return "pago";

  const s = status.toLowerCase();
  if (s.includes("receb") || s.includes("pago")) return "pago";
  if (s.includes("pend")) return "pendente";
  if (s.includes("agend")) return "agendado";
  return "pago";
}

export function receitaToTransaction(r: ReceitaDto): Transaction {
  return {
    id: String(r.id ?? ""),
    description: r.descricaoRecebimento,
    category: r.categoriaReceita,
    amount: Number(r.valorReceita),
    date: r.data,
    type: "receita",
    status: mapStatusBackendToUI(r.statusReceita),
  };
}
