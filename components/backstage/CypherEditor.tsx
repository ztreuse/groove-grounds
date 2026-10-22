"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  publishCypherPost,
  removeCypherPost,
  saveCypherPost,
} from "@/app/backstage/cypher/actions";
import { AuthField } from "@/components/auth/AuthField";
import { Switch } from "@/components/backstage/Switch";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import {
  CYPHER_ON_HOME,
  cypherPostSchema,
  EMPTY_POST,
  type CypherPostInput,
  type CypherPostValues,
} from "@/lib/cypher";
import type { CypherAdminPost } from "@/lib/db/cypher";

// Owner's editor for The Cypher: add a post, edit its Dance and Plain
// wording, hide it from Center Stage, or delete it.
export function CypherEditor({ posts }: { posts: CypherAdminPost[] }) {
  const { t, plain } = useCopy();
  const router = useRouter();
  // "new", a post id, or null.
  const [editing, setEditing] = useState<string | null>(null);

  // The newest published posts are the ones on Center Stage.
  const liveIds = new Set(
    posts
      .filter((post) => post.isPublished)
      .slice(0, CYPHER_ON_HOME)
      .map((post) => post.id),
  );

  async function save(id: string | null, values: CypherPostValues) {
    const ok = await saveCypherPost(id, values);
    toast(ok ? t.cypherAdmin.saved : t.cypherAdmin.failed);
    if (ok) {
      setEditing(null);
      router.refresh();
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-end border-b border-border pb-4">
        <Button
          size="lg"
          onClick={() => setEditing(editing === "new" ? null : "new")}
          aria-expanded={editing === "new"}
          aria-label={plain.cypherAdmin.add}
        >
          <Plus aria-hidden />
          {t.cypherAdmin.add}
        </Button>
      </div>

      {editing === "new" && (
        <div className="mt-4 surface p-4 sm:p-6">
          <PostForm
            defaults={EMPTY_POST}
            onSubmit={(values) => save(null, values)}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {posts.length === 0 ? (
        <p className="mt-8 rounded-md bg-muted/60 p-8 text-center text-muted-foreground">
          {t.cypherAdmin.empty}
        </p>
      ) : (
        <ul className="mt-4 grid gap-4 lg:grid-cols-2">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              live={liveIds.has(post.id)}
              editing={editing === post.id}
              onEdit={() => setEditing(editing === post.id ? null : post.id)}
              onSave={(values) => save(post.id, values)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

type PostCardProps = {
  post: CypherAdminPost;
  live: boolean;
  editing: boolean;
  onEdit: () => void;
  onSave: (values: CypherPostValues) => Promise<void>;
};

function PostCard({ post, live, editing, onEdit, onSave }: PostCardProps) {
  const { t, plain, isPlain } = useCopy();
  const router = useRouter();
  const [published, setPublished] = useState(post.isPublished);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!confirmDelete) return;
    const timer = setTimeout(() => setConfirmDelete(false), 4000);
    return () => clearTimeout(timer);
  }, [confirmDelete]);

  async function togglePublished(next: boolean) {
    setPublished(next);
    const ok = await publishCypherPost(post.id, next);
    if (!ok) {
      setPublished(!next);
      toast(t.cypherAdmin.failed);
    }
    router.refresh();
  }

  async function remove() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setBusy(true);
    const ok = await removeCypherPost(post.id);
    setBusy(false);
    toast(ok ? t.cypherAdmin.deleted : t.cypherAdmin.failed);
    if (ok) router.refresh();
  }

  const title = isPlain ? post.titlePlain : post.titleDance;

  return (
    <li
      className={`flex flex-col surface p-4 sm:p-6 ${editing ? "lg:col-span-2" : ""}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="eyebrow text-highlight">
          {isPlain ? post.tagPlain : post.tagDance}
        </span>
        <span
          className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${
            live ? "bg-lilac text-espresso" : "bg-muted text-muted-foreground"
          }`}
        >
          {live ? t.cypherAdmin.live : t.cypherAdmin.hidden}
        </span>
      </div>
      <h2 className="mt-3 text-2xl leading-tight">{title}</h2>
      {!isPlain && (
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          {post.titlePlain}
        </p>
      )}
      <p className="mt-3 flex-1 text-muted-foreground">
        {isPlain ? post.bodyPlain : post.bodyDance}
      </p>
      <p className="mt-4 text-sm font-semibold">{post.author}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-3">
        <Switch
          checked={published}
          label={t.cypherAdmin.publish}
          ariaLabel={`${plain.cypherAdmin.publish}: ${post.titlePlain}`}
          onChange={(next) => void togglePublished(next)}
        />
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            onClick={onEdit}
            aria-expanded={editing}
            aria-label={`${plain.cypherAdmin.edit}: ${post.titlePlain}`}
          >
            <Pencil aria-hidden />
            {t.cypherAdmin.edit}
          </Button>
          <Button
            variant="ghost"
            disabled={busy}
            onClick={remove}
            aria-label={`${confirmDelete ? plain.cypherAdmin.confirmDelete : plain.cypherAdmin.delete}: ${post.titlePlain}`}
            className={confirmDelete ? "text-destructive" : ""}
          >
            <Trash2 aria-hidden />
            {confirmDelete ? t.cypherAdmin.confirmDelete : t.cypherAdmin.delete}
          </Button>
        </div>
      </div>

      {editing && (
        <div className="mt-4 border-t border-border pt-4">
          <PostForm
            idPrefix={post.id}
            defaults={{
              tagDance: post.tagDance,
              tagPlain: post.tagPlain,
              titleDance: post.titleDance,
              titlePlain: post.titlePlain,
              bodyDance: post.bodyDance,
              bodyPlain: post.bodyPlain,
              author: post.author,
            }}
            onSubmit={onSave}
            onCancel={onEdit}
          />
        </div>
      )}
    </li>
  );
}

type PostFormProps = {
  // Keeps field ids unique when several forms could exist.
  idPrefix?: string;
  defaults: CypherPostInput;
  onSubmit: (values: CypherPostValues) => Promise<void>;
  onCancel: () => void;
};

// Dance and Plain wording side by side, then who it's signed by.
function PostForm({
  idPrefix = "new",
  defaults,
  onSubmit,
  onCancel,
}: PostFormProps) {
  const { t, plain } = useCopy();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CypherPostInput, unknown, CypherPostValues>({
    resolver: zodResolver(cypherPostSchema),
    defaultValues: defaults,
  });
  const message = (key?: string) => (key ? t.cypherAdmin.required : null);
  const fid = (name: string) => `${idPrefix}-${name}`;

  const column = (mode: "Dance" | "Plain") => {
    const tag = `tag${mode}` as const;
    const title = `title${mode}` as const;
    const body = `body${mode}` as const;
    return (
      <fieldset className="grid content-start gap-4">
        <legend className="mb-3 label-display text-lg">
          {mode === "Dance"
            ? t.cypherAdmin.danceWording
            : t.cypherAdmin.plainWording}
        </legend>
        <AuthField
          id={fid(tag)}
          label={t.cypherAdmin.tag}
          error={message(errors[tag]?.message)}
          register={register(tag)}
        />
        <AuthField
          id={fid(title)}
          label={t.cypherAdmin.title}
          error={message(errors[title]?.message)}
          register={register(title)}
        />
        <div>
          <label
            htmlFor={fid(body)}
            className="mb-1 block text-sm font-semibold"
          >
            {t.cypherAdmin.body}
          </label>
          <textarea
            id={fid(body)}
            rows={3}
            maxLength={240}
            aria-invalid={!!errors[body]}
            className="w-full resize-none field px-4 py-3 text-base"
            {...register(body)}
          />
          {errors[body] && (
            <p className="mt-1 text-sm text-destructive">
              {message(errors[body]?.message)}
            </p>
          )}
        </div>
      </fieldset>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        {column("Dance")}
        {column("Plain")}
      </div>
      <div className="md:w-1/2 md:pr-3">
        <AuthField
          id={fid("author")}
          label={t.cypherAdmin.author}
          error={message(errors.author?.message)}
          register={register("author")}
        />
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          aria-label={plain.cypherAdmin.cancel}
        >
          {t.cypherAdmin.cancel}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          aria-label={plain.cypherAdmin.save}
        >
          {t.cypherAdmin.save}
        </Button>
      </div>
    </form>
  );
}
