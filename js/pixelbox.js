/*!
 * Pixelbox 2
 *
 * Created by Louis Charette (@lcharette)
 * Based on the original APE Server demo
 * Version 2.0
 *
 * This is used to draw pixelart in a HTML5
 * Canvas element.
 *
 * Requires jQuery & jCanvas
 */
function Pixelbox (options) {

	this.option = {
		width: 200,					//Of the canvas
		height: 200,				//Of the canvas
		pixelSize: 1,				//Size of the pixels
		canvas: $('canvas'),		//Canva element
		defaultColor: "ffffff",		//Default canvas color
		drawCallback: null,			//Callback for a draw event
		grid: null,					//Initial Canvas. This grid is a table
									// of point containing each pixel color
									// e.g.: grid[x][y] = 'ffffff';
	}

	//Update options with argument
	if(!!options){
		for(var opt in options){
			this.option[opt] = options[opt];
		}
	}

	/**
	 * The color we draw with
	 * @type {string}
	 * @public
	 * @default: Default pixelbox color
	 */
	this.userColor = this.option.defaultColor;

	/**
	 * The mouse event state
	 * @type {Bool}
	 * @private
	 */
	this._clicked = false;

	/**
	 * This tells the script
	 * if the shift key is
	 * currently down
	 * @type {Bool}
	 * @private
	 */
	this._shifted = false;

	/**
	 * Last pixel location
	 * we added to the canvas
	 * @type {Object}
	 * @private
	 */
	this._currentPixel = {x: 0, y: 0};

	//TODO : CHECK for jCanvas / Canvas support


	//Setup the canvas size
	this._setupCanvas();

	//Init the cavas with the passed grid
	if (this.option.grid != null) {
		this.drawCanvasFromGrid(this.option.grid);
	}

	/**
	 *
	 * MOUSE EVENTS
	 *
	 */

	 _this = this;

	/**
	 * The mouse event when the canvas is clicked
	 */
	$(this.option.canvas).mousedown(function(e) {

		//We only respond to a left mouse click
		if (e.which === 1) {


			//We are currently cliking
			this._clicked = true;

	        //Calculate the position and do the math to find wich grid pixel we're on
			var posX = Math.floor((e.pageX - $(this).offset().left) / _this.option.pixelSize);
			var posY = Math.floor((e.pageY - $(this).offset().top)  / _this.option.pixelSize);

			//If we are holding shift, we draw a line from previous point
			//Otherwise, we draw a single poijt where the mouse is
			if (_this._shifted) {

				//When we move we draw a line and not a single pixel
				//because Javascript can skip pixel if the mouse move too fast
				_this.drawLine(_this._currentPixel.x, _this._currentPixel.y, posX, posY, _this.userColor, _this.option.drawCallback);

			} else {

				//We draw this pixel
				_this.drawPixel(posX, posY, _this.userColor, _this.option.drawCallback);

			}

			//We keep a trace of which pixel we just draw on. This will serve
			//not to draw the same pixel twice if the mouse move inside the same pixel.
			_this._currentPixel.x = posX;
			_this._currentPixel.y = posY;

		}
    });

    /**
	 * Keyboard event for the "shift key to draw line" feature
	 */
	$(document).bind('keyup keydown', function(e){
		_this._shifted = e.shiftKey;
	});

    /**
	 * The mouse event when the mouse click is realeased
	 * N.B.: This is on body in case the mouse is released outside the canvas
	 */
    $("body").mouseup(function(e) {

    	//We only respond to a left mouse click
    	if (e.which === 1) {

    		//We are currently *NOT* cliking
    		_this._clicked = false;
    	}
    });

    /**
	 * The mouse event when the mouse move on the canvas to paint
	 */
    $(this.option.canvas).mousemove(function(e) {

    	//We only respond to a left mouse click
    	//*AND* if we are currently drawing
		if (this._clicked && e.which === 1) {

	        //Calculate the position and do the math to find wich grid pixel we're on
			var posX = Math.floor((e.pageX - $(this).offset().left) / _this.option.pixelSize);
			var posY = Math.floor((e.pageY - $(this).offset().top)  / _this.option.pixelSize);

			//We look if we are in the same pixel as the one we draw before
			if (posX != _this._currentPixel.x || posY != _this._currentPixel.y) {

				//When we move we draw a line and not a single pixel
				//because Javascript can skip pixel if the mouse move too fast
				_this.drawLine(_this._currentPixel.x, _this._currentPixel.y, posX, posY, _this.userColor, _this.option.drawCallback);

				//We keep a trace of which pixel we just draw on for the next move
				_this._currentPixel.x = posX;
				_this._currentPixel.y = posY;
			}

		}
    });

	//Return the object
	return this;
}

