var submitFeedback = document.getElementById('submit');
    submitFeedback.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('Feedback added successfully');
              }
          }
        };
        
        // Make the request
        var username = document.getElementById('name').value;
        var feedback = document.getElementById('feedback').value;
        console.log(username);
        console.log(feedback);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, feedback: feedback})); 
    };