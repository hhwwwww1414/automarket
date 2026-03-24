'use client';

import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type NotificationDeliverySettingsProps = {
  emailEnabled: boolean;
  telegramEnabled: boolean;
  browserPushEnabled: boolean;
  telegramChatId?: string | null;
  hasPushSubscription: boolean;
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function NotificationDeliverySettings({
  emailEnabled,
  telegramEnabled,
  browserPushEnabled,
  telegramChatId,
  hasPushSubscription,
}: NotificationDeliverySettingsProps) {
  const router = useRouter();
  const [draft, setDraft] = useState({
    emailEnabled,
    telegramEnabled,
    browserPushEnabled,
    telegramChatId: telegramChatId ?? '',
  });
  const [pushSubscribed, setPushSubscribed] = useState(hasPushSubscription);
  const [permissionState, setPermissionState] = useState<string>('default');
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const telegramBotUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

  useEffect(() => {
    setDraft({
      emailEnabled,
      telegramEnabled,
      browserPushEnabled,
      telegramChatId: telegramChatId ?? '',
    });
    setPushSubscribed(hasPushSubscription);
  }, [browserPushEnabled, emailEnabled, hasPushSubscription, telegramChatId, telegramEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    setPermissionState(Notification.permission);
  }, []);

  const canUseBrowserPush = useMemo(
    () =>
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      Boolean(vapidPublicKey),
    [vapidPublicKey]
  );

  const saveSettings = useCallback(async () => {
    setError(null);
    setPendingKey('settings');

    try {
      const response = await fetch('/api/account/notification-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailNotificationsEnabled: draft.emailEnabled,
          telegramNotificationsEnabled: draft.telegramEnabled,
          browserPushEnabled: draft.browserPushEnabled,
          telegramChatId: draft.telegramChatId.trim() || null,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error ?? 'Unable to update notification settings.');
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to update notification settings.');
    } finally {
      setPendingKey(null);
    }
  }, [draft, router]);

  const subscribeBrowserPush = useCallback(async () => {
    if (!canUseBrowserPush || !vapidPublicKey) {
      setError('Browser push is not configured.');
      return;
    }

    setError(null);
    setPendingKey('push');

    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);

      if (permission !== 'granted') {
        throw new Error('Browser notifications are blocked.');
      }

      const registration = await navigator.serviceWorker.register('/push-sw.js');
      const existingSubscription = await registration.pushManager.getSubscription();
      const subscription =
        existingSubscription ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        }));

      const response = await fetch('/api/account/push-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error ?? 'Unable to subscribe browser push.');
      }

      setPushSubscribed(true);
      setDraft((current) => ({
        ...current,
        browserPushEnabled: true,
      }));

      startTransition(() => {
        router.refresh();
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to subscribe browser push.');
    } finally {
      setPendingKey(null);
    }
  }, [canUseBrowserPush, router, vapidPublicKey]);

  const unsubscribeBrowserPush = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    setError(null);
    setPendingKey('push');

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await fetch('/api/account/push-subscriptions', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        });

        await subscription.unsubscribe();
      }

      await fetch('/api/account/notification-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          browserPushEnabled: false,
        }),
      });

      setPushSubscribed(false);
      setDraft((current) => ({
        ...current,
        browserPushEnabled: false,
      }));

      startTransition(() => {
        router.refresh();
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to unsubscribe browser push.');
    } finally {
      setPendingKey(null);
    }
  }, [router]);

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-xl">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-foreground">Каналы доставки</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Внутренние уведомления уже сохраняются в кабинете. Здесь подключаются внешние каналы: email, Telegram и браузерные push.
        </p>
      </div>

      {error ? <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="rounded-2xl border border-border/70 bg-background/60 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium text-foreground">Email</h3>
              <p className="mt-1 text-sm text-muted-foreground">Отправка уведомлений на email аккаунта.</p>
            </div>
            <input
              type="checkbox"
              checked={draft.emailEnabled}
              onChange={(event) => setDraft((current) => ({ ...current, emailEnabled: event.target.checked }))}
              className="mt-1 h-4 w-4"
            />
          </div>
        </label>

        <label className="rounded-2xl border border-border/70 bg-background/60 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium text-foreground">Telegram</h3>
              <p className="mt-1 text-sm text-muted-foreground">Укажите `chat_id`, чтобы получать уведомления в Telegram.</p>
            </div>
            <input
              type="checkbox"
              checked={draft.telegramEnabled}
              onChange={(event) => setDraft((current) => ({ ...current, telegramEnabled: event.target.checked }))}
              className="mt-1 h-4 w-4"
            />
          </div>
          <input
            value={draft.telegramChatId}
            onChange={(event) => setDraft((current) => ({ ...current, telegramChatId: event.target.value }))}
            className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-teal-accent/60 focus:ring-2 focus:ring-teal-accent/30"
            placeholder="Например: 123456789"
          />
          {telegramBotUsername ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Бот: <Link href={`https://t.me/${telegramBotUsername}`} className="text-teal-accent hover:underline">{telegramBotUsername}</Link>
            </p>
          ) : null}
        </label>
      </div>

      <div className="mt-4 rounded-2xl border border-border/70 bg-background/60 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="font-medium text-foreground">Браузерные push</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Статус: {pushSubscribed ? 'подписка активна' : 'подписки нет'}
              {permissionState ? ` • permission: ${permissionState}` : ''}
            </p>
            {!canUseBrowserPush ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Браузерный push станет доступен после настройки `NEXT_PUBLIC_VAPID_PUBLIC_KEY` и `VAPID_PRIVATE_KEY`.
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {pushSubscribed ? (
              <Button variant="outline" disabled={pendingKey === 'push'} onClick={unsubscribeBrowserPush}>
                {pendingKey === 'push' ? 'Отключаем...' : 'Отключить push'}
              </Button>
            ) : (
              <Button variant="outline" disabled={!canUseBrowserPush || pendingKey === 'push'} onClick={subscribeBrowserPush}>
                {pendingKey === 'push' ? 'Подключаем...' : 'Подключить push'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Button
          type="button"
          disabled={pendingKey === 'settings'}
          onClick={saveSettings}
          className="bg-teal-dark text-white hover:bg-teal-medium dark:bg-teal-accent dark:text-[#09090B] dark:hover:bg-seafoam"
        >
          {pendingKey === 'settings' ? 'Сохраняем...' : 'Сохранить настройки'}
        </Button>
      </div>
    </section>
  );
}