Pixelbox.prototype.setWidth = function (newWidth) {
	this.option.width = newWidth;
	this._setupCanvas();
}

Pixelbox.prototype.setHeight = function (newHeight) {
	this.option.height = newHeight;
	this._setupCanvas();
}

Pixelbox.prototype._setupCanvas = function() {

	//N.B.: Attributes must be used and not CSS. Otherwise,
	//      The canvas is stretched
	$(this.option.canvas).attr({
		width: this.option.width,
		height: this.option.height
	});
}


/**
 * This function draw a grid based on a grid object
 * N.B.: Grid is assumed same size as canvas :(
 */
Pixelbox.prototype.drawCanvasFromGrid = function (grid) {

	//Loop all the canvas pixel. We
	for (var i = 0; i < Math.min(this._objectSize(grid), (this.option.width / this.option.pixelSize)); i++) {
        for (var j = 0; j < Math.min(this._objectSize(grid[i]), (this.option.height / this.option.pixelSize)); j++) {

        	//Draw the pixel with a color from the grid.
        	this.drawPixel(i, j, grid[i][j]);
        }
	}
}

/**
 * This function reset the canvas with a defined color
 */

Pixelbox.prototype.resetCanvas = function(color, callback) {

	//If a color is not set, we use the default one.
	color = color || this.option.defaultColor;

	for (var i = 0; i<(this.option.width / this.option.pixelSize); i++) {
        for (var j = 0; j<(this.option.height / this.option.pixelSize); j++) {

            //Draw the pixel
            this.drawPixel(i, j, color, callback);
        }
	}
}

/**
 * This function draw a pixel on the canvas
 * we also send a callback if it is defined
 */
Pixelbox.prototype.drawPixel = function (posX, posY, color, callback) {

	_this = this;

	//Use jCanvas method to add a rectangle (pixel) on the canvas
	$(this.option.canvas).drawRect({
		fillStyle: '#'+color,				//Fill color
		x: posX * _this.option.pixelSize, 	//X position
		y: posY * _this.option.pixelSize,	//Y position
		width: _this.option.pixelSize,		//Pixel width
		height: _this.option.pixelSize,		//Pixel Height
		fromCenter: false
	});

	//We send the callback
	if (typeof callback == "function") {
		callback(posX, posY, this.option.pixelSize, color);
	}
}

/**
 * This function draw a line of pixels on the canvas based on start and finish
 * Coordinates. This use "drawPixel" to draw each pixel of the line
 *
 * This is an implementation of Bresenham's line algorithm
 * Ref.: http://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
 *
 * Javascript version from Stackoverflow
 * Ref.: http://stackoverflow.com/q/4672279
 */
Pixelbox.prototype.drawLine = function(x1, y1, x2, y2, color, callback) {

	_this = this;

	// Define differences and error check
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;

    // Set first coordinates
    this.drawPixel(x1, y1, color, callback);

    // Main loop
    while (!((x1 == x2) && (y1 == y2))) {
      var e2 = err << 1;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
      // Set coordinates
      this.drawPixel(x1, y1, color, callback);
    }
}

Pixelbox.prototype._objectSize = function(obj) {
	var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

Pixelbox.prototype.getImageData = function() {
	return $(this.option.canvas).getCanvasImage();
}

Pixelbox.prototype.openImage = function() {

	var dataURL = $(this.option.canvas)[0].toDataURL("image/png");
	window.open(dataURL, "Canvas Image");
	
}

Pixelbox.prototype.download = function() {
	var dataURL = $(this.option.canvas)[0].toDataURL("image/png");
	dataURL = dataURL.replace("image/png", "image/octet-stream");
    document.location.href = dataURL;
}