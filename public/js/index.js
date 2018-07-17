function renderFrontPage() {
  $('.app-container').html(`
    <header role="banner" class="header-container">
      <i class="far fa-newspaper"></i>
      <h1 class="header">ArtShare</h1>
      <div class="auth-actions-container">
        <button id="login" class="auth-actions-button">Login</button>
        <button id="signup" class="auth-actions-button">Sign Up</button>
        <div class="alert-success"><p>This is a really long success test message for styling</p><i id="close-alert" class="fa fa-times" href="#"></i></div>
      </div>
    </header>
    <button id="seed">Seed Database</button
    <main role="main">
      <div class="container">
        <section class="pieces">
        </section>
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
        loginSuccessful(data)
      },
      error: function(req, err) {
        console.log(req)
      }
    })
  })
}

function loginSuccessful(data) {
  localStorage.setItem('authToken', data.authToken);
  localStorage.setItem('username', data.username);
  localStorage.setItem('avatar', data.gravatar);
  $('.auth-form-container').fadeOut(200);
  $('.shadowbox').fadeOut(200);
  $('header').fadeOut(200, function() {
    renderLoggedInHeader();
    renderTopBarButtons();
    getPieces();
  });
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

function renderLoggedInHeader() {
  $('header').css({textAlign: 'left', paddingTop: '40px', minHeight: '0px'}).html(`
    <div class="container">
      <div class="header-left">
        <h1 class="header-2">ArtShare</h1>
        <i class="far fa-newspaper logged-in"></i>
      </div>
      <div class="header-right">
        <img id="current-user-avatar" src="${localStorage.avatar}" alt="${localStorage.username}'s gravatar"/>
        <p id="current-user-username">${localStorage.username} (<a id="logout" href="#">logout</a>)</p>
      </div>
    </div>
  `).fadeIn(200);
}

function renderTopBarButtons() {
  $('.pieces').before(`
    <div class="piece-action-button-row">
      <button id="create-piece" class="piece-action-button">Create Post</button>
    </div>
  `)
  watchCreatePieceButton();
}

function getPieces() {
  $.ajax({
    type: "GET",
    url: "/api/pieces",
    dataType: 'json',
    contentType: "application/json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.authToken}`);
    },
    success: function(pieces) {
      renderPieces(pieces);
    },
    error: function(req, err) {
      console.log(req)
    }
  })
}

function renderPieces(pieces) {
  pieces.reverse().forEach(function(piece) {
    console.log(piece)
    $(".pieces").append(`
      <div class="column-33">
        <div class="piece">
          <div class="piece-image" style="background-image: url(${piece.thumbnailUrl})">
            <div class="piece-info-container">
              <h1 class="piece-title">${piece.title}</h1>
              <p class="piece-tagline">Artist: ${piece.artist}</p>
              <p hidden class="piece-username">posted by ${piece.userName}</p>
              <p hidden class="piece-id">${piece.id}</p>
              <p hidden class="piece-full">${piece.fullImageUrl}</p>
              <p hidden class="piece-body">${piece.body}</p>
            </div>
          </div>
        </div>
      </div>
    `)
  })
}

function watchPieces() {
  $('.pieces').on('click', '.piece', function(e) {
    e.preventDefault();
    $('.shadowbox').fadeIn(200);
    insertShadowBoxHTML(`
      <i id="close-shadowbox" class="fa fa-times" href="#"></i>
      <img class="piece-full-image" src="${$(this).find('.piece-full').text()}" alt="${$(this).find('.piece-full').text()}"/>
      <h1 class="piece-full-title">${$(this).find('.piece-title').text()}</h1>
      <h3 class="piece-full-artist">${$(this).find('.piece-tagline').text()}</h3>
      <hr style="width: 120px;"/>
      <h4 class="piece-full-body">${$(this).find('.piece-body').text()}</h4>
      <hr style="width: 120px;"/>
      <p class="piece-full-username">${$(this).find('.piece-username').text()}</p>
    `);
  })
}

function watchCreatePieceButton() {
  $('#create-piece').on('click', function(e) {
    e.preventDefault();
    $('.shadowbox').fadeIn(200);
    insertShadowBoxHTML(`
      <div class="piece-form-container">
        <i id="close-shadowbox" class="fa fa-times" href="#"></i>
        <h1 class="piece-form-header">Create Post</h1>
        <div class="form-wrapper">
          <form id="create-piece-form" class="piece-form">
            <label for="thumbnailUrl">Thumbnail URL</label>
            <input type="text" name="thumbnailUrl"/>
            <label for="fullImageUrl">Full Image URL</label>
            <input type="text" name="fullImageUrl"/>
            <label for="title">Title</label>
            <input type="text" name="title"/>
            <label for="body">Body</label>
            <textarea type="text" name="body"/>
            <label for="artist">Original Artist</label>
            <input type="text" name="artist"/>
            <input id="create-piece-action" type="submit" value="Create Post"/>
          </form>
        </div>
      </div>
    `);
    watchCreatePieceAction();
  })
}

