'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MarketplaceHeader } from '@/components/marketplace/header';
import { Button } from '@/components/ui/button';
import type { ListingStatusValue } from '@/lib/listing-status';
import { cn } from '@/lib/utils';
import { Car, Check, ChevronLeft, ChevronRight, Search, Upload, Video, X } from 'lucide-react';

type Scenario = 'sale' | 'wanted';
type SaleStep = 1 | 2 | 3 | 4 | 5 | 6;
type SubmissionMode = 'DRAFT' | 'PENDING';

type PhotoItem = { file: File; url: string };
type VideoItem = { file: File; name: string; size: string };
type SessionUser = { name: string; phone?: string };

type SaleData = {
  sellerName: string; contact: string; make: string; model: string; generation: string; year: string; vin: string; city: string;
  price: string; priceInHand: string; priceOnResources: string; bodyType: string; engine: string; power: string; transmission: string;
  drive: string; mileage: string; steering: string; color: string; trim: string; owners: string; registrations: string; keysCount: string;
  ptsType: string; paintCount: string; paintedElements: string; notTaxi: boolean; notCarsharing: boolean; avtotekaGreen: boolean;
  noRestrictions: boolean; techOk: boolean; glassOriginal: boolean; noInvestment: boolean; investmentNote: string; trade: boolean;
  kickback: boolean; sellerType: string; resourceStatus: string; videoUrl: string; description: string;
};

type WantedData = {
  authorName: string; contact: string; models: string; budgetMin: string; budgetMax: string; yearFrom: string; mileageMax: string;
  engine: string; transmission: string; drive: string; ownersMax: string; paintAllowed: boolean; region: string; comment: string;
  notTaxi: boolean; notCarsharing: boolean; notSalon: boolean; notChina: boolean; ptsOriginalOnly: boolean; ownerOnly: boolean; sendAvtoteka: boolean;
};

const saleSteps: { id: SaleStep; title: string }[] = [
  { id: 1, title: 'База' }, { id: 2, title: 'Техника' }, { id: 3, title: 'История' },
  { id: 4, title: 'Состояние' }, { id: 5, title: 'Сделка' }, { id: 6, title: 'Фото' },
];

const saleDefaults: SaleData = {
  sellerName: '', contact: '', make: '', model: '', generation: '', year: '', vin: '', city: '',
  price: '', priceInHand: '', priceOnResources: '', bodyType: '', engine: '', power: '', transmission: 'АКПП',
  drive: 'Передний', mileage: '', steering: 'Левый', color: '', trim: '', owners: '', registrations: '', keysCount: '2',
  ptsType: 'original', paintCount: '0', paintedElements: '', notTaxi: true, notCarsharing: true, avtotekaGreen: false,
  noRestrictions: false, techOk: true, glassOriginal: false, noInvestment: true, investmentNote: '', trade: false,
  kickback: false, sellerType: 'owner', resourceStatus: 'not_listed', videoUrl: '', description: '',
};

const wantedDefaults: WantedData = {
  authorName: '', contact: '', models: '', budgetMin: '', budgetMax: '', yearFrom: '', mileageMax: '',
  engine: '', transmission: 'АКПП', drive: 'Любой', ownersMax: '', paintAllowed: false, region: '', comment: '',
  notTaxi: true, notCarsharing: true, notSalon: false, notChina: false, ptsOriginalOnly: false, ownerOnly: false, sendAvtoteka: false,
};

const inputClass = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-teal-accent/60 focus:ring-2 focus:ring-teal-accent/30';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-xs font-medium text-muted-foreground">{label}{required ? <span className="ml-0.5 text-destructive">*</span> : null}</span>{children}</label>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={cn('flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors', checked ? 'border-[var(--accent-border-soft)] bg-[var(--accent-bg-soft)] text-foreground' : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground')}>
      <span className={cn('flex h-4 w-4 items-center justify-center rounded border', checked ? 'border-teal-accent bg-teal-accent text-[#09090B]' : 'border-border bg-background')}>{checked ? <Check className="h-3 w-3" /> : null}</span>
      <span>{label}</span>
    </button>
  );
}

