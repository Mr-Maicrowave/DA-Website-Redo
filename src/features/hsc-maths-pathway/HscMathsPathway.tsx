import { ArrowRight } from 'lucide-react';
import { useState, type CSSProperties, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { HSC_STREAMS, STANDARD_YEAR12_OPTIONS, getActivePath, getHscStream, type HscStream, type HscStreamId, type StandardYear12Id } from './hsc-maths-pathway-model';
import './hsc-maths-pathway.css';
import './hsc-maths-pathway-content.css';

type DetailTab = 'expect' | 'questions' | 'help';

function CourseDetail({ stream, showStandardBranch, standardYear12Id, onStandardYear12Change }: { stream: HscStream; showStandardBranch: boolean; standardYear12Id: StandardYear12Id; onStandardYear12Change: (id: StandardYear12Id) => void }) {
  const [detailTab, setDetailTab] = useState<DetailTab>('expect');
  const panel = detailTab === 'expect' ? { title: 'What changes from junior mathematics', body: stream.whatChanges } : detailTab === 'questions' ? { title: 'What questions ask you to do', body: stream.questions } : { title: 'Challenges & DA help', body: `${stream.helpNeeded} ${stream.daSupport}` };
  return <section id="hsc-course-guide" className="hsc-pathway-detail" role="tabpanel" aria-live="polite" aria-labelledby="hsc-course-guide-heading" style={{ '--course-accent': stream.color } as CSSProperties}>
    <div className="hsc-pathway-detail__heading"><p className="hsc-pathway-detail__label">Selected course</p><h3 id="hsc-course-guide-heading">{stream.name}</h3><p className="hsc-pathway-detail__meta">{stream.availability}</p><p className="hsc-pathway-detail__summary">{stream.badge}</p></div>
    {showStandardBranch && <div className="hsc-pathway-standard-branch"><div><strong>Year 11 Mathematics Standard is shared.</strong><span>Choose the Year 12 branch to explore.</span></div><div role="tablist" aria-label="Year 12 Mathematics Standard course">{STANDARD_YEAR12_OPTIONS.map((option) => <button key={option.id} role="tab" aria-selected={option.id === standardYear12Id} type="button" onClick={() => onStandardYear12Change(option.id as StandardYear12Id)}>{option.name}</button>)}</div></div>}
    <div className="hsc-pathway-feels"><h4>What this course feels like</h4><p>{stream.feelsLike}</p></div>
    <div className="hsc-pathway-attributes" aria-label="Course attributes">{stream.attributes.map((attribute) => <div key={attribute.label}><h4>{attribute.label}</h4><p>{attribute.description}</p></div>)}</div>
    <div className="hsc-pathway-detail__overview"><div><h4>Who it tends to suit</h4><p>{stream.bestFit}</p></div><div className="hsc-pathway-underestimate"><h4>What students underestimate</h4><p>{stream.underestimate}</p></div></div>
    <div className="hsc-pathway-detail__topics"><h4>Representative topics</h4><div>{stream.topics.map((topic) => <span key={topic}>{topic}</span>)}</div></div>
    <div className="hsc-pathway-detail__explore" role="tablist" aria-label="Explore this course further">{([{ id: 'expect', label: 'Expect' }, { id: 'questions', label: 'Questions' }, { id: 'help', label: 'Challenges & DA help' }] as const).map((item) => <button key={item.id} type="button" role="tab" aria-selected={detailTab === item.id} onClick={() => setDetailTab(item.id)}>{item.label}</button>)}</div>
    <div className="hsc-pathway-detail__explore-panel"><h4>{panel.title}</h4><p>{panel.body}</p></div>
    <div className="hsc-pathway-detail__actions"><Link to="/book-interview" className="hsc-pathway-detail__primary">Talk through your child&apos;s course choice <ArrowRight aria-hidden="true" /></Link><Link to="/hsc-excellence" className="hsc-pathway-detail__secondary">Explore the HSC Mathematics program <ArrowRight aria-hidden="true" /></Link></div>
  </section>;
}

export function HscMathsPathway(): JSX.Element {
  const [activeStreamId, setActiveStreamId] = useState<HscStreamId>('standard');
  const [standardYear12Id, setStandardYear12Id] = useState<StandardYear12Id>('standard-1');
  const activeBaseStream = getHscStream(activeStreamId);
  const activeStream = activeStreamId === 'standard' ? STANDARD_YEAR12_OPTIONS.find((option) => option.id === standardYear12Id)! : activeBaseStream;
  const activePath = getActivePath(activeStreamId);
  return <section id="hsc-maths" className="hsc-pathway" aria-labelledby="hsc-maths-heading"><div className="hsc-pathway-shell" data-active-course={activeStreamId}><header className="hsc-pathway-intro"><p>Year 11–12 mathematics</p><h2 id="hsc-maths-heading">Choose a course to explore its content, suitability and pathway.</h2></header><div className="hsc-pathway-layout"><aside className="hsc-pathway-selector" aria-label="HSC mathematics course pathway"><ol className="hsc-pathway-ladder"><span className="hsc-pathway-ladder__rail" aria-hidden="true" />{HSC_STREAMS.map((stream) => { const isSelected = stream.id === activeStreamId; const isInActivePath = activePath.includes(stream.id); const relationship = stream.id === 'advanced' ? 'Base for Extension courses' : stream.id === 'extension-1' ? 'Studied alongside Advanced' : stream.id === 'extension-2' ? 'With Advanced + Extension 1' : 'Shared Year 11 pathway'; return <li key={stream.id} data-course-path={stream.id}><button type="button" role="tab" aria-selected={isSelected} aria-controls="hsc-course-guide" onClick={() => setActiveStreamId(stream.id as HscStreamId)} className={`hsc-pathway-ladder__course${isSelected ? ' is-selected' : ''}${isInActivePath ? ' is-on-path' : ''}`} style={{ '--course-accent': stream.color } as CSSProperties}><span className="hsc-pathway-ladder__node" aria-hidden="true" /><span className="hsc-pathway-ladder__connector" aria-hidden="true" /><span><strong>{stream.name}</strong><small>{stream.shortDescriptor}</small><em>{relationship}</em></span></button></li>; })}</ol></aside><CourseDetail key={`${activeStreamId}-${standardYear12Id}`} stream={activeStream} showStandardBranch={activeStreamId === 'standard'} standardYear12Id={standardYear12Id} onStandardYear12Change={setStandardYear12Id} /></div></div></section>;
}
