import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import styles from "./ManagePage.module.css";
import { ModuleTeam, Student } from "../../types";
import { addStudentToTeam, createModuleTeam, createUser, deleteUserByUid, getAllModuleTeams, getModuleTeamByName, getTeamMembers, getUserById, getUserByUid, updateTeamById, updateUserById, updateUserByUid } from "../../api/database/functions";
import { updateCurrentUser } from "firebase/auth";

interface ManageProps {
    moduleGroups: ModuleTeam[];
    prms: Student[];
    students: Student[];
}

const ManagePage = ({ moduleGroups, prms, students }: ManageProps) => {
    const settings = ["Teams", "Users", "Meetings"];
    const [selectedSetting, setSelectedSetting] = useState(settings[0]);
    const [editClicked, setEditClicked] = useState(false);
    const [currEditTeam, setCurrEditTeam] = useState("");
    const [newTeamName, setNewTeamName] = useState("");
    const [studentsCopy, setStudentsCopy] = useState<Student[]>(students);

    //copy
    const [editableTeams, setEditableTeams] = useState<ModuleTeam[]>(moduleGroups);
    const [addModuleMode, setAddModuleMode] = useState(false);

    // for adding a module team
    const [newModuleName, setNewModuleName] = useState("");
    const [newModulePRM, setNewModulePRM] = useState("");
    const [newModulePRMCL, setNewModulePRMCL] = useState("");
    const [newModuleStudents, setNewModuleStudents] = useState<Student[]>([]);
    const [newModuleImage, setNewModuleImage] = useState("");
    const [teamDesc, setTeamDesc] = useState("");
    const [selectedStudentsModuleTeam, setSelectedStudentsModuleTeam] = useState([]);

    // for adding or editing a student
    const [newStudentName, setNewStudentName] = useState("");
    const [newStudentUID, setNewStudentUID] = useState("");
    const [studentNewTeam, setStudentNewTeam] = useState<ModuleTeam | null>(null);
    const [currEditUser, setCurrEditUser] = useState(0);
    const [addStudentMode, setAddStudentMode] = useState(false);
    const [selectedModuleTeam, setSelectedModuleTeam] = useState("");
    const [newStudentRole, setNewStudentRole] = useState("");
    const [newStudentEmail, setNewStudentEmail] = useState("");
    const [newStudentPwd, setNewStudentPwd] = useState("");
    
    const [currEditTeamMembers, setCurrEditTeamMembers] = useState<Student[]>([]);

    useEffect(() => {
        if (currEditTeam) {
            getTeamMembers(currEditTeam).then((members) => {
                setCurrEditTeamMembers(members);
            })
        }
        
    }, [selectedSetting, editClicked, currEditTeam, newTeamName, editableTeams, moduleGroups, newStudentName, studentNewTeam, currEditUser, students, studentsCopy, currEditTeamMembers]);

    // for editing the team name
    const handleTeamSave = async (originalTeamName: string) => {
        try {
            const team = await getModuleTeamByName(originalTeamName);
        
            if (team) {
              console.log("Team found, ready to save or update:", team);
              await updateTeamById(team.id, {teamName: newTeamName});
            } else {
              console.log("Team not found with the name:", originalTeamName);
            }
          } catch (error) {
            console.error("Error during handleTeamSave:", error);
          }
        
        const updatedTeams = editableTeams.map((team) => {
            if (team.teamName === originalTeamName) {
                return { ...team, teamName: newTeamName };
            }
            return team;
        });

        // do the reset
        setEditableTeams(updatedTeams);
        setEditClicked(false);
        setCurrEditTeam("");
        setNewTeamName("");
        setSelectedStudentsModuleTeam([]);
    };

    const handleUserInfoSave = async (user: Student, newName: string, newModule: ModuleTeam | null, newStudentRole: string) => {
        try {
            if (!user.id) {
                throw Error("Invalid user");
            } else {
                const student = await getUserByUid(user.uid);
                const nameSplit = newName.split(" ")
                if (student) {
                    await updateUserByUid(student as Student, {firstName: nameSplit[0], lastName: nameSplit[1], moduleTeam: newModule, prm: (newStudentRole === "Admin"? true : false)})
                }

                if (newModule) {
                    await addStudentToTeam(student as Student, newModule);
                }

                window.location.reload();
            }
        }
        catch (error) {
            console.log("There was a problem updating the user: ", error);
        }
    }

    async function addNewModule() {
        const teamMemberIds = newModuleStudents
        .map((student) => student)

        const newModuleTeam: ModuleTeam = {
            teamName: newModuleName,
            teamMembers: teamMemberIds,
            teamImage: "",
            tasks: [],
            teamDesc: teamDesc
        }

        await createModuleTeam(newModuleTeam);
        setNewModuleName("");
    }

    async function addNewStudent() {
        const newStudentNameParse = newStudentName.split(" ");
        
        const teamData = await getModuleTeamByName(selectedModuleTeam);
    
        if (teamData) {
            const newStudent: Student = {
                firstName: newStudentNameParse[0],
                lastName: newStudentNameParse[1],
                moduleTeam: {
                    id: teamData.id,
                    teamName: teamData.teamName,
                    teamMembers: teamData.teamMembers,
                    teamImage: teamData.teamImage,
                    tasks: teamData.tasks,
                    teamDesc: teamData.teamDesc
                },
                email: newStudentEmail,
                // password: newStudentPwd,
                prm: newStudentRole === "PRM" ? true : false,
                uid: Number(newStudentUID)
            };

            try {
                await createUser(newStudent);
                setStudentsCopy(prev => [...prev, newStudent]);
                window.location.reload();
            } catch (error) {
                console.error("There was an issue with creating the user: ", error);
            }    
        } else {
            //add user without module team
            const newStudent: Student = {
                firstName: newStudentNameParse[0],
                lastName: newStudentNameParse[1],
                moduleTeam: null,
                email: newStudentEmail,
                // password: newStudentPwd,
                prm: newStudentRole === "PRM" ? true : false,
                uid: Number(newStudentUID)
            };

            try {
                await createUser(newStudent);
                setStudentsCopy(prev => [...prev, newStudent]);
                window.location.reload();
            } catch (error) {
                console.error("There was an issue with creating the user: ", error);
            } 
        }
    }

    const deleteUser = async (uid: number) => {
        try {
            await deleteUserByUid(uid);
            console.log("Successfully delete the user: ", uid);
        } catch (error) {
            console.error("There was a problem with deleting the user: ", error);
        }
    }

    const changeStudentNewTeam = async (teamName: string, student: Student) => {
        try {
            const teamDoc = await getModuleTeamByName(teamName);
            setStudentNewTeam(teamDoc);
        } catch (error) {
            console.log("Had trouble finding and setting the student's newly assigned team");
        }
    };
    
    
    return (
        <div>
            <NavBar currPage = "Manage" />
            <div className={styles.mainContainer}>
                <div className={styles.manageHeaders}>
                    <button className={selectedSetting === "Teams"? styles.selectedSettingHeader : styles.settingHeader} onClick={() => setSelectedSetting(settings[0])}>Teams</button>
                    <button className={selectedSetting === "Users"? styles.selectedSettingHeader : styles.settingHeader} onClick={() => setSelectedSetting(settings[1])}>Users</button>
                    <button className={selectedSetting === "Meetings"? styles.lastSelectedSettingHeader : styles.settingHeader} onClick={() => setSelectedSetting(settings[2])}>Meetings</button>
                </div>

                {
                    selectedSetting === settings[0] && (
                        <div>
                            <table className={styles.manageTeamTable}>
                                <thead>
                                    <tr>
                                        <th className={styles.teamHeaderColumn}>Team Name</th>
                                        {editClicked ? (<th className={styles.teamMiddleColumn}>Members</th>) : <th className={styles.teamMiddleColumn}></th>}
                                        <th className={styles.teamActionsColumn}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {editableTeams.map((team: ModuleTeam, index: number) => (
                                        <tr key={index} className={styles.tableRow}>
                                            <td>
                                                {editClicked && currEditTeam === team.teamName ? (
                                                    <input
                                                        value={newTeamName}
                                                        onChange={(e) => setNewTeamName(e.target.value)}
                                                        className={styles.editInputMode}
                                                    />
                                                ) : (
                                                    team.teamName
                                                )}
                                            </td>
                                            <td>
                                                {editClicked && currEditTeam === team.teamName && (
                                                    <select multiple>
                                                        {students.map((student) => (
                                                            <option
                                                                key={student.uid}
                                                                value={student.uid}
                                                                selected={currEditTeamMembers?.some(member => member.uid === student.uid)}
                                                            >
                                                                {student.firstName + ' ' + student.lastName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </td>
                                            <td>
                                                {editClicked && currEditTeam === team.teamName ? (
                                                    <div className={styles.actionButtons}>
                                                        <button className={styles.deleteBtn}>Delete</button>
                                                        <button onClick={() => handleTeamSave(team.teamName)} className={styles.saveBtn}>
                                                            Save
                                                        </button>
                                                        <button onClick={() => setEditClicked(false)} className={styles.cancelBtn}>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className={styles.editBtn}>
                                                        <button
                                                            onClick={() => {
                                                                setEditClicked(true);
                                                                setCurrEditTeam(team.teamName);
                                                                setNewTeamName(team.teamName);
                                                                setAddModuleMode(false);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td>
                                            {/* need to be able to add team image as well */}
                                            {!addModuleMode? 
                                            (<button 
                                                className={styles.addModuleBtn} 
                                                onClick={() => {
                                                    setAddModuleMode(true);
                                                    setEditClicked(false);
                                                }}
                                            >Add a module +</button>)
                                            :
                                            (
                                                <div className={styles.addTeamModeContainer}>
                                                    <div className={styles.addModuleTeamInputs}>
                                                        <input placeholder="Enter module name" onChange={(e) => setNewModuleName(e.target.value)}/>
                                                        <select required value={newModulePRM} onChange={(e) => setNewModulePRM(e.target.value)}>
                                                            <option value="" disabled>Select a PRM for this team</option>
                                                            {prms.map((prm) => (
                                                                <option value={prm.id}>{prm.firstName + " " + prm.lastName}</option>
                                                            ))}
                                                        </select>
                                                        <select value={newModulePRMCL} onChange={(e) => setNewModulePRMCL(e.target.value)}>
                                                            <option value="" disabled>Select a PRM Co-Lead for this team</option>
                                                            {/* May we hope they don't select the same person...? */}
                                                            {prms.map((prm) => (
                                                                <option value={prm.id}>{prm.firstName + " " + prm.lastName}</option>
                                                            ))}
                                                        </select>
                                                        {/* only populate students that do not have a module team */}
                                                        <select multiple required
                                                            onChange={(e) => {
                                                                const selectedIds = Array.from(e.target.selectedOptions, (option) => option.value);
                                                              
                                                                const selectedStudents = students.filter((student) =>
                                                                  selectedIds.includes(student.uid.toString())
                                                                );
                                                              
                                                                setNewModuleStudents(selectedStudents);
                                                              }}
                                                        >
                                                            <option disabled>Add student(s) to this team</option>
                                                            {students
                                                            .filter(student => !student.prm && student.moduleTeam != null)
                                                            .map(student => (
                                                                <option key={student.id} value={student.id}>
                                                                {student.firstName + " " + student.lastName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <textarea onChange={(e) => setTeamDesc(e.target.value)} placeholder="Add a team description"/>
                                                    </div>
                                                </div>   
                                            )}
                                        </td>
                                        <td>
                                        {addModuleMode && ( 
                                            <div className={styles.actions2Btns}>
                                                <button className={styles.cancelBtn} onClick={() => setAddModuleMode(false)}>Cancel</button>
                                                <button onClick={() => addNewModule()} className={styles.addBtn}>
                                                    Add
                                                </button>
                                            </div>     
                                        )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )
                }
                {
                    selectedSetting === settings[1] && (
                        <div>
                            <table className={styles.manageUserTable}>
                                <thead>
                                    <tr>
                                        <th className={styles.userColumn}>User</th>
                                        <th className={styles.moduleColumn}>Module Group</th>
                                        <th className={styles.roleColumn}>Role</th>
                                        <th className={styles.actionsColumn}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* populate students */}
                                        {students.map((student) => (
                                            <tr className={styles.tableRow}>
                                                {editClicked && currEditUser === student.uid ? (
                                                    <>
                                                        <td>
                                                            <input 
                                                                value={newStudentName} 
                                                                className={styles.editInputMode}
                                                                onChange={(e) => setNewStudentName(e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <select value={studentNewTeam == null? "New Team" : studentNewTeam.teamName} onChange={(e) => changeStudentNewTeam(e.target.value, student)}>
                                                                <option value="null">Unassigned</option>
                                                                {moduleGroups.map((module) => (
                                                                    <option key={module.teamName} value={module.teamName}>{module.teamName}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select value={newStudentRole} onChange={(e) => setNewStudentRole(e.target.value)}>
                                                                <option value="Admin">Admin</option>
                                                                <option value="Student">Student</option>
                                                            </select>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                    <td>{student.firstName} {student.lastName}</td>
                                                    <td className={styles.ithData}>{student.moduleTeam == null? "Unassigned" : student.moduleTeam.teamName}</td>
                                                    <td className={styles.ithData}>
                                                        {/* fix this */}
                                                        {student.prm === true ? "Admin" : "Student"}
                                                    </td>
                                                    </>
                                                )}
                                                <td>
                                                {editClicked && currEditUser === student.uid ? (
                                                    <div className={styles.actionButtons}>
                                                        <button className={styles.deleteBtn} onClick={() => deleteUser(student.uid)}>Delete</button> 
                                                        <button 
                                                            onClick={() => handleUserInfoSave(student, newStudentName, studentNewTeam, newStudentRole)} 
                                                            className={styles.saveBtn}
                                                        >
                                                            Save
                                                        </button>
                                                        <button 
                                                            className={styles.cancelBtn}
                                                            onClick={() => {
                                                                setEditClicked(false)
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className={styles.editBtn}>
                                                        <button
                                                            onClick={() => {
                                                                setEditClicked(true);
                                                                setCurrEditUser(student.uid);
                                                                setNewStudentName(student.firstName + " " + student.lastName);
                                                                setStudentNewTeam(student.moduleTeam);
                                                                setAddStudentMode(false);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                    )}
                                                </td>
                                            </tr>
                                       ))}
                                    <tr>
                                    <td colSpan={2}>
                                        <div className={styles.addStudentRow}>
                                        {addStudentMode ? (
                                        <input
                                            placeholder="Enter the first and last name"
                                            onChange={(e) => setNewStudentName(e.target.value)}
                                        />
                                        ) : (
                                        <button
                                            className={styles.addStudentBtn}
                                            onClick={() => {
                                                setAddStudentMode(true);
                                                setEditClicked(false);
                                            }}
                                        >
                                            Add a new user +
                                        </button>
                                        )}
                                        {addStudentMode && (
                                            <div className={styles.addStudentRow}>
                                                <input 
                                                    placeholder="Enter UID" 
                                                    onChange={(e) => setNewStudentUID(e.target.value)}
                                                />
                                        
                                                <select
                                                    value={selectedModuleTeam}
                                                    onChange={(e) => setSelectedModuleTeam(e.target.value)}
                                                >
                                                <option value="" disabled>
                                                    Assign user to a module team
                                                </option>
                                                    {moduleGroups.map((team) => (
                                                    <option value={team.teamName}>{team.teamName}</option>
                                                    ))}
                                                </select>
                                    
                                                <select
                                                    required
                                                    value={newStudentRole}
                                                    onChange={(e) => setNewStudentRole(e.target.value)}
                                                >
                                                    <option value="" disabled>
                                                    Select a role
                                                    </option>
                                                    <option value="PRM">PRM/Admin</option>
                                                    <option value="Student">Student</option>
                                                </select>
                                            
                                                <input placeholder="Enter email address" onChange={(e) => setNewStudentEmail(e.target.value)}/>                                            
                                                <input type="password" placeholder="Enter a new password" onChange={(e) => setNewStudentPwd(e.target.value)}/>
                                            </div>
                                            
                                        )}
                                        
                                    </div>
                                </td>
                                </tr>
                                <tr>
                                {addStudentMode && (
                                
                                        <td colSpan={4}>
                                        <div className={styles.actions2Btns}>
                                            <button
                                            className={styles.cancelBtn}
                                            onClick={() => setAddStudentMode(false)}
                                            >
                                            Cancel
                                            </button>
                                            <button
                                            onClick={() => addNewStudent()}
                                            className={styles.addBtn}
                                            >
                                            Add
                                            </button>
                                        </div>
                                        </td>
                                   
                                    )}
                                </tr>
                                    
                                </tbody>

                            </table>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ManagePage;