let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
//Set shot variables
let shots = [[]]; 
let leftShots = 0;
let rightShots = 0;
let recentShot;
let redZoneLeftShots = 0;
let bigRedZoneLeftShots = 0;
let redZoneRightShots = 0;
let bigRedZoneRightShots = 0;
let oldShots = [[]];
shots.pop();
oldShots.pop();
//Set goal variables
let leftGoals = 0;
let rightGoals = 0;
let goals = [[]];
let redZoneLeftGoals = 0;
let bigRedZoneLeftGoals = 0;
let redZoneRightGoals = 0;
let bigRedZoneRightGoals = 0;
let oldGoals = [[]];
goals.pop();
oldGoals.pop();

let heatmap = document.getElementById('heatmap');
let rink = document.getElementById('rink');
let popup = document.getElementById('popup');
let heatmapType = document.getElementById('type');
popup.style.display = "none";
let topMargin = heatmap.getBoundingClientRect().top;
let leftMargin = rink.getBoundingClientRect().left;
//size of the heatmap/rink
let mapHeight = 500;
let mapWidth = 1000;
//set grid size for the heatmap
let xVals = Math.ceil(mapWidth/5);
let yVals = Math.ceil(mapHeight/5);

//set the dimensions of the zones
//left red zone
let redZoneLeft = turf.polygon([[
  [leftMargin+80, topMargin+234],
  [leftMargin+125, topMargin+218],
  [leftMargin+190, topMargin+218],
  [leftMargin+190, topMargin+298],
  [leftMargin+125, topMargin+298],
  [leftMargin+80, topMargin+281],
  [leftMargin+80, topMargin+234],
]]);
//left big red zone
let bigRedZoneLeft = turf.polygon([[
  [leftMargin+80, topMargin+234],
  [leftMargin+190, topMargin+157],
  [leftMargin+263, topMargin+157],
  [leftMargin+263, topMargin+360],
  [leftMargin+190, topMargin+360],
  [leftMargin+80, topMargin+281],
  [leftMargin+80, topMargin+234],
]]);
//right red zone
let redZoneRight = turf.polygon([[
  [leftMargin+canvas.width-80, topMargin+234],
  [leftMargin+canvas.width-125, topMargin+218],
  [leftMargin+canvas.width-190, topMargin+218],
  [leftMargin+canvas.width-190, topMargin+298],
  [leftMargin+canvas.width-125, topMargin+298],
  [leftMargin+canvas.width-80, topMargin+281],
  [leftMargin+canvas.width-80, topMargin+234],
]]);
//right big red zone
let bigRedZoneRight = turf.polygon([[
  [leftMargin+canvas.width-80, topMargin+234],
  [leftMargin+canvas.width-190, topMargin+157],
  [leftMargin+canvas.width-261, topMargin+157],
  [leftMargin+canvas.width-261, topMargin+360],
  [leftMargin+canvas.width-190, topMargin+360],
  [leftMargin+canvas.width-80, topMargin+281],
  [leftMargin+canvas.width-80, topMargin+234],
]]);
//set the heatmap values to 0
let zShotValues = Array(yVals).fill().map(() => Array(xVals).fill(0));
let zGoalValues = Array(yVals).fill().map(() => Array(xVals).fill(0));

//settings for the heatmap
let colorscaleValue = [
  [0, '#FF']
];
let data = [{
  z: zShotValues,
  type: 'heatmap',
  colorscale: colorscaleValue,
  showscale: false
}];
let layout = {
  xaxis: {
    ticks: '',
    side: 'top',
    showgrid: false,
    zeroline: false,
    visible: false,
  },
  yaxis: {
    ticks: '',
    ticksuffix: ' ',
    showgrid: false,
    zeroline: false,
    visible: false,
  },
  margin: {
    l: 0,  // left margin
    r: 0,  // right margin
    b: 0,  // bottom margin
    t: 0,  // top margin
  },
  width: mapWidth,
  height: mapHeight
};
Plotly.newPlot('heatmap', data, layout, {staticPlot: true});

