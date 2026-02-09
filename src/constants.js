export const about = {
  name: "Milind Nair",
  role: "Full Stack Developer & UI/UX Enthusiast",
  description: "I build full-stack web applications with a focus on modern user interfaces and robust backend systems. Let's build something amazing together.",
  bio: [
    "I'm a Full Stack Developer with a knack for crafting seamless digital experiences. My passion lies in bridging the gap between elegant design and robust engineering. With a strong foundation in both front-end aesthetics and back-end logic, I enjoy tackling complex problems and turning them into intuitive, user-friendly solutions.",
    "Beyond the code, I'm an avid learner who stays on top of the latest tech trends. Whether it's experimenting with new frameworks, optimizing web performance, or contributing to open-source projects, I'm always looking for ways to grow and improve. When I'm offline, you can catch me exploring the outdoors or brewing the perfect cup of coffee."
  ],
  skills: [
    "React", "Node.js", "TypeScript", "Python", "GraphQL", 
    "Material UI", "Docker", "AWS", "Git"
  ],
  email: "nairmilind3@gmail.com",
  location: "Bengaluru, India",
  social: {
    github: "https://github.com/milind-nair",
    linkedin: "https://linkedin.com/in/milind-nair",
    twitter: "https://twitter.com"
  },
  experiences: [
    {
      company: "Tech Innovators Inc",
      role: "Senior Full Stack Engineeer",
      duration: "2023 - Present",
      description: "Leading a team of 5 developers to build cloud-native applications. Improved system performance by 40%."
    },
    {
      company: "Web Solutions Ltd",
      role: "Full Stack Developer",
      duration: "2021 - 2023",
      description: "Developed and maintained multiple client-facing e-commerce platforms using React and Node.js."
    }
  ],
  blogs: [
    {
        title: "Understanding React Server Components",
        image: "https://miro.medium.com/v2/resize:fit:1400/1*C97L3d8Jc4w5g2P7v3a5pA.png", // Example React image
        link: "https://medium.com/",
        date: "Dec 12, 2024",
        readTime: "5 min read",
        snippet: "A deep dive into how RSCs are changing the way we build web applications."
    },
    {
        title: "Optimizing Web Performance in 2024",
        image: "https://miro.medium.com/v2/resize:fit:1400/0*y6hK9p7p5q2r3s8t.jpg", // Placeholder
        link: "https://medium.com/",
        date: "Nov 28, 2024",
        readTime: "8 min read",
        snippet: "Key strategies for reducing bundle size and improving Core Web Vitals."
    },
    {
        title: "The Future of AI in Software Development",
        image: "https://miro.medium.com/v2/resize:fit:1400/1*uJ2w_8f8f8j8j8.png", // Placeholder
        link: "https://medium.com/",
        date: "Oct 15, 2024",
        readTime: "6 min read",
        snippet: "Exploring how LLMs are augmenting the developer workflow, not replacing it."
    }
  ]
};

export const projects = [
  {
    title: "E-Commerce Dashboard",
    description: "A comprehensive dashboard for managing online stores, featuring real-time analytics, inventory management, and order tracking.",
    tags: ["React", "Material UI", "Recharts"],
    image: "https://source.unsplash.com/random/800x600?tech,dashboard",
    codeUrl: "",
    demoUrl: "",
    details: {
      summary: "Operations dashboard for store owners with real-time visibility into sales, inventory, and fulfillment.",
      role: "Full stack developer",
      impact: "Reduced manual reporting and enabled faster inventory decisions.",
      stack: ["React", "Material UI", "Node.js", "PostgreSQL"],
      features: [
        "Live sales and revenue KPIs",
        "Inventory alerts and reorder thresholds",
        "Order status tracking and fulfillment workflow"
      ],
      challenges: [
        "Efficient aggregation of large order datasets",
        "Consistent real-time updates without UI jitter"
      ],
      architecture: "Event-driven updates from the order service feed a reporting pipeline cached for fast dashboard reads."
    }
  },
  {
    title: "Social Media App",
    description: "A fully functional social media application with real-time messaging, post feeds, and user authentication.",
    tags: ["Node.js", "Socket.io", "MongoDB"],
    image: "https://source.unsplash.com/random/800x600?tech,social",
    codeUrl: "",
    demoUrl: "",
    details: {
      summary: "Real-time social app with messaging, feeds, and engagement features.",
      role: "Full stack developer",
      impact: "Improved engagement with instant notifications and messaging.",
      stack: ["Node.js", "Socket.io", "MongoDB", "React"],
      features: [
        "Real-time chat and typing indicators",
        "Personalized feed and reactions",
        "User authentication and profiles"
      ],
      challenges: [
        "Scaling WebSocket connections",
        "Delivering low-latency notifications"
      ],
      architecture: "WebSocket gateway handles real-time traffic while REST APIs manage content and profiles."
    }
  },
  {
    title: "Task Management Tool",
    description: "A productivity tool inspired by Trello, allowing users to organize tasks into boards and lists with drag-and-drop functionality.",
    tags: ["TypeScript", "React", "Redux"],
    image: "https://source.unsplash.com/random/800x600?tech,app",
    codeUrl: "",
    demoUrl: "",
    details: {
      summary: "Kanban-style task manager with boards, lists, and drag-and-drop interactions.",
      role: "Front-end developer",
      impact: "Streamlined team planning with clear task ownership and priorities.",
      stack: ["TypeScript", "React", "Redux", "Dnd Kit"],
      features: [
        "Drag-and-drop tasks across columns",
        "Board templates and quick add",
        "Due dates and priority tags"
      ],
      challenges: [
        "Maintaining state consistency during drag events",
        "Optimizing rendering for large boards"
      ],
      architecture: "State normalized in Redux with memoized selectors to keep drag updates fast."
    }
  },
  {
    title: "Portfolio Website",
    description: "This very website! Built to showcase my projects and skills with a focus on clean design and performance.",
    tags: ["React", "MUI", "Portfolio"],
    image: "https://source.unsplash.com/random/800x600?tech,code",
    codeUrl: "",
    demoUrl: "",
    details: {
      summary: "Personal portfolio with recruiter and developer modes for tailored content depth.",
      role: "Designer and developer",
      impact: "Clearer storytelling for both technical and non-technical audiences.",
      stack: ["React", "MUI", "JavaScript"],
      features: [
        "Recruiter and developer view modes",
        "Project highlights with focused CTAs",
        "Responsive layout with dark mode"
      ],
      challenges: [
        "Balancing visual polish with fast load times",
        "Presenting dense technical info without overwhelm"
      ],
      architecture: "Single-page layout with shared theme tokens and reusable section components."
    }
  }
];
