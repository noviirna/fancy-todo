const Project = require(`../models/project`);
const { decodeToken } = require(`../helpers/token`);
const {ObjectId} = require('mongodb')
class ControllerProject {
  static all(req, res, next) {
    let user = decodeToken(req.headers.token)._id;
    Project.find()
    
      .then(founds => {
        let result= []
        founds.forEach(found=>{
          if(found.members.indexOf(user) !== -1){
            result.push(found)
          }
        })
        console.log(result, "all project");
        res.status(200).json(result);
      })
      .catch(next);
  }

  static detail(req, res, next) {
    Project.findById(req.params.id)
      .then(found => {
        res.status(200).json(found);
      })
      .catch(next);
  }

  static create(req, res, next) {
    console.log(req.body);
    const input = {
      owner: req.body.owner,
      name: req.body.name,
      description: req.body.description,
      members: req.body["members[]"]
    };
    Project.create(input)
      .then(created => {
        res.status(201).json(created);
      })
      .catch(next);
  }

  static update(req, res, next) {
    Project.findByIdAndUpdate(req.params.id, req.body)
      .then(updated => {
        res.status(200).json(updated);
      })
      .catch(next);
  }

  static delete(req, res, next) {
    Project.findByIdAndDelete(req.params.id)
      .then(deleted => {
        res.status(200).json(deleted);
      })
      .catch(next);
  }
}

module.exports = ControllerProject;