//draw the rink, zones, and stats
//Constantly calls itself
function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);   
  ctx.strokeStyle = "blue";
  ctx.fillStyle = "white";
  ctx.lineWidth = 1; 
  //draw the left big redzone 
  ctx.beginPath();
  ctx.moveTo(bigRedZoneLeft.geometry.coordinates[0][0][0]-leftMargin, bigRedZoneLeft.geometry.coordinates[0][0][1]-topMargin);
  ctx.lineTo(bigRedZoneLeft.geometry.coordinates[0][1][0]-leftMargin, bigRedZoneLeft.geometry.coordinates[0][1][1]-topMargin);
  ctx.lineTo(bigRedZoneLeft.geometry.coordinates[0][2][0]-leftMargin, bigRedZoneLeft.geometry.coordinates[0][2][1]-topMargin);
  ctx.lineTo(bigRedZoneLeft.geometry.coordinates[0][3][0]-leftMargin, bigRedZoneLeft.geometry.coordinates[0][3][1]-topMargin);
  ctx.lineTo(bigRedZoneLeft.geometry.coordinates[0][4][0]-leftMargin, bigRedZoneLeft.geometry.coordinates[0][4][1]-topMargin);
  ctx.lineTo(bigRedZoneLeft.geometry.coordinates[0][5][0]-leftMargin, bigRedZoneLeft.geometry.coordinates[0][5][1]-topMargin);
  ctx.lineTo(bigRedZoneLeft.geometry.coordinates[0][6][0]-leftMargin, bigRedZoneLeft.geometry.coordinates[0][6][1]-topMargin);
  ctx.lineTo(bigRedZoneLeft.geometry.coordinates[0][0][0]-leftMargin, bigRedZoneLeft.geometry.coordinates[0][0][1]-topMargin);
  ctx.stroke();
  ctx.fill();
  //draw the left redzone
  ctx.beginPath();
  ctx.moveTo(redZoneLeft.geometry.coordinates[0][0][0]-leftMargin, redZoneLeft.geometry.coordinates[0][0][1]-topMargin);
  ctx.lineTo(redZoneLeft.geometry.coordinates[0][1][0]-leftMargin, redZoneLeft.geometry.coordinates[0][1][1]-topMargin);
  ctx.lineTo(redZoneLeft.geometry.coordinates[0][2][0]-leftMargin, redZoneLeft.geometry.coordinates[0][2][1]-topMargin);
  ctx.lineTo(redZoneLeft.geometry.coordinates[0][3][0]-leftMargin, redZoneLeft.geometry.coordinates[0][3][1]-topMargin);
  ctx.lineTo(redZoneLeft.geometry.coordinates[0][4][0]-leftMargin, redZoneLeft.geometry.coordinates[0][4][1]-topMargin);
  ctx.lineTo(redZoneLeft.geometry.coordinates[0][5][0]-leftMargin, redZoneLeft.geometry.coordinates[0][5][1]-topMargin);
  ctx.lineTo(redZoneLeft.geometry.coordinates[0][6][0]-leftMargin, redZoneLeft.geometry.coordinates[0][6][1]-topMargin);
  ctx.lineTo(redZoneLeft.geometry.coordinates[0][0][0]-leftMargin, redZoneLeft.geometry.coordinates[0][0][1]-topMargin);
  ctx.stroke();
  ctx.fill();
  //draw the right big redzone
  ctx.beginPath();
  ctx.moveTo(bigRedZoneRight.geometry.coordinates[0][0][0]-leftMargin, bigRedZoneRight.geometry.coordinates[0][0][1]-topMargin);
  ctx.lineTo(bigRedZoneRight.geometry.coordinates[0][1][0]-leftMargin, bigRedZoneRight.geometry.coordinates[0][1][1]-topMargin);
  ctx.lineTo(bigRedZoneRight.geometry.coordinates[0][2][0]-leftMargin, bigRedZoneRight.geometry.coordinates[0][2][1]-topMargin);
  ctx.lineTo(bigRedZoneRight.geometry.coordinates[0][3][0]-leftMargin, bigRedZoneRight.geometry.coordinates[0][3][1]-topMargin);
  ctx.lineTo(bigRedZoneRight.geometry.coordinates[0][4][0]-leftMargin, bigRedZoneRight.geometry.coordinates[0][4][1]-topMargin);
  ctx.lineTo(bigRedZoneRight.geometry.coordinates[0][5][0]-leftMargin, bigRedZoneRight.geometry.coordinates[0][5][1]-topMargin);
  ctx.lineTo(bigRedZoneRight.geometry.coordinates[0][6][0]-leftMargin, bigRedZoneRight.geometry.coordinates[0][6][1]-topMargin);
  ctx.lineTo(bigRedZoneRight.geometry.coordinates[0][0][0]-leftMargin, bigRedZoneRight.geometry.coordinates[0][0][1]-topMargin);
  ctx.stroke();
  ctx.fill();
  //draw the right redzone
  ctx.beginPath();
  ctx.moveTo(redZoneRight.geometry.coordinates[0][0][0]-leftMargin, redZoneRight.geometry.coordinates[0][0][1]-topMargin);
  ctx.lineTo(redZoneRight.geometry.coordinates[0][1][0]-leftMargin, redZoneRight.geometry.coordinates[0][1][1]-topMargin);
  ctx.lineTo(redZoneRight.geometry.coordinates[0][2][0]-leftMargin, redZoneRight.geometry.coordinates[0][2][1]-topMargin);
  ctx.lineTo(redZoneRight.geometry.coordinates[0][3][0]-leftMargin, redZoneRight.geometry.coordinates[0][3][1]-topMargin);
  ctx.lineTo(redZoneRight.geometry.coordinates[0][4][0]-leftMargin, redZoneRight.geometry.coordinates[0][4][1]-topMargin);
  ctx.lineTo(redZoneRight.geometry.coordinates[0][5][0]-leftMargin, redZoneRight.geometry.coordinates[0][5][1]-topMargin);
  ctx.lineTo(redZoneRight.geometry.coordinates[0][6][0]-leftMargin, redZoneRight.geometry.coordinates[0][6][1]-topMargin);
  ctx.lineTo(redZoneRight.geometry.coordinates[0][0][0]-leftMargin, redZoneRight.geometry.coordinates[0][0][1]-topMargin);
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  //left stats
  if(leftShots == 0){
    ctx.fillText("No Shots have", (redZoneLeft.geometry.coordinates[0][0][0]-leftMargin+redZoneLeft.geometry.coordinates[0][3][0]-leftMargin)/2,(redZoneLeft.geometry.coordinates[0][3][1]-topMargin+redZoneLeft.geometry.coordinates[0][2][1]-topMargin)/2-8);
    ctx.fillText("been taken", (redZoneLeft.geometry.coordinates[0][0][0]-leftMargin+redZoneLeft.geometry.coordinates[0][3][0]-leftMargin)/2,(redZoneLeft.geometry.coordinates[0][3][1]-topMargin+redZoneLeft.geometry.coordinates[0][2][1]-topMargin)/2+8);
  }
  else{
    ctx.fillText(Math.round(redZoneLeftShots*10000/leftShots)/100 + "% of shots", (redZoneLeft.geometry.coordinates[0][0][0]-leftMargin+redZoneLeft.geometry.coordinates[0][3][0]-leftMargin)/2,(redZoneLeft.geometry.coordinates[0][3][1]-topMargin+redZoneLeft.geometry.coordinates[0][2][1]-topMargin)/2-10);
    ctx.fillText(Math.round(bigRedZoneLeftShots*10000/leftShots)/100 + "% of shots", (bigRedZoneLeft.geometry.coordinates[0][0][0]-leftMargin+bigRedZoneLeft.geometry.coordinates[0][3][0]-leftMargin)/2+30,(bigRedZoneLeft.geometry.coordinates[0][3][1]-topMargin+bigRedZoneLeft.geometry.coordinates[0][2][1]-topMargin)/2-60);
  }
  if(leftGoals != 0){
    ctx.fillText(Math.round(redZoneLeftGoals*10000/leftGoals)/100 + "% of goals", (redZoneLeft.geometry.coordinates[0][0][0]-leftMargin+redZoneLeft.geometry.coordinates[0][3][0]-leftMargin)/2,(redZoneLeft.geometry.coordinates[0][3][1]-topMargin+redZoneLeft.geometry.coordinates[0][2][1]-topMargin)/2+10);
    ctx.fillText(Math.round(bigRedZoneLeftGoals*10000/leftGoals)/100 + "% of goals", (bigRedZoneLeft.geometry.coordinates[0][0][0]-leftMargin+bigRedZoneLeft.geometry.coordinates[0][3][0]-leftMargin)/2+30,(bigRedZoneLeft.geometry.coordinates[0][3][1]-topMargin+bigRedZoneLeft.geometry.coordinates[0][2][1]-topMargin)/2+60);
  }
  //right stats
  if(rightShots == 0){
    ctx.fillText("No Shots have", (redZoneRight.geometry.coordinates[0][0][0]-leftMargin+redZoneRight.geometry.coordinates[0][3][0]-leftMargin)/2,(redZoneRight.geometry.coordinates[0][3][1]-topMargin+redZoneRight.geometry.coordinates[0][2][1]-topMargin)/2-8);
    ctx.fillText("been taken", (redZoneRight.geometry.coordinates[0][0][0]-leftMargin+redZoneRight.geometry.coordinates[0][3][0]-leftMargin)/2,(redZoneRight.geometry.coordinates[0][3][1]-topMargin+redZoneRight.geometry.coordinates[0][2][1]-topMargin)/2+8);
  }
  else{
    ctx.fillText(Math.round(redZoneRightShots*10000/rightShots)/100 + "% of shots", (redZoneRight.geometry.coordinates[0][0][0]-leftMargin+redZoneRight.geometry.coordinates[0][3][0]-leftMargin)/2,(redZoneRight.geometry.coordinates[0][3][1]-topMargin+redZoneRight.geometry.coordinates[0][2][1]-topMargin)/2-10);
    ctx.fillText(Math.round(bigRedZoneRightShots*10000/rightShots)/100 + "% of shots", (bigRedZoneRight.geometry.coordinates[0][0][0]-leftMargin+bigRedZoneRight.geometry.coordinates[0][3][0]-leftMargin)/2-30,(bigRedZoneRight.geometry.coordinates[0][3][1]-topMargin+bigRedZoneRight.geometry.coordinates[0][2][1]-topMargin)/2-60);
  }
  if(rightGoals != 0){
    ctx.fillText(Math.round(redZoneRightGoals*10000/rightGoals)/100 + "% of goals", (redZoneRight.geometry.coordinates[0][0][0]-leftMargin+redZoneRight.geometry.coordinates[0][3][0]-leftMargin)/2,(redZoneRight.geometry.coordinates[0][3][1]-topMargin+redZoneRight.geometry.coordinates[0][2][1]-topMargin)/2+10);
    ctx.fillText(Math.round(bigRedZoneRightGoals*10000/rightGoals)/100 + "% of goals", (bigRedZoneRight.geometry.coordinates[0][0][0]-leftMargin+bigRedZoneRight.geometry.coordinates[0][3][0]-leftMargin)/2-30,(bigRedZoneRight.geometry.coordinates[0][3][1]-topMargin+bigRedZoneRight.geometry.coordinates[0][2][1]-topMargin)/2+60);
  }
  window.requestAnimationFrame(draw);
}

