import { useState, type FormEvent } from 'react';
import { ArrowUpRight, RotateCcw, Send } from 'lucide-react';
import { Link } from 'wouter';

const scripts: { test: RegExp; answer: string }[] = [
  { test: /where.*chat|chat.*stored|conversation/i, answer: 'The product concept says private chat is processed by local models on Me Home and saved to its drive. An approved action that contacts an outside service is a separate case.' },
  { test: /feed|learning|goal/i, answer: 'Me describes a family-controlled vertical feed, with priorities set by the household. The dial on this page is only an illustrative prototype control.' },
  { test: /outside|approval|connector|service/i, answer: 'When a task needs an outside service, the concept is to ask first and show what information is involved. If approved, that action can contact the service.' },
  { test: /home|hardware|computer|model/i, answer: 'Me Home is a home AI computer concept intended to run local models and store private chat history at home. The hardware is in development; it is not represented as shipping.' },
];

export function TryIt() {
  const [question, setQuestion] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = question.trim();
    if (!value) {
      setStatus('Write a question to try the preview.');
      return;
    }
    const match = scripts.find((entry) => entry.test.test(value));
    setLastQuestion(value);
    setAnswer(match?.answer ?? 'This preview only recognizes a few product topics. Explore the product areas or ask the local product Q&A for documented details.');
    setStatus('Scripted preview response. No AI model was called.');
    setQuestion('');
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 md:px-7">
        <div>
          <div className="eyebrow">Try it · scripted preview</div>
          <p className="mt-1 text-sm text-muted-foreground">A few local, fixed responses. Not a real AI call.</p>
        </div>
        <span className="f-mono rounded-full border border-accent/30 px-3 py-1 text-[10px] text-accent">LOCAL SCRIPT</span>
      </div>
      <div className="min-h-32 space-y-3 p-5 md:p-7" aria-live="polite">
        {!answer ? (
          <div className="rounded-2xl bg-secondary/70 p-4 text-sm leading-relaxed text-muted-foreground">Ask about private chats, Me Home, the feed, or approvals.</div>
        ) : (
          <>
            <div className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground" data-testid="text-demo-question">{lastQuestion}</div>
            <div className="max-w-[95%] rounded-2xl rounded-bl-sm border border-border bg-background px-4 py-3 text-sm leading-relaxed" data-testid="text-demo-answer">{answer}</div>
          </>
        )}
      </div>
      <form onSubmit={submit} className="flex gap-2 border-t border-border p-4 md:px-7">
        <label className="sr-only" htmlFor="demo-question">Ask the scripted preview</label>
        <input id="demo-question" value={question} onChange={(event) => { setQuestion(event.target.value); setStatus(''); }}
          placeholder="Try: Where are private chats stored?" className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent"
          data-testid="input-demo-question" />
        <button type="submit" aria-label="Send preview question" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-85" data-testid="button-demo-send"><Send className="h-4 w-4" /></button>
        <button type="button" aria-label="Reset preview" onClick={() => { setQuestion(''); setLastQuestion(''); setAnswer(''); setStatus(''); }} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border hover:bg-secondary" data-testid="button-demo-reset"><RotateCcw className="h-4 w-4" /></button>
      </form>
      <div className="min-h-7 px-6 pb-4 text-xs text-muted-foreground" role="status">{status || (answer ? 'Scripted preview response. No AI model was called.' : '')}</div>
      <Link className="inline-flex items-center gap-1 px-6 pb-5 text-sm text-accent hover:underline" href="/ask">Ask about documented Me details <ArrowUpRight className="h-3.5 w-3.5" /></Link>
    </div>
  );
}
