import { useEffect, useState, useRef } from "react";
import { TranslationContext } from "@/app/TranslationContext";
import TextArea from "@/app/components/TextArea";
import {
  TranslationData,
  ActiveTranslation,
  Sentence,
  TranslateSentenceInput,
} from "@/app/lib/types";
import { getTranslation, getSampleSentence } from "@/app/actions";
import { translateSentence } from "@/app/lib/fetch-translation";
import LanguageSelection from "@/app/components/LanguageSelection";
import WordCounter from "@/app/components/WordCounter";
import useTranslation from "@/app/lib/useTranslation";
import DetailsBox from "@/app/components/DetailsBox";

export default function Main(props: { className?: string }) {
  const [targetLanguage, setTargetLanguage] = useState<string>("English");
  const [translationData, setTranslationData] = useState<TranslationData>({
    source_language: "",
    target_language: "",
    sentences: [],
  });

  const [activeTranslation, setActiveTranslation] =
    useState<ActiveTranslation>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const prevInput = useRef<{
    input: string | undefined;
    targetLanguage: string | undefined;
  }>({
    input: undefined,
    targetLanguage: undefined,
  });

  const textboxRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState<string>();
  const [charCount, setCharCount] = useState<number>(0);

  const { translation, sentenceItem } = useTranslation(
    activeTranslation,
    translationData
  );

  useEffect(() => {
    const translate = async () => {
      if (!targetLanguage) return;
      if (!activeTranslation) return;

      setLoading(true);

      try {
        const sentenceId = activeTranslation[0].sentenceId;
        const sentenceSpan = textboxRef.current?.querySelector(`span.sentence[data-sentence-id="${sentenceId}"]`);
        const input : TranslateSentenceInput = {
          original: sentenceSpan?.textContent ?? "",
          words: Array.from(sentenceSpan?.querySelectorAll("span.tooltip") ?? []).map((element, index) => {
            const wordId = element.getAttribute("data-word-id");
            if (!wordId) throw new Error("No word id for a word in the sentence to translate");

            return {
              word: element.textContent ?? "",
              id: parseInt(wordId),
            };
          }),
        }

        const sentence : Sentence = await translateSentence(input, targetLanguage);

        setTranslationData((prevData) => {
          const updatedSentences = {
            ...prevData.sentences,
            [activeTranslation[0].sentenceId]: sentence,
          };

          return {
            ...prevData,
            sentences: updatedSentences,
          };
        });
        

        
        
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (translation === false) {
      translate();
    }
  }, [translation]);

  const sampleLoaded = useRef(false);

  useEffect(() => {
    if (sampleLoaded.current) return;

    const setSampleSentence = async () => {
      const sampleSentence = await getSampleSentence();
      setInputText(sampleSentence);
    };

    setSampleSentence();
    sampleLoaded.current = true;
  }, []);

  return (
    <TranslationContext.Provider
      value={{ translationData, setTranslationData }}
    >
      <main
        className={`flex min-h-screen flex-col items-center justify-normal ${props.className}`}
      >
        <header>
          <h1 className="text-4xl font-bold">
            <span>Hover</span>
            <span className="italic bg-slate-700 text-white pr-2 ml-1">
              Translate
            </span>
          </h1>
        </header>
        <section className="w-full flex items-center justify-center relative text-center mt-5 mb-8">
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <LanguageSelection
              targetLanguage={targetLanguage}
              setTargetLanguage={setTargetLanguage}
              isLoading={loading}
            />
          </div>
        </section>

        <div className="w-full flex mt-5">
          <TextArea
            className="flex-grow min-w-0"
            activeTranslation={activeTranslation}
            setActiveTranslation={setActiveTranslation}
            translation={translation}
            innerRef={textboxRef}
            setCharCount={setCharCount}
          />
          {/* <DetailsBox activeTranslation={activeTranslation} /> */}
        </div>
        <div className="w-full flex justify-end">
          <WordCounter textboxRef={textboxRef} charCount={charCount} />
        </div>
      </main>
    </TranslationContext.Provider>
  );
}
