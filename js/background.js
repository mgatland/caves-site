"use strict";
var triWidth = 48;
var triHeight = 48;
var maxJiggle = 12;
var jiggleSeed = 0;
var trisAcross;
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
"rgb(136, 153, 218)"
          ]
  var jiggles = [];
  for (var i = 0; i < 29; i++) {
    jiggles[i] = Math.floor(Math.random() * maxJiggle * 2) - maxJiggle;
  }


function getDocumentHeight () {
  var B = document.body,
      H = document.documentElement,
      height

  if (typeof document.height !== 'undefined') {
      height = document.height // For webkit browsers
  } else {
      height = Math.max( B.scrollHeight, B.offsetHeight,H.clientHeight, H.scrollHeight, H.offsetHeight );
  }
  return height;
}

  var canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d');
  window.addEventListener('resize', resizeCanvas, false);
  function resizeCanvas() {
    var documentHeight = getDocumentHeight();
    var documentWidth = document.documentElement.clientWidth || document.body.clientWidth;
    if (canvas.width != documentWidth || canvas.height != documentHeight) {
      canvas.width = documentWidth;
      canvas.height = documentHeight;
      drawStuff();
    }
  }
  window.addEventListener("DOMContentLoaded", function () {
    console.log("forcing background redraw on load");
    resizeCanvas();
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

  var firstTriRowY = 358;
  var oceanThickness = 200;
  var sunsetStripWidth = (firstTriRowY - oceanThickness) / 5;
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
    //draw sunset


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