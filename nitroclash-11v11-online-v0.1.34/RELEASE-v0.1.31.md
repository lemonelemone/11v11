# NitroClash Local 11v11 v0.1.31

Local-only release. Nothing was deployed or pushed. Protocol 28.

## New rules

- Each team may have at most five players inside its own defensive fifth during live play. The server records entry order, so the first five stay and a sixth player is pushed back. Kickoff/countdown is exempt.
- Dashed blue and red overlays identify the fifth boundaries without changing the pitch asset.
- A nearly stationary ball contested by both teams in a curved corner for 10 seconds awards the attacking team a corner.
- The match clock pauses during restarts. The taker may run in from beyond the wall, opponents are excluded from a seven-unit circle, and the first corner response is doubled.
- An unused corner becomes a goal kick after eight seconds. Opponents remain outside the defending fifth until the kick. Further unused restarts alternate.
- A separate 15-second contested-wall detector nudges the ball toward open play and pushes nearby blockers away.

## Preserved

The v0.1.30 pitch asset and dimensions are byte-identical. Authoritative physics/snapshots remain 60 Hz and input remains 120 Hz. Braking, chat, penalties, six-second replays, camera controls and buffered interpolation remain intact.

## Verification

- Full server integration passed, including the five-player defensive-fifth cap.
- Dedicated restart integration passed: attacking-team award, corner/goal-kick alternation, doubled corner response and wall-contest release.
- Real Microsoft Edge test passed and produced `visual-test-v31.png`.
- Visual inspection confirmed the original pitch remains intact and the coloured fifth lines are overlays only.
