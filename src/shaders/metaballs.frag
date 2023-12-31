// #ifdef GL_ES
precision highp float;
// #endif

// Constants
# define BALLS 10

// Passed in from the vertex shader.
uniform vec2 u_resolution;
uniform float u_time;

uniform float u_xs[BALLS];
uniform float u_ys[BALLS];
uniform float u_rs[BALLS];

uniform float u_colors_r[BALLS];
uniform float u_colors_g[BALLS];
uniform float u_colors_b[BALLS];

// Interpolated from the vertex shader.
varying vec2 vTexCoord;

// Map that takes a float
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

// Map that takes any vec type
vec2 map(vec2 value, float min1, float max1, float min2, float max2) {
    return vec2(
        min2 + (value.x - min1) * (max2 - min2) / (max1 - min1),
        min2 + (value.y - min1) * (max2 - min2) / (max1 - min1)
    );
}

vec3 map(vec3 value, float min1, float max1, float min2, float max2) {
    return vec3(
        min2 + (value.x - min1) * (max2 - min2) / (max1 - min1),
        min2 + (value.y - min1) * (max2 - min2) / (max1 - min1),
        min2 + (value.z - min1) * (max2 - min2) / (max1 - min1)
    );
}

vec4 map(vec4 value, float min1, float max1, float min2, float max2) {
    return vec4(
        min2 + (value.x - min1) * (max2 - min2) / (max1 - min1),
        min2 + (value.y - min1) * (max2 - min2) / (max1 - min1),
        min2 + (value.z - min1) * (max2 - min2) / (max1 - min1),
        min2 + (value.w - min1) * (max2 - min2) / (max1 - min1)
    );
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// RGB to HSV
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 metaBalls(float x, float y) {
    float sum = 0.0;
    vec3 color = vec3(0.0);
    vec3 color_1 = vec3(0.0);
    float closest = -1.0;
    float closest_arr[BALLS];

    for (int i =  0; i < BALLS; i++) {
        float x1 = u_xs[i];
        float y1 = u_ys[i];
        float r1 = u_rs[i];

        float h = ((x - x1) * (x - x1)) + ((y - y1) * (y - y1));
        sum += r1 / sqrt(h);

        // If current pixel position is closert to the ball choose this as the color
        if(closest == -1.0 ||  h < closest) {
            closest = h;

            color_1 = vec3(
                u_colors_r[i], 
                u_colors_g[i], 
                u_colors_b[i]
            );
        }
    }

    // Rainbow colors
    // if(int(sum) == 1) {
    //     float a = (sum - 0.9) * 4.;
    //     return hsv2rgb(vec3(a, 1.0, 1.0));
    // }

    // Color the edges of the balls only
    if(sum > 1.0 && sum < 1.03) {
        // Average the colors of the balls
        return hsv2rgb(color_1);
    }
    
    return color;
}

void main() {
    vec2 uv = vTexCoord;
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    // Color based on x, y position
    // vec3 color = vec3(uv.x, uv.y, (uv.x + uv.y) / 2.0);
    vec3 color = vec3(0.0);
    vec2 pos = vec2(0.0);
    
    pos.x = map(uv.x, 0.0, 1.0, 0.0, u_resolution.x);
    pos.y = map(uv.y, 0.0, 1.0, 0.0, u_resolution.y);

    // Color based on x, y position
    color = metaBalls(pos.x, pos.y);

    // Will always come last of the fragment shader
    gl_FragColor = vec4(color, 1.0);
}
