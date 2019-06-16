function loadprojectpage() {
  loadGAPI();
  loggedInUser = JSON.parse(localStorage.getItem("user"));
  $("#app").html(`
  <header>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-danger">
      <a class="navbar-brand" href="#">
        <i class="fa fa-pencil" aria-hidden="true"></i> Fancy project</a
      >
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link" href="#" onclick="loadtodopage()">View Todos</a>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a class="nav-link" href="#">Setting</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" onclick="signOut()">Log Out</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
  <div class="row" style="margin-right: 0;margin-left: 0;">
  <div class="col-12 bg-light">
    <div class="p-2 my-3">
    <center class="my-3">    
    <img class="rounded-circle" src="${
      loggedInUser.picture
    }" alt="profile picture" width="140" height="140">
    <h2 class="my-3"> ${loggedInUser.name}</h2>
    <i class="fa fa-envelope"></i><a href="#"> ${loggedInUser.email}</a>
    </center>
    </div>
  </div>
    <div class="col-md-5 mt-5 mx-auto">
      <h2 class="p-3 mb-2 border-bottom border-danger">My Project List</h2>
      <div id="projectlist" class="p-2">
      </div>
    </div>
    <div class="col-md-5 mt-5 mx-auto" id="formproject">
    
    </div>
    <div class="col-md-5 mt-5 mx-auto" id="todolist">
    
    </div>
    <div class="col-md-5 mt-5 mx-auto" id="formtodo">
    
    </div>
  </div>
  `);
  $("#projectlist").html("Loading . . .");
  getAllProjects();
  loadformproject();
}

