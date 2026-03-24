'use client';

import { startTransition, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { MarketplaceHeader } from '@/components/marketplace/header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Mode = 'login' | 'register';

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-teal-accent/60 focus:ring-2 focus:ring-teal-accent/30';

function parseString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = searchParams.get('next') || '/account';
  const alternateHref = mode === 'login' ? `/register?next=${encodeURIComponent(nextPath)}` : `/login?next=${encodeURIComponent(nextPath)}`;

  const submit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(mode === 'login' ? '/api/auth/login' : '/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          password,
          nextPath,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            error?: string;
            nextPath?: string;
          }
        | null;

      if (!response.ok) {
        throw new Error(parseString(payload?.error) || 'Authentication failed.');
      }

      startTransition(() => {
        router.push(parseString(payload?.nextPath) || '/account');
        router.refresh();
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-border bg-card/90 p-6 shadow-xl backdrop-blur sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-accent/20 bg-teal-accent/10 px-3 py-1 text-xs font-medium text-teal-accent">
              <ShieldCheck className="h-3.5 w-3.5" />
              Stage 2: auth and roles
            </div>
            <h1 className="mt-5 max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {mode === 'login' ? 'Вход в личный кабинет vin2win' : 'Регистрация рабочего аккаунта vin2win'}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              {mode === 'login'
                ? 'Войдите в аккаунт, чтобы публиковать объявления, видеть свои записи и получать доступ к административным разделам по роли.'
                : 'После регистрации вы получите пользовательскую роль, личный кабинет и сможете публиковать объявления уже от своего аккаунта.'}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                'Cookie-сессии в PostgreSQL',
                'Привязка объявлений к владельцу',
                'Роли USER / MODERATOR / ADMIN',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-border/80 bg-background/60 px-4 py-4 text-sm text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">{mode === 'login' ? 'Вход' : 'Создание аккаунта'}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === 'login' ? 'Используйте email и пароль.' : 'Заполните профиль, чтобы сразу получить кабинет и привязанный seller profile.'}
              </p>
            </div>

            <div className="space-y-4">
              {mode === 'register' ? (
                <>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Имя</span>
                    <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} placeholder="Иван Петров" />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Телефон</span>
                    <input className={inputClass} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+7 999 123-45-67" />
                  </label>
                </>
              ) : null}

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">Email</span>
                <input className={inputClass} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@vin2win.ru" />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">Пароль</span>
                <input
                  type="password"
                  className={inputClass}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Не менее 7 символов"
                />
              </label>

              {error ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
              ) : null}

              <Button
                type="button"
                disabled={isSubmitting}
                onClick={submit}
                className={cn(
                  'w-full bg-teal-dark text-white hover:bg-teal-medium dark:bg-teal-accent dark:text-[#09090B] dark:hover:bg-seafoam',
                  isSubmitting && 'opacity-80'
                )}
              >
                {isSubmitting ? 'Проверяем данные...' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
              <Link href={alternateHref} className="font-medium text-teal-accent transition-opacity hover:opacity-80">
                {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
              </Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
