import NavBar from "../../components/NavBar/NavBar";
import ModuleCard from "../../components/ModuleCard/ModuleCard";
import styles from "./Dashboard.module.css";
import { ModuleTeam } from "../../types";

interface DashboardProps {
    moduleGroups: ModuleTeam[];
}

const Dashboard = ({ moduleGroups }: DashboardProps) => {
    return (
        <div>
            <NavBar currPage="Home" />
            <div className={styles.dashboardContainer}>
                {
                    moduleGroups.map(module =>
                        <ModuleCard moduleTeam={module}/>
                    )
                }
            </div>
        </div>
    )
}

export default Dashboard;