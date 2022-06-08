var id = null;

// time, startpoint
// station A lies at 0 pixels, station B at 1000 pixels
var locationStationA = 0;
var locationStationB = 1000;
var locationNorthTrack = 10;
var locationSouthTrack = 30;

// coordinates of the switches
var switches = [
  [30, locationNorthTrack],
  [70, locationSouthTrack],
  [930, locationNorthTrack],
  [970, locationSouthTrack],
  [30, locationSouthTrack],
  [70, locationNorthTrack],
  [930, locationSouthTrack],
  [970, locationNorthTrack],
];

const myTrain = {
  // every train should be an object
}

function myMove() {
  var framecounter = 0;

  var posx = [locationStationA,locationStationB, locationStationA, locationStationB];
  var posy = [locationSouthTrack,locationNorthTrack, locationNorthTrack, locationSouthTrack];
  var onswitch = [false,false, false, false];
  var onswitchDirection = [0, 0, 0, 0];
  var myTimeTable = [
    [   // departure time, departure station, track
      [200, locationStationA, 1],
      [1500, locationStationB, 1],
      [2800, locationStationA, 1],
      [4100, locationStationB, 1],
      [5400, locationStationA, 1]
    ]
    ,   // departure time, departure station, track
    [
      [200, locationStationB, 1],
      [1500, locationStationA, 1],
      [2800, locationStationB, 1],
      [4100, locationStationA, 1],
      [5400, locationStationB, 1]
    ]
    ,
    [
      [850, locationStationA, 2],
      [2150, locationStationB, 2],
      [3450, locationStationA, 2],
      [4750, locationStationB, 2],
      [6050, locationStationA, 2]
    ]
    ,
    [
      [850, locationStationB, 2],
      [2150, locationStationA, 2],
      [3450, locationStationB, 2],
      [4750, locationStationA, 2],
      [6050, locationStationB, 2]
    ]
  ];
  var timeTableCounter = [0,0, 0, 0];
  var justArrived = [1,1, 1, 1];   //
  var direction = ['AB','BA', 'AB', 'BA'];  //


  clearInterval(id); // reset to zero at the start

  id = setInterval(frame, 1);

  function frame() {

    framecounter++;

    if (framecounter == 8000) { // stops the timer after ... milliseconds
      clearInterval(id);
    } else {
      for (var i=0;i<4 /*posx.length*/ ;i++){
        var result = getTrainPosition(
          posx[i],
          posy[i],
          locationStationA,
          locationStationB,
          locationNorthTrack,
          locationSouthTrack,
          onswitch[i],
          onswitchDirection[i],
          myTimeTable[i],
          timeTableCounter[i],
          framecounter,
          justArrived[i],
          direction[i]
        );

        posx[i] = result.posxR;
        posy[i] = result.posyR;
        onswitch[i] = result.onswitchR;
        onswitchDirection[i] = result.onswitchDirectionR;
        myTimeTable[i] = result.myTimeTableR;
        timeTableCounter[i] = result.timeTableCounterR;
        justArrived[i] = result.justArrivedR;
        direction[i] = result.directionR;
      }
    }

    startClock(framecounter, direction[0], timeTableCounter[0]);

    /// Canvas
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    // trains coordinates
    ctx.fillRect(-2.5 + posx[0], -2.5 + posy[0], 5, 5);
    ctx.fillRect(-2.5 + posx[1], -2.5 + posy[1], 5, 5);
    ctx.fillRect(-2.5 + posx[2], -2.5 + posy[2], 5, 5);
    ctx.fillRect(-2.5 + posx[3], -2.5 + posy[3], 5, 5);

    /// tracks
    ctx.moveTo(0, 10);ctx.lineTo(1000, 10);
    ctx.moveTo(0, 30);ctx.lineTo(1000, 30);

    // station names
    ctx.fillText("A", 2, 24); ctx.fillText("B", 990, 24);

    // switches
    ctx.moveTo(30, 10);ctx.fillText("1", 30, 10);ctx.lineTo(70, 30);ctx.fillText("2", 70, 30);
    ctx.moveTo(930, 10);ctx.fillText("3", 930, 10);ctx.lineTo(970, 30);ctx.fillText("4", 970, 30);
    ctx.moveTo(30, 30);ctx.fillText("5", 30, 30);ctx.lineTo(70, 10);ctx.fillText("6", 70, 10);
    ctx.moveTo(930, 30);ctx.fillText("7", 930, 30);ctx.lineTo(970, 10);ctx.fillText("8", 970, 10);
    ctx.stroke();
  }
}

function startClock(postime, dir, tt) {
  var timerHtml = document.querySelector("#timer");
  timerHtml.innerHTML = postime;
  var directionHtml = document.querySelector("#direction_display");
  directionHtml.innerHTML = dir;
  var timetableHtml = document.querySelector("#timetable");
  timetableHtml.innerHTML = tt;
}

function drawTracks(){}
// tracks should be drawn before starting the simulation

