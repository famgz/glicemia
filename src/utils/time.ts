import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';

const dateFormatOptionsMap = {
  'full-date-hour-minute': 'dd/MM/yyyy HH:mm',
  'long-date': "d 'de' MMMM, yyyy",
  'full-date': 'dd/MM/yyyy',
  'full-date-inverted': 'yyyy/MM/dd',
  'short-date': 'dd/MM/yy',
  'hour-minute': 'HH:mm',
};

export type DateFormatOption = keyof typeof dateFormatOptionsMap;

export function formatDate(
  date: Date,
  formatOption: DateFormatOption,
  timeZone?: string | undefined
) {
  const formatString = dateFormatOptionsMap[formatOption];
  return timeZone
    ? formatInTimeZone(date, timeZone, formatString, { locale: ptBR })
    : format(date, formatString, { locale: ptBR });
}
