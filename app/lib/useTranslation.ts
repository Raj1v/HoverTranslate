import { useMemo } from 'react';
import { SentenceItem } from './types';
import { TranslationData, ActiveTranslation } from './types';

const getSentenceItemsFromActiveTranslation = (activeTranslation: ActiveTranslation, translationData: TranslationData) => {
  return activeTranslation?.map((element) => translationData.sentences[element.sentenceId].sentenceItems[element.sentenceItemId]);
}


export default function useTranslation(
  activeTranslation: ActiveTranslation,
  translationData: TranslationData
) {
  const sentenceItems = useMemo(() => {
    return getSentenceItemsFromActiveTranslation(activeTranslation, translationData);
  }, [activeTranslation, translationData]);

  const translation = useMemo(() => {
    return sentenceItems
      ?.map((element) => element.translation)
      .join(" ");
  }, [sentenceItems]);

  return { translation, sentenceItems };
}
