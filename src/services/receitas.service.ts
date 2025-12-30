import { http } from "../lib/http";
import type { ReceitaDto } from "../types/receita";

export const receitasService = {
  listar: () => http.get<ReceitaDto[]>("/receitas"),

  buscarPorId: (id: number) => http.get<ReceitaDto>(`/receitas/${id}`),

  somaRecebido: () => http.get<number>("/receitas/soma-recebido"),

  criar: (dto: ReceitaDto) => http.post<ReceitaDto>("/receitas", dto),

  atualizar: (id: number, dto: ReceitaDto) => http.put<ReceitaDto>(`/receitas/${id}`, dto),

  alterarStatus: (id: number) => http.put<ReceitaDto>(`/receitas/altera-status/${id}`, {}),

  deletar: (id: number) => http.del<void>(`/receitas/${id}`),
};
