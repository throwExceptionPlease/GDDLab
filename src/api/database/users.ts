import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { ModuleTeam, Student, Task } from "../../types";
import { db } from "../firebase";
import Module from "module";

/* createUser
*  @param Student
*  Since a student identifiably unique with their UID, use setDoc to add the user by their UID
*  Did not use addDoc because a newly generated doc id is not needed
*/
export const createUser = async (user: Student) => {
    try {
        // Create a new document in the "Users" collection and get the generated document ID
        const docRef = await addDoc(collection(db, "Users"), {
            ...user
        });

        console.log("Successfully added student: ", user, "with doc ID: ", docRef.id);
    } catch (error) {
        console.error("There was a problem adding the student: ", error);
    }
}

/* getUserById
* @param User's Firestore-generated document ID
* Returns user data */
export const getUserById = async (docId: string) => {
    const userRef = doc(db, "Users", docId);  // Use the Firestore-generated document ID

    try {
        const docSnapshot = await getDoc(userRef);

        if (docSnapshot.exists()) {
            console.log("User data:", docSnapshot.data());
            return docSnapshot.data();  // Return user data
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
}

// Update Email by Firestore-generated document ID
export const updateEmailById = async (docId: string, email: string) => {
    const userRef = doc(db, "Users", docId);

    try {
        const docSnapshot = await getDoc(userRef);

        // Check if the document exists
        if (docSnapshot.exists()) {
            // If the document exists, update the email
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

const assignStudentToModule = async (user: Student, moduleTeam: ModuleTeam) => {
    try {
        // Step 1: Find the ModuleTeam doc by teamName
        const q = query(collection(db, "ModuleTeam"), where("teamName", "==", moduleTeam.teamName));
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.empty) {
          console.error("No module team found with that name.");
          return;
        }
    
        const moduleTeamDoc = querySnapshot.docs[0];
        const moduleTeamId = moduleTeamDoc.id;
    
        // Step 2: Add student to the moduleTeam's `students` array
        const moduleTeamRef = doc(db, "ModuleTeam", moduleTeamId);
        await updateDoc(moduleTeamRef, {
          students: arrayUnion(user.uid)
        });
        console.log(`Student ${user.uid} assigned to module team ${moduleTeam.teamName}.`);
    
        // Step 3: Optionally update the student document to reflect their module team
        const studentRef = doc(db, "Students", String(user.uid));
        await updateDoc(studentRef, {
          moduleTeam: moduleTeam.teamName // or moduleTeamId if you prefer referencing by doc ID
        });
        console.log(`Student ${user.uid}'s moduleTeam field updated.`);
    
      } catch (error) {
        console.error("Error assigning student to module:", error);
      }
};

//deleteAccountById
export const deleteAccountById = async (docId: string) => {
    const userRef = doc(db, "Users", docId);

    try {
        await deleteDoc(userRef);

        console.log("User account deleted successfully!");
    } catch (error) {
        console.error("Error deleting user account:", error);
    }
}

export const deleteAccountByUid = async (uid: number) => {
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

export const updateAccountByUid = async (user: Partial<Student>) => {
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

        const { uid, ...updateData } = user;

        await updateDoc(userDocRef, updateData);

        console.log("User account updated successfully!");
    } catch (error) {
        console.error("Error updating user account:", error);
    }
}

//updatePassword
export const updatePasswordById = async (docId: string, password: string) => {
    const userRef = doc(db, "Users", docId);

    try {
        const docSnapshot = await getDoc(userRef);

        // Check if the document exists
        if (docSnapshot.exists()) {
            // If the document exists, update the email
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

//getAllUsers
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
        id: doc.id,  // Include the Firestore document ID
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
        // Return tasks directly from the team object
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
    try {
        const docRef = await addDoc(collection(db, "Tasks"), {
            ...task
        });
        console.log("Successfully added task: ", task, "with doc ID: ", docRef.id);

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
export const getTask = async (taskId: string) => {
    try {
        const taskRef = doc(db, "Tasks", taskId);
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
            return {
                id: taskSnap.id,
                ...taskSnap.data()
            };
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

        const q = query(collection(db, "ModuleTeam"), where("teamName", "==", moduleTeam.teamName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const moduleTeamDoc = querySnapshot.docs[0];
            const moduleTeamId = moduleTeamDoc.id; 

            //remove from array
            const moduleTeamRef = doc(db, "ModuleTeam", moduleTeamId);
            await updateDoc(moduleTeamRef, {
                tasks: arrayRemove(docId)
            });

            console.log(`Task ID ${docId} removed from moduleTeam (${moduleTeam.teamName})'s tasks array.`);
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

        const q = query(collection(db, "ModuleTeam"), where("teamName", "==", moduleTeam.teamName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const moduleTeamDoc = querySnapshot.docs[0];
            const moduleTeamId = moduleTeamDoc.id;

            const moduleTeamRef = doc(db, "ModuleTeam", moduleTeamId);

            await updateDoc(moduleTeamRef, {
                tasks: arrayRemove(docId)
            });

            await updateDoc(moduleTeamRef, {
                tasks: arrayUnion(docId)
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
    try {
        const q = query(collection(db, "ModuleTeams"), where("teamName", "==", teamName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Return the first matching team document
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
          if (task.id) {
            const taskData = await getTask(task.id);
            if (taskData) {
              const taskRef = doc(db, "Tasks", task.id);
              await deleteDoc(taskRef);
              console.log(`Deleted associated task with ID: ${task.id}`);
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
  
export const updateTeamById = async (id: string, data: Partial<ModuleTeam> ) => {
    try {
        const teamRef = doc(db, "ModuleTeams", id);
        await updateDoc(teamRef, data);
        console.log("Team successfully updated!");
    } catch (error) {
        console.error("Error updating team:", error);
    }
};

export const updateUserById = async (id: string, data: Partial<Student>) => {
    try {
        const studentRef = doc(db, "Users", id);
        await updateDoc(studentRef, data);
        console.log("Updated student successfully!");
    } catch (error) {
        console.error("Error updating user: ", error);
    }
}