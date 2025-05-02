import styles from "./LogOut.module.css";

const LogOut = () => {
    return (
        <div>
            <p className={styles.logOut}>Log Out</p>
            <p className={"fa fa-sign-out"}></p>
        </div>
    )
}

export default LogOut;