export type SearchableFaqItem = {
  category: string;
  question: string;
  schemaAnswer: string;
  keywords: string[];
};

export const filterFaqItems = <T extends SearchableFaqItem>(
  items: T[],
  category: string,
  searchTerm: string,
) => {
  const query = searchTerm.trim().toLowerCase();

  return items.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    const searchableContent = [item.question, item.schemaAnswer, ...item.keywords]
      .join(' ')
      .toLowerCase();

    return matchesCategory && (!query || searchableContent.includes(query));
  });
};
