var express = require('express');
var router = express.Router();
var request = require('ajax-request');

var leagueNames = ['La Liga', 'Ligue 1', 'Serie A', 'Premier League', 'Bundesliga'];
var leagueCodes = [436, 434, 438, 426, 430];

router.get('/leagues/:league', function(req, res){
    
    var leagueNameRaw = req.params.league;
    var leagueName = leagueNameRaw.replace(/_/g, ' ');
    var leagueIndex = leagueNames.indexOf(leagueName);
    var leagueCode = leagueCodes[leagueIndex];
    
    var clubs = "";
    var fixtures = "";
    var standings = "";
    
    var options = req.app.get('options');
    var baseUrl = req.app.get('apiBaseUrl');
    
    options.url = baseUrl + '/competitions/' + leagueCode + '/teams';
    request(options, function(err, response, body) {
        
        body.teams.forEach(function(team){
            var teamId = team._links.players.href.substring(38).replace('/players', '');
            
            clubs += `
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
        
        options.url = baseUrl + '/competitions/' + leagueCode + '/fixtures';
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
        });
        
        
    }); 
});

module.exports = router;





