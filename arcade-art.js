/* 회복 원정대 그림 모음: 외부 이미지 없이 코드로 그려 캐시한다 */
(function(){
'use strict';
var TAU=Math.PI*2, cache={};
function mk(w,h){var c=document.createElement('canvas');c.width=Math.ceil(w);c.height=Math.ceil(h);return c;}
function seeded(s){return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function memo(k,f){return cache[k]||(cache[k]=f());}
function rrect(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath();}
function circle(x,a,b,r,c){x.fillStyle=c;x.beginPath();x.arc(a,b,r,0,TAU);x.fill();}
function line(x,a,b,c,d,col,w){x.strokeStyle=col;x.lineWidth=w;x.lineCap='round';x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke();}
function shade(x,r,light,mid,dark){var g=x.createRadialGradient(-r*.35,-r*.42,r*.08,0,0,r*1.15);g.addColorStop(0,light);g.addColorStop(.48,mid);g.addColorStop(1,dark);return g;}

var THEMES={
 neuroanat:{base:'#17123f',alt:'#1f1852',line:'#8d7dff',glow:'#9d8cff',amb:'#b9adff',ambMode:'rise',pal:['#8f7bff','#3c2c9e','#d8d0ff','#ffe066']},
 neuro:{base:'#0d3129',alt:'#123c32',line:'#55e8bd',glow:'#4bf0c0',amb:'#a7ffe6',ambMode:'rise',pal:['#35d6a4','#0f6a55','#c6ffef','#ff6b81']},
 anatomy:{base:'#35201c',alt:'#412822',line:'#d9a58f',glow:'#ff9a7d',amb:'#ffd9c7',ambMode:'drift',pal:['#f2e6d0','#94765c','#fffaf0','#ff5a4f']},
 funcanat:{base:'#332310',alt:'#3e2b14',line:'#e6a94a',glow:'#ffc14d',amb:'#ffe0a3',ambMode:'fall',pal:['#ffb83f','#92590f','#ffe9b3','#3fd0ff']},
 exercise:{base:'#3a1730',alt:'#47203a',line:'#ff7ab8',glow:'#ff6db0',amb:'#ffc4df',ambMode:'drift',pal:['#ff5fa6','#932060','#ffd1e6','#ffe45c']},
 msk:{base:'#102a42',alt:'#153451',line:'#6ec1ff',glow:'#64c3ff',amb:'#cfeaff',ambMode:'fall',pal:['#5eb5ff','#1c5a94','#d6eeff','#ff8e5e']},
 modality:{base:'#2a2a10',alt:'#343413',line:'#f4e04d',glow:'#fff066',amb:'#fff7ad',ambMode:'zap',pal:['#ffe83d','#a88a07','#fffbd1','#ff5f4a']},
 cardio:{base:'#07263f',alt:'#0a304e',line:'#4fdcff',glow:'#46d9ff',amb:'#c3f5ff',ambMode:'bubble',pal:['#4fd8ff','#1673a3','#dcfaff','#ff7bd0']},
 clindx:{base:'#25143c',alt:'#2e1a4a',line:'#c896ff',glow:'#c58bff',amb:'#ead6ff',ambMode:'rise',pal:['#c18aff','#5f2fa6','#efe0ff','#6dffcf']},
 daily:{base:'#34131f',alt:'#401927',line:'#ff8f66',glow:'#ff7a59',amb:'#ffc9a8',ambMode:'rise',pal:['#ff7a59','#9a2f27','#ffe0cf','#ffe45c']}
};
function theme(id){return THEMES[id]||THEMES.daily;}

/* ---------- 바닥 ---------- */
var FLOOR={
 neuroanat:function(x,S,T,r){for(var i=0;i<7;i++){var a=24+r()*(S-48),b=24+r()*(S-48);x.globalAlpha=.3;for(var k=0;k<5;k++){var q=r()*TAU,l=14+r()*22;line(x,a,b,clamp(a+Math.cos(q)*l,4,S-4),clamp(b+Math.sin(q)*l,4,S-4),T.line,1.6);}x.globalAlpha=.55;circle(x,a,b,3.2,T.line);}x.globalAlpha=1;},
 neuro:function(x,S,T){var n=4,c=S/n;for(var a=0;a<n;a++)for(var b=0;b<n;b++){x.fillStyle=(a+b)%2?T.alt:T.base;x.fillRect(a*c,b*c,c,c);x.strokeStyle='rgba(255,255,255,.05)';x.lineWidth=2;x.strokeRect(a*c+1,b*c+1,c-2,c-2);if((a+b)%4===0){x.fillStyle='rgba(85,232,189,.17)';x.fillRect(a*c+c/2-9,b*c+c/2-3,18,6);x.fillRect(a*c+c/2-3,b*c+c/2-9,6,18);}}},
 anatomy:function(x,S,T,r){var h=S/4;for(var j=0;j<4;j++){var o=j%2?S/8:0;for(var i=-1;i<4;i++){var a=i*S/4+o;x.fillStyle=r()<.5?T.alt:T.base;x.fillRect(a,j*h,S/4,h);x.strokeStyle='rgba(0,0,0,.34)';x.lineWidth=3;x.strokeRect(a,j*h,S/4,h);x.strokeStyle='rgba(255,220,190,.07)';x.lineWidth=1.5;x.beginPath();x.moveTo(a+3,j*h+3);x.lineTo(a+S/4-3,j*h+3);x.stroke();}}},
 funcanat:function(x,S,T,r){var w=S/5;for(var i=0;i<5;i++){x.fillStyle=i%2?T.alt:T.base;x.fillRect(i*w,0,w,S);x.fillStyle='rgba(0,0,0,.28)';x.fillRect(i*w,0,2.5,S);for(var k=0;k<4;k++){x.strokeStyle='rgba(255,200,120,.06)';x.lineWidth=1.4;var y=10+r()*(S-20);x.beginPath();x.moveTo(i*w+6,y);x.quadraticCurveTo(i*w+w/2,y+6,i*w+w-5,y-2);x.stroke();}circle(x,i*w+9,12,2.4,'rgba(255,214,140,.32)');circle(x,i*w+9,S-12,2.4,'rgba(255,214,140,.32)');}},
 exercise:function(x,S,T,r){for(var i=0;i<230;i++){x.fillStyle=r()<.5?'rgba(255,190,220,.055)':'rgba(0,0,0,.12)';x.fillRect(r()*S,r()*S,2+r()*3,2+r()*2);}x.strokeStyle='rgba(255,122,184,.13)';x.lineWidth=4;x.beginPath();x.arc(S/2,S/2,S*.34,0,TAU);x.stroke();},
 msk:function(x,S,T,r){for(var i=0;i<9;i++){var a=12+r()*(S-24),b=12+r()*(S-24);x.strokeStyle='rgba(0,0,0,.3)';x.lineWidth=2.4;x.beginPath();x.moveTo(a,b);for(var k=0;k<3;k++){a=clamp(a+(r()-.5)*54,3,S-3);b=clamp(b+r()*30,3,S-3);x.lineTo(a,b);}x.stroke();}for(i=0;i<16;i++){x.fillStyle='rgba(150,210,255,.07)';x.beginPath();x.ellipse(14+r()*(S-28),14+r()*(S-28),4+r()*12,3+r()*6,r()*3,0,TAU);x.fill();}},
 modality:function(x,S,T){var c=S/4;x.strokeStyle='rgba(0,0,0,.36)';x.lineWidth=3;for(var i=0;i<=4;i++){x.beginPath();x.moveTo(i*c,0);x.lineTo(i*c,S);x.moveTo(0,i*c);x.lineTo(S,i*c);x.stroke();}x.strokeStyle='rgba(244,224,77,.2)';x.lineWidth=2;x.beginPath();x.moveTo(0,c*1.5);x.lineTo(c,c*1.5);x.lineTo(c*1.5,c*2);x.lineTo(c*3,c*2);x.lineTo(c*3.5,c*1.5);x.lineTo(S,c*1.5);x.moveTo(c*2,0);x.lineTo(c*2,c);x.lineTo(c*2.5,c*1.5);x.stroke();[[c,c*1.5],[c*3,c*2],[c*2,c]].forEach(function(p){circle(x,p[0],p[1],4,'rgba(244,224,77,.42)');});},
 cardio:function(x,S,T,r){for(var i=0;i<8;i++){x.strokeStyle='rgba(120,235,255,.075)';x.lineWidth=2.5;var y=18+r()*(S-36);x.beginPath();x.moveTo(0,y);x.bezierCurveTo(S*.3,y-18,S*.6,y+18,S,y);x.stroke();}for(i=0;i<16;i++){x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.ellipse(12+r()*(S-24),12+r()*(S-24),3+r()*7,2+r()*4,0,0,TAU);x.fill();}},
 clindx:function(x,S,T){var c=S/4;for(var a=-1;a<=4;a++)for(var b=-1;b<=4;b++){x.fillStyle=(a+b)%2?T.alt:T.base;x.beginPath();x.moveTo(a*c+c/2,b*c);x.lineTo(a*c+c,b*c+c/2);x.lineTo(a*c+c/2,b*c+c);x.lineTo(a*c,b*c+c/2);x.closePath();x.fill();x.strokeStyle='rgba(200,150,255,.13)';x.lineWidth=1.5;x.stroke();}},
 daily:function(x,S,T,r){for(var i=0;i<26;i++){x.fillStyle='rgba(255,143,102,'+(.04+r()*.09)+')';x.beginPath();x.arc(r()*S,r()*S,2+r()*9,0,TAU);x.fill();}}
};
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function floor(id){return memo('floor|'+id,function(){var S=256,c=mk(S,S),x=c.getContext('2d'),T=theme(id);x.fillStyle=T.base;x.fillRect(0,0,S,S);(FLOOR[id]||FLOOR.daily)(x,S,T,seeded(id.length*97+13));return c;});}

/* ---------- 바닥 장식 ---------- */
var PROP={
 neuroanat:function(x,T,r){for(var k=0;k<7;k++){var q=k/7*TAU+r()*.4,l=24+r()*22;line(x,0,0,Math.cos(q)*l,Math.sin(q)*l,T.pal[1],3.5);circle(x,Math.cos(q)*l,Math.sin(q)*l,3.6,T.line);}circle(x,0,0,13,T.pal[1]);circle(x,-2,-2,7,T.line);},
 neuro:function(x,T){x.fillStyle='#8f5b3b';x.beginPath();x.moveTo(-14,5);x.lineTo(14,5);x.lineTo(10,25);x.lineTo(-10,25);x.closePath();x.fill();[[0,-16,13],[-13,-5,11],[13,-5,11]].forEach(function(p){circle(x,p[0],p[1],p[2],T.pal[1]);circle(x,p[0]-2,p[1]-3,p[2]*.55,T.pal[0]);});},
 anatomy:function(x,T){x.fillStyle='#5a4238';x.fillRect(-22,12,44,10);var g=x.createLinearGradient(-15,0,15,0);g.addColorStop(0,'#786050');g.addColorStop(.45,'#c6ad95');g.addColorStop(1,'#6a5345');x.fillStyle=g;x.fillRect(-15,-16,30,29);x.fillStyle='#d8c3ac';x.fillRect(-19,-22,38,7);line(x,-6,-14,-6,11,'rgba(0,0,0,.2)',2);line(x,6,-14,6,11,'rgba(0,0,0,.2)',2);},
 funcanat:function(x,T){gear(x,23,9,T.pal[1],T.pal[0]);circle(x,0,0,7,T.base);},
 exercise:function(x,T){x.fillStyle='#3a3142';x.fillRect(-30,-3,60,6);[-24,-17,17,24].forEach(function(a,i){x.fillStyle=i%3?'#ff5fa6':'#6a5a78';rrect(x,a-3.5,i%3?-12:-17,7,i%3?24:34,2);x.fill();});},
 msk:function(x,T){x.fillStyle=T.pal[1];x.beginPath();x.moveTo(-28,16);x.lineTo(-18,-12);x.lineTo(1,-22);x.lineTo(22,-7);x.lineTo(30,16);x.closePath();x.fill();x.fillStyle=T.pal[0];x.globalAlpha=.55;x.beginPath();x.moveTo(-18,-12);x.lineTo(1,-22);x.lineTo(5,3);x.closePath();x.fill();x.globalAlpha=1;},
 modality:function(x,T){x.fillStyle='#4d4b20';rrect(x,-20,-20,40,42,5);x.fill();x.fillStyle='#22220c';x.fillRect(-13,-13,26,16);line(x,-9,-5,-3,-9,T.pal[0],2);line(x,-3,-9,2,-3,T.pal[0],2);line(x,2,-3,9,-8,T.pal[0],2);circle(x,-8,12,3.5,'#ff5f4a');circle(x,8,12,3.5,'#58e6a0');},
 cardio:function(x,T,r){for(var k=-2;k<=2;k++){x.strokeStyle=k%2?'#ff7bd0':'#ff9fbf';x.lineWidth=5;x.lineCap='round';x.beginPath();x.moveTo(k*5,20);x.quadraticCurveTo(k*14,0,k*9+(r()-.5)*10,-20);x.stroke();}circle(x,0,21,10,'#16445f');},
 clindx:function(x,T){x.fillStyle=T.pal[1];x.beginPath();x.moveTo(0,-27);x.lineTo(15,-3);x.lineTo(0,23);x.lineTo(-15,-3);x.closePath();x.fill();x.fillStyle=T.pal[0];x.beginPath();x.moveTo(0,-27);x.lineTo(15,-3);x.lineTo(0,3);x.lineTo(-15,-3);x.closePath();x.fill();x.fillStyle='rgba(255,255,255,.5)';x.beginPath();x.moveTo(0,-23);x.lineTo(6,-5);x.lineTo(-7,-4);x.closePath();x.fill();},
 daily:function(x,T){circle(x,0,0,16,T.pal[1]);circle(x,-2,-3,9,T.pal[0]);}
};
function prop(id,v){return memo('prop|'+id+'|'+v,function(){var c=mk(160,160),x=c.getContext('2d');x.scale(2,2);x.translate(40,40);x.fillStyle='rgba(0,0,0,.26)';x.beginPath();x.ellipse(0,24,27,7,0,0,TAU);x.fill();(PROP[id]||PROP.daily)(x,theme(id),seeded(v*41+7));return c;});}
function props(id,arena){return memo('props|'+id,function(){var r=seeded(id.charCodeAt(0)*131+id.length),L=[];for(var i=0;i<78;i++){var a=70+r()*(arena-140),b=70+r()*(arena-140);if(Math.hypot(a-arena/2,b-arena/2)<150)continue;L.push({x:a,y:b,v:Math.floor(r()*3),s:.72+r()*.45,f:r()<.5?-1:1});}return L;});}

/* ---------- 몬스터 ---------- */
function gear(x,r,n,dark,mid){x.fillStyle=dark;x.beginPath();for(var i=0;i<n*2;i++){var a0=(i-.28)/(n*2)*TAU,a1=(i+.28)/(n*2)*TAU,R=i%2?r*.8:r;x.lineTo(Math.cos(a0)*R,Math.sin(a0)*R);x.lineTo(Math.cos(a1)*R,Math.sin(a1)*R);}x.closePath();x.fill();circle(x,0,0,r*.68,mid);}
function eyes(x,r,p,opt){opt=opt||{};var ex=r*(opt.gap||.36),ey=r*(opt.y===undefined?-.1:opt.y),er=r*(opt.size||.25);
 [-1,1].forEach(function(s){circle(x,s*ex,ey,er,'#fff');circle(x,s*ex+er*.22,ey+er*.12,er*.58,'#1b1630');circle(x,s*ex+er*.38,ey-er*.12,er*.2,'#fff');line(x,s*(ex+er*1.05),ey-er*1.2,s*(ex-er*.7),ey-er*.55,'#1b1630',Math.max(1.6,r*.11));});
 if(!opt.noMouth){x.fillStyle='#2b1830';x.beginPath();x.moveTo(-r*.24,r*.34);x.quadraticCurveTo(0,r*.2,r*.24,r*.34);x.quadraticCurveTo(0,r*.58,-r*.24,r*.34);x.fill();x.fillStyle='#fff';x.beginPath();x.moveTo(-r*.13,r*.3);x.lineTo(-r*.05,r*.42);x.lineTo(r*.02,r*.28);x.closePath();x.fill();}}
var BODY={
 neuroanat:function(x,r,p){for(var k=0;k<8;k++){var q=k/8*TAU+.2,l=r*1.42;x.strokeStyle=p[1];x.lineWidth=r*.17;x.lineCap='round';x.beginPath();x.moveTo(Math.cos(q)*r*.7,Math.sin(q)*r*.7);x.lineTo(Math.cos(q)*l,Math.sin(q)*l);x.stroke();circle(x,Math.cos(q)*l,Math.sin(q)*l,r*.15,p[3]);}x.fillStyle=shade(x,r,p[2],p[0],p[1]);x.beginPath();x.arc(0,0,r,0,TAU);x.fill();eyes(x,r,p);},
 neuro:function(x,r,p){x.fillStyle=p[1];x.beginPath();for(var k=0;k<20;k++){var q=k/20*TAU,R=k%2?r*.92:r*1.28;x.lineTo(Math.cos(q)*R,Math.sin(q)*R);}x.closePath();x.fill();x.fillStyle=shade(x,r,p[2],p[0],p[1]);x.beginPath();x.arc(0,0,r*.93,0,TAU);x.fill();[[-.5,.5],[.58,.42],[.1,-.66]].forEach(function(a){circle(x,a[0]*r,a[1]*r,r*.11,p[1]);});eyes(x,r,p);},
 anatomy:function(x,r,p){x.fillStyle=shade(x,r,p[2],p[0],p[1]);x.beginPath();x.arc(0,-r*.14,r*.95,0,TAU);x.fill();rrect(x,-r*.55,r*.48,r*1.1,r*.52,r*.13);x.fillStyle=p[0];x.fill();for(var k=-1;k<=2;k++)line(x,(k-.5)*r*.27,r*.58,(k-.5)*r*.27,r*.94,p[1],Math.max(1.2,r*.07));circle(x,-r*.38,-r*.12,r*.28,'#2a1a20');circle(x,r*.38,-r*.12,r*.28,'#2a1a20');circle(x,-r*.34,-r*.1,r*.11,p[3]);circle(x,r*.42,-r*.1,r*.11,p[3]);x.fillStyle='#2a1a20';x.beginPath();x.moveTo(0,r*.14);x.lineTo(-r*.11,r*.36);x.lineTo(r*.11,r*.36);x.closePath();x.fill();line(x,r*.5,-r*.82,r*.3,-r*.55,p[1],Math.max(1.3,r*.07));},
 funcanat:function(x,r,p){gear(x,r*1.2,9,p[1],p[0]);x.fillStyle=shade(x,r*.8,p[2],p[0],p[1]);x.beginPath();x.arc(0,0,r*.78,0,TAU);x.fill();rrect(x,-r*.66,-r*.42,r*1.32,r*.62,r*.28);x.fillStyle='#231a18';x.fill();circle(x,-r*.3,-r*.11,r*.17,p[3]);circle(x,r*.3,-r*.11,r*.17,p[3]);circle(x,-r*.25,-r*.16,r*.06,'#fff');circle(x,r*.35,-r*.16,r*.06,'#fff');for(var k=-1;k<=1;k++)x.fillStyle=p[1],x.fillRect(k*r*.25-r*.06,r*.38,r*.12,r*.18);},
 exercise:function(x,r,p){[-1,1].forEach(function(s){x.fillStyle='#fff3df';x.beginPath();x.moveTo(s*r*.5,-r*.74);x.quadraticCurveTo(s*r*1.15,-r*.92,s*r*1.02,-r*1.5);x.quadraticCurveTo(s*r*.72,-r*1.08,s*r*.18,-r*.92);x.fill();circle(x,s*r*1.05,r*.3,r*.34,p[3]);circle(x,s*r*.98,r*.2,r*.13,'#fff6a8');});x.fillStyle=shade(x,r,p[2],p[0],p[1]);x.beginPath();x.arc(0,0,r,0,TAU);x.fill();x.fillStyle=p[3];x.fillRect(-r*.97,-r*.58,r*1.94,r*.24);eyes(x,r,p,{y:.03});},
 msk:function(x,r,p){[-1,1].forEach(function(s){for(var k=0;k<3;k++){var a=r*(.3+k*.35);x.strokeStyle=p[1];x.lineWidth=r*.15;x.lineCap='round';x.beginPath();x.moveTo(s*a,r*.5);x.lineTo(s*(a+r*.42),r*1.06);x.stroke();}x.fillStyle=p[3];x.beginPath();x.arc(s*r*1.25,-r*.3,r*.42,s>0?-2.3:-.6,s>0?1.7:3.7);x.lineTo(s*r*1.25,-r*.3);x.closePath();x.fill();});x.fillStyle=shade(x,r,p[2],p[0],p[1]);x.beginPath();x.ellipse(0,0,r*1.12,r*.86,0,0,TAU);x.fill();x.strokeStyle='rgba(16,50,90,.45)';x.lineWidth=r*.07;[-.5,0,.5].forEach(function(a){x.beginPath();x.arc(a*r*1.5,-r*1.04,r*.92,1.1,2.05);x.stroke();});eyes(x,r*.92,p,{y:-.12});},
 modality:function(x,r,p){x.fillStyle=p[1];x.beginPath();for(var k=0;k<14;k++){var q=k/14*TAU-.2,R=k%2?r*.72:r*(1.32+(k%4?.1:0));x.lineTo(Math.cos(q)*R,Math.sin(q)*R);}x.closePath();x.fill();x.fillStyle=shade(x,r*.85,'#fffef0',p[0],'#e0a600');x.beginPath();for(k=0;k<14;k++){q=k/14*TAU-.2;R=k%2?r*.6:r*1.08;x.lineTo(Math.cos(q)*R,Math.sin(q)*R);}x.closePath();x.fill();eyes(x,r*.86,p,{y:-.08});},
 cardio:function(x,r,p){for(var k=-2;k<=2;k++){x.strokeStyle=k%2?p[3]:p[0];x.lineWidth=r*.17;x.lineCap='round';x.beginPath();x.moveTo(k*r*.32,r*.32);x.quadraticCurveTo(k*r*.56+r*.18,r*.86,k*r*.33,r*1.42);x.stroke();}x.fillStyle=shade(x,r,p[2],p[0],p[1]);x.beginPath();x.arc(0,0,r,Math.PI,0);x.quadraticCurveTo(r*.72,r*.54,r*.42,r*.34);x.quadraticCurveTo(r*.18,r*.58,0,r*.34);x.quadraticCurveTo(-r*.18,r*.58,-r*.42,r*.34);x.quadraticCurveTo(-r*.72,r*.54,-r,0);x.fill();circle(x,-r*.46,-r*.58,r*.12,'rgba(255,255,255,.6)');eyes(x,r*.82,p,{y:-.34,noMouth:true});},
 clindx:function(x,r,p){x.save();x.rotate(Math.PI/4);rrect(x,-r*.86,-r*.86,r*1.72,r*1.72,r*.26);x.fillStyle=p[1];x.fill();rrect(x,-r*.73,-r*.73,r*1.46,r*1.46,r*.2);x.fillStyle=shade(x,r,p[2],p[0],p[1]);x.fill();x.restore();circle(x,0,0,r*.5,'#fff');circle(x,r*.08,r*.03,r*.31,p[1]);circle(x,r*.08,r*.03,r*.17,'#14101f');circle(x,r*.2,-r*.09,r*.08,'#fff');line(x,-r*.58,-r*.5,r*.25,-r*.56,'#1d1330',Math.max(2,r*.13));},
 daily:function(x,r,p){x.fillStyle=shade(x,r,p[2],p[0],p[1]);x.beginPath();x.moveTo(0,-r*1.4);x.quadraticCurveTo(r*1.25,-r*.2,r*.82,r*.6);x.quadraticCurveTo(0,r*1.25,-r*.82,r*.6);x.quadraticCurveTo(-r*1.25,-r*.2,0,-r*1.4);x.fill();eyes(x,r,p,{y:.05});}
};
function crown(x,r,y){x.fillStyle='#ffd34d';x.strokeStyle='#8a5a00';x.lineWidth=Math.max(1.2,r*.05);x.beginPath();x.moveTo(-r*.5,y);x.lineTo(-r*.6,y-r*.5);x.lineTo(-r*.24,y-r*.22);x.lineTo(0,y-r*.62);x.lineTo(r*.24,y-r*.22);x.lineTo(r*.6,y-r*.5);x.lineTo(r*.5,y);x.closePath();x.fill();x.stroke();circle(x,0,y-r*.16,r*.09,'#ff4d6d');}
function outline(src,px,col){var c=mk(src.width,src.height),x=c.getContext('2d'),t=mk(src.width,src.height),y=t.getContext('2d');y.drawImage(src,0,0);y.globalCompositeOperation='source-in';y.fillStyle=col;y.fillRect(0,0,t.width,t.height);for(var i=0;i<12;i++){var a=i/12*TAU;x.drawImage(t,Math.cos(a)*px,Math.sin(a)*px);}x.drawImage(src,0,0);return c;}
function tint(src,col){var t=mk(src.width,src.height),y=t.getContext('2d');y.drawImage(src,0,0);y.globalCompositeOperation='source-in';y.fillStyle=col;y.fillRect(0,0,t.width,t.height);return t;}
function enemy(id,type,r,elite){
 var k='e|'+id+'|'+type+'|'+Math.round(r)+'|'+(elite?1:0);
 return memo(k,function(){
  var q=2,half=Math.ceil(r*2.25)+6,c=mk(half*2*q,half*2*q),x=c.getContext('2d'),T=theme(id),p=T.pal;x.scale(q,q);x.translate(half,half);
  if(type==='fast'){x.fillStyle=p[1];[-1,1].forEach(function(s){x.beginPath();x.moveTo(s*r*.55,-r*.2);x.quadraticCurveTo(s*r*1.5,-r*1.2,s*r*1.85,-r*.45);x.quadraticCurveTo(s*r*1.42,-r*.12,s*r*1.56,r*.28);x.quadraticCurveTo(s*r*1.08,r*.05,s*r*.6,r*.42);x.closePath();x.fill();});}
  if(type==='split'){[[-.95,.55],[.98,.45],[.05,-1.08]].forEach(function(a){circle(x,a[0]*r,a[1]*r,r*.36,p[1]);circle(x,a[0]*r-r*.08,a[1]*r-r*.09,r*.2,p[0]);});}
  if(type==='shoot'){x.fillStyle='#3a3350';x.fillRect(r*.52,-r*.25,r*.96,r*.5);x.fillStyle=p[3];x.fillRect(r*1.32,-r*.32,r*.26,r*.64);}
  (BODY[id]||BODY.daily)(x,type==='mini'?r*.95:r,p);
  if(type==='tank'||type==='boss'){x.strokeStyle='#3b3650';x.lineWidth=r*.2;x.beginPath();x.arc(0,r*.03,r*1.04,.42,Math.PI-.42);x.stroke();x.strokeStyle='#b8bfd6';x.lineWidth=r*.09;x.beginPath();x.arc(0,r*.03,r*1.04,.5,Math.PI-.5);x.stroke();for(var i=0;i<3;i++){var a=.85+i*.72;circle(x,Math.cos(a)*r*1.04,r*.03+Math.sin(a)*r*1.04,r*.07,'#ffe08a');}}
  if(type==='boss'||elite)crown(x,r,-r*.9);
  return {c:outline(c,Math.max(2,q*1.35),'#120d24'),s:half};
 });
}
function enemyFlash(id,type,r,elite){var k='f|'+id+'|'+type+'|'+Math.round(r)+'|'+(elite?1:0);return memo(k,function(){var e=enemy(id,type,r,elite);return {c:tint(e.c,'#ffffff'),s:e.s};});}

/* ---------- 주인공 ---------- */
var HERO={rookie:{top:'#f7fbff',trim:'#2f9df0',pants:'#2c4d8f',hair:'#3a2a22',shoe:'#ffffff'},manual:{top:'#ffefe4',trim:'#ff7b47',pants:'#5a3350',hair:'#65371f',shoe:'#ffd29b'},coach:{top:'#e9fff5',trim:'#21bd80',pants:'#1f5c55',hair:'#cfd3dc',shoe:'#f5f5f5'},sprinter:{top:'#fff9df',trim:'#ffb300',pants:'#3a3a4f',hair:'#1e1c2a',shoe:'#ff5f6d'}};
function heroFrame(id,f){
 return memo('h|'+id+'|'+f,function(){
  var H=HERO[id]||HERO.rookie,c=mk(148,164),x=c.getContext('2d');x.scale(2,2);x.translate(37,49);
  var sw=[0,5,0,-5][f],bob=[0,-1.5,0,-1.5][f];
  [[-5,sw],[5,-sw]].forEach(function(l){x.fillStyle=H.pants;rrect(x,l[0]-4+l[1]*.45,12,8,14,3);x.fill();x.fillStyle=H.shoe;rrect(x,l[0]-4+l[1]*.8,23,11,5.5,2.5);x.fill();x.fillStyle=H.trim;x.fillRect(l[0]-3+l[1]*.8,26,9,1.6);});
  x.translate(0,bob);
  x.strokeStyle=H.top;x.lineWidth=6.2;x.lineCap='round';x.beginPath();x.moveTo(-10,-1);x.lineTo(-12-sw*.4,10);x.stroke();
  x.fillStyle=H.top;rrect(x,-11,-7,22,22,7);x.fill();x.fillStyle=H.trim;x.fillRect(-11,8,22,3.5);x.beginPath();x.moveTo(-5,-7);x.lineTo(0,1);x.lineTo(5,-7);x.closePath();x.fill();
  x.strokeStyle='#39425f';x.lineWidth=1.8;x.beginPath();x.arc(1,-3,7,.1,2.9);x.stroke();circle(x,6,5,2.5,'#dfe7f5');
  x.strokeStyle=H.top;x.lineWidth=6.2;x.beginPath();x.moveTo(9,-1);x.lineTo(13+sw*.4,10);x.stroke();circle(x,13+sw*.4,11,3.5,'#f5cfae');circle(x,-12-sw*.4,11,3.5,'#f5cfae');
  var g=x.createRadialGradient(-2,-22,2,0,-18,15);g.addColorStop(0,'#ffe2c7');g.addColorStop(1,'#efbf98');x.fillStyle=g;x.beginPath();x.arc(1,-18,14,0,TAU);x.fill();
  x.fillStyle=H.hair;x.beginPath();x.arc(0,-21,14.5,Math.PI*.92,Math.PI*2.04);x.quadraticCurveTo(8,-23,3,-27);x.quadraticCurveTo(-1,-20,-9,-22);x.quadraticCurveTo(-13,-17,-14,-12);x.closePath();x.fill();
  if(id==='coach'){x.fillStyle=H.trim;x.beginPath();x.arc(1,-25,14,Math.PI,0);x.closePath();x.fill();rrect(x,6,-27,16,4,2);x.fill();}
  if(id==='sprinter'){x.fillStyle=H.trim;x.fillRect(-13,-26,28,4.5);x.beginPath();x.moveTo(-13,-25);x.lineTo(-22,-30);x.lineTo(-20,-22);x.closePath();x.fill();}
  if(id==='manual'){circle(x,13+sw*.4,11,5,H.trim);circle(x,-12-sw*.4,11,5,H.trim);}
  circle(x,7,-17,2.9,'#fff');circle(x,8,-16.6,1.9,'#231a2e');circle(x,8.6,-17.5,.7,'#fff');circle(x,-2,-17,2.6,'#fff');circle(x,-1.2,-16.6,1.7,'#231a2e');
  x.fillStyle='rgba(255,120,120,.34)';x.beginPath();x.ellipse(-5,-12,3,1.8,0,0,TAU);x.ellipse(11,-12,2.5,1.6,0,0,TAU);x.fill();
  x.strokeStyle='#8a4a3a';x.lineWidth=1.3;x.beginPath();x.arc(4,-11.5,2.5,.25,2.7);x.stroke();
  return {c:outline(c,2.7,'#14102a'),ax:37,ay:49};
 });
}

/* ---------- 효과 ---------- */
function glow(col,r){return memo('g|'+col+'|'+r,function(){var c=mk(r*2,r*2),x=c.getContext('2d'),g=x.createRadialGradient(r,r,0,r,r,r);g.addColorStop(0,col);g.addColorStop(.28,col+'99');g.addColorStop(.62,col+'26');g.addColorStop(1,col+'00');x.fillStyle=g;x.fillRect(0,0,r*2,r*2);return c;});}
function gem(big){return memo('gem|'+(big?1:0),function(){var c=mk(44,52),x=c.getContext('2d');x.scale(2,2);x.translate(11,13);var a=big?'#ffd34d':'#58e8ff',b=big?'#b87a00':'#1877c9',l=big?'#fff3bf':'#d8fbff';x.fillStyle=b;x.beginPath();x.moveTo(0,-9);x.lineTo(7,-2);x.lineTo(0,10);x.lineTo(-7,-2);x.closePath();x.fill();x.fillStyle=a;x.beginPath();x.moveTo(0,-9);x.lineTo(7,-2);x.lineTo(0,1);x.lineTo(-7,-2);x.closePath();x.fill();x.fillStyle=l;x.beginPath();x.moveTo(-1,-7);x.lineTo(2,-2.5);x.lineTo(-4,-2);x.closePath();x.fill();return outline(c,1.6,'#0d1430');});}
function blade(){return memo('blade',function(){var c=mk(64,64),x=c.getContext('2d');x.scale(2,2);x.translate(16,16);circle(x,0,0,11,'#57f0c2');circle(x,-2,-3,7,'#b8ffe9');x.fillStyle='#fff';x.fillRect(-2.2,-7,4.4,14);x.fillRect(-7,-2.2,14,4.4);return outline(c,2,'#0a3b35');});}
function pickup(k){return memo('p|'+k,function(){var c=mk(88,88),x=c.getContext('2d');x.scale(2,2);x.translate(22,22);
 if(k==='heart'){x.fillStyle='#ff4d6d';x.beginPath();x.moveTo(0,13);x.bezierCurveTo(-20,-1,-11,-16,0,-6);x.bezierCurveTo(11,-16,20,-1,0,13);x.fill();circle(x,-6,-5,3,'#ffc2cf');}
 else if(k==='magnet'){x.strokeStyle='#ff4d6d';x.lineWidth=8;x.beginPath();x.arc(0,-1,10,Math.PI,0,true);x.stroke();x.fillStyle='#e6edf8';x.fillRect(-14,-6,8,6);x.fillRect(6,-6,8,6);}
 else if(k==='bomb'){circle(x,0,3,12,'#2c2f46');circle(x,-4,-1,3.2,'#7f86aa');line(x,6,-7,12,-13,'#b58a4a',3);circle(x,13,-14,3.6,'#ffb703');}
 else{x.fillStyle='#9a5a22';rrect(x,-15,-6,30,19,3);x.fill();x.fillStyle='#c97b33';x.beginPath();x.moveTo(-15,-5);x.quadraticCurveTo(0,-20,15,-5);x.closePath();x.fill();x.fillStyle='#ffd34d';x.fillRect(-15,-6,30,3);x.fillRect(-3.5,-9,7,12);circle(x,0,3,2,'#8a5a00');}
 return outline(c,2,'#14102a');});}
function vignette(){return memo('vig',function(){var c=mk(256,256),x=c.getContext('2d'),g=x.createRadialGradient(128,118,62,128,128,190);g.addColorStop(0,'rgba(5,4,20,0)');g.addColorStop(.62,'rgba(5,4,20,.08)');g.addColorStop(1,'rgba(5,4,20,.62)');x.fillStyle=g;x.fillRect(0,0,256,256);return c;});}
function danger(){return memo('dng',function(){var c=mk(256,256),x=c.getContext('2d'),g=x.createRadialGradient(128,128,70,128,128,185);g.addColorStop(0,'rgba(255,0,40,0)');g.addColorStop(1,'rgba(255,0,50,.55)');x.fillStyle=g;x.fillRect(0,0,256,256);return c;});}

/* ---------- 메뉴용 그림 ---------- */
function thumb(id,size){var c=mk(size*2,size*2),x=c.getContext('2d'),T=theme(id);x.scale(2,2);x.fillStyle=x.createPattern(floor(id),'repeat');x.fillRect(0,0,size,size);var g=glow(T.glow,Math.round(size*.62));x.globalCompositeOperation='lighter';x.globalAlpha=.55;x.drawImage(g,size/2-size*.62,size/2-size*.62,size*1.24,size*1.24);x.globalAlpha=1;x.globalCompositeOperation='source-over';var r=Math.round(size*.28),e=enemy(id,'boss',r);x.drawImage(e.c,size/2-e.s,size*.56-e.s,e.s*2,e.s*2);return c;}
function heroThumb(id,size){var c=mk(size*2,size*2),x=c.getContext('2d'),h=heroFrame(id,0),k=size/86;x.scale(2,2);x.translate(size/2,size*.56);x.scale(k,k);x.drawImage(h.c,-h.ax,-h.ay,74,82);return c;}
function banner(w,h){
 var c=mk(w*2,h*2),x=c.getContext('2d');x.scale(2,2);
 var sky=x.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#2b1b6e');sky.addColorStop(.55,'#6a2f8f');sky.addColorStop(.82,'#e0647c');sky.addColorStop(1,'#ffb35c');x.fillStyle=sky;x.fillRect(0,0,w,h);
 var r=seeded(77);for(var i=0;i<46;i++){x.fillStyle='rgba(255,255,255,'+(.25+r()*.65)+')';x.fillRect(r()*w,r()*h*.55,1+r()*1.6,1+r()*1.6);}
 circle(x,w*.78,h*.32,h*.2,'#ffe9a8');circle(x,w*.78,h*.32,h*.16,'#fff7d6');
 [['#3d2470',.62,34],['#2b1a58',.72,26],['#1b1140',.84,18]].forEach(function(l,k){x.fillStyle=l[0];x.beginPath();x.moveTo(0,h);for(var a=0;a<=w+20;a+=20)x.lineTo(a,h*l[1]+Math.sin(a*.018+k*2)*l[2]*.55+Math.sin(a*.05+k)*l[2]*.22);x.lineTo(w,h);x.closePath();x.fill();});
 var ids=['neuroanat','cardio','msk','modality','anatomy'],pos=[[.1,.74,.7],[.28,.84,.85],[.76,.86,.95],[.92,.73,.72],[.6,.72,.6]];
 ids.forEach(function(id,i){var p=pos[i],R=Math.round(h*.13*p[2]),e=enemy(id,i===2?'tank':'grunt',R);x.drawImage(e.c,w*p[0]-e.s,h*p[1]-e.s,e.s*2,e.s*2);});
 var hero=heroFrame('rookie',1),k=h/118;x.save();x.translate(w*.47,h*.72);x.scale(k,k);x.globalCompositeOperation='lighter';x.drawImage(glow('#7fd8ff',70),-70,-74);x.globalCompositeOperation='source-over';x.drawImage(hero.c,-hero.ax,-hero.ay,74,82);x.restore();
 return c;
}
window.ARCADE_ART={theme:theme,floor:floor,prop:prop,props:props,enemy:enemy,enemyFlash:enemyFlash,heroFrame:heroFrame,glow:glow,gem:gem,blade:blade,pickup:pickup,vignette:vignette,danger:danger,thumb:thumb,heroThumb:heroThumb,banner:banner};
})();
