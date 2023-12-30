const CIRCLE_DIAMETER = 150;

let metaballs;
let quad_tree;

function setup() {
    // createCanvas(windowWidth, windowHeight);
    createCanvas(800, 800);
    pixelDensity(1);
    colorMode(HSB, 255);

    // Create a metaballs object
    metaballs = new MetaBalls();
    quad_tree = new QuadTree(new Rectangle(0, 0, width, height), 4);

    // Draw 4 circles with different colors
    for (let i = 0; i < 4; i++) {
        let x = random(width);
        let y = random(height);
        let d = random(50, CIRCLE_DIAMETER);
        // let d = 150;
        let ball = new Ball(x, y, d);

        // Add the ball to the metaballs object
        metaballs.addBall(ball);

        // Add the ball to the quad tree
        quad_tree.insert(new Point(x, y, ball));
    }

    // frameRate(10);
}

function drawGrid() {
    // Draw a grid
    stroke(100);
    strokeWeight(1);
    for (let x = 0; x < width; x += 10) {
        line(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 10) {
        line(0, y, width, y);
    }
}

function marchingSquares() {
    let temp = 0;

    // h(x, y) = f(x, y) - g(x, y)
    // f(x, y) = 1 / (x - x1)^2 + (y - y1)^2
    // g(x, y) = 1 / (x - x2)^2 + (y - y2)^2

    for (let x = 0; x < width; x += 20) {
        for (let y = 0; y < height; y += 20) {

            // For each metaball calculate h(x, y)
            let sum = 0;

            for (let ball of metaballs.balls) {
                // Get the position of the ball
                let x1 = ball.position.x;
                let y1 = ball.position.y;
                let r1 = ball.r;

                let h = ((x - x1) * (x - x1)) + ((y - y1) * (y - y1));
                sum += r1 / (Math.sqrt(h));
            }

            // Get the first ball in the quad tree
            let balls = quad_tree.query(new Circle(x, y, 200));
            let hue_color = 0;
            let prev_ball = null;

            if (Math.abs(sum) >= 1) {
                for (let ball of balls) {
                    // Only draw if the points are not inside the ball
                    ball = ball.data;

                    // Smoothen the color
                    hue_color += ball.color._getHue();

                    // Prevent the color from jumping
                    if (prev_ball != null) {
                        if (prev_ball.color._getHue() - ball.color._getHue() > 180) {
                            hue_color += 360;
                        }
                    }

                    prev_ball = ball;
                }

                // Make sure the hue color is between 0 and 255
                hue_color = hue_color % 255;

                // Average the hue color
                hue_color /= balls.length;

                // console.log(hue_color, saturation_color, sum);

                // hue_color = hue_color % 255;
                // saturation_color = saturation_color % 255;

                // Draw a point
                noStroke();
                strokeWeight(2);
                stroke(color(hue_color, 255, 255));
                point(x, y)
            }
        }
    }

    // noLoop();
}

function draw() {
    background(0);

    // Redraw the quad tree
    quad_tree.clear();

    for (let ball of metaballs.balls) {
        quad_tree.insert(new Point(ball.position.x, ball.position.y, ball));
    }


    // Draw the quad tree
    // quad_tree.show();

    // Draw the metaballs
    metaballs.show(true);

    // Draw a grid
    // drawGrid();

    // Marching square
    this.marchingSquares();


    // noLoop();
}