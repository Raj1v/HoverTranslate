import Image from "next/image";
import TextArea from "@/app/components/TextArea";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-normal p-24 ">
      <h1 className="text-4xl font-bold">HoverTranslate</h1>
      <TextArea html="alternative <b>text</b>" className="mt-5" />
    </main>
  );
}
