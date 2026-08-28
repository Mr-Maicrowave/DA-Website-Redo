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

export const paginateFaqItems = <T>(items: T[], requestedPage: number, pageSize: number) => {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(1, requestedPage), pageCount);
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = items.slice(startIndex, startIndex + pageSize);

  return {
    items: pageItems,
    currentPage,
    pageCount,
    start: items.length ? startIndex + 1 : 0,
    end: startIndex + pageItems.length,
  };
};
