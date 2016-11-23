var express = require('express');
var router = express.Router();
var https = require('https');

var leagueNames = ['La Liga', 'Ligue 1', 'Serie A', 'Premier League', 'Bundesliga'];
var leagueCodes = [436, 434, 438, 426, 430];

router.get('/leagues/:league', function(req, res){
    
    var leagueNameRaw = req.params.league;
    var leagueName = leagueNameRaw.replace(/_/g, ' ');
    var leagueIndex = leagueNames.indexOf(leagueName);
    var leagueCode = leagueCodes[leagueIndex];
    
    var htmlString = `<html>
                        <head>${leagueName}</head>
                        <body>
                            <nav class="navbar navbar-default navbar-fixed-top" role="navigation">
                                <div class="container">
                                    <div class="navbar-header">
                                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#collapse">
                                            <span class="sr-only">Toggle navigation</span>
                                            <span class="icon-bar"></span>
                                            <span class="icon-bar"></span>
                                            <span class="icon-bar"></span>
                                        </button>
                                        <a class="navbar-brand" href="/" data-toggle="tooltip" title="Home">High Five</a>
                                        
                                        <span id="leagueName" class="navbar-brand">${leagueName}</span>
                                </div>
                                <div class="collapse navbar-collapse" id="collapse">
                                        <ul class="nav navbar-nav navbar-right myNavbar">
                                            <li class="active"><a data-toggle="tab" href="#clubs">Clubs</a></li>
                                            <li><a data-toggle="tab" href="#fixtures">Fixtures</a></li>
                                            <li><a data-toggle="tab" href="#standings">Standings</a></li>
                                        </ul>
                                        <ul class="nav navbar-nav myNavbar">
                                            <li class="dropdown">
                                                <a class="dropdown-toggle" data-toggle="dropdown" href="#">Leagues
                                                <span class="caret"></span></a>
                                                <ul class="dropdown-menu">
                                                    <li><a href="/leagues/La_Liga">La Liga</a></li>
                                                    <li><a href="/leagues/Ligue_1">Ligue 1</a></li>
                                                    <li><a href="/leagues/Serie_A">Serie A</a></li>
                                                    <li><a href="/leagues/Bundesliga">Bundesliga</a></li> 
                                                    <li><a href="/leagues/Premier_League">Premier League</a></li> 
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </nav>
                            <div class="container-fluid">

                                <div class="tab-content" id="leagueTab">
                                    <div class="tab-pane fade in active" id="clubs" role="tabpanel">
                                        <div class="container">
                                            <div class="row">`;
    
    var clubs = "";
    var fixtures = "";
    var standings = "";
    
    var options = req.app.get('options');
    var baseUrl = req.app.get('apiBaseUrl');
    
    options.path = 'v1/competitions/' + leagueCode + '/teams';
    
    //API call to get the clubs
    var req = https.request(options, function(res) {
        var body = '';

        res.on('data', function(data) {
            body += data;
        });

        res.on('end', function(){
            var jsonObject = JSON.parse(body);
            jsonObject.teams.forEach(function(team){
                var teamId = team._links.players.href.substring(38).replace('/players', '');

                htmlString += `
                    <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                            <div class="thumbnail">
                                <img src="${team.crestUrl}" alt=${team.name} title=${team.name} id="clubLogo" class="img-responsive center-block">
                                <div class="caption">
                                    <h4>${team.name}</h4>
                                </div>
                                <a href="/${leagueNameRaw}/squad/${team.name.replace(/\s/g, "_")}/${teamId}" class="btn btn-primary" role="button" id="squadButton">View Squad</a>
                            </div>
                    </div>`;
            });
        });
    });

    req.end();
    
    htmlString += `</div></div></div></div></div></body></html>`;
    
    /*request(options, function(err, response, body) {

        options.url = baseUrl + '/competitions/' + leagueCode + '/fixtures';
        
        //API call to get the fixtures
        request(options, function(err, response, body) {
            
            var count = 1;
            var fixtureCount = body.count;
            var accordionClass = "panel-collapse collapse in";
            var matchWeek = '';
            var matchDate = '';
            
            body.fixtures.forEach(function(fixture) {
                
                if(matchWeek !== fixture.matchday){
                    matchWeek = fixture.matchday;
                    if(matchWeek>1){
                        fixtures += `<tr><td colspan="2" class="blueHeading rightAlign">All times are in GMT</td></tr></tbody></table></div></div></div>`;
                    }
                    if(count <= fixtureCount){
                        fixtures += `<div class="panel panel-default">
                                        <a class="noUnderline" data-toggle="collapse" data-parent="#accordion" href="#matchweek${matchWeek}">
                                            <div class="panel-heading accordionPanel">
                                                <h3 class="panel-title boldHeading">
                                                    Matchweek ${matchWeek}
                                                </h3>
                                            </div>
                                        </a>
                                        <div id="matchweek${matchWeek}" class="${accordionClass}">
                                            <div class="panel-body">
                                                <table class="table table-bordered">
                                                    <tbody>`;
                    }
                }
                
                var index = fixture.date.indexOf('T');
                var fixtureDate = fixture.date.substring(0, index);
                var fixtureTime = fixture.date.substring(index + 1).substring(0, 5);
                
                if(matchDate != fixtureDate){
                    matchDate = fixtureDate;
                    fixtures += `<tr><td colspan="2" class="blueHeading blueBackground">${matchDate}</td></tr>`;
                }
                
                var class1 = "", class2 = "";
                
                //Displaying the winner in bold font
                if(fixture.result.goalsHomeTeam > fixture.result.goalsAwayTeam){
                        class1 = "boldHeading";
                } else if(fixture.result.goalsHomeTeam < fixture.result.goalsAwayTeam){
                    class2 = "boldHeading";
                }
                
                fixtures += `<tr>
                                <td>
                                    <span class=${class1}>${fixture.homeTeamName}</span><br>
                                    <span class=${class2}>${fixture.awayTeamName}</span>
                                </td>`;
                
                //Displaying the score for finished matches and the time for scheduled matches
                if(fixture.status === 'FINISHED'){
                    fixtures += `<td>
                                    <span class=${class1}>${fixture.result.goalsHomeTeam}</span><br>
                                    <span class=${class2}>${fixture.result.goalsAwayTeam}</span>
                                 </td>`;
                } else {
                    fixtures += `<td>
                                    <span class="blueHeading">${fixtureTime}</span>
                                 </td>`;
                }
                
                fixtures += "</tr>";
                
                if(count===1){
                    accordionClass = "panel-collapse collapse";
                }
                
                if(count === fixtureCount) {
                    fixtures += `<tr><td colspan="2" class="blueHeading rightAlign">All times are in GMT</td></tr></tbody></table></div></div></div>`;
                }
                count++;
            });
            
            
            options.url = baseUrl + '/competitions/' + leagueCode + '/leagueTable';
            
            //API call to get the standings
            request(options, function(err, response, body) {
                
                body.standing.forEach(function(club){
                    standings += `<tr>
                                    <td>${club.position}</td>
                                    <td><img src=${club.crestURI} alt=${club.teamName} title=${club.teamName} height="40px" weigth="40px"></td>
                                    <td>${club.teamName}</td>
                                    <td>${club.playedGames}</td>
                                    <td>${club.wins}</td>
                                    <td>${club.draws}</td>
                                    <td>${club.losses}</td>
                                    <td>${club.goals}</td>
                                    <td>${club.goalsAgainst}</td>
                                    <td>${club.goalDifference}</td>
                                    <td>${club.points}</td>
                                </tr>`;
                });
                
                res.render('league', {
                    pageTitle: leagueName,
                    view: 'league',
                    clubContent: clubs,
                    matchContent: fixtures,
                    pointsTable: standings
                });
            });
        });*/
        
});

module.exports = router;





