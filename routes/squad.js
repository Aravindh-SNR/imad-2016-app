var express = require('express');
var router = express.Router();
var request = require('ajax-request');

router.get('/:league/squad/:teamName/:teamId', function(req, res){
    
    var leagueName = req.params.league;
    var clubName = req.params.teamName.replace(/_/g, ' ');
    var clubId = req.params.teamId;
    
    var squad = "";
    
    var options = req.app.get('options');
    var baseUrl = req.app.get('apiBaseUrl');
    
    options.url = baseUrl + '/teams/' + clubId + '/players';
    
    //API call to get the squad
    request(options, function(err, response, body) {
        
        if(body.count > 0){
            var count = 1;
            var accordionClass = "panel-collapse collapse in";

            body.players.forEach(function(player){

                var playerName = player.name.replace(/\?/g, '');
                var index = playerName.indexOf('\n');
                if(index !== -1) {
                    playerName = playerName.substring(0, index);
                }

                var position = (player.position) ? player.position : "-";
                var jerseyNumber = (player.jerseyNumber) ? player.jerseyNumber : "-";
                var dateOfBirth = (player.dateOfBirth) ? player.dateOfBirth : "-";
                var nationality = (player.nationality) ? player.nationality : "-";
                var marketValue = (player.marketValue) ? player.marketValue : "-";

                squad += `<div class="panel panel-default">
                              <a class="noUnderline" data-toggle="collapse" data-parent="#accordion" href="#player${count}">
                                  <div class="panel-heading accordionPanel">
                                    <h3 class="panel-title boldHeading">
                                        ${count}. ${playerName}
                                    </h3>
                                  </div>
                              </a>
                              <div id="player${count}" class="${accordionClass}">
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="col-md-2 col-md-offset-1 col-sm-4 col-xs-6 squadBottomSpace">
                                            <p class="blueHeading">Position</p>
                                            <p>${position}</p>
                                        </div>
                                        <div class="col-md-2 col-sm-4 col-xs-6 squadBottomSpace">
                                            <p class="blueHeading">Jersey Number</p>
                                            <p>${jerseyNumber}</p>
                                        </div>
                                        <div class="col-md-2 col-sm-4 col-xs-6 squadBottomSpace">
                                            <p class="blueHeading">Date of Birth</p>
                                            <p>${dateOfBirth}</p>
                                        </div>
                                        <div class="col-md-2 col-sm-4 col-xs-6 squadBottomSpace">
                                            <p class="blueHeading">Nationality</p>
                                            <p>${nationality}</p>
                                        </div>
                                        <div class="col-md-2 col-sm-4 col-xs-6 squadBottomSpace">
                                            <p class="blueHeading">Market Value</p>
                                            <p>${marketValue}</p>
                                        </div>
                                    </div>
                                </div>
                              </div>
                          </div>`;

                if(count===1){
                    accordionClass = "panel-collapse collapse";
                }
                count++;
            });
        } else {
            squad = `Sorry, squad data for ${clubName} is not available.`
        }
        
        res.render('squad', {
                pageTitle: clubName,
                view: 'squad',
                backToLeagueLink: leagueName,
                backToLeagueName: leagueName.replace(/_/g, ' '),
                squadContent: squad
        });
    });
});

module.exports = router;