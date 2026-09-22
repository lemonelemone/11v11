import fs from "node:fs";
import assert from "node:assert/strict";
import http from "node:http";
import {spawn} from "node:child_process";
import {createRequire} from "node:module";
import {setTimeout as wait} from "node:timers/promises";

const cwd=new URL(".",import.meta.url).pathname.replace(/^\/(.:)/,"$1");
const server=spawn(process.execPath,["server.mjs"],{cwd,env:{...process.env,NC11_PORT:"18131",NC11_TESTING:"1",NC11_CORNER_STALL_MS:"500",NC11_CORNER_RESTART_MS:"8000"},stdio:"pipe"});
let serverLog="";server.stdout.on("data",b=>serverLog+=b);server.stderr.on("data",b=>serverLog+=b);
for(let i=0;i<80;i++){try{if((await fetch("http://127.0.0.1:18131/health",{signal:AbortSignal.timeout(100)})).ok)break;}catch{}if(i===79)throw new Error(serverLog);await wait(50);}
const fixture=http.createServer((req,res)=>{res.setHeader("Content-Type","text/html");const name=req.url.includes("red")?"V33 Red":"V33 Blue";res.end(`<!doctype html><html><body><input id="username" value="${name}"><div id="homepage"></div><aside id="nc-11v11-announcement" style="display:block">11 VS 11</aside><script>setInterval(()=>{document.getElementById("nc-11v11-announcement").style.display="block"},100)</script></body></html>`);});
await new Promise(resolve=>fixture.listen(18132,"127.0.0.1",resolve));
const require=createRequire("C:/Users/super/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json");
const {chromium}=require("playwright");
const source=fs.readFileSync(new URL("nitroclash-local-11v11.user.js",import.meta.url),"utf8").replace("ws://127.0.0.1:8011","ws://127.0.0.1:18131");
assert.match(source,/VERSION="0\.1\.33"/);
assert.match(source,/#nc-11v11-announcement\{display:none!important\}/);
assert.match(source,/drawRuleOverlays/);
assert.match(source,/DEFENSIVE_FIFTH_DEPTH/);
assert.match(source,/blue===limit/);
assert.match(source,/red===limit/);
assert.doesNotMatch(source,/ui\.camera=/);
const browser=await chromium.launch({channel:"msedge",headless:true});
try{
  const context=await browser.newContext({viewport:{width:1440,height:900},permissions:["local-network-access"]}),redContext=await browser.newContext({viewport:{width:1440,height:900},permissions:["local-network-access"]});
  await context.addInitScript(source);await redContext.addInitScript(source);
  const page=await context.newPage(),redPage=await redContext.newPage();
  await page.goto("http://127.0.0.1:18132/blue",{waitUntil:"domcontentloaded"});
  await redPage.goto("http://127.0.0.1:18132/red",{waitUntil:"domcontentloaded"});
  await wait(300);
  assert.equal(await page.locator("#nc-11v11-announcement").evaluate(el=>getComputedStyle(el).display),"none","11v11 script overrides the hosted script's repeating inline teaser display");
  assert.equal(await page.locator("#nc11-server").inputValue(),"ws://127.0.0.1:18131");
  await page.locator("#nc11-play").click();
  await redPage.locator("#nc11-play").click();
  await page.waitForSelector("#nc11-canvas");
  await page.waitForFunction(()=>document.documentElement.dataset.nc11Pitch==="stock-pixel-patched",null,{timeout:10000});
  await page.keyboard.press("y");
  assert.equal(await page.locator("#nc11-chat").getAttribute("placeholder"),"ashjagydwtr6atwdy");
  await page.keyboard.press("Escape");
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.nc11Camera),"full");
  await wait(3200);
  assert.equal((await fetch("http://127.0.0.1:18131/test/setup-corner")).ok,true);
  await page.waitForFunction(()=>document.documentElement.dataset.nc11Restart==="corner",null,{timeout:3000});
  await page.keyboard.press("c");
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.nc11Camera),"follow","C enters follow camera during a corner restart");
  await page.locator("#nc11-canvas").dispatchEvent("wheel",{deltaY:5000});
  await page.keyboard.press("c");
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.nc11Camera),"full","C exits follow camera during a corner restart");
  assert.equal(await page.locator("#nc11-camera").count(),0);
  assert.equal(await page.locator("#nc11-canvas").isVisible(),true);
  assert.equal(await page.locator("#nc-11v11-announcement").evaluate(el=>getComputedStyle(el).display),"none","teaser stays hidden during 11v11 play");
  await page.screenshot({path:new URL("visual-test-v33.png",import.meta.url).pathname.replace(/^\/(.:)/,"$1")});
  console.log("PASS real Edge: v0.1.33 hides the hosted 4v4 teaser, accepts a selected server, and preserves active-corner camera controls");
}finally{
  await browser.close();fixture.close();server.kill();
}
