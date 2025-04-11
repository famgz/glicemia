import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';

const dateFormatOptionsMap = {
  'day-month': 'dd MMM',
  'full-date-hour-minute-long': `d 'de' MMMM, yyyy HH:mm`,
  'full-date-hour-minute': 'dd/MM/yyyy HH:mm',
  'full-date-inverted': 'yyyy/MM/dd',
  'full-date': 'dd/MM/yyyy',
  'hour-minute': 'HH:mm',
  'long-date': "d 'de' MMMM, yyyy",
  'short-date': 'dd/MM/yy',
  weekday: 'EEEE',
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

export function getWeekDayFromShortDate(shortDate: string) {
  const [day, month, year] = shortDate.split('/');
  let weekDay = formatDate(
    new Date(`${year}/${month}/${day}`),
    'weekday',
  );
  weekDay = `${weekDay[0].toUpperCase()}${weekDay.slice(1)}`;
  return weekDay;
}
