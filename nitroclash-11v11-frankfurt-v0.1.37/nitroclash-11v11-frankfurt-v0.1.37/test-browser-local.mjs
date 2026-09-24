import fs from "node:fs";
import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {createRequire} from "node:module";
import http from "node:http";
import {setTimeout as wait} from "node:timers/promises";
const cwd=new URL(".",import.meta.url).pathname.replace(/^\/(.:)/,"$1");
const child=spawn(process.execPath,["server.mjs"],{cwd,env:{...process.env,NC11_HOST:"127.0.0.1",NC11_PORT:"18112",NC11_INACTIVITY_KICK_MS:"999999"},stdio:"pipe"});let log="";child.stdout.on("data",b=>log+=b);child.stderr.on("data",b=>log+=b);
for(let i=0;i<80;i++){try{if((await fetch("http://127.0.0.1:18112/health",{signal:AbortSignal.timeout(100)})).ok)break;}catch{}if(i===79)throw new Error(log);await wait(50);}
const require=createRequire("C:/Users/super/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json"),{chromium}=require("playwright");
const raw=fs.readFileSync(new URL("nitroclash-local-11v11.user.js",import.meta.url),"utf8"),source=raw.replace("wss://one1v11.onrender.com","ws://127.0.0.1:18112");
assert.match(source,/VERSION="0\.1\.37", PROTOCOL=32/);assert.match(source,/INTERPOLATION_DELAY_MS=40/);assert.match(source,/minimap:false/);assert.doesNotMatch(source,/This does not change 4v4 or SUPER NC/);assert.doesNotMatch(source,/Server address:/);
const fixture=http.createServer((req,res)=>{res.setHeader("Content-Type","text/html");res.end('<!doctype html><html><body><input id="username" value="Player"><div id="homepage"></div><div id="nc-local-4v4-badge">BADGE</div><div id="nc-11v11-announcement">ANNOUNCEMENT</div></body></html>');});await new Promise(r=>fixture.listen(18113,"127.0.0.1",r));
const browser=await chromium.launch({channel:"msedge",headless:true});
try{
 const context=await browser.newContext({viewport:{width:1280,height:800},permissions:["local-network-access"]});await context.addInitScript(source);const a=await context.newPage(),b=await context.newPage();await Promise.all([a.goto("http://127.0.0.1:18113"),b.goto("http://127.0.0.1:18113")]);await Promise.all([a.waitForSelector("#nc11-launch"),b.waitForSelector("#nc11-launch")]);
 assert.match(await a.locator("#nc11-launch").innerText(),/Frankfurt/);assert.match(await a.locator("#nc11-launch").innerText(),/M to enable\/disable Minimap/);assert.equal(await a.locator("#nc-local-4v4-badge").isVisible(),false);assert.equal(await a.locator("#nc-11v11-announcement").isVisible(),false);
 await a.locator("#username").fill("AdminTester");await b.locator("#username").fill("PlayerB");await Promise.all([a.locator("#nc11-play").click(),b.locator("#nc11-play").click()]);await Promise.all([a.waitForSelector("#nc11-canvas"),b.waitForSelector("#nc11-canvas")]);await a.waitForFunction(()=>document.querySelector("#nc11-info")?.textContent.includes("PLAYING"));await a.waitForFunction(()=>document.documentElement.dataset.nc11Interpolation==="timestamp-40ms");
 assert.equal(await a.evaluate(()=>document.documentElement.dataset.nc11Minimap||"off"),"off");await a.keyboard.press("m");assert.equal(await a.evaluate(()=>document.documentElement.dataset.nc11Minimap),"on");
 await a.keyboard.press("b");await a.locator("#nc11-admin-password").fill("Chicken999!");await a.locator("#nc11-admin-signin").click();await a.waitForFunction(()=>!document.querySelector("#nc11-admin-controls").hidden);const grid=await a.locator("#nc11-admin-grid").innerText();for(const label of ["Next match time","Balls on pitch","Boost regen","Unlimited boost","Corners enabled","Throw-ins","Corner sensitivity","Penalty rounds","Boost pad refill","Player speed","Barrier enabled","Barrier player limit","Barrier depth","Ball lightness","Meow event","Quick chat set"])assert.match(grid,new RegExp(label,"i"));
 const canvas=await a.locator("#nc11-canvas").boundingBox(),boostBefore=parseFloat(await a.locator("#nc11-boost span").evaluate(e=>e.style.width));await a.mouse.move(canvas.x+canvas.width*.75,canvas.y+canvas.height*.5);await a.mouse.down();await a.waitForTimeout(450);await a.mouse.up();await a.waitForFunction(before=>parseFloat(document.querySelector("#nc11-boost span").style.width)<before,boostBefore);
 await a.locator("#nc11-admin-quick").selectOption("default");await a.locator("#nc11-admin-apply").click();await b.keyboard.press("g");await b.keyboard.press("1");await a.waitForFunction(()=>document.querySelector("#nc11-chatlog")?.textContent.includes("Nice shot!"));
 const boostStyle=await a.locator("#nc11-boost").evaluate(e=>({width:getComputedStyle(e).width,background:getComputedStyle(e).backgroundColor}));assert.equal(boostStyle.width,"264px");assert.match(boostStyle.background,/rgba/);await a.screenshot({path:"visual-test-v37-frankfurt.png"});
 console.log("PASS real Edge: Frankfurt UI, complete admin, mouse passthrough, shared quick chat, minimap and hidden hosted overlays");
} finally {await browser.close();fixture.close();child.kill();}
