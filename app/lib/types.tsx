export type SentenceItem = {
  wordIds: number[];
  translation: string;
};

export type Sentence = {
  sentenceItems: SentenceItem[];
};

export type TranslationData = {
  sentences: (Sentence | null)[];
  source_language: string | false;
  target_language: string;
};

export type TranslateSentenceInput = {
  original: string;
  words : {word: string, id: number}[];
}

export type ActiveTranslation =
  | {
      sentenceId: number;
      wordId: number;
    }[]
  | null;
