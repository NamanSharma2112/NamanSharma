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

export const POSTGRESQL_RLS: BlogPost = {
  slug: "postgresql-row-level-security",
  title: "What is PostgreSQL Row-Level Security (RLS)?",
  date: "August 2026",
  content: [
    {
      id: "rls-what",
      heading: "What is PostgreSQL Row-Level Security (RLS)?",
      paragraphs: [
        "Imagine you have a database with 1,000 users, but each user should only be able to see their own data. User 1 can see User 1's posts, User 2 can see User 2's posts, and so on.",
        "You could handle this in your backend code, but there is always a chance that a developer forgets to add the correct filter.",
        "This is where PostgreSQL Row-Level Security (RLS) comes in. RLS is a PostgreSQL feature that lets you control which rows a user can see, insert, update, or delete. Think of it as a security filter inside the database."
      ]
    },
    {
      id: "rls-importance",
      heading: "Why is RLS Important?",
      paragraphs: [
        "Normally, your application might do something like: SELECT * FROM posts WHERE user_id = 10. The problem is that every query needs to remember this rule.",
        "If a developer accidentally writes SELECT * FROM posts, they might expose everyone's posts.",
        "With RLS, PostgreSQL can enforce the rule automatically. So even if the application asks for SELECT * FROM posts, PostgreSQL can return only the rows the user is allowed to access."
      ]
    },
    {
      id: "rls-example",
      heading: "A Small Example",
      paragraphs: [
        "Let's create a simple table: CREATE TABLE posts (id SERIAL PRIMARY KEY, user_id INT, title TEXT). Then add some data for different users.",
        "Without RLS, a user could potentially query SELECT * FROM posts and see everything. But first, we enable Row-Level Security: ALTER TABLE posts ENABLE ROW LEVEL SECURITY.",
        "That's it. RLS is now enabled for this table. But we still need to tell PostgreSQL what users are allowed to do. That's where policies come in."
      ]
    },
    {
      id: "rls-policy",
      heading: "What is an RLS Policy?",
      paragraphs: [
        "A policy is basically a rule. For example: \"Users can only see posts that belong to them.\"",
        "We can write: CREATE POLICY \"Users can see their own posts\" ON posts FOR SELECT USING (user_id = current_user_id()).",
        "The important part is USING (user_id = current_user_id()). It means: only allow rows where the user_id matches the current user. So if the current user is 1, they'll only see their own posts."
      ]
    },
    {
      id: "rls-select",
      heading: "SELECT: Controlling What Users Can See",
      paragraphs: [
        "SELECT controls reading data. A policy like USING (user_id = current_user_id()) ensures each user only sees their own rows.",
        "This is useful for things like user profiles, private messages, personal tasks, orders, and documents."
      ]
    },
    {
      id: "rls-insert",
      heading: "INSERT: Controlling What Users Can Create",
      paragraphs: [
        "Now imagine a user tries to create a post. We don't want User 1 to create a post pretending that it belongs to User 2.",
        "We can use WITH CHECK (user_id = current_user_id()) to validate that the new row's user_id matches the current user.",
        "If the current user is 1 but tries to insert a row with user_id = 2, the database rejects it — because 1 ≠ 2."
      ]
    },
    {
      id: "rls-using-vs-check",
      heading: "USING vs WITH CHECK",
      paragraphs: [
        "This is one of the most important concepts in RLS.",
        "USING checks existing rows. It asks: \"Can this user access this row?\" It's commonly used for SELECT, UPDATE, and DELETE.",
        "WITH CHECK checks new or modified rows. It asks: \"Is this new row allowed?\" It's commonly used for INSERT and UPDATE.",
        "A simple way to remember: USING → Can I access this row? WITH CHECK → Can I create or change this row?"
      ]
    },
    {
      id: "rls-update-delete",
      heading: "UPDATE and DELETE Examples",
      paragraphs: [
        "For UPDATE, we use both USING and WITH CHECK. USING ensures users can only update their own posts, and WITH CHECK ensures they can't change the user_id to another user's ID.",
        "For DELETE, we only use USING (user_id = current_user_id()). User 1 can delete User 1's post, but cannot delete User 2's post."
      ]
    },
    {
      id: "rls-saas",
      heading: "A Real-World Example: SaaS",
      paragraphs: [
        "RLS becomes especially useful when building SaaS applications. Imagine you have a project management app used by multiple companies.",
        "Company 100 should not see Company 200's projects. A policy like USING (organization_id = current_organization_id()) ensures both companies can use the same database and same table, while RLS keeps their data separated."
      ]
    },
    {
      id: "rls-security",
      heading: "RLS and Application Security",
      paragraphs: [
        "Without RLS, your backend has to remember to protect every query. With RLS, the database itself enforces the rules.",
        "Even if someone accidentally writes SELECT * FROM projects, the RLS policy can still prevent unauthorized rows from being returned. This gives you an additional layer of protection."
      ]
    },
    {
      id: "rls-auth",
      heading: "RLS Doesn't Replace Authentication",
      paragraphs: [
        "RLS is mainly about authorization. Authentication asks: \"Who are you?\" Authorization asks: \"What are you allowed to access?\"",
        "Your application still needs a way to authenticate users and provide PostgreSQL with the correct user or organization context."
      ]
    },
    {
      id: "rls-complexity",
      heading: "RLS Can Get Complicated",
      paragraphs: [
        "RLS is powerful, but large applications can have many policies. Access to a task might depend on the organization, the team, the project ownership, or admin status.",
        "At this point, your RLS policies can become complex. That's why it's important to keep your authorization model simple and well documented."
      ]
    },
    {
      id: "rls-cheatsheet",
      heading: "Quick Cheat Sheet",
      paragraphs: [
        "ENABLE ROW LEVEL SECURITY turns RLS on. CREATE POLICY creates a security rule. SELECT controls reading. INSERT controls creating. UPDATE controls modifying. DELETE controls deleting.",
        "USING controls which existing rows are accessible. WITH CHECK controls which new or changed rows are allowed. ALL applies to all supported operations."
      ]
    },
    {
      id: "rls-final",
      heading: "Final Thoughts",
      paragraphs: [
        "PostgreSQL Row-Level Security is basically a security layer inside your database. Instead of relying completely on application code, you can tell PostgreSQL: \"This user can only access these rows.\"",
        "The most important things to remember are: USING → Can this user access this row? WITH CHECK → Can this user create or modify this row?",
        "If you're building a multi-user or multi-tenant application with PostgreSQL, RLS is definitely worth learning. It's one of those PostgreSQL features that looks small at first, but becomes extremely useful when you're building real production systems."
      ]
    }
  ]
};

export const ALL_POSTS = [POSTGRESQL_RLS, DEVELOPING_TASTE];
