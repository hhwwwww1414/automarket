'use client';

import { useState, useEffect } from 'react';
import { Vehicle } from '@/lib/marketplace-data';
import { CheckCircle, ShieldCheck, AlertCircle, X, ExternalLink } from 'lucide-react';

interface VinReportProps {
  vehicle: Vehicle;
}

export function VinReport({ vehicle }: VinReportProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checks = [
    { label: 'Характеристики совпадают с ПТС', status: 'ok' as const },
    { label: 'Не числится в розыске', status: 'ok' as const },
    { label: 'Ограничений не обнаружено', status: 'ok' as const },
    {
      label: 'ДТП не зафиксировано',
      status: vehicle.verified ? ('ok' as const) : ('unknown' as const),
    },
  ];

  // Close on Escape
  useEffect(() => {
    if (!isModalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isModalOpen]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  return (
    <>
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-teal-accent" />
          <h3 className="font-semibold text-foreground">Отчёт по VIN-коду</h3>
        </div>

        {/* Masked VIN */}
        <div className="bg-muted rounded-lg px-3 py-2 mb-4">
          <p className="text-sm text-muted-foreground">VIN</p>
          <p className="font-mono text-foreground">{vehicle.vin}</p>
        </div>

        {/* Check Items */}
        <div className="space-y-2.5">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {check.status === 'ok' ? (
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className={check.status === 'ok' ? 'text-foreground' : 'text-muted-foreground'}>
                {check.label}
              </span>
            </div>
          ))}
        </div>

        {/* Report Button */}
        <button
          onClick={() => vehicle.reportUrl && setIsModalOpen(true)}
          disabled={!vehicle.reportUrl}
          className="w-full mt-4 py-2 text-sm text-teal-accent hover:text-teal-dark border border-teal-accent/30 rounded-lg hover:bg-teal-accent/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Получить полный отчёт
        </button>
      </div>

      {/* PDF Modal */}
      {isModalOpen && vehicle.reportUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-card rounded-xl shadow-2xl w-full max-w-4xl flex flex-col"
            style={{ height: 'min(90vh, 860px)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-accent" />
                <h2 className="font-semibold text-foreground">Полный отчёт</h2>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={vehicle.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Открыть в новой вкладке
                </a>
                <button
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Закрыть"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PDF viewer */}
            <div className="flex-1 min-h-0 rounded-b-xl overflow-hidden">
              <iframe
                src={`${vehicle.reportUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full border-0"
                title="Полный отчёт"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
