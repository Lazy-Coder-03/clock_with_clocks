// digits_display.js
// Class to display a single digit using a 4x6 grid of small_clock instances

(function (global) {
    class digits_display {
        constructor(x, y, w, h, digit = 0) {
            this.x = x; // Center x position
            this.y = y; // Center y position
            this.w = w; // Width of the digit display
            this.h = h; // Height of the digit display
            this.digit = digit; // Current digit to display (0-9)
            this.clocks = []; // Array to hold the 24 clocks (4 cols x 6 rows)

            // Create the 4x6 grid of clocks with equal horizontal and vertical spacing
            const cols = 4;
            const rows = 6;

            // cellSize is the distance between clock centers horizontally and vertically
            const cellSize = Math.min(w / cols, h / rows);

            // clockSize (radius) is a fraction of the cell size so clocks don't touch
            const clockSize = cellSize * 0.45; // diameter equals cellSize * 0.5

            // Center the grid at (this.x, this.y). Use symmetric offsets so spacing is equal.
            const halfCols = (cols - 1) / 2;
            const halfRows = (rows - 1) / 2;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    // position clocks so spacing between centers is `cellSize` both axes
                    let clockX = this.x + (col - halfCols) * cellSize;
                    let clockY = this.y + (row - halfRows) * cellSize;
                    this.clocks.push(new global.small_clock(clockX, clockY, clockSize, [135, 135]));
                }
            }

            // Display the initial digit
            this.setDigit(digit);
        }

        // Set a new digit to display
        setDigit(digit) {
            this.digit = digit;
            const pattern = global.digits[digit.toString()];

            if (!pattern) {
                console.error("Invalid digit:", digit);
                return;
            }

            for (let i = 0; i < pattern.length && i < this.clocks.length; i++) {
                const symbol = pattern[i];
                const angles = global.rotation[symbol];
                this.clocks[i].animate_to_angles(angles);
            }
        }

        // Render all clocks in the display
        render() {
            for (let clock of this.clocks) {
                clock.render();
            }
        }

        // Get the current digit
        getDigit() {
            return this.digit;
        }
    }

    global.digits_display = digits_display;
})(window);
