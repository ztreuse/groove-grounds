-- Realtime pings for the live tracker and the Backstage queue.
-- Orders stay private (RLS), so instead of exposing the table to Realtime the
-- database broadcasts a small message and the page refetches from the server.
-- Payloads never include customer details.
CREATE OR REPLACE FUNCTION public.broadcast_order_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Tracker: only someone who has the order link knows this topic.
  PERFORM realtime.send(
    jsonb_build_object('status', NEW.status),
    'order_changed',
    'order:' || NEW.id::text,
    false
  );
  -- Queue: no ids or details, just "something changed, refetch".
  PERFORM realtime.send('{}'::jsonb, 'queue_changed', 'backstage:queue', false);
  RETURN NULL;
END;
$$;
--> statement-breakpoint
REVOKE EXECUTE ON FUNCTION public.broadcast_order_change() FROM PUBLIC, anon, authenticated;
--> statement-breakpoint
DROP TRIGGER IF EXISTS orders_broadcast ON public.orders;
--> statement-breakpoint
CREATE TRIGGER orders_broadcast
AFTER INSERT OR UPDATE OF status ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.broadcast_order_change();
