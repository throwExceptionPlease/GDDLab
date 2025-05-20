import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../api/firebase"; // adjust the path to your Firebase config
import { ModuleTeam, Priority, Student, Task } from "../types";
import styles from "./Test.module.css";
import { addTask, createModuleTeam, createUser, deleteUserByUid, deleteModuleTeam, getAllModuleTeams, getAllPRMS, getAllStudents, getAllTasks, getModuleTeamByName, getUserById, updateEmailById, updatePasswordById, deleteModuleTeamById } from "../api/database/functions";
import { create } from "domain";
import { deleteUser } from "firebase/auth";

const Test = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [uid, setuid] = useState("");
    const [moduleTeam, setModuleTeam] = useState<ModuleTeam | null>(null);
    const [moduleTeamOptions, setModuleTeamOptions] = useState<ModuleTeam[]>([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [prm, setPrm] = useState(false);

    const [moduleTeamName, setModuleTeamName] = useState(" ");

    const exampleStudent: Student = {
        firstName: "Jane",
        lastName: "Doe",
        moduleTeam: {
            teamName: "Infrastructure and Interface",
            teamMembers: [],
            teamImage: "",
            tasks: [],
            teamDesc: ""
        },
        email: "jdoe@umd.edu",
        prm: false,
        uid: 11889900
    }

    
    const examplePRM: Student = {
        firstName: "Jane2",
        lastName: "Doe2",
        moduleTeam: {
            teamName: "Infrastructure and Interface",
            teamMembers: [],
            teamImage: "",
            tasks: [],
            teamDesc: ""
        },
        email: "jdoe2@umd.edu",
        prm: true,
        uid: 1188911111
    }

    useEffect(() => {

    }, []);

    async function getTeamIDByName(teamName: string) {
        const teamQuery = query(
            collection(db, "ModuleTeams"),
            where("teamName", "==", teamName)  // Match by teamName
        );
        const querySnapshot = await getDocs(teamQuery);
    
        if (!querySnapshot.empty) {
            const teamDoc = querySnapshot.docs[0];  // This is a QueryDocumentSnapshot
            const teamRef = doc(db, "ModuleTeams", teamDoc.id);  // This is a DocumentReference
            return { teamDoc, teamRef };  // Return both document snapshot and reference
        }
        return null; // No team found
    }

    async function addStudentToTeam(student: Student, teamName: string) {
        // Fetch the team document and reference by teamName
        const teamData = await getTeamIDByName(teamName);
    
        if (!teamData) {
            console.error("Team not found");
            return;
        }
    
        const { teamDoc, teamRef } = teamData;
    
        try {
            // Access the teamMembers array from the teamDoc using .data()
            const teamMembers = teamDoc.data()?.teamMembers || [];
            
            // Add the student's UID to the teamMembers array
            await updateDoc(teamRef, {
                teamMembers: [...teamMembers, student],  // Add student UID to teamMembers
            });
    
            alert("Student added to team successfully!");
        } catch (error) {
            console.error("Error adding student to team:", error);
            alert("Failed to add student to team.");
        }
    }
    

    const addStudent = async () => {
        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !moduleTeam ||
            !email.trim()
        ) {
            alert("Please fill in all fields.");
            return;
        }

        const newStudent: Student = {
            firstName,
            lastName,
            moduleTeam,
            email,
            prm,
            uid: parseInt(uid)
        };

        try {
            await addDoc(collection(db, "Students"), newStudent);
            addStudentToTeam(newStudent, moduleTeam.teamName);

            alert("Student added successfully!");
            setFirstName("");
            setLastName("");
            setModuleTeam(null);
            setEmail("");
            setuid("");
            setPrm(false);
        } catch (error) {
            console.error("Error adding student:", error);
            alert("Failed to add student. Check console for details.");
        }
    };

    const groupOfStudents: Student[] = [
        {
            firstName: "Krishnan",
            lastName: "Tholkappian",
            moduleTeam: null,
            email: "ktholkap@terpmail.umd.edu",
            prm: true,
            uid: 119824122
        },
        {
            firstName: "Javon",
            lastName: "Lecky",
            moduleTeam: null,
            email: "jlecky@terpmail.umd.edu",
            prm: true,
            uid: 119788714
        },
        {
            firstName: "Jiun",
            lastName: "Park",
            moduleTeam: null,
            email: "park1105@terpmail.umd.edu",
            prm: true,
            uid: 119799376
        },
        {
            firstName: "Eugene",
            lastName: "Choi",
            moduleTeam: null,
            email: "echoi690@terpmail.umd.edu",
            prm: true,
            uid: 120093609
        },
        {
            firstName: "Justin",
            lastName: "Jones",
            moduleTeam: null,
            email: "jjonesy3@terpmail.umd.edu",
            prm: true,
            uid: 119720356
        },
        {
            firstName: "Rowan",
            lastName: "Kuske",
            moduleTeam: null,
            email: "rkuske@terpmail.umd.edu",
            prm: true,
            uid: 119798454
        },
        {
            firstName: "Rohan",
            lastName: "Tadisetty",
            moduleTeam: null,
            email: "rtadi99@terpmail.umd.edu",
            prm: true,
            uid: 119761076
        },
        {
            firstName: "Shirin",
            lastName: "Saberi",
            moduleTeam: null,
            email: "ssaberi@terpmail.umd.edu",
            prm: true,
            uid: 119768716
        },
        {
            firstName: "Ruth",
            lastName: "Whitehouse",
            moduleTeam: null,
            email: "rcwhite@terpmail.umd.edu",
            prm: true,
            uid: 119742907
        },
        {
            firstName: "Sabeen",
            lastName: "Kirwi",
            moduleTeam: null,
            email: "skirwi@terpmail.umd.edu",
            prm: true,
            uid: 119667835
        }
    ]

    const ModuleGroups: ModuleTeam[] = [
     {
        teamName: "Training & Knowledge Development",
        teamMembers: [],
        teamImage: "/assets/TrainingKnowledge.svg",
        tasks: [],
        teamDesc: "The purpose of this module is to make helpful and informative videos/media for the toolkit in order to make it easier for people to understand and use the tools."
     },
     {
        teamName: "Project Planning",
        teamMembers: [],
        teamImage: "/assets/projectplanning.svg",
        tasks: [],
        teamDesc: "The project planning module is about finding project planning and engineering tools that can be implemented into the toolkit. We perfect these tools for the toolkit, for development practitioners and policymakers."
     },
     {
        teamName: "Infrastructure and Interface",
        teamMembers: [],
        teamImage: "/assets/infint.svg",
        tasks: [],
        teamDesc: "This module will work on the GDD Toolkit and a ticketing system to ease collaboration with other modules to implement changes onto the toolkit. Regarding the toolkit, we will improve the current features and design of the toolkit, potentially creating new tools. Regarding the ticketing system, we will finish implementing the features present in the current version for use throughout the year. "
     },
     {
        teamName: "AI Development",
        teamMembers: [],
        teamImage: "/assets/aidev.jpg",
        tasks: [],
        teamDesc: "We will research, develop, and test an ethical AI model/chatbot that thinks like a development practitioner. This model will holistically evaluate global development projects and provide tailored, actionable business recommendations in a summative research proposal. Utilizes information from all the modules in the toolkit to inform the actionable recommendations."
     },
     {
        teamName: "Human Centered Design",
        teamMembers: [],
        teamImage: "/assets/hcdlogo.svg",
        tasks: [],
        teamDesc: "This purpose of this module is to enhance the designs of the toolkit by applying human centered design principles. This will be done by organizing focus groups to evaluate look, feel, and overall usability, ensuring user needs are met. "
     },
     {
        teamName: "Public Policy",
        teamMembers: [],
        teamImage: "/assets/publicpol.svg",
        tasks: [],
        teamDesc: "This purpose of this module is to analyze global public policy cases that actively promote pro-development strategies. Our goal is to identify policies that drive economic growth, social progress, and environmental sustainability while also ensuring equitable and ethical results. We will evaluate how well these initiatives promote growth related to the SDGs and Worthwhile Development."
     },
     {
        teamName: "Maldevelopment",
        teamMembers: [],
        teamImage: "/assets/maldevelopment.jpg",
        tasks: [],
        teamDesc: "This module examines maldevelopment in global policies, projects, and programs, emphasizing sustainable solutions to inefficiency. Through case studies, it explores policies that contradict the UN’s SDGs and Worthwhile Development Goals while identifying practical strategies for improvement."
     },
     {
        teamName: "AI Ethics",
        teamMembers: [],
        teamImage: "/assets/DevEthicsLogo.svg",
        tasks: [],
        teamDesc: "This module looks to fill the missing gap of intuitive morality in the AI landscape. AI learn from the information we provide it and if the data and algorithms we provide do not also include morality and ethical ideals then it will be lacking the humanity necessary to conduct adequate global development and design research."
     },
     {
        teamName: "Project Evaluation",
        teamMembers: [],
        teamImage: "/assets/ProjectEval.svg",
        tasks: [],
        teamDesc: "This module will research the process of measuring the success of a development project, program, or policy. We will be improving last semester’s iterations of the GDD Project Evaluation metric, by refining the mathematical methodology of our metric and making it more applicable to measure all kinds of projects in all kinds of settings (e.g., local and national projects, projects in developing and developed countries). "
     },
     {
        teamName: "Marketing and Outreach",
        teamMembers: [],
        teamImage: "/assets/marketing.png",
        tasks: [],
        teamDesc: "The purpose of this module is to appropriately market the toolkit, incentivizing its use by different organizations. Also, to serve as the primary form of outreach, enabling seamless communication with our counterparts in Africa and the National Science Foundation. We aim to provide innovative solutions to present-day global issues while promoting the stream itself."
     }
    ]

    function addGroupofStudents(students: Student[]) {
        for (let i = 0; i < students.length; i++) {
            createUser(students[i])
        }
    }

    function addGroupOfTeams(groups: ModuleTeam[]) {
        for (let i = 0; i < groups.length; i ++) {
            createModuleTeam(groups[i])
        }
    }

    const deleteExistingModulesInTest = () => {
        deleteModuleTeamById("RcdmUy99yMRHPaeOEgta")
        deleteModuleTeamById("Zf5OcGh63sPuj5z7aysp")
        deleteModuleTeamById("M2RtS9K88B0kE2BH9Zwz")
        deleteModuleTeamById("EEFOISUrTgQzdcGjp7bv")
    }

    return (
        <div className = {styles.form}>
            <div className={styles.subContainer}>
                <button onClick={() => createUser(exampleStudent)}>Add Example Student</button>
                <button onClick={() => createUser(examplePRM)}>Add Example PRM</button>
                <button onClick={() => getUserById("O9725vldLEatfTDPdaa2")}>Get Example Student</button>
                <button onClick={() => updateEmailById("O9725vldLEatfTDPdaa2", "janedoeUpdated@gmail.com")}>Update Student Email</button>
                {/* <button onClick={() => deleteUser("u7J252Z9J3hvRXfwXELO")}>Remove Student Account</button> */}
                <button onClick={() => updatePasswordById("MBQmZjAcvsDz4BDoPAHb", "newPassword")}>Update Password By Id</button>
                <button onClick={getAllStudents}>Get All Students</button>
                <button onClick={getAllPRMS}>Get all PRMS</button>
                <button onClick={() => addGroupofStudents(groupOfStudents)}>Add group of PRMS</button>
                <button onClick={() => addGroupOfTeams(ModuleGroups)}>Add group of teams</button>
                <button onClick={deleteExistingModulesInTest}>Delete existing bad modules</button>

                {/* <p>Module Team</p>
                <select
                    value={moduleTeam?.teamName || ""}
                    onChange={(e) => {
                        const selectedTeam = moduleTeamOptions.find(team => team.teamName === e.target.value);
                        setModuleTeam(selectedTeam || null);
                    }}
                >
                    <option value="">Select a team</option>
                    {moduleTeamOptions.map((team, index) => (
                        <option key={index} value={team.teamName}>
                            {team.teamName}
                        </option>
                    ))}
                </select> */}


                <button onClick={() => getAllTasks(false)}>Get all Tasks</button>

                <button onClick={getAllModuleTeams}>Get all module teams</button>
                <input 
                placeholder="enter module team name" 
                onChange={(e) => setModuleTeamName(e.target.value)} 
                />
                <button onClick={() => getModuleTeamByName(moduleTeamName)}>
                Get Module Team By Name
                </button>  

            </div>
        </div>
    );
};

export default Test;
