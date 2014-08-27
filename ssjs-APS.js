var pixelbox_width = 640; //Canvas Width
var pixelbox_height = 480; //Canvas Height
var pixelbox_pixelsize = 10; //Pixel Size
var pixelbox_defaultColor = 'ffffff'; //Default Canvas Color
var pixelbox_grid = new Object(); //Grid Object

//Where the images are saved. Change this to match
//Your directory. Must be relative to APE and APE user must have write access
var pixelbox_savelocation = "/home/malou/saves";

//We init the grid object at the right size with the default color
for (var i = 0; i < (pixelbox_width / pixelbox_pixelsize); i++) {
  pixelbox_grid[i] = new Object();
  for (var j = 0; j < (pixelbox_height / pixelbox_pixelsize); j++) {
    pixelbox_grid[i][j] = pixelbox_defaultColor;
  }
}

//This command return the current grid to the client
//with infos on the grid (size, pixelsize, defaultColor, etc.)
Ape.registerCmd('pixelbox_getGrid', true, function(params, info) {
  info.sendResponse("pixelbox_grid", {
    data: {
      width: pixelbox_width,
      height: pixelbox_height,
      pixelSize: pixelbox_pixelsize,
      grid: pixelbox_grid,
      defaultColor: pixelbox_defaultColor
    },
  });
});

//When a user draws a pixel, this command is called so the new pixel
//is added to the grid. This command then inform the client on the specified
//channel a new pixel have been drawn
Ape.registerCmd('pixelbox_drawPixel', true, function(params, info) {

  //Get the channel object from it's name passed as param
  var chan = Ape.getChannelByName(params.channel);

  //Make sure the channel exist
  if (!chan) {
    return ["401", "UNKNOWN_CHANNEL"];
  }

  //Update the grid
  if (pixelbox_grid[params.data.x] && pixelbox_grid[params.data.x][params.data.y]) {
    pixelbox_grid[params.data.x][params.data.y] = params.data.color;
  }

  //Send the event to all the clients
  //If we are using ApePubSub, we send an event, otherwise we send
  //a raw (default APE/JSF behaviour)
  if (typeof chan.sendEvent === 'function') {
    chan.sendEvent('pixelbox_newPixel', params.data);
  } else {
    chan.sendRaw('pixelbox_newPixel', params.data);
  }

  return 1;

});

//This function save the current canvas raw image Base64 encoded string.
//It saves the image to the filesystem using os.system function
//And to a MySQL Database
Ape.registerCmd('pixelbox_savedraw', true, function(params, info) {

  //Get the date for the file name
  var date = new Date();
  var now = date.getTime();

  //This is the file the image will be saved to
  var file = pixelbox_savelocation + "/" + now + ".png";

  //Retreive the encoded string
  var imgRawData = params.data;
  imgData = imgRawData.replace("data:image/png;base64,", "");

  //We decode the data and save write the file
  //This should work, but it doesn't for some reason...
  /*
	fn = os.writefile(file, Ape.base64.decode(imgData), false);
	if (fn) {
	    Ape.log('write succesfully in ' + file + ': ' + fn);
	}else{
	    Ape.log('Could not write file: ' + fn);
	}
	*/

  //Let's do this instead.
  //WARNING: "os.system" is a potentially dangerous function. Use with care!
  os.system('/bin/echo', imgData + ' | base64 -d > ' + file);

  //TODO : Use config file for settings
  var sql = new Ape.MySQL("127.0.0.1:3306", "ape", "apepsw", "ape_pixelbox");

  //Connect to the database
  sql.onConnect = function() {

    //Insert the data into the table.
    sql.query("INSERT INTO drawings (path, filename, rawData) VALUES ('" + pixelbox_savelocation + "/', '" + now + ".png','" + imgRawData + "')", function(res, errorNo) {
      if (errorNo) Ape.log('Request error : ' + errorNo + ' : ' + this.errorString());
    });
  }

  return 1;
});

Ape.registerCmd('pixelbox_getgallery', true, function(params, info) {

	Ape.log('TEST');

	 //Get the channel object from it's name passed as param
	 var chan = Ape.getChannelByName(params.channel);

	//
	var sql = new Ape.MySQL("127.0.0.1:3306", "ape", "apepsw", "ape_pixelbox");
	
	//Connect to the database
	sql.onConnect = function() {
	
		//Insert the data into the table.
		sql.query("SELECT * FROM drawings LIMIT 30", function(res, errorNo) {  
			if (errorNo) { 
				Ape.log('Request error : ' + errorNo + ' : ' + this.errorString());
			} else {
				Ape.log('Sending result:');
				Ape.log(res);
				chan.sendRaw('pixelbox_gallery', res);
			}
		});
	}
});

Ape.log('[JS] PixelBox ready !');
