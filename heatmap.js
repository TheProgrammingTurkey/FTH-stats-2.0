let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let shots = [[]];
let recentShot;
let redZoneShots = 0;
let bigRedZoneShots = 0;
let oldShots = [[]];
shots.pop();
oldShots.pop();
let goals = [[]];
let redZoneGoals = 0;
let bigRedZoneGoals = 0;
let oldGoals = [[]];
goals.pop();
oldGoals.pop();

let heatmap = document.getElementById('heatmap');
let rink = document.getElementById('rink');
let popup = document.getElementById('popup')
popup.style.display = "none";
let topMargin = heatmap.getBoundingClientRect().top;
let leftMargin = rink.getBoundingClientRect().left;
let mapHeight = 500;
let mapWidth = 1000;
let xVals = Math.ceil(mapWidth/5);
let yVals = Math.ceil(mapHeight/5);

let redZone = turf.polygon([[
  [leftMargin+80, topMargin+234],
  [leftMargin+125, topMargin+218],
  [leftMargin+190, topMargin+218],
  [leftMargin+190, topMargin+298],
  [leftMargin+125, topMargin+298],
  [leftMargin+80, topMargin+281],
  [leftMargin+80, topMargin+234],
]]);

let bigRedZone = turf.polygon([[
  [leftMargin+80, topMargin+234],
  [leftMargin+190, topMargin+157],
  [leftMargin+263, topMargin+157],
  [leftMargin+263, topMargin+360],
  [leftMargin+190, topMargin+360],
  [leftMargin+80, topMargin+281],
  [leftMargin+80, topMargin+234],
]]);

let zShotValues = Array(yVals).fill().map(() => Array(xVals).fill(0));

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

function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);   
  ctx.strokeStyle = "blue";
  ctx.fillStyle = "white";
  ctx.lineWidth = 1; 
  ctx.beginPath();
  ctx.moveTo(bigRedZone.geometry.coordinates[0][0][0]-leftMargin, bigRedZone.geometry.coordinates[0][0][1]-topMargin);
  ctx.lineTo(bigRedZone.geometry.coordinates[0][1][0]-leftMargin, bigRedZone.geometry.coordinates[0][1][1]-topMargin);
  ctx.lineTo(bigRedZone.geometry.coordinates[0][2][0]-leftMargin, bigRedZone.geometry.coordinates[0][2][1]-topMargin);
  ctx.lineTo(bigRedZone.geometry.coordinates[0][3][0]-leftMargin, bigRedZone.geometry.coordinates[0][3][1]-topMargin);
  ctx.lineTo(bigRedZone.geometry.coordinates[0][4][0]-leftMargin, bigRedZone.geometry.coordinates[0][4][1]-topMargin);
  ctx.lineTo(bigRedZone.geometry.coordinates[0][5][0]-leftMargin, bigRedZone.geometry.coordinates[0][5][1]-topMargin);
  ctx.lineTo(bigRedZone.geometry.coordinates[0][6][0]-leftMargin, bigRedZone.geometry.coordinates[0][6][1]-topMargin);
  ctx.lineTo(bigRedZone.geometry.coordinates[0][0][0]-leftMargin, bigRedZone.geometry.coordinates[0][0][1]-topMargin);
  ctx.stroke();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(redZone.geometry.coordinates[0][0][0]-leftMargin, redZone.geometry.coordinates[0][0][1]-topMargin);
  ctx.lineTo(redZone.geometry.coordinates[0][1][0]-leftMargin, redZone.geometry.coordinates[0][1][1]-topMargin);
  ctx.lineTo(redZone.geometry.coordinates[0][2][0]-leftMargin, redZone.geometry.coordinates[0][2][1]-topMargin);
  ctx.lineTo(redZone.geometry.coordinates[0][3][0]-leftMargin, redZone.geometry.coordinates[0][3][1]-topMargin);
  ctx.lineTo(redZone.geometry.coordinates[0][4][0]-leftMargin, redZone.geometry.coordinates[0][4][1]-topMargin);
  ctx.lineTo(redZone.geometry.coordinates[0][5][0]-leftMargin, redZone.geometry.coordinates[0][5][1]-topMargin);
  ctx.lineTo(redZone.geometry.coordinates[0][6][0]-leftMargin, redZone.geometry.coordinates[0][6][1]-topMargin);
  ctx.lineTo(redZone.geometry.coordinates[0][0][0]-leftMargin, redZone.geometry.coordinates[0][0][1]-topMargin);
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  if(shots.length == 0){
    ctx.fillText("No Shots have", (redZone.geometry.coordinates[0][0][0]-leftMargin+redZone.geometry.coordinates[0][3][0]-leftMargin)/2,(redZone.geometry.coordinates[0][3][1]-topMargin+redZone.geometry.coordinates[0][2][1]-topMargin)/2-8);
    ctx.fillText("been taken", (redZone.geometry.coordinates[0][0][0]-leftMargin+redZone.geometry.coordinates[0][3][0]-leftMargin)/2,(redZone.geometry.coordinates[0][3][1]-topMargin+redZone.geometry.coordinates[0][2][1]-topMargin)/2+8);
  }
  else{
    ctx.fillText(Math.round(redZoneShots*10000/shots.length)/100 + "% of shots", (redZone.geometry.coordinates[0][0][0]-leftMargin+redZone.geometry.coordinates[0][3][0]-leftMargin)/2,(redZone.geometry.coordinates[0][3][1]-topMargin+redZone.geometry.coordinates[0][2][1]-topMargin)/2-10);
    ctx.fillText(Math.round(bigRedZoneShots*10000/shots.length)/100 + "% of shots", (bigRedZone.geometry.coordinates[0][0][0]-leftMargin+bigRedZone.geometry.coordinates[0][3][0]-leftMargin)/2+30,(bigRedZone.geometry.coordinates[0][3][1]-topMargin+bigRedZone.geometry.coordinates[0][2][1]-topMargin)/2-60);
  }
  if(goals.length != 0){
    ctx.fillText(Math.round(redZoneGoals*10000/goals.length)/100 + "% of goals", (redZone.geometry.coordinates[0][0][0]-leftMargin+redZone.geometry.coordinates[0][3][0]-leftMargin)/2,(redZone.geometry.coordinates[0][3][1]-topMargin+redZone.geometry.coordinates[0][2][1]-topMargin)/2+10);
    ctx.fillText(Math.round(bigRedZoneGoals*10000/goals.length)/100 + "% of goals", (bigRedZone.geometry.coordinates[0][0][0]-leftMargin+bigRedZone.geometry.coordinates[0][3][0]-leftMargin)/2+30,(bigRedZone.geometry.coordinates[0][3][1]-topMargin+bigRedZone.geometry.coordinates[0][2][1]-topMargin)/2+60);
  }
  window.requestAnimationFrame(draw);
}


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

