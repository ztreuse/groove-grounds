"use client";

import Link from "next/link";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import type { Dashboard as DashboardData } from "@/lib/db/reports";
import { formatDay, formatPeso, formatTime } from "@/lib/format";
import { routes } from "@/lib/routes";
import { dayKey, schedule, type ScheduleRules } from "@/lib/schedule";

const weekday = new Intl.DateTimeFormat("en-PH", {
  timeZone: schedule.timeZone,
  weekday: "short",
});

// 9 → "9a", 13 → "1p": axis ticks only; tooltips use the full clock time.
const shortHour = (hour: number) =>
  `${hour % 12 || 12}${hour < 12 ? "a" : "p"}`;
const clockHour = (hour: number) =>
  `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`;

type DashboardProps = { data: DashboardData; rules: ScheduleRules };

// Owner's dashboard: today's tiles, the week's takings, top drinks, busiest
// hours and the booked pickups still to come.
export function Dashboard({ data, rules }: DashboardProps) {
  const { t } = useCopy();
  const ordersLabel = (count: number) =>
    count === 1 ? t.dashboard.ordersOne : fill(t.dashboard.orders, { count });
  const weekRevenue = data.week.reduce((sum, day) => sum + day.revenue, 0);
  const weekOrders = data.week.reduce((sum, day) => sum + day.orders, 0);

  return (
    <div className="mt-10 space-y-16">
      <section aria-labelledby="dash-today">
        <Heading id="dash-today" title="todayTitle" />
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Tile tile="orders" value={String(data.today.orders)} />
          <Tile tile="revenue" value={formatPeso(data.today.revenue)} />
          <Tile tile="drinks" value={String(data.today.drinks)} />
          <Tile
            tile="open"
            value={String(data.today.open)}
            href={routes.backstageQueue.href}
          />
        </ul>
      </section>

      <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
        <section aria-labelledby="dash-week">
          <Heading
            id="dash-week"
            title="weekTitle"
            body="weekBody"
            aside={
              <>
                <span className="block font-heading text-3xl leading-none font-black [font-stretch:70%]">
                  {formatPeso(weekRevenue)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {ordersLabel(weekOrders)}
                </span>
              </>
            }
          />
          {weekOrders === 0 ? (
            <Empty>{t.dashboard.empty}</Empty>
          ) : (
            <ColumnChart
              bars={data.week.map((day, index) => {
                const isToday = index === data.week.length - 1;
                const label = isToday
                  ? t.dashboard.today
                  : weekday.format(new Date(`${day.day}T12:00:00+08:00`));
                return {
                  key: day.day,
                  tick: label,
                  strong: isToday,
                  value: day.revenue,
                  valueLabel: formatPeso(day.revenue),
                  title: formatDay(day.day),
                  detail: ordersLabel(day.orders),
                };
              })}
            />
          )}
        </section>

        <section aria-labelledby="dash-top">
          <Heading id="dash-top" title="topTitle" body="topBody" />
          {data.topDrinks.length === 0 ? (
            <Empty>{t.dashboard.empty}</Empty>
          ) : (
            <TopDrinks drinks={data.topDrinks} />
          )}
        </section>

        <section aria-labelledby="dash-hours">
          <Heading id="dash-hours" title="hoursTitle" body="hoursBody" />
          {data.hours.length === 0 ? (
            <Empty>{t.dashboard.empty}</Empty>
          ) : (
            <HoursChart hours={data.hours} rules={rules} />
          )}
        </section>

        <section aria-labelledby="dash-upcoming">
          <Heading
            id="dash-upcoming"
            title="upcomingTitle"
            body="upcomingBody"
          />
          {data.upcoming.length === 0 ? (
            <Empty>{t.dashboard.noUpcoming}</Empty>
          ) : (
            <Upcoming slots={data.upcoming} capacity={rules.slotCapacity} />
          )}
        </section>
      </div>
    </div>
  );
}

type TitleKey =
  "todayTitle" | "weekTitle" | "topTitle" | "hoursTitle" | "upcomingTitle";
type BodyKey = "weekBody" | "topBody" | "hoursBody" | "upcomingBody";

function Heading({
  id,
  title,
  body,
  aside,
}: {
  id: string;
  title: TitleKey;
  body?: BodyKey;
  aside?: React.ReactNode;
}) {
  const { t, plain, isPlain } = useCopy();
  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
      <div>
        <h2 id={id} className="text-3xl leading-none">
          {t.dashboard[title]}
        </h2>
        {!isPlain && plain.dashboard[title] !== t.dashboard[title] && (
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {plain.dashboard[title]}
          </p>
        )}
        {body && (
          <p className="mt-2 text-sm text-muted-foreground">
            {t.dashboard[body]}
          </p>
        )}
      </div>
      {aside && <div className="shrink-0 text-right">{aside}</div>}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md bg-muted/60 p-8 text-center text-muted-foreground">
      {children}
    </p>
  );
}

function Tile({
  tile,
  value,
  href,
}: {
  tile: keyof DashboardData["today"];
  value: string;
  href?: string;
}) {
  const { t, plain, isPlain } = useCopy();
  const body = (
    <>
      <span className="block eyebrow">{t.dashboard.tiles[tile]}</span>
      {!isPlain && (
        <span className="block text-xs text-muted-foreground">
          {plain.dashboard.tiles[tile]}
        </span>
      )}
      <span className="mt-5 block font-heading text-5xl leading-none font-black [font-stretch:70%] sm:text-6xl">
        {value}
      </span>
    </>
  );
  return (
    <li className="min-w-0">
      {href ? (
        <Link
          href={href}
          aria-label={`${plain.dashboard.tiles[tile]}: ${value}`}
          className="block h-full surface p-4 transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring sm:p-5"
        >
          {body}
        </Link>
      ) : (
        <div className="h-full surface p-4 sm:p-5">{body}</div>
      )}
    </li>
  );
}

