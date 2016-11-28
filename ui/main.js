/*$(document).on('click', '#submit', function() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE){
            if (request.status === 200) {
                var feedbackContent = '';
                var feedbackData = JSON.parse(this.responseText);
                for(var i = feedbackData.length - 1; i >= 0; i--) {
                    var feedbackItem = feedbackData[i];
                    feedbackContent += `<p><b>${feedbackItem.name}</b></p>
                                        <p>${feedbackItem.feedback}</p>
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
});*/

$("form").submit(function(e){
    e.preventDefault();
    var username = $('#name').val();
    var feedback = $('#feedback').val();
    console.log(username);
    console.log(feedback);
    $.ajax({
        url: "/add-feedback",
        type: "POST",
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify({feedback: feedback, username: username}),
        success: function(data, status, xhr) {
            console.log('hello3');
            var feedbackContent = '';
            var feedbackData = JSON.parse(data);
            for(var i = feedbackData.length - 1; i >= 0; i--) {
                var feedbackItem = feedbackData[i];
                feedbackContent += `<p><b>${feedbackItem.username}</b></p>
                                    <p>${feedbackItem.feedback}</p>
                                    <hr>`;
            }
            $('#feedbackSection').innerHTML = feedbackContent;
        },
        error: function(xhr, status, err) {
            console.log('hello4');
            $('#feedbackSection').innerHTML = '';
        }
    });
});
