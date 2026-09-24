# NitroClash 11v11 Frankfurt v0.1.37

This is the production Frankfurt build. It is not labelled as a test build and does not display the server address.

## Changes

- Restored the complete match admin panel from the earlier full build. Press `B`, enter `Chicken999!`, and use the existing controls for match time, ball count, boost regeneration, unlimited boost, corners, throw-ins, corner sensitivity, penalty rounds, boost-pad refill, player speed, defensive barrier rules and ball lightness.
- Added shared admin controls for the Meow event and the Quick Chat set. These settings are server-authoritative and update the whole match together.
- Mouse steering, left-click boost and right-click braking continue while the admin panel or password box is open.
- Public-match inactivity removal now checks actual player movement and removes a stationary player after 20 seconds. The kicked player sees the NitroClash-style inactivity screen, the slot is removed immediately for everyone, and it is not reserved for reconnect.
- Changed rendering to a fixed 40 ms simulation-timestamp interpolation buffer. Live Frankfurt measurement showed consistent 60 Hz authoritative ticks but uneven delivery, including occasional 38.51 ms gaps followed by catch-up packets. The earlier buffer could empty during those gaps, causing a visible freeze/catch-up or slight boost jitter. Physics speed, damping and movement feel were not changed.
- Minimap is off by default, toggled with `M`, and appears at the bottom-right while preserving the pitch aspect ratio.
- Removed the unnecessary homepage compatibility sentence and hid the hosted 4v4 badge and old 11v11 announcement.
- Meow image duration is 1 second. The event remains one chance in two per game, with one selected player and a 50% chance of a second selected player.
- Kept the goal explosion, exact chat placeholder, 0.40 follow-camera minimum, 0.576 boost-per-second regeneration, six-second replays, team chat, braking behavior and all existing match rules.
- Boost bar is 264 px wide and semi-transparent.

## Render

- Root Directory: `nitroclash-11v11-frankfurt-v0.1.37`
- Build Command: `npm install`
- Start Command: `npm start`
- Node version: 24

If the repository contains the files from this folder directly at repository root, leave Root Directory blank.

## Verification

- `npm test`: passed full server rules/physics suite.
- `node test-frankfurt-features.mjs`: passed admin password/settings, event assets and movement-based inactivity removal.
- `node test-browser-local.mjs`: passed in real Microsoft Edge for the restored admin panel, mouse passthrough, shared Quick Chat, minimap, boost-bar styling and hidden hosted overlays.
