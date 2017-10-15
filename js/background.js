"use strict";
var businessCard = true; //otherwise, poster

var scale = 2
var triWidth = 48*scale;
var triHeight = 48*scale;
var maxJiggle = 12*scale;
var jiggleSeed = 0
var portrait = true
var trisAcross;

var footerText = "www.cavesgame.com"

if (businessCard===true) {

  /*--banner express--
  var dpi = 300
  var dotsPerMM = dpi / 25.4
  var width = dotsPerMM * 60
  var height = dotsPerMM * 95
  var fontHeight = 0.90
  var fontSize = 33
  var fontXAlignHack = -5
  //*/

  //*--vistaprint--
  //size inside bleed: 1050 x 600  
  var width = 635
  var height = 1085
  var fontHeight = 0.93
  var fontSize = 33
  var fontXAlignHack = -5 //hack to line it up with the sun's reflection
  //*/

} else {
  var width = 4967
  var height = 7022
  var fontSize = 100  
  var fontXAlignHack = 0
  var fontHeight = 0.943
}

var skyThickness = Math.floor(height*0.67)
var sunHeight = Math.round(width * 0.3624)
console.log("Sun height: " + sunHeight)
var logoY = (skyThickness - sunHeight) / 2 - 400*height/7022
var sunLineWidth = 8

var firstTriRowY = 358

var sunColor = "rgb(255, 255, 0)"
var sunReflectionColor = "rgb(88, 71, 103)"


var ocean = true
var tris = false

var oceanColor = "rgb(37, 15, 135)"

var colors = [
"rgb(145, 155, 228)",
"rgb(160, 171, 229)",
"rgb(129, 142, 218)",
"rgb(114, 129, 221)",
"rgb(153, 163, 229)",
"rgb(118, 134, 218)",
"rgb(160, 167, 229)",
"rgb(133, 150, 217)",
"rgb(147, 164, 229)",
"rgb(139, 150, 224)",
"rgb(133, 142, 219)",
"rgb(134, 143, 222)",
"rgb(134, 145, 222)",
"rgb(145, 155, 227)",
"rgb(132, 150, 219)",
"rgb(136, 153, 218)"]

