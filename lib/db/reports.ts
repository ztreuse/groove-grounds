import "server-only";
import { sql } from "drizzle-orm";
import { schedule } from "@/lib/schedule";
import { db } from "./index";

// Backstage dashboard numbers. Days and hours are Manila time; cut orders
// never count. "This week" is today and the six days before it.
const tz = sql.raw(`'${schedule.timeZone}'`);
const localDay = (column: string) =>
  sql.raw(`(${column} at time zone '${schedule.timeZone}')::date`);
const today = sql`(now() at time zone ${tz})::date`;

type Rows<T> = T[];

async function getToday() {
  const [row] = (await db.execute(sql`
    select
      (select count(*)::int from orders
        where status <> 'cut' and ${localDay("created_at")} = ${today}) as orders,
      (select coalesce(sum(total), 0)::int from orders
        where status <> 'cut' and ${localDay("created_at")} = ${today}) as revenue,
      (select coalesce(sum(oi.quantity), 0)::int
        from order_items oi join orders o on o.id = oi.order_id
        where o.status <> 'cut' and ${localDay("o.created_at")} = ${today}) as drinks,
      (select count(*)::int from orders
        where status not in ('bow', 'cut')) as open
  `)) as unknown as Rows<{
    orders: number;
    revenue: number;
    drinks: number;
    open: number;
  }>;
  return row;
}

async function getWeek() {
  return (await db.execute(sql`
    select to_char(d.day, 'YYYY-MM-DD') as day,
      count(o.id)::int as orders,
      coalesce(sum(o.total), 0)::int as revenue
    from generate_series(${today} - 6, ${today}, interval '1 day') as d(day)
    left join orders o
      on ${localDay("o.created_at")} = d.day::date and o.status <> 'cut'
    group by d.day
    order by d.day
  `)) as unknown as Rows<{ day: string; orders: number; revenue: number }>;
}

async function getTopDrinks() {
  return (await db.execute(sql`
    select coalesce(d.name, oi.name_snapshot) as name, d.slug,
      sum(oi.quantity)::int as sold,
      sum(oi.line_total)::int as revenue
    from order_items oi
    join orders o on o.id = oi.order_id
    left join drinks d on d.id = oi.drink_id
    where o.status <> 'cut' and ${localDay("o.created_at")} > ${today} - 7
    group by 1, 2
    order by sold desc, revenue desc
    limit 5
  `)) as unknown as Rows<{
    name: string;
    slug: string | null;
    sold: number;
    revenue: number;
  }>;
}

// Orders per pickup hour this week (booked slot, or order time for Drop-in).
async function getHours() {
  return (await db.execute(sql`
    select extract(hour from coalesce(slot_start, created_at) at time zone ${tz})::int as hour,
      count(*)::int as orders
    from orders
    where status <> 'cut'
      and ${localDay("coalesce(slot_start, created_at)")} between ${today} - 6 and ${today}
    group by 1
  `)) as unknown as Rows<{ hour: number; orders: number }>;
}

// Booked pickups still to come: one row per class slot, and one per Crew
// Order time (those don't use class capacity).
async function getUpcoming() {
  const rows = (await db.execute(sql`
    select o.slot_start, o.type,
      count(*)::int as orders,
      coalesce(sum(q.drinks), 0)::int as drinks,
      array_agg(o.code order by o.created_at) as codes
    from orders o
    cross join lateral (
      select sum(quantity) as drinks from order_items where order_id = o.id
    ) q
    where o.type in ('class', 'crew') and o.status <> 'cut' and o.slot_start > now()
    group by o.slot_start, o.type
    order by o.slot_start
    limit 8
  `)) as unknown as Rows<{
    slot_start: Date | string;
    type: "class" | "crew";
    orders: number;
    drinks: number;
    codes: string[];
  }>;
  return rows.map((row) => ({
    slotStart: new Date(row.slot_start).toISOString(),
    type: row.type,
    orders: row.orders,
    drinks: row.drinks,
    codes: row.codes,
  }));
}

export async function getDashboard() {
  const [today, week, topDrinks, hours, upcoming] = await Promise.all([
    getToday(),
    getWeek(),
    getTopDrinks(),
    getHours(),
    getUpcoming(),
  ]);
  return { today, week, topDrinks, hours, upcoming };
}

export type Dashboard = Awaited<ReturnType<typeof getDashboard>>;
