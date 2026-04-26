export type ToolQuestion = {
  id: string;
  text: string;
  hint?: string;
} & (
  | { kind: "tap10" }
  | { kind: "yesno"; yesPoints: number; noPoints: number }
  | { kind: "number"; unit: string; maxPoints: number; scoreValue: (n: number) => number }
);

export type PillarToolDef = {
  slug: string;
  toolName: string;
  toolSubtitle: string;
  questions: ToolQuestion[];
  scoreLabel: (score: number) => string;
};

export function computeCheckInScore(
  tool: PillarToolDef,
  answers: Record<string, number>
): { score: number; rawScore: number; maxScore: number } {
  let raw = 0;
  let max = 0;
  for (const q of tool.questions) {
    const ans = answers[q.id] ?? 0;
    if (q.kind === "tap10") {
      raw += ans;
      max += 10;
    } else if (q.kind === "yesno") {
      raw += ans;
      max += Math.max(q.yesPoints, q.noPoints);
    } else if (q.kind === "number") {
      raw += q.scoreValue(ans);
      max += q.maxPoints;
    }
  }
  const score = max === 0 ? 0 : Math.round((raw / max) * 100) / 10;
  return { score, rawScore: raw, maxScore: max };
}

export const PILLAR_TOOLS: PillarToolDef[] = [
  // 1. Career — 10 questions
  {
    slug: "career",
    toolName: "Career Clarity Audit",
    toolSubtitle: "Rate where you actually stand in your career right now.",
    questions: [
      { id: "c1", kind: "tap10", text: "How clear are you on your career direction?", hint: "1 = no idea, 10 = crystal clear" },
      { id: "c2", kind: "tap10", text: "How strong are your skills in your field?", hint: "1 = just starting, 10 = advanced" },
      { id: "c3", kind: "tap10", text: "How actively are you networking and building connections?" },
      { id: "c4", kind: "tap10", text: "How satisfied are you with your income or career trajectory?" },
      { id: "c5", kind: "tap10", text: "How consistent is your daily effort on your career?" },
      { id: "c6", kind: "tap10", text: "How much momentum do you feel right now?", hint: "1 = totally stuck, 10 = accelerating" },
      { id: "c7", kind: "tap10", text: "How much are you learning and growing in your work?" },
      { id: "c8", kind: "tap10", text: "How well do you manage your time and priorities?" },
      { id: "c9", kind: "tap10", text: "How confident are you in professional situations?" },
      { id: "c10", kind: "tap10", text: "How proud are you of your career progress so far?" },
    ],
    scoreLabel: (score) => {
      if (score <= 3) return "Just Starting";
      if (score <= 5) return "Finding Direction";
      if (score <= 7) return "Building Momentum";
      if (score <= 9) return "On Track";
      return "Locked In";
    },
  },

  // 2. Physical Health — 10 questions (steps in thousands)
  {
    slug: "physical-health",
    toolName: "Body Benchmark",
    toolSubtitle: "Put in real numbers. No guessing.",
    questions: [
      {
        id: "ph1",
        kind: "number",
        text: "How many push-ups can you do without stopping?",
        unit: "reps",
        maxPoints: 10,
        scoreValue: (n) => {
          if (n < 10) return 3;
          if (n < 21) return 5;
          if (n < 36) return 7;
          if (n < 51) return 9;
          return 10;
        },
      },
      {
        id: "ph2",
        kind: "number",
        text: "How many pull-ups can you do?",
        unit: "reps",
        maxPoints: 10,
        scoreValue: (n) => {
          if (n === 0) return 1;
          if (n < 4) return 4;
          if (n < 9) return 7;
          if (n < 15) return 9;
          return 10;
        },
      },
      {
        id: "ph3",
        kind: "number",
        text: "How many days did you train this week?",
        unit: "days",
        maxPoints: 10,
        scoreValue: (n) => {
          if (n === 0) return 0;
          if (n === 1) return 3;
          if (n === 2) return 5;
          if (n === 3) return 7;
          if (n === 4) return 8;
          return 10;
        },
      },
      {
        id: "ph4",
        kind: "number",
        text: "How many hours of sleep do you average per night?",
        unit: "hours",
        maxPoints: 10,
        scoreValue: (n) => {
          if (n < 5) return 1;
          if (n < 6) return 4;
          if (n < 7) return 7;
          if (n <= 8.5) return 10;
          return 7;
        },
      },
      { id: "ph5", kind: "tap10", text: "How clean is your diet on a typical day?", hint: "1 = junk food daily, 10 = dialled in" },
      {
        id: "ph6",
        kind: "number",
        text: "How many steps do you average daily?",
        unit: "k steps",
        maxPoints: 10,
        scoreValue: (n) => {
          // n is in thousands — e.g. 8 means 8,000 steps
          if (n < 3) return 2;
          if (n < 5) return 5;
          if (n < 8) return 8;
          return 10;
        },
      },
      { id: "ph7", kind: "tap10", text: "How flexible and mobile do you feel?", hint: "1 = stiff and limited, 10 = full range of motion" },
      { id: "ph8", kind: "tap10", text: "How would you rate your cardiovascular fitness?", hint: "1 = out of breath walking upstairs, 10 = excellent endurance" },
      { id: "ph9", kind: "tap10", text: "How consistently do you drink enough water daily?" },
      { id: "ph10", kind: "tap10", text: "How consistent has your training been over the last month?" },
    ],
    scoreLabel: (score) => {
      if (score <= 3) return "Needs Work";
      if (score <= 5) return "Getting There";
      if (score <= 7) return "Solid";
      if (score <= 9) return "Strong";
      return "Elite";
    },
  },

  // 3. Relationships — 10 questions
  {
    slug: "relationships",
    toolName: "Relationship Circle Audit",
    toolSubtitle: "How strong is your social world really?",
    questions: [
      { id: "r1", kind: "tap10", text: "How would you rate the quality of your close friendships?" },
      { id: "r2", kind: "tap10", text: "How connected do you feel to your family?" },
      { id: "r3", kind: "tap10", text: "How satisfied are you with your romantic life?", hint: "Rate 5 if not applicable" },
      { id: "r4", kind: "tap10", text: "How socially confident are you in new situations?" },
      { id: "r5", kind: "tap10", text: "How supportive is your social circle of your growth?" },
      { id: "r6", kind: "tap10", text: "How consistently do you invest time in your relationships?" },
      { id: "r7", kind: "tap10", text: "How well do you handle conflict and difficult conversations?" },
      { id: "r8", kind: "tap10", text: "How honest and open are you with people close to you?" },
      { id: "r9", kind: "tap10", text: "How often do you put effort into meeting new people?" },
      { id: "r10", kind: "tap10", text: "How proud are you of how you show up in relationships?" },
    ],
    scoreLabel: (score) => {
      if (score <= 3) return "Isolated";
      if (score <= 5) return "Surface Level";
      if (score <= 7) return "Connected";
      if (score <= 9) return "Strong Bonds";
      return "Brotherhood Built";
    },
  },

  // 4. Addiction — 10 questions (already 10 ✓)
  {
    slug: "addiction",
    toolName: "Freedom Score",
    toolSubtitle: "Ten honest questions. In the last 30 days...",
    questions: [
      { id: "a1", kind: "yesno", text: "Did you use/do it more than you intended to?", hint: "Be honest.", yesPoints: 0, noPoints: 1 },
      { id: "a2", kind: "yesno", text: "Did you try to stop and fail?", hint: "Be honest.", yesPoints: 0, noPoints: 1 },
      { id: "a3", kind: "yesno", text: "Did it affect your sleep?", hint: "Be honest.", yesPoints: 0, noPoints: 1 },
      { id: "a4", kind: "yesno", text: "Did it hurt your focus or productivity?", hint: "Be honest.", yesPoints: 0, noPoints: 1 },
      { id: "a5", kind: "yesno", text: "Did you reach for it when stressed or bored?", hint: "Be honest.", yesPoints: 0, noPoints: 1 },
      { id: "a6", kind: "yesno", text: "Did it cost you time that mattered?", hint: "Be honest.", yesPoints: 0, noPoints: 1 },
      { id: "a7", kind: "yesno", text: "Did you feel shame or regret after?", hint: "Be honest.", yesPoints: 0, noPoints: 1 },
      { id: "a8", kind: "yesno", text: "Did you lie to yourself about how much you were doing it?", hint: "Be honest.", yesPoints: 0, noPoints: 1 },
      { id: "a9", kind: "yesno", text: "Do you feel in control of it right now?", hint: "Be honest.", yesPoints: 1, noPoints: 0 },
      { id: "a10", kind: "yesno", text: "Are you proud of your relationship with it?", hint: "Be honest.", yesPoints: 1, noPoints: 0 },
    ],
    scoreLabel: (score) => {
      if (score <= 3) return "In the Grip";
      if (score <= 5) return "Aware but Struggling";
      if (score <= 7) return "Gaining Ground";
      if (score <= 9) return "In Control";
      return "Free";
    },
  },

  // 5. Finances — 10 questions
  {
    slug: "finances",
    toolName: "Money Health Check",
    toolSubtitle: "Real numbers only. No judgment.",
    questions: [
      {
        id: "f1",
        kind: "number",
        text: "What % of your income do you save or invest monthly?",
        unit: "%",
        maxPoints: 10,
        scoreValue: (n) => {
          if (n === 0) return 0;
          if (n < 6) return 4;
          if (n < 11) return 6;
          if (n < 21) return 8;
          return 10;
        },
      },
      {
        id: "f2",
        kind: "number",
        text: "How many months of expenses could you survive without income?",
        unit: "months",
        maxPoints: 10,
        scoreValue: (n) => {
          if (n === 0) return 0;
          if (n < 1) return 3;
          if (n < 2) return 5;
          if (n < 3) return 7;
          if (n < 6) return 9;
          return 10;
        },
      },
      { id: "f3", kind: "yesno", text: "Do you have an investing account?", yesPoints: 10, noPoints: 0 },
      { id: "f4", kind: "yesno", text: "Do you consistently spend less than you earn?", yesPoints: 10, noPoints: 0 },
      { id: "f5", kind: "yesno", text: "Do you track your spending?", yesPoints: 10, noPoints: 0 },
      { id: "f6", kind: "yesno", text: "Do you have a clear financial goal written down?", yesPoints: 10, noPoints: 0 },
      { id: "f7", kind: "tap10", text: "How financially literate do you feel?", hint: "1 = no idea about money, 10 = fully informed" },
      { id: "f8", kind: "tap10", text: "How confident are you in your financial future?" },
      { id: "f9", kind: "yesno", text: "Do you have a plan to pay off any debt you have?", yesPoints: 10, noPoints: 0 },
      { id: "f10", kind: "tap10", text: "How in control of your money do you feel day to day?" },
    ],
    scoreLabel: (score) => {
      if (score <= 3) return "In the Red";
      if (score <= 5) return "Getting By";
      if (score <= 7) return "Building Base";
      if (score <= 9) return "Money Smart";
      return "Financially Free";
    },
  },

  // 6. Mental Health — 10 questions
  {
    slug: "mental-health",
    toolName: "Mental State Check-In",
    toolSubtitle: "How are you actually doing? Be real.",
    questions: [
      { id: "mh1", kind: "tap10", text: "How stable has your mood been over the last two weeks?", hint: "1 = very unstable, 10 = rock solid" },
      { id: "mh2", kind: "tap10", text: "How well have you been sleeping?" },
      { id: "mh3", kind: "tap10", text: "How rarely do you feel anxious or overwhelmed?", hint: "1 = constantly, 10 = almost never" },
      { id: "mh4", kind: "tap10", text: "How good is your energy and motivation day to day?" },
      { id: "mh5", kind: "tap10", text: "How positive do you feel about yourself right now?" },
      { id: "mh6", kind: "tap10", text: "How connected do you feel to the people around you?" },
      { id: "mh7", kind: "tap10", text: "How well are you managing stress?" },
      { id: "mh8", kind: "tap10", text: "Overall — how would you rate your mental state right now?" },
      { id: "mh9", kind: "tap10", text: "How much do you enjoy activities and things you used to love?", hint: "1 = nothing brings joy, 10 = fully engaged" },
      { id: "mh10", kind: "tap10", text: "How hopeful do you feel about your future?" },
    ],
    scoreLabel: (score) => {
      if (score <= 3) return "Struggling";
      if (score <= 5) return "Hanging In";
      if (score <= 7) return "Managing";
      if (score <= 9) return "Thriving";
      return "Peak State";
    },
  },

  // 7. Discipline — 10 questions (already 10 ✓)
  {
    slug: "discipline",
    toolName: "Discipline Audit",
    toolSubtitle: "In the last 7 days — did you or didn't you?",
    questions: [
      { id: "d1", kind: "yesno", text: "Did you wake up on time every day?", yesPoints: 1, noPoints: 0 },
      { id: "d2", kind: "yesno", text: "Did you complete your most important task each day?", yesPoints: 1, noPoints: 0 },
      { id: "d3", kind: "yesno", text: "Did you do at least one workout or physical activity?", yesPoints: 1, noPoints: 0 },
      { id: "d4", kind: "yesno", text: "Did you avoid excessive social media or screen time?", yesPoints: 1, noPoints: 0 },
      { id: "d5", kind: "yesno", text: "Did you keep at least one promise you made to yourself?", yesPoints: 1, noPoints: 0 },
      { id: "d6", kind: "yesno", text: "Did you go to bed at a reasonable time consistently?", yesPoints: 1, noPoints: 0 },
      { id: "d7", kind: "yesno", text: "Did you do something uncomfortable that needed doing?", yesPoints: 1, noPoints: 0 },
      { id: "d8", kind: "yesno", text: "Did you follow through on your habits or routines?", yesPoints: 1, noPoints: 0 },
      { id: "d9", kind: "yesno", text: "Did you avoid procrastinating on something important?", yesPoints: 1, noPoints: 0 },
      { id: "d10", kind: "yesno", text: "Are you proud of how disciplined you were this week?", yesPoints: 1, noPoints: 0 },
    ],
    scoreLabel: (score) => {
      if (score <= 3) return "Needs Work";
      if (score <= 5) return "Inconsistent";
      if (score <= 7) return "Building";
      if (score <= 9) return "Disciplined";
      return "Iron Will";
    },
  },

  // 8. Motivation — 10 questions
  {
    slug: "motivation",
    toolName: "Purpose Clarity Test",
    toolSubtitle: "How connected are you to your why right now?",
    questions: [
      { id: "mo1", kind: "tap10", text: "How clear are you on your 'why' right now?", hint: "Your deepest reason for doing this" },
      { id: "mo2", kind: "tap10", text: "How excited are you about your future?" },
      { id: "mo3", kind: "tap10", text: "How well do your daily actions match your goals?", hint: "1 = total mismatch, 10 = fully aligned" },
      { id: "mo4", kind: "tap10", text: "How energised do you feel when you wake up?" },
      { id: "mo5", kind: "tap10", text: "How strongly do you believe you can achieve what you want?" },
      { id: "mo6", kind: "tap10", text: "How driven do you feel compared to your best self?" },
      { id: "mo7", kind: "tap10", text: "How often do you take action without waiting to feel ready?", hint: "1 = always waiting, 10 = always moving" },
      { id: "mo8", kind: "tap10", text: "How clear is your vision for your ideal future?" },
      { id: "mo9", kind: "tap10", text: "How well do you bounce back when things don't go to plan?" },
      { id: "mo10", kind: "tap10", text: "How proud are you of your progress toward your goals?" },
    ],
    scoreLabel: (score) => {
      if (score <= 3) return "Lost";
      if (score <= 5) return "Searching";
      if (score <= 7) return "Motivated";
      if (score <= 9) return "Driven";
      return "Unstoppable";
    },
  },

  // 9. Appearance — 10 questions (already 10 ✓)
  {
    slug: "appearance",
    toolName: "Presentation Audit",
    toolSubtitle: "Ten questions. Brutally honest.",
    questions: [
      { id: "ap1", kind: "yesno", text: "Do you shower and groom yourself daily?", yesPoints: 1, noPoints: 0 },
      { id: "ap2", kind: "yesno", text: "Do your clothes fit well?", yesPoints: 1, noPoints: 0 },
      { id: "ap3", kind: "yesno", text: "Are your clothes clean and in good condition?", yesPoints: 1, noPoints: 0 },
      { id: "ap4", kind: "yesno", text: "Do you have a skincare routine?", yesPoints: 1, noPoints: 0 },
      { id: "ap5", kind: "yesno", text: "Do you get your hair cut regularly?", yesPoints: 1, noPoints: 0 },
      { id: "ap6", kind: "yesno", text: "Do you wear clothes that match and suit you?", yesPoints: 1, noPoints: 0 },
      { id: "ap7", kind: "yesno", text: "Are you satisfied with your current physique?", yesPoints: 1, noPoints: 0 },
      { id: "ap8", kind: "yesno", text: "Do you stand tall with good posture consistently?", yesPoints: 1, noPoints: 0 },
      { id: "ap9", kind: "yesno", text: "Do you smell good when you leave the house?", yesPoints: 1, noPoints: 0 },
      { id: "ap10", kind: "yesno", text: "Would you be confident walking into a room right now?", yesPoints: 1, noPoints: 0 },
    ],
    scoreLabel: (score) => {
      if (score <= 3) return "Start Here";
      if (score <= 5) return "Getting Decent";
      if (score <= 7) return "Looking Good";
      if (score <= 9) return "Polished";
      return "Dialled In";
    },
  },

  // 10. Investing — 10 questions
  {
    slug: "investing",
    toolName: "Wealth Building Score",
    toolSubtitle: "Where are you on the wealth-building ladder?",
    questions: [
      { id: "i1", kind: "yesno", text: "Do you have a brokerage or investment account?", yesPoints: 10, noPoints: 0 },
      { id: "i2", kind: "yesno", text: "Do you invest money every month?", yesPoints: 10, noPoints: 0 },
      { id: "i3", kind: "yesno", text: "Do you understand how index funds work?", yesPoints: 10, noPoints: 0 },
      { id: "i4", kind: "yesno", text: "Do you know your current net worth?", yesPoints: 10, noPoints: 0 },
      {
        id: "i5",
        kind: "number",
        text: "What % of your income do you invest monthly?",
        unit: "%",
        maxPoints: 10,
        scoreValue: (n) => {
          if (n === 0) return 0;
          if (n < 6) return 5;
          if (n < 11) return 7;
          if (n < 21) return 9;
          return 10;
        },
      },
      { id: "i6", kind: "tap10", text: "How well do you understand investing overall?", hint: "1 = no idea, 10 = expert" },
      { id: "i7", kind: "tap10", text: "How confident are you in building long-term wealth?" },
      { id: "i8", kind: "yesno", text: "Do you have a retirement account (pension, 401k, super etc.)?", yesPoints: 10, noPoints: 0 },
      { id: "i9", kind: "yesno", text: "Have you read at least one book or course on investing?", yesPoints: 10, noPoints: 0 },
      { id: "i10", kind: "tap10", text: "How disciplined are you about leaving your investments alone?", hint: "1 = constantly checking/touching, 10 = set and forget" },
    ],
    scoreLabel: (score) => {
      if (score <= 3) return "Not Started";
      if (score <= 5) return "Just Beginning";
      if (score <= 7) return "Building Wealth";
      if (score <= 9) return "On Track";
      return "Wealth Builder";
    },
  },
];

export const PILLAR_TOOL_BY_SLUG: Record<string, PillarToolDef> = Object.fromEntries(
  PILLAR_TOOLS.map((t) => [t.slug, t])
);
