import { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import styles from './RequestFormPage.module.css';
import { useNavigate } from 'react-router-dom';
import { ModuleTeam, Priority, RequestForm } from '../../types';

const RequestFormPage = ({ moduleTeams }: { moduleTeams: ModuleTeam[] }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [moduleTeam, setModuleTeam] = useState('');
    const [assetType, setAssetType] = useState('');
    const [pageDesc, setPageDesc] = useState('');
    const [assetTitle, setAssetTitle] = useState('');
    const [assetLink, setAssetLink] = useState('');
    const [assetDesc, setAssetDesc] = useState('');
    const [priority, setPriority] = useState<Priority | null>(null);
    const [targetDate, setTargetDate] = useState<Date | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        // console.log(name, email, moduleTeam, assetType, pageDesc, assetTitle, assetLink, assetDesc, priority, targetDate);
    }, [name, email, moduleTeam, assetType, pageDesc, assetTitle, assetLink, assetDesc, priority, targetDate]);

    const clearRequestForm = () => {
        setName('');
        setEmail('');
        setModuleTeam('');
        setAssetType('');
        setAssetDesc('');
        setAssetTitle('');
        setAssetLink('');
        setPriority(null);
        setTargetDate(null);
    }

    const processRequestForm = (event: React.FormEvent) => {
        event.preventDefault();
        
        const form: RequestForm = {
            name: name,
            email: email,
            moduleTeam: moduleTeam,
            assetType: assetType,
            assetDesc: assetDesc,
            assetTitle: assetTitle,
            assetLink: assetLink,
            priority: priority,
            targetDate: targetDate
        }
        console.log(form)
        // send form here

        // Then navigate to confirmation page
        navigate('/confirmation', {state: {formType: "Request", email: email}}); 
    }

    return (
        <>
            <NavBar currPage='Request Form'/>
            <div className={styles.pageContainer}>
                <form className={styles.formMainContainer} onSubmit={processRequestForm}>
                    <h1 className={styles.formHeader}>Request Form</h1>
                    <p className={styles.formDesc}>
                        This form is the first process in implementing/adding the requested feature or content. 
                        Once submitted, the form will be handed to Human-Centered Design who will contact the POC for feedback and approval. 
                        Finally, the design will be handed to Infrastructure and Interface for implementation.
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
                                <option key={index} value={team.teamName}>{team.teamName}</option>
                            ))}
                        </select>
                    </div>

                    <h2 className={styles.formSectionHeader}>
                            Asset Information
                    </h2>
                    <div className={styles.sectionContainer}>
                        <label>Please indicate the type of asset<span>*</span>
                            <br></br>
                            There are two choices: Content and Feature. Content is a body of information to be migrated in the toolkit or in an affiliated, 
                            pre-existing tool. Feature is a tool that does not yet exist anywhere.
                        </label>
                        <select value={assetType} onChange={(e) => setAssetType(e.target.value)} className={styles.dropDownInput} required>
                            <option value="" disabled>Select asset type</option>
                            <option value="Content">Content</option>
                            <option value="Feature">Feature</option>
                        </select>

                        <label>If this is content-related, what page and/or where in the page specifically should the asset be? {assetType==="Content"? <span>*</span> : ''}</label>
                        <textarea value={pageDesc} onChange={(e) => setPageDesc(e.target.value)} className={styles.textAreaInput} required={assetType==="Content"? true : false}/>

                        <label>What is the title of the asset?<span>*</span></label>
                        <input type="text" value={assetTitle} onChange={(e) => setAssetTitle(e.target.value)} className={styles.simpleInput} required />

                        <label>Please put your document(s) of the asset in a google folder and paste the link below.<span>*</span>
                            <br></br>
                            Attach the link to the google folder: 
                        </label>
                        <input type="text" value={assetLink} onChange={(e) => setAssetLink(e.target.value)} className={styles.simpleInput} required/>
                        
                        <label>
                            Please provide a <b>detailed</b> description of the purpose of the asset, what it encases, and (if applicable) how it is supposed to function.<span>*</span>
                        </label>
                        <textarea required value={assetDesc} onChange={(e) => setAssetDesc(e.target.value)} className={styles.textAreaInput}/>
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

                        <label>When should this feature be implemented by?<span>*</span></label>
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

export default RequestFormPage;