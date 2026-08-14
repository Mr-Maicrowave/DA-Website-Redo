import katex from 'katex';
import 'katex/dist/katex.min.css';

type LatexEquationProps = {
  latex: string;
  className?: string;
  displayMode?: boolean;
};

export const LatexEquation = ({ latex, className = '', displayMode = false }: LatexEquationProps) => (
  <span
    className={className}
    aria-label={latex}
    dangerouslySetInnerHTML={{
      __html: katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        strict: false,
      }),
    }}
  />
);
