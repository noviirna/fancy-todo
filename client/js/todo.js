function loadtodopage() {
  loadGAPI();
  loggedInUser = JSON.parse(localStorage.getItem("user"));
  $("#app").html(`
  <header>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-danger">
      <a class="navbar-brand" href="#">
        <i class="fa fa-pencil" aria-hidden="true"></i> Fancy Todo</a
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
            <a class="nav-link" href="#" onclick="loadprojectpage()">View Projects</a>
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
      <h2 class="p-3 mb-2 border-bottom border-danger">My Todo List</h2>
      <div id="todolist" class="p-2">
      </div>
    </div>
    <div class="col-md-5 mt-5 mx-auto" id="formtodo">
    
    </div>
  </div>
  `);
  loadformnewtodo();
  $("#todolist").html("Loading . . .");
  getAllTodos();
  setTimeout(function() {
    if (reminder.length > 0) {
      swal(
        `Reminder D-1`,
        `There are ${reminder.length} todos that needs to be done!`,
        "info"
      );
    }
  }, 1000);
}

function loadlisttodos(todos) {
  reminder = [];
  $("#todolist").html("");
  todos.forEach((todo, i) => {
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
      if (!todo.project) {
        $("#todolist").append(`
            <div class="p-2 ${todo.bg} m-2">
            <a href="#" onclick="loadformdetailtodo('${i}')">${todo.title}</a>
            <br>
            <small>
            Created At : ${new Date(
              todo.createdAt
            ).toLocaleDateString()}</small><br>
            <small>Target Date : ${new Date(
              todo.targetdate
            ).toLocaleDateString()}</small>
            <div class="d-flex mt-2 justify-around-around">
              <div class="col-auto">
              <small class="text-muted" onclick="markAsDone('${i}')">${theStatus}</small>
              </div>
              <div class="col-auto">
                <i class="fa fa-trash text-danger" onclick="deleteTodo('${i}')" ></i>
             </div>
              <div class="col-auto">
                <small class="text-muted">${strTimeDetail}</small>
              </div>
            </div>
            </div>
            `);
      }
    }
  });
}

function loadformnewtodo() {
  $("#formtodo").html(`
  <h2 class="p-3 mb-2 border-bottom border-danger">Create New Todo</h2>
    <form class="p-2" onsubmit="newTodo()">
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

function loadformdetailtodo(i) {
  console.log(todos[i]);
  let attr = `<button type="submit" class="btn btn-block btn-primary mb-2" onclick="loadformupdatetodo('${i}')">Update This Todo</button>`;
  if (todos[i].status == "Completed") {
    attr = "";
  }
  $("#formtodo").html(`
    <h2 class="p-3 mb-2 border-bottom border-danger">Details Todo</h2>
      <form class="p-2">
        <div class="form-group" onsubmit="loadformupdatetodo('${i}')">
          <label for="title">Title</label>
          <input type="text" class="form-control" id="title" placeholder="Todo Title" disabled>
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea class="form-control" rows="3" id="description" placeholder="Todo Description" disabled></textarea>
        </div>
        <div class="form-group mb-4">
          <label for="targetdate">Target Date</label>
          <input type="date" class="form-control" id="targetdate" aria-descripbedby="dateHelp" placeholder="Target Date" disabled>
          <small id="dateHelp" class="form-text text-muted">Enter date later than today</small>
          </div>
        ${attr}
      </form>
      <center class="p-2">
        <button class="btn btn-block btn-info" onclick="loadformnewtodo()">Close Details</button>
      </center>
    `);
  $("#title").val(todos[i].title);
  $("#description").val(todos[i].description);
  $("#targetdate").val(formatDate(todos[i].targetdate)); //yyyy-mm-dd
}

function loadformupdatetodo(i) {
  $("#formtodo").html(`
  <h2 class="p-3 mb-2 border-bottom border-danger">Update This Todo</h2>
    <form class="p-2" onsubmit="updateTodo('${i}')">
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
      <button type="submit" class="btn btn-block btn-primary">Submit Update</button>
    </form>
    <center class="my-3 p-1">
      <a  href="#" onclick="loadformnewtodo('${i}')">Cancel Update</a> &emsp;
      <a  href="#" onclick="loadformdetailtodo('${i}')">Back to Details</a>
      <center>
        <a  href="#" onclick="deleteTodo('${i}')">Delete This Todo</a>
      </center>
    </center>
  `);
  $("#title").val(todos[i].title);
  $("#description").val(todos[i].description);
  $("#targetdate").val(formatDate(todos[i].targetdate)); //yyyy-mm-dd
}

function getAllTodos() {
  $.ajax({
    url: serverURL + "/todos",
    method: `GET`,
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(response => {
      todos = [];
      for (let i = response.length - 1; i >= 0; i--) {
        if (response[i].status == "Not Done") {
          todos.push(response[i]);
          response.splice(i, 1);
        }
      }
      for (let i = response.length - 1; i >= 0; i--) {
        todos.push(response[i]);
        response.splice(i, 1);
      }

      loadlisttodos(todos);
      loadformnewtodo();
    })
    .fail(function(jqXHR, textStatus) {
      console.log(JSON.stringify(jqXHR));
      swal("Sorry!", jqXHR.responseJSON.message, "error");
    });
}

function newTodo() {
  let title = $("#title").val(),
    description = $("#description").val(),
    targetdate = $("#targetdate").val();

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
          getAllTodos();
      })
      .fail(function(jqXHR, textStatus) {
        console.log(JSON.stringify(jqXHR));
        swal("Sorry!", jqXHR.responseJSON.message, "error");
      });
  }
}

function updateTodo(i) {
  console.log("hiii");
  let title = $("#title").val(),
    description = $("#description").val(),
    targetdate = $("#targetdate").val();

  let target = todos[i];
      target.title = title
      target.description = description
      target.targetdate = targetdate
  console.log(target)

  if (title == "" || description == "" || targetdate == "") {
    swal("please complete the form!");
  } else if (new Date() > new Date(targetdate)) {
    swal("date must be later than today!");
  } else {
    $.ajax({
      url: serverURL + "/todos/" + target._id,
      method: `PATCH`,
      headers: {
        token: localStorage.getItem("token")
      },
      data: target
    })
      .done(response => {
        if (response.project) {
          getAllProjectTodos(response.project);
        } else {
          getAllTodos();
        }
      })
      .fail(function(jqXHR, textStatus) {
        console.log(JSON.stringify(jqXHR));
        swal("Sorry!", jqXHR.responseJSON.message, "error");
      });
  }
}

function markAsDone(i) {
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
      getAllTodos();
    })
    .fail(function(jqXHR, textStatus) {
      console.log(JSON.stringify(jqXHR));
      swal("Sorry!", jqXHR.responseJSON.message, "error");
    });
}

function deleteTodo(i) {
  let target = todos[i];
  swal({
    title: "Confirm Deletion",
    text: "Are you sure to delete this todo?",
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then(willDelete => {
    if (willDelete) {
      $.ajax({
        url: serverURL + "/todos/" + target._id,
        method: `DELETE`,
        headers: {
          token: localStorage.getItem("token")
        }
      })
        .done(response => {
          $("#title").val("");
          $("#description").val("");
          $("#targetdate").val(getTomorrowDate);
          if (response.project) {
            getAllProjectTodos();
          } else {
            getAllTodos();
          }
          swal("Deleted", "That todo has been deleted", "success");
        })
        .fail(function(jqXHR, textStatus) {
          console.log(JSON.stringify(jqXHR));
          swal("Sorry!", jqXHR.responseJSON.message, "error");
        });
    }
  });
}