function getTrainPosition(posx,posy, locationStationA, locationStationB, locationNorthTrack,locationSouthTrack,
  onswitch,onswitchDirection, myTimeTable, timeTableCounter, framecounter, justArrived, direction){

  // build a condition to go back to initial track when myTimeTable out of bounds
  // if myTimeTable[timeTableCounter+1]

  if ((posx < locationStationB) && (posx > locationStationA)) {
  // if not in the station
    if (posx > 960){
    console.log("posx " + posx);
    console.log("posy " + posy);
    console.log("onswitch " + onswitch);
    console.log("direction " + direction);
    console.log("tt " + myTimeTable[timeTableCounter+1][2])
    console.log("tt " + myTimeTable[timeTableCounter+1])
    console.log("locationSouthTrack " + locationSouthTrack)
    }

    if (posx == 930 && posy == locationSouthTrack && onswitch == false && myTimeTable[timeTableCounter+1][2] == 1) {
    // if on a switch starting point, and the destination track is track 1, change the direction to the switch direction - at station B, going Northeast
      onswitch = true;  // you need this parameter when you want to go off the switch at the end
      onswitchDirection = [970, locationNorthTrack]; // coordinates of the end of the switch
      posx++;
      posy = posy - 0.5;
      console.log("inside1");
    // if on a switch starting point, and the destination track is track 2, keep driving - at station B, going Northeast > below in else statement

    } else if (posx == 970 && posy == 30 && onswitch == false && direction == 'BA'){
    // if on the B switch southeast starting point, and the direction is West, go on the switch

      onswitch = true;
      onswitchDirection = [930, locationNorthTrack];
      posx--;
      posy = posy - 0.5;
      console.log("switch success");

    } else if (posx == 70 && posy == locationNorthTrack && onswitch == false && myTimeTable[timeTableCounter+1][2] == 1) {
    // if on a switch starting point, and the destination track is track 1, change the direction to the switch direction - at station A, going Southwest
      onswitch = true;
      onswitchDirection = [30, locationSouthTrack];
      posx--;
      posy = posy + 0.5;
    // if on a switch starting point, and the destination track is track 2, keep driving - at station A, going Southwest > below in else statement

    } else if (posx == 30 && posy == locationNorthTrack && onswitch == false && direction == 'AB'){
    // if on the A switch northwest starting point, and the direction is East, go on the switch
      onswitch = true;
      onswitchDirection = [70, locationSouthTrack];
      posx++;
      posy = posy + 0.5;

    } else {
      console.log("inside2");
    // if on the switch but not at the starting point
      if (onswitch == 1 && onswitchDirection[0] == 970 && onswitchDirection[1] == locationNorthTrack) {
      // if going NorthEast at station B
        if (posx == 970 && posy == locationNorthTrack) {
        // change back to normal track when coming off switch
          posx++;
          onswitch = 0;
        } else {
        // keep following the switch
          posx++;
          posy = posy - 0.5;
        }
      } else if (onswitch == 1 && onswitchDirection[0] == 30 && onswitchDirection[1] == locationSouthTrack) {
      // if going Southwest at station A
        if (posx == 30 && posy == locationSouthTrack) {
        // change back to normal track when coming off switch
          posx--;
          onswitch = 0;
        } else {
        // keep following the switch
          posx--;
          posy = posy + 0.5;
        }
      } else if (onswitch == 1 && onswitchDirection[0] == 930 && onswitchDirection[1] == locationNorthTrack){
      // If going Northwest at station B
        if (posx == 930 && posy == locationNorthTrack) {
        // change back to normal track when coming off switch
          posx--;
          onswitch = 0;
        } else {
        // keep following the switch
          posx--;
          posy = posy - 0.5;
        }
      } else if (onswitch == 1 && onswitchDirection[0] == 70 && onswitchDirection[1] == locationSouthTrack){
      // If going SouthEast at station A
        if (posx == 70 && posy == locationSouthTrack) {
        // change back to normal track when coming off switch
          posx++;
          onswitch = 0;
        } else {
        // keep following the switch
          posx++;
          posy = posy + 0.5;
        }
      } else {
      // if not on a switch or on a switching point the train should continue driving
        if (direction == 'AB') {
          posx++;
        } else if (direction = 'BA') {
          posx--;
        } else {}
      }
    }
    justArrived = 0; // in all above cases, the train is driving
  } else if (posx == locationStationB && justArrived == 0) {
    // stop the train when it is at the correct position
    timeTableCounter++;
    direction = 'BA';
    justArrived = 1;
  } else if (posx == locationStationA && justArrived == 0) {
    // stop the train when it is at the correct position
    timeTableCounter++;
    direction = 'AB'
    justArrived = 1;
  } else if (framecounter == myTimeTable[timeTableCounter][0] && posx == myTimeTable[timeTableCounter][1]) {
    // if it's the correct time and train is at the correct position, it should leave
    if (direction == 'AB') {
      posx++;
    } else if (direction = 'BA') {
      posx--;
    } else {
    }
  } else {
  }

  return {
        posxR: posx,
        posyR: posy,
        onswitchR: onswitch,
        onswitchDirectionR: onswitchDirection,
        myTimeTableR: myTimeTable,
        timeTableCounterR: timeTableCounter,
        framecounterR: framecounter,
        justArrivedR: justArrived,
        directionR: direction
    }
}
