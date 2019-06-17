const jwt = require(`jsonwebtoken`);
const User = require(`../models/user`);
const Todo = require(`../models/todo`);
const Project = require(`../models/project`);
const { decodeToken } = require(`../helpers/token`);

module.exports = {
  authentication: function(req, res, next) {
    try {
      let decoded = jwt.verify(req.headers.token, process.env.SECRET_JWT);
      console.log("auth start");
      User.findById(decoded._id)
        .then(found => {
          if (found) {
            next();
          } else {
            next({
              code: 401,
              message: `Invalid / Expired Token`
            });
          }
        })
        .catch(err => {
          next({
            code: 500,
            message: err
          });
        });
    } catch (err) {
      next({
        code: 401,
        message: `Log in first!`
      });
    }
  },
  authorizationtodo: function(req, res, next) {
    let theUser = decodeToken(req.headers.token)._id;
    console.log("tauth 1");
    // untuk update, delete todo
    console.log(req.params.id);
    if (req.params.id != undefined) {
      console.log("tauth 2 a");

      Todo.findOne({ _id: req.params.id })
        .populate("project")
        .then(result => {
          console.log(result);
          // jika operasi berhasil
          if (result) {
            console.log("tauth 3 t");
            // dan todo ketemu
            if (result.project) {
              // dan todo ada dalam project -> CEK MEMBERSHIP
              let authorizeduser = result.project.members;
              if (authorizeduser.indexOf(theUser) != -1) {
                // kalau user adalah member dari project maka boleh akses
                console.log("tauth 4a t");
                next();
              } else {
                console.log("tauth 4a f");
                next({
                  code: 401,
                  message: `access not allowed! you are not a member of project`
                });
              }
            } else {
              // dan ga ada dalam project -> CEK OWNERSHIP
              
              if (result.owner == theUser) {
                console.log("tauth 4b t");
                // kalau user adalah owner todo maka boleh akses
                next();
              } else {
                console.log("tauth 4b f");
                next({
                  code: 401,
                  message: `access not allowed! you are not owner of todo`
                });
              }
            }
          } else {
            // dan todo ga ketemu
            console.log("tauth 3 f");
            next({
              code: 404,
              message: `data of this todo no longer exist`
            });
          }
        })
        .catch(err => {
          console.log(err);
          next({
            code: 500,
            message: `internal server error`
          });
        });
    }

    // untuk get semua todo yang ada di suatu project
    if (
      req.params.projectId != undefined &&
      req.params.projectId != "undefined"
    ) {
      console.log("tauth 2b", req.params.projectId);
      Todo.find({ project: req.params.projectId })
        .then(result => {
          // jika operasi berhasil
          if (result.length > 0) {
            console.log(result);
            Project.findById(req.params.projectId)
              .then(found => {
                let authorizeduser = found.members;
                if (authorizeduser.indexOf(theUser) != -1) {
                  next();
                } else {
                  next({
                    code: 401,
                    message: `access not allowed! you are not project member`
                  });
                }
              })
              .catch(err => {
                // jika operasi gagal
                next({
                  code: 500,
                  message: `internal server error!`
                });
              });
          } else {
            // dan datanya ga ada
            next({
              code: 404,
              message: `not found`
            });
          }
        })
        .catch({
          // jika operasi gagal
          code: 500,
          message: `internal server error!`
        });
    }
  },
  authorizationproject: function(req, res, next) {
    let theUser = decodeToken(req.headers.token)._id;
    console.log("1", req.params.id)
    Project.findById(req.params.id)
      .then(result => {
        // jika operasi berhasil
        console.log("2", result);
        console.log(req.query);
        if (result) {
          // dan project ada
          // untuk delete project
          console.log(req.query);
          if (req.query.adminOnly == "true" || req.query.adminOnly == true) {
            if (result.owner == theUser) {
              console.log("3a");
              next();
            } else {
              console.log("3b");
              next({
                code: 401,
                message: `access not allowed! you are not project owner`
              });
            }
          }
          else {
            // untuk update project
            console.log("2b")
            let authorizeduser = result.members;
            console.log(authorizeduser, theUser)
            // kalau user adalah member dari project maka boleh akses
            if (authorizeduser.indexOf(theUser) != -1) {
              console.log("3a")
              next();
            } else {
              console.log("3b")
              next({
                code: 401,
                message: `access not allowed! you are not a member of project`
              });
            }
          }
        } else {
          console.log("4b")
          // dan project gak ada
          next({
            code: 404,
            message: `project data no longer exist`
          });
        }
      })
      .catch(err => {
        console.log(err)
        next({
          code: 500,
          message: `internal server error!`
        });
      });
  }
};
