export const daysArrowInput = (
  currentValue: string,
  direction: 'up' | 'down'
): string => {
  if (direction === 'up') {
    if (Number(currentValue) !== 31) {
      return (Number(currentValue) + 1).toString().padStart(2, '0');
    } else {
      return '01';
    }
  } else {
    if (Number(currentValue) !== 1) {
      return (Number(currentValue) - 1).toString().padStart(2, '0');
    } else {
      return '31';
    }
  }
};

export const monthArrowInput = (
  currentValue: string,
  direction: 'up' | 'down'
): string => {
  if (direction === 'up') {
    if (Number(currentValue) !== 12) {
      return (Number(currentValue) + 1).toString().padStart(2, '0');
    } else {
      return '01';
    }
  } else {
    if (Number(currentValue) !== 1) {
      return (Number(currentValue) - 1).toString().padStart(2, '0');
    } else {
      return '12';
    }
  }
};

export const yearsArrowInput = (
  currentValue: string,
  direction: 'up' | 'down'
): string => {
  if (direction === 'up') {
    return (Number(currentValue) + 1).toString();
  } else {
    return (Number(currentValue) - 1).toString();
  }
};

export const hoursArrowInput = (
  currentValue: string,
  direction: 'up' | 'down'
): string => {
  if (direction === 'up') {
    if (Number(currentValue) !== 23) {
      return (Number(currentValue) + 1).toString().padStart(2, '0');
    } else {
      return '00';
    }
  } else {
    if (Number(currentValue) !== 0) {
      return (Number(currentValue) - 1).toString().padStart(2, '0');
    } else {
      return '23';
    }
  }
};

export const minutesOrSecondsArrowInput = (
  currentValue: string,
  direction: 'up' | 'down'
): string => {
  if (direction === 'up') {
    if (Number(currentValue) !== 59) {
      return (Number(currentValue) + 1).toString().padStart(2, '0');
    } else {
      return '00';
    }
  } else {
    if (Number(currentValue) !== 0) {
      return (Number(currentValue) - 1).toString().padStart(2, '0');
    } else {
      return '59';
    }
  }
};
