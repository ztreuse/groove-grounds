// Content for the Dance Dictionary (/dictionary): the glossary from
// docs/PROJECT.md plus a short note on each dance style on The Lineup.

type Wording = { dance: string; plain: string };

export type DictionaryEntry = {
  term: string;
  plain: string;
  why: string;
};

export type DictionarySection = {
  id: string;
  title: Wording;
  entries: DictionaryEntry[];
};

export const dictionarySections: DictionarySection[] = [
  {
    id: "getting-around",
    title: { dance: "Getting around", plain: "Site sections" },
    entries: [
      {
        term: "Center Stage",
        plain: "Home",
        why: "The main spot everyone faces.",
      },
      {
        term: "The Lineup",
        plain: "Menu",
        why: "The list of who's performing, here the list of drinks.",
      },
      {
        term: "Playlist",
        plain: "Cart",
        why: "The tracks you've lined up before the set.",
      },
      {
        term: "Showtime",
        plain: "Checkout",
        why: "The moment you step on stage.",
      },
      {
        term: "Dancer Profile",
        plain: "Account page",
        why: "Your profile as a dancer.",
      },
      {
        term: "Dance Dictionary",
        plain: "Glossary / help page",
        why: "Where every term is explained.",
      },
      {
        term: "Backstage",
        plain: "Admin dashboard",
        why: "Where the crew works out of sight.",
      },
      {
        term: "Choreographers",
        plain: "Baristas",
        why: "They create what you perform, here what you drink.",
      },
    ],
  },
  {
    id: "ordering",
    title: { dance: "Ordering", plain: "Ordering" },
    entries: [
      {
        term: "Drop-in",
        plain: "Order now, pick up ASAP",
        why: "A drop-in class: just show up, no booking.",
      },
      {
        term: "Book a Class",
        plain: "Scheduled pickup",
        why: "Reserve your spot at a set time.",
      },
      {
        term: "Crew Order",
        plain: "Group / event order",
        why: "A crew is a group that moves together.",
      },
      {
        term: "Freestyle",
        plain: "Build-your-own drink",
        why: "No set routine; you make it up.",
      },
      {
        term: "Remix",
        plain: "Customize a drink",
        why: "Same track, your own twist.",
      },
      {
        term: "Choreo",
        plain: "Saved custom recipe",
        why: "A set routine you repeat exactly.",
      },
      {
        term: "Notes to the choreographer",
        plain: "Special instructions",
        why: "Telling the choreographer what you need.",
      },
    ],
  },
  {
    id: "menu",
    title: { dance: "On The Lineup", plain: "Menu" },
    entries: [
      {
        term: "Genres",
        plain: "Menu categories",
        why: "Styles grouped into families.",
      },
      {
        term: "Old School / New School",
        plain: "Classic espresso / signature drinks",
        why: "Foundational styles vs. modern ones.",
      },
      {
        term: "Mashup",
        plain: "Blended drinks and frappes",
        why: "A mashup blends songs together.",
      },
      {
        term: "Off-Beat",
        plain: "Non-coffee drinks",
        why: "Off the coffee beat.",
      },
      {
        term: "Intermission",
        plain: "Pastries and snacks",
        why: "What you grab at a show's intermission.",
      },
      {
        term: "Sitting out",
        plain: "Sold out / unavailable",
        why: "Not dancing this round.",
      },
      {
        term: "Spotlight",
        plain: "Featured drink / weekly promo",
        why: "The light on the featured performer.",
      },
      {
        term: "The Cypher",
        plain: "Community board / specials feed",
        why: "The circle where everyone gathers and shares.",
      },
    ],
  },
  {
    id: "remix",
    title: { dance: "The Remix panel", plain: "Drink options" },
    entries: [
      {
        term: "8 / 16 / 32-count",
        plain: "Small / medium / large",
        why: "A longer count means more.",
      },
      {
        term: "Warm-up / Cool-down",
        plain: "Hot / iced",
        why: "A warm-up heats you up; a cool-down cools you off.",
      },
      {
        term: "Marking / Half-out / Full out",
        plain: "Decaf / half-caf / regular caffeine",
        why: "Low, half and full energy.",
      },
      {
        term: "Double time / Triple time",
        plain: "+1 / +2 espresso shots",
        why: "Twice or three times the energy.",
      },
      {
        term: "Foundation",
        plain: "Milk base",
        why: "Foundations are the base every style builds on.",
      },
      {
        term: "Flavor",
        plain: "Syrups and flavors",
        why: 'Dancers "add flavor" to a move.',
      },
      {
        term: "Clean / Smooth / Full / Extra",
        plain: "Sweetness 25 / 50 / 100 / 125%",
        why: "Clean is minimal, Extra is over the top.",
      },
      {
        term: "Accents",
        plain: "Toppings",
        why: "An accent is the highlight on top of the beat.",
      },
      { term: "Freeze", plain: "Ice level", why: "A freeze is a frozen pose." },
    ],
  },
  {
    id: "status",
    title: { dance: "Order status", plain: "Order status" },
    entries: [
      {
        term: "Warm-up",
        plain: "Order received",
        why: "Getting ready before the routine.",
      },
      {
        term: "On deck",
        plain: "Queued, you're next up",
        why: "Waiting at the side of the stage for your turn.",
      },
      {
        term: "Full out",
        plain: "Being made now",
        why: "Dancing at full energy.",
      },
      {
        term: "Stage ready",
        plain: "Ready for pickup",
        why: "Set and waiting for your cue.",
      },
      {
        term: "Bow",
        plain: "Picked up, order complete",
        why: "The bow at the end of a performance.",
      },
      {
        term: "Cut from the set",
        plain: "Cancelled order",
        why: "Removed from the lineup.",
      },
    ],
  },
  {
    id: "loyalty",
    title: { dance: "Reps & Levels", plain: "Loyalty" },
    entries: [
      {
        term: "Reps",
        plain: "Loyalty points",
        why: "Earned by coming back again and again.",
      },
      {
        term: "Levels",
        plain: "Loyalty tiers",
        why: "Class levels, beginner to advanced.",
      },
      {
        term: "Rookie → Cypher Regular → Battler → Judge → Legend",
        plain: "The five loyalty tiers, lowest to highest",
        why: "From your first class to running the floor.",
      },
      {
        term: "Props",
        plain: "Ratings / reviews",
        why: "Giving props means giving credit.",
      },
      {
        term: "Past Performances",
        plain: "Order history",
        why: "Every past order is a past show.",
      },
    ],
  },
  {
    id: "odds",
    title: { dance: "Odds and ends", plain: "Other messages" },
    entries: [
      {
        term: "You missed a count",
        plain: "404 / error page",
        why: "You fell off the beat.",
      },
      {
        term: "5, 6, 7, 8…",
        plain: "Loading",
        why: "The count-in before you start.",
      },
    ],
  },
];

