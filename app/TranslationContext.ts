// src/contexts/TranslationContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { SentenceItem, TranslationData } from '@/app/lib/types'; // Adjust the import path as necessary

type TranslationContextProps = {
  translationData: TranslationData | null;
  setTranslationData: React.Dispatch<React.SetStateAction<TranslationData | null>>;
};

export const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (!context) throw Error("useTranslationContext can only be used inside an TranslationProvider");
  return context;
}