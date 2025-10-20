// small_clock.js
// Defines the small_clock class and attaches it to the global scope for non-module usage.

(function (global) {
    class small_clock {
        constructor(x, y, r, angles) {
            // createVector is available in p5 global mode
            this.pos = createVector(x, y);
            this.r = r;
            this.angles = angles.slice();
            this.targetAngles = angles.slice(); // Initialize target angles
            this.speed = 10; // Degrees per frame - adjust for faster/slower animation
        }

        render() {
            push();
            translate(this.pos.x, this.pos.y);
            stroke(255,150);
            noFill();
            rectMode(CENTER)

            rect(0, 0, this.r * 2, this.r * 2, this.r*0.1);

            // Animate towards target angles
            this.animate_to_angles(this.targetAngles);

            for (let angle of this.angles) {
                let a = radians(angle - 90);
                let x = cos(a) * this.r * 0.8;
                let y = sin(a) * this.r * 0.8;
                stroke(220, 220, 0);
                strokeWeight(2)
                line(0, 0, x, y);
            }
            pop();
        }

        animate_to_angles(targetAngles) {
            this.targetAngles = targetAngles.slice(); // Update target angles

            for (let i = 0; i < this.angles.length; i++) {
                let current = this.angles[i];
                let target = targetAngles[i];

                // Calculate the difference
                let diff = target - current;

                // Normalize the difference to be between -180 and 180
                // This ensures we always take the shortest path
                while (diff > 180) diff -= 360;
                while (diff < -180) diff += 360;

                // If we're close enough, snap to target
                if (abs(diff) < this.speed) {
                    this.angles[i] = target;
                } else {
                    // Move towards target by speed amount in the correct direction
                    this.angles[i] += this.speed * (diff > 0 ? 1 : -1);
                }

                // Keep angles normalized between 0 and 360
                this.angles[i] = (this.angles[i] + 360) % 360;
            }
        }
    }

    global.small_clock = small_clock;
})(window);