var skyColors = [
"rgb(31, 13, 37)",
"rgb(52, 19, 39)",
"rgb(73, 26, 41)",
"rgb(94, 32, 43)",
"rgb(115, 39, 45)",
"rgb(136, 45, 47)",
"rgb(157,52,50)",
"rgb(178,58,52)",
"rgb(199,64,54)",
"rgb(220, 71, 56)"]

  var jiggles = [];
  for (var i = 0; i < 29; i++) {
    jiggles[i] = Math.floor(Math.random() * maxJiggle * 2) - maxJiggle;
  }

  var canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d');
  if (!portrait) {
    var temp = width
    width = height
    height = temp
  }
  canvas.width = width;
  canvas.height = height;

  window.addEventListener("load", function () {
    console.log("forcing background redraw on load");
    drawStuff();
  }, false);
  function hash(x) {
    x = ((x >> 16) ^ x) * 0x45d9f3b;
    x = ((x >> 16) ^ x) * 0x45d9f3b;
    x = ((x >> 16) ^ x);
    return x;
  }
  function getCellColor(i) {
    var j = hash(i) % colors.length;
    return colors[j];
  }
  function jiggle(x, y) {
    var i = 7 + 11 * x;
    i = 7 * i + 37 * y;
    i = Math.floor(i % jiggles.length);
    var j = 13 + 37 * x;
    j = j * 37 + 7 * y;
    j = Math.floor(j % jiggles.length);
    if (i < 0) i = -i;
    if (j < 0) j = -j;
    var p = {};
    p.x = x + jiggles[i];
    p.y = y + jiggles[j];
    return p;
  }
  function drawTri(tri, i, isOutline) {
    var p = tri.p;
    ctx.beginPath();
    ctx.fillStyle = getCellColor(i);
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;
    ctx.moveTo(p[0].x, p[0].y);
    ctx.lineTo(p[1].x, p[1].y);
    ctx.lineTo(p[2].x, p[2].y);
    if (isOutline) {
      ctx.stroke();
    } else {
      ctx.fill();
    }
  }
  function Tri() {
    this.p = [];
    for (var i = 0; i < 3; i++) { this.p[i] = {x:0, y:0}};
  }

  function drawMapCell(i, isOutline) {
    var xi = (i % trisAcross)
    var yi = (Math.floor(i / trisAcross));
    var x = Math.floor(xi * triWidth / 2 - triWidth);
    var y = yi * triHeight - maxJiggle + firstTriRowY;
    var up = (xi % 2 == (yi % 2));
    var tri = new Tri();
    if (up === true) {
      tri.p[0] = jiggle(x, y + triHeight);
      tri.p[1] = jiggle(x + triWidth / 2, y);
      tri.p[2] = jiggle(x + triWidth, y + triHeight);
    } else {
      tri.p[0] = jiggle(x, y);
      tri.p[1] = jiggle(x + triWidth, y);
      tri.p[2] = jiggle(x + triWidth / 2, y + triHeight);
    }
    drawTri(tri, i, isOutline);
  }

  function drawStuff() {
    console.log("drawing")
    //draw sunset
    var skyColorWidth = (skyThickness) / skyColors.length;
    for (var i = 0; i < skyColors.length; i++) {
      ctx.fillStyle = skyColors[i]
      ctx.fillRect(0, skyColorWidth * (i), canvas.width, skyColorWidth+1) 
    }
    //sun
    var horizonY = skyColorWidth * skyColors.length
    ctx.fillStyle = sunColor
    ctx.fillRect(0, horizonY, canvas.width, sunLineWidth) 
    ctx.beginPath()
    ctx.moveTo(width/2, horizonY - sunHeight)
    ctx.lineTo(width/2-sunHeight, horizonY)
    ctx.lineTo(width/2+sunHeight, horizonY)
    ctx.closePath()
    ctx.fill()

    if (ocean) {
      ctx.fillStyle = oceanColor
      ctx.fillRect(0, horizonY + sunLineWidth, width, height - horizonY + sunLineWidth)
    }

    //reflection
    ctx.fillStyle = sunReflectionColor
    ctx.beginPath()
    ctx.moveTo(width/2, horizonY + sunLineWidth + sunHeight * 2)
    ctx.lineTo(width/2+sunHeight, horizonY + sunLineWidth)
    ctx.lineTo(width/2-sunHeight, horizonY + sunLineWidth)
    ctx.closePath()
    ctx.fill()

    if (tris) {
      //draw triangles
      trisAcross = Math.ceil(canvas.width / triWidth * 2 + 3);
      var trisDown = Math.ceil((canvas.height - firstTriRowY) / triHeight + 1);
      for (var i = 0; i < trisAcross * trisDown; i++) {
        drawMapCell(i, true);
      }
      for (var i = 0; i < trisAcross * trisDown; i++) {
        drawMapCell(i, false);
      }
    }

    //draw sprites
    var logo = document.querySelector(".logo")
    var logoScale = width/logo.naturalWidth*0.6
    var logoWidth = logo.naturalWidth*logoScale
    var logoHeight = logo.naturalHeight*logoScale
    console.log("logo height: " + logoHeight)
    ctx.drawImage(logo,width/2-logoWidth/2,logoY, logoWidth, logoHeight)

    var ship = document.querySelector(".ship-dark")
    var shipScale = 10 * width / 4967
    var shipWidth = ship.naturalWidth*shipScale
    var shipHeight = ship.naturalHeight*shipScale
    ctx.drawImage(ship,width/2-shipWidth/2-8*shipScale,skyThickness - sunHeight / 2, shipWidth, shipHeight)

    ctx.fillStyle = "white"
    ctx.font = fontSize + "px Open Sans"
    ctx.textAlign = "center"
    ctx.fillText(footerText, width/2+fontXAlignHack, Math.floor(height*fontHeight))
    console.log("drawing complete")
  }