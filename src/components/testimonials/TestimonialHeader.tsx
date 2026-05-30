interface TestimonialHeaderProps {
  label?: string | null;
}

export default function TestimonialHeader({ label }: TestimonialHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-baseline">
        <span className="uppercase tracking-[0.2em] text-xs font-medium text-stone-500">
          DA Tuition
        </span>
        {label && (
          <span className="uppercase tracking-[0.2em] text-xs font-medium text-stone-400">
            {label}
          </span>
        )}
      </div>
      <div className="h-[2px] bg-gradient-to-r from-amber-400 to-amber-200 mt-3" />
    </div>
  );
}
