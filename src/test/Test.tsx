import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../api/firebase"; // adjust the path to your Firebase config
import { ModuleTeam, Priority, Student, Task } from "../types";
import styles from "./Test.module.css";
import { addTask, createModuleTeam, createUser, deleteAccountById, deleteModuleTeam, getAllModuleTeams, getAllPRMS, getAllStudents, getAllTasks, getModuleTeamByName, getUserById, updateEmailById, updatePasswordById } from "../api/database/users";
import { create } from "domain";

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
            tasks: []
        },
        email: "jdoe@umd.edu",
        password: "12345",
        prm: false,
        uid: 11889900
    }

    
    const exampleTask: Task = {
        priority: Priority.HIGH,
        desc: "this is an example task",
        title: "Example Task",
        dueDate: null,
        assignees: [exampleStudent],
        attachments: [],
        taskType: "Bug",
    }
    
    const examplePRM: Student = {
        firstName: "Jane2",
        lastName: "Doe2",
        moduleTeam: {
            teamName: "Infrastructure and Interface",
            teamMembers: [],
            teamImage: "",
            tasks: []
        },
        email: "jdoe2@umd.edu",
        password: "1233345",
        prm: true,
        uid: 1188911111
    }
    
    const exampleModuleGroup: ModuleTeam = {
        teamName: "Example Team",
        teamMembers: ["Person 1", "Person 2"],
        teamImage: "",
        tasks: []
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
            !email.trim() ||
            !password.trim()
        ) {
            alert("Please fill in all fields.");
            return;
        }

        const newStudent: Student = {
            firstName,
            lastName,
            moduleTeam,
            email,
            password,
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
            setPassword("");
            setuid("");
            setPrm(false);
        } catch (error) {
            console.error("Error adding student:", error);
            alert("Failed to add student. Check console for details.");
        }
    };

    return (
        <div className = {styles.form}>
            <div className={styles.subContainer}>
                <button onClick={() => createUser(exampleStudent)}>Add Example Student</button>
                <button onClick={() => createUser(examplePRM)}>Add Example PRM</button>
                <button onClick={() => getUserById("O9725vldLEatfTDPdaa2")}>Get Example Student</button>
                <button onClick={() => updateEmailById("O9725vldLEatfTDPdaa2", "janedoeUpdated@gmail.com")}>Update Student Email</button>
                <button onClick={() => deleteAccountById("u7J252Z9J3hvRXfwXELO")}>Remove Student Account</button>
                <button onClick={() => updatePasswordById("MBQmZjAcvsDz4BDoPAHb", "newPassword")}>Update Password By Id</button>
                <button onClick={getAllStudents}>Get All Students</button>
                <button onClick={getAllPRMS}>Get all PRMS</button>
                <button onClick={() => createModuleTeam(exampleModuleGroup)}>Add Module Team</button>

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


                <button onClick={() => addTask(exampleModuleGroup, exampleTask)}>Add Example Task</button>
                <button onClick={() => getAllTasks(false)}>Get all Tasks</button>

                <button onClick={getAllModuleTeams}>Get all module teams</button>
                <input 
                placeholder="enter module team name" 
                onChange={(e) => setModuleTeamName(e.target.value)} 
                />
                <button onClick={() => getModuleTeamByName(moduleTeamName)}>
                Get Module Team By Name
                </button>  

                <button onClick={() => deleteModuleTeam(exampleModuleGroup)}>Delete Example Module</button> 
            </div>
        </div>
    );
};

export default Test;
