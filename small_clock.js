(function (global) {
    class small_clock {
        constructor(x, y, r, angles) {
            this.pos = createVector(x, y);
            this.r = r;
            this.angles = angles.slice();
            this.targetAngles = angles.slice();
            this.speed = 20; // Smoother animation speed
        }

        render() {
            push();
            translate(this.pos.x, this.pos.y);

            // Enhanced container with depth
            noFill();
            rectMode(CENTER);

            // Outer glow
            drawingContext.shadowBlur = 8;
            drawingContext.shadowColor = 'rgba(100, 120, 180, 0.3)';
            stroke(60, 70, 90, 200);
            strokeWeight(1.5);
            rect(0, 0, this.r * 2.1, this.r * 2.1, this.r * 0.15);

            // Main container with gradient effect
            drawingContext.shadowBlur = 0;
            stroke(80, 95, 120, 180);
            strokeWeight(2);
            rect(0, 0, this.r * 2, this.r * 2, this.r * 0.12);

            // Inner shadow effect
            stroke(30, 40, 55, 100);
            strokeWeight(1);
            rect(0, 0, this.r * 1.9, this.r * 1.9, this.r * 0.1);

            // Animate towards target angles
            this.animate_to_angles(this.targetAngles);

            // Enhanced clock hands with glow - both same length
            for (let i = 0; i < this.angles.length; i++) {
                let angle = this.angles[i];
                let a = radians(angle - 90);
                let x = cos(a) * this.r * 0.75;
                let y = sin(a) * this.r * 0.75;

                // Glow effect for hands
                drawingContext.shadowBlur = 12;
                drawingContext.shadowColor = i === 0 ? 'rgba(255, 215, 0, 0.6)' : 'rgba(255, 230, 100, 0.6)';

                // Hand gradient from center to tip
                let gradient = drawingContext.createLinearGradient(0, 0, x, y);
                gradient.addColorStop(0, 'rgba(255, 240, 150, 1)');
                gradient.addColorStop(1, 'rgba(255, 215, 0, 1)');
                drawingContext.strokeStyle = gradient;

                strokeWeight(3);
                line(0, 0, x, y);

                // Remove hand tip ellipse so hands render as lines only
                // If you want a subtle highlight at the tip, you can uncomment the
                // following lines to draw a small point using stroke instead of an ellipse.
                // stroke(255, 240, 150);
                // strokeWeight(2);
                // point(x, y);
            }

            drawingContext.shadowBlur = 0;

            // Center dot with metallic look
            fill(220, 210, 180);
            stroke(180, 170, 140);
            strokeWeight(1);
            ellipse(0, 0, this.r * 0.2, this.r * 0.2);

            pop();
        }

        animate_to_angles(targetAngles) {
            // Defensive: ensure targetAngles is an array
            if (!Array.isArray(targetAngles)) return;
            this.targetAngles = targetAngles.slice();

            for (let i = 0; i < this.angles.length; i++) {
                // normalize current angle to [0,360)
                let current = ((this.angles[i] % 360) + 360) % 360;

                // if no target provided for this index, keep current
                let target = (typeof targetAngles[i] === 'number')
                    ? ((targetAngles[i] % 360) + 360) % 360
                    : current;

                // shortest angular difference in range (-180, 180]
                let diff = ((target - current + 540) % 360) - 180;

                let absDiff = Math.abs(diff);
                if (absDiff <= this.speed) {
                    // close enough: snap to target
                    this.angles[i] = target;
                } else {
                    // step towards target along shortest path without overshooting
                    let step = this.speed * (diff > 0 ? 1 : -1);
                    this.angles[i] = (current + step + 360) % 360;
                }
            }
        }
    }

    global.small_clock = small_clock;
})(window);