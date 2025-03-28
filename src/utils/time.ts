import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(date: Date = new Date()): string {
  return format(date, "d 'de' MMMM, yyyy", { locale: ptBR });
}

export function getFullDate(date: Date) {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

export function getDate(date: Date) {
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
}

export function getHourMinute(date: Date) {
  return format(date, 'HH:mm', { locale: ptBR });
}
