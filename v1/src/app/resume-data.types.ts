export type Language = 'nl' | 'en' | 'fr' | 'de' | 'es' | 'zh-Hans';

export type ResumeData = {
  language: Language;
  labels: {
    personalia: string;
    profile: string;
    overview: string;
    experience: string;
    skills: string;
    courses: string;
    environment: string;
    responsibilities: string;
    languageToggle: string;
    searchPlaceholder: string;
    filtersTitle: string;
    sectionsTitle: string;
    downloadTitle: string;
    downloadPdf: string;
    downloadTxt: string;
    downloadMd: string;
    downloadDocx: string;
    expand: string;
    collapse: string;
    facts: {
      name: string;
      title: string;
      location: string;
      birthDate: string;
      nationality: string;
      experienceSince: string;
      maritalStatus: string;
    };
  };
  personalia: {
    name: string;
    title: string;
    location: string;
    birthDate: string;
    nationality: string;
    experienceSince: string;
    maritalStatus: string;
  };
  profile: {
    paragraphs: string[];
  };
  overview: {
    items: Array<{
      company: string;
      role: string;
      period: string;
    }>;
  };
  experience: {
    items: Array<{
      id: string;
      period: string;
      company: string;
      role: string;
      responsibilities: string;
      environment: string;
    }>;
  };
  skills: {
    groups: Array<{
      title: string;
      items: string[];
    }>;
  };
  courses: {
    items: string[];
  };
};
