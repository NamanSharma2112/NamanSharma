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

export const SAMPLE_POST: BlogPost = {
  slug: "invisible-details",
  title: "Invisible Details of Interaction Design",
  date: "July 2023",
  content: [
    {
      id: "intro",
      heading: "Introduction",
      paragraphs: [
        "Design can feel like there's no science to it — only feel and intuition. Even researchers have trouble grounding interaction design practices in science, inherently treating them as a mysterious black box. While from my own experience that's partly true, I have been trying to deconstruct and dig out the why behind great displays of interaction design.",
        "Searching the Internet for depth on interaction design yields a plethora of recycled content obsessing over user personas, storyboards, and Venn diagrams labeled with 'UI' and 'UX'. Besides a few exceptional talks, actual substance and insight reveal themselves to those willing to fanatically dig for them. Either through studying obscure, long-winded research papers or by maniacally replaying hundreds of slow motion screen recordings.",
        "Sitting down and just thinking hard does not magically produce valuable discoveries either. The essence of the word 'interaction' implies a relationship between a human and an environment. In my experience, great revelations surface from making something — filling your headspace with a problem — and then going for a synthesising daydreaming walk to stir the pot.",
        "This essay is not a tutorial nor a collection of guidelines. But rather an observation on the invisible details of a few interactions that I use often but rarely think about. Besides recreating interfaces, I found this exercise in reflection to be another great way to build a stronger design intuition and vocabulary."
      ]
    },
    {
      id: "metaphors",
      heading: "Metaphors",
      paragraphs: [
        "A lot of interaction design is based on metaphors. We use folders on our desktop because we have folders in our physical offices. We use a trash can to delete files because we throw things away in real life. These metaphors help ground our understanding of digital space.",
        "But when do metaphors break down? When does a physical constraint limit a digital possibility? Sometimes we have to invent entirely new paradigms that have no real-world equivalent."
      ]
    },
    {
      id: "kinetic-physics",
      heading: "Kinetic Physics",
      paragraphs: [
        "Everything in the physical world has mass, and mass means momentum. If you throw a baseball, it doesn't just stop in mid-air. It follows a parabolic trajectory, decelerating due to friction and gravity.",
        "When designing digital interfaces, adding these subtle physical properties—like a spring simulation to a drawer opening, or a slight rubber-band effect when scrolling past the end of a list—makes the interface feel alive.",
        "It's not just about making things bounce. It's about respecting the user's input energy. A fast swipe should result in a fast scroll that takes longer to decelerate than a slow swipe."
      ]
    },
    {
      id: "swipe-gestures",
      heading: "Swipe Gestures",
      paragraphs: [
        "Swiping is perhaps the most native gesture on modern mobile devices. But a good swipe isn't just a binary trigger. It's a continuous, fluid motion that provides real-time feedback.",
        "Think about pulling to refresh. As you pull down, the resistance should increase, and the visual indicator should spin or stretch in proportion to your gesture. It's a dialogue between the user and the device."
      ]
    },
    {
      id: "fluid-morphing",
      heading: "Fluid Morphing",
      paragraphs: [
        "When an element on screen changes state, it shouldn't just vanish and reappear. It should morph. A small thumbnail expanding into a full-screen image should smoothly transition its bounds, corner radii, and position.",
        "This continuity helps the user maintain context. They never have to ask 'Where did that come from?' because they literally saw it travel from its origin to its destination."
      ]
    },
    {
      id: "closing-thoughts",
      heading: "Closing Thoughts",
      paragraphs: [
        "Interaction design is a craft of subtleties. The best interactions are the ones you don't even notice because they just feel right. They anticipate your needs, respect your input, and respond with grace.",
        "Next time you use your favorite app, pay attention to the invisible details. You might just learn something new."
      ]
    }
  ]
};

export const ALL_POSTS = [SAMPLE_POST];
