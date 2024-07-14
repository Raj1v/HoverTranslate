import { Button } from "@headlessui/react";
import { ChevronDown, CircleArrowRight, LoaderCircle } from "lucide-react";

export default function LanguageSelection(props: {
  sourceLanguage: string;
  targetLaguage: string;
  setTargetLanguage: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}) {
  const { sourceLanguage, targetLaguage, setTargetLanguage, isLoading } = props;
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
        <LanguageDropdown language={targetLaguage} active={true} />
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
      className="w-full h-10 border rounded py-2 px-4 
        text-lg text-neutral-800
        flex items-center justify-center"
    >
      {language}
      {active && <ChevronDown className="inline ml-2 -mr-2" />}
    </Button>
  );
};

const languages = [
  "Abkhaz",
  "Acehnese",
  "Acholi",
  "Afar",
  "Afrikaans",
  "Albanian",
  "Alur",
  "Amharic",
  "Arabic",
  "Armenian",
  "Assamese",
  "Avar",
  "Chinese (Simplified)",
  "Chinese (Traditional)",
  "Chuukese",
  "Chuvash",
  "Corsican",
  "Crimean Tatar",
  "Croatian",
  "Czech",
  "Danish",
  "Dari",
  "Dhivehi",
  "Dinka",
  "Dogri",
  "Hebrew",
  "Hiligaynon",
  "Hindi",
  "Hmong",
  "Hungarian",
  "Hunsrik",
  "Iban",
  "Icelandic",
  "Igbo",
  "Ilocano",
  "Indonesian",
  "Irish",
  "Italian",
  "Limburgish",
  "Lingala",
  "Lithuanian",
  "Lombard",
  "Luganda",
  "Luo",
  "Luxembourgish",
  "Macedonian",
  "Madurese",
  "Maithili",
  "Makassar",
  "Malagasy",
  "Malay",
  "Pangasinan",
  "Papiamento",
  "Pashto",
  "Persian",
  "Polish",
  "Portuguese (Brazil)",
  "Portuguese (Portugal)",
  "Punjabi (Gurmukhi)",
  "Punjabi (Shahmukhi)",
  "Quechua",
  "Q’eqchi’",
  "Romani",
  "Romanian",
  "Tajik",
  "Tamazight",
  "Tamazight (Tifinagh)",
  "Tamil",
  "Tatar",
  "Telugu",
  "Tetum",
  "Thai",
  "Tibetan",
  "Tigrinya",
  "Tiv",
  "Tok Pisin",
  "Tongan",
];
