export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  content: {
    id: string;
    heading: string;
    paragraphs: string[];
  }[];
};

export const DEVELOPING_TASTE: BlogPost = {
  slug: "developing-taste",
  title: "Developing Taste",
  date: "July 2026",
  content: [
    {
      id: "intro",
      heading: "Developing Taste",
      paragraphs: [
        "\"The more often users see an animation, interaction, or visual effect, the less special it feels.\"",
        "On the contrary, it could feel annoying sometimes or overwhelm users with a lot of things happening at once. Save your WOW moments for the right place and the right time instead of using them everywhere."
      ]
    },
    {
      id: "novelty",
      heading: "Novelty",
      paragraphs: [
        "Novelty means something new, unexpected, different, or surprising. You could add some WOW factor that is novel and hasn't been seen before.",
        "Novelty creates a feeling of WOW, but humans cannot keep saying \"WOW\" forever. Eventually, the brain says \u2014 \"Yeah, I have seen it already.\""
      ]
    },
    {
      id: "semantic-satiation",
      heading: "Semantic Satiation",
      paragraphs: [
        "Listen to a song 30 times or 300 times. At first, you might like it. You will feel amazing.",
        "After some time, it would still feel good, but not as amazing as before. After 300 times, whatever feeling it gave you starts to fade."
      ]
    },
    {
      id: "every-animation-has-a-cost",
      heading: "Every Animation Has a Cost",
      paragraphs: [
        "Imagine opening Instagram where every button bounced, rotated, glowed, scaled, blurred, etc. Would it feel premium? No. It would feel exhausting.",
        "Your brain has to process every movement. Some movements will attract your attention, but if everything tries to attract your attention, nothing gets it.",
        "\"Remember, movement attracts attention, but if everything attracts attention, nothing attracts attention.\""
      ]
    },
    {
      id: "novelty-is-like-salt",
      heading: "Novelty Is Like Salt",
      paragraphs: [
        "Imagine making food. Salt makes food taste good. But if we add 10\u00d7 more salt, the food becomes terrible. Animations are like salt.",
        "\"Novelty is like seasoning, not the meal.\""
      ]
    },
    {
      id: "why-familiarity-feels-good",
      heading: "Why Familiarity Feels Good",
      paragraphs: [
        "Imagine you went to a gathering of people. You would try to find familiar faces \u2014 your friends or family. The human mind likes familiarity. When something is completely new, it can feel anxious.",
        "Imagine a login button. Everyone knows what it looks like. Now imagine someone redesigns it so it spins twice, jumps, explodes, then transforms into a cube.",
        "It might be technically impressive, but practically annoying. Users don't want to relearn basic interactions again. They want to finish their task."
      ]
    },
    {
      id: "the-rule-of-thumb-you-should-follow",
      heading: "The Rule of Thumb You Should Follow",
      paragraphs: [
        "90% familiar, 10% novel. Imagine an application with 100 interactions \u2014 90 should feel familiar, and 10 should feel magical.",
        "\"Because those magical movements stay memorable.\""
      ]
    },
    {
      id: "color-theory",
      heading: "Color Theory",
      paragraphs: [
        "Movies don't use every color equally \u2014 60% main color, 30% supporting color, 10% accent color. A movie scene may mostly be blue walls and gray furniture. Then there's an orange jacket. Your eyes immediately go there.",
        "If the whole movie were orange, nothing would stand out. The same goes for UI. Contrast creates beauty.",
        "Imagine two websites. Website A: everything is animated, everything glows, everything moves, everything rotates. Within a minute, your brain gets overstimulated.",
        "Website B: 90% is static. The only animation happens after finishing checkout. The movement feels important because everything else stayed calm."
      ]
    },
    {
      id: "references",
      heading: "References",
      paragraphs: [
        "Inspired by Rauno's excellent craft log on Novelty: https://rauno.me/craft/novelty"
      ]
    }
  ]
};

export const ALL_POSTS = [DEVELOPING_TASTE];
