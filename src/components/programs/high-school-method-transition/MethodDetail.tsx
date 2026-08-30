import type { MethodItem } from './methodTransitionData';

export function MethodDetail({ method }: { method: MethodItem }) {
  return (
    <article id="hsm-method-detail" className="hsm-deck__detail">
      <div className="hsm-deck__method-index">
        <span>{method.number}</span>
        <i aria-hidden="true" />
      </div>
      <h3 data-method-copy>{method.label}</h3>
      <p className="hsm-deck__emotional" data-method-copy>
        {method.emotionalSubheading}
      </p>
      <div data-method-copy>
        {method.introduction.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <h4>WHAT WE DO</h4>
      <ol>
        {method.actions.map((action, index) => (
          <li key={action.title} data-method-action>
            <span>{index + 1}</span>
            <div>
              <strong>{action.title}</strong>
              <p>{action.body}</p>
            </div>
            <em data-method-annotation>{action.annotation}</em>
          </li>
        ))}
      </ol>
      <div className="hsm-deck__closing">
        {method.closingLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </article>
  );
}
