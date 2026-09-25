# NitroClash 11v11 Amsterdam v0.1.42

- Normal matches default to 10:00; the admin next-match setting supports up to 20:00.
- Replaced timestamp reconstruction with a monotonic live-match countdown, fixing the clock getting stuck at 2:00. Goal celebrations, replays, kickoffs and set pieces do not consume match time.
- Admin text and number fields accept normal keyboard input without quick-chat intercepting their keys.
- Spectators now announce as `[name] is spectating!`.
- The Amsterdam client connects automatically to `wss://nitroclashio.duckdns.org`.
- Your own name stays white; other players' names use the regular-weight dark gray-green style from normal NitroClash.
- Preserves the v0.1.41 gameplay, admin controls, replay viewer, minimap, quick chat, braking/boost behavior, goal effects and movement interpolation.
- Server accepts the hosting provider's standard `PORT` variable as well as `NC11_PORT`.
- Client/server protocol: 37.
