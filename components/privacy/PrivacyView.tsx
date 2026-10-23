"use client";

import { PageHero } from "@/components/layout/PageHero";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import { privacySections, privacyUpdated } from "@/lib/privacy";

// Privacy policy: plain words in both modes, hairline-ruled sections in the
// reading column.
export function PrivacyView() {
  const { t, plain } = useCopy();

  return (
    <>
      <PageHero
        title={t.pages.privacy}
        plainTitle={plain.pages.privacy}
        body={fill(t.privacy.updated, { date: privacyUpdated })}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
        <div className="max-w-prose">
          {privacySections.map((section) => (
            <section
              key={section.id}
              aria-labelledby={`privacy-${section.id}`}
              className="border-t border-border py-8 first:border-t-0 first:pt-0"
            >
              <h2
                id={`privacy-${section.id}`}
                className="text-2xl leading-tight"
              >
                {section.title}
              </h2>
              {section.items && (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground marker:text-highlight">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
