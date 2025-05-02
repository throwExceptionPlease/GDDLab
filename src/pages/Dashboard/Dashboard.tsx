import NavBar from "../../components/NavBar/NavBar";
import ModuleCard from "../../components/ModuleCard/ModuleCard";
import styles from "./Dashboard.module.css";
import { ModuleTeams } from "../../types";

interface DashboardProps {
    moduleGroups: ModuleTeams;
}

const Dashboard = ({ moduleGroups }: DashboardProps) => {
    // next time, dont use modulecardprops, but decalre a Module type in a type file
    return (
        <div>
            <NavBar currPage="Home" />
            {/* non-dynamic for now; groups are fixed */}
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