function watchCreatePieceAction() {
  $("#create-piece-form").on('submit', function(e) {
    e.preventDefault();

    pieceInfo = {};
    $(this).serializeArray().forEach(function(attribute) {
      pieceInfo[attribute.name] = attribute.value;
    });

    $.ajax({
      type: "POST",
      url: "/api/pieces",
      dataType: 'json',
      contentType: "application/json",
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.authToken}`);
      },
      data: JSON.stringify(pieceInfo),
      success: function(data) {
        createPieceSuccess(data);
      },
      error: function(req, err) {
        console.log(req)
      }
    })
  })
}

function createPieceSuccess(piece) {
  $('.piece-form-container').fadeOut(200);
  $('.shadowbox').fadeOut(200);
  $(".pieces").append(`
    <div class="column-33">
      <div class="piece">
        <div class="piece-image" style="background-image: url(${piece.thumbnailUrl})">
          <div class="piece-info-container">
            <h1 class="piece-title">${piece.title}</h1>
            <p class="piece-tagline">Artist: ${piece.artist}</p>
            <p hidden class="piece-username">posted by ${piece.userName}</p>
            <p hidden class="piece-id">${piece.id}</p>
            <p hidden class="piece-full">${piece.fullImageUrl}</p>
            <p hidden class="piece-body">${piece.body}</p>
          </div>
        </div>
      </div>
    </div>
  `)
}

function watchSeed() {
  const pieces = [
    {
    	title: "Would You Kindly",
    	artist: "Dan Mumford",
    	thumbnailUrl: "https://static1.squarespace.com/static/53e4ea80e4b0a79b40480ad4/t/5922c4582994ca8bef6aabab/1495450719325/Bioshock_dan_mumford3.jpg?format=original",
    	fullImageUrl: "https://static1.squarespace.com/static/53e4ea80e4b0a79b40480ad4/5922c32ddb29d65872a4fc5c/5922c337cd0f6872c7a76a0c/1495450436220/Bioshock_dan_mumford.jpg?format=750w",
    	body: "A description about Would You Kindly"
    },
    {
    	title: "You Shall Now Call Me Snowball",
    	artist: "Dan Mumford",
    	thumbnailUrl: "https://static1.squarespace.com/static/53e4ea80e4b0a79b40480ad4/t/58ee5afb20099ef86fedc583/1492015878387/Rick_and_morty_dan_mumford4.jpg?format=original",
    	fullImageUrl: "https://static1.squarespace.com/static/53e4ea80e4b0a79b40480ad4/58ee5a87725e2592673d4257/58ee5b1c893fc06abffdb241/1492015916268/Rick_and_morty_dan_mumford3.jpg?format=750w",
    	body: "A description about You Shall Now Call Me SnowBall"
    },
    {
    	title: "Chroma II",
    	artist: "Dan Mumford",
    	thumbnailUrl: "https://static1.squarespace.com/static/53e4ea80e4b0a79b40480ad4/t/5a301f8571c10b0f0555750c/1513103247075/Close_encounters_danmumford.jpg?format=original",
    	fullImageUrl: "https://static1.squarespace.com/static/53e4ea80e4b0a79b40480ad4/5a301f1124a694fe6ea639eb/5a301f1e0d9297e3b10cb652/1513103148310/CLOSE_ENCOUNTERS.jpg?format=750w",
    	body: "A description about Chroma II"
    }
  ]
  $('#seed').on('click', function(e) {
    e.preventDefault();
    pieces.forEach((piece) => {
      $.ajax({
        type: "POST",
        url: "/api/pieces",
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(piece),
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', `Bearer ${localStorage.authToken}`);
        },
        success: function(data) {
          console.log(data)
        },
        error: function(req, err) {
          console.log(req)
        }
      })
    })
  })
}

function initializeApp() {
  renderFrontPage(); // Render front page
  watchAlertClose(); // Watch for alert close
  watchSignUpButton(); // Watch for front page sign up button press
  watchLogInButton(); // Watch for front page log in button press
  watchShadowBoxClose(); // Watch for front page click of close shadowbox icon
  watchSeed();
  watchPieces();
}

initializeApp();
