function renderFrontPage() {
  $('.container').html(`
    <header role="banner" class="header-container">
      <i class="far fa-newspaper"></i>
      <h1 class="header">Articles</h1>
      <div class="auth-actions-container">
        <button id="login" class="auth-actions-button">Login</button>
        <button id="signup" class="auth-actions-button">Sign Up</button>
      </div>
    </header>
    <main role="main">
      <div class="container">

      </div>
      <div class="shadowbox"></div>
    </main>
  `)
}

function watchSignUp() {
  $('#signup').on('click', function() {
    $('.shadowbox').fadeIn(200);
    insertShadowBoxHTML(`
      <div class="auth-form-container">
        <i id="close-shadowbox" class="fa fa-times" href="#"></i>
        <h1 class="auth-form-header">Sign Up</h1>
        <div class="form-wrapper">
          <form class="auth-form">
            <label for="email">Email</label>
            <input type="text" name="email"/>
            <label for="username">Username</label>
            <input type="text" name="username"/>
            <label for="password">Password</label>
            <input type="password" name="password"/>
          </form>
        </div>
      </div>
    `);
  });
}

function watchLogIn() {
  $('#login').on('click', function() {
    $('.shadowbox').fadeIn(200);
    insertShadowBoxHTML(`
      <div class="auth-form-container">
        <i id="close-shadowbox" class="fa fa-times" href="#"></i>
        <h1 class="auth-form-header">Log In</h1>
        <div class="form-wrapper">
          <form class="auth-form">
            <label for="email">Email</label>
            <input type="text" name="email"/>
            <label for="password">Password</label>
            <input type="password" name="password"/>
          </form>
        </div>
      </div>
    `);
  });
}

function insertShadowBoxHTML(htmlToInsert) {
  $('.shadowbox').html(htmlToInsert);
}

function watchShadowBoxClose() {
  $(".shadowbox").on('click', '#close-shadowbox', function(e) {
    console.log("hi")
    $('.auth-form-container').fadeOut(200);
    $('.shadowbox').fadeOut(200);
  });
}

function initializeApp() {
  renderFrontPage();
  watchSignUp();
  watchLogIn();
  watchShadowBoxClose();
}

initializeApp();
