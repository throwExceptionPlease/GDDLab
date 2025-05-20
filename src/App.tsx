import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from './pages/Dashboard/Dashboard';
import About from './pages/About/About';
import RequestFormPage from './pages/RequestFormPage/RequestFormPage';
import BugForm from './pages/BugFormPage/BugFormPage';
import FormConfirmation from './components/FormConfirmation/FormConfirmation';
import TeamBoard from './components/TeamBoard/TeamBoard';
import { ModuleTeam, Student } from './types';
import ManagePage from './pages/ManagePage/ManagePage';
import Test from './test/Test';
import { getAllModuleTeams, getAllPRMS, getAllStudents, getAllTasks } from './api/database/functions';
import { useEffect, useState } from 'react';

function App() {
  const [moduleGroups2, setModuleGroups2] = useState<ModuleTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [prmsList, setPrmsList] = useState<Student[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [teams, setTeams] = useState<ModuleTeam[]>([]);

   useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const teamsRes = await getAllModuleTeams();
        setTeams(teamsRes || []);
        setModuleGroups2(teamsRes || []);
      } catch (err) {
        console.error("Error fetching teams", err);
      }

      try {
        const prms = await getAllPRMS();
        setPrmsList(prms || []);
      } catch (err) {
        console.error("Error fetching PRMs", err);
      }

      try {
        const students = await getAllStudents();
        setStudentsList(students || []);
      } catch (err) {
        console.error("Error fetching all of the students", err);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard moduleGroups={teams} />} />
          <Route path="/request-form" element={<RequestFormPage moduleTeams={teams}/>} />
          <Route path="/bug-form" element={<BugForm moduleTeams={teams}/>} />
          <Route path="/manage" element={loading ? <p>loading....</p> : <ManagePage moduleGroups={moduleGroups2} prms={prmsList} students={studentsList}/>} />
          <Route path="/about" element={<About />} />
          <Route path="/confirmation" element={<FormConfirmation />} />
          <Route path="/team-board/:teamName" element={loading? <p>Loading....</p> : <TeamBoard moduleGroups={teams} students={studentsList}/>} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;