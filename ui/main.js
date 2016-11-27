document.getElementById('submit').onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function (){
        if (request.readyState === XMLHttpRequest.DONE){
            if (request.status === 200) {
                var feedbackContent = '';
                var feedbackData = JSON.parse(this.responseText);
                for(var i = feedbackData.length - 1; i >= 0; i--){
                    var feedbackItem = feedbackData[i];
                    feedbackContent += `<p><b>${feedbackItem.name}</b></p>
                                        <p>${feedbackData.feedback}</p>
                                        <hr>`;
                }
                document.getElementById('feedbackSection').innerHTML = feedbackContent;
            }
        }
    };
    
    var name = document.getElementById('name').value;
    var feedback = document.getElementById('feedback').value;
    request.open('POST', '/add-feedback', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({feedback: feedback, name: name}));
}