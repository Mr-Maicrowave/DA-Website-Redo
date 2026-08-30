export type SearchRecord = { title: string; body?: string; category?: string; keywords?: string[]; aliases?: string[]; headings?: string[]; concepts?: string[] };
export type SearchDiagnostic<T> = { record: T; score: number; reasons: string[] };

const conceptGroups: Record<string, string[]> = {
  pricing: ['fee','fees','cost','costs','price','prices','pricing','money','payment','payments','pay','tuition'],
  teachers: ['teacher','teachers','tutor','tutors'],
  absence: ['sick','absent','absence','miss','missed','missing'],
  enrolment: ['enrol','enrolment','enrollment','join','joining','start','starting'],
  mathematics: ['math','maths','mathematics','mathmatic','mathmatics'],
  interview: ['interview','consultation','assessment','placement'],
  classes: ['class','classes','lesson','lessons'],
};
const words = (value = '') => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[’‘`]/g, "'")
  .replace(/'s\b/g, 's')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .split(/\s+/)
  .filter(Boolean);
const stem = (word: string) => word.endsWith('ies') ? `${word.slice(0,-3)}y` : word.endsWith('s') && !word.endsWith('ss') && word.length > 3 ? word.slice(0,-1) : word;
const distance = (a: string,b: string) => { const row=Array.from({length:b.length+1},(_,i)=>i); for(let i=1;i<=a.length;i++){let prev=row[0]++;for(let j=1;j<=b.length;j++){const old=row[j];row[j]=Math.min(row[j]+1,row[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=old;}}return row[b.length]; };
const conceptsFor = (term:string) => Object.entries(conceptGroups).filter(([, terms]) => terms.map(stem).includes(term)).map(([concept])=>concept);
const closeTypo = (term:string, candidate:string) => term.length >= 5 && candidate.length >= 5 && Math.abs(term.length-candidate.length) <= 2 && distance(term,candidate) <= (term.length >= 8 ? 2 : 1);

export const scoreSearchRecords = <T extends SearchRecord>(records:T[], query:string):SearchDiagnostic<T>[] => {
  const terms=words(query).map(stem);
  if (!terms.length) return query.trim() ? [] : records.map(record=>({record,score:0,reasons:[]}));
  const queryPhrase = terms.join(' ');
  return records.map((record,index)=>{const title=words(record.title).map(stem), category=words(record.category).map(stem), keywords=(record.keywords??[]).flatMap(words).map(stem), aliases=(record.aliases??[]).flatMap(words).map(stem), headings=(record.headings??[]).flatMap(words).map(stem), body=words(record.body).map(stem); const searchable=[...title,...category,...keywords,...aliases,...headings]; const recordConcepts=new Set(record.concepts??[]); let score=title.join(' ').includes(queryPhrase) ? 160 : 0; const reasons:string[]=score ? ['title-phrase'] : [];
    for(const term of terms){const concepts=conceptsFor(term); if(title.includes(term)){score+=120;reasons.push(`title:${term}`)} else if(aliases.includes(term)){score+=100;reasons.push(`alias:${term}`)} else if(headings.includes(term)){score+=95;reasons.push(`heading:${term}`)} else if(category.includes(term)){score+=90;reasons.push(`category:${term}`)} else if(keywords.includes(term)){score+=75;reasons.push(`keyword:${term}`)}
      if(concepts.some(c=>recordConcepts.has(c))){score+=85;reasons.push(`concept:${concepts.find(c=>recordConcepts.has(c))}`)}
      else if(concepts.length && searchable.some(token=>concepts.some(c=>conceptGroups[c].map(stem).includes(token)))){score+=65;reasons.push(`concept-field:${term}`)}
      else if(searchable.some(token=>token.startsWith(term) && term.length>=4)){score+=45;reasons.push(`prefix:${term}`)}
      else if(searchable.some(token=>closeTypo(term,token))){score+=30;reasons.push(`typo:${term}`)}
      else if(body.includes(term)){score+=15;reasons.push(`body:${term}`)}
    }
    return {record,score,reasons,index};
  }).filter(x=>x.score>=30).sort((a,b)=>b.score-a.score||a.index-b.index).map(({index,...item})=>item);
};
export const searchRecords = <T extends SearchRecord>(records:T[], query:string) => scoreSearchRecords(records,query).map(x=>x.record);
