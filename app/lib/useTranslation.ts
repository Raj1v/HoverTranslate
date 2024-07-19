import { useMemo } from 'react';
import { SentenceItem } from './types';
import { TranslationData, ActiveTranslation } from './types';

const getSentenceItemsFromActiveTranslation = (activeTranslation: ActiveTranslation, translationData: TranslationData) => {
  return activeTranslation?.map((element) => {
    const sentence = translationData.sentences[element.sentenceId];
    if (!sentence) return false;
    const sentenceItem = sentence.sentenceItems.find((sentenceItem) => sentenceItem.wordIds?.includes(element.wordId) || null);
    if (!sentenceItem) return false;
    return sentenceItem;
  });
}




/**
 * Custom hook to bridge active translation and translation data.
 * Looks up the translation data for the active translation, or
 * fetches it if it's not available.
 * 
 * @param activeTranslation - The active translation object.
 * @param translationData - The translation data object.
 * @returns An object containing the translation and sentence items
 */
export default function useTranslation(
  activeTranslation: ActiveTranslation,
  translationData: TranslationData | null,
  //setTransationData: (data: TranslationData) => void
) {

  const sentenceItem = useMemo(() : SentenceItem | false | null => {
    if (!activeTranslation) return null;
    if (!translationData) return false;
    const sentenceItems  = getSentenceItemsFromActiveTranslation(activeTranslation, translationData);
    if (!sentenceItems) return false;
    return sentenceItems[0];
  }, [activeTranslation, translationData]);

  const translation = useMemo(() => {
    if (sentenceItem === null) return null;
    if (sentenceItem === false){
      // Trigger translation of the sentence by setting the translation data
      //if (!activeTranslation) return null;
      //translationData.sentences[activeTranslation[0].sentenceId] =null;
      //setTransationData(translationData);
      return false;
    }
    return sentenceItem.translation;
  }, [sentenceItem]);


  return { translation, sentenceItem };
}
