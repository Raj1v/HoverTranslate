import { useEffect, useState, useRef } from "react";
import { TranslationContext } from "@/app/TranslationContext";
import TextArea from "@/app/components/TextArea";
import { TranslationData, ActiveTranslation } from "@/app/lib/types";
import { getTranslation, getSampleSentence, checkChange } from "@/app/actions";
import LanguageSelection from "@/app/components/LanguageSelection";
import WordCounter from "@/app/components/WordCounter";
import DetailsBox from "@/app/components/DetailsBox";

export default function Main(props: { className?: string }) {
  const [targetLanguage, setTargetLanguage] = useState<string>("English");
  const [translationData, setTranslationData] =
    useState<TranslationData | null>(null);

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

  useEffect(() => {
    const translate = async () => {
      if (!inputText || !targetLanguage) return;
      if (
        targetLanguage === prevInput.current?.targetLanguage &&
        prevInput.current?.input !== undefined
      ) {
        const inputChanged = await checkChange(
          inputText,
          prevInput.current.input
        );
        if (!inputChanged) {
          return;
        }
      }

      setLoading(true);

      try {
        const translationData = await getTranslation(inputText, targetLanguage);
        prevInput.current.input = inputText;
        prevInput.current.targetLanguage = targetLanguage; // Store the current target language
        setTranslationData(translationData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    translate();
  }, [inputText, targetLanguage]);

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
              sourceLanguage={translationData?.source_language || ""}
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
            innerRef={textboxRef}
            setInputText={setInputText}
            setCharCount={setCharCount}
          />
          <DetailsBox activeTranslation={activeTranslation} />
        </div>
        <div className="w-full flex justify-end">
          <WordCounter textboxRef={textboxRef} charCount={charCount} />
        </div>
      </main>
    </TranslationContext.Provider>
  );
}
