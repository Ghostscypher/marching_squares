const CIRCLE_DIAMETER = 50;
const BALL_COUNT = 10;

let metaballs;
let font = null;

function preload() {
    my_shader = loadShader(
        './shaders/metaballs.vert',
        './shaders/metaballs.frag'
    );

    font = loadFont('./fonts/helvetica.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    // createCanvas(800, 800, WEBGL);
    pixelDensity(1);
    colorMode(HSB, 1);

    // Create a metaballs object
    metaballs = new MetaBalls();

    // Draw 4 circles with different colors
    for (let i = 0; i < BALL_COUNT; i++) {
        let x = random(width);
        let y = random(height);
        let d = random(30, CIRCLE_DIAMETER);
        // let d = 200;

        // Add the ball to the metaballs object
        metaballs.addBall(new Ball(x, y, d));
    }

    // frameRate(10);
    shader(my_shader);
}

function HSBToRGB(h, s, v) {
    let r, g, b, i, f, p, q, t;

    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }

    return [
        r, g, b
    ];
}

//
let colors_r = [];
let colors_g = [];
let colors_b = [];

function draw() {

    if (colors_r.length == 0) {
        // Push colors of balls to array
        for (let ball of metaballs.balls) {
            colors_r.push(ball.color._getHue());
            colors_g.push(1);
            colors_b.push(1);
        }
    }

    // Set up shader
    // shader(my_shader);
    my_shader.setUniform('u_resolution', [width, height]);
    my_shader.setUniform('u_xs', metaballs.balls.map(b => b.position.x));
    my_shader.setUniform('u_ys', metaballs.balls.map(b => b.position.y));
    my_shader.setUniform('u_rs', metaballs.balls.map(b => b.r));
    my_shader.setUniform('u_colors_r', colors_r);
    my_shader.setUniform('u_colors_g', colors_g);
    my_shader.setUniform('u_colors_b', colors_b);
    my_shader.setUniform('u_time', millis() / 1000);

    // Display the shader data
    // rect(0, 0, width, height);
    quad(-1, -1, 1, -1, 1, 1, -1, 1);

    // Draw the metaballs
    // background(0);

    // Draw the grid
    metaballs.update();
}