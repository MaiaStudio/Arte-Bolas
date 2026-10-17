/**
 * Arte Bola Balões — Estrutura de Portfólio Real
 * 
 * Preparação para apresentação futura de projetos realizados:
 * - Título
 * - Categoria
 * - Imagem
 * - Descrição curta
 * 
 * Sem preenchimento fictício ou inventado. Pronto para receber fotografias reais.
 */

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  date?: string;
  featured?: boolean;
}

export const projects: ProjectItem[] = [];
