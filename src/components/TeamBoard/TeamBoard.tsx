import { useParams } from 'react-router-dom';
import { ModuleTeam, Priority, Student, Task } from '../../types';
import styles from "./TeamBoard.module.css";
import { useState, useEffect } from "react";
import { addTask, deleteTask, getModuleTeamByName, getTask, getUserByUid, updateTask } from '../../api/database/functions';

interface TeamBoardProps {
    moduleGroups: ModuleTeam[];
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
    const [newStatus, setNewStatus] = useState("Todo");
    const [newTaskDesc, setNewTaskDesc] = useState("");

    // for viewing and editing a task
    const [currTaskInfo, setCurrTaskInfo] = useState<Task | null>();
    const [selectedCurrTask, setSelectedCurrTask] = useState("");
    const [currTaskStatus, setCurrTaskStatus] = useState<"Todo" | "IP" | "Done" | null>(null);
    const [editTask, setEditTask] = useState(false);

    useEffect(() => {

    }, [currTable, moduleGroups, students, displayNewTaskModal]);

    useEffect(() => {
        if (selectedCurrTask) {
            getCurrTask(selectedCurrTask);
        }
    }, [selectedCurrTask]);

    if (!team) {
        return <div>Team not found!</div>;
    }
    

    async function createTask() {
        if (team) {
            const priority =
            newTaskPriority === "HIGH" ? Priority.HIGH :
            newTaskPriority === "LOW" ? Priority.LOW :
            newTaskPriority === "MEDIUM" ? Priority.MEDIUM : null;

            const student = await getUserByUid(Number(newTaskAssignee));
            const studentCreator = await getUserByUid(Number(newTaskCreater));
            const studentReviewer = await getUserByUid(Number(newTaskReviewer));
            const taskCoTeam = await getModuleTeamByName(newTaskCoTeam);

            const newTask: Task = {
                priority: priority,
                desc: newTaskDesc,
                title: newTaskTitle,
                dueDate: new Date(newTaskDate).toDateString(),
                assignees: student as Student,
                attachments: [], // do not accept any attachments for now
                taskType: 'Task',
                reviewer: studentReviewer as Student,
                status: newStatus ? newStatus : "Todo",
                taskId: "",
                // coTeam: taskCoTeam? taskCoTeam : undefined,
                taskCreator: studentCreator as Student
            }

            try {
                console.log("The team is: ", team)
                const taskRes = await addTask(team, newTask);
                console.log("Added task successfully: ", taskRes);
                window.location.reload();
            } catch (error) {
                console.error("Error with adding a task: ", error);
            }
        }
    }

    async function updateCurrTask() {
        console.log("the new status of the card is: ", newStatus);
        if (team) {
            const priority =
            newTaskPriority === "HIGH" ? Priority.HIGH :
            newTaskPriority === "LOW" ? Priority.LOW :
            newTaskPriority === "MEDIUM" ? Priority.MEDIUM : null;

            const student = await getUserByUid(Number(newTaskAssignee));
            const studentCreator = await getUserByUid(Number(newTaskCreater));
            const studentReviewer = await getUserByUid(Number(newTaskReviewer));
            // const taskCoTeam = await getModuleTeamByName(newTaskCoTeam);

            const newTask: Task = {
                priority: priority,
                desc: newTaskDesc,
                title: newTaskTitle,
                dueDate: new Date(newTaskDate).toDateString(),
                assignees: student as Student,
                attachments: [], // do not accept any attachments for now
                taskType: 'Task',
                reviewer: studentReviewer as Student,
                status: newStatus ? newStatus : "Todo",
                taskId: selectedCurrTask,
                // coTeam: taskCoTeam? taskCoTeam : undefined,
                taskCreator: studentCreator as Student
            }

            try {
                const taskRes = await updateTask(selectedCurrTask, newTask, team);
                console.log("Added task successfully: ", taskRes);
                window.location.reload();
            } catch (error) {
                console.error("Error with adding a task: ", error);
            }
        }
    }

