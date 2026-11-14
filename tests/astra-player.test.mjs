import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(path, dependencies={}) {
 const exports={};const source=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(source,{exports,require:name=>dependencies[name]??{}});return exports;
}
const catalog=load('lib/astraVideos.ts');
function harness(){
 const slots=[];let cursor=0;
 function useState(initial){const i=cursor++;if(!(i in slots))slots[i]=initial;return [slots[i],v=>slots[i]=v];}
 function useRef(initial){return useState({current:initial})[0];}
 const jsx=(type,props,key)=>({type,props,key});
 const {AstraVideoPlayer}=load('components/AstraVideoPlayer.tsx',{'react':{useState,useRef},'react/jsx-runtime':{jsx,jsxs:jsx},'@/lib/astraVideos':catalog,'next/link':{default:'a'}});
 return ()=>{cursor=0;return AstraVideoPlayer({topicId:'respiration',title:'Respiration'});};
}
function nodes(t){if(!t||typeof t!=='object')return [];if(Array.isArray(t))return t.flatMap(nodes);return [t,...nodes(t.props?.children)];}
const video=t=>nodes(t).find(n=>n.type==='video');
const button=(t,label)=>nodes(t).find(n=>n.type==='button'&&n.props.children===label);
test('video advances through every part, then stops at final part',()=>{
 const render=harness();let tree=render();let played=0;
 const player={currentTime:0,paused:false,play:()=>{played++;return Promise.resolve();}};
 for(let i=0;i<catalog.ASTRA_VIDEOS.respiration.parts.length;i++){
  const v=video(tree);v.props.ref.current=player;v.props.onLoadedMetadata();assert.equal(nodes(v).find(n=>n.type==='source').props.src,catalog.ASTRA_VIDEOS.respiration.parts[i].src);
  v.props.onEnded();tree=render();
 }
 assert.equal(button(tree,'Next').props.disabled,true);assert.equal(played,2);
});
test('late chapter jump selects correct part and local timestamp',()=>{
 const render=harness();let tree=render();video(tree).props.ref.current={paused:true,currentTime:0};
 const chapters=nodes(tree).filter(n=>n.type==='button'&&Array.isArray(n.props.children));chapters.at(-1).props.onClick();tree=render();
 const player={currentTime:0,play:()=>Promise.resolve()};video(tree).props.ref.current=player;video(tree).props.onLoadedMetadata();
 const data=catalog.ASTRA_VIDEOS.respiration;assert.equal(nodes(video(tree)).find(n=>n.type==='source').props.src,data.parts.at(-1).src);assert.equal(player.currentTime,data.chapters.at(-1).start-data.parts.at(-1).start);
});
