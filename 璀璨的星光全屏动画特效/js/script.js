/*
* File Name / starlightEffect.js
* Created Date / Aug 18, 2020
* Aurhor / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
*/

(function () {
  'use strict';
  window.addEventListener('load', function () {
    var canvas = document.getElementById('canvas');

    if (!canvas || !canvas.getContext) {
      return false;
    }

    /********************
      Random Number
    ********************/

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    /********************
      Var
    ********************/
    
    var ctx = canvas.getContext('2d');
    var X = canvas.width = window.innerWidth;
    var Y = canvas.height = window.innerHeight;
    var mouseX = null;
    var mouseY = null;
    var pointX = X / 2;
    var pointY = 0;
    // spark
    var rad = Math.PI * 2 / 8;
    var sparks = [];
    var sparkNum = 500;
    var radius = 1;
    var time = 0;
    var color = 'hsl(' + Math.sin(time * Math.PI / 180) * 360 + ', 80%, 60%)';

    /********************
      Animation
    ********************/

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(cb) {
        setTimeout(cb, 17);
      };

    /********************
      Spark
    ********************/
    
    function Spark(ctx, x, y, cl) {
      this.ctx = ctx;
      this.init(x, y, cl);
    }
    
    Spark.prototype.init = function(x, y, cl) {
      this.x = x;
      this.y = y;
      this.cl = cl;
      this.lw = 1;
      this.r = rand(5, 30);
      Math.random() < 0.8 ? this.l = rand(0, 50) : this.l = rand(100, 150);
      this.sl = this.l;
      this.ga = Math.random() * Math.random();
      this.v = {
        x: Math.cos(rand(0, 360) * Math.PI / 180) * Math.random() * 2,
        y: Math.sin(rand(0, 360) * Math.PI / 180) * Math.random() * 2
      };
    };

    Spark.prototype.draw = function() {
      var ctx  = this.ctx;
      ctx.save();
      ctx.lineWidth = this.lw;
      ctx.globalAlpha = this.ga;
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = color;
      for (var i = 1; i < 9; i++) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(Math.cos(rad * i) * this.r + this.x, Math.sin(rad * i) * this.r + this.y);
        ctx.stroke();
      }
      ctx.restore();
    };

    Spark.prototype.updateParams = function(i) {
      // life
      this.l -= 1;
      if (this.l < 0) {
        this.cl++;
        this.init(pointX, pointY, this.cl);
      }
    };

    Spark.prototype.updatePosition = function() {
      this.x += this.v.x;
      this.y += this.v.y;
    };

    Spark.prototype.render = function(i) {
      this.updateParams(i);
      this.updatePosition();
      this.draw();
    };

    for (var i = 0; i < sparkNum; i++) {
      var s = new Spark(ctx, pointX, pointY, 0);
      sparks.push(s);
    }

    /********************
      Move
    ********************/

    function firstMotion() {
      pointY += 2;
    }

    function secondMotion() {
      pointX = Math.cos(time) * radius + X / 2;
      pointY = Math.sin(time) * radius + Y / 2;
      radius += 1;
    }

    function thirdMotion() {
      pointX = Math.cos(time) * radius + X / 2;
      pointY = Math.sin(time) * radius + Y / 2;
      radius -= 1;
    }
    
    function fourthMotion() {
      pointX = Math.sin(time) * X / 2 + X / 2;
      pointY = Y / 2;
    }

    function fifthMotion() {
      pointY = Math.sin(time) * radius + Y / 2;
      pointX += 5;
      radius += 1;
    }

    function lastMotion() {
      for (var i = 0; i < sparks.length; i++) {
        sparks[i].x = rand(0, X);
        sparks[i].y = rand(0, Y);
        sparks[i].r = 100;
      }
    }

    /********************
      Render
    ********************/
    
    function first() {
      return new Promise(function(res, rej) {
        render();
        function render() {
          time += 0.1;
          color = 'hsl(' + Math.sin(time * Math.PI / 180) * 360 + ', 80%, 60%)';
          ctx.clearRect(0, 0, X, Y);
          firstMotion();
          for (var i = 0; i < sparks.length; i++) {
            sparks[i].render(i);
          }
          if (pointY > Y / 2) {
            res();
          } else {
            requestAnimationFrame(render);
          }
        }
      });
    }

    function second() {
      return new Promise(function(res, rej) {
        render();
        function render() {
          time += 0.1;
          color = 'hsl(' + Math.sin(time * Math.PI / 180) * 360 + ', 80%, 60%)';
          ctx.clearRect(0, 0, X, Y);
          secondMotion();
          for (var i = 0; i < sparks.length; i++) {
            sparks[i].render(i);
          }
          if (radius > 200) {
            res();
          } else {
            requestAnimationFrame(render);
          }
        }
      });
    }
    
    function third() {
      return new Promise(function(res, rej) {
        render();
        function render() {
          time += 0.1;
          color = 'hsl(' + Math.sin(time * Math.PI / 180) * 360 + ', 80%, 60%)';
          ctx.clearRect(0, 0, X, Y);
          thirdMotion();
          for (var i = 0; i < sparks.length; i++) {
            sparks[i].render(i);
          }
          if (radius <= 1) {
            res();
          } else {
            requestAnimationFrame(render);
          }
        }
      });
    }
     
    function fourth() {
      return new Promise(function(res, rej) {
        time = 0;
        render();
        function render() {
          time += 0.03;
          color = 'hsl(' + Math.sin(time * Math.PI / 180) * 360 + ', 80%, 60%)';
          ctx.clearRect(0, 0, X, Y);
          fourthMotion();
          for (var i = 0; i < sparks.length; i++) {
            sparks[i].render(i);
          }
          if (pointX < 5) {
            res();
          } else {
            requestAnimationFrame(render);
          }
        }
      });
    }

    function fifth() {
      return new Promise(function(res, rej) {
        time = 0;
        radius = 0;
        render();
        function render() {
          time += 0.1;
          color = 'hsl(' + Math.sin(time * Math.PI / 180) * 360 + ', 80%, 60%)';
          ctx.clearRect(0, 0, X, Y);
          fifthMotion();
          for (var i = 0; i < sparks.length; i++) {
            sparks[i].render(i);
          }
          if (pointX > X) pointX = 0;
          if (radius > Y / 2) {
            res();
          } else {
            requestAnimationFrame(render);
          }
        }
      });
    }
    
    function last() {
      return new Promise(function(res, rej) {
        render();
        function render() {
          time += 0.1;
          color = 'hsl(' + Math.sin(time * Math.PI / 180) * 360 + ', 80%, 60%)';
          ctx.clearRect(0, 0, X, Y);
          lastMotion();
          for (var i = 0; i < sparks.length; i++) {
            sparks[i].render(i);
          }
          if (radius > 100) {
            res();
          } else {
            requestAnimationFrame(render);
          }
        }
      });
    }

    function recursion() {
      first()
      .then(second)
      .then(third)
      .then(fourth)
      .then(fifth)
      .then(last)
      .then(function() {
        time = 0;
        radius = 0;
        pointX = X / 2;
        pointY = 0;
        recursion();
      });
    }

    recursion();

    /********************
      Event
    ********************/
    
    function onResize() {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', function() {
      onResize();
    });

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, false);

  });
})();