const tasks = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const getTasks = (request, response) => {
  const responseJSON = {
    tasks,
  };
  respondJSON(request, response, 200, responseJSON);
};

const setTask = (request, response, body) => {
  const responseJSON = {
    message: 'Enter a name for the task.',
  };

  if (!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!tasks[body.name]) {
    responseCode = 201;
    tasks[body.name] = {};
  }

  tasks[body.name].name = body.name;
  tasks[body.name].stage = body.stage;

  if (responseCode === 201) {
    responseJSON.message = 'Task created successfully.';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  responseJSON.message = 'Task updated successfully.';
  return respondJSON(request, response, responseCode, responseJSON);
};

module.exports = {
  getTasks,
  setTask,
};
