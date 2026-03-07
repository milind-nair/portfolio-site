export const about = {
  name: "Milind Nair",
  role: "Senior Software Engineer | Full-Stack Developer",
  description: "I build production backend systems and user-facing web applications, with a strong focus on API design, developer tooling, and reliable delivery.",
  bio: [
    "I am a full-stack software engineer currently working at Arcesium (D. E. Shaw Group), where I work on API platform initiatives across Java, Python, and C#. My experience spans distributed backend systems, SDK and developer experience improvements, and cloud-native CI/CD workflows.",
    "I also build open-source tools on GitHub and write about software engineering topics on Medium. My interests include building practical developer tooling, improving system reliability, and turning complex technical ideas into clear, usable solutions."
  ],
  skills: [
    "Java",
    "Python",
    "C#",
    "TypeScript",
    "React",
    "Next.js",
    "Spring Boot",
    "Node.js",
    "Express",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "Kubernetes",
    "GitLab CI/CD"
  ],
  email: "nairmilind3@gmail.com",
  location: "Bengaluru, India",
  social: {
    github: "https://github.com/milind-nair",
    linkedin: "https://www.linkedin.com/in/milind-nair/",
    medium: "https://medium.com/@nairmilind3"
  },
  experiences: [
    {
      company: "Arcesium (D. E. Shaw Group)",
      role: "Senior Software Engineer - API Experience Team",
      duration: "Jan 2026 - Present",
      description: "Leading API platform initiatives across Java, Python, and C#, focused on developer experience, consistency, and reliability."
    },
    {
      company: "Arcesium",
      role: "Software Development Engineer",
      duration: "Jul 2024 - Dec 2025",
      description: "Standardized DateTime serialization across Java, Python, and C# (40% fewer timestamp defects), built LLM-driven unit test generation, and developed distributed rate-limiting for p99 latency stability."
    },
    {
      company: "Arcesium",
      role: "SDE Intern",
      duration: "Jan 2024 - Jun 2024",
      description: "Reduced CI/CD pipeline time by 70% through parallelization and workflow redesign, and implemented cross-language SDK contract validation."
    },
    {
      company: "Arcesium",
      role: "Summer Intern",
      duration: "Summer 2023",
      description: "Built an internal full-stack tool using React (TypeScript), Spring Boot, and Node.js."
    }
  ],
  blogs: [
    {
        title: "The Quick Call Tax: Why Your Open Office is Killing Real Work",
        image: "",
        link: "https://nairmilind3.medium.com/the-quick-call-tax-why-your-open-office-is-killing-real-work-c2d06ef7fd02",
        date: "Jan 2, 2026",
        readTime: "5 min read",
        snippet: "A practical breakdown of how frequent ad-hoc calls fragment deep work and what teams can do to preserve focused engineering time."
    },
    {
        title: "Why You Probably Don't Need MCPs (Yet)",
        image: "",
        link: "https://nairmilind3.medium.com/why-you-probably-dont-need-mcps-yet-441fc731ef6c",
        date: "Sep 4, 2025",
        readTime: "4 min read",
        snippet: "A grounded take on model context protocols and why many teams should prioritize fundamentals before introducing extra architecture."
    },
    {
        title: "Beyond the Sudoku: Why Most Coding Interviews Fail to Predict Job Performance",
        image: "",
        link: "https://nairmilind3.medium.com/beyond-the-sudoku-why-most-coding-interviews-fail-to-predict-job-performance-b8f59f009f0b",
        date: "Aug 18, 2025",
        readTime: "8 min read",
        snippet: "A critique of puzzle-heavy interviews and a case for hiring loops that better reflect real software engineering work."
    },
    {
        title: "How Computers Fake Randomness and Why It's Good Enough",
        image: "",
        link: "https://nairmilind3.medium.com/how-computers-fake-randomness-and-why-its-good-enough-3e77f2fd65f2",
        date: "Aug 14, 2025",
        readTime: "8 min read",
        snippet: "An accessible explanation of pseudo-randomness, determinism, and why PRNGs are sufficient for most engineering use cases."
    }
  ]
};

