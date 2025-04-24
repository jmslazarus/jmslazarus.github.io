elation.extend("utils.sound.system", new function() {
	this.sounds = {};
	this.context = new (window.AudioContext || window.webkitAudioContext)();

	this.init = () => {
		// if (!this.context) {
		// 	console.error("Web Audio API is not supported in this browser");
		// }
	}
	
	this.load = (name, url, callback) => {
		fetch(url)
			.then(response => response.arrayBuffer())
			.then(data => {
				this.context.decodeAudioData(data, buffer => {
					this.sounds[name] = new elation.utils.sound.object({
						name, 
						url, 
						buffer,
						context: this.context});
					if (callback) {
						callback(buffer)
					}
				})
			});
	}

	this.get = (name) => {
		if (this.sounds[name]) {
			return this.sounds[name];
		} else {
			console.error("Sound not found: " + name);
			return null;
		}
	}

	this.loop = (name) => {
		this.play(name, true);
	}

	this.play = (name, loop) => {
		let sound = this.get(name);

		if (sound) {
			sound.play(loop);
		}
	}

	this.pause = (name) => {
		let sound = this.get(name);

		if (sound) {
			sound.pause();
		}
	}

	this.stop = (name) => {
		let sound = this.get(name);

		if (sound) {
			sound.stop();
		}
	}
	this.setVolume = (name, volume) => {
		let sound = this.get(name);

		if (sound) {
			sound.volume = volume;
		}
	}

	this.init();
});

elation.extend("utils.sound.object", function(args) {
	this.name = args.name;
	this.url = args.url;
	this.buffer = args.buffer;
	this.context = args.context;
	this.source; // Reference to the audio source
	this.isPlaying = false; // State to track if the audio is playing
	this.startTime = 0; // When playback started
	this.pausedTime = 0; // How long the audio has been played before pausing
	this.isPaused = false; // State to track if the audio is paused
	this.volume = 1; // Default volume level
	
	if (this.context) {
		this.gainNode = this.context.createGain()
	}

	// Play or resume the audio
	this.play = (loop) => {
		if (loop && this.isPlaying) return; // Prevent starting if already playing
	
		this.source = this.context.createBufferSource(); // Create a new source
		this.source.buffer = this.buffer; // Use the loaded buffer
		this.source.loop = loop || false; // Enable looping
		this.source.connect(this.gainNode); // Connect to output
		this.gainNode.connect(this.context.destination); // Connect to output
		this.gainNode.gain.value = this.volume; // Set volume (1 is max)
	

		// Calculate when to start based on paused time
		this.source.start(0, loop ? this.pausedTime : 0);
		this.startTime = this.context.currentTime - this.pausedTime; // Record the start time
		this.isPlaying = true;
	
		// Handle when playback ends
		this.source.onended = () => {
			this.isPlaying = false;
			if (!this.isPaused) {
				this.pausedTime = 0; // Reset paused time when playback finishes
			}
		};
	}

	this.setVolume = (volume) => {
		if (this.gainNode) {
			this.gainNode.gain.value = volume; // Set the volume
			this.volume = volume; // Update the volume property
		}
	}

	this.stop = () => {
		if (this.source) {
			this.isPaused = false; // Reset paused state
			this.source.stop(); // Stop the audio source
			this.isPlaying = false; // Update the state
			this.pausedTime = 0; // Reset paused time when stopping
		}
	}
	
	// Pause the audio
	this.pause = () => {
		if (!this.isPlaying) {
			return; // Prevent pausing if not playing
		}
		this.isPaused = true; // Set paused state
		this.source.stop(); // Stop the audio source
		this.pausedTime = this.context.currentTime - this.startTime; // Save the paused time
		this.isPlaying = false;
	}

	this.init = function() {
		
	}
});
