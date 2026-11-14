import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=ts.transpileModule(fs.readFileSync(path.join(root,'lib/astraVideos.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const moduleResult={exports:{}};vm.runInNewContext(source,{exports:moduleResult.exports,module:moduleResult});
const {ASTRA_VIDEOS,formatVideoTime}=moduleResult.exports;
test('only completed videos have real local assets and valid chapter timing',()=>{
 assert.ok(ASTRA_VIDEOS.respiration);
 for(const [id,v] of Object.entries(ASTRA_VIDEOS)){
  assert.ok(fs.existsSync(path.join(root,`lib/topics/${id}.ts`)));
  for(const p of [v.poster,...v.parts.flatMap(p=>[p.src,p.captions])]){
   assert.ok(p.startsWith('/reallife-videos-astra/'));
   assert.ok(fs.statSync(path.join(root,'public',p)).size>0);
  }
  assert.ok(v.parts.every(p=>p.duration>0));
  assert.ok(Math.abs(v.parts.reduce((n,p)=>n+p.duration,0)-v.durationSeconds)<0.2);
  assert.ok(v.durationSeconds>0);assert.equal(v.chapters[0].start,0);
  v.chapters.forEach((c,i)=>{assert.ok(c.title.length);assert.ok(c.start<v.durationSeconds);if(i)assert.ok(c.start>v.chapters[i-1].start);});
  assert.ok(fs.readFileSync(path.join(root,'public',v.parts[0].captions),'utf8').startsWith('WEBVTT'));
 }
});
test('duration formatting handles zero and minutes',()=>{assert.equal(formatVideoTime(0),'0:00');assert.equal(formatVideoTime(986.56),'16:26');});
test('unfinished lessons are labeled and cannot be played',()=>{
 const c=fs.readFileSync(path.join(root,'components/AstraVideoCollection.tsx'),'utf8');
 assert.ok(c.includes('Planned · not yet available'));assert.ok(c.includes('{video && <button'));
 assert.ok(c.includes('AI-generated presenters'));
});