export const projects = [
  {
    title: "Mock Server Generator",
    description: "CLI tool to generate stateful mock servers from OpenAPI specifications, with hot reloading and traffic replay capabilities.",
    tags: ["Node.js", "OpenAPI", "Developer Tooling"],
    image: "https://source.unsplash.com/random/800x600?api,server",
    codeUrl: "",
    demoUrl: "",
    details: {
      summary: "Developer-focused CLI that accelerates API-first workflows by generating realistic mock APIs directly from OpenAPI specs.",
      role: "Project author and engineer",
      impact: "Reduced setup time for frontend and integration testing by enabling instant mock endpoints during development.",
      stack: ["Node.js", "OpenAPI", "JSON Schema Faker"],
      features: [
        "Stateful CRUD mock endpoints generated from OpenAPI",
        "Hot reloading during schema updates",
        "Traffic recording and replay for test scenarios"
      ],
      challenges: [
        "Generating realistic responses from varied schema patterns",
        "Maintaining state consistency across repeated requests"
      ],
      architecture: "CLI parses OpenAPI definitions into route handlers and schema-aware response builders, with in-memory state and request inspection support."
    }
  },
  {
    title: "UML Generator from Natural Language",
    description: "Python tool that converts natural language system descriptions into UML diagrams using LangChain and PlantUML.",
    tags: ["Python", "LangChain", "PlantUML"],
    image: "https://source.unsplash.com/random/800x600?uml,diagram",
    codeUrl: "",
    demoUrl: "",
    details: {
      summary: "NLP-assisted UML generation utility designed to speed up early design documentation from plain English input.",
      role: "Project author and engineer",
      impact: "Improved architecture documentation speed for early-stage designs and technical discussions.",
      stack: ["Python", "LangChain", "PlantUML"],
      features: [
        "Natural language to diagram conversion pipeline",
        "PlantUML output generation for easy rendering",
        "Packaged for reuse and distribution on PyPI"
      ],
      challenges: [
        "Mapping free-form prompts to structured UML semantics",
        "Improving prompt consistency for repeatable diagram quality"
      ],
      architecture: "Text input is interpreted through an LLM-driven prompt chain, normalized into diagram primitives, and emitted as PlantUML code."
    }
  },
  {
    title: "Spring Cron Expression Translator",
    description: "JavaScript library that translates Spring Cron expressions into human-readable text.",
    tags: ["JavaScript", "NPM", "Developer Tooling"],
    image: "https://source.unsplash.com/random/800x600?scheduler,time",
    codeUrl: "https://github.com/milind-nair/cron-expression-translator",
    demoUrl: "",
    details: {
      summary: "Library focused on making cron schedules understandable by converting six-field Spring cron expressions into plain English.",
      role: "Project author and maintainer",
      impact: "Improved readability of scheduler configurations in tools and developer workflows.",
      stack: ["JavaScript", "Babel", "Jest", "NPM"],
      features: [
        "Support for standard Spring cron field rules",
        "Simple programmatic API for frontend and backend use",
        "Published package with versioned releases"
      ],
      challenges: [
        "Handling edge cases in cron syntax parsing",
        "Keeping translated text concise and accurate"
      ],
      architecture: "Expression parser tokenizes each cron field and maps patterns to deterministic English sentence fragments."
    }
  },
  {
    title: "AutoSkip Intro",
    description: "Chrome extension that automatically skips intro scenes on OTT platforms like Netflix, Disney+ Hotstar, and Prime Video.",
    tags: ["JavaScript", "Chrome Extension", "Automation"],
    image: "https://source.unsplash.com/random/800x600?streaming,video",
    codeUrl: "https://github.com/milind-nair/AutoSkip-Intro",
    demoUrl: "",
    details: {
      summary: "Browser extension that detects and triggers skip-intro actions in supported streaming players.",
      role: "Project author and engineer",
      impact: "Saves repetitive viewing time by automating frequent manual skip actions.",
      stack: ["JavaScript", "Chrome Extensions API", "HTML"],
      features: [
        "Automatic intro skipping on supported OTT websites",
        "Simple install flow through Chrome developer mode",
        "Designed for lightweight runtime behavior"
      ],
      challenges: [
        "Handling differences in player UI behavior across platforms",
        "Ensuring reliable button detection timing"
      ],
      architecture: "Content scripts observe playback pages and trigger platform-specific skip actions when eligible controls are detected."
    }
  },
  {
    title: "Fashion AI Chatbot",
    description: "Conversational fashion outfit generator powered by Generative AI (Llama v2), with frontend and backend components.",
    tags: ["Python", "Generative AI", "JavaScript"],
    image: "https://source.unsplash.com/random/800x600?fashion,ai",
    codeUrl: "https://github.com/milind-nair/fashion-ai-chatbot",
    demoUrl: "https://milind-nair.github.io/fashion-ai-chatbot/",
    details: {
      summary: "Full-stack conversational assistant that suggests outfit ideas based on user preferences.",
      role: "Project author and engineer",
      impact: "Demonstrated practical application of GenAI for a consumer-facing recommendation experience.",
      stack: ["Python", "JavaScript", "HTML", "Llama v2"],
      features: [
        "Conversational outfit recommendation flow",
        "Frontend and backend split for modular development",
        "Hosted demo for quick experimentation"
      ],
      challenges: [
        "Balancing response quality with latency",
        "Structuring prompts for consistent recommendations"
      ],
      architecture: "Client UI interacts with backend inference logic that orchestrates prompt construction and model responses for outfit generation."
    }
  }
];
