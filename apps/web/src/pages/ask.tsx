import { useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Send, Trash2 } from 'lucide-react';
import { productAreas } from '@/lib/product-areas';
import { MeMark, SiteShell } from '@/components/site';

type Message = { id: number; role: 'user' | 'me'; text: string };

const prompts = ['Where are private chats processed?', 'What happens when a task needs an outside service?', 'How does the feed work?'];
const sensitiveQuestion = /\b(?:my|our)\s+(?:personal\s+)?(?:family|home|address|account|password|health|medical details|finances|messages|conversations|email|phone|location|private details)\b|\b(?:who am i|what do you know about me|me personally)\b/i;

function answerQuestion(question: string): string {
  if (sensitiveQuestion.test(question)) return 'I can’t answer personal or private questions. This is a local product-information demo only; it does not access anyone’s profile or conversation history. Ask about documented Me product areas instead.';
  const normalized = question.toLowerCase();
  if (/date|when.*launch|shipping|available|release/.test(normalized)) return 'The current product content does not document a launch date or shipping status. Me is described as in development.';
  if (/github|linkedin|employer|degree|resume|biography|personal profile|personal information|email address|phone number|home address/.test(normalized)) return 'That is outside the documented Me product content. This demo has no personal profile or private account data. I can answer questions about Me Home, the mobile companion, feed controls, private chat, and approved outside actions.';
  const found = productAreas
    .map((area) => ({ area, score: area.tags.concat([area.title, area.summary, area.problem, area.method]).reduce((score, phrase) => {
      const words = phrase.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3);
      return score + words.filter((word) => normalized.includes(word)).length;
    }, 0) }))
    .sort((a, b) => b.score - a.score)[0];
  if (!found || found.score === 0) return 'I don’t have a documented answer for that in the Me product content. Try asking about Me Home, private chat, the family feed, the mobile app, or approved actions.';
  return `${found.area.method} ${found.area.results[0]}`;
}

export default function Ask() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [notice, setNotice] = useState('');
  const questionInput = useRef<HTMLInputElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const shouldScrollToLatest = useRef(true);
  const scrollAfterMessageUpdate = useRef(false);
  const nextMessageId = useRef(0);
  useLayoutEffect(() => {
    if (!scrollAfterMessageUpdate.current) return;
    scrollAfterMessageUpdate.current = false;
    const element = transcript.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages.length]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = question.trim();
    if (!text) { setNotice('Write a question first.'); questionInput.current?.focus(); return; }
    const response = answerQuestion(text);
    const transcriptElement = transcript.current;
    shouldScrollToLatest.current = transcriptElement
      ? transcriptElement.scrollHeight - transcriptElement.scrollTop - transcriptElement.clientHeight <= 24
      : true;
    scrollAfterMessageUpdate.current = shouldScrollToLatest.current;
    const userMessageId = nextMessageId.current;
    nextMessageId.current += 2;
    setMessages((current) => [...current, { id: userMessageId, role: 'user', text }, { id: userMessageId + 1, role: 'me', text: response }]);
    setQuestion('');
    setNotice('');
  };
  const clear = () => {
    scrollAfterMessageUpdate.current = false;
    shouldScrollToLatest.current = true;
    setMessages([]);
    setQuestion('');
    setNotice('Messages cleared. Nothing was saved.');
  };

  return (
    <SiteShell>
      <section className="mx-auto grid min-h-[72vh] max-w-6xl gap-10 px-5 py-12 md:grid-cols-[.8fr_1.2fr] md:px-8 md:py-20">
        <div className="accessibility-page">
          <div className="eyebrow">Ask about Me · local-only demo</div>
          <h1 className="f-display mt-5 text-[clamp(44px,7vw,78px)] leading-[.98]">Product answers.<br /><span className="text-muted-foreground">Nothing personal.</span></h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">Answers are selected only from documented Me product content in this app. This is not the Me assistant: no AI service, model, or key is used, and messages are not stored.</p>
          <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-5">
            <div className="f-mono text-[11px] text-accent">SAFETY BOUNDARY</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Private details, personal questions, and topics outside product documentation are declined with a redirect. Messages live in this page’s memory only and disappear when you leave or clear them.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Suggested questions">{prompts.map((prompt, index) => <button key={prompt} type="button" onClick={() => { setQuestion(prompt); setNotice(''); }} aria-controls="ask-question" className="rounded-full border border-border px-4 py-2 text-left text-xs hover:border-accent" data-testid={`button-prompt-${index}`}>{prompt}</button>)}</div>
        </div>
        <div className="accessibility-page flex min-h-[500px] max-h-[720px] min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex min-w-0 items-center gap-3"><MeMark size={28} /><div className="min-w-0"><div className="text-sm font-medium">Me product guide</div><div className="f-mono break-words text-[10px] text-accent">DOCUMENTED CONTENT ONLY</div></div></div>
            <button type="button" onClick={clear} aria-label="Clear chat" className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" data-testid="button-clear-chat"><Trash2 className="h-4 w-4" /></button>
          </div>
          <div ref={transcript} onScroll={(event) => {
            const element = event.currentTarget;
            shouldScrollToLatest.current = element.scrollHeight - element.scrollTop - element.clientHeight <= 24;
          }} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions" aria-atomic="false" data-testid="chat-transcript">
            {messages.length === 0 ? <div className="mx-auto mt-10 max-w-sm text-center"><div className="f-display text-2xl">Start with a product question.</div><p className="mt-2 text-sm leading-relaxed text-muted-foreground">For example: how does Me distinguish private chat from approved outside actions?</p></div> : messages.map((message) => (
              <article key={message.id} aria-label={message.role === 'user' ? 'You asked' : 'Me answered'} className={`max-w-[88%] break-words whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'ml-auto rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm border border-border bg-background'}`} data-testid={`message-${message.role}-${message.id}`}>{message.text}</article>
            ))}
          </div>
          <form onSubmit={submit} aria-label="Ask a product question" className="border-t border-border p-4">
            <label htmlFor="ask-question" className="sr-only">Ask about the Me product</label>
            <div className="flex gap-2">
              <input ref={questionInput} id="ask-question" value={question} onChange={(event) => { setQuestion(event.target.value); setNotice(''); }} placeholder="Ask about a documented product area"
                aria-describedby="ask-status" aria-invalid={notice === 'Write a question first.'}
                className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-accent" data-testid="input-ask-question" />
              <button aria-label="Send question" type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-85" data-testid="button-ask-send"><Send aria-hidden="true" className="h-4 w-4" /></button>
            </div>
            <div className="mt-2 flex min-h-5 flex-wrap items-center justify-between gap-3">
              <p id="ask-status" role="status" aria-live="polite" aria-atomic="true" className="min-w-0 break-words text-xs text-muted-foreground">{notice || 'Not saved. No external services contacted.'}</p>
              <Link href="/explore" className="inline-flex shrink-0 items-center gap-1 text-xs text-accent hover:underline">Explore areas <ArrowRight className="h-3 w-3" /></Link>
            </div>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
