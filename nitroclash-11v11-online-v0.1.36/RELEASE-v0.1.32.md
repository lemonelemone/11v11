# NitroClash Local 11v11 v0.1.32

Local-only release. Nothing was deployed or pushed. Protocol 29.

## Corner restart fixes

- Enlarged the corner exclusion radius from 7 to 21 world units (three times larger).
- The corner and circle now use the exact position where the contested ball stopped, instead of an artificial point outside the pitch.
- The taker is placed inside the playable pitch for an inward run-up. The temporary wall-collision bypass was removed, so a corner cannot be used to kick the ball or drive the taker outside the map.
- Opposing players inside the enlarged circle are cleared toward the pitch centre. This fixes the path that could push a defender beyond the curved boundary and leave them trapped there.
- An unused goal kick returns to the same stored in-pitch corner location.

## Camera and defensive-fifth display

- C was verified to switch between full-pitch and follow camera while a corner restart is active; mouse-wheel follow zoom remains available down to 0.40x.
- Blue and red defensive-fifth boundary lines are now hidden with zero to four defenders inside and appear only when that team has all five permitted defenders in its fifth.

## Preserved

The v0.1.31 pitch assets and dimensions are byte-identical. Authoritative physics and snapshots remain 60 Hz, input remains up to 120 Hz, and refresh-rate rendering/interpolation is unchanged. Braking, public/team chat, penalties, six-second goal replays, the 0.576 boost-per-second regeneration rate, restart alternation, and all existing match rules remain intact.

## Verification

- Full server integration passed for protocol 29, including the first-five defensive-fifth cap and existing gameplay systems.
- Dedicated restart integration passed for exact in-pitch corner coordinates, radius 21, inward taker and defender placement, corner/goal-kick alternation, doubled first corner response, and strict wall-contest release.
- Real Microsoft Edge testing passed with two live clients. C was toggled into and out of follow camera during an active corner.
- `visual-test-v32-corner.png` was visually inspected: the larger circle begins at the ball's in-pitch corner location, and neither the taker nor defender is stranded outside.
- Every pitch/art asset has the same SHA-256 hash as v0.1.31.
