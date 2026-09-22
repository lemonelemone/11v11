import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {setTimeout as wait} from "node:timers/promises";

const cwd=new URL(".",import.meta.url).pathname.replace(/^\/(.:)/,"$1");
const child=spawn(process.execPath,["server.mjs"],{cwd,env:{...process.env,NC11_PORT:"18133",NC11_TESTING:"1",NC11_CORNER_STALL_MS:"500",NC11_WALL_STALL_MS:"500",NC11_CORNER_RESTART_MS:"500"},stdio:"pipe"});
let log="";child.stdout.on("data",b=>log+=b);child.stderr.on("data",b=>log+=b);
for(let i=0;i<80;i++){try{if((await fetch("http://127.0.0.1:18133/health",{signal:AbortSignal.timeout(100)})).ok)break;}catch{}if(i===79)throw new Error(log);await wait(50);}
function connect(id){return new Promise((resolve,reject)=>{const ws=new WebSocket(`ws://127.0.0.1:18133/?party=RST32&name=${id}&clientId=${id}`),messages=[],timer=setTimeout(()=>reject(new Error("connect timeout")),3000);ws.onmessage=e=>{const m=JSON.parse(e.data);messages.push(m);if(m.t==="welcome"){clearTimeout(timer);resolve({ws,m,messages});}};ws.onerror=reject;});}
async function next(client,type,predicate=()=>true,timeout=4000){const start=client.messages.length,end=Date.now()+timeout;while(Date.now()<end){const m=client.messages.slice(start).find(x=>x.t===type&&predicate(x));if(m)return m;await wait(20);}const state=client.messages.filter(m=>m.t==="state").at(-1);throw new Error(`missing ${type}: ${JSON.stringify(state?.p?.filter(p=>p[7]).map(p=>[p[0],p[1],p[2]]))} ${log}`);}
try{
  const blue=await connect("Blue"),red=await connect("Red");await wait(3100);
  assert.equal((await fetch("http://127.0.0.1:18133/test/setup-corner")).ok,true);
  const corner=await next(blue,"restart",m=>m.active&&m.type==="corner");assert.equal(corner.team,1,"left defensive corner awards the attacking red team");assert.equal(corner.radius,21,"corner exclusion circle is three times the old radius");assert.equal(corner.x,25.5,"corner begins at the stalled ball's exact x position");assert.equal(corner.y,70,"corner begins at the stalled ball's exact y position");
  await next(blue,"state");const cornerState=blue.messages.filter(m=>m.t==="state").at(-1),taker=cornerState.p.find(p=>p[0]===corner.taker),defender=cornerState.p.find(p=>p[7]&&p[0]%2!==corner.team);assert.ok(taker&&taker[1]>=0&&taker[1]<=150,"corner taker remains inside the pitch width");assert.ok(taker[2]>=0&&taker[2]<=84.375,"corner taker remains inside the pitch height");assert.ok(defender&&defender[1]>=0&&defender[1]<=150&&defender[2]>=0&&defender[2]<=84.375,"excluded defender is moved inward, not outside the pitch");assert.ok(Math.hypot(defender[1]-corner.x,defender[2]-corner.y)>=corner.radius,"defender is outside the corner circle");
  const goalKick=await next(blue,"restart",m=>m.active&&m.type==="goalKick");assert.equal(goalKick.team,0,"unused red corner becomes blue goal kick");
  const cornerAgain=await next(blue,"restart",m=>m.active&&m.type==="corner");assert.equal(cornerAgain.team,1,"unused goal kick returns to attacking corner");
  blue.ws.send(JSON.stringify({t:"testBallPosition",x:cornerAgain.x,y:cornerAgain.y,vx:2,vy:0}));
  await next(blue,"restart",m=>m.active===false);
  const stateStart=blue.messages.length;await wait(120);const state=blue.messages.slice(stateStart).filter(m=>m.t==="state").at(-1);assert.ok(state.b[2]>2.5,"corner-only first touch doubles the ball response");
  assert.equal((await fetch("http://127.0.0.1:18133/test/setup-wall")).ok,true);await next(blue,"notice",m=>m.text==="Wall contest released");const released=await next(blue,"state",m=>Math.hypot(m.b[2],m.b[3])>.1);assert.ok(Math.hypot(released.b[2],released.b[3])>.1,"strict wall contest release moves the ball");blue.ws.close();red.ws.close();console.log("PASS v0.1.33 in-pitch corner placement, larger circle, corner/goal-kick alternation, doubled corner touch and wall release");
}finally{child.kill();}
