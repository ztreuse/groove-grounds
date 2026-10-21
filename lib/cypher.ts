// Demo posts for The Cypher (community board / specials feed) until the
// optional cypher_posts table exists. Each post has Dance and Plain wording.

type Wording = { dance: string; plain: string };

export type CypherPost = {
  id: string;
  tag: Wording;
  title: Wording;
  body: Wording;
  author: string;
};

export const cypherPosts: CypherPost[] = [
  {
    id: "open-style",
    tag: { dance: "Open Style", plain: "Weekly special" },
    title: {
      dance: "This week's freestyle: Calamansi Cold Foam Latte",
      plain: "This week's special: Calamansi Cold Foam Latte",
    },
    body: {
      dance:
        "Bright, citrusy, a little off-beat. Only on The Lineup till Sunday.",
      plain: "A bright citrus latte, on the menu until Sunday.",
    },
    author: "@groovegrounds",
  },
  {
    id: "crew-fridays",
    tag: { dance: "Crew Order", plain: "Group orders" },
    title: {
      dance: "Rolling deep to rehearsal?",
      plain: "Ordering for a group?",
    },
    body: {
      dance:
        "Send a Crew Order a day ahead and we'll have the whole set ready at your call time.",
      plain:
        "Place a group order a day ahead and we'll have everything ready at your pickup time.",
    },
    author: "@groovegrounds",
  },
  {
    id: "shout-out",
    tag: { dance: "Shout-out", plain: "Community" },
    title: {
      dance: "Props to Studio 23 for their showcase",
      plain: "Congrats to Studio 23 on their showcase",
    },
    body: {
      dance:
        "24 drinks, one Crew Order, zero missed counts. Fuel for the encore.",
      plain: "They ordered 24 drinks for the night. Thanks for choosing us!",
    },
    author: "Studio 23 Crew",
  },
];
