import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const cwd=new URL(".",import.meta.url).pathname.replace(/^\/(.:)/,"$1"),port=18115;
const child=spawn(process.execPath,["server.mjs"],{cwd,env:{...process.env,NC11_PORT:String(port),NC11_INACTIVITY_KICK_MS:"1200"},stdio:"pipe"});
let log="";child.stdout.on("data",b=>log+=b);child.stderr.on("data",b=>log+=b);
for(let i=0;i<100;i++){try{if((await fetch(`http://127.0.0.1:${port}/health`,{signal:AbortSignal.timeout(100)})).ok)break;}catch{}if(i===99)throw new Error(log);await wait(50);}
function connect(name){return new Promise((resolve,reject)=>{const ws=new WebSocket(`ws://127.0.0.1:${port}/?name=${name}&clientId=${name}`),messages=[];ws.onmessage=e=>{const m=JSON.parse(e.data);messages.push(m);if(m.t==="welcome")resolve({ws,messages,m});};ws.onerror=reject;});}
try{
  const idle=await connect("IdlePlayer"),active=await connect("ActivePlayer");
  while(!idle.messages.some(m=>m.t==="state"&&m.phase==="playing"))await wait(20);
  const keepAlive=setInterval(()=>active.ws.send(JSON.stringify({t:"input",x:1,y:0,boost:false})),200),stationarySpam=setInterval(()=>idle.ws.send(JSON.stringify({t:"input",x:1,y:0,boost:true,brake:true})),80);
  const deadline=Date.now()+4000;while(Date.now()<deadline&&!idle.messages.some(m=>m.t==="returnHome"))await wait(20);clearInterval(keepAlive);clearInterval(stationarySpam);
  const kick=idle.messages.find(m=>m.t==="returnHome");assert.equal(kick?.code,"inactivity");assert.equal(kick?.reason,"You have been kicked out for inactivity.");
  const rosterDeadline=Date.now()+2000;while(Date.now()<rosterDeadline&&!active.messages.some(m=>m.t==="roster"&&!m.names.some(([,name])=>name==="IdlePlayer")))await wait(20);const roster=active.messages.filter(m=>m.t==="roster").at(-1);assert.equal(roster.names.some(([,name])=>name==="IdlePlayer"),false,"kicked player is removed from every client's roster");assert.ok(active.messages.some(m=>m.t==="system"&&/IdlePlayer was kicked for inactivity/.test(m.text)));
  const health=await (await fetch(`http://127.0.0.1:${port}/health`)).json();assert.equal(health.players,1);active.ws.close();idle.ws.close();
  console.log("PASS inactivity kick: repeated stationary input does not bypass movement tracking; roster removal is broadcast");
}finally{child.kill();}
