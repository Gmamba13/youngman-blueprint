export const JOURNAL_PROMPTS: string[] = [
  "What's been weighing on you that you haven't said out loud?",
  "What's the gap between who you are today and who you want to be?",
  "What habit, if done daily for 90 days, would change everything?",
  "Where are you playing it safe when you should be taking a risk?",
  "What would you do differently if you knew no one was watching?",
  "Who in your life is pulling you down, and what are you going to do about it?",
  "What's the story you keep telling yourself that might not be true?",
  "When was the last time you felt genuinely proud of yourself? What caused it?",
  "What are you tolerating in your life that you should have fixed by now?",
  "If your best friend described you honestly, what would he say?",
  "What's one thing you've been avoiding because it scares you?",
  "What does financial freedom mean to you, and how far away is it?",
  "Who do you want to be in a relationship — and are you that person yet?",
  "What's draining your energy that you haven't addressed?",
  "What are you most grateful for right now, and are you showing it?",
  "What would you do if you had no fear of failure?",
  "How do you want people to describe you at your funeral?",
  "What belief about yourself is holding you back the most?",
  "Where do you need to be more honest — with yourself or with others?",
  "What small action today would make your future self proud?",
  "When do you feel most like yourself? What conditions create that?",
  "What's the cost of not changing the thing you know you need to change?",
  "How do you handle anger, and is that working for you?",
  "What's something you're jealous of, and what is that telling you?",
  "What are three things you're doing well that you never give yourself credit for?",
  "What does your ideal Monday morning look like?",
  "Where are you seeking validation from others instead of building it yourself?",
  "What's the hardest conversation you've been putting off?",
  "If you couldn't fail, what would you build in the next year?",
  "What does 'being a man' mean to you — not what you were told, but what you believe?",
  "What do you need less of in your life? What do you need more of?",
  "Where is your discipline strongest? Where is it weakest?",
  "What would you tell your 15-year-old self that you wish someone had told you?",
  "What chapter of your life are you in right now, and is it one you want to be in?",
  "If you only had one year left, how would you spend it differently than today?",
];

export function getDailyPrompt(date: string): string {
  const d = new Date(date);
  const index = (d.getDate() + d.getMonth() * 31) % JOURNAL_PROMPTS.length;
  return JOURNAL_PROMPTS[index];
}