function splitCsv(value: string) { return value.split(',').map((x) => x.trim()).filter(Boolean); }
function fileSize(bytes: number) { return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`; }
function revokePhotos(photos: PhotoItem[]) { photos.forEach((photo) => URL.revokeObjectURL(photo.url)); }
function wantedRestrictions(data: WantedData) {
  return [
    data.notTaxi && 'Не такси',
    data.notCarsharing && 'Не каршеринг',
    data.notSalon && 'Не из салона',
    data.notChina && 'Не Китай',
    data.ptsOriginalOnly && 'ПТС только оригинал',
    data.ownerOnly && 'Только от собственника',
    data.sendAvtoteka && 'Присылать только с автотекой',
  ].filter(Boolean);
}

export default function NewListingPage() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [step, setStep] = useState<SaleStep>(1);
  const [sale, setSale] = useState<SaleData>(saleDefaults);
  const [wanted, setWanted] = useState<WantedData>(wantedDefaults);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [videoFile, setVideoFile] = useState<VideoItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [submittedStatus, setSubmittedStatus] = useState<ListingStatusValue | null>(null);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      setAuthLoading(true);
      try {
        const response = await fetch('/api/auth/session', {
          cache: 'no-store',
        });
        const payload = (await response.json().catch(() => null)) as
          | {
              authenticated?: boolean;
              user?: SessionUser | null;
            }
          | null;

        if (!active) {
          return;
        }

        if (payload?.authenticated && payload.user) {
          setSessionUser(payload.user);
          setSale((current) => ({
            ...current,
            sellerName: current.sellerName || payload.user?.name || '',
            contact: current.contact || payload.user?.phone || '',
          }));
          setWanted((current) => ({
            ...current,
            authorName: current.authorName || payload.user?.name || '',
            contact: current.contact || payload.user?.phone || '',
          }));
        } else {
          setSessionUser(null);
        }
      } catch {
        if (active) {
          setSessionUser(null);
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    }

    void loadSession();

    return () => {
      active = false;
    };
  }, []);

  const resetAll = useCallback(() => {
    revokePhotos(photos);
    setScenario(null); setStep(1); setSale(saleDefaults); setWanted(wantedDefaults); setPhotos([]); setVideoFile(null);
    setIsSubmitting(false); setSubmitError(null); setSubmitted(false); setCreatedId(null); setSubmittedStatus(null);
  }, [photos]);

  const addPhotos = useCallback((files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files).filter((f) => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024).map((file) => ({ file, url: URL.createObjectURL(file) }));
    if (next.length) setPhotos((current) => [...current, ...next]);
  }, []);

  const removePhoto = useCallback((index: number) => {
    setPhotos((current) => {
      URL.revokeObjectURL(current[index].url);
      return current.filter((_, i) => i !== index);
    });
  }, []);

  const pickVideo = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith('video/')) return;
    setVideoFile({ file, name: file.name, size: fileSize(file.size) });
  }, []);

  const submit = useCallback(async (mode: SubmissionMode) => {
    if (!scenario) return;
    if (!sessionUser) {
      setSubmitError('Для публикации нужно войти в аккаунт.');
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      if (scenario === 'sale') {
        if (!photos.length) throw new Error('Добавьте хотя бы одну фотографию.');
        const body = new FormData();
        body.append('payload', JSON.stringify({ ...sale, initialStatus: mode }));
        photos.forEach((photo) => body.append('photos', photo.file));
        if (videoFile) body.append('video', videoFile.file);
        const response = await fetch('/api/listings', { method: 'POST', body });
        const payload = await response.json().catch(() => null) as { id?: string; error?: string; status?: ListingStatusValue } | null;
        if (!response.ok) throw new Error(payload?.error ?? 'Не удалось создать объявление.');
        revokePhotos(photos);
        setPhotos([]);
        setVideoFile(null);
        setCreatedId(payload?.id ?? null);
        setSubmittedStatus(payload?.status ?? mode);
      } else {
        const response = await fetch('/api/wanted', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...wanted, initialStatus: mode, models: splitCsv(wanted.models), restrictions: wantedRestrictions(wanted) }),
        });
        const payload = await response.json().catch(() => null) as { id?: string; error?: string; status?: ListingStatusValue } | null;
        if (!response.ok) throw new Error(payload?.error ?? 'Не удалось разместить запрос.');
        setCreatedId(payload?.id ?? null);
        setSubmittedStatus(payload?.status ?? mode);
      }
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Ошибка отправки формы.');
    } finally {
      setIsSubmitting(false);
    }
  }, [photos, sale, scenario, sessionUser, videoFile, wanted]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-xl">
            <h1 className="text-2xl font-semibold text-foreground">Проверяем сессию</h1>
            <p className="mt-3 text-sm text-muted-foreground">Загружаем доступ к публикации объявлений и личному кабинету.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-xl">
            <h1 className="text-2xl font-semibold text-foreground">Публикация доступна только после входа</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Этап 2 подключил авторизацию и роли: теперь все новые объявления и запросы в подбор создаются от конкретного пользователя и попадают в его личный кабинет.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/login?next=%2Flisting%2Fnew" className="rounded-lg bg-teal-dark px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-teal-accent dark:text-[#09090B]">
                Войти
              </Link>
              <Link href="/register?next=%2Flisting%2Fnew" className="rounded-lg border border-border px-6 py-2.5 text-sm text-foreground transition-colors hover:bg-muted/40">
                Зарегистрироваться
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (submitted) {
    const href = createdId ? (scenario === 'sale' ? `/listing/${createdId}` : `/wanted/${createdId}`) : '/';
    const isDraft = submittedStatus === 'DRAFT';
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <main className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/15"><Check className="h-8 w-8 text-success" /></div>
          <h1 className="mb-3 text-2xl font-bold text-foreground">{isDraft ? (scenario === 'sale' ? 'Черновик объявления сохранён' : 'Черновик запроса сохранён') : (scenario === 'sale' ? 'Объявление отправлено на модерацию' : 'Запрос отправлен на модерацию')}</h1>
          <p className="mb-8 text-muted-foreground">{isDraft ? 'Запись сохранена в PostgreSQL и доступна в личном кабинете как черновик.' : (scenario === 'sale' ? 'Запись сохранена в PostgreSQL, медиа загружены в S3 и теперь ожидают публикации модератором.' : 'Запрос сохранён в PostgreSQL и теперь ожидает публикации модератором.')}</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={href} className="rounded-lg bg-teal-dark px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-teal-accent dark:text-[#09090B]">Открыть запись</Link>
            <button type="button" onClick={resetAll} className="rounded-lg border border-border px-6 py-2.5 text-sm text-foreground transition-colors hover:bg-muted/40">Подать еще</button>
          </div>
        </main>
      </div>
    );
  }

  const saleStepContent = (
    <div className="space-y-5">
      {step === 1 ? <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Марка" required><input className={inputClass} value={sale.make} onChange={(e) => setSale({ ...sale, make: e.target.value })} /></Field>
        <Field label="Модель" required><input className={inputClass} value={sale.model} onChange={(e) => setSale({ ...sale, model: e.target.value })} /></Field>
        <Field label="Поколение"><input className={inputClass} value={sale.generation} onChange={(e) => setSale({ ...sale, generation: e.target.value })} /></Field>
        <Field label="Год" required><input className={inputClass} type="number" value={sale.year} onChange={(e) => setSale({ ...sale, year: e.target.value })} /></Field>
        <Field label="VIN"><input className={inputClass} value={sale.vin} onChange={(e) => setSale({ ...sale, vin: e.target.value.toUpperCase() })} /></Field>
        <Field label="Город" required><input className={inputClass} value={sale.city} onChange={(e) => setSale({ ...sale, city: e.target.value })} /></Field>
        <Field label="Цена" required><input className={inputClass} type="number" value={sale.price} onChange={(e) => setSale({ ...sale, price: e.target.value })} /></Field>
        <Field label="Тип кузова" required><input className={inputClass} value={sale.bodyType} onChange={(e) => setSale({ ...sale, bodyType: e.target.value })} /></Field>
      </div> : null}
      {step === 2 ? <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Двигатель" required><input className={inputClass} value={sale.engine} onChange={(e) => setSale({ ...sale, engine: e.target.value })} /></Field>
        <Field label="Мощность"><input className={inputClass} type="number" value={sale.power} onChange={(e) => setSale({ ...sale, power: e.target.value })} /></Field>
        <Field label="Коробка"><input className={inputClass} value={sale.transmission} onChange={(e) => setSale({ ...sale, transmission: e.target.value })} /></Field>
        <Field label="Привод"><input className={inputClass} value={sale.drive} onChange={(e) => setSale({ ...sale, drive: e.target.value })} /></Field>
        <Field label="Пробег" required><input className={inputClass} type="number" value={sale.mileage} onChange={(e) => setSale({ ...sale, mileage: e.target.value })} /></Field>
        <Field label="Руль"><input className={inputClass} value={sale.steering} onChange={(e) => setSale({ ...sale, steering: e.target.value })} /></Field>
        <Field label="Цвет"><input className={inputClass} value={sale.color} onChange={(e) => setSale({ ...sale, color: e.target.value })} /></Field>
        <Field label="Комплектация"><input className={inputClass} value={sale.trim} onChange={(e) => setSale({ ...sale, trim: e.target.value })} /></Field>
      </div> : null}
      {step === 3 ? <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Владельцев" required><input className={inputClass} type="number" value={sale.owners} onChange={(e) => setSale({ ...sale, owners: e.target.value })} /></Field>
          <Field label="Регистраций"><input className={inputClass} type="number" value={sale.registrations} onChange={(e) => setSale({ ...sale, registrations: e.target.value })} /></Field>
          <Field label="Ключей"><input className={inputClass} value={sale.keysCount} onChange={(e) => setSale({ ...sale, keysCount: e.target.value })} /></Field>
        </div>
        <Field label="Тип ПТС"><input className={inputClass} value={sale.ptsType} onChange={(e) => setSale({ ...sale, ptsType: e.target.value })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Количество окрасов"><input className={inputClass} value={sale.paintCount} onChange={(e) => setSale({ ...sale, paintCount: e.target.value })} /></Field>
          <Field label="Окрашенные элементы"><input className={inputClass} value={sale.paintedElements} onChange={(e) => setSale({ ...sale, paintedElements: e.target.value })} /></Field>
        </div>
        <div className="space-y-2">
          <Toggle label="Не такси" checked={sale.notTaxi} onChange={(v) => setSale({ ...sale, notTaxi: v })} />
          <Toggle label="Не каршеринг" checked={sale.notCarsharing} onChange={(v) => setSale({ ...sale, notCarsharing: v })} />
          <Toggle label="Зеленая автотека" checked={sale.avtotekaGreen} onChange={(v) => setSale({ ...sale, avtotekaGreen: v })} />
          <Toggle label="Нет ограничений" checked={sale.noRestrictions} onChange={(v) => setSale({ ...sale, noRestrictions: v })} />
        </div>
      </div> : null}
      {step === 4 ? <div className="space-y-4">
        <Toggle label="Техника в порядке" checked={sale.techOk} onChange={(v) => setSale({ ...sale, techOk: v })} />
        <Toggle label="Оригинальные стекла" checked={sale.glassOriginal} onChange={(v) => setSale({ ...sale, glassOriginal: v })} />
        <Toggle label="Без вложений" checked={sale.noInvestment} onChange={(v) => setSale({ ...sale, noInvestment: v })} />
        {!sale.noInvestment ? <Field label="Что нужно сделать"><textarea className={cn(inputClass, 'min-h-28')} value={sale.investmentNote} onChange={(e) => setSale({ ...sale, investmentNote: e.target.value })} /></Field> : null}
      </div> : null}
      {step === 5 ? <div className="space-y-4">
        <Toggle label="Торг уместен" checked={sale.trade} onChange={(v) => setSale({ ...sale, trade: v })} />
        <Toggle label="Откат агентам" checked={sale.kickback} onChange={(v) => setSale({ ...sale, kickback: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Имя продавца" required><input className={inputClass} value={sale.sellerName} onChange={(e) => setSale({ ...sale, sellerName: e.target.value })} /></Field>
          <Field label="Контакт" required><input className={inputClass} value={sale.contact} onChange={(e) => setSale({ ...sale, contact: e.target.value })} /></Field>
          <Field label="Тип продавца"><input className={inputClass} value={sale.sellerType} onChange={(e) => setSale({ ...sale, sellerType: e.target.value })} /></Field>
          <Field label="Статус на ресурсах"><input className={inputClass} value={sale.resourceStatus} onChange={(e) => setSale({ ...sale, resourceStatus: e.target.value })} /></Field>
          <Field label="Цена в руки"><input className={inputClass} type="number" value={sale.priceInHand} onChange={(e) => setSale({ ...sale, priceInHand: e.target.value })} /></Field>
          <Field label="Цена на ресурсах"><input className={inputClass} type="number" value={sale.priceOnResources} onChange={(e) => setSale({ ...sale, priceOnResources: e.target.value })} /></Field>
        </div>
      </div> : null}
      {step === 6 ? <div className="space-y-4">
        <Field label="Фотографии" required>
          <div className="space-y-3">
            <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => { addPhotos(e.target.files); e.target.value = ''; }} />
            <button type="button" onClick={() => photoInputRef.current?.click()} className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground transition-colors hover:border-teal-accent/50 hover:bg-muted/20 hover:text-foreground"><Upload className="mb-3 h-8 w-8" /><span className="font-medium text-foreground">Добавить фото</span><span className="mt-1 text-xs">JPG, PNG, WebP до 10 MB. Первое фото станет обложкой.</span></button>
            {photos.length ? <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{photos.map((photo, index) => <div key={photo.url} className="group relative overflow-hidden rounded-lg border border-border"><img src={photo.url} alt={`Фото ${index + 1}`} className="aspect-square w-full object-cover" />{index === 0 ? <div className="absolute bottom-0 left-0 right-0 bg-teal-accent/90 py-1 text-center text-[10px] font-semibold text-[#09090B]">Обложка</div> : null}<button type="button" onClick={() => removePhoto(index)} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"><X className="h-4 w-4" /></button></div>)}</div> : null}
          </div>
        </Field>
        <Field label="Видео">
          <div className="space-y-3">
            <input ref={videoInputRef} type="file" accept="video/*" className="sr-only" onChange={(e) => { pickVideo(e.target.files); e.target.value = ''; }} />
            {videoFile ? <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-accent/15"><Video className="h-5 w-5 text-teal-accent" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-foreground">{videoFile.name}</p><p className="text-xs text-muted-foreground">{videoFile.size}</p></div><button type="button" onClick={() => setVideoFile(null)} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-4 w-4" /></button></div> : <button type="button" onClick={() => videoInputRef.current?.click()} className="flex w-full items-center justify-center rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/20 hover:text-foreground">Загрузить видеофайл</button>}
            <input className={inputClass} placeholder="Или ссылка на видео" value={sale.videoUrl} onChange={(e) => setSale({ ...sale, videoUrl: e.target.value })} />
          </div>
        </Field>
        <Field label="Описание" required><textarea className={cn(inputClass, 'min-h-32')} value={sale.description} onChange={(e) => setSale({ ...sale, description: e.target.value })} /></Field>
      </div> : null}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6"><h1 className="text-xl font-semibold text-foreground">Подать объявление</h1><p className="mt-1 text-sm text-muted-foreground">Этап 3: форма сохраняет запись, ставит ей статус и отправляет на модерацию без изменения структуры интерфейса.</p></div>
        {!scenario ? <div className="grid gap-4 sm:grid-cols-2">
          <button type="button" onClick={() => setScenario('sale')} className="card-interactive relative overflow-hidden rounded-xl border border-border bg-card p-5 text-left transition-[border-color,background-color] duration-200 hover:border-teal-accent/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-surface-elevated"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-accent/15"><Car className="h-5 w-5 text-teal-accent" /></div><h2 className="mb-1 font-semibold text-foreground">Продаю автомобиль</h2><p className="text-sm text-muted-foreground">Новая запись сохранится со статусом и попадёт на модерацию перед публикацией.</p></button>
          <button type="button" onClick={() => setScenario('wanted')} className="card-interactive relative overflow-hidden rounded-xl border border-border bg-card p-5 text-left transition-[border-color,background-color] duration-200 hover:border-teal-accent/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-surface-elevated"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-accent/15"><Search className="h-5 w-5 text-teal-accent" /></div><h2 className="mb-1 font-semibold text-foreground">Ищу автомобиль</h2><p className="text-sm text-muted-foreground">Запрос на подбор так же получает статус и публикуется после модерации.</p></button>
        </div> : null}
        {submitError ? <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{submitError}</div> : null}
        {scenario === 'sale' ? <div className="mt-6 rounded-xl border border-border bg-card p-5 dark:bg-surface-elevated sm:p-6">
          <div className="mb-6 grid gap-2 sm:grid-cols-6">{saleSteps.map((item) => <button key={item.id} type="button" onClick={() => setStep(item.id)} className={cn('rounded-xl border px-3 py-3 text-left text-sm transition-colors', item.id === step ? 'border-teal-accent/40 bg-[var(--accent-bg-soft)] text-teal-accent' : item.id < step ? 'border-border bg-card text-foreground hover:bg-muted/40' : 'border-border bg-card text-muted-foreground hover:bg-muted/30')}><div className="font-semibold">{item.title}</div></button>)}</div>
          {saleStepContent}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <Button variant="outline" size="sm" disabled={isSubmitting} onClick={() => step === 1 ? resetAll() : setStep((current) => (current - 1) as SaleStep)}><ChevronLeft className="mr-1 h-4 w-4" />Назад</Button>
            {step < 6 ? <Button size="sm" disabled={isSubmitting} className="bg-teal-dark text-white dark:bg-teal-accent dark:text-[#09090B]" onClick={() => setStep((current) => (current + 1) as SaleStep)}>Далее<ChevronRight className="ml-1 h-4 w-4" /></Button> : <div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={isSubmitting} onClick={() => submit('DRAFT')}>{isSubmitting ? 'Сохраняем...' : 'Черновик'}</Button><Button size="sm" disabled={isSubmitting} className="bg-teal-dark text-white dark:bg-teal-accent dark:text-[#09090B]" onClick={() => submit('PENDING')}>{isSubmitting ? 'Сохраняем...' : 'На модерацию'}</Button></div>}
          </div>
        </div> : null}
        {scenario === 'wanted' ? <div className="mt-6 rounded-xl border border-border bg-card p-5 dark:bg-surface-elevated sm:p-6">
          <button type="button" onClick={() => setScenario(null)} className="mb-6 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"><ChevronLeft className="h-4 w-4" />Назад</button>
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ваше имя" required><input className={inputClass} value={wanted.authorName} onChange={(e) => setWanted({ ...wanted, authorName: e.target.value })} /></Field>
              <Field label="Контакт" required><input className={inputClass} value={wanted.contact} onChange={(e) => setWanted({ ...wanted, contact: e.target.value })} /></Field>
            </div>
            <Field label="Марки и модели" required><input className={inputClass} value={wanted.models} onChange={(e) => setWanted({ ...wanted, models: e.target.value })} placeholder="Toyota Camry, Skoda Octavia A7" /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Бюджет от"><input className={inputClass} type="number" value={wanted.budgetMin} onChange={(e) => setWanted({ ...wanted, budgetMin: e.target.value })} /></Field>
              <Field label="Бюджет до" required><input className={inputClass} type="number" value={wanted.budgetMax} onChange={(e) => setWanted({ ...wanted, budgetMax: e.target.value })} /></Field>
              <Field label="Год от"><input className={inputClass} type="number" value={wanted.yearFrom} onChange={(e) => setWanted({ ...wanted, yearFrom: e.target.value })} /></Field>
              <Field label="Пробег до"><input className={inputClass} type="number" value={wanted.mileageMax} onChange={(e) => setWanted({ ...wanted, mileageMax: e.target.value })} /></Field>
              <Field label="Двигатель"><input className={inputClass} value={wanted.engine} onChange={(e) => setWanted({ ...wanted, engine: e.target.value })} /></Field>
              <Field label="Владельцев не более"><input className={inputClass} value={wanted.ownersMax} onChange={(e) => setWanted({ ...wanted, ownersMax: e.target.value })} /></Field>
              <Field label="Коробка"><input className={inputClass} value={wanted.transmission} onChange={(e) => setWanted({ ...wanted, transmission: e.target.value })} /></Field>
              <Field label="Привод"><input className={inputClass} value={wanted.drive} onChange={(e) => setWanted({ ...wanted, drive: e.target.value })} /></Field>
              <Field label="Регион"><input className={inputClass} value={wanted.region} onChange={(e) => setWanted({ ...wanted, region: e.target.value })} /></Field>
            </div>
            <div className="space-y-2">
              <Toggle label="Окрасы допустимы" checked={wanted.paintAllowed} onChange={(v) => setWanted({ ...wanted, paintAllowed: v })} />
              <Toggle label="Не такси" checked={wanted.notTaxi} onChange={(v) => setWanted({ ...wanted, notTaxi: v })} />
              <Toggle label="Не каршеринг" checked={wanted.notCarsharing} onChange={(v) => setWanted({ ...wanted, notCarsharing: v })} />
              <Toggle label="Не из салона" checked={wanted.notSalon} onChange={(v) => setWanted({ ...wanted, notSalon: v })} />
              <Toggle label="Не Китай" checked={wanted.notChina} onChange={(v) => setWanted({ ...wanted, notChina: v })} />
              <Toggle label="ПТС только оригинал" checked={wanted.ptsOriginalOnly} onChange={(v) => setWanted({ ...wanted, ptsOriginalOnly: v })} />
              <Toggle label="Только от собственника" checked={wanted.ownerOnly} onChange={(v) => setWanted({ ...wanted, ownerOnly: v })} />
              <Toggle label="Присылать только с автотекой" checked={wanted.sendAvtoteka} onChange={(v) => setWanted({ ...wanted, sendAvtoteka: v })} />
            </div>
            <Field label="Комментарий"><textarea className={cn(inputClass, 'min-h-32')} value={wanted.comment} onChange={(e) => setWanted({ ...wanted, comment: e.target.value })} /></Field>
          </div>
          <div className="mt-8 flex justify-end gap-2 border-t border-border pt-5"><Button variant="outline" size="sm" disabled={isSubmitting} onClick={() => submit('DRAFT')}>{isSubmitting ? 'Сохраняем...' : 'Черновик'}</Button><Button size="sm" disabled={isSubmitting} className="bg-teal-dark text-white dark:bg-teal-accent dark:text-[#09090B]" onClick={() => submit('PENDING')}>{isSubmitting ? 'Сохраняем...' : 'На модерацию'}</Button></div>
        </div> : null}
      </main>
    </div>
  );
}