export type DanceStyleNote = {
  style: string; // matches drinks.dance_style
  note: string;
};

// One or two lines on each dance style a drink is named after.
export const danceStyleNotes: DanceStyleNote[] = [
  {
    style: "Popping",
    note: 'A funk style from 1970s California, built on quickly tensing and releasing muscles to make sharp "hits" on the beat.',
  },
  {
    style: "Tutting",
    note: "Inspired by poses in ancient Egyptian art: arms and hands make precise right angles and geometric shapes.",
  },
  {
    style: "Locking",
    note: 'A funk style from 1970s Los Angeles: fast, playful moves that suddenly "lock" into frozen poses, with points and wrist rolls.',
  },
  {
    style: "Breaking",
    note: "Born in the Bronx in the 1970s: toprock, footwork, power moves and freezes, usually danced in battles and cyphers.",
  },
  {
    style: "Hip-Hop",
    note: "The social dances of hip-hop culture, built on bounce, groove and rhythm. The foundation a lot of street styles share.",
  },
  {
    style: "Waacking",
    note: "From 1970s LA disco clubs: dramatic arm whips, striking poses and a lot of attitude.",
  },
  {
    style: "House",
    note: "Grew up in Chicago and New York clubs in the 1980s: fast footwork, jacking and a smooth, continuous flow.",
  },
  {
    style: "Afro",
    note: "An umbrella for styles rooted in African and diaspora dance: grounded, rhythmic and full of groove.",
  },
  {
    style: "Dancehall",
    note: "Jamaica's street and party dance, tied to dancehall music, with named steps and a laid-back bounce.",
  },
  {
    style: "Amapiano",
    note: "Dances to the South African music genre known for its log-drum bass: relaxed, smooth and playful.",
  },
  {
    style: "Krump",
    note: "Born in South Central Los Angeles in the early 2000s: raw, intense and expressive, with stomps, chest pops and arm swings.",
  },
  {
    style: "Open Style",
    note: "Freestyle that mixes styles with no fixed rules. Whatever the music calls for.",
  },
  {
    style: "Vogue",
    note: "From the Harlem ballroom scene: fashion-magazine poses, hand performance, catwalks, duckwalks and dips.",
  },
  {
    style: "Jersey Club",
    note: "Club music and dance from Newark, New Jersey: fast, bouncy footwork over quick, punchy kicks.",
  },
  {
    style: "Heels",
    note: "Choreography danced in heels, mixing jazz, commercial and vogue influences. Confident and bold.",
  },
  {
    style: "K-Choreo",
    note: "K-pop choreography: sharp, perfectly synced group routines that fans learn move for move.",
  },
  {
    style: "Lyrical",
    note: "A blend of ballet and jazz that acts out a song's lyrics: soft, flowing and emotional.",
  },
  {
    style: "Litefeet",
    note: "A New York street style from the 2000s: light, quick footwork, often seen in subway performances.",
  },
];

// Dance words used for the Intermission snacks.
export const snackWordNotes: { term: string; note: string }[] = [
  {
    term: "8-count",
    note: "A phrase of eight beats. Choreography is usually counted in eights.",
  },
  {
    term: "Toprock",
    note: "The upright steps a breaker dances before going down to the floor.",
  },
  { term: "Pirouette", note: "A full spin on one foot, from ballet." },
  {
    term: "Battle",
    note: "Dancers taking turns to outdo each other, judged or in a cypher.",
  },
];

// Remix group names that the glossary lists under their choices.
const termAliases: Record<string, string> = {
  Counts: "8 / 16 / 32-count",
  Energy: "Marking / Half-out / Full out",
  "Sweet level": "Clean / Smooth / Full / Extra",
  "Saved Choreo": "Choreo",
};

// The one-line "why it fits" for a dance term, for the "?" tooltips.
export function whyFor(term: string) {
  const key = termAliases[term] ?? term;
  for (const section of dictionarySections) {
    const entry = section.entries.find((item) => item.term === key);
    if (entry) return entry.why;
  }
  return null;
}
