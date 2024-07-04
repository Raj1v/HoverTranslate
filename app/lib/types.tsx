export type SentenceItem = {
    original: string;
    translation: string;
};

export type SentenceData = {
    sentenceItems: SentenceItem[];
    source_language: string;
    target_language: string;
}

// Mock sentence data
export const sampleData: SentenceData = {
    source_language: "es",
    target_language: "en",
    sentenceItems: [
        { original: "Mi", translation: "My" },
        { original: "perro", translation: "dog" },
        { original: "piensa", translation: "thinks" },
        { original: "que", translation: "that" },
        { original: "es", translation: "is" },
        { original: "humano", translation: "human" },
        { original: "y", translation: "and" },
        { original: "yo", translation: "I" },
        { original: "a veces", translation: "sometimes" },
        { original: "pienso", translation: "think" },
        { original: "que", translation: "that" },
        { original: "soy", translation: "am" },
        { original: "perro!", translation: "dog!" }]
}

