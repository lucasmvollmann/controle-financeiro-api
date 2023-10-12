import { Injectable } from '@nestjs/common';

@Injectable()
export class DateHelper {
  getLastDayOfMonth(month: number, year: number) {
    return new Date(year, month, 0);
  }

  getFirstDayOfMonth(month: number, year: number) {
    return new Date(year, month - 1, 1);
  }
}
