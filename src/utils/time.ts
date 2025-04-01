import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const dateFormatOptionsMap = {
  'full-date-hour-minute': 'dd/MM/yyyy HH:mm',
  'long-date': "d 'de' MMMM, yyyy",
  'full-date': 'dd/MM/yyyy',
  'short-date': 'dd/MM/yy',
  'hour-minute': 'HH:mm',
};

type DateFormatOption = keyof typeof dateFormatOptionsMap;

export function formatDate(
  date: Date,
  formatOption: DateFormatOption,
  timeZone?: string | undefined
) {
  const formatString = dateFormatOptionsMap[formatOption];
  return timeZone
    ? formatInTimeZone(date, timeZone, formatString)
    : format(date, formatString);
}
