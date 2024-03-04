// the object all tasks are stored in on the server
const tasks = {};

// json respond function
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// json meta respond function
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// sends the tasks object to the client
const getTasks = (request, response) => {
  console.log(tasks);
  const responseJSON = {
    tasks,
  };
  respondJSON(request, response, 200, responseJSON);
};

// creates a new task or updates an existing task
const setTask = (request, response, body) => {

  // default message and response case if no name is chosen.
  const responseJSON = {
    message: 'Enter a name for the task.',
  };

  if (!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  // if the task does not exist, create a new task with the name
  if (!tasks[body.name]) {
    responseCode = 201;
    tasks[body.name] = {};
  }

  tasks[body.name].name = body.name;
  tasks[body.name].description = body.description;
  tasks[body.name].stage = body.stage;

  // return creation response code
  if (responseCode === 201) {
    responseJSON.message = 'Task created successfully.';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // otherwise, existing task was updated
  responseJSON.message = 'Task updated successfully.';
  return respondJSON(request, response, responseCode, responseJSON);
};

// function to return not found header
const notFound = (request, response) => {
  respondJSONMeta(request, response, 404);
};

// function to delete task
const deleteTask = (request, response, body) => {

  const responseCode = 204;

  // case if there is no name in name field
  const responseJSON = {
    message: 'Enter a name of a task',
  };

  if (!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // deletes task
  tasks[body.name] = {};

  // sends deletion json to client
  responseJSON.message = 'Task deleted successfully.';
  return respondJSON(request, response, responseCode, responseJSON);
};

module.exports = {
  getTasks,
  setTask,
  deleteTask,
  notFound,
};
