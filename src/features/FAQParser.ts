export interface FAQ {
  question: string;
  answer: string;
}

export interface FAQSection {
  title: string;
  questions: FAQ[];
}

export async function fetchAndParseFAQ(): Promise<FAQSection[]> {
  const response = await fetch("/faq.json");
  return await response.json();
}

export async function fetchAndParseFAQSection(sectionTitle: string): Promise<FAQSection> {
  const response = await fetch("/faq.json");
  const sections: FAQSection[] = await response.json();
  const section = sections.find((s: FAQSection) => s.title === sectionTitle);
  if (!section) {
    throw new Error(`FAQ section with title "${sectionTitle}" not found`);
  }
  return section;
}
