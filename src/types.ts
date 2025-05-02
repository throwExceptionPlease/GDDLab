export type ModuleTeams = ModuleTeam[];

export type ModuleTeam = {
    teamName: string,
    // prm: string,
    teamMembers: string[], //need to change to Student[]
    teamImage: string,
    tasks: Task[],
    id?: string
};

export type BugForm = {
    name: string,
    email: string,
    moduleTeam: string,
    bugDesc: string,
    bugTitle: string,
    bugLink: string,
    priority: Priority | null,
    targetDate: Date | null,
    bugLocation: string
};

export type RequestForm = {
    name: string,
    email: string,
    moduleTeam: string,
    assetType: string,
    assetDesc: string,
    assetTitle: string,
    assetLink: string,
    priority: Priority | null,
    targetDate: Date | null
};

export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
}

export type Student = {
    firstName: string,
    lastName: string,
    moduleTeam: ModuleTeam | null,
    email: string,
    password: string,
    prm: boolean,
    uid: number,
    id?: string
}

export type Admin = {
    firstName: string,
    lastName: string,
    moduleTeam: ModuleTeam,
    email: string,
    password: string,
    birthday: Date | null,
    isAdmin: "true"
}

export type Task = {
    priority: Priority | null,
    desc: string,
    title: string,
    dueDate: Date | null,
    assignees: Student[] | null,
    attachments: {
        url: string,
    }[], 
    taskType: "Bug" | "Feature" | "Task",
    id?: string //need to make this permanent
}