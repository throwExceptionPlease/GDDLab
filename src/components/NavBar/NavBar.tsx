import styles from "./NavBar.module.css";

type NavBarProps = {
    currPage: string
}

const NavBar = (props: NavBarProps) => {
    return (
        <div className={styles.navBarContainer}>
            {/* For future reference: Pass logo name as a paramater; logo name will be fetched in backend to make it more dynamic */}
            <div className={styles.logoContainer}>
                <a href="/" className={styles.logoName}>GDDLab</a>
            </div>
            <div className={styles.rightContainer}>
                <a
                href="/"
                className={props.currPage === "Home"? styles.activeHeader : ""}
                >
                    Home
                </a>
                <div className={styles.formsDropdown}>
                    <button
                    className={props.currPage === "Request Form" || props.currPage === "Bug Form"? styles.activeHeader : ""}
                    >
                        Forms
                    </button>
                    <div className={styles.droppedItemsContainer}>
                        <div className={styles.droppedItemsFlex}>
                            <a 
                            href="/request-form"
                            className={props.currPage === "Request Form"? styles.activeHeader : ""}
                            id={styles.formItem}
                            >
                                Request Form
                            </a>
                            <a 
                            href="/bug-form"
                            className={props.currPage === "Bug Form"? styles.activeHeader : ""}
                            id={styles.formItem}
                            >
                                Bug Form
                            </a>
                            <a 
                            href="/how-to-forms"
                            className={props.currPage === "How To"? styles.activeHeader : ""}
                            id={styles.formItem}
                            >
                                How to Fill Out The Forms
                            </a>
                        </div>
                    </div>
                </div>
                <a 
                href="/schedules"
                className={props.currPage === "Schedules"? styles.activeHeader : ""}
                >
                    Schedules
                </a>

                <a
                href="/manage"
                className={props.currPage === "Manage"? styles.activeHeader : ""}
                >
                    Manage
                </a>

                <a 
                href="/about"
                className={props.currPage === "About"? styles.activeHeader : ""}
                >
                    About
                </a>
            </div>
        </div>
    )
}

export default NavBar;