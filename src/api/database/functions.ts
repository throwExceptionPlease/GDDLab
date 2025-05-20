import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { Admin, ModuleTeam, Student, Task } from "../../types";
import { db } from "../firebase";

/* createUser
*  @param Student
*  Since a student and a FL is identifiably unique with their UID, use setDoc to add the user by their UID
*/
export const createUser = async (user: Student | Admin) => {
    try {
        const docRef = await addDoc(collection(db, "Users"), {
            ...user
        });

        console.log("Successfully added user: ", user, "with doc ID: ", docRef.id);
    } catch (error) {
        console.error("There was a problem adding the user: ", error);
    }
}

/* getUserById
* @param User's Firestore-generated document ID
* Returns user data */
export const getUserById = async (docId: string) => {
    const userRef = doc(db, "Users", docId); 

    try {
        const docSnapshot = await getDoc(userRef);

        if (docSnapshot.exists()) {
            console.log("User data:", docSnapshot.data());
            return docSnapshot.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
}

// Alternatively, do it by UID
export const getUserByUid = async (uid: number) => {
    console.log("The uid is: ", uid);
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("uid", "==", uid));

    try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            console.log("User data:", userDoc.data());
            return userDoc.data();
        } else {
            console.log("No user found with uid:", uid);
            return null;
        }
    } catch (error) {
        console.error("Error fetching user by uid:", error);
        return null;
    }
};

export const updateEmailById = async (docId: string, email: string) => {
    const userRef = doc(db, "Users", docId);

    try {
        const docSnapshot = await getDoc(userRef);

        if (docSnapshot.exists()) {
            await updateDoc(userRef, {
                email: email
            });

            console.log("Email updated successfully!");
        } else {
            console.log("User not found.");
        }
    } catch (error) {
        console.error("Error updating email:", error);
    }
}

export const updateEmailByUid = async (uid: number, email: string) => {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("uid", "==", uid));

    try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userRef = doc(db, "Users", userDoc.id);

            await updateDoc(userRef, { email });

            console.log("Email updated successfully!");
        } else {
            console.log("User not found with uid:", uid);
        }
    } catch (error) {
        console.error("Error updating email by uid:", error);
    }
};

export const deleteUserById = async (docId: string) => {
    const userRef = doc(db, "Users", docId);

    try {
        await deleteDoc(userRef);

        console.log("User account deleted successfully!");
    } catch (error) {
        console.error("Error deleting user account:", error);
    }
}

export const deleteUserByUid = async (uid: number) => {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("uid", "==", uid));

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No user found with the specified UID.");
            return;
        }

        const userDoc = querySnapshot.docs[0];
        await deleteDoc(doc(db, "Users", userDoc.id));

        console.log("User account deleted successfully!");
    } catch (error) {
        console.error("Error deleting user account:", error);
    }
}

export const updateUserByUid = async (
    user: Student | Admin,
    updateData: Partial<Student> | Partial<Admin>
  ) => {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("uid", "==", user.uid));
  
    try {
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.log("No user found with the specified UID.");
        return;
      }
  
      const userDoc = querySnapshot.docs[0];
      const userDocRef = doc(db, "Users", userDoc.id);
  
      await updateDoc(userDocRef, updateData);
  
      console.log("User account updated successfully!");
    } catch (error) {
      console.error("Error updating user account:", error);
    }
  };

//updatePassword
export const updatePasswordById = async (docId: string, password: string) => {
    const userRef = doc(db, "Users", docId);

    try {
        const docSnapshot = await getDoc(userRef);

        if (docSnapshot.exists()) {
            await updateDoc(userRef, {
                password: password
            });

            console.log("Password updated successfully!");
        } else {
            console.log("User not found.");
        }
    } catch (error) {
        console.error("Error updating password:", error);
    }
}