function addGoal(){
  goals.push(recentShot);
  let pt = turf.point(recentShot);
  if(turf.booleanPointInPolygon(pt, redZone)){
    redZoneGoals++;
    bigRedZoneGoals++;
  }
  else if(turf.booleanPointInPolygon(pt, bigRedZone)){
    bigRedZoneGoals++;
  }
  addShot();
}
function addShot(){
  shots.push(recentShot);
  addToHeatmap(recentShot[0], recentShot[1], 1);
  if(shots.length == 1){
    newColorscale = [
      [0, 'Green'],
      [.5, 'Yellow'],
      [1, 'Red']
    ];
    Plotly.restyle('heatmap', 'colorscale', [newColorscale]);
    heatmap.style.opacity = .5;
  }
  Plotly.redraw(document.getElementById('heatmap'));
  popup.style.display = "none";
}

function undo(){
  if(shots.length <= 0){
    return;
  }
  addToHeatmap(shots[shots.length-1][0], shots[shots.length-1][1], -1);
  if(goals.length > 0 && shots[shots.length-1][0] == goals[goals.length-1][0] && shots[shots.length-1][1] == goals[goals.length-1][1]){
    oldGoals.push([goals[goals.length-1][0], goals[goals.length-1][1]]);
  }
  oldShots.push([shots[shots.length-1][0], shots[shots.length-1][1]]);
  if(goals.length > 0 && shots[shots.length-1][0] == goals[goals.length-1][0] && shots[shots.length-1][1] == goals[goals.length-1][1]){
    goals.pop();
    if(turf.booleanPointInPolygon(turf.point([shots[shots.length-1][0], shots[shots.length-1][1]]), redZone)){
      redZoneGoals--;
      bigRedZoneGoals--;
    }
    else if(turf.booleanPointInPolygon(turf.point([shots[shots.length-1][0], shots[shots.length-1][1]]), bigRedZone)){
      bigRedZoneGoals--;
    }
  }
  shots.pop();
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
  if(oldShots.length <= 0){
    return;
  }
  if(oldShots[oldShots.length-1][0] == oldGoals[oldGoals.length-1][0] && oldShots[oldShots.length-1][1] == oldGoals[oldGoals.length-1][1]){
    goals.push(oldShots[oldShots.length-1]);
    if(turf.booleanPointInPolygon(turf.point([oldShots[oldShots.length-1][0], oldShots[oldShots.length-1][1]]), redZone)){
      redZoneGoals++;
      bigRedZoneGoals++;
    }
    else if(turf.booleanPointInPolygon(turf.point([oldShots[oldShots.length-1][0], oldShots[oldShots.length-1][1]]), bigRedZone)){
      bigRedZoneGoals++;
    }
  }
  shots.push(oldShots[oldShots.length-1]);
  addToHeatmap(oldShots[oldShots.length-1][0], oldShots[oldShots.length-1][1], 1);
  Plotly.redraw(document.getElementById('heatmap'));
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

function showStats(){
  if(canvas.style.opacity == 0){
    canvas.style.opacity = 1;
  }
  else{
    canvas.style.opacity = 0;
  }
}


function addToHeatmap(x, y, coefficient, type){
  let pt = turf.point([x, y]);
  if(coefficient == 1){
    if(turf.booleanPointInPolygon(pt, redZone)){
      redZoneShots++;
      bigRedZoneShots++;
    }
    else if(turf.booleanPointInPolygon(pt, bigRedZone)){
      bigRedZoneShots++;
    }
  }
  else{
    if(turf.booleanPointInPolygon(pt, redZone)){
      redZoneShots--;
      bigRedZoneShots--;
    }
    else if(turf.booleanPointInPolygon(pt, bigRedZone)){
      bigRedZoneShots--;
    }
  }
  let xPos = Math.floor((x-leftMargin)/5);
  let yPos = zShotValues.length - Math.floor((y-topMargin)/(mapHeight/yVals))-1;
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
  zShotValues = zShotValues.slice(0, xVals);
  for(let i = 0; i < yVals; i++){
    zShotValues[i].splice(xVals);
  }
}
window.requestAnimationFrame(draw);