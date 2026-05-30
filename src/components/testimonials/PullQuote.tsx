interface PullQuoteProps {
  text: string;
}

export default function PullQuote({ text }: PullQuoteProps) {
  return (
    <blockquote className="border-l-4 border-[#1a2744] pl-6 py-2 my-8">
      <p className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed">{text}</p>
    </blockquote>
  );
}
