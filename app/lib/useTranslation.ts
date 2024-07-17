import { useMemo } from 'react';
import { SentenceItem } from './types';
import { TranslationData, ActiveTranslation } from './types';

const getSentenceItemsFromActiveTranslation = (activeTranslation: ActiveTranslation, translationData: TranslationData) => {
  return activeTranslation?.map((element) => {
    const sentence = translationData.sentences[element.sentenceId];
    return sentence?.sentenceItems[element.sentenceItemId] ?? null; // Provide a fallback value like `null` or an appropriate default
  });
}


export default function useTranslation(
  activeTranslation: ActiveTranslation,
  translationData: TranslationData | null
) {
  const sentenceItems = useMemo(() => {
    if (!activeTranslation || !translationData) return null;
    return getSentenceItemsFromActiveTranslation(activeTranslation, translationData);
  }, [activeTranslation, translationData]);

  const translation = useMemo(() => {
    return sentenceItems
      ?.filter((element) => element !== null) // Add this line to filter out null elements
      .map((element) => element.translation)
      .join(" ");
  }, [sentenceItems]);

  return { translation, sentenceItems };
}
