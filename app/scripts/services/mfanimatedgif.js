'use strict';
/* global $ */
angular.module('artpopApp')
.factory('MFAnimatedGIF', function (InlineWorkerFactory, $templateCache) {
	// Service logic
	// ...

	//Kudos:
	//h5bp/h5MFAnimatedGif github

	/*
	new MFAnimatedGIF({
		images: frame,
		rotations: rotations,
		delay : 1000/20,
		quality : 3,
		repeat: 0,
		height: 320,
		width : 320,
		progress: function(info){
			console.log('progress', info * 100);
		},// console.dir(arguments);
		done: function(info){
			//info.rawDataURL
			//info.binaryURL //blob, use href
			//info.dataURL //base64, src string.

			var image;
			image = new Image();
			image.src = info.dataURL;
			document.getElementById('apwgl-slider').appendChild(image);

			that.enableSkipFrame();
			that.startLoop();

		}
	});


	var img = new Image();
		img.src = that.takeScreenShot();
		frame.push(img);
		rotations.push(0);

	*/


	// handles interfacing with omggif-worker.js
	function MFAnimatedGIF(opts) {

		// var _rotate = function(image, rotation) {
		// 	var canvas = document.createElement('canvas');
		// 	canvas.width = image.width;
		// 	canvas.height = image.height;
		// 	var ctx = canvas.getContext('2d');
		// 	ctx.translate(image.width/2, image.height/2);
		// 	ctx.rotate(rotation * Math.PI / 180.0);
		// 	ctx.drawImage(image, -image.width/2, -image.height/2, image.width, image.height);
		// 	ctx.rotate(rotation * Math.PI / 180.0);
		// 	ctx.translate(-image.width/2, -image.height/2);

		// 	return canvas;
		// };

		var _initialize = function(opts) {

			var frames;
			if (opts.imageType === 'raw'){
				frames = opts.images;
			}else{
				frames = [];
				var canvas = document.createElement('canvas');
				var context = canvas.getContext('2d');

				canvas.width  = opts.width;
				canvas.height = opts.height;

				for(var i=0; i<opts.images.length; i++) {
					var animframe;
					//animframe = (opts.rotations[i] === 0) ? opts.images[i] : _rotate(opts.images[i], opts.rotations[i]);
					animframe = opts.images[i];

					context.clearRect(0, 0, canvas.width, canvas.height);
					context.drawImage(animframe, 0, 0, animframe.width, animframe.height, 0, 0, canvas.width, canvas.height);
					var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
					frames.push(imageData);
				}
			}



			var inlineWoekrMaker = new InlineWorkerFactory();
			var worker = inlineWoekrMaker.spawn({
				// deps: [
				// 	['ma', function ma(){ return 'ok'; }],
				// 	['ma2', function ma2(){ return 'ok2'; }],
				// 	['ma3', function ma3(){ return 'ok3'; }]
				// ],
				noopImportScript: true,
				imports: [
					$templateCache.get('workers/NeuQuant.js'),
					$templateCache.get('workers/omggif.js'),
					$templateCache.get('workers/omggif-worker.js')
				],
				// fn: function(self){
				// 	var result = self.ma();
				// 	result += self.ma2();
				// 	result += self.ma3();
				// 	result += self.ma4;
				// 	self.postMessage(result);
				// },
			});



			//var gifWorker = new Worker('workers/omggif-worker.js');
			var gifWorker = worker;

			gifWorker.addEventListener('message', function (e) {
				if (e.data.type === 'progress') {
					// Percent done, 0.0-0.1
					opts.progress(e.data.data);
				} else if (e.data.type === 'gif') {
					var info = e.data;
					info.binaryURL = _binaryURL( e.data.data );
					info.rawDataURL = _rawDataURL( e.data.data );
					info.dataURL = _dataURL( info.rawDataURL );
					opts.done(info);
				}
			}, false);
			gifWorker.addEventListener('error', function (e) {
				opts.error(e);
				gifWorker.terminate();
			}, false);

			gifWorker.postMessage({
				frames: frames,
				delay: opts.delay,
				matte: [255, 255, 255],
				transparent: [0, 255, 0]
			});

		};

		var _rawDataURL = function(data) {
			return $.base64.encode(data);
		};

		var _dataURL = function(rawData) {
			return 'data:image/gif;base64,' + rawData;
		};

		var _binaryURL = function(data) {
			window.URL = window.URL || window.webkitURL;
			var blob = new Blob([data], {type: 'image/gif'});
			return window.URL.createObjectURL(blob);
		};

		_initialize(opts);

	}



	// new MFAnimatedGIF({
	// 	images: [ new Image(), new Image() ],
	// 	rotations: [ 0, 0],
	// 	delay : 300,
	// 	quality : 3,
	// 	repeat: 0,
	// 	height: 200,
	// 	width : 200,
	// 	progress: function(){ console.dir(arguments); },
	// 	done: function(){ console.dir(arguments); }
	// });

	// Public API here
	return MFAnimatedGIF;
});
