# Fireworks Playground

A small, dependency-free canvas animation. Open `index.html` in a browser and click the canvas to launch a firework.

## How It Works

- `animate()` clears the canvas, updates and draws each firework and particle, removes finished objects, then schedules itself again with `requestAnimationFrame()`.
- A firework starts at the bottom center. Its velocity points from that starting position to the clicked coordinates, so it travels toward the click before exploding.
- The explosion picks random angles and speeds, then creates a group of particles with the firework's color.
- Each particle's vertical velocity increases by gravity, pulling it downward. Friction reduces both velocity components over time, while opacity fades until the particle is removed.

## Values to Experiment With

These constants are near the top of `script.js`:

1. `PARTICLE_COUNT`: particles created by each explosion.
2. `PARTICLE_SPEED`: maximum initial particle speed.
3. `FIREWORK_SPEED`: how quickly a firework reaches its target.
4. `GRAVITY`: how quickly particles accelerate downward.
5. `FRICTION`: how quickly particle movement slows (closer to `1` means less slowing).

`FADE_SPEED` is another handy value to try: larger values make particles disappear sooner.