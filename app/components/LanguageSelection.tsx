import { Button } from "@headlessui/react";
import { ChevronDown, CircleArrowRight, LoaderCircle } from "lucide-react";
import Select from "react-select";

export default function LanguageSelection(props: {
  sourceLanguage: string;
  targetLanguage: string;
  setTargetLanguage: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}) {
  const { sourceLanguage, targetLanguage, setTargetLanguage, isLoading } =
    props;
  return (
    <div
      className={`mt-10 mb-1 flex items-center justify-center flex-row space-x-4`}
    >
      <div className="flex-1 flex justify-center">
        <LanguageDropdown language={sourceLanguage} active={false} />
      </div>
      <div className="flex items-center justify-center">
        {isLoading ? (
          <LoaderCircle className="animate-spin" /> // This will show when isLoading is true
        ) : (
          <CircleArrowRight /> // This will show when isLoading is false
        )}{" "}
      </div>
      <div className="flex-1 flex justify-center">
        <Select
          className="w-40"
          value={{ value: targetLanguage, label: targetLanguage }}
          isClearable={false}
          onChange={(selectedOption) =>
            setTargetLanguage(selectedOption?.value || "")
          }
          options={commonLanguages.map((language) => ({
            value: language,
            label: language,
          }))}
        />
      </div>
    </div>
  );
}

// Const component "languagedropdown"
const LanguageDropdown = (props: { language: string; active: boolean }) => {
  const { language, active } = props;

  return (
    <Button
      disabled={!active}
      className="w-40 h-10 border rounded py-2 px-4 
        text-lg text-neutral-800
        flex items-center justify-center"
    >
      {language}
      {active && <ChevronDown className="inline ml-2 -mr-2" />}
    </Button>
  );
};

const commonLanguages = [
  "Arabic",
  "Chinese (Simplified)",
  "Chinese (Traditional)",
  "Dutch",
  "English",
  "French",
  "German",
  "Hindi",
  "Italian",
  "Japanese",
  "Korean",
  "Portuguese",
  "Russian",
  "Spanish",
  "Turkish",
];
