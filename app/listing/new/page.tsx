'use client';

import { useState } from 'react';
import { MarketplaceHeader } from '@/components/marketplace/header';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'База', desc: 'Марка, модель, VIN, город, цена' },
  { id: 2, title: 'Техника', desc: 'Мотор, КПП, привод, пробег' },
  { id: 3, title: 'История', desc: 'Владельцы, ПТС, окрасы, ДТП' },
  { id: 4, title: 'Состояние', desc: 'Техника, ключи, вложения' },
  { id: 5, title: 'Сделка', desc: 'Цена в руки, торг, на ресурсах' },
  { id: 6, title: 'Фото', desc: 'Фото и описание' },
];

export default function NewListingPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-semibold text-foreground mb-6">Подать объявление</h1>
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                step === s.id
                  ? 'bg-teal-accent/20 text-teal-accent'
                  : 'bg-muted dark:bg-surface-3 text-muted-foreground hover:text-foreground'
              )}
            >
              {s.id}. {s.title}
            </button>
          ))}
        </div>
        <div className="bg-card dark:bg-surface-elevated rounded-xl border border-border p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">
            {STEPS[step - 1].title}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">{STEPS[step - 1].desc}</p>
          <div className="min-h-[200px] text-sm text-muted-foreground">
            Форма будет реализована. Шаг {step} из {STEPS.length}.
          </div>
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Назад
            </Button>
            {step < STEPS.length ? (
              <Button
                size="sm"
                onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
              >
                Далее
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button size="sm">Опубликовать</Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
