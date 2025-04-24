function calculateDaysAndNights(startDate: Date, endDate: Date): { days: number; nights: number } {
  // Convert dates to ensure time differences are considered
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    // throw new Error('Start date must be before or equal to end date');
    console.log('calculateDaysAndNights: Start date must be before or equal to end date');
    return { days: 0, nights: 0 };
  }

  // Calculate the difference in days (inclusive)
  const timeDiff = end.getTime() - start.getTime();
  const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

  // Calculate nights
  const nights = days - 1;

  return { days, nights };
}

const tourFunctions = { calculateDaysAndNights };
export default tourFunctions;
