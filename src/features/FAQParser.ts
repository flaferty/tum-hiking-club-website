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
	const json = await response.json()
	console.log(json.find((s: FAQSection) => s.title === sectionTitle))
	return json.find((s: FAQSection) => s.title === sectionTitle);
}




