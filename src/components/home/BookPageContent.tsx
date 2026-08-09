import { Link } from 'react-router-dom';
import type { HeroChapter } from '@/data/heroChapters';
import type { BookPageTemplate } from '@/data/bookPages';
import styles from './BookHero.module.css';

function ChapterAction({ action, secondary = false }: {
  action: NonNullable<HeroChapter['primaryCta']>;
  secondary?: boolean;
}) {
  const className = secondary ? styles.secondaryAction : styles.primaryAction;
  const content = <>{action.label}<span aria-hidden="true">→</span></>;

  if (action.href.startsWith('#')) {
    return <a className={className} href={action.href}>{content}</a>;
  }

  return <Link className={className} to={action.href}>{content}</Link>;
}

function getTitleSizeClass(title: string) {
  if (title.length < 28) return styles.titleShort;
  if (title.length <= 48) return styles.titleMedium;
  return styles.titleLong;
}

const templateClassNames: Record<BookPageTemplate, string> = {
  statement: styles.statementPage,
  feature: styles.featurePage,
  journey: styles.journeyPage,
  story: styles.storyPage,
  trust: styles.trustPage,
  closing: styles.closingPage,
};

export function BookPageContent({
  chapter,
  pageNumber,
  template,
}: {
  chapter: HeroChapter;
  pageNumber: number;
  template: BookPageTemplate;
}) {
  const number = String(pageNumber).padStart(2, '0');

  return (
    <div className={`${styles.previewContent} ${templateClassNames[template]}`}>
      <div className={styles.chapterLabel}>
        <small aria-hidden="true">{number}</small>
        <span>{chapter.chapterLabel}</span>
        <i aria-hidden="true">✦</i>
      </div>

      <h1 className={getTitleSizeClass(chapter.title)}>{chapter.title}</h1>
      <div className={styles.goldRule} aria-hidden="true"><span>✦</span></div>
      <p>{chapter.description}</p>

      {(chapter.primaryCta || chapter.secondaryCta) && (
        <div className={styles.actions}>
          {chapter.primaryCta && <ChapterAction action={chapter.primaryCta} />}
          {chapter.secondaryCta && <ChapterAction action={chapter.secondaryCta} secondary />}
        </div>
      )}

      <span className={styles.templateOrnament} aria-hidden="true">✦</span>
    </div>
  );
}
