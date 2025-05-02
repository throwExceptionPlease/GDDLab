import { useParams } from 'react-router-dom';
import { ModuleTeam, ModuleTeams, Priority, Student, Task } from '../../types';
import styles from "./TeamBoard.module.css";
import { useState, useEffect } from "react";
import { addTask } from '../../api/database/users';

interface TeamBoardProps {
    moduleGroups: ModuleTeams;
    students: Student[];
}

const TeamBoard = ({ moduleGroups, students }: TeamBoardProps) => {
    const { teamName } = useParams();
    const team = moduleGroups.find((module) => module.teamName.replace(/[^a-zA-Z0-9]/g, "") === teamName);
    const teamTasks = team?.tasks;
    const [currTable, setCurrTable] = useState("Task Table");
    const teamStudents = students.filter(student => student.moduleTeam?.teamName === teamName);
    const [displayNewTaskModal, setDisplayNewTaskModal] = useState(false);
    const [displayTaskInfo, setDisplayTaskInfo] = useState(false);

    // adding a new task
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskAssignee, setNewTaskAssignee] = useState("");
    const [newTaskReviewer, setNewTaskReviewer] = useState("");
    const [newTaskDate, setNewTaskDate] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState("");
    const [newTaskCreater, setNewTaskCreater] = useState("");
    const [newTaskCoTeam, setNewTaskCoTeam] = useState("");
    const [newTaskDesc, setNewTaskDesc] = useState("");

    useEffect(() => {

    }, [currTable, moduleGroups, students]);

    if (!team) {
        return <div>Team not found!</div>;
    }

    async function createTask() {
        if (team) {
            const priority =
            newTaskPriority === "HIGH" ? Priority.HIGH :
            newTaskPriority === "LOW" ? Priority.LOW :
            newTaskPriority === "MEDIUM" ? Priority.MEDIUM : null;

            const newTask: Task = {
                priority: priority,
                desc: newTaskDesc,
                title: newTaskTitle,
                dueDate: new Date(newTaskDate),
                assignees: null,
                attachments: [],
                taskType: 'Task'
            }

            try {
                const taskRes = await addTask(team, newTask);
                console.log("Added task successfully: ", taskRes);
            } catch (error) {
                console.error("Error with adding a task: ", error);
            }
        }
    }

    return (
        <>
            {/* <NavBar currPage = "" /> */}
            <div className={styles.modulePage}>
                <div className={styles.topContainer}>
                    <button className={styles.homeBtn}><a href="/"><i className={styles.arrowLeft}></i>Home</a></button>
                    <h1 className={styles.moduleName}>{team.teamName}</h1>
                </div>
                <div className={styles.teamInfoContainer}>
                    <div className={styles.aboutTeamContainer}>
                        <h1 className={styles.aboutTeamHeader}>About the Team</h1>
                        <div className={styles.aboutTeamDesc}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                            Adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </div>
                    </div>

                    <div className={styles.teamMembersContainer}>
                        <h1 className={styles.teamMembersHeader}>Team Members</h1>
                        <div className={styles.membersList}>
                            {team.teamMembers.map(member => <p>{member}</p>)}
                        </div>
                    </div>
                </div>

                <hr></hr>

                {/* Task Table or Status Cards */}
                <div className={styles.taskOptionContainer}>
                    <button className={currTable==="Task Table"? styles.selectedVer : styles.taskTable} onClick={() => setCurrTable("Task Table")}>Task Table</button>
                    <button className={currTable==="Status Cards"? styles.selectedVer : styles.statusCards} onClick={() => setCurrTable("Status Cards")}>Status Cards</button>
                </div>

                <div className={styles.versionContainer}>
                <button className={styles.addTask} onClick={() => setDisplayNewTaskModal(true)}>Add a task +</button>
                    {
                        displayNewTaskModal && (
                            <div className={styles.taskModalContainer}>
                                <div className={styles.taskModalContainerChild}>
                                    <input placeholder="Task Title" className={styles.newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}/>
                                    <div className={styles.newTaskShortInfoContainer}>
                                            <div className={styles.shortInfoElement}>
                                                <p>Assignee:</p>
                                                <select onChange={(e) => setNewTaskAssignee(e.target.value)} value={newTaskAssignee}>
                                                    <option value="" disabled className={styles.voidInput}>Add an assignee</option>
                                                    {team.teamMembers.map(member => <option>{member}</option>)}   
                                                </select>
                                            </div>
                                            <div className={styles.shortInfoElement}>
                                                <p>Reviewer:</p>
                                                <select onChange={(e) => setNewTaskReviewer(e.target.value)} value={newTaskReviewer}>
                                                    <option value="" disabled className={styles.voidInput}>Add a reviewer</option>
                                                    {team.teamMembers.map(member => <option>{member}</option>)}   
                                                </select>
                                            </div>
                                            <div className={styles.shortInfoElement}>
                                                <p>Due Date:</p>
                                                <input type="date" placeholder="Assign a due date" onChange={(e) => setNewTaskDate(e.target.value)} value={newTaskDate}/>
                                            </div>
                                            <div className={styles.shortInfoElement}>
                                                <p>Priority:</p>
                                                <select onChange={(e) => setNewTaskPriority(e.target.value)} value={newTaskPriority}>
                                                    <option value="" disabled>Assign a priority</option>
                                                    <option value="LOW">Low</option>
                                                    <option value="MEDIUM">Medium</option>
                                                    <option value="HIGH">High</option>
                                                </select>
                                            </div>
                                            <div className={styles.shortInfoElement}>
                                                <p>Created by:</p>
                                                <select onChange={(e) => setNewTaskCreater(e.target.value)} value={newTaskCreater}>
                                                    <option value="" disabled className={styles.voidInput}>Add task creater</option>
                                                    {team.teamMembers.map(member => <option>{member}</option>)}   
                                                </select>
                                            </div>
                                            <div className={styles.shortInfoElement}>
                                                <p>Co-Team:</p>
                                                <select onChange={(e) => setNewTaskCoTeam(e.target.value)} value={newTaskCoTeam}>
                                                    <option value="" disabled>Assign collab team</option>
                                                    {moduleGroups.map((module) => (
                                                        <option value={module.teamName}>{module.teamName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* <div className={styles.shortInfoElement}>
                                                <p>Category:</p>
                                            </div> */}
                                    </div>
                                    <div className={styles.shortInfoElementDesc}>
                                        <p>Description:</p>
                                        <textarea 
                                            placeholder="Add a description of the task. If this is a bug or a feature, describe the steps to replicate the expected outcome and what the actual outcome is." 
                                            onChange={(e) => setNewTaskDesc(e.target.value)}
                                            value={newTaskDesc}
                                            className={styles.descInput}
                                        />
                                    </div>
                                    <div className={styles.newTaskActionBtns}>
                                        <button onClick={() => setDisplayNewTaskModal(false)} className={styles.cancelBtn}>Cancel</button>
                                        <button onClick={() => {
                                            setDisplayNewTaskModal(false);
                                            createTask();
                                        }}
                                        className={styles.createBtn}
                                        >
                                            Create
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {currTable==="Task Table"?
                    (
                        <div className={styles.tableContainer}>
                        <table className={styles.tableLayout}>
                            <tr>
                                <th>Task #</th>
                                <th>Task Name</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Assignee(s)</th>
                                <th>Actions</th>
                            </tr>
                            <tr>
                                <td colSpan={7}>&nbsp;</td> {/* Empty row */}
                            </tr>
                        </table>
                    </div>
                    
                    )
                    :
                    (
                    <div className={styles.statusContainer}>
                        <div className={styles.toDoBox}>
                            <p className={styles.tableHeader}>To-Do</p>
                            {teamTasks?.map((task) => (
                                <div className={styles.testCard}>
                                    <div className={styles.label}>
                                        <p className={styles.taskType}>{task.taskType}</p>
                                        <p className={task.priority === "HIGH" ? styles.High : task.priority === "LOW"? styles.Low : task.priority === "MEDIUM"? styles.Medium : ''}>{task.priority}</p>
                                    </div>
                                    <p className={styles.cardDesc}>{task.desc}</p>
                                    <p className={styles.assignee}>{task.assignees?.join(', ')}</p>
                                    <p className={styles.date}>{task.dueDate?.toLocaleDateString()}</p>
                                </div>
                            ))}
                            <div className={styles.testCard} onClick={() => setDisplayTaskInfo(true)}>
                                <div className={styles.label}>
                                    <p className={styles.bug}>Bug</p>
                                    <p className={styles.High}>High</p>
                                </div>
                                <p className={styles.cardDesc}>Update Contact Us page to send automated reply</p>
                                <p className={styles.assignee}>Assignee: Jessica Nguyen</p>
                                <p className={styles.date}>Due May 05, 2025</p>
                            </div>
                        </div>

                        <div className={styles.inProgressBox}>
                            <p className={styles.tableHeader}>In-Progress</p>
                        </div>

                        <div className={styles.verificationBox}>
                            <p className={styles.tableHeader}>Verification</p>
                        </div>

                        <div className={styles.doneBox}>
                            <p className={styles.tableHeader}>Done</p>
                        </div>
                    </div>
                    )
                    }
                </div>
            
            </div>
        </>
      );
    }

export default TeamBoard;