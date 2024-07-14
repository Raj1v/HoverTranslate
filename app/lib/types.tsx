export type SentenceItem = {
  original: string;
  translation: string;
};

export type Sentence = {
  sentenceItems: SentenceItem[];
};

export type TranslationData = {
  sentences: Sentence[];
  source_language: string;
  target_language: string;
};

export type ActiveTranslation =
  | {
      sentenceId: number;
      sentenceItemId: number;
    }[]
  | null;

// Mock sentence data

// export const sampleDataSpanish: TranslationData = {
//   source_language: "es",
//   target_language: "en",
//   sentenceItems: [
//     { original: "Mi", translation: "My" },
//     { original: "perro", translation: "dog" },
//     { original: "piensa", translation: "thinks" },
//     { original: "que", translation: "that" },
//     { original: "es", translation: "is" },
//     { original: "humano", translation: "human" },
//     { original: "y", translation: "and" },
//     { original: "yo", translation: "I" },
//     { original: "a veces", translation: "sometimes" },
//     { original: "pienso", translation: "think" },
//     { original: "que", translation: "that" },
//     { original: "soy", translation: "am" },
//     { original: "perro!", translation: "dog!" },
//   ],
// };

// export const sampleDataGerman: TranslationData = {
//   source_language: "de",
//   target_language: "en",
//   sentenceItems: [
//     { original: "Ich", translation: "I" },
//     { original: "bin", translation: "am" },
//     { original: "nicht", translation: "not" },
//     { original: "faul,", translation: "lazy," },
//     { original: "ich", translation: "I" },
//     { original: "bin", translation: "am" },
//     { original: "energiesparend.", translation: "energy-saving." },
//   ],
// };

// export const sampleDataFrench: TranslationData = {
//   source_language: "fr",
//   target_language: "en",
//   sentenceItems: [
//     { original: "Je", translation: "I" },
//     { original: "ne", translation: "do not" },
//     { original: "suis", translation: "am" },
//     { original: "pas", translation: "not" },
//     { original: "paresseux,", translation: "lazy," },
//     { original: "je", translation: "I" },
//     { original: "suis", translation: "am" },
//     { original: "en", translation: "in" },
//     { original: "mode", translation: "mode" },
//     { original: "économie", translation: "economy" },
//     { original: "d'énergie.", translation: "of energy." },
//   ],
// };

// export const sampleDataSwissGerman: TranslationData = {
//   source_language: "de-CH",
//   target_language: "en",
//   sentenceItems: [
//     { original: "I", translation: "I" },
//     { original: "bi", translation: "am" },
//     { original: "nid", translation: "not" },
//     { original: "faul,", translation: "lazy," },
//     { original: "I", translation: "I" },
//     { original: "bi", translation: "am" },
//     { original: "energie", translation: "energy" },
//     { original: "sparend.", translation: "saving." },
//   ],
// };

// export const sampleData: TranslationData[] = [
//   sampleDataSpanish,
//   sampleDataGerman,
//   sampleDataFrench,
//   sampleDataSwissGerman,
// ];
