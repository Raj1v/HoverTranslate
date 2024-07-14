import { SentenceItem } from "@/app/lib/types";
import useTranslation from "@/app/lib/useTranslation";

// Debug box compunent
const DetailsBox = (props: { activeTranslation: SentenceItem[] | null }) => {
  const { activeTranslation } = props;
  const translation = useTranslation(activeTranslation);
  return (
    <div className="w-3/12 h-80 flex-shrink-0 px-5">
      <span
        className="block font-semibold
              text-xl w-full text-center
              bg-slate-700 text-gray-100 "
      >
        {activeTranslation?.map((element) => element.original).join(" ") ||
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
