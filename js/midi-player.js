// MIDI Player functionality
class MIDIPlayer {
    constructor() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.midiData = null;
        this.synth = null;
        this.progressInterval = null;

        this.initializePlayer();
    }

    initializePlayer() {
        // Get DOM elements
        this.playBtn = document.getElementById('play-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.volumeSlider = document.getElementById('volume-slider');
        this.currentTimeEl = document.getElementById('current-time');
        this.totalTimeEl = document.getElementById('total-time');
        this.progressFill = document.getElementById('progress-fill-player');
        this.playIcon = document.querySelector('.play-icon');
        this.pauseIcon = document.querySelector('.pause-icon');

        // Check if all elements exist
        if (!this.playBtn || !this.stopBtn) {
            console.warn('MIDI Player elements not found');
            return;
        }

        // Initialize Tone.js synth if available
        if (typeof Tone !== 'undefined') {
            try {
                this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
                this.synth.volume.value = -10; // Default volume
                console.log('Tone.js synth initialized');
            } catch (error) {
                console.error('Error initializing Tone.js:', error);
            }
        } else {
            console.warn('Tone.js not loaded');
        }

        // Event listeners
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.stopBtn.addEventListener('click', () => this.stop());

        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        }

        console.log('MIDI Player initialized');
    }

    loadMIDI(midiFile) {
        // This would load the MIDI file
        // For now, we'll simulate with a duration
        this.duration = 120; // 2 minutes example
        if (this.totalTimeEl) {
            this.totalTimeEl.textContent = this.formatTime(this.duration);
        }
        this.midiData = midiFile;
        console.log('MIDI file loaded');
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    async play() {
        this.isPlaying = true;

        if (this.playIcon) this.playIcon.classList.add('hidden');
        if (this.pauseIcon) this.pauseIcon.classList.remove('hidden');

        // Start Tone.js if available
        if (typeof Tone !== 'undefined') {
            try {
                await Tone.start();
                console.log('Tone.js audio context started');
            } catch (error) {
                console.error('Error starting Tone.js:', error);
            }
        }

        // Start progress update
        this.progressInterval = setInterval(() => {
            this.currentTime += 0.1;
            if (this.currentTime >= this.duration) {
                this.stop();
            }
            this.updateProgress();
        }, 100);

        // Play a simple note as demo (replace with actual MIDI playback)
        if (this.synth) {
            this.playDemoNotes();
        }

        console.log('Playing MIDI');
    }

    pause() {
        this.isPlaying = false;

        if (this.playIcon) this.playIcon.classList.remove('hidden');
        if (this.pauseIcon) this.pauseIcon.classList.add('hidden');

        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }

        console.log('MIDI paused');
    }

    stop() {
        this.isPlaying = false;
        this.currentTime = 0;

        if (this.playIcon) this.playIcon.classList.remove('hidden');
        if (this.pauseIcon) this.pauseIcon.classList.add('hidden');

        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }

        this.updateProgress();
        console.log('MIDI stopped');
    }

    setVolume(value) {
        if (!this.synth) return;

        // Convert 0-100 to decibels (-60 to 0)
        const db = (value / 100) * 60 - 60;
        this.synth.volume.value = db;
    }

    updateProgress() {
        if (!this.progressFill || !this.currentTimeEl) return;

        const percentage = (this.currentTime / this.duration) * 100;
        this.progressFill.style.width = `${percentage}%`;
        this.currentTimeEl.textContent = this.formatTime(this.currentTime);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    playDemoNotes() {
        if (!this.synth) return;

        try {
            // Demo: play a simple melody
            const now = Tone.now();
            const notes = ['C4', 'E4', 'G4', 'C5'];
            notes.forEach((note, i) => {
                this.synth.triggerAttackRelease(note, '8n', now + i * 0.5);
            });
        } catch (error) {
            console.error('Error playing demo notes:', error);
        }
    }
}

// Initialize player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure all scripts are loaded
    setTimeout(() => {
        window.midiPlayer = new MIDIPlayer();
    }, 100);
});
