"use client";

import type { UseFormRegisterReturn } from "react-hook-form";

type AuthFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  register: UseFormRegisterReturn;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id">;

export function AuthField({
  id,
  label,
  hint,
  error,
  register,
  ...input
}: AuthFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className="h-12 w-full field px-4 text-base aria-invalid:border-destructive"
        {...input}
        {...register}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-destructive">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1 text-sm text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
