import fs from "node:fs";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { setTimeout as wait } from "node:timers/promises";

const cwd=new URL(".",import.meta.url).pathname.replace(/^\/(.:)/,"$1");
const child=spawn(process.execPath,["server.mjs"],{cwd,env:{...process.env,NC11_PORT:"18114",NC11_TESTING:"1"},stdio:"pipe"});
let log="";child.stdout.on("data",b=>log+=b);child.stderr.on("data",b=>log+=b);
for(let i=0;i<80;i++){try{if((await fetch("http://127.0.0.1:18114/health",{signal:AbortSignal.timeout(100)})).ok)break;}catch{}if(i===79)throw new Error(log);await wait(50);}
const require=createRequire("C:/Users/super/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json"),{chromium}=require("playwright");
const source=fs.readFileSync(new URL("nitroclash-local-11v11.user.js",import.meta.url),"utf8").replace("ws://127.0.0.1:8011","ws://127.0.0.1:18114");
const browser=await chromium.launch({channel:"msedge",headless:true});
try{
  const context=await browser.newContext({viewport:{width:1600,height:900},permissions:["local-network-access"]});
  await context.route("**/fundingchoicesmessages.google.com/**",route=>route.abort());
  await context.addInitScript(source);
  const page=await context.newPage();
  await page.goto("https://nitroclash.io/",{waitUntil:"domcontentloaded",timeout:30000});
  await page.waitForSelector("#nc11-launch");
  await page.waitForFunction(()=>document.documentElement.dataset.nc11Artwork==="stock",null,{timeout:15000});
  await page.locator("#nc11-play").click();
  await page.waitForFunction(()=>document.querySelector("#nc11-info")?.textContent.includes("PLAYING"),null,{timeout:10000});
  await page.waitForFunction(()=>document.documentElement.dataset.nc11Pitch==="stock-pixel-patched");
  await page.waitForFunction(()=>document.documentElement.dataset.nc11BoostPatch==="surgical");
  const dimensions=await page.evaluate(()=>({build:document.querySelector("#nc11-launch")?.textContent||"",art:document.documentElement.dataset.nc11Artwork,pitch:document.documentElement.dataset.nc11Pitch}));
  assert.equal(dimensions.art,"stock");
  assert.equal(dimensions.pitch,"stock-pixel-patched");
  await page.waitForFunction(()=>document.documentElement.dataset.nc11PadHousing==="official-extract");
  const padProbe=new WebSocket("ws://127.0.0.1:18114/?role=spectator&arena=1&name=PadProbe&clientId=pad-probe");await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error("pad probe timeout")),3000);padProbe.onmessage=e=>{const m=JSON.parse(e.data);if(m.t==="welcome"){padProbe.send(JSON.stringify({t:"testPadState",index:0,active:false}));padProbe.send(JSON.stringify({t:"testPadState",index:14,active:false}));clearTimeout(timer);resolve();}};padProbe.onerror=reject;});await page.waitForTimeout(150);
  await page.screenshot({path:new URL("visual-test-v29.png",import.meta.url).pathname.replace(/^\/(.:)/,"$1")});
  await page.keyboard.press("c");
  await page.waitForFunction(()=>document.querySelector("#nc11-camera")?.textContent.includes("FOLLOW CAMERA · 1.25×"));
  await page.mouse.move(1200,450);await page.mouse.down();await page.waitForTimeout(250);
  await page.screenshot({path:new URL("visual-test-v29-follow-boosting.png",import.meta.url).pathname.replace(/^\/(.:)/,"$1")});await page.mouse.up();padProbe.close();
  console.log("PASS real NitroClash assets: original pitch retained with surgical unified boost-pad treatment");
} finally {await browser.close();child.kill();}
