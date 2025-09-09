import { useEffect, useCallback } from 'react';

interface UseKeyboardNavigationProps {
  onNextMonth: () => void;
  onPrevMonth: () => void;
  onNextYear: () => void;
  onPrevYear: () => void;
}

export function useKeyboardNavigation({
  onNextMonth,
  onPrevMonth,
  onNextYear,
  onPrevYear,
}: UseKeyboardNavigationProps) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Only handle if not typing in input/textarea
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        onPrevMonth();
        break;
      case 'ArrowRight':
        event.preventDefault();
        onNextMonth();
        break;
      case 'ArrowUp':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onPrevYear();
        }
        break;
      case 'ArrowDown':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onNextYear();
        }
        break;
      default:
        break;
    }
  }, [onNextMonth, onPrevMonth, onNextYear, onPrevYear]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
}