//onclick, if the click is within the rink and there are no other pending shots, show the popup
document.addEventListener("click", function(e) {
  if(e.pageX < leftMargin+mapWidth*.01 || e.pageX > leftMargin+mapWidth*.99 || e.pageY < topMargin+mapHeight*.11 || e.pageY > topMargin+mapHeight*.92 || canvas.style.opacity == 1 || popup.style.display != "none"){
    return;
  }
  if(recentShot == null){
    popup.style.display = "block";
    recentShot = [e.pageX, e.pageY];
  }
  else{
    recentShot = null
  }
});

//add a goal to the heatmap
function addGoal(){
  goals.push(recentShot);
  //check which side the goal was on
  if(recentShot[0] < leftMargin+365){
    leftGoals++;
  }
  else{
    rightGoals++;
  }
  //add to the heatmap z value array
  addToHeatmap(recentShot[0], recentShot[1], 1, "goal");
  //check what zones the goal was in
  let pt = turf.point(recentShot);
  if(turf.booleanPointInPolygon(pt, redZoneLeft)){
    redZoneLeftGoals++;
    bigRedZoneLeftGoals++;
  }
  else if(turf.booleanPointInPolygon(pt, bigRedZoneLeft)){
    bigRedZoneLeftGoals++;
  }
  if(turf.booleanPointInPolygon(pt, redZoneRight)){
    redZoneRightGoals++;
    bigRedZoneRightGoals++;
  }
  else if(turf.booleanPointInPolygon(pt, bigRedZoneRight)){
    bigRedZoneRightGoals++;
  }
  //because every goal is a shot, add it to the shot array
  addShot();
}
//add a shot o to the heatmap
function addShot(){
  shots.push(recentShot);
  //check which side the shot was on
  if(recentShot[0] < leftMargin+365){
    leftShots++;
  }
  else{
    rightShots++;
  }
  //add to the heatmap z value array
  addToHeatmap(recentShot[0], recentShot[1], 1, "shot");
  //if the shot was the first shot, initialize the colorscale for the heatmap
  if(shots.length == 1){
    newColorscale = [
      [0, 'Green'],
      [.5, 'Yellow'],
      [1, 'Red']
    ];
    Plotly.restyle('heatmap', 'colorscale', [newColorscale]);
    heatmap.style.opacity = .5;
  }
  //update the heatmap
  Plotly.redraw(document.getElementById('heatmap'));
  //hide the popup
  popup.style.display = "none";
}

