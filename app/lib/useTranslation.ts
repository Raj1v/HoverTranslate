import { useMemo } from 'react';
import { SentenceItem } from './types';

export default function useTranslation(activeTranslation : SentenceItem[] | null) {
  const translation = useMemo(() => {
    return activeTranslation
      ?.map((element) => element.translation)
      .join(" ");
  }, [activeTranslation]);

  return translation;
}