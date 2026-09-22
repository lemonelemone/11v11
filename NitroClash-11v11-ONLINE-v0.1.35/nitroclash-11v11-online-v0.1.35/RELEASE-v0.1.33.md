# NitroClash Local 11v11 v0.1.33

Local/shareable testing release. Nothing was deployed or pushed. Protocol 29 remains compatible with v0.1.32.

## Changes

- Regulation matches now default to 120 seconds for testing.
- The 11v11 script hides only the Hosted 4v4 teaser element identified as `#nc-11v11-announcement`. Its repeating inline `display:block` update cannot bring the teaser back, while all other Hosted 4v4 and SUPER NC elements remain untouched.
- The 11v11 launch panel now includes a persistent server-address field. It defaults to `ws://127.0.0.1:8011`; players can paste a shared `wss://` endpoint once and the browser remembers it.
- Invalid addresses are rejected, and insecure remote `ws://` addresses are blocked on the HTTPS NitroClash page with an explanatory message.

## Capacity

There is no hard-coded limit on how many people may install the userscript. Installing it does not connect to the server. Each active game tab creates one WebSocket connection. Each arena supports 22 players and 32 spectators; additional players automatically create another public arena. The code has no fixed total-arena ceiling, so the actual total is limited by the friend's CPU, memory, upload bandwidth, hosting-provider limits and reverse-proxy configuration.

## Verification

- Full server integration passed with the two-minute default present and existing gameplay rules preserved.
- Restart and replay regression tests passed.
- A real Microsoft Edge session loaded a simulated copy of the Hosted 4v4 teaser that forced itself visible every 100 ms. The v0.1.33 rule kept it hidden before and during 11v11 play.
- Two browser clients connected through the new selected-server field, entered a live match, displayed a 1:59 clock after kickoff, and retained the active-corner camera controls.
- The original pitch assets and dimensions remain byte-identical to v0.1.32.
