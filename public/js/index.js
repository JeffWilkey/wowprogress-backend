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
    $('.shadowbox').css({
      zIndex: 1,
      opacity: 1
    });
  });
}

function watchLogIn() {

}

function watchShadowBox() {
  $(".shadowbox").on('click', function() {
    $(this).css({
      opacity: 0
    }).css({
      zIndex: -1
    });
  });
}

function initializeApp() {
  renderFrontPage();
  watchSignUp();
  watchLogIn();
  watchShadowBox();
}

initializeApp();
