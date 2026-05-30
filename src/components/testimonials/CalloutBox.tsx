interface CalloutBoxProps {
  header: string;
  content: string;
}

export default function CalloutBox({ header, content }: CalloutBoxProps) {
  return (
    <div className="bg-stone-50 border-l-4 border-amber-400 rounded-r p-5">
      <p className="uppercase tracking-wider text-xs font-semibold text-stone-600 mb-2">
        {header}
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
    </div>
  );
}
