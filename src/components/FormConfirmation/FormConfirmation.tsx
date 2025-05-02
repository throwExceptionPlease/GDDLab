import styles from "./FormConfirmation.module.css";
import NavBar from "../NavBar/NavBar";
import { useLocation } from 'react-router-dom';

const FormConfirmation = () => {
    const location = useLocation();
    const { formType, email } = location.state || {};
    console.log(formType, email);

    return (
        <>
            <NavBar currPage="" />
            <div className={styles.confirmationPage}>
                <div className={styles.confirmationContainer}>
                    <p>Thank you for submitting the <b>{formType}</b> form.</p>
                    <p>Please reach out to Benjamin Huffman at <span className={styles.profEmail}>bhuffman@umd.edu</span> or via SLACK if you have any questions, concerns, or would like to provide additional information about your ticket.</p>
                    {/* <p>A copy for your form response has been sent to: <b>{email}</b>.</p> */}
                    <p>If you'd like to change your response, please reach out to <span className={styles.profEmail}>bhuffman@umd.edu</span> or resubmit the form.</p>
                    <p>You may leave this page.</p>
                </div>
            </div>
        </>
        
    )
}

export default FormConfirmation;