    const getCurrTask = async (taskId: string) => {
        const task = await getTask(taskId);

        if (task) {
            setCurrTaskInfo(task);
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
                            {team.teamDesc}
                        </div>
                    </div>

                    <div className={styles.teamMembersContainer}>
                        <h1 className={styles.teamMembersHeader}>Team Members</h1>
                        <div className={styles.membersList}>
                            {team.teamMembers.map(member => <p>{member.firstName + " " + member.lastName}</p>)}
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
                                                    {team.teamMembers.map(member => <option value={member.uid}>{member.firstName + " " + member.lastName}</option>)}   
                                                </select>
                                            </div>
                                            <div className={styles.shortInfoElement}>
                                                <p>Reviewer:</p>
                                                <select onChange={(e) => setNewTaskReviewer(e.target.value)} value={newTaskReviewer}>
                                                    <option value="" disabled className={styles.voidInput}>Add a reviewer</option>
                                                    {team.teamMembers.map(member => <option value={member.uid}>{member.firstName + " " + member.lastName}</option>)}   
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
                                                <p>Co-Team:</p>
                                                <select onChange={(e) => setNewTaskCoTeam(e.target.value)} value={newTaskCoTeam}>
                                                    <option value="" disabled>Assign collab team</option>
                                                    {moduleGroups.map((module) => (
                                                        <option value={module.teamName}>{module.teamName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className={styles.shortInfoElement}>
                                                <p>Status:</p>
                                                <select onChange={(e) => setNewStatus(e.target.value)} value={newStatus}>
                                                    <option value="Todo">To-do</option>
                                                    <option value="IP">In progress</option>
                                                    <option value="Verification">Verification</option>
                                                    <option value="Done">Done</option>
                                                </select>
                                            </div>
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
                
                                {team.tasks && team.tasks.length > 0 ? (
                                team.tasks.map((task: Task) => (
                                <tr key={task.taskId} id={styles.tableTask}>
                                    <td>{task.taskId}</td>
                                    <td>{task.title}</td>
                                    <td>{task.dueDate}</td>
                                    <td>{task.status}</td>
                                    <td>{task.priority}</td>
                                    <td>{task.assignees? task.assignees.firstName + ' ' + task.assignees.lastName : "No assignees"}</td>
                                    <td className={styles.tableActionButtons}>
                                        <button onClick={() => {setDisplayTaskInfo(true); setSelectedCurrTask(task.taskId);}} className={styles.openButton}>
                                            
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="40"
                                            height="40"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M18 3h3a1 1 0 0 1 1 1v3h-2V5.414l-5.793 5.793a1 1 0 0 1-1.414-1.414L18 3zm-1 10a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h7a1 1 0 0 1 0 2H7v12h12v-6z"/>
                                        </svg>
                                        </button>
                                        <button onClick={async () => {await deleteTask(task.taskId, team); window.location.reload();}} className={styles.deleteButton}>

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="40"
                                            height="40"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M9 3v1H4v2h16V4h-5V3H9zm-2 5v13c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V8H7zm4 2h2v9h-2v-9z"/>
                                        </svg>

                                        </button>
                                    </td>
                                </tr>
                                ))
                            ) : (
                                <td colSpan={7}>No tasks have been added to this team</td>)
                            }
                        </table>




                        {selectedCurrTask && currTaskInfo && (editTask ? (
                            <div className={styles.taskModalContainer}>
                                <div className={styles.taskModalContainerChild}>
                                    <input
                                        placeholder="Task Title"
                                        className={styles.newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        value={newTaskTitle}
                                    />
                                    <div className={styles.newTaskShortInfoContainer}>
                                        <div className={styles.shortInfoElement}>
                                            <p>Assignee:</p>
                                            <select onChange={(e) => setNewTaskAssignee(e.target.value)} value={newTaskAssignee}>
                                                <option value="" disabled className={styles.voidInput}>Add an assignee</option>
                                                {team.teamMembers.map(member => (
                                                    <option key={member.uid} value={member.uid}>
                                                        {member.firstName + " " + member.lastName}
                                                    </option>
                                                ))}   
                                            </select>
                                        </div>
                                        <div className={styles.shortInfoElement}>
                                            <p>Reviewer:</p>
                                            <select onChange={(e) => setNewTaskReviewer(e.target.value)} value={newTaskReviewer}>
                                                <option value="" disabled className={styles.voidInput}>Add a reviewer</option>
                                                {team.teamMembers.map(member => (
                                                    <option key={member.uid} value={member.uid}>
                                                        {member.firstName + " " + member.lastName}
                                                    </option>
                                                ))}   
                                            </select>
                                        </div>
                                        <div className={styles.shortInfoElement}>
                                            <p>Due Date:</p>
                                            <input 
                                                type="date" 
                                                placeholder="Assign a due date" 
                                                onChange={(e) => setNewTaskDate(e.target.value)} 
                                                value={newTaskDate}
                                            />
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
                                            <p>Co-Team:</p>
                                            <select onChange={(e) => setNewTaskCoTeam(e.target.value)} value={newTaskCoTeam}>
                                                <option value="" disabled>Assign collab team</option>
                                                {moduleGroups.map((module) => (
                                                    <option key={module.teamName} value={module.teamName}>
                                                        {module.teamName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.shortInfoElement}>
                                            <p>Status:</p>
                                            <select onChange={(e) => setNewStatus(e.target.value)} value={newStatus}>
                                                <option value="Todo">To-do</option>
                                                <option value="IP">In progress</option>
                                                <option value="Verification">Verficiation</option>
                                                <option value="Done">Done</option>
                                            </select>
                                        </div>
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
                                        <button onClick={() => setEditTask(true)} className={styles.cancelBtn}>Edit</button>
                                        <button onClick={() => setEditTask(false)} className={styles.cancelBtn}>Cancel</button>
                                        <button onClick={() => { setDisplayNewTaskModal(false); updateCurrTask();}} className={styles.createBtn}>
                                        Update
                                    </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.taskModalContainer}>
                            <div className={styles.taskModalContainerChild}>
                                {currTaskInfo.title}
                                <div className={styles.newTaskShortInfoContainer}>
                                    <div className={styles.shortInfoElement}>
                                        <p>Assignee: {currTaskInfo.assignees? currTaskInfo.assignees.firstName + ' ' + currTaskInfo.assignees.lastName : "Not assigned"}</p>
                                    </div>
                                    <div className={styles.shortInfoElement}>
                                        <p>Reviewer: {currTaskInfo.reviewer? currTaskInfo.reviewer.firstName + ' ' + currTaskInfo.reviewer.lastName : "No reviewer"}</p>
                                    </div>
                                    <div className={styles.shortInfoElement}>
                                        <p>Due Date: {currTaskInfo.dueDate? new Date(Date.parse(currTaskInfo.dueDate)).toLocaleDateString() : currTaskInfo.dueDate === null? "No Due Date" : ""}</p>
                                    </div>
                                    <div className={styles.shortInfoElement}>
                                        <p>Priority: {currTaskInfo.priority}</p>
                                    </div>
                                    <div className={styles.shortInfoElement}>
                                        <p>Co-Team: {currTaskInfo.coTeam? currTaskInfo.coTeam.teamName : "No co-team"}</p>
                                    </div>
                                    <div className={styles.shortInfoElement}>
                                        <p>Status: {currTaskInfo.status}</p>
                                    </div>
                                </div>
                                <div className={styles.shortInfoElementDesc}>
                                    <p>Description: {currTaskInfo.desc}</p>
                                </div>
                                <div className={styles.newTaskActionBtns}>
                                    <button onClick={() => {
                                        setEditTask(true);
                                        setNewTaskTitle(currTaskInfo.title);
                                        setNewTaskAssignee(currTaskInfo.assignees? currTaskInfo.assignees.firstName + ' ' + currTaskInfo.assignees.lastName : "");
                                        setNewTaskDate(currTaskInfo.dueDate? currTaskInfo.dueDate : "No due date");
                                        setNewTaskPriority(currTaskInfo.priority? currTaskInfo.priority : "No priority");
                                        setNewTaskDesc(currTaskInfo.desc);
                                        setNewStatus(currTaskInfo.status);
                                    }} className={styles.cancelBtn}>Edit</button>
                                    <button onClick={() => {setEditTask(false); setCurrTaskInfo(null); setSelectedCurrTask("")}} className={styles.cancelBtn}>Cancel</button>
                                </div>
                            </div>
                        </div>
                        ))}

                    </div>
                    
                    )
                    :
                    (
                    <div className={styles.statusContainer}>
                        <div className={styles.toDoBox}>
                            <p className={styles.tableHeader}>To-Do</p>
                            {teamTasks?.filter((task: Task) => task.status === "Todo").map((task: Task) => (
                                <div className={styles.testCard} onClick={() => setSelectedCurrTask(task.taskId)}>
                                    <div className={styles.label}>
                                        <p className={task.taskType === "Bug"? styles.bugTaskType : task.taskType ==="Feature"? styles.featureTaskType : styles.taskType}>{task.taskType}</p>
                                        <p className={task.priority === "HIGH" ? styles.High : task.priority === "LOW"? styles.Low : task.priority === "MEDIUM"? styles.Medium : ''}>{task.priority}</p>
                                    </div>
                                    <p className={styles.cardDesc}>{task.title}</p>
                                    <p className={styles.assignee}>Assignee: {task.assignees? task.assignees.firstName + ' ' + task.assignees.lastName : "No assignee"}</p>
                                    <p className={styles.date}>{typeof task.dueDate === "string" && task.dueDate.length > 0? "Due " + new Date(Date.parse(task.dueDate)).toLocaleDateString() : task.dueDate === null? "No Due Date" : ""}</p>
                                </div>
                            ))}
                        </div>

                        <div className={styles.inProgressBox}>
                            <p className={styles.tableHeader}>In-Progress</p>
                            {teamTasks?.filter((task: Task) => task.status === "IP").map((task: Task) => (
                                <div className={styles.testCard} onClick={() => setSelectedCurrTask(task.taskId)}>
                                    <div className={styles.label}>
                                        <p className={task.taskType === "Bug"? styles.bugTaskType : task.taskType ==="Feature"? styles.featureTaskType : styles.taskType}>{task.taskType}</p>
                                        <p className={task.priority === "HIGH" ? styles.High : task.priority === "LOW"? styles.Low : task.priority === "MEDIUM"? styles.Medium : ''}>{task.priority}</p>
                                    </div>
                                    <p className={styles.cardDesc}>{task.title}</p>
                                    <p className={styles.assignee}>Assignee: {task.assignees? task.assignees.firstName + ' ' + task.assignees.lastName : "No assignee"}</p>
                                    <p className={styles.date}>{typeof task.dueDate === "string" && task.dueDate.length > 0? "Due " + new Date(Date.parse(task.dueDate)).toLocaleDateString() : task.dueDate === null? "No Due Date" : ""}</p>
                                </div>
                            ))}
                        </div>

                        <div className={styles.verificationBox}>
                            <p className={styles.tableHeader}>Verification</p>
                            {teamTasks?.filter((task: Task) => task.status === "Verification").map((task: Task) => (
                                <div className={styles.testCard} onClick={() => setSelectedCurrTask(task.taskId)}>
                                    <div className={styles.label}>
                                        <p className={task.taskType === "Bug"? styles.bugTaskType : task.taskType ==="Feature"? styles.featureTaskType : styles.taskType}>{task.taskType}</p>
                                        <p className={task.priority === "HIGH" ? styles.High : task.priority === "LOW"? styles.Low : task.priority === "MEDIUM"? styles.Medium : ''}>{task.priority}</p>
                                    </div>
                                    <p className={styles.cardDesc}>{task.title}</p>
                                    <p className={styles.assignee}>Assignee: {task.assignees? task.assignees.firstName + ' ' + task.assignees.lastName : "No assignee"}</p>
                                    <p className={styles.date}>{typeof task.dueDate === "string" && task.dueDate.length > 0? "Due " + new Date(Date.parse(task.dueDate)).toLocaleDateString() : task.dueDate === null? "No Due Date" : ""}</p>
                                </div>
                            ))}
                        </div>

                        <div className={styles.doneBox}>
                            <p className={styles.tableHeader}>Done</p>
                            {teamTasks?.filter((task: Task) => task.status === "Done").map((task: Task) => (
                                <div className={styles.testCard} onClick={() => setSelectedCurrTask(task.taskId)}>
                                    <div className={styles.label}>
                                        <p className={task.taskType === "Bug"? styles.bugTaskType : task.taskType ==="Feature"? styles.featureTaskType : styles.taskType}>{task.taskType}</p>
                                        <p className={task.priority === "HIGH" ? styles.High : task.priority === "LOW"? styles.Low : task.priority === "MEDIUM"? styles.Medium : ''}>{task.priority}</p>
                                    </div>
                                    <p className={styles.cardDesc}>{task.title}</p>
                                    <p className={styles.assignee}>Assignee: {task.assignees? task.assignees.firstName + ' ' + task.assignees.lastName : "No assignee"}</p>
                                    <p className={styles.date}>{typeof task.dueDate === "string" && task.dueDate.length > 0? "Due " + new Date(Date.parse(task.dueDate)).toLocaleDateString() : task.dueDate === null? "No Due Date" : ""}</p>
                                </div>
                            ))}
                        </div>


                        {selectedCurrTask && currTaskInfo && (editTask ? (
                            <div className={styles.taskModalContainer}>
                                <div className={styles.taskModalContainerChild}>
                                    <input
                                        placeholder="Task Title"
                                        className={styles.newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        value={newTaskTitle}
                                    />
                                    <div className={styles.newTaskShortInfoContainer}>
                                        <div className={styles.shortInfoElement}>
                                            <p>Assignee:</p>
                                            <select onChange={(e) => setNewTaskAssignee(e.target.value)} value={newTaskAssignee}>
                                                <option value="" disabled className={styles.voidInput}>Add an assignee</option>
                                                {team.teamMembers.map(member => (
                                                    <option key={member.uid} value={member.uid}>
                                                        {member.firstName + " " + member.lastName}
                                                    </option>
                                                ))}   
                                            </select>
                                        </div>
                                        <div className={styles.shortInfoElement}>
                                            <p>Reviewer:</p>
                                            <select onChange={(e) => setNewTaskReviewer(e.target.value)} value={newTaskReviewer}>
                                                <option value="" disabled className={styles.voidInput}>Add a reviewer</option>
                                                {team.teamMembers.map(member => (
                                                    <option key={member.uid} value={member.uid}>
                                                        {member.firstName + " " + member.lastName}
                                                    </option>
                                                ))}   
                                            </select>
                                        </div>
                                        <div className={styles.shortInfoElement}>
                                            <p>Due Date:</p>
                                            <input 
                                                type="date" 
                                                placeholder="Assign a due date" 
                                                onChange={(e) => setNewTaskDate(e.target.value)} 
                                                value={newTaskDate}
                                            />
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
                                            <p>Co-Team:</p>
                                            <select onChange={(e) => setNewTaskCoTeam(e.target.value)} value={newTaskCoTeam}>
                                                <option value="" disabled>Assign collab team</option>
                                                {moduleGroups.map((module) => (
                                                    <option key={module.teamName} value={module.teamName}>
                                                        {module.teamName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className={styles.shortInfoElement}>
                                            <p>Status:</p>
                                            <select onChange={(e) => setNewStatus(e.target.value)} value={newStatus}>
                                                <option value="Todo">To-do</option>
                                                <option value="IP">In progress</option>
                                                <option value="Verification">Verficiation</option>
                                                <option value="Done">Done</option>
                                            </select>
                                        </div>
                                        
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
                                        <button onClick={() => setEditTask(true)} className={styles.cancelBtn}>Edit</button>
                                        <button onClick={() => setEditTask(false)} className={styles.cancelBtn}>Cancel</button>
                                        <button onClick={() => { setDisplayNewTaskModal(false); updateCurrTask();}} className={styles.createBtn}>
                                        Update
                                    </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.taskModalContainer}>
                            <div className={styles.taskModalContainerChild}>
                                {currTaskInfo.title}
                                <div className={styles.newTaskShortInfoContainer}>
                                    <div className={styles.shortInfoElement}>
                                        <p>Assignee: {currTaskInfo.assignees? currTaskInfo.assignees.firstName + ' ' + currTaskInfo.assignees.lastName : "Not assigned"}</p>
                                    </div>
                                    <div className={styles.shortInfoElement}>
                                        <p>Reviewer: {currTaskInfo.reviewer? currTaskInfo.reviewer.firstName + ' ' + currTaskInfo.reviewer.lastName : "No reviewer"}</p>
                                    </div>
                                    <div className={styles.shortInfoElement}>
                                        <p>Due Date: {currTaskInfo.dueDate? new Date(Date.parse(currTaskInfo.dueDate)).toLocaleDateString() : currTaskInfo.dueDate === null? "No Due Date" : ""}</p>
                                    </div>
                                    <div className={styles.shortInfoElement}>
                                        <p>Priority: {currTaskInfo.priority}</p>
                                    </div>
                                    <div className={styles.shortInfoElement}>
                                        <p>Co-Team: {currTaskInfo.coTeam? currTaskInfo.coTeam.teamName : "No co-team"}</p>
                                    </div>

                                    <div className={styles.shortInfoElement}>
                                        <p>Status: {currTaskInfo.status}</p>
                                    </div>
                                </div>
                                <div className={styles.shortInfoElementDesc}>
                                    <p>Description: {currTaskInfo.desc}</p>
                                </div>
                                <div className={styles.newTaskActionBtns}>
                                    <button onClick={() => {
                                        setEditTask(true);
                                        setNewTaskTitle(currTaskInfo.title);
                                        setNewTaskAssignee(currTaskInfo.assignees? currTaskInfo.assignees.firstName + ' ' + currTaskInfo.assignees.lastName : "");
                                        setNewTaskDate(currTaskInfo.dueDate? currTaskInfo.dueDate : "No due date");
                                        setNewTaskPriority(currTaskInfo.priority? currTaskInfo.priority : "No priority");
                                        setNewTaskDesc(currTaskInfo.desc);
                                        setNewStatus(currTaskInfo.status);
                                    }} className={styles.cancelBtn}>Edit</button>
                                    <button onClick={() => {setEditTask(false); setCurrTaskInfo(null); setSelectedCurrTask("")}} className={styles.cancelBtn}>Cancel</button>
                                </div>
                            </div>
                        </div>
                        ))}



                    </div>
                    )}
                </div>
            
            </div>
        </>
      );
    }

export default TeamBoard;