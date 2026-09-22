# NitroClash 11v11 Online v0.1.36

Built from the actual v0.1.35 online source. The original pitch assets and dimensions, 60 Hz authoritative physics/snapshots, 120 Hz input, two-minute test matches and existing game systems are preserved.

## Responsiveness correction

v0.1.35’s tick-based interpolation was technically smooth, but its adaptive buffer started at 50 ms and could rise to 110 ms. That explains the constant ping-like delay reported during real online testing even when network ping and FPS were normal.

v0.1.36 retains authoritative tick interpolation but lowers the render buffer to 25–50 ms, reduces its response to packet-jitter spikes and limits the latest-tick estimate to 1.25 ticks. Physics speed, damping and controller forces were not changed.

## Penalties and braking

- The penalty goalkeeper is constrained before and after every physics step. Outward momentum is removed at the boundary, while an inward turn is accepted immediately instead of waiting for accumulated velocity to reverse.
- A regression test now drives the goalkeeper to the exact limit, reverses input and verifies immediate inward movement.
- The taker starts slightly farther back at x=98.75.
- Braking still removes movement speed, but cursor input now continues rotating the vehicle’s facing direction.
- Holding brake and boost shows the boost glow without consuming boost.

## Corners

- Detection is deliberately easier: 35-unit horizontal corner depth, 18-unit vertical depth, 14-unit contest radius and a 0.35 still-ball threshold.
- A one-second grace window prevents a tiny speed spike from discarding nearly ten seconds of valid corner-stall time.
- Corner attempts now last ten seconds.
- The nearest attacker is explicitly selected, named in chat and marked with a gold **CORNER TAKER** ring/label.
- Only the selected taker can pass through the pitch wall for the run-up. They still collide with the ball and other players.
- Normal wall collision is restored as soon as the ball is kicked. If the taker remains behind the curved wall, the server returns them safely in-bounds while preserving inward/tangential velocity.
- If the selected taker disconnects, another eligible attacker is selected.

## Compatibility and verification

Protocol is now **31**. Deploy this version’s server before installing the v0.1.36 userscript.

- Full server integration passed, including goalkeeper boundary reversal and brake/glow/energy behavior.
- A physical corner test confirmed that the selected taker starts behind the wall, crosses it, kicks the ball and is returned safely in-bounds.
- Corner/goal-kick alternation, wall-release safety and direct-file replay tests passed.
- A real Edge session verified the 25–50 ms tick interpolation range, camera controls and the selected-corner-taker display.
- Pitch assets remain byte-identical to v0.1.35.

Nothing was deployed or pushed by Codex.
