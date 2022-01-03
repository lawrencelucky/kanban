const Task = require('../models/Task');
const { StatusCodes } = require('http-status-codes');

const getAllTasks = async (req, res) => {
  const tasks = await Task.find({});
  res.send('Get all tasks');
};

const getTask = async (req, res) => {
  res.send('Get single task');
};

const createTask = async (req, res) => {
  res.send('Create task');
};

const updateTask = async (req, res) => {
  res.send('Update task');
};

const deleteTask = async (req, res) => {
  res.send('Delete task');
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
