import type { CentreHours } from '../../data/physical-centres.ts';

type CentreStatus = { kind: 'open' | 'opens-later' | 'closed' | 'closing-soon'; heading: string; detail: string; currentMinutes: number };
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const parts = (now: Date, timeZone: string) => Object.fromEntries(new Intl.DateTimeFormat('en-AU', { timeZone, weekday: 'long', hour: 'numeric', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now).filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
const time = (value: number) => { const hour = Math.floor(value); const minute = Math.round((value-hour)*60); const suffix = hour >= 12 ? 'pm' : 'am'; const display = hour % 12 || 12; return `${display}:${String(minute).padStart(2,'0')} ${suffix}`; };
export const getCentreStatus = (hours: CentreHours, timeZone: string, now = new Date()): CentreStatus => {
 const local = parts(now,timeZone); const today = hours.find(item => item.day === local.weekday); const currentMinutes = Number(local.hour)*60+Number(local.minute);
 if (today?.start !== undefined && today.end !== undefined) { const start=today.start*60,end=today.end*60; if(currentMinutes>=start&&currentMinutes<end) return {kind:end-currentMinutes<=30?'closing-soon':'open',heading:end-currentMinutes<=30?'Closing soon':'Open now',detail:`Closes at ${time(today.end)}`,currentMinutes}; if(currentMinutes<start) return {kind:'opens-later',heading:'Opens today',detail:`${time(today.start)}`,currentMinutes}; }
 for(let offset=1;offset<8;offset++){const entry=hours.find(item=>item.day===days[(days.indexOf(local.weekday)+offset)%7]);if(entry?.start!==undefined)return {kind:'closed',heading:today?'Closed today':'Closed',detail:`Opens ${offset===1?'tomorrow':entry.day} at ${time(entry.start)}`,currentMinutes};}
 return {kind:'closed',heading:'Closed',detail:'Please contact us for current hours',currentMinutes};
};
