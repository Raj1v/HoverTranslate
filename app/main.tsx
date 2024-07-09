import { useEffect, useState, useRef } from "react";
import { TranslationContext } from "@/app/TranslationContext";
import TextArea from "@/app/components/TextArea";
import { TranslationData, SentenceItem } from "@/app/lib/types";
import { getTranslation, getSampleSentence } from "@/app/actions";
import LanguageSelection from "@/app/components/LanguageSelection";
import WordCounter from "@/app/components/WordCounter";

export default function Main() {
  const [targetLaguage, setTargetLanguage] = useState<string>("English");
  const [translationData, setTranslationData] =
    useState<TranslationData | null>(null);

  const [activeTranslation, setActiveTranslation] = useState<
    SentenceItem[] | null
  >(null);

  const [loading, setLoading] = useState<boolean>(false);
  const prevInput = useRef<string>("");

  const textboxRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState<number>(0);

  const handleTranslate = async (input: string) => {
    if (input === prevInput.current) return;
    setLoading(true);
    try {
      const translationData = await getTranslation(input, targetLaguage);
      prevInput.current = input;
      setTranslationData(translationData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const setSampleSentence = async () => {
      const sampleSentence = await getSampleSentence();
      await handleTranslate(sampleSentence);
    };

    setSampleSentence();
  }, []);

  return (
    <TranslationContext.Provider
      value={{ translationData, setTranslationData }}
    >
      <main className="flex min-h-screen flex-col items-center justify-normal p-24 ">
        <h1 className="text-4xl font-bold">
          <span>Hover</span>
          <span className="italic bg-slate-900 text-white pr-2 ml-1">
            Translate
          </span>
        </h1>
        <LanguageSelection
          sourceLanguage={translationData?.source_language || ""}
          targetLaguage={targetLaguage}
          setTargetLanguage={setTargetLanguage}
          isLoading={loading}
        />
        <div className="w-full">
          <TextArea
            className="mt-5"
            activeTranslation={activeTranslation}
            setActiveTranslation={setActiveTranslation}
            handleTranslate={handleTranslate}
            innerRef={textboxRef}
            setCharCount={setCharCount}
          />
        </div>
        <WordCounter textboxRef={textboxRef} charCount={charCount} />
      </main>
    </TranslationContext.Provider>
  );
}