type Bar = {
  key: string;
  tick: string | null;
  strong?: boolean;
  value: number;
  valueLabel: string;
  title: string;
  detail: string;
};

// Columns on one baseline. Only the tallest column carries its number; the
// rest show it on hover or keyboard focus.
function ColumnChart({ bars }: { bars: Bar[] }) {
  const max = Math.max(...bars.map((bar) => bar.value), 1);
  const peak = bars.findIndex((bar) => bar.value === max);

  return (
    <div>
      <ol className="flex h-48 items-stretch gap-0.5 border-b border-border">
        {bars.map((bar, index) => {
          const align =
            index < bars.length / 3
              ? "left-0"
              : index >= (bars.length * 2) / 3
                ? "right-0"
                : "left-1/2 -translate-x-1/2";
          return (
            <li
              key={bar.key}
              tabIndex={0}
              aria-label={`${bar.title}: ${bar.valueLabel}, ${bar.detail}`}
              className="group relative flex min-w-0 flex-1 flex-col items-center justify-end rounded-t-sm outline-none hover:bg-muted/70 focus-visible:ring-3 focus-visible:ring-ring"
            >
              {index === peak && bar.value > 0 && (
                <span aria-hidden className="mb-1 text-xs font-semibold">
                  {bar.valueLabel}
                </span>
              )}
              <span
                aria-hidden
                className="w-full max-w-10 rounded-t-sm bg-highlight"
                style={{ height: `${(bar.value / max) * 85}%` }}
              />
              <span
                aria-hidden
                className={`pointer-events-none absolute bottom-full z-10 mb-2 rounded-md bg-espresso px-3 py-2 text-sm whitespace-nowrap text-cream opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus:opacity-100 ${align}`}
              >
                <span className="block font-semibold">{bar.title}</span>
                {bar.valueLabel}
                <span className="text-khaki"> · {bar.detail}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <ol aria-hidden className="mt-2 flex gap-0.5">
        {bars.map((bar) => (
          <li
            key={bar.key}
            className={`min-w-0 flex-1 text-center text-xs ${
              bar.strong
                ? "font-semibold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {bar.tick}
          </li>
        ))}
      </ol>
    </div>
  );
}

function HoursChart({
  hours,
  rules,
}: {
  hours: DashboardData["hours"];
  rules: ScheduleRules;
}) {
  const { t } = useCopy();
  const counts = new Map(hours.map((row) => [row.hour, row.orders]));
  // Opening hours, stretched to fit any order outside them.
  const first = Math.min(Math.floor(rules.openMinute / 60), ...counts.keys());
  const last = Math.max(
    Math.ceil(rules.closeMinute / 60) - 1,
    ...counts.keys(),
  );
  const bars = Array.from(
    { length: last - first + 1 },
    (_, i) => first + i,
  ).map((hour, index) => {
    const orders = counts.get(hour) ?? 0;
    return {
      key: String(hour),
      tick: index % 3 === 0 ? shortHour(hour) : null,
      value: orders,
      valueLabel: String(orders),
      title: clockHour(hour),
      detail:
        orders === 1
          ? t.dashboard.ordersOne
          : fill(t.dashboard.orders, { count: orders }),
    };
  });
  return <ColumnChart bars={bars} />;
}

function TopDrinks({ drinks }: { drinks: DashboardData["topDrinks"] }) {
  const { t } = useCopy();
  const max = Math.max(...drinks.map((drink) => drink.sold), 1);

  return (
    <ol className="space-y-4">
      {drinks.map((drink) => (
        <li key={drink.name}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate label-display text-lg leading-tight">
              {drink.name}
            </span>
            <span className="shrink-0 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {fill(t.dashboard.sold, { count: drink.sold })}
              </span>
              {" · "}
              {formatPeso(drink.revenue)}
            </span>
          </div>
          <div aria-hidden className="mt-1.5 h-2 rounded-sm bg-muted">
            <div
              className="h-full rounded-sm bg-highlight"
              style={{ width: `${(drink.sold / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

function Upcoming({
  slots,
  capacity,
}: {
  slots: DashboardData["upcoming"];
  capacity: number;
}) {
  const { t } = useCopy();

  return (
    <ul className="divide-y divide-border">
      {slots.map((slot) => {
        const full = slot.drinks >= capacity;
        return (
          <li
            key={slot.slotStart}
            className="grid gap-3 py-4 first:pt-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
          >
            <div className="min-w-0">
              <p className="label-display text-lg leading-tight">
                {formatDay(dayKey(new Date(slot.slotStart)))} ·{" "}
                {formatTime(slot.slotStart)}
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {slot.codes.map((code) => (
                  <li
                    key={code}
                    className="rounded-sm bg-muted px-2 py-0.5 text-xs font-semibold"
                  >
                    {code}
                  </li>
                ))}
              </ul>
            </div>
            <div className="sm:w-40 sm:text-right">
              <p
                className={`text-sm font-semibold ${full ? "text-highlight" : ""}`}
              >
                {full
                  ? t.dashboard.classFull
                  : fill(t.dashboard.slotDrinks, {
                      drinks: slot.drinks,
                      capacity,
                    })}
              </p>
              <div aria-hidden className="mt-1.5 h-1.5 rounded-sm bg-muted">
                <div
                  className="h-full rounded-sm bg-highlight"
                  style={{
                    width: `${Math.min(slot.drinks / capacity, 1) * 100}%`,
                  }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
