import {Project} from "../models/project.js";

export const getStudentProject = async (studentId) => {

    return await Project.findOne({ student: studentId }).sort({ createdAt: -1 });
};

export const createProject = async (projectData) => {
    const project = new Project(projectData);
    return await project.save();
};