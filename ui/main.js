function loadLogin () {
    //Check if the user is logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                if(this.responseText === 'Not logged in'){
                    loadLoginForm();
                } else {
                    loadLoggedInUser(this.responseText);
                }
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
}

function loadLoggedInUser (username) {
    var userSection = $('#userSection');
    userSection.innerHTML = `<h2 id="welcome"></h2>
                            <button type="submit" class="btn btn-default" id="logout">Log out</button>
                            <form id="loggedIn">
                                <div class="form-group">
                                    <label for="comment">Please enter your feedback:</label>
                                    <textarea class="form-control" rows="3" id="comment"></textarea>
                                    <button type="submit" class="btn btn-default" id="submitFeedback">Submit</button>
                                </div>
                            </form>`;
    var welcomeUser = $('#welcome');
    welcomeUser.innerHTML = `Welcome <i>${username}</i>!`;
    
    var logout = $('#logout');
    logout.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  loadLogin();
              }
          }
        };
        
        // Make the request
        request.open('GET', '/logout', true);
        request.send(null);
    };
}

function loadLoginForm () {
    var userSection = $('#userSection');
    userSection.innerHTML = `<p>Please log in to enter feedback.</p>
                                    <form class="form-horizontal">
                                        <div class="form-group">
                                            <label class="control-label col-sm-2" for="username">Username:</label>
                                            <div class="col-sm-10">
                                                <input type="text" class="form-control" id="username" placeholder="Enter username" required>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-sm-2" for="password">Password:</label>
                                            <div class="col-sm-10">          
                                                <input type="password" class="form-control" id="password" placeholder="Enter password" required>
                                            </div>
                                        </div>
                                        <div class="form-group">        
                                            <div class="col-sm-offset-2 col-sm-4">
                                                <button type="submit" class="btn btn-default" id="login">Log in</button>
                                            </div>
                                            <div class="col-sm-4 col-sm-offset-2">
                                                <button type="submit" class="btn btn-default" id="register">Register</button>
                                            </div>
                                        </div>
                                    </form>`;
    
    // Submit username/password to login
    var submit = $('#login');
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 403) {
                  alert('Invalid credentials. Please try again.');
              } else if (request.status === 500) {
                  alert('Oops! Something went wrong on the server.');
              } else {
                  alert('Oops! Something went wrong on the server.');
              }
              loadLogin();
          }
        };
        
        // Make the request
        var username = $('#username').value;
        var password = $('#password').value;
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
    };
    
    var register = $('#register');
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('User created successfully! You may now log in.');
              } else {
                  alert('Could not register the user. Please try with a different username.');
              }
          }
        };
        
        // Make the request
        var username = $('#username').value;
        var password = $('#password').value;
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
    };
}

loadLogin();