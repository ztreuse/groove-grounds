import { studio } from "@/lib/studio";

// Privacy policy for /privacy. Plain words in both modes (like the footer),
// and only what the site actually does: check this against the code when
// something that stores data changes.

export const privacyUpdated = "October 23, 2026";

export type PrivacySection = {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
};

export const privacySections: PrivacySection[] = [
  {
    id: "concept",
    title: "A concept project",
    paragraphs: [
      "Groove Grounds is a portfolio demo, not a real café. No real orders are made and no money changes hands: checkout uses a simulated payment, and the card form is pre-filled with fake numbers and can't take a real card.",
      "Demo data may be cleared at any time.",
    ],
  },
  {
    id: "collect",
    title: "What we collect",
    items: [
      "Account details, if you join: your email, name, and phone number if you add one. Passwords are handled and stored (hashed) by Supabase Auth; we never see them.",
      "If you sign in with Google: your name and email address from your Google account. We don't get your Google password or anything else from your account.",
      "Orders: the name and phone number you enter at checkout, what you ordered and your pickup time.",
      "Crew Order requests: your name, phone number, optional email, the date, headcount, drink mix, budget and notes.",
      "Props (ratings): your rating and comment. Your first name is shown with your comment on the drink's page.",
    ],
  },
  {
    id: "device",
    title: "On your device",
    items: [
      "A sign-in cookie from Supabase Auth, while you're signed in.",
      'Two cookies that remember which demo orders and Crew Order requests came from this browser, so Demo Backstage only shows your own. "Reset demo" in the footer clears them.',
      "Your Playlist (cart) and your Dance terms / Plain words choice, saved in your browser's local storage.",
    ],
    paragraphs: ["There are no ads, analytics or tracking cookies."],
  },
  {
    id: "use",
    title: "How it's used",
    paragraphs: [
      "Only to run the site: showing your orders and their status, your Dancer Profile, Reps and saved choreo, and Crew Order quotes. We don't sell or share your information, and we don't use it for marketing.",
    ],
  },
  {
    id: "services",
    title: "Services that host the site",
    items: [
      "Vercel hosts the website.",
      "Supabase stores the database and handles sign-in.",
      "Google, only if you choose to sign in with Google.",
    ],
  },
  {
    id: "choices",
    title: "Your choices",
    paragraphs: [
      "You can order as a guest without an account, and edit your name and phone on your Dancer Profile. To have your account and orders deleted, contact us and we'll remove them.",
      `Contact: ${studio.email} (this is a concept project; see Find the Studio).`,
    ],
  },
];
