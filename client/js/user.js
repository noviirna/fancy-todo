function loadloginpage() {
  $("#app").html(`
    <form class="form-signin p-3 border" onsubmit="login()">
      <div class="m-5">
        <center class="mb-4">
        <div class="my-3">
          <i class="fa fa-pencil fa-5x text-danger border rounded-circle p-5 cus-shadow" aria-hidden="true"></i>
        </div>
        <h1>Fancy Todo</h1>
        </center>  
        <center>
          <h5 class="font-weight-normal">Sign in to proceed</h5>
        </center>
        <div class="my-3">
        <label for="email" class="sr-only">Email address</label>
        <input type="email" id="email" class="form-control" placeholder="Email address" required="" autofocus="">
        <label for="password" class="sr-only">Password</label>
        <input type="password" id="password" class="form-control" placeholder="Password" required="">
        </div>
        <button class="btn btn-lg btn-primary btn-block my-3" type="submit">Sign in</button>
        <div class="row mt-3 mb-3">
          <div class="col-md-7 mt-2">
            <center>
              <small>
              Have a Google account?
              Access this app using your Google account!
              </small>
            </center>
          </div>
          <div class="col-md-5 mt-2">
            <center>
              <div id="g-signin2"></div>
            </center>
          </div>
        </div>
        <div class="text-center">
          New to Us? <a href="#" onclick="loadregisterpage()">Register</a>
        </div>
        <center>
          <p class="mt-3 mb-3 text-muted">© Novi Irnawati</p>
        </center>
      </div>
    </form>
 `);
  gapi.signin2.render("g-signin2", {
    scope: "profile email",
    longtitle: true,
    theme: "light",
    onsuccess: onSignIn
  });
}

function loadregisterpage() {
  $("#app").html(`
  <form class="form-signin p-3 border" onsubmit="register()">
    <div class="m-5">
      <center class="mb-4">
      <div class="my-3">
        <i class="fa fa-pencil fa-5x text-danger border rounded-circle p-5 cus-shadow" aria-hidden="true"></i>
      </div>
      <h1>Fancy Todo</h1>
      </center>  
      <center>
        <h5 class="font-weight-normal">Register new account</h5>
      </center>
      <div class="my-3">
      <label for="name" class="sr-only">Name</label>
      <input type="text" id="name" class="form-control" placeholder="Name" required="">
      
      <label for="email" class="sr-only">Email address</label>
      <input type="email" id="email" class="form-control" placeholder="Email address" required="" autofocus="">
      
      <label for="password" class="sr-only">Password</label>
      <input type="password" id="password" class="form-control" placeholder="Password" required="">
      </div>
      <button class="btn btn-lg btn-primary btn-block my-3" type="submit">Register</button>
      <div class="text-center">
        Have an account? <a href="#" onclick="loadloginpage()">Login</a>
      </div>
      <center>
        <p class="mt-3 mb-3 text-muted">© Novi Irnawati</p>
      </center>
    </div>
  </form>
`);
}

function login() {
  if ($("#email").val() === "" || $("#password").val() === "") {
    swal("please complete the form!");
  } else {
    let input = {
      email: $("#email").val(),
      password: $("#password").val()
    };
    $.ajax({
      url: serverURL + "/users/login",
      method: `POST`,
      data: input
    })
      .done(function(response) {
        if (response.token) {
          localStorage.setItem("token", response.token),
            localStorage.setItem("user", JSON.stringify(response.user));
          checkLogin();
        } else {
          swal("Sorry", "something went wrong", "error");
          setTimeout(function() {
            loadloginpage();
          }, 1000);
        }
      })
      .fail(function(jqXHR, textStatus) {
        console.log(JSON.stringify(jqXHR));
        swal("Sorry!", jqXHR.responseJSON.message, "error");
      });
  }
}

function onSignIn(googleUser) {
  const idToken = googleUser.getAuthResponse().id_token;
  $.ajax({
    url: serverURL + `/users/logingoogle`,
    method: `POST`,
    headers: {
      token: idToken
    }
  })
    .done(function(response) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      checkLogin();
      swal("Logged In", `success log in!`, "success");
    })
    .fail(function(jqXHR, textStatus) {
      console.log(JSON.stringify(jqXHR, null, 2));
      swal("google auth error", "please login using regular login", "error");
    });
}

function register() {
  if ($("#name").val() === "" || $("#email").val() === "" || $("#password").val() === "") {
    swal("please complete the form!");
  } else {
    let input = {
      name : $("#name").val(),
      email: $("#email").val(),
      password: $("#password").val()
    };

    $.ajax({
      url: serverURL + "/users/register",
      method: `POST`,
      data: input
    })
      .done(function(response) {
        if (response.email) {
          loadloginpage();
          $("#email").val(response.email);
          swal("Account created", `Your new account has been created, ${response.name}!\n Log in to proceed!`, "success")
        } else {
          loadregisterpage();
        }
      })
      .fail(function(jqXHR, textStatus) {
        console.log(JSON.stringify(jqXHR));
        swal("Sorry!", jqXHR.responseJSON.message, "error");
      });
  }
}

function signOut() {
  gapi.auth2
    .getAuthInstance()
    .signOut()
    .then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      checkLogin();
      swal("Logged Out", `success logged out!`, "success");
    })
    .catch(function(err) {
      console.log(err);
      swal("google auth error", "please check your connection", "error");
    });
}
