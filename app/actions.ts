"use server";
import { translateText } from "@/app/lib/fetch-translation";
import { TranslationData } from "@/app/lib/types";

export async function getTranslation(original: string, targetLanguage: string): Promise<TranslationData>{
    try {
        const result = await translateText(original, targetLanguage);
        console.log(result)
        return result as TranslationData;
    } catch (error) {
        return (error as Error).toString();
    }
}

const sample_sentences : string[] = [
    "Je parle à mon chien en français pour qu'il devienne bilingue.", // French: "I speak to my dog in French so he becomes bilingual."
    "Mein Hamster hat meine Hausaufgaben gefressen.", // German: "My hamster ate my homework."
    "Min computer er langsommere end en snegl på en berg-og-dal-bane.", // Danish: "My computer is slower than a snail on a roller coaster."
    "Mijn schildpad heeft net een marathon gewonnen.", // Dutch: "My turtle just won a marathon."
    "Min katt tror att den är en ninja och gömmer sig överallt.", // Swedish: "My cat thinks it's a ninja and hides everywhere."
    "Min vänster sko är alltid borta när jag behöver den.", // Norwegian: "My left shoe is always missing when I need it."
    "La mia pianta da appartamento mi guarda come se sapesse qualcosa.", // Italian: "My houseplant looks at me like it knows something."
    "Meine Kaktus hat mir gerade einen Witz erzählt.", // German: "My cactus just told me a joke."
    "Mon chien pense que c'est une licorne.", // French: "My dog thinks it's a unicorn."
    "Mi reloj siempre está cinco minutos tarde.", // Spanish: "My watch is always five minutes late."
    "Mein Kaffee hat mir heute Morgen ein High Five gegeben.", // Swiss German: "My coffee gave me a high five this morning."
    "Minha geladeira faz mais barulho que um concerto de rock.", // Portuguese: "My fridge makes more noise than a rock concert."
    "Min dator tror att det är en brödrost.", // Swedish: "My computer thinks it's a toaster."
    "Meu hamster acha que é o rei do mundo.", // Portuguese: "My hamster thinks it's the king of the world."
];


export async function getSampleSentence(): Promise<string> {
    const sentence = sample_sentences[Math.floor(Math.random()*sample_sentences.length)];
    return sentence;
}