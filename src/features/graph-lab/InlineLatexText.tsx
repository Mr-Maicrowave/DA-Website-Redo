import { Fragment } from 'react';
import { LatexEquation } from './LatexEquation';
import { splitInlineLatex } from './inline-latex';

type InlineLatexTextProps = {
  children: string;
};

export const InlineLatexText = ({ children }: InlineLatexTextProps) => (
  <>
    {splitInlineLatex(children).map((segment, index) => (
      <Fragment key={`${segment.type}-${index}`}>
        {segment.type === 'math' ? (
          <LatexEquation
            latex={segment.value}
            className="inline-block max-w-full whitespace-nowrap align-baseline [&_.katex]:text-[0.98em]"
          />
        ) : segment.value}
      </Fragment>
    ))}
  </>
);
