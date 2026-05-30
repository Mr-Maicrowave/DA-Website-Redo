interface BottomBannerProps {
  quote: string;
  author: string;
}

export default function BottomBanner({ quote, author }: BottomBannerProps) {
  return (
    <div className="bg-stone-100 border-t border-stone-200 px-8 py-6">
      <p className="italic text-gray-700 text-sm md:text-base">{quote}</p>
      <p className="text-right text-sm font-medium text-stone-600 mt-2 uppercase tracking-wider">
        {author}
      </p>
    </div>
  );
}
