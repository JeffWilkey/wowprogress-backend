function renderFrontPage() {
  $('.app-container').html(`
    <header role="banner" class="header-container">

      <i class="far fa-newspaper"></i>
      <h1 class="header">Articles</h1>
      <div class="auth-actions-container">
        <button id="login" class="auth-actions-button">Login</button>
        <button id="signup" class="auth-actions-button">Sign Up</button>
        <div class="alert-success"><p>This is a really long success test message for styling</p><i id="close-alert" class="fa fa-times" href="#"></i></div>
      </div>
    </header>
    <main role="main">
      <div class="container">

      </div>
      <div class="shadowbox"></div>
    </main>
  `)
}

function watchSignUpButton() {
  $('#signup').on('click', function() {
    $('.shadowbox').fadeIn(200);
    insertShadowBoxHTML(`
      <div class="auth-form-container">
        <i id="close-shadowbox" class="fa fa-times" href="#"></i>
        <h1 class="auth-form-header">Sign Up</h1>
        <div class="form-wrapper">
          <form id="sign-up-form" class="auth-form">
            <label for="email">Email</label>
            <input type="text" name="email"/>
            <label for="username">Username</label>
            <input type="text" name="username"/>
            <label for="password">Password</label>
            <input type="password" name="password"/>
            <input id="sign-up-action" type="submit" value="Sign Up"/>
          </form>
        </div>
      </div>
    `);
    watchSignUpAction();
  });
}

function watchSignUpAction() {
  $("#sign-up-form").on('submit', function(e) {
    e.preventDefault();

    userInfo = {};
    $(this).serializeArray().forEach(function(attribute) {
      userInfo[attribute.name] = attribute.value;
    });

    $.ajax({
      type: "POST",
      url: "/api/users",
      dataType: 'json',
      contentType: "application/json",
      data: JSON.stringify(userInfo),
      success: function(data) {
        console.log(data)
        $('.auth-form-container').fadeOut(200);
        $('.shadowbox').fadeOut(200);
        $('.alert-success p').html(`You've successfully created an account, please Log In.`);
        $('.alert-success').fadeIn(200);
      },
      error: function(req, err) {
        console.log(req)
      }
    })
  })
}

function watchLogInButton() {
  $('#login').on('click', function() {
    $('.shadowbox').fadeIn(200);
    insertShadowBoxHTML(`
      <div class="auth-form-container">
        <i id="close-shadowbox" class="fa fa-times" href="#"></i>
        <h1 class="auth-form-header">Log In</h1>
        <div class="form-wrapper">
          <form id="login-form" class="auth-form">
            <label for="username">Username</label>
            <input type="text" name="username"/>
            <label for="password">Password</label>
            <input type="password" name="password"/>
            <input id="login-action" type="submit" value="Log in"/>
          </form>
        </div>
      </div>
    `);
    watchLogInAction();
  });
}

function watchLogInAction() {
  $("#login-form").on('submit', function(e) {
    e.preventDefault();

    userInfo = {};
    $(this).serializeArray().forEach(function(attribute) {
      userInfo[attribute.name] = attribute.value;
    });

    $.ajax({
      type: "POST",
      url: "/api/auth/login",
      dataType: 'json',
      contentType: "application/json",
      data: JSON.stringify(userInfo),
      success: function(data) {
        console.log(data.authToken)
        localStorage.setItem('authToken', data.authToken)
        console.log(localStorage)
        $('.auth-form-container').fadeOut(200);
        $('.shadowbox').fadeOut(200);
      },
      error: function(req, err) {
        console.log(req)
      }
    })
  })
}

function insertShadowBoxHTML(htmlToInsert) {
  $('.shadowbox').html(htmlToInsert);
}

function watchShadowBoxClose() {
  $(".shadowbox").on('click', '#close-shadowbox', function(e) {
    $('.auth-form-container').fadeOut(200);
    $('.shadowbox').fadeOut(200);
  });
}

function watchAlertClose() {
  $(".alert-success").on('click', '#close-alert', function(e) {
    $('.alert-success').fadeOut(200);
  })
}

function initializeApp() {
  renderFrontPage();
  watchAlertClose();
  watchSignUpButton();
  watchLogInButton();
  watchLogInAction();
  watchShadowBoxClose();
}

initializeApp();
