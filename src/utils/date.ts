export function getNextDueDate(startDate: Date, recurrence: 'annual' | 'biannual' | 'quarterly' | 'none'): Date {
  const date = new Date(startDate);

  switch (recurrence) {
    case 'annual':
      date.setFullYear(date.getFullYear() + 1);
      break;
    case 'biannual':
      date.setMonth(date.getMonth() + 6);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'none':
      date.setFullYear(date.getFullYear() + 50);
      break;  
    default:
      throw new Error('Invalid recurrence pattern');
  }

  return date;
}
