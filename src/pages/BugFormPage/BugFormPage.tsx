import NavBar from '../../components/NavBar/NavBar';
import styles from './BugFormPage.module.css';
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {Priority, BugForm, Task, ModuleTeam} from '../../types';
import { db } from '../../api/firebase';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';

const BugFormPage = ({ moduleTeams }: { moduleTeams: string[] }) => { 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [moduleTeam, setModuleTeam] = useState('');
    const [bugLocation, setBugLocation] = useState('');
    const [bugTitle, setBugTitle] = useState('');
    const [pageDesc, setPageDesc] = useState('');
    const [bugLink, setBugLink] = useState('');
    const [bugDesc, setBugDesc] = useState('');
    const [priority, setPriority] = useState<Priority | null>(null);
    const [targetDate, setTargetDate] = useState<Date | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        // console.log(name, email, moduleTeam, assetType, pageDesc, assetTitle, assetLink, assetDesc, priority, targetDate);
    }, [name, email, moduleTeam, bugLocation, pageDesc, bugTitle, bugLink, bugDesc, priority, targetDate]);

    const clearRequestForm = () => {
        setName('');
        setEmail('');
        setModuleTeam('');
        setBugLocation('');
        setBugTitle('');
        setBugLink('');
        setPriority(null);
        setTargetDate(null);
    }

    const processRequestForm = async (event: React.FormEvent) => {
        event.preventDefault();
        
        try {
            const form: BugForm = {
                name: name,
                email: email,
                moduleTeam: moduleTeam,
                bugDesc: bugDesc,
                bugTitle: bugTitle,
                bugLink: bugLink,
                priority: priority,
                targetDate: targetDate,
                bugLocation: bugLocation
            }

            await addDoc(collection(db, "BugResponses"), form);
            console.log("Submitted bug form: ", form);

            // now need to auto-assign this tto infrastructure and interface
            const task: Task = {
                priority: form.priority,
                desc: form.bugDesc,
                title: bugTitle, // good for now, might have to add an input for this in the form
                dueDate: form.targetDate,
                assignees: [],
                attachments: [{
                    url: form.bugLink,
                }],
                taskType: "Bug",
            }
            const taskRef = await addDoc(collection(db, "Tasks"), task);
            console.log("Added task to db: ", task);

            const moduleInf: ModuleTeam = {
                teamName: "Infrastructure and Interface",
                teamMembers: ["Rohan Tadisetty", "Raymond Wu", "Inemesit Udo-Akang", "Saikousil Tirumalasetty"],
                teamImage: "/assets/infint.svg" ,
                tasks: []
            }
            
            const moduleTeamRef = await addDoc(collection(db, "ModuleTeams"), moduleInf); // get the module team. add it if it doesn't exist
            await updateDoc(moduleTeamRef, {
                tasks: arrayUnion(task)
            });

            console.log("Task added to module team document.");
            
            // Then navigate to confirmation page
            navigate('/confirmation', {state: {formType: "Bug", email: form.email}}); 
        } catch (error) {
            console.error("Error submitting bug report:", error);
        }
    }

    return (
        <>
            <NavBar currPage='Bug Form'/>
            <div className={styles.pageContainer}>
                <form className={styles.formMainContainer} onSubmit={processRequestForm}>
                    <h1 className={styles.formHeader}>Bug Form</h1>
                    <p className={styles.formDesc}>
                        This form is the first process in removing/resolving a bug observed in the toolkit or in an affiliated tool. 
                        Once submitted, the form will be handed to Infrastructure and Interface for review and will then go into the 
                        process of being resolved.
                    </p>

                    <h2 className={styles.formSectionHeader}>
                        Contact Information
                    </h2>
                    <div className={styles.sectionContainer}>
                        <label>Name<span>*</span></label>
                        <input type="name" required value={name} onChange={(e) => setName(e.target.value)} className={styles.simpleInput}></input>

                        <label>Email<span>*</span></label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={styles.simpleInput}></input>

                        <label>Module Team<span>*</span></label>
                        <select value={moduleTeam} onChange={(e) => setModuleTeam(e.target.value)} className={styles.dropDownInput}>
                            <option value="" disabled>Select your module team</option>
                            {moduleTeams.map((team, index) => (
                                <option key={index} value={team}>{team}</option>
                            ))}
                        </select>
                    </div>

                    <h2 className={styles.formSectionHeader}>
                            Bug Information
                    </h2>
                    <div className={styles.sectionContainer}>
                        <label>
                            Please indicate whether the bug is occurring in the toolkit or in a certain GDD-affiliated tool (e.g., AI Business Tool).<span>*</span>
                        </label>
                        <select value={bugLocation} onChange={(e) => setBugLocation(e.target.value)} className={styles.dropDownInput} required>
                            <option value="" disabled>Indicate the location of the bug</option>
                            <option value="Content">Toolkit</option>
                            <option value="Feature">In a GDD-affiliated tool</option>
                        </select>

                        <label>If this bug is occurring in the toolkit, what page and where in the page <b>specifically</b> is the bug occurring? Similarly, if this bug is occurring in a GDD-affiliated software tool, where is it occurring?<span>*</span></label>
                        <textarea value={pageDesc} onChange={(e) => setPageDesc(e.target.value)} className={styles.textAreaInput} required/>

                        <label>Please give this bug a short title<span>*</span>
                        </label>
                        <input type="text" value={bugTitle} onChange={(e) => setBugTitle(e.target.value)} className={styles.simpleInput} required/>

                        <label>Please put your document(s) of the bug in a google folder and paste the link below.<span>*</span>
                            <br></br>
                            Attach the link to the google folder: 
                        </label>
                        <input type="text" value={bugLink} onChange={(e) => setBugLink(e.target.value)} className={styles.simpleInput} required/>
                        
                        <label>
                            Please provide a <b>detailed</b> description of the bug such as events that lead to the bug occurring, the expected outcome after the events, and the actual outcome (the bug).<span>*</span>
                        </label>
                        <textarea required value={bugDesc} onChange={(e) => setBugDesc(e.target.value)} className={styles.textAreaInput}/>
                    </div>

                    <h2 className={styles.formSectionHeader}>Priority Level</h2>
                    <div className={styles.sectionContainer} id={styles.priorityContainer}>
                        <label>
                            Select the level of priority<span>*</span>
                        </label>
                        {/* Need to highlight selected priority */}
                        <div className={styles.priorityContainer}>
                            <div className={styles.highPriority} id={priority===Priority.HIGH? styles.highlightPrio : ''}>
                                <button className={styles.redBtn} onClick={() => setPriority(Priority.HIGH)} type="button"/>
                                <p className={styles.priorityLabel}>High</p>
                                <p className={styles.priorityDesc}>Get this done ASAP</p>
                            </div>
                            
                            <div className={styles.medPriority} id={priority===Priority.MEDIUM? styles.highlightPrio : ''}>
                                <button className={styles.greyBtn} onClick={() => setPriority(Priority.MEDIUM)} type="button"/>
                                <p className={styles.priorityLabel}>Medium</p>
                                <p className={styles.priorityDesc}>Not Sure</p>
                            </div>

                            <div className={styles.lowPriority} id={priority===Priority.LOW? styles.highlightPrio : ''}>
                                <button className={styles.greenBtn} onClick={() => setPriority(Priority.LOW)} type="button"/>
                                <p className={styles.priorityLabel}>Low</p>
                                <p className={styles.priorityDesc}>When possible</p>
                            </div>
                        </div>

                        <label>When should this bug be resolved by?<span>*</span></label>
                        <input     
                            type="date" 
                            value={targetDate ? targetDate.toISOString().split('T')[0] : ""} 
                            onChange={(e) => setTargetDate(e.target.value ? new Date(e.target.value) : null)} 
                            className={styles.dateInput}
                            required
                        />
                    </div>

                    <div className={styles.formBtnsContainer}>
                        <button className={styles.clearBtn} onClick={clearRequestForm} type="reset">Clear</button>
                        <button className={styles.submitBtn} type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}


export default BugFormPage;