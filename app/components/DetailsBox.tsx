import { SentenceItem, ActiveTranslation } from "@/app/lib/types";
import useTranslation from "@/app/lib/useTranslation";
import { useTranslationContext } from "@/app/TranslationContext";

// Debug box compunent
const DetailsBox = (props: { activeTranslation: ActiveTranslation }) => {
  const { activeTranslation } = props;
  const { translationData } = useTranslationContext();
  const { translation, sentenceItems } = useTranslation(
    activeTranslation,
    translationData
  );
  return (
    <div className="w-3/12 h-80 flex-shrink-0 px-5">
      <span
        className="block font-semibold
              text-xl w-full text-center
              bg-slate-700 text-gray-100 "
      >
        {sentenceItems?.map((element) => element.original).join(" ") ||
          "Start Hovering 🚀"}
      </span>
      <span className="block bg-slate-400 text-xl text-center mb-5">
        {translation}
      </span>
      <p>
        <span className="font-semibold">Conjugation</span> To be done
      </p>
      <p>
        <span className="font-semibold">Synonyms</span> To be done
      </p>
      <p>
        <span className="font-semibold">Definitions</span> To be done
      </p>
    </div>
  );
};

export default DetailsBox;
