export type Pillar = {
  slug: string;
  name: string;
  tagline: string;
  color: string;
  emoji: string;
  intro: string;
  resources: { title: string; body: string }[];
  habits: { id: string; title: string; xp: number }[];
};

export const PILLARS: Pillar[] = [
  {
    slug: "career",
    name: "Career",
    tagline: "Build skills. Earn your future.",
    color: "#9BB8C9",
    emoji: "💼",
    intro:
      "Your career is the engine of your freedom. Skills beat luck. Reps beat talent. Start where you are, stack small wins daily, and compound over years.",
    resources: [
      { title: "The 10,000 reps rule", body: "Mastery is not a mystery. Pick one skill. Put in focused reps daily. Track what you practiced and what you learned." },
      { title: "Pick a lane", body: "Trying to do everything means mastering nothing. Choose one path for 90 days and commit fully before reassessing." },
      { title: "Build in public", body: "Share your progress weekly — LinkedIn, X, a blog. Opportunity finds people who are visible." },
    ],
    habits: [
      { id: "career-learn", title: "Study or practice skill 30 min", xp: 15 },
      { id: "career-apply", title: "Apply to 1 job or send 1 pitch", xp: 20 },
      { id: "career-network", title: "Reach out to 1 new person", xp: 10 },
    ],
  },
  {
    slug: "physical-health",
    name: "Physical Health",
    tagline: "Strong body. Strong mind.",
    color: "#6B8E6B",
    emoji: "💪",
    intro:
      "Your body is the vehicle for everything else. Train it, feed it, rest it. Discipline here bleeds into every other pillar.",
    resources: [
      { title: "Lift 3x a week", body: "Compound lifts: squat, deadlift, bench, row, overhead press. Progressive overload beats fancy programs." },
      { title: "Walk 8k steps", body: "The easiest, most underrated health habit. Listen to a book, clear your head, move your body." },
      { title: "Eat for fuel", body: "Protein at every meal. Whole foods 80% of the time. Water before coffee. Stop eating 2 hours before bed." },
    ],
    habits: [
      { id: "phys-workout", title: "Workout 45 min", xp: 20 },
      { id: "phys-steps", title: "Hit 8,000 steps", xp: 10 },
      { id: "phys-water", title: "Drink 2L water", xp: 5 },
      { id: "phys-sleep", title: "Sleep 7+ hours", xp: 15 },
    ],
  },
  {
    slug: "relationships",
    name: "Relationships",
    tagline: "You become who you spend time with.",
    color: "#C97B5A",
    emoji: "🤝",
    intro:
      "Isolation is a slow killer. Loneliness is a signal, not a life sentence. Build brotherhood, invest in the people who invest in you.",
    resources: [
      { title: "Audit your 5", body: "You're the average of your 5 closest people. Are they pulling you up, or down?" },
      { title: "Be the friend first", body: "Reach out. Remember birthdays. Show up. Initiate without keeping score." },
      { title: "Dating is a skill", body: "Rejection is data. Confidence comes from reps, not hacks. Be a man worth knowing, then go meet people." },
    ],
    habits: [
      { id: "rel-reach", title: "Text/call a friend or family", xp: 10 },
      { id: "rel-meet", title: "Meet someone in person", xp: 20 },
      { id: "rel-listen", title: "Have 1 real conversation", xp: 10 },
    ],
  },
  {
    slug: "addiction",
    name: "Addiction",
    tagline: "Break the chains. Reclaim your mind.",
    color: "#B9A7C9",
    emoji: "⛓️",
    intro:
      "Porn, weed, alcohol, scrolling, gambling, junk food — anything you reach for to escape pain is a chain. Name it. Face it. Replace it with something that actually heals.",
    resources: [
      { title: "Identify your trigger", body: "Every relapse has a pattern: time of day, emotion, environment. Track it for 7 days and you'll see the loop." },
      { title: "Replace, don't just remove", body: "A void wants to be filled. Swap doomscrolling for walking. Porn for pushups. Drinking for calling a friend." },
      { title: "Get help", body: "This is not weakness. SAMHSA helpline: 1-800-662-4357 (US, free, 24/7). Therapy, groups, sponsors — use them." },
    ],
    habits: [
      { id: "add-streak", title: "Stay clean today", xp: 25 },
      { id: "add-trigger", title: "Log a trigger when it hit", xp: 10 },
      { id: "add-replace", title: "Do your replacement habit", xp: 15 },
    ],
  },
  {
    slug: "finances",
    name: "Finances",
    tagline: "Money is a tool. Learn to use it.",
    color: "#6B8E6B",
    emoji: "💰",
    intro:
      "Broke isn't a personality. Build an emergency fund, kill high-interest debt, then let compound interest do the work while you sleep.",
    resources: [
      { title: "Track every dollar", body: "You can't improve what you don't measure. Use any app — the point is awareness." },
      { title: "The order of operations", body: "1) $1k emergency fund → 2) kill high-interest debt → 3) 3-6 month emergency fund → 4) invest 15% of income." },
      { title: "Live below your means", body: "A cheap car and a funded brokerage account beats a leased BMW and anxiety every time." },
    ],
    habits: [
      { id: "fin-track", title: "Log today's spending", xp: 10 },
      { id: "fin-nospend", title: "No unnecessary spending", xp: 15 },
      { id: "fin-learn", title: "Read/watch finance content 15 min", xp: 10 },
    ],
  },
  {
    slug: "mental-health",
    name: "Mental Health",
    tagline: "Your mind is the battlefield.",
    color: "#9BB8C9",
    emoji: "🧠",
    intro:
      "Hard men still feel things. Bottling it up is not strength — it's a slow leak. Journal, talk, move, rest. Get a therapist if you can.",
    resources: [
      { title: "Journal daily", body: "Brain dump for 5 minutes. No rules. Just get it out of your head and onto paper." },
      { title: "The basics fix 80%", body: "Sleep, sunlight, movement, real food, real conversation. Try those before anything else." },
      { title: "Therapy is leverage", body: "A good therapist compresses years of hard-earned lessons into months. Not weakness — strategy." },
    ],
    habits: [
      { id: "men-journal", title: "Journal 5 min", xp: 10 },
      { id: "men-meditate", title: "Meditate 10 min", xp: 15 },
      { id: "men-sun", title: "10 min sunlight", xp: 5 },
    ],
  },
  {
    slug: "discipline",
    name: "Discipline",
    tagline: "Do it when you don't feel like it.",
    color: "#1C1C1C",
    emoji: "⚔️",
    intro:
      "Motivation is a mood. Discipline is a muscle. Keep promises to yourself — especially the small ones — and you'll trust yourself with bigger ones.",
    resources: [
      { title: "The 2-minute rule", body: "Start so small it's impossible to fail. 1 pushup. 1 page. 1 sentence. Momentum is everything." },
      { title: "Do the hard thing first", body: "Cold shower, hardest task, workout — stack wins before 9am and the day owes you." },
      { title: "No zero days", body: "Every day, do at least one thing — however small — in the direction of who you want to be." },
    ],
    habits: [
      { id: "disc-early", title: "Wake before 7am", xp: 15 },
      { id: "disc-cold", title: "Cold shower", xp: 10 },
      { id: "disc-mit", title: "Finish today's most important task", xp: 20 },
    ],
  },
  {
    slug: "motivation",
    name: "Motivation",
    tagline: "Find your why. Guard it.",
    color: "#E8C37A",
    emoji: "🔥",
    intro:
      "Motivation comes and goes. What stays is your 'why.' Write it down, look at it daily, and build systems that work even when you don't feel it.",
    resources: [
      { title: "Find your why", body: "Not 'get rich.' Deeper. Who do you want to protect? What do you want to prove? Who are you becoming?" },
      { title: "Visual reminders", body: "Lock screen, mirror note, wallet card. Keep your why in your face." },
      { title: "Action creates motivation", body: "Waiting to feel motivated is a trap. Action first. Feelings follow." },
    ],
    habits: [
      { id: "mot-why", title: "Read your 'why' statement", xp: 5 },
      { id: "mot-win", title: "Celebrate 1 small win", xp: 5 },
      { id: "mot-visual", title: "Visualize goal for 2 min", xp: 5 },
    ],
  },
  {
    slug: "appearance",
    name: "Appearance",
    tagline: "Respect yourself enough to show up.",
    color: "#C97B5A",
    emoji: "👔",
    intro:
      "How you present yourself is how you're treated. This isn't vanity — it's respect for yourself and the people around you.",
    resources: [
      { title: "The basics", body: "Clean clothes that fit. Groomed hair and nails. Daily shower. Skincare is not optional. Smell good." },
      { title: "Fit > brand", body: "A $20 t-shirt that fits beats a $200 one that doesn't. Tailor your good pieces." },
      { title: "Posture is free", body: "Shoulders back, chin up, eye contact. Biggest upgrade you'll ever make, costs nothing." },
    ],
    habits: [
      { id: "app-groom", title: "Shower + grooming routine", xp: 5 },
      { id: "app-dress", title: "Dress with intention", xp: 5 },
      { id: "app-posture", title: "Check posture 3x today", xp: 5 },
    ],
  },
  {
    slug: "investing",
    name: "Investing",
    tagline: "Let your money work while you sleep.",
    color: "#4F6B4F",
    emoji: "📈",
    intro:
      "Time in the market beats timing the market. Boring index funds beat hot stock picks for 95% of people. Start now, even with $50.",
    resources: [
      { title: "Start with index funds", body: "Low-cost, diversified, set-and-forget. Think VOO, VTI, or your country's equivalent. Boring is beautiful." },
      { title: "Automate it", body: "Auto-invest every payday. Remove willpower from the equation. Pay yourself first." },
      { title: "Time is your edge", body: "$200/month at 8% becomes ~$300k in 30 years. Your superpower is starting young." },
    ],
    habits: [
      { id: "inv-contrib", title: "Contribute to brokerage/retirement", xp: 20 },
      { id: "inv-learn", title: "Read 1 investing article", xp: 10 },
      { id: "inv-review", title: "Review net worth", xp: 5 },
    ],
  },
];

export const PILLAR_BY_SLUG = Object.fromEntries(PILLARS.map((p) => [p.slug, p]));
