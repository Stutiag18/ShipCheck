import { LLMClient, LLMRequest, LLMResponse } from "@/types/llm";

/**
 * Demo client that returns realistic mock responses when no API keys are configured.
 * This allows the app to work out of the box for testing/demo purposes.
 */
export function createDemoClient(): LLMClient {
  return {
    provider: "gemini",
    async generate(request: LLMRequest): Promise<LLMResponse> {
      // Add small delay to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

      const text = generateDemoResponse(request.prompt);
      return { text, provider: "gemini", model: "demo-mode" };
    },
  };
}

function generateDemoResponse(prompt: string): string {
  // Detect what type of response is needed based on prompt content
  if (prompt.includes("Analyze the following content and identify")) {
    return JSON.stringify(getDemoContentAnalysis(prompt));
  }

  if (prompt.includes("Generate exactly 5 personas")) {
    return JSON.stringify(getDemoPersonas(prompt));
  }

  if (prompt.includes("Evaluate this content from your unique perspective")) {
    return JSON.stringify(getDemoAgentFeedback(prompt));
  }

  if (prompt.includes("synthesize all feedback")) {
    return JSON.stringify(getDemoSynthesis());
  }

  return '{"error": "Unknown prompt type"}';
}

function getDemoContentAnalysis(prompt: string) {
  const content = prompt.toLowerCase();

  // Detect content type based on keywords in the actual content
  if (content.includes("instagram") || content.includes("caption") || content.includes("reel") || content.includes("hashtag")) {
    return {
      contentType: "social media post (Instagram)",
      targetAudience: "Young professionals and lifestyle enthusiasts aged 22-35 who engage with visual content",
      tone: "casual and aspirational",
      intent: "drive engagement and grow following",
    };
  }
  if (content.includes("tweet") || content.includes("thread") || content.includes("ratio") || content.includes("twitter") || content.includes("x.com")) {
    return {
      contentType: "social media post (Twitter/X)",
      targetAudience: "Tech-savvy professionals and opinion-sharers who value concise, witty takes",
      tone: "punchy and opinionated",
      intent: "spark conversation and build personal brand",
    };
  }
  if (content.includes("linkedin") || content.includes("hiring") || content.includes("career") || content.includes("professional")) {
    return {
      contentType: "LinkedIn post",
      targetAudience: "Mid-career professionals and hiring managers in B2B industries",
      tone: "professional yet personable",
      intent: "establish thought leadership and drive professional engagement",
    };
  }
  if (content.includes("subject:") || content.includes("dear") || content.includes("unsubscribe") || content.includes("email")) {
    return {
      contentType: "marketing email",
      targetAudience: "Existing customers and warm leads who opted into communications",
      tone: "persuasive and direct",
      intent: "drive clicks and conversions from email subscribers",
    };
  }
  if (content.includes("buy") || content.includes("price") || content.includes("discount") || content.includes("limited") || content.includes("shop") || content.includes("offer")) {
    return {
      contentType: "sales copy / advertisement",
      targetAudience: "Price-conscious consumers actively considering a purchase decision",
      tone: "urgent and benefit-driven",
      intent: "convert browsers into buyers",
    };
  }
  if (content.includes("poem") || content.includes("verse") || content.includes("stanza") || content.includes("rhyme")) {
    return {
      contentType: "creative writing (poetry)",
      targetAudience: "Literary readers and poetry enthusiasts who appreciate craft and emotion",
      tone: "lyrical and expressive",
      intent: "evoke emotion and showcase artistic voice",
    };
  }
  if (content.includes("chapter") || content.includes("story") || content.includes("fiction") || content.includes("character")) {
    return {
      contentType: "creative writing (fiction/narrative)",
      targetAudience: "Readers of contemporary fiction who enjoy character-driven storytelling",
      tone: "narrative and immersive",
      intent: "engage readers emotionally and sustain attention",
    };
  }
  if (content.includes("blog") || content.includes("seo") || content.includes("how to") || content.includes("guide") || content.includes("step")) {
    return {
      contentType: "blog post / how-to article",
      targetAudience: "Information seekers looking for practical guidance on a specific topic",
      tone: "informative and accessible",
      intent: "educate readers and drive organic search traffic",
    };
  }
  if (content.includes("youtube") || content.includes("video") || content.includes("thumbnail") || content.includes("subscribe")) {
    return {
      contentType: "YouTube script / video content",
      targetAudience: "Video consumers who prefer visual learning and entertainment",
      tone: "energetic and conversational",
      intent: "maximize watch time and subscriber growth",
    };
  }
  if (content.includes("landing") || content.includes("sign up") || content.includes("get started") || content.includes("free trial")) {
    return {
      contentType: "landing page copy",
      targetAudience: "Potential customers evaluating whether to try a product or service",
      tone: "benefit-focused and compelling",
      intent: "convert visitors into signups or leads",
    };
  }

  // Default: newsletter / thought leadership
  return {
    contentType: "newsletter / thought leadership",
    targetAudience: "Founders and product builders at early-stage startups who are shipping products and growing audiences",
    tone: "conversational and instructive",
    intent: "educate and build authority with the reader",
  };
}

