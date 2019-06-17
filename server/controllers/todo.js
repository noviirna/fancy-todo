const Todo = require(`../models/todo`);
const { decodeToken } = require(`../helpers/token`);

class ControllerTodo {
  static all(req, res, next) {
    let user = decodeToken(req.headers.token)._id;
    Todo.find({})
      .populate("project")
      .then(founds => {
        let result = [];
        founds.forEach(todo => {
          if (todo.project) {
            let members = todo.project.members;
            if (members.indexOf(user) !== -1) {
              result.push(todo);
            }
          } else {
            if (todo.owner == user) {
              result.push(todo);
            }
          }
        });
        res.status(200).json(result);
      })
      .catch(next);
  }

  static detail(req, res, next) {
    Todo.findById(req.params.id)
      .then(found => {
        res.status(200).json(found);
      })
      .catch(next);
  }

  static project(req, res, next) {
    Todo.find({ project: req.params.projectId })
      .populate("project")
      .then(founds => {
        res.status(200).json(founds);
      })
      .catch(next);
  }

  static create(req, res, next) {
    Todo.create(req.body)
      .then(created => {
        res.status(201).json(created);
      })
      .catch(next);
  }

  static update(req, res, next) {
    Todo.findByIdAndUpdate(req.params.id, req.body)
      .then(updated => {
        console.log("disini")
        res.status(200).json(updated);
      })
      .catch(next);
  }

  static delete(req, res, next) {
    Todo.findByIdAndDelete(req.params.id)
      .then(deleted => {
        res.status(200).json(deleted);
      })
      .catch(next);
  }
}

module.exports = ControllerTodo;
