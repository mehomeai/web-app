import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { useJoinMeWaitlist } from '@workspace/api-client-react';
import { ConceptLabel, EASE, MeMark, SiteShell, img } from '@/components/site';

type FormValues = { email: string; consent: boolean; website: string };

function errorMessage(err: unknown): string {
  const e = err as { data?: { error?: string; message?: string }; message?: string } | null;
  return e?.data?.error || e?.data?.message || 'Something went wrong. Please try again.';
}

export default function Signup() {
  const join = useJoinMeWaitlist();
  const [done, setDone] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { email: '', consent: false, website: '' },
  });

  const onSubmit = (v: FormValues) => {
    setServerError(null);
    join.mutate(
      { data: { email: v.email.trim(), consent: true, ...(v.website ? { website: v.website } : {}) } },
      {
        onSuccess: (r) => { if (r.success) setDone(r.message); else setServerError(r.message || 'We could not add you. Please try again.'); },
        onError: (e) => setServerError(errorMessage(e)),
      },
    );
  };

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-6xl gap-12 px-5 pt-14 md:grid-cols-[1.1fr_1fr] md:px-8 md:pt-24">
        <div>
          <div className="eyebrow">Waitlist</div>
          <h1 className="f-display mt-5 text-[clamp(44px,7vw,88px)] leading-[0.98]">Hear when<br /><span className="text-accent">Me is ready.</span></h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">One email address. Launch updates only. This is a waitlist, not an account.</p>

          <div className="mt-10 max-w-md rounded-3xl border border-border bg-card p-6 md:p-8">
            {done ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} data-testid="status-success">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-foreground"><Check className="h-5 w-5" /></div>
                <div className="f-display mt-5 text-3xl">You're on the list.</div>
                <p className="mt-2 text-muted-foreground" data-testid="text-success-message">{done}</p>
                <Link href="/how-it-works" className="mt-6 inline-flex items-center gap-2 text-sm text-accent hover:underline" data-testid="link-success-how">Read how it works <ArrowRight className="h-4 w-4" /></Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input id="email" type="email" autoComplete="email" placeholder="you@example.com" disabled={join.isPending}
                  {...register('email', { required: 'Enter your email address.', maxLength: { value: 254, message: 'That email is too long.' }, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' } })}
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  data-testid="input-email" />
                {errors.email && <p className="mt-2 text-sm text-destructive" data-testid="error-email">{errors.email.message}</p>}

                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="website">Website</label>
                  <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
                </div>

                <label className="mt-5 flex cursor-pointer gap-3 text-sm leading-relaxed text-muted-foreground">
                  <input type="checkbox" disabled={join.isPending} {...register('consent', { validate: (v) => v || 'Please confirm to join the waitlist.' })}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#1e6b66]" data-testid="checkbox-consent" />
                  <span>I agree to have my email stored by this website so the Me team can send me launch updates.</span>
                </label>
                {errors.consent && <p className="mt-2 text-sm text-destructive" data-testid="error-consent">{errors.consent.message}</p>}

                {serverError && <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert" data-testid="status-error">{serverError}</p>}

                <button type="submit" disabled={join.isPending} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-60" data-testid="button-submit">
                  {join.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Joining</> : <>Join the waitlist <ArrowRight className="h-4 w-4" /></>}
                </button>
              </form>
            )}
          </div>
          <p className="mt-5 max-w-md text-xs leading-relaxed text-muted-foreground">
            Note: your waitlist email is sent to and stored on this website's server. That is separate from Me's private chat, which is processed and stored on Me Home.
          </p>
        </div>

        <div className="relative hidden overflow-hidden rounded-3xl md:block">
          <img src={img('me-home-room.jpg')} alt="Concept render of Me Home in a living room" className="h-full w-full object-cover" />
          <ConceptLabel className="absolute bottom-5 right-5" />
          <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 backdrop-blur"><MeMark size={16} /><span className="f-mono text-[10px] text-accent">ME HOME · LIVING ROOM</span></div>
        </div>
      </section>
    </SiteShell>
  );
}