function getDemoPersonas(prompt: string) {
  const content = prompt.toLowerCase();

  // Social media (Instagram)
  if (content.includes("instagram") || content.includes("social media post (instagram)")) {
    return [
      { name: "Aaliya", role: "Instagram Growth Strategist", background: "Grew 3 brand accounts past 500K with organic-only strategies", perspective: "algorithm-friendliness and engagement triggers", tone: "energetic and tactical" },
      { name: "Carlos", role: "Visual Brand Designer", background: "Art-directed campaigns for Nike, Glossier, and DTC brands", perspective: "visual coherence and brand storytelling", tone: "aesthetic-focused and candid" },
      { name: "Meghan", role: "Lifestyle Micro-Influencer", background: "15K engaged followers in wellness niche, 6% engagement rate", perspective: "authenticity and audience connection", tone: "relatable and honest" },
      { name: "Raj", role: "Social Media Manager at Agency", background: "Manages 12 client accounts across beauty, food, and travel verticals", perspective: "cross-platform best practices and scheduling", tone: "data-informed and practical" },
      { name: "Tamara", role: "Consumer Behavior Researcher", background: "PhD studying how Gen-Z interacts with branded social content", perspective: "psychological hooks and audience psychology", tone: "analytical but accessible" },
    ];
  }

  // Twitter/X
  if (content.includes("twitter") || content.includes("x.com") || content.includes("social media post (twitter")) {
    return [
      { name: "Derek", role: "Tech Twitter Personality", background: "50K followers built on hot takes about startups and developer culture", perspective: "virality and quote-tweet potential", tone: "sharp and provocative" },
      { name: "Nina", role: "Journalist & Fact-Checker", background: "10 years at Reuters, now runs an independent newsletter debunking misinformation", perspective: "accuracy, sourcing, and credibility", tone: "skeptical and precise" },
      { name: "Sam", role: "Community Builder", background: "Built three Discord communities from tweets, 80K combined members", perspective: "conversation-starting and community resonance", tone: "warm but strategic" },
      { name: "Kenji", role: "Copywriter (Short-Form Specialist)", background: "Wrote viral threads for founders and VCs, ex-agency creative", perspective: "word economy and hook strength", tone: "minimalist and blunt" },
      { name: "Fatima", role: "Political Comms Advisor", background: "Shaped messaging for campaigns and advocacy orgs across 3 election cycles", perspective: "framing, tone-deafness risks, and persuasion", tone: "measured and strategic" },
    ];
  }

  // LinkedIn
  if (content.includes("linkedin")) {
    return [
      { name: "Richard", role: "VP of Sales (Enterprise)", background: "20 years in B2B SaaS, posts weekly to 30K LinkedIn followers", perspective: "professional credibility and lead generation", tone: "corporate but human" },
      { name: "Ananya", role: "HR & Employer Branding Lead", background: "Built employer brand for three hypergrowth startups from 50 to 500 people", perspective: "talent attraction and culture signaling", tone: "enthusiastic and inclusive" },
      { name: "Trevor", role: "LinkedIn Cringe Critic", background: "Parody account with 45K followers mocking bad LinkedIn content", perspective: "authenticity vs. performative posting", tone: "sarcastic and unforgiving" },
      { name: "Mei", role: "Executive Coach", background: "Coaches C-suite leaders on thought leadership and public presence", perspective: "authority-building and strategic vulnerability", tone: "thoughtful and encouraging" },
      { name: "Omar", role: "Early-Career Software Engineer", background: "2 years out of bootcamp, actively job searching and networking on LinkedIn", perspective: "relatability and value to junior professionals", tone: "earnest and direct" },
    ];
  }

  // Email marketing
  if (content.includes("marketing email") || content.includes("email") || content.includes("subject:") || content.includes("unsubscribe")) {
    return [
      { name: "Claire", role: "Email Marketing Director", background: "Managed 2M+ subscriber lists for e-commerce brands, 40% open rate average", perspective: "deliverability, subject lines, and conversion funnels", tone: "data-driven and concise" },
      { name: "Rohan", role: "Spam-Weary Consumer", background: "Subscribes to 50+ newsletters but only opens 5 regularly", perspective: "inbox fatigue and what earns an open", tone: "impatient and selective" },
      { name: "Julia", role: "Copywriter (Direct Response)", background: "Wrote emails generating $2M+ in revenue for info-product launches", perspective: "persuasion mechanics and CTA clarity", tone: "punchy and sales-aware" },
      { name: "Kwame", role: "Privacy & UX Advocate", background: "Built consent-first email flows, speaks at MarTech conferences", perspective: "trust, transparency, and reader respect", tone: "principled but practical" },
      { name: "Sasha", role: "Newsletter Creator (Indie)", background: "Runs a paid newsletter with 8K subscribers at $12/month", perspective: "retention, personality, and subscriber value", tone: "casual and opinionated" },
    ];
  }

  // Sales copy / ads
  if (content.includes("sales copy") || content.includes("advertisement") || content.includes("buy") || content.includes("discount")) {
    return [
      { name: "Victor", role: "Direct Response Copywriter", background: "25 years writing sales letters and landing pages, trained under Gary Halbert disciples", perspective: "headline power and objection handling", tone: "old-school and relentless" },
      { name: "Lena", role: "Consumer Psychologist", background: "Studies purchase decision-making at behavioral economics lab", perspective: "cognitive biases, trust signals, and friction points", tone: "scientific and insightful" },
      { name: "Jamal", role: "Skeptical Shopper", background: "Reads every review, checks 3 sites before buying anything over $30", perspective: "proof, credibility, and too-good-to-be-true detection", tone: "suspicious and demanding" },
      { name: "Mika", role: "E-Commerce Brand Strategist", background: "Built two DTC brands to 7 figures with paid ads and landing pages", perspective: "brand voice consistency and conversion rate", tone: "strategic and ROI-focused" },
      { name: "Dorothy", role: "Retired English Teacher", background: "55 years of reading, notices every grammar mistake and manipulative trick", perspective: "clarity, honesty, and respect for the reader's intelligence", tone: "no-nonsense and principled" },
    ];
  }

  // Blog / how-to
  if (content.includes("blog") || content.includes("how to") || content.includes("guide") || content.includes("step")) {
    return [
      { name: "Alex", role: "SEO Content Strategist", background: "Ranked 200+ articles on page 1 for competitive keywords across SaaS and finance", perspective: "search intent match, structure, and keyword usage", tone: "methodical and evidence-based" },
      { name: "Priya", role: "Technical Writer", background: "10 years documenting APIs and developer tools at FAANG companies", perspective: "accuracy, completeness, and logical flow", tone: "precise and structured" },
      { name: "Marcus", role: "Impatient Reader", background: "VP who skims 20 articles a week and bookmarks only 2", perspective: "scanability and instant value delivery", tone: "blunt and time-conscious" },
      { name: "Luna", role: "Junior Developer (Learner)", background: "Self-taught programmer 6 months into career switch, relies on blog tutorials", perspective: "beginner-friendliness and assumed knowledge gaps", tone: "eager but easily confused" },
      { name: "Frank", role: "Content Editor (Publications)", background: "Edited for Wired, The Verge, and multiple tech blogs", perspective: "narrative quality, originality, and editorial standards", tone: "rigorous and fair" },
    ];
  }

  // YouTube / video
  if (content.includes("youtube") || content.includes("video") || content.includes("script")) {
    return [
      { name: "Jake", role: "YouTube Creator (500K subs)", background: "Full-time creator for 4 years, specializes in educational tech content", perspective: "retention curves, pacing, and audience hook", tone: "enthusiastic and practical" },
      { name: "Simone", role: "Video Producer & Editor", background: "Edited for MrBeast-style channels, obsessed with the first 30 seconds", perspective: "visual storytelling and cut timing", tone: "fast-paced and visual" },
      { name: "Harold", role: "Viewer (Casual Consumer)", background: "Watches 2 hours of YouTube daily, rarely subscribes, just follows recommendations", perspective: "thumbnail-title match and whether he'd keep watching", tone: "honest and easily bored" },
      { name: "Tanya", role: "Brand Partnership Manager", background: "Connects creators with sponsors, evaluates content for brand safety", perspective: "sponsorability and audience demographics", tone: "business-minded and diplomatic" },
      { name: "Aiden", role: "Film School Graduate", background: "MFA in screenwriting, now applies narrative principles to short-form content", perspective: "story structure, character, and emotional arc", tone: "thoughtful and craft-focused" },
    ];
  }

  // Landing page
  if (content.includes("landing page") || content.includes("sign up") || content.includes("get started")) {
    return [
      { name: "Rachel", role: "Conversion Rate Optimizer", background: "Ran 500+ A/B tests on landing pages, avg 35% lift across clients", perspective: "clarity of value prop and friction reduction", tone: "experimental and data-first" },
      { name: "Devin", role: "UX Designer", background: "Designed onboarding flows for fintech and healthtech products", perspective: "user flow, visual hierarchy, and cognitive load", tone: "empathetic and systematic" },
      { name: "Noor", role: "First-Time Visitor (Target User)", background: "Matches the target audience, no prior knowledge of the product", perspective: "first impressions, confusion points, and trust signals", tone: "candid and unfiltered" },
      { name: "Patrick", role: "Startup Founder (Competitor)", background: "Launched 3 SaaS products, obsessively studies competitor positioning", perspective: "differentiation and market positioning", tone: "competitive and sharp" },
      { name: "Grace", role: "Accessibility Consultant", background: "Ensures digital products work for all users including those with disabilities", perspective: "readability, contrast, and inclusive design", tone: "thoughtful and advocacy-driven" },
    ];
  }

  // Creative writing
  if (content.includes("poetry") || content.includes("fiction") || content.includes("creative writing")) {
    return [
      { name: "Elena", role: "MFA Workshop Leader", background: "Published novelist, teaches creative writing at Iowa Writers' Workshop", perspective: "craft, voice, and originality", tone: "encouraging but rigorous" },
      { name: "Desmond", role: "Spoken Word Poet", background: "National slam champion, performs to audiences of 500+", perspective: "rhythm, emotional impact, and performability", tone: "passionate and visceral" },
      { name: "Margaret", role: "Literary Book Reviewer", background: "Reviews for Paris Review and Kirkus, reads 100+ books per year", perspective: "literary merit and contribution to the form", tone: "intellectual and exacting" },
      { name: "Tyler", role: "Casual Reader", background: "Reads on his commute, prefers books that grab him in the first page", perspective: "accessibility and emotional pull", tone: "straightforward and impatient" },
      { name: "Yuki", role: "Translator & Multilingual Writer", background: "Translates literature between Japanese and English, sensitive to cultural nuance", perspective: "universality and cultural specificity of expression", tone: "gentle and observant" },
    ];
  }

  // Default: newsletter / thought leadership
  return [
    { name: "Marcus", role: "Growth Marketing Director", background: "12 years scaling content strategies for SaaS companies from Series A to IPO", perspective: "conversion-focused clarity and audience targeting", tone: "direct and metrics-driven" },
    { name: "Priya", role: "UX Writer & Content Designer", background: "Led content design at two major consumer apps, obsessed with readability", perspective: "user-centric readability and information hierarchy", tone: "warm but precise" },
    { name: "James", role: "Retired Journalism Professor", background: "30 years teaching writing craft at Columbia, former NYT editor", perspective: "narrative structure and prose quality", tone: "scholarly but approachable" },
    { name: "Zoe", role: "Gen-Z Content Creator", background: "Built a 200K following creating educational content on TikTok and newsletters", perspective: "engagement, relatability, and scroll-stopping hooks", tone: "casual and blunt" },
    { name: "David", role: "Technical Product Manager", background: "8 years translating complex technical concepts into business value propositions", perspective: "technical accuracy and actionability", tone: "analytical and constructive" },
  ];
}

