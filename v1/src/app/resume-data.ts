import { Language, ResumeData } from './resume-data.types';
import { resumeDataNl } from './resume-data.nl';
import { resumeDataEn } from './resume-data.en';
import { resumeDataFr } from './resume-data.fr';
import { resumeDataDe } from './resume-data.de';
import { resumeDataEs } from './resume-data.es';
import { resumeDataZhHans } from './resume-data.zh-Hans';

export type { Language, ResumeData } from './resume-data.types';

export const resumeData: Record<Language, ResumeData> = {
  nl: resumeDataNl,
  en: resumeDataEn,
  fr: resumeDataFr,
  de: resumeDataDe,
  es: resumeDataEs,
  'zh-Hans': resumeDataZhHans
};
