import { asyncHandler } from "../middlewares/asyncHandler.js";
import * as userServices from "../services/userService.js";
import { User } from "../models/user.js";
import * as projectServices from "../services/projectService.js";

export const getStudentProject = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { project } = await projectServices.getStudentProject(studentId);

  if (project) {
    return res.status(200).json({
      success: true,
      data: { project: null },
      message: "No project found for the student",
    });
  }
  res.status(200).json({
    success: true,
    data: { project },
    message: "Project retrieved successfully",
  });
});

export const submitProposal = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  const studentId = req.user._id;

  const existingUser = await projectServices.getStudentProject(studentId);
  if (existingUser && existingUser.status !== "rejected") {
    return next(
      new Error(
        "Student already has a project assigned or pending approval",
        400,
      ),
    );
  }

  const projectData = {
    status: studentId,
    title,
    description,
  };
  const project = await projectServices.createProject(projectData);
  await User.findByIdAndUpdate(studentId, { project: project._id });

  res.status(201).json({
    success: true,
    data: { project },
    message: "Project created successfully",
  });
});

