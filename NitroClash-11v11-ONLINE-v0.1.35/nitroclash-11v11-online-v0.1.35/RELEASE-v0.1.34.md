# NitroClash 11v11 Online v0.1.34

Shareable Frankfurt-default userscript. Nothing was deployed or pushed. Protocol 29 remains compatible with the currently deployed v0.1.33 server.

## Change

- The default server is now `wss://one1v11.onrender.com`.
- The saved server-address key changed from `nc11-server-url-v1` to `nc11-server-url-v2`, ensuring this release does not silently reuse a previous local address.
- The launch panel and Tampermonkey name now say **11v11 Online (Frankfurt)** rather than Local 11v11.
- Players can still replace the address in the panel if the Render endpoint changes in future.

## Preserved

Two-minute testing matches, protocol 29, 60 Hz authoritative physics/snapshots, up-to-120 Hz input, corner safety, defensive-fifth logic, team/public chat, braking, penalties, replays, remote address validation and the targeted removal of the old Hosted 4v4 teaser all remain unchanged.

## Verification

- Server integration and restart/replay regression tests passed.
- A real Edge session confirmed the clean install default is used, the Hosted 4v4 teaser stays hidden, and all active-corner camera controls still work.
- The original pitch assets and dimensions remain byte-identical to v0.1.33.
