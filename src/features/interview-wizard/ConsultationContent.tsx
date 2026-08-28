import { AFTER_CONSULTATION, CONSULTATION_STEPS, DURING_CONSULTATION } from './config.ts';

function ContentList({ title, items }: { title: string; items: readonly { title: string; description: string }[] }) {
  return <section className="interview-consultation-section"><h2>{title}</h2><div>{items.map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>;
}

export function ConsultationContent() {
  return <div className="interview-consultation-content">
    <ContentList title="How the consultation works" items={CONSULTATION_STEPS} />
    <ContentList title="What happens during the consultation" items={DURING_CONSULTATION} />
    <ContentList title="What happens after the consultation" items={AFTER_CONSULTATION} />
  </div>;
}
