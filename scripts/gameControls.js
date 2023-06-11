function claim(featureId, teamId){
    game.state[featureId] = game.state[featureId] || {};
    game.state[featureId].team = teamId;
    gameInfoBox.update();

    draw();
    openControls(featureId);
}
function lock(featureId){
    game.state[featureId].locked = true;
    gameInfoBox.update();

    draw();
    openControls(featureId);
}
function unlock(featureId){
    game.state[featureId].locked = false;
    gameInfoBox.update();

    draw();
    openControls(featureId);
}
function clearFeature(featureId){
    delete game.state[featureId];
    gameInfoBox.update();

    draw();
    openControls(featureId);
}

function getControls(targetId){
    let content = "<h4>Actions</h4>";
    if(!game.state[targetId]?.locked){
      for (let i in game.teams) {
        const team = game.teams[i];
        if(game.state[targetId]?.team == i) continue;

        content += `<button onclick="claim('${targetId}', '${i}')">${team.name}</button><br/>`;
      }
      if(game.state[targetId] && game.state[targetId].team.toString()){
        content += `<button onclick="lock('${targetId}')">Lock</button><br/>`;
        content += `<button onclick="clearFeature('${targetId}')">Clear</button><br/>`;
      }
    }
    else{
      content += `<button onclick="unlock('${targetId}')">Unlock</button><br/>`;
    }
    return content;
}

function openControls(targetId){

    const content = getControls(targetId);
    popup.setContent(content);

}