function getDemoAgentFeedback(prompt: string) {
  // Extract persona name and role from prompt to vary feedback
  const nameMatch = prompt.match(/You are (\w+)/);
  const name = nameMatch?.[1] || "Agent";

  // Generate varied scores and feedback using persona name as seed
  const seed = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const score = 4 + (seed % 5) + (seed % 2); // Range: 4-9

  const reactions = [
    "There's real potential here but the execution needs sharpening. The core idea lands, but the delivery dilutes the impact.",
    "I see what you're going for and it mostly works. A few structural tweaks would make this significantly more effective.",
    "This has moments of brilliance buried under some unnecessary clutter. Strip it back and the strong parts will shine.",
    "Solid effort — it's clear you understand your audience. The gap is between good and great, and it's fixable.",
    "I'd give this a B+. The thinking is right, the angle is interesting, but the craft needs another pass.",
    "First impression: interesting but uneven. Some sections punch hard while others feel like filler.",
    "You've clearly put thought into this. My concern is whether the reader will put equal thought into reading it.",
    "The content itself has value. The packaging — how it's structured and delivered — is what's holding it back.",
  ];

  const strengthOptions = [
    "Authentic voice that feels human and trustworthy. The core message is clear and the examples are specific enough to be useful.",
    "Strong opening premise that earns attention. Good balance between being informative and being engaging.",
    "The perspective is fresh — not the same recycled advice everyone else gives. Key points are well-supported with evidence.",
    "Clear understanding of the audience's pain points. The content addresses real needs rather than assumed ones.",
    "Good information density without being overwhelming. Each paragraph earns its place and moves the piece forward.",
  ];

  const improvementOptions = [
    "The structure needs work — key points get lost in dense paragraphs. Break it up with clearer sections and transitions.",
    "The opening doesn't match the quality of the rest. It needs a stronger hook that creates immediate curiosity or urgency.",
    "Too much telling, not enough showing. Replace abstract claims with concrete examples, numbers, or mini-stories.",
    "The ending fizzles out. It needs either a clear call-to-action, a memorable closing line, or a thought-provoking question.",
    "Some sections feel like they're written for you rather than for the reader. Every line should pass the 'why should they care?' test.",
  ];

  const suggestionOptions = [
    "Cut 20-30% of the word count. Every sentence should either inform, persuade, or entertain — ideally two at once.",
    "Add one specific, concrete example in the first 50 words. Ground the abstract in something tangible immediately.",
    "Restructure around 3 clear takeaways the reader can act on today. Make them scannable and memorable.",
    "Read it aloud. Mark every place where you stumble or lose energy — those are your edit points.",
    "Ask yourself: if someone only reads the first and last sentence of each paragraph, do they still get the message?",
  ];

  return {
    score,
    reaction: reactions[seed % reactions.length],
    strengths: strengthOptions[seed % strengthOptions.length],
    improvements: improvementOptions[seed % improvementOptions.length],
    suggestions: suggestionOptions[seed % suggestionOptions.length],
  };
}

function getDemoSynthesis() {
  return {
    summary: "The content demonstrates authentic voice and solid topical insight, but is held back by structural issues, a weak opening hook, and lack of clear actionable takeaways. With targeted editing focusing on information hierarchy and a stronger call-to-action, this could perform significantly better.",
    overallScore: 6.4,
    strengths: "- Authentic, distinctive voice that stands out from generic AI content\n- Strong core insights with practical value for the target audience\n- Good use of specific examples that ground abstract advice\n- Appropriate vocabulary level that avoids both oversimplification and jargon",
    improvements: "- Opening hook is too weak to stop scrollers - needs a pattern interrupt or bold claim\n- Dense paragraph structure hurts readability on mobile (where most content is consumed)\n- Lacks a clear organizing framework that aids retention\n- Call-to-action is vague or missing entirely",
    actionItems: "1. Rewrite the opening line with a surprising stat, contrarian take, or direct question that creates curiosity\n2. Break all paragraphs longer than 3 sentences and add subheadings every 200-300 words\n3. Create a simple framework (numbered list, acronym, or mental model) that organizes your key points\n4. Add 1-2 supporting data points or brief case studies to build credibility\n5. End with a single, specific call-to-action that tells the reader exactly what to do next",
    rewrite: null,
  };
}
