import { ModuleTeam } from '../../types';
import styles from './ModuleCard.module.css';
import { Link } from "react-router-dom";

export type ModuleCardProps = {
    moduleTeam: ModuleTeam
}

const ModuleCard = (props: ModuleCardProps) => {
    return (
        <div className={styles.cardMainContainer}>
            <div className={styles.imageContainer}>
                <img src={props.moduleTeam.teamImage} className={styles.img} alt="driveImage"/>
            </div>
            <div className={styles.interactiveContainer}>
                <h1 className={styles.teamName}>{props.moduleTeam.teamName}</h1>

                <div className={styles.teamMembersContainer}>
                    {props.moduleTeam.teamMembers.map(member => <p>{member}</p>)}
                </div>
                <div className={styles.teamBoardBtn}>      
                    <Link to={`/team-board/${props.moduleTeam.teamName.replace(/[^a-zA-Z0-9]/g, "")}`}>
                        Team Board
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ModuleCard;