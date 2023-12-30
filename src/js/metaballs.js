class Ball {

    constructor(x, y, d) {
        // Radius
        this.d = d;
        this.r = d / 2;

        // Position
        this.position = createVector(x, y);

        // Velocity
        this.velocity = createVector(random(-3, 3), random(-3, 3));

        // Random color
        this.color = color(
            random(1),
            1,
            1
        );

        // Random name
        this.name = "[" + int(x) + "|" + int(y) + "|" + int(d) + "]";
    }

    // Move the ball
    move() {
        // If we are at the edge of the screen, reverse velocity
        if (this.position.x < 0 || this.position.x > width) {
            this.velocity.x *= -1;
        }

        if (this.position.y < 0 || this.position.y > height) {
            this.velocity.y *= -1;
        }

        // Add velocity to position
        this.position.add(this.velocity);

        // Add friction
        // this.velocity.mult(1);
    }

    show(show_ellipse) {
        noFill();
        stroke(this.color, 0, 0);
        strokeWeight(1);

        if (show_ellipse) {
            ellipse(this.position.x, this.position.y, this.d);
        }
    }

}


class MetaBalls {

    constructor() {
        this.balls = [];
    }

    addBall(ball) {
        this.balls.push(ball);
    }

    update() {
        for (let ball of this.balls) {
            ball.move();
        }
    }

    show(show_ellipse = false) {
        for (let ball of this.balls) {
            ball.move();
            ball.show(show_ellipse);
        }

    }
}