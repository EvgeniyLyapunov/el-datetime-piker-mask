import { dayjs } from 'element-plus';
import type { IDateFormatObject } from './lw-datetime-types';

export const getValidModel = (obj: IDateFormatObject): Date => {
  const temp = { ...obj };
  const monthDays = {
    '29': ['02'],
    '30': ['04', '06', '09', '11']
  };

  if (monthDays[29].includes(obj.MM)) {
    if (Number(obj.DD) > 28) {
      if (Number(obj.YYYY) % 4 === 0) {
        temp.DD = '29';
      } else {
        temp.DD = '28';
      }
    }
  } else if (monthDays[30].includes(obj.MM)) {
    if (Number(obj.DD) > 30) {
      temp.DD = '30';
    }
  }

  return new Date(
    `${temp.YYYY}-${temp.MM}-${temp.DD} ${temp.HH}:${temp.mm}:${temp.ss}`
  );
};
