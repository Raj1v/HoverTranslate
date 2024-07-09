import { useEffect, useState } from "react";
import { TranslationContext } from "@/app/TranslationContext";
import TextArea from "@/app/components/TextArea";
import { TranslationData, SentenceItem } from "@/app/lib/types";
import { getTranslation, getSampleSentence } from "@/app/actions";
import LanguageSelection from "@/app/components/LanguageSelection";

export default function Main() {
  const [targetLaguage, setTargetLanguage] = useState<string>("English");
  const [translationData, setTranslationData] =
    useState<TranslationData | null>(null);

  const [activeTranslation, setActiveTranslation] = useState<
    SentenceItem[] | null
  >(null);

  const handleTranslate = async (input: string) => {
    const translationData = await getTranslation(input, targetLaguage);
    setTranslationData(translationData);
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
        />
        <div className="w-full">
          <TextArea
            className="mt-5"
            activeTranslation={activeTranslation}
            setActiveTranslation={setActiveTranslation}
            handleTranslate={handleTranslate}
          />
        </div>
      </main>
    </TranslationContext.Provider>
  );
}
