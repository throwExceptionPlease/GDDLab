import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from './pages/Dashboard/Dashboard';
import About from './pages/About/About';
import RequestFormPage from './pages/RequestFormPage/RequestFormPage';
import BugForm from './pages/BugFormPage/BugFormPage';
import FormConfirmation from './components/FormConfirmation/FormConfirmation';
import TeamBoard from './components/TeamBoard/TeamBoard';
import { ModuleTeams, Student } from './types';
import ManagePage from './pages/ManagePage/ManagePage';
import Test from './test/Test';
import { getAllModuleTeams, getAllPRMS, getAllStudents } from './api/database/users';
import { useEffect, useState } from 'react';

function App() {
  const moduleGroups: ModuleTeams = [
    {
        teamName: "Ethics of AI",
        teamMembers: ["Justin Jones", "Ashlyn Wu", "Roman Jensen", "Zoey Katz", "William Bachran"],
        teamImage: '/assets/DevEthicsLogo.svg',
        tasks: []
    },
    {
        teamName: "Human Centered Design",
        teamMembers: ["Rowan Kuske", "Sumer Elsalawi", "Arvind Kakanavaram", "Donovan Campos", "Madeline Namias", "Isabella Canlas"],
        teamImage: '/assets/hcdlogo.svg',
        tasks: []
    },
    {
        teamName: "Training Knowledge & Development",
        teamMembers: ["Javon Lecky", "Eric Li", "Nora Grennon", "MeiMei Castranova"],
        teamImage: '/assets/TrainingKnowledge.svg',
        tasks: []
    },
    {
        teamName: "Project Planning",
        teamMembers: ["Ruth Whitehouse", "Jaspreet Soni", "Grace Wieber", "Neeraja Yasam"],
        teamImage: "/assets/projectplanning.svg",
        tasks: []
    },
    {
        teamName: "Project Evaluation",
        teamMembers: ["Jiun Park", "Alia Mulbagal", "Avery Demarco", "Alyson Barzola"],
        teamImage: "/assets/ProjectEval.svg" ,
        tasks: []
    },
    {
        teamName: "Infrastructure and Interface",
        teamMembers: ["Rohan Tadisetty", "Raymond Wu", "Inemesit Udo-Akang", "Saikousil Tirumalasetty"],
        teamImage: "/assets/infint.svg" ,
        tasks: []
    },
    {
        teamName: "AI Development",
        teamMembers: ["Krishnan Tholkappian", "Richard Thomas", "Siddhant Jain", "Youssef Ali Ahmed", "Nakshatra Hiray", "Esha Vigneswaran"],
        teamImage: "/assets/aidev.jpg" ,
        tasks: []
    },
    {
        teamName: "Maldevelopment",
        teamMembers: ["Eugene Choi", "Emelia Adler", "Lexi Bernstein", "Dani Hikin"],
        teamImage: "/assets/maldevelopment.jpg" ,
        tasks: []
    },
    {
        teamName: "Public Policy",
        teamMembers: ["Shirin Saberi", "Alexa Schwartz", "Mitchel Kuta", "Nola Tischler", "Antonella Almendariz"],
        teamImage: "/assets/publicpol.svg" ,
        tasks: []
    },
    {
        teamName: "Marketing and Outreach",
        teamMembers: ["Sabeen Kirwi", "Rory Gilmore", "Darian Tamami", "Sophia Tamayo", "Nolan Rogalski", "Nevan Vando"],
        teamImage: "/assets/marketing.png" ,
        tasks: []
    }
  ];
  const sampleTeamNames = moduleGroups.map(group => group.teamName);

  const [moduleGroups2, setModuleGroups2] = useState<ModuleTeams>([]);
  const [loading, setLoading] = useState(true); // use for loading page
   const [prmsList, setPrmsList] = useState<Student[]>([]);
   const [studentsList, setStudentsList] = useState<Student[]>([]);

   useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
  
      try {
        const teams = await getAllModuleTeams();
        setModuleGroups2(teams || []);
      } catch (err) {
        console.error("Error fetching teams", err);
      }
  
      try {
        const prms = await getAllPRMS();
        setPrmsList(prms || []);
        console.log(prmsList);
      } catch (err) {
        console.error("Error fetching PRMs", err);
      }

      try {
        const students = await getAllStudents();
        setStudentsList(students || []);
        console.log(students);
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
          <Route path="/" element={<Dashboard moduleGroups={moduleGroups} />} />
          <Route path="/request-form" element={<RequestFormPage moduleTeams={sampleTeamNames}/>} />
          <Route path="/bug-form" element={<BugForm moduleTeams={sampleTeamNames}/>} />
          <Route path="/manage" element={loading? <p>loading....</p> : <ManagePage moduleGroups={moduleGroups2} prms={prmsList} students={studentsList}/>} /> {/* need to pass in user auth */}
          <Route path="/about" element={<About />} />
          <Route path="/confirmation" element={<FormConfirmation />} />
          <Route path="/team-board/:teamName" element={<TeamBoard moduleGroups={moduleGroups} students={studentsList}/>} />

          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