function undo(){
  //if there are no shots to undo, do nothing
  if(shots.length <= 0){
    return;
  }
  //take away the last shot from the heatmap
  addToHeatmap(shots[shots.length-1][0], shots[shots.length-1][1], -1, "shot");
  //if the most recent goal matches the most recent shot, remove it from the goal array and heatmap
  if(goals.length > 0 && shots[shots.length-1][0] == goals[goals.length-1][0] && shots[shots.length-1][1] == goals[goals.length-1][1]){
    oldGoals.push([goals[goals.length-1][0], goals[goals.length-1][1]]);
    addToHeatmap(shots[shots.length-1][0], shots[shots.length-1][1], -1, "goal");
  }
  //log the undone shot for future redoing
  oldShots.push([shots[shots.length-1][0], shots[shots.length-1][1]]);
  //if the most recent goal matches the most recent shot, check what side it was on and check what zones it was in
  if(goals.length > 0 && shots[shots.length-1][0] == goals[goals.length-1][0] && shots[shots.length-1][1] == goals[goals.length-1][1]){
    if(goals[goals.length-1] < leftMargin+365){
      leftShots--;
    }
    else{
      rightShots--;
    }
    goals.pop();
    if(turf.booleanPointInPolygon(turf.point([shots[shots.length-1][0], shots[shots.length-1][1]]), redZoneLeft)){
      redZoneLeftGoals--;
      bigRedZoneLeftGoals--;
    }
    else if(turf.booleanPointInPolygon(turf.point([shots[shots.length-1][0], shots[shots.length-1][1]]), bigRedZoneLeft)){
      bigRedZoneLeftGoals--;
    }
    if(turf.booleanPointInPolygon(turf.point([shots[shots.length-1][0], shots[shots.length-1][1]]), redZoneRight)){
      redZoneRightGoals--;
      bigRedZoneRightGoals--;
    }
    else if(turf.booleanPointInPolygon(turf.point([shots[shots.length-1][0], shots[shots.length-1][1]]), bigRedZoneRight)){
      bigRedZoneRightGoals--;
    }
  }
  if(shots[shots.length-1] < leftMargin+365){
    leftShots--;
  }
  else{
    rightShots--;
  }
  shots.pop();
  //if the last shot was the only shot, reset the colorscale to nothing
  Plotly.redraw(document.getElementById('heatmap'));
  if(shots.length == 0){
    newColorscale = [
      [0, '#FF']
    ];
    Plotly.restyle('heatmap', 'colorscale', [newColorscale]);
    heatmap.style.opacity = 0;
  }
}
function redo(){
  //if there are no shots to redo, do nothing
  if(oldShots.length <= 0){
    return;
  }
  //if the most recent undone goal matches the most recent undone shot, add it back to the goal array and heatmap
  if(oldGoals.length > 0 && oldShots[oldShots.length-1][0] == oldGoals[oldGoals.length-1][0] && oldShots[oldShots.length-1][1] == oldGoals[oldGoals.length-1][1]){
    goals.push(oldShots[oldShots.length-1]);
    //check which side the goal was on
    if(oldShots[oldShots.length-1] < leftMargin+365){
      leftGoals++;
    }
    else{
      rightGoals++;
    }
    //add to the heatmap z value array
    addToHeatmap(oldShots[oldShots.length-1][0], oldShots[oldShots.length-1][1], 1, "goal");
    //check what zones the goal was in
    if(turf.booleanPointInPolygon(turf.point([oldShots[oldShots.length-1][0], oldShots[oldShots.length-1][1]]), redZoneLeft)){
      redZoneLeftGoals++;
      bigRedZoneLeftGoals++;
    }
    else if(turf.booleanPointInPolygon(turf.point([oldShots[oldShots.length-1][0], oldShots[oldShots.length-1][1]]), bigRedZoneLeft)){
      bigRedZoneLeftGoals++;
    }
    if(turf.booleanPointInPolygon(turf.point([oldShots[oldShots.length-1][0], oldShots[oldShots.length-1][1]]), redZoneRight)){
      redZoneRightGoals++;
      bigRedZoneRightGoals++;
    }
    else if(turf.booleanPointInPolygon(turf.point([oldShots[oldShots.length-1][0], oldShots[oldShots.length-1][1]]), bigRedZoneRight)){
      bigRedZoneRightGoals++;
    }
  }
  //add the shot back to the shot array
  shots.push(oldShots[oldShots.length-1]);
  //check which side the shot was on
  if(oldShots[oldShots.length-1] < leftMargin+365){
    leftShots++;
  }
  else{
    rightShots++;
  }
  //add to the heatmap z value array
  addToHeatmap(oldShots[oldShots.length-1][0], oldShots[oldShots.length-1][1], 1, "shot");
  //update the heatmap
  Plotly.redraw(document.getElementById('heatmap'));
  //if the last shot was the only shot, reset the colorscale to nothing
  if(shots.length == 1){
    newColorscale = [
      [0, 'Green'],
      [.5, 'Yellow'],
      [1, 'Red']
    ];
    Plotly.restyle('heatmap', 'colorscale', [newColorscale]);
    heatmap.style.opacity = .5;
  }
  oldShots.pop();
}
//if the user clicks the button, show/hide the stats
function showStats(){
  if(canvas.style.opacity == 0){
    canvas.style.opacity = 1;
  }
  else{
    canvas.style.opacity = 0;
  }
}
//if the user clicks the button, change what heatmap (goal or shot) is being displayed
function changeType(){
  if(type.innerHTML == "Show Goal Heatmap"){
    type.innerHTML = "Show Shot Heatmap";
    data[0].z = zGoalValues;
  }
  else{
    type.innerHTML = "Show Goal Heatmap";
    data[0].z = zShotValues;
  }
  //update the heatmap
  Plotly.react('heatmap', data, layout, {staticPlot: true});
}
//add or remove a value to the heatmap z value array'
//if coefficient = 1 --> add
//if coefficient = -1 --> remove
//type = "shot" or "goal"
function addToHeatmap(x, y, coefficient, type){
  let pt = turf.point([x, y]);
  //check whether it was a shot or a goal, whether we are adding or removing, and if it was in a zone
  if(type == "shot"){
    if(coefficient == 1){
      if(turf.booleanPointInPolygon(pt, redZoneLeft)){
        redZoneLeftShots++;
        bigRedZoneLeftShots++;
      }
      else if(turf.booleanPointInPolygon(pt, bigRedZoneLeft)){
        bigRedZoneLeftShots++;
      }
    }
    else{
      if(turf.booleanPointInPolygon(pt, redZoneLeft)){
        redZoneLeftShots--;
        bigRedZoneLeftShots--;
      }
      else if(turf.booleanPointInPolygon(pt, bigRedZoneLeft)){
        bigRedZoneLeftShots--;
      }
    }
    if(coefficient == 1){
      if(turf.booleanPointInPolygon(pt, redZoneRight)){
        redZoneRightShots++;
        bigRedZoneRightShots++;
      }
      else if(turf.booleanPointInPolygon(pt, bigRedZoneRight)){
        bigRedZoneRightShots++;
      }
    }
    else{
      if(turf.booleanPointInPolygon(pt, redZoneRight)){
        redZoneRightShots--;
        bigRedZoneRightShots--;
      }
      else if(turf.booleanPointInPolygon(pt, bigRedZoneRight)){
        bigRedZoneRightShots--;
      }
    }
  }
  //find what cell the shot was in
  let xPos = Math.floor((x-leftMargin)/5);
  let yPos = zShotValues.length - Math.floor((y-topMargin)/(mapHeight/yVals))-1;
  //make the cells closer to the shot increase in z value more than the cells further away
  if(type == "shot"){
    zShotValues[yPos][xPos]+=20*coefficient;
    zShotValues[yPos][xPos+1]+=20*coefficient;
    zShotValues[yPos][xPos-1]+=20*coefficient;
    zShotValues[yPos][xPos+2]+=10*coefficient;
    zShotValues[yPos][xPos-2]+=10*coefficient;
    zShotValues[yPos][xPos+3]+=5*coefficient;
    zShotValues[yPos][xPos-3]+=5*coefficient;
    zShotValues[yPos][xPos+4]+=coefficient;
    zShotValues[yPos][xPos-4]+=coefficient;
    if(zShotValues.length > yPos+1){
      zShotValues[yPos+1][xPos]+=20*coefficient;
      zShotValues[yPos+1][xPos+1]+=10*coefficient;
      zShotValues[yPos+1][xPos-1]+=10*coefficient;
      zShotValues[yPos+1][xPos+2]+=5*coefficient;
      zShotValues[yPos+1][xPos-2]+=5*coefficient;
      zShotValues[yPos+1][xPos+3]+=5*coefficient;
      zShotValues[yPos+1][xPos-3]+=5*coefficient;
      zShotValues[yPos+1][xPos+4]+=coefficient;
      zShotValues[yPos+1][xPos-4]+=coefficient;
    }
    if(yPos > 0){
      zShotValues[yPos-1][xPos]+=20*coefficient;
      zShotValues[yPos-1][xPos+1]+=10*coefficient;
      zShotValues[yPos-1][xPos-1]+=10*coefficient;
      zShotValues[yPos-1][xPos+2]+=5*coefficient;
      zShotValues[yPos-1][xPos-2]+=5*coefficient;
      zShotValues[yPos-1][xPos+3]+=5*coefficient;
      zShotValues[yPos-1][xPos-3]+=5*coefficient;
      zShotValues[yPos-1][xPos+4]+=coefficient;
      zShotValues[yPos-1][xPos-4]+=coefficient;
    }
    if(zShotValues.length > yPos+2){
      zShotValues[yPos+2][xPos]+=10*coefficient;
      zShotValues[yPos+2][xPos+1]+=5*coefficient;
      zShotValues[yPos+2][xPos-1]+=5*coefficient;
      zShotValues[yPos+2][xPos+2]+=5*coefficient;
      zShotValues[yPos+2][xPos-2]+=5*coefficient;
      zShotValues[yPos+2][xPos+3]+=coefficient;
      zShotValues[yPos+2][xPos-3]+=coefficient;
      zShotValues[yPos+2][xPos+4]+=coefficient;
      zShotValues[yPos+2][xPos-4]+=coefficient;
    }
    if(yPos > 1){
      zShotValues[yPos-2][xPos]+=10*coefficient;
      zShotValues[yPos-2][xPos+1]+=5*coefficient;
      zShotValues[yPos-2][xPos-1]+=5*coefficient;
      zShotValues[yPos-2][xPos+2]+=5*coefficient;
      zShotValues[yPos-2][xPos-2]+=5*coefficient;
      zShotValues[yPos-2][xPos+3]+=coefficient;
      zShotValues[yPos-2][xPos-3]+=coefficient;
      zShotValues[yPos-2][xPos+4]+=coefficient;
      zShotValues[yPos-2][xPos-4]+=coefficient;
    }
    if(zShotValues.length > yPos+3){
      zShotValues[yPos+3][xPos]+=5*coefficient;
      zShotValues[yPos+3][xPos+1]+=5*coefficient;
      zShotValues[yPos+3][xPos-1]+=5*coefficient;
      zShotValues[yPos+3][xPos+3]+=coefficient;
      zShotValues[yPos+3][xPos-3]+=coefficient;
      zShotValues[yPos+3][xPos+2]+=coefficient;
      zShotValues[yPos+3][xPos-2]+=coefficient;
    }
    if(yPos > 2){
      zShotValues[yPos-3][xPos]+=5*coefficient;
      zShotValues[yPos-3][xPos+1]+=5*coefficient;
      zShotValues[yPos-3][xPos-1]+=5*coefficient;
      zShotValues[yPos-3][xPos+3]+=coefficient;
      zShotValues[yPos-3][xPos-3]+=coefficient;
      zShotValues[yPos-3][xPos+2]+=coefficient;
      zShotValues[yPos-3][xPos-2]+=coefficient;
    }
    if(zShotValues.length > yPos+4){
      zShotValues[yPos+4][xPos]+=coefficient;
      zShotValues[yPos+4][xPos-1]+=coefficient;
      zShotValues[yPos+4][xPos-2]+=coefficient;
      zShotValues[yPos+4][xPos+1]+=coefficient;
      zShotValues[yPos+4][xPos+2]+=coefficient;
    }
    if(yPos > 3){
      zShotValues[yPos-4][xPos]+=coefficient;
      zShotValues[yPos-4][xPos-1]+=coefficient;
      zShotValues[yPos-4][xPos-2]+=coefficient;
      zShotValues[yPos-4][xPos+1]+=coefficient;
      zShotValues[yPos-4][xPos+2]+=coefficient;
    }
    zShotValues = zShotValues.slice(0, yVals);
    for(let i = 0; i < yVals; i++){
      zShotValues[i].splice(xVals);
    }
  }
  else{
    zGoalValues[yPos][xPos]+=20*coefficient;
    zGoalValues[yPos][xPos+1]+=20*coefficient;
    zGoalValues[yPos][xPos-1]+=20*coefficient;
    zGoalValues[yPos][xPos+2]+=10*coefficient;
    zGoalValues[yPos][xPos-2]+=10*coefficient;
    zGoalValues[yPos][xPos+3]+=5*coefficient;
    zGoalValues[yPos][xPos-3]+=5*coefficient;
    zGoalValues[yPos][xPos+4]+=coefficient;
    zGoalValues[yPos][xPos-4]+=coefficient;
    if(zGoalValues.length > yPos+1){
      zGoalValues[yPos+1][xPos]+=20*coefficient;
      zGoalValues[yPos+1][xPos+1]+=10*coefficient;
      zGoalValues[yPos+1][xPos-1]+=10*coefficient;
      zGoalValues[yPos+1][xPos+2]+=5*coefficient;
      zGoalValues[yPos+1][xPos-2]+=5*coefficient;
      zGoalValues[yPos+1][xPos+3]+=5*coefficient;
      zGoalValues[yPos+1][xPos-3]+=5*coefficient;
      zGoalValues[yPos+1][xPos+4]+=coefficient;
      zGoalValues[yPos+1][xPos-4]+=coefficient;
    }
    if(yPos > 0){
      zGoalValues[yPos-1][xPos]+=20*coefficient;
      zGoalValues[yPos-1][xPos+1]+=10*coefficient;
      zGoalValues[yPos-1][xPos-1]+=10*coefficient;
      zGoalValues[yPos-1][xPos+2]+=5*coefficient;
      zGoalValues[yPos-1][xPos-2]+=5*coefficient;
      zGoalValues[yPos-1][xPos+3]+=5*coefficient;
      zGoalValues[yPos-1][xPos-3]+=5*coefficient;
      zGoalValues[yPos-1][xPos+4]+=coefficient;
      zGoalValues[yPos-1][xPos-4]+=coefficient;
    }
    if(zGoalValues.length > yPos+2){
      zGoalValues[yPos+2][xPos]+=10*coefficient;
      zGoalValues[yPos+2][xPos+1]+=5*coefficient;
      zGoalValues[yPos+2][xPos-1]+=5*coefficient;
      zGoalValues[yPos+2][xPos+2]+=5*coefficient;
      zGoalValues[yPos+2][xPos-2]+=5*coefficient;
      zGoalValues[yPos+2][xPos+3]+=coefficient;
      zGoalValues[yPos+2][xPos-3]+=coefficient;
      zGoalValues[yPos+2][xPos+4]+=coefficient;
      zGoalValues[yPos+2][xPos-4]+=coefficient;
    }
    if(yPos > 1){
      zGoalValues[yPos-2][xPos]+=10*coefficient;
      zGoalValues[yPos-2][xPos+1]+=5*coefficient;
      zGoalValues[yPos-2][xPos-1]+=5*coefficient;
      zGoalValues[yPos-2][xPos+2]+=5*coefficient;
      zGoalValues[yPos-2][xPos-2]+=5*coefficient;
      zGoalValues[yPos-2][xPos+3]+=coefficient;
      zGoalValues[yPos-2][xPos-3]+=coefficient;
      zGoalValues[yPos-2][xPos+4]+=coefficient;
      zGoalValues[yPos-2][xPos-4]+=coefficient;
    }
    if(zGoalValues.length > yPos+3){
      zGoalValues[yPos+3][xPos]+=5*coefficient;
      zGoalValues[yPos+3][xPos+1]+=5*coefficient;
      zGoalValues[yPos+3][xPos-1]+=5*coefficient;
      zGoalValues[yPos+3][xPos+3]+=coefficient;
      zGoalValues[yPos+3][xPos-3]+=coefficient;
      zGoalValues[yPos+3][xPos+2]+=coefficient;
      zGoalValues[yPos+3][xPos-2]+=coefficient;
    }
    if(yPos > 2){
      zGoalValues[yPos-3][xPos]+=5*coefficient;
      zGoalValues[yPos-3][xPos+1]+=5*coefficient;
      zGoalValues[yPos-3][xPos-1]+=5*coefficient;
      zGoalValues[yPos-3][xPos+3]+=coefficient;
      zGoalValues[yPos-3][xPos-3]+=coefficient;
      zGoalValues[yPos-3][xPos+2]+=coefficient;
      zGoalValues[yPos-3][xPos-2]+=coefficient;
    }
    if(zGoalValues.length > yPos+4){
      zGoalValues[yPos+4][xPos]+=coefficient;
      zGoalValues[yPos+4][xPos-1]+=coefficient;
      zGoalValues[yPos+4][xPos-2]+=coefficient;
      zGoalValues[yPos+4][xPos+1]+=coefficient;
      zGoalValues[yPos+4][xPos+2]+=coefficient;
    }
    if(yPos > 3){
      zGoalValues[yPos-4][xPos]+=coefficient;
      zGoalValues[yPos-4][xPos-1]+=coefficient;
      zGoalValues[yPos-4][xPos-2]+=coefficient;
      zGoalValues[yPos-4][xPos+1]+=coefficient;
      zGoalValues[yPos-4][xPos+2]+=coefficient;
    }
    //get rid of the extra values
    zGoalValues = zGoalValues.slice(0, yVals);
    for(let i = 0; i < yVals; i++){
      zGoalValues[i].splice(xVals);
    }
  }
}
window.requestAnimationFrame(draw);