export const assignStudentToModule = async (user: Student, moduleTeam: ModuleTeam) => {
    try {
        // Find the ModuleTeam doc by teamName
        const q = query(collection(db, "ModuleTeam"), where("teamName", "==", moduleTeam.teamName));
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.empty) {
          console.error("No module team found with that name.");
          return;
        }
    
        const moduleTeamDoc = querySnapshot.docs[0];
        const moduleTeamId = moduleTeamDoc.id;
    
        // Add student to the moduleTeam's `students` array
        const moduleTeamRef = doc(db, "ModuleTeam", moduleTeamId);
        await updateDoc(moduleTeamRef, {
          students: arrayUnion(user.uid)
        });
        console.log(`Student ${user.uid} assigned to module team ${moduleTeam.teamName}.`);
    
        // Update student's assigned team
        const studentRef = doc(db, "Students", String(user.uid));
        await updateDoc(studentRef, {
          moduleTeam: moduleTeam.teamName
        });
        console.log(`Student ${user.uid}'s moduleTeam field updated.`);
    
      } catch (error) {
        console.error("Error assigning student to module:", error);
      }
};

//getAllStudents
export const getAllStudents = async () => {
    const usersSnapshot = await getDocs(collection(db, "Users"));
    const usersList = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            uid: data.uid,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            moduleTeam: data.moduleTeam,
            prm: data.prm,
            birthday: data.birthday,
            password: data.password
        };
    });

    console.log("All the students: ", usersList);
    return usersList;
}

//getAllAdmins
export const getAllAdmins = async () => {
    const adminsSnapshot = await getDocs(collection(db, "Admins"));
    const adminsList = adminsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    console.log("All admins: ", adminsList);
    return adminsList;
}

//getPRMS
export const getAllPRMS = async (): Promise<Student[]> => {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("prm", "==", true));

    try {
        const querySnapshot = await getDocs(q);
        const prmList: Student[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                uid: data.uid,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                moduleTeam: data.moduleTeam,
                prm: data.prm,
                birthday: data.birthday,
                password: data.password
            };
        });

        console.log("List of PRMS: ", prmList);
        return prmList;
    } catch (error) {
        console.error("Error fetching PRMs:", error);
        return [];
    }
};

//getAllTasks
export const getAllTasks = async (fromTeam: boolean, team?: ModuleTeam) => {
    if (fromTeam && team) {
        return team.tasks;
    } else {
        // Get all tasks from the "Tasks" collection
        const tasksRef = collection(db, "Tasks");
        const tasksSnapshot = await getDocs(tasksRef);

        const tasks = tasksSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return tasks;
    }
};

//add task to module team and to Tasks collection
export const addTask = async (moduleTeam: ModuleTeam, task: Task) => {
    console.log("team name: ", moduleTeam.teamName)
    try {
        const docRef = await addDoc(collection(db, "Tasks"), {
            ...task,
            taskId: ""
        });

        console.log("Successfully added task: ", task, "with doc ID: ", docRef.id);
        
        await updateDoc(docRef, {
            taskId: docRef.id
        });

        // query for team
        const q = query(
            collection(db, "ModuleTeams"), 
            where("teamName", "==", moduleTeam.teamName)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const teamDoc = querySnapshot.docs[0];
            const teamDocRef = doc(db, "ModuleTeams", teamDoc.id);

            // update the team's tasks
            await updateDoc(teamDocRef, {
                tasks: arrayUnion({
                    ...task,
                    taskId: docRef.id // add task id
                })
            });

            console.log("Task added to the ModuleTeam's task array.");
            return docRef.id
        } else {
            console.error("No matching ModuleTeam found.");
        }

        // return task id ultimately
        return docRef.id
    } catch (error) {
        console.error("There was a problem adding the task or updating the ModuleTeam:", error);
    }
};

//getTask
export const getTask = async (taskId: string): Promise<Task | null> => {
    try {
        const taskRef = doc(db, "Tasks", taskId);
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
            const data = taskSnap.data();
            const task: Task = {
                taskId: taskSnap.id,
                priority: data.priority ?? null,
                desc: data.desc ?? "",
                title: data.title ?? "",
                dueDate: data.dueDate ?? undefined,
                assignees: data.assignees ?? null,
                attachments: Array.isArray(data.attachments) ? data.attachments : [],
                taskType: data.taskType ?? "Task",
                reviewer: data.reviewer ?? undefined,
                status: data.status ?? "Todo"
            };
            return task;
        } else {
            console.warn("No task found with ID:", taskId);
            return null;
        }
    } catch (error) {
        console.error("Error fetching task:", error);
        return null;
    }
};

//deleteTask
export const deleteTask = async (docId: string, moduleTeam: ModuleTeam) => {
    try {
        const taskRef = doc(db, "Tasks", docId);
        await deleteDoc(taskRef);
        console.log(`Task with ID ${docId} deleted from 'Tasks' collection.`);

        // Query the ModuleTeam document
        const q = query(collection(db, "ModuleTeams"), where("teamName", "==", moduleTeam.teamName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const moduleTeamDoc = querySnapshot.docs[0];
            const moduleTeamId = moduleTeamDoc.id;
            const moduleTeamRef = doc(db, "ModuleTeams", moduleTeamId);
            const tasks = moduleTeamDoc.data().tasks || [];

            // Find the task object that matches by taskId
            const taskToRemove = tasks.find((task: any) => task.taskId === docId);

            if (taskToRemove) {
                await updateDoc(moduleTeamRef, {
                    tasks: arrayRemove(taskToRemove)
                });
                console.log(`Task with ID ${docId} removed from moduleTeam (${moduleTeam.teamName})'s tasks array.`);
            } else {
                console.warn(`Task with ID ${docId} not found in moduleTeam (${moduleTeam.teamName})'s tasks array.`);
            }
        } else {
            console.error("Module team not found.");
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
};

//updateTask
export const updateTask = async (docId: string, updatedTask: Partial<any>, moduleTeam: ModuleTeam) => {
    try {
        const taskRef = doc(db, "Tasks", docId);
        await updateDoc(taskRef, updatedTask);
        console.log(`Task with ID ${docId} updated successfully in 'Tasks' collection.`);

        const q = query(collection(db, "ModuleTeams"), where("teamName", "==", moduleTeam.teamName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const moduleTeamDoc = querySnapshot.docs[0];
            const moduleTeamId = moduleTeamDoc.id;

            const moduleTeamRef = doc(db, "ModuleTeams", moduleTeamId);
            const tasks: Task[] = moduleTeamDoc.data().tasks || [];

            const fullTask: Task = {
                ...updatedTask,
                taskId: docId,
            } as Task;

            // Find the old task by taskId
            const existingTask = tasks.find((task: Task) => task.taskId === docId);
            if (existingTask) {
                // Remove the old version of the task
                await updateDoc(moduleTeamRef, {
                    tasks: arrayRemove(existingTask)
                });
            }

            // Add the updated task
            await updateDoc(moduleTeamRef, {
                tasks: arrayUnion(fullTask)
            });

            console.log(`Task ID ${docId} updated in moduleTeam (${moduleTeam.teamName})'s tasks array.`);
        } else {
            console.error("Module team not found.");
        }
    } catch (error) {
        console.error("Error updating task:", error);
    }
};

//getAllModuleTeams
export const getAllModuleTeams = async () => {
    try {
        const moduleRef = collection(db, "ModuleTeams");
        const moduleSnapshot = await getDocs(moduleRef);

        const moduleTeams = moduleSnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<ModuleTeam, 'id'>)
        }));

        console.log("Retrieved module teams: ", moduleTeams);

        return moduleTeams;
    } catch (error) {
        console.log("Error with retrieving all module groups: ", error);
    }
}

//createModuleTeam
export const createModuleTeam = async (newTeam: ModuleTeam) => {
    try {
        const docRef = await addDoc(collection(db, "ModuleTeams"), {
            ...newTeam
        });

        console.log("Successfully added module team: ", newTeam, "with doc ID: ", docRef.id);
    } catch (error) {
        console.error("There was a problem adding the module team: ", error);
    }
}