function loadformproject() {
  $.ajax({
    url: serverURL + "/users/allname",
    method: `GET`,
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(response => {
      let option = "";
      response.forEach(user => {
        if (user._id !== loggedInUser._id) {
          option += `<option value="${user._id}">${user.email}</option>`;
        }
      });
      $("#formproject").html(`
      <h2 class="p-3 mb-2 border-bottom border-danger">Create New Project</h2>
      <form class="p-2" onsubmit="newProject()">
        <div class="form-group">
          <label for="name">Project Name</label>
          <input type="text" class="form-control" id="name" placeholder="Project Name">
        </div>
        <div class="form-group">
          <label for=projectdescription">Description</label>
          <textarea class="form-control" rows="3" id=projectdescription" placeholder="Project Description"></textarea>
        </div>

        <div class="form-group">
          <label for="members">Members</label>
          <select class="selectpicker form-control mb-3 w-100" id="members" multiple title="Add Members">
            ${option}
          </select> 
        </div>
        <button type="submit" class="btn btn-block btn-primary">Submit</button>
      </form>
      `);
      $("select").selectpicker();
    })
    .fail(function(jqXHR, textStatus) {
      console.log(JSON.stringify(jqXHR));
      $("#projectlist").html("Something went wrong, please try again later");
      swal("Sorry!", jqXHR.responseJSON.message, "error");
    });
}

function loadprojectlist() {
  $("#projectlist").html("");
  projects.forEach((project, i) => {
    let ownership = "bg-light";
    let deletion = ""
    
    if (project.owner._id == loggedInUser._id) {
      ownership = "bg-warning";
      deletion = `<i class="fa fa-trash text-danger" onclick="deleteProject('${i}')" ></i>`
    }
    $("#projectlist").append(`
  <div class="p-2 ${ownership} m-2">
  <a href="#" onclick="getAllProjectTodos('${project._id}')">${project.name}</a>
  <br>
  <small>
  Created At : ${new Date(project.createdAt).toLocaleDateString()}</small><br>
  <div class="d-flex mt-2 justify-content-between">
    <div class="col-1">
      ${deletion}
   </div>
    <div class="col-auto"><small>
    <i class="fa fa-user"></i> ${project.members.length}</small>
    </div>
    <div class="col-auto"><small>
    <i class="fa fa-lock" aria-hidden="true"></i> 
    ${project.owner.name}</small>
    </div>

    <div class="col-auto"><small><a href="#" onclick="viewProjectDetail('${
      project._id
    }')">
    <i class="fa fa-pencil-square" aria-hidden="true"></i></a>
    </small>
    </div>

  </div>
  </div>
  `);
  });
}

function viewProjectDetail(id) {
  getAllProjects();
  var data = {};
  projects.forEach(project => {
    if (project._id === id) {
      data = project;
    }
  });
  let users = data.members;
  $.ajax({
    url: serverURL + "/users/allname",
    method: `GET`,
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(response => {
      let option = "";
      response.forEach(user => {
        let status = "";
        if (users.indexOf(user._id) != -1) {
          status = "selected";
        }
        if (user._id !== loggedInUser._id) {
          option += `<option ${status} value="${user._id}">${
            user.email
          }</option>`;
        }
      });
      let ability = "disabled";
      let updButton = "";
      if (data.owner._id == loggedInUser._id) {
        updButton = `<button type="submit" class="btn btn-block btn-primary">Submit Data</button>`;
        ability = "";
      }
      $("#formproject").html(`
        <h2 class="p-3 mb-2 border-bottom border-danger">ViewProjects</h2>
        <form class="p-2" onsubmit="updateProject('${data._id}')">
          <div class="form-group">
            <label for="name">Project Name</label>
            <input type="text" class="form-control" id="name" placeholder="Project Name" ${ability}>
          </div>
          <div class="form-group">
            <label for="projectdescription">Description</label>
            <textarea class="form-control" rows="3" id="projectdescription" placeholder="Project Description" ${ability}></textarea>
          </div>
  
          <div class="form-group">
            <label for="members">Members</label>
            <select class="selectpicker form-control mb-3 w-100" id="members" multiple title="Add Members" ${ability}>
              ${option}
            </select> 
          </div>
          ${updButton}
        </form>
        `);
      $("select").selectpicker();
      $("#name").val(data.name);
      $("#projectdescription").val(data.description);
    })
    .fail(function(jqXHR, textStatus) {
      console.log(JSON.stringify(jqXHR));
      $("#projectlist").html("Something went wrong, please try again later");
      swal("Sorry!", jqXHR.responseJSON.message, "error");
    });
}

function getAllProjectTodos(id) {
  let target = id;
  $.ajax({
    url: serverURL + "/todos/project/" + target,
    method: `GET`,
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(response => {
      console.log(response);
      todos = response;
      loadformnewprojecttodos(id);
      listprojecttodos(todos[0].project, todos);
    })
    .fail((jqXHR, textStatus) => {
      console.log(JSON.stringify(jqXHR));
      loadformnewprojecttodos(id);
      $("#todolist").html(`
      <h2 class="p-3 mb-2 border-bottom border-danger"> NOT FOUND . . .</h2>
      NOT FOUND. . .
      `);
      swal("Sorry!", jqXHR.responseJSON.message, "error");
    });
}

function listprojecttodos(project, projectTodos) {
  reminder = [];
  $("#todolist").html(`
    <h2 class="p-3 mb-2 border-bottom border-danger">${
      project.name
    }'s Todos</h2>
    `);
  projectTodos.forEach((todo, i) => {
    let today = new Date();
    let difference = new Date(todo.targetdate) - today;
    let days = Math.round(difference / (1000 * 60 * 60 * 24));
    let strTimeDetail = "";
    let dd = "days";

    todo.bg = "bg-light";
    if (todo.status == "Completed") {
      todo.bg = "bg-dark text-light";
    }

    if (days < 0) {
      if (Math.abs(days) == 1) {
        dd = "day";
      }
      strTimeDetail = `${days} ${dd} past from due date`;
      todo.bg = "bg-secondary";
    } else {
      if (days < 2) {
        if (todo.status != "Completed") {
          reminder.push(todo);
          todo.bg = "bg-warning";
        }
      }
      if (days == 1) {
        dd = "day";
      }

      strTimeDetail = `${days} ${dd} left to due date`;

      let theStatus = `Not Done <i class='fa fa-times'></i>`;
      if (todo.status == "Completed") {
        theStatus = `Completed <i class='fa fa-check'></i>`;
      }
      let addition = "";
      $("#todolist").append(`
            <div class="p-2 ${todo.bg} m-2">
            <a href="#" onclick="loadformdetailtodo('${i}')">${todo.title}</a>
            <br> ${addition}
            <small>
            Created At : ${new Date(
              todo.createdAt
            ).toLocaleDateString()}</small><br>
            <small>Target Date : ${new Date(
              todo.targetdate
            ).toLocaleDateString()}</small>
            <div class="d-flex mt-2 justify-around-around">
              <div class="col-auto">
              <small class="text-muted" onclick="markAsDoneTP('${i}')">${theStatus}</small>
              </div>
              <div class="col-auto">
                <i class="fa fa-trash text-danger" onclick="deleteTodosProject('${i}')" ></i>
             </div>
              <div class="col-auto">
                <small class="text-muted">${strTimeDetail}</small>
              </div>
            </div>
            </div>
            `);
    }
  });
}

function newTodosProject(id) {
  let title = $("#title").val(),
    description = $("#description").val(),
    targetdate = $("#targetdate").val();
  console.log(id);
  if (title == "" || description == "" || targetdate == "") {
    swal("please complete the form!");
  } else if (new Date() > new Date(targetdate)) {
    swal("date must be later than today!");
  } else {
    $.ajax({
      url: serverURL + "/todos",
      method: `POST`,
      headers: {
        token: localStorage.getItem("token")
      },
      data: {
        project: id,
        owner: loggedInUser._id,
        title,
        description,
        targetdate,
        status: "Not Done"
      }
    })
      .done(response => {
        $("#title").val(""),
          $("#description").val(""),
          $("#targetdate").val(getTomorrowDate),
          getAllProjectTodos(response.project);
      })
      .fail(function(jqXHR, textStatus) {
        console.log(JSON.stringify(jqXHR));
        swal("Sorry!", jqXHR.responseJSON.message, "error");
      });
  }
}

function loadformnewprojecttodos(id) {
  $("#formtodo").html(`
  <h2 class="p-3 mb-2 border-bottom border-danger">Create New Todo</h2>
    <form class="p-2" onsubmit="newTodosProject('${id}')">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" class="form-control" id="title" placeholder="Todo Title">
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea class="form-control" rows="3" id="description" placeholder="Todo Description"></textarea>
      </div>
      <div class="form-group mb-4">
        <label for="targetdate">Target Date</label>
        <input type="date" class="form-control" id="targetdate" aria-descripbedby="dateHelp" placeholder="Target Date">
        <small id="dateHelp" class="form-text text-muted">Enter date later than today</small>
        </div>
      <button type="submit" class="btn btn-block btn-primary">Submit</button>
    </form>
  `);
  $("#targetdate").val(getTomorrowDate()); //yyyy-mm-dd
}

function getAllUsers() {
  $.ajax({
    url: serverURL + "/users/allname",
    method: `GET`,
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(response => {
      users = response;
      console.log(users);
    })
    .fail(function(jqXHR, textStatus) {
      console.log(JSON.stringify(jqXHR));
      $("#projectlist").html("Something went wrong, please try again later");
      swal("Sorry!", jqXHR.responseJSON.message, "error");
    });
}

function getAllProjects() {
  $.ajax({
    url: serverURL + "/projects",
    method: `GET`,
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(response => {
      projects = response;
      loadprojectlist();
      console.log(projects, "project list");
    })
    .fail(function(jqXHR, textStatus) {
      console.log(JSON.stringify(jqXHR));
      $("#projectlist").html("Something went wrong, please try again later");
      swal("Sorry!", jqXHR.responseJSON.message, "error");
    });
}

function newProject() {
  let input = {
    owner: loggedInUser._id,
    name: $("#name").val(),
    description: $("#description").val(),
    members: $("#members").val()
  };

  input.members.push(input.owner);
  $.ajax({
    url: serverURL + "/projects",
    method: `POST`,
    headers: {
      token: localStorage.getItem("token")
    },
    data: input
  })
    .done(response => {
      projects = response;
      $("#name").val("");
      $("#description").val("");
      $("#members").val("");
      console.log(projects, "kokoko");
      getAllProjects();
      loadprojectlist();
    })
    .fail(function(jqXHR, textStatus) {
      console.log(JSON.stringify(jqXHR));
      $("#projectlist").html("Something went wrong, please try again later");
      swal("Sorry!", jqXHR.responseJSON.message, "error");
    });
}

function deleteProject(i) {
  let id = projects[i]._id;
  swal({
    title: "Confirm Deletion",
    text: "Are you sure to delete this todo?",
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then(willDelete => {
    if (willDelete) {
      $.ajax({
        url: serverURL + "/projects/" + id,
        method: `DELETE`,
        headers: {
          token: localStorage.getItem("token")
        }
      })
        .done(response => {
          $("#title").val(""),
            $("#description").val(""),
            $("#targetdate").val(getTomorrowDate),
            getAllProjectTodos(id);
          swal("Deleted", "That todo has been deleted", "success");
        })
        .fail(function(jqXHR, textStatus) {
          console.log(JSON.stringify(jqXHR));
          swal("Sorry!", jqXHR.responseJSON.message, "error");
        });
    }
  });
}

function updateProject(id) {
  console.log("HERE");
  let input = {
    owner: loggedInUser._id,
    name: $("#name").val(),
    description: $("#projectdescription").val(),
    members: $("#members").val()
  };
  input.members.push(input.owner);
  let url = `/projects/${id}?adminOnly=false`;
  console.log(input);
  console.log(url);
  $.ajax({
    url: serverURL + url,
    method: `PATCH`,
    headers: {
      token: localStorage.getItem("token")
    },
    data: input
  })
    .done(response => {
      projects = response;
      $("#name").val("");
      $("#description").val("");
      $("#members").val("");
      getAllProjects();
      loadprojectlist();
    })
    .fail(function(jqXHR, textStatus) {
      console.log(JSON.stringify(jqXHR, null, 2));
      $("#projectlist").html("Something went wrong, please try again later");
      swal("Sorry!", jqXHR.responseJSON.message, "error");
    });
}

function updateTodosProject() {
  let target = todos[i];
}

function markAsDoneTP(i) {
  let target = todos[i];
  if (target.status.toLowerCase() == "not done") {
    target.status = "Completed";
  } else {
    target.status = "Not Done";
  }

  $.ajax({
    url: serverURL + "/todos/" + target._id,
    method: `PATCH`,
    headers: {
      token: localStorage.getItem("token")
    },
    data: target
  })
    .done(response => {
      getAllProjects();
      getAllProjectTodos(response.project);
    })
    .fail(function(jqXHR, textStatus) {
      console.log(JSON.stringify(jqXHR));
      swal("Sorry!", jqXHR.responseJSON.message, "error");
    });
}

function deleteTodosProject(i) {
  var id = todos[i]._id;
  let project = todos[i].project;
  swal({
    title: "Confirm Deletion",
    text: "Are you sure to delete this todo?",
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then(willDelete => {
    if (willDelete) {
      $.ajax({
        url: serverURL + "/todos/" + id,
        method: `DELETE`,
        headers: {
          token: localStorage.getItem("token")
        }
      })
        .done(response => {
          $("#title").val(""),
            $("#description").val(""),
            $("#targetdate").val(getTomorrowDate),
            getAllProjectTodos(project._id);
          swal("Deleted", "That todo has been deleted", "success");
        })
        .fail(function(jqXHR, textStatus) {
          console.log(JSON.stringify(jqXHR));
          swal("Sorry!", jqXHR.responseJSON.message, "error");
        });
    }
  });
}
