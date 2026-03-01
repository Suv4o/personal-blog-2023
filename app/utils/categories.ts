export interface Category {
    tag: string;
    name: string;
    path: string;
    bgClass: string;
    textClass: string;
}

export const CATEGORIES: Category[] = [
    { tag: "Vue.js", name: "Vue.js", path: "/vuejs", bgClass: "bg-green", textClass: "text-white!" },
    { tag: "JavaScript", name: "JavaScript", path: "/javascript", bgClass: "bg-javascript", textClass: "text-secondary" },
    { tag: "FrontEnd", name: "Front End", path: "/frontend", bgClass: "bg-secondary", textClass: "text-white" },
    { tag: "Firebase", name: "Firebase", path: "/firebase", bgClass: "bg-firebase", textClass: "text-secondary" },
    { tag: "Node.js", name: "Node.js", path: "/nodejs", bgClass: "bg-node", textClass: "text-white" },
    { tag: "BackEnd", name: "Back End", path: "/backend", bgClass: "bg-backend", textClass: "text-white" },
    { tag: "CSS", name: "CSS", path: "/css", bgClass: "bg-css", textClass: "text-white" },
    { tag: "TypeScript", name: "TypeScript", path: "/typescript", bgClass: "bg-typescript", textClass: "text-white" },
    { tag: "Nest.js", name: "Nest.js", path: "/nestjs", bgClass: "bg-nestjs", textClass: "text-white" },
    { tag: "Nuxt.js", name: "Nuxt.js", path: "/nuxtjs", bgClass: "bg-nuxtjs", textClass: "text-green-light" },
    { tag: "VSCode", name: "VS Code", path: "/vscode", bgClass: "bg-vscode", textClass: "text-white" },
    { tag: "Vite", name: "Vite", path: "/vite", bgClass: "bg-vite", textClass: "text-white" },
    { tag: "AI", name: "AI", path: "/ai", bgClass: "bg-ai", textClass: "text-secondary" },
    { tag: "LangChain", name: "LangChain", path: "/langchain", bgClass: "bg-langchain", textClass: "text-secondary" },
    { tag: "Python", name: "Python", path: "/python", bgClass: "bg-python", textClass: "text-white" },
    { tag: "Nitro", name: "Nitro", path: "/nitro", bgClass: "bg-nitro", textClass: "text-black" },
    { tag: "React.js", name: "React.js", path: "/reactjs", bgClass: "bg-reactjs", textClass: "text-black" },
    { tag: "Hobby", name: "Hobby", path: "/hobby", bgClass: "bg-hobby", textClass: "text-white" },
    { tag: "Tech", name: "Tech", path: "/tech", bgClass: "bg-tech", textClass: "text-white" },
    { tag: "Entertainment", name: "Entertainment", path: "/entertainment", bgClass: "bg-entertainment", textClass: "text-black" },
    { tag: "AWS", name: "AWS", path: "/aws", bgClass: "bg-aws", textClass: "text-white" },
    { tag: "Other", name: "Other", path: "/other", bgClass: "bg-other", textClass: "text-white" },
    { tag: "Advice", name: "Advice", path: "/advice", bgClass: "bg-advice", textClass: "text-white" },
    { tag: "Productivity", name: "Productivity", path: "/productivity", bgClass: "bg-productivity", textClass: "text-white" },
    { tag: "DevOps", name: "DevOps", path: "/devops", bgClass: "bg-devops", textClass: "text-white" },
];

export const CATEGORIES_MAP = new Map(CATEGORIES.map((c) => [c.tag, c]));