//getModuleTeamByName
export const getModuleTeamByName = async (teamName: string) => {
    console.log("the team name is: ", teamName);
    try {
        const q = query(collection(db, "ModuleTeams"), where("teamName", "==", teamName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            console.log("Found the following team: ", {id: doc.id, ...doc.data()});

            return { id: doc.id, ...(doc.data() as Omit<ModuleTeam, 'id'>) };
        } else {
            console.log("No module team found with that name.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching module team:", error);
        return null;
    }
}

//deleteModuleTeamByName
export const deleteModuleTeam = async (moduleTeam: ModuleTeam) => {
    try {
      const q = query(collection(db, "ModuleTeams"), where("teamName", "==", moduleTeam.teamName));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.error("No module team found with that name.");
        return;
      }
  
      const moduleTeamDoc = querySnapshot.docs[0];
      const moduleTeamId = moduleTeamDoc.id;
  
      // Delete all associated tasks
      if (moduleTeam.tasks && moduleTeam.tasks.length > 0) {
        for (const task of moduleTeam.tasks) {
          if (task.taskId) {
            const taskData = await getTask(task.taskId);
            if (taskData) {
              const taskRef = doc(db, "Tasks", task.taskId);
              await deleteDoc(taskRef);
              console.log(`Deleted associated task with ID: ${task.taskId}`);
            }
          }
        }
      }
  
      // Delete the module team document
      const moduleTeamRef = doc(db, "ModuleTeams", moduleTeamId);
      await deleteDoc(moduleTeamRef);
      console.log(`Module team '${moduleTeam.teamName}' deleted successfully.`);
    } catch (error) {
      console.error("Error deleting module team:", error);
    }
  };

export const deleteModuleTeamById = async (id: string) => {
    try {
        const teamRef = doc(db, "ModuleTeams", id);
        if (teamRef) {
            await deleteDoc(teamRef);
            console.log("Deleted team");
        }
    } catch (error) {
        console.error("Error deleting module team by id: ", error)
    }
}
  
export const updateTeamById = async (id: string, data: Partial<ModuleTeam> ) => {
    try {
        const teamRef = doc(db, "ModuleTeams", id);
        await updateDoc(teamRef, data);
        console.log("Team successfully updated!");
    } catch (error) {
        console.error("Error updating team:", error);
    }
};

export const updateUserById = async (uid: string, data: Partial<Student>) => {
    try {
        const studentRef = doc(db, "Users", uid);
        await updateDoc(studentRef, data);
        console.log("Updated student successfully!");
    } catch (error) {
        console.error("Error updating user: ", error);
    }
}

export const addStudentToTeam = async (student: Student, team: ModuleTeam) => {
    if (!team?.id) {
        console.error("Invalid team specified.");
        return false;
    }

    try {
        // Remove student from any existing team
        const q = query(collection(db, "ModuleTeams"), where("teamMembers", "array-contains", student));
        const querySnapshot = await getDocs(q);

        for (const docSnapshot of querySnapshot.docs) {
            const existingTeamRef = doc(db, "ModuleTeams", docSnapshot.id);
            await updateDoc(existingTeamRef, {
                teamMembers: arrayRemove(student)
            });
        }

        // Add student to the new team
        const teamRef = doc(db, "ModuleTeams", team.id);
        await updateDoc(teamRef, {
            teamMembers: arrayUnion(student)
        });

        console.log("Student moved to the new team successfully.");
        return true;
    } catch (error) {
        console.error("Error managing student team:", error);
        return false;
    }
};

export const getTeamMembers = async (currEditTeam: string) => {
    try {
        const q = query(collection(db, "ModuleTeams"), where("teamName", "==", currEditTeam));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const teamDoc = querySnapshot.docs[0];
            const teamData = teamDoc.data();

            const teamMembers = teamData.teamMembers; // This should be an array
            console.log("Team members:", teamMembers);
            return teamMembers;
        } else {
            console.warn("No module team found with that name.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching team members:", error);
        return [];
    }
};