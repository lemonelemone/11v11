# Publishing the NitroClash 11v11 test server

This does not publish anything automatically. These are instructions for your friend to host the server and for players to connect to it.

## What your friend needs

- A machine that remains online while people play.
- Node.js 24.
- A domain or subdomain such as `11v11.example.com` pointing to that machine.
- Ports 80 and 443 reachable from the internet.
- A reverse proxy with a valid HTTPS certificate. Caddy is the simplest option and supports WebSockets automatically.

Do not expose an ordinary `ws://` address to players. NitroClash runs on HTTPS, so browsers require a remote secure WebSocket address beginning with `wss://`. Localhost is the special local-development exception.

## 1. Put the server on the host

Copy the extracted `nitroclash-11v11-local-v0.1.33` folder to the server. From that folder, verify Node and start a temporary test:

```sh
node --version
NC11_HOST=127.0.0.1 NC11_PORT=8011 NC11_MATCH_SECONDS=120 node server.mjs
```

The first command should report Node 24. The second should report that NitroClash is listening on port 8011. Keep port 8011 private; Caddy will be the public entry point.

For Windows PowerShell, the equivalent temporary command is:

```powershell
$env:NC11_HOST="127.0.0.1"
$env:NC11_PORT="8011"
$env:NC11_MATCH_SECONDS="120"
node server.mjs
```

## 2. Point a domain at the host

At the DNS provider, create an `A` record for a name such as `11v11.example.com` pointing to the server's public IPv4 address. Add an `AAAA` record only if IPv6 is correctly configured. DNS may take time to update.

## 3. Add secure WebSockets with Caddy

Install Caddy, then use this Caddyfile, replacing the example domain:

```caddyfile
11v11.example.com {
    reverse_proxy 127.0.0.1:8011
}
```

Start or reload Caddy. It obtains and renews the TLS certificate automatically when the DNS record and ports 80/443 are correct. Check the public health endpoint:

```text
https://11v11.example.com/health
```

It should return JSON containing `"ok":true`.

## 4. Keep Node running

On Linux, create a systemd service similar to this, adjusting the user, Node path and folder:

```ini
[Unit]
Description=NitroClash 11v11
After=network.target

[Service]
Type=simple
User=nitroclash
WorkingDirectory=/opt/nitroclash-11v11-local-v0.1.33
Environment=NC11_HOST=127.0.0.1
Environment=NC11_PORT=8011
Environment=NC11_MATCH_SECONDS=120
ExecStart=/usr/bin/node server.mjs
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Enable it with the server administrator's normal systemd workflow. When testing is over, change `NC11_MATCH_SECONDS=120` to the preferred match length, such as `600` for ten minutes, and restart the service.

## 5. Connect the userscript

1. Install `nitroclash-local-11v11.user.js` in Tampermonkey and disable older 11v11 versions.
2. Open NitroClash and find the `LOCAL 11v11 ONLY` panel.
3. Replace `ws://127.0.0.1:8011` with the public address, for example `wss://11v11.example.com`.
4. Click Join or Spectate. The address is saved in the browser for later sessions.

Everyone uses the same public `wss://` address. Do not add `/health` to the WebSocket address.

## 6. Share or publish the userscript

For a private test, send friends the single `nitroclash-local-11v11.user.js` file. They can open Tampermonkey, choose **Create a new script**, replace the template with the file contents, save it, and disable older 11v11 copies.

For a link people can install:

1. Create a repository or other HTTPS static-file location you control.
2. Upload `nitroclash-local-11v11.user.js` without renaming the `.user.js` ending.
3. Share its raw HTTPS URL. Opening a raw URL ending in `.user.js` normally lets Tampermonkey offer installation.
4. If you want automatic updates, add `@updateURL` and `@downloadURL` metadata pointing to that raw file before publishing it. Increment `@version` for every later release.

The userscript does not need the server address baked into the published file. Each player pastes the shared `wss://` address into the launch panel, and it is remembered locally.

## Limits and safety

- There is no limit on the number of userscript installations.
- A script does not use server capacity until its tab joins or spectates.
- One arena allows 22 players and 32 spectators. More players can create more public arenas.
- There is no fixed total-arena limit in the code; real capacity depends on CPU and especially upload bandwidth because snapshots are sent at 60 Hz.
- This experimental server has no account authentication or abuse protection. Anyone who knows the public address can connect, so share it cautiously and monitor the process and bandwidth.
- Hosting-provider connection, traffic or CPU quotas still apply even though the game code has no installation limit.
