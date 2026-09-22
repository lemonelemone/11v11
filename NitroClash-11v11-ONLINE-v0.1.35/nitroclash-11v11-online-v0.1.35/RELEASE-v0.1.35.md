# NitroClash 11v11 Online v0.1.35

This release is based on the actual v0.1.34 online source. It keeps the original pitch assets and dimensions, 60 Hz authoritative physics/snapshots, up-to-120 Hz input, refresh-rate rendering, two-minute test matches, braking, public/team chat, penalties, corner safety, defensive-fifth limits and six-second replays.

## Smoothness diagnosis and change

The remaining intermittent “FPS lag” was not a low render frame rate or a changed movement force. The client buffered only about 33 ms and interpolated using local packet-arrival timestamps. Remote WebSocket snapshots can arrive unevenly or in small batches; when the next packet missed that narrow window, rendering briefly held the newest state and then jumped on the following delivery.

v0.1.35 keeps the server simulation at 60 Hz and changes only the render clock. It interpolates by authoritative server tick, estimates delivery jitter continuously, and uses an adaptive 50–110 ms buffer. It still does not extrapolate past the latest authoritative snapshot. This trades a small amount of visual latency for steadier motion and fewer visible hold/jump corrections.

## Gameplay and UI changes

- Tab no longer disables mouse steering, boosting or braking, and the Tab board no longer shows boost values.
- Holding boost while Space/right-click braking consumes no boost.
- Penalty takers start twice as far from the ball, receive a 1.4x first-touch ball-speed multiplier, cannot cross into the penalty box and lose the attempt after a second touch.
- Penalty goalkeeper boundary handling now preserves inward velocity after turning, avoiding the brief stuck feeling at the edge of the allowed area.
- Players who join during an active shootout remain inactive and outside the eligible taker/goalkeeper pool until the shootout ends.
- A goal starts a five-second playable celebration. The scoring team has unlimited boost during it; the six-second replay starts afterward.
- Goals display a brief scorer, assister and last-touch shot-speed card.
- Chat is 1.4x larger and the hard input/server limit is 360 characters. Both chat modes keep the exact `ashjagydwtr6atwdy` placeholder.
- Corner-stall detection is slightly more forgiving: horizontal depth 31, vertical depth 16, contest radius 9 and still-ball threshold 0.16. Kickoffs are still excluded.
- The replay viewer now recovers to its built-in pitch if direct-file browser security blocks local canvas compositing, and its rendering size is capped for high-DPI displays. This fixes the direct-from-ZIP black-screen path.

## Compatibility and publishing

Protocol is now **30** because the goal flow and goal metadata changed. Deploy `server.mjs` v0.1.35 to Render before distributing the v0.1.35 userscript; v0.1.34 clients and servers intentionally reject this protocol mismatch.

Nothing was deployed or pushed by Codex.

## Verification

- Server integration passed with 22 players, join-during-penalties exclusion, celebration/replay sequencing, boost, team chat, defensive-fifth and penalty regressions.
- Corner/goal-kick/wall-release regression tests passed.
- Real Edge testing passed for tick-based interpolation, Tab movement/boost input, braking input, camera controls, chat limits and the goal card.
- Replay playback passed both over localhost and when the viewer HTML was opened directly from disk.
- The v0.1.34 pitch assets remained unchanged.
