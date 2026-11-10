import { narration } from '/narration-data.js';
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const chapters = [
 { date:'April 12, 2025', title:'The Awakening', image:'scene-01-awakening', alt:'STEVE wakes among misty forest ruins at dawn', location:'THE OVERWORLD / DAWN', description:'STEVE wakes in a ruined forest. Beyond the trees, empty villages wait in the mist. With no memory of the fall, he makes his first choice: stay, and build.', motif:'EVERY LEGEND BEGINS WITH A CHOICE.', start:0 },
 { date:'April 13, 2025', title:'The First Night', image:'scene-02-first-night', alt:'STEVE builds a stone shelter while monsters approach the villagers', location:'THE OVERWORLD / NIGHTFALL', description:'Monsters emerge from the dark. STEVE raises a shelter, block by block, and stands between danger and the last survivors. By sunrise, they have a place to rest.', motif:'COURAGE IS SOMETHING YOU BUILD.', start:24 },
 { date:'April 20, 2025', title:'The Forgotten Power', image:'scene-03-forgotten-power', alt:'STEVE discovers a glowing cubic Worldheart inside an ancient cave', location:'THE ANCIENT CAVE / BELOW THE RUINS', description:'Deep beneath the ruins, STEVE finds the Worldheart. Its blue light reveals the lost art of creation: the power to bring broken stone together again. But its key is missing.', motif:'THE WORLD REMEMBERS ITS BUILDERS.', start:40 },
 { date:'May 2, 2025', title:'Into the Nether', image:'scene-04-nether', alt:'STEVE recovers the Ember Key above the lava rivers of the Nether', location:'THE NETHER / THE EMBER FORTRESS', description:'He crosses a gate of fire and enters the Nether. Through ash, lava and danger, STEVE recovers the Ember Key. His armor burns. His hope holds strong.', motif:'SOME LIGHT CAN ONLY BE FOUND IN FIRE.', start:61 },
 { date:'May 18, 2025', title:'The Final Dimension', image:'scene-05-final-dimension', alt:'STEVE confronts the immense Ender Dragon between obsidian towers', location:'THE END / BEYOND THE VOID', description:'Above the dark towers, the Ender Dragon waits. STEVE raises his obsidian sword. One final strike breaks the shadow’s hold and frees the power to rebuild.', motif:'THE LAST STRIKE. THE FIRST TOMORROW.', start:77 },
 { date:'May 19, 2025', title:'The Last Builder', image:'scene-06-last-builder', alt:'STEVE restores the Worldheart above a thriving village and forest', location:'THE OVERWORLD / A NEW DAWN', description:'STEVE restores the Worldheart. Forests grow. Rivers flow. Families come home. Then he teaches them to build. The last builder of the old world will not be the last of the new one.', motif:'A WORLD REBORN. A LEGACY SHARED.', start:95 }
];
chapters.forEach((item,index)=>{item.start=narration.chapters[index].start;});
const avatars = [
 { image:'avatar-01-legendary', title:'The Legendary', kicker:'I / THE ORIGIN', description:'Obsidian armor. Diamond edges. A quiet promise. STEVE carries the weight of a broken world without letting it harden his heart.' },
 { image:'avatar-02-mysterious', title:'The Watcher', kicker:'II / THE SHADOW', description:'His cyan eyes search the darkness. Patient and alert, STEVE listens before he acts. No one under his protection faces the night alone.' },
 { image:'avatar-03-electric', title:'The Awakened', kicker:'III / THE POWER', description:'The Worldheart answers his hands. Electric blue energy binds broken blocks together. His gift needs materials, patience and a reason to create.' },
 { image:'avatar-04-battle', title:'The Protector', kicker:'IV / THE BATTLE', description:'His obsidian blade shines with a cyan edge. STEVE fights to protect a future in which the sword can finally be set down.' },
 { image:'avatar-05-heroic', title:'The Last Builder', kicker:'V / THE LEGACY', description:'His luminous cape catches the first light of a restored world. His greatest victory is not standing above others. It is teaching them to stand beside him.' }
];
function toast(message) { $('#toast').textContent=message; $('#toast').classList.add('visible'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>$('#toast').classList.remove('visible'),4500); }

// The chapter archive, including keyboard navigation for its vertical tablist.
let chapter=0;
function selectChapter(index, focus=false) {
 chapter=(index+chapters.length)%chapters.length; const item=chapters[chapter];
 $$('[data-chapter]').forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===chapter));tab.tabIndex=i===chapter?0:-1;});
 $('#chapter-panel').setAttribute('aria-labelledby',`tab-${chapter}`);
 $('#chapter-image').src=`/images/${item.image}.webp`; $('#chapter-image').alt=item.alt;
 $('#chapter-location').textContent=item.location; $('#chapter-date').textContent=item.date.toUpperCase();
 $('#chapter-title').textContent=item.title; $('#chapter-description').textContent=item.description; $('#chapter-motif').textContent=item.motif;
 $('.chapter-count').innerHTML=`0${chapter+1} <span>/ 06</span>`;
 $('#download-chapter').href=narration.chapters[chapter].file;
 $('#chapter-audio-duration').textContent=timecode(narration.chapters[chapter].end-narration.chapters[chapter].start);
 if(focus) $(`#tab-${chapter}`).focus();
}
$$('[data-chapter]').forEach(tab=>{tab.addEventListener('click',()=>selectChapter(Number(tab.dataset.chapter)));tab.addEventListener('keydown',event=>{const keys={ArrowDown:chapter+1,ArrowRight:chapter+1,ArrowUp:chapter-1,ArrowLeft:chapter-1,Home:0,End:5};if(event.key in keys){event.preventDefault();selectChapter(keys[event.key],true);}});});
$('#prev-chapter').addEventListener('click',()=>selectChapter(chapter-1));
$('#next-chapter').addEventListener('click',()=>selectChapter(chapter+1));
function openArt(image,title,kicker,description,alt) {
 $('#dialog-image').src=`/images/${image}.webp`;$('#dialog-image').alt=alt||`${title} — STEVE`;
 $('#dialog-title').textContent=title;$('#dialog-kicker').textContent=kicker;$('#dialog-description').textContent=description;$('#dialog-download').href=`/images/${image}.webp`;
 $('#art-dialog').showModal();
}
$$('[data-avatar]').forEach(button=>button.addEventListener('click',()=>{const item=avatars[Number(button.dataset.avatar)];openArt(item.image,item.title,item.kicker,item.description,button.querySelector('img').alt);}));
$('#expand-scene').addEventListener('click',()=>{const item=chapters[chapter];openArt(item.image,item.title,item.date,item.description,item.alt);});
$$('.dialog-close').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
$$('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}));

// The published edition keeps the creator's voice separate from the score.
const music=$('#music'),voice=$('#voice');
let musicLevel=.35,hasVoice=false,voiceKind='none',objectUrl=null;
music.volume=musicLevel;
const timecode=seconds=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
let duration=narration.duration;
function refreshDuration(){
 duration=hasVoice&&Number.isFinite(voice.duration)?voice.duration:narration.duration;
 $$('[data-film-duration]').forEach(element=>element.textContent=timecode(duration));
 $('#film-seek').max=String(duration);
}
function updateSoundUI(){const playing=!music.paused;$('#music-toggle').textContent=playing?'Ⅱ':'▶';$('#music-toggle').setAttribute('aria-label',playing?'Pause background music':'Play background music');$('#music-toggle').setAttribute('aria-pressed',String(playing));$('#header-sound').setAttribute('aria-pressed',String(playing));$('#header-sound').lastElementChild.textContent=playing?'Sound on':'Sound off';$('.audio-dock').classList.toggle('playing',playing);}
function duckMusic(){music.volume=musicLevel*(hasVoice && !voice.paused ? .22 : 1);}
async function toggleMusic(){if(!music.paused)music.pause();else try{await music.play();}catch{toast('The soundtrack could not play. Try again in a moment.');}}
$('#music-toggle').addEventListener('click',toggleMusic);$('#header-sound').addEventListener('click',toggleMusic);
music.addEventListener('play',updateSoundUI);music.addEventListener('pause',updateSoundUI);music.addEventListener('error',()=>toast('The soundtrack could not load. Please refresh the page.'));
$('#music-volume').addEventListener('input',event=>{musicLevel=Number(event.target.value);duckMusic();});
['play','pause','ended'].forEach(event=>voice.addEventListener(event,duckMusic));
voice.addEventListener('loadedmetadata',refreshDuration);

// Visitor previews remain private. A new published edition is always heard first.
async function voiceDB(action,value){return new Promise((resolve,reject)=>{const request=indexedDB.open('worldheart-voice',1);request.onupgradeneeded=()=>request.result.createObjectStore('recordings');request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result;const tx=db.transaction('recordings',action==='get'?'readonly':'readwrite');const store=tx.objectStore('recordings');const operation=action==='get'?store.get('narration'):action==='put'?store.put(value,'narration'):store.delete('narration');operation.onsuccess=()=>resolve(operation.result);tx.oncomplete=()=>db.close();tx.onerror=()=>reject(tx.error);};});}
function voiceMetadata(){return new Promise((resolve,reject)=>{if(voice.readyState>=1){resolve();return;}const loaded=()=>{cleanup();resolve();};const failed=()=>{cleanup();reject(new Error('Audio decoding failed'));};const timer=setTimeout(failed,20000);function cleanup(){clearTimeout(timer);voice.removeEventListener('loadedmetadata',loaded);voice.removeEventListener('error',failed);}voice.addEventListener('loadedmetadata',loaded);voice.addEventListener('error',failed);});}
async function loadPublishedVoice(){
 if($('#film-dialog').open)$('#film-dialog').close();
 voice.pause();if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=null;
 voice.src=narration.voiceUrl;voice.load();
 try{await voiceMetadata();hasVoice=true;voiceKind='published';voice.hidden=false;$('#use-published-voice').hidden=true;$('#remove-voice').hidden=true;$('#voice-file-label').textContent='Preview your own narration';$('#voice-status').textContent='The creator’s Monster edition is ready. Your own uploads stay private in this browser.';try{localStorage.setItem('worldheart-voice-choice','published');}catch{}refreshDuration();}
 catch{hasVoice=false;voiceKind='none';$('#voice-status').textContent='The narration could not load. Refresh the page or try your own audio file.';toast('Narration could not load. The instrumental remains available.');}
}
async function setVoice(file,{persist=true}={}) {
 if(!file)return;
 if(file.size>50*1024*1024){toast('Please choose an audio file smaller than 50 MB.');return;}
 if(!file.type.startsWith('audio/')&&!/\.(mp3|wav|m4a|ogg|webm|aac|flac)$/i.test(file.name||'')){toast('Please choose a supported audio file.');return;}
 if($('#film-dialog').open)$('#film-dialog').close();
 voice.pause();if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=URL.createObjectURL(file);voice.src=objectUrl;voice.load();
 try{await voiceMetadata();}catch{toast('This recording could not be decoded. Restoring the published voice.');await loadPublishedVoice();return;}
 hasVoice=true;voiceKind='private';voice.hidden=false;$('#remove-voice').hidden=false;$('#use-published-voice').hidden=false;$('#voice-file-label').textContent=file.name||'Your narration';$('#voice-status').textContent='Private preview ready. Published captions are hidden for your recording.';refreshDuration();
 if(persist)try{await voiceDB('put',{blob:file,name:file.name});localStorage.setItem('worldheart-voice-version',narration.version);localStorage.setItem('worldheart-voice-choice','private');}catch{$('#voice-status').textContent='Private preview ready for this visit. This browser could not save it for later.';}
}
$('#voice-file').addEventListener('change',event=>setVoice(event.target.files[0]));
const dropZone=$('#drop-zone');['dragenter','dragover'].forEach(name=>dropZone.addEventListener(name,event=>{event.preventDefault();dropZone.classList.add('dragover');}));['dragleave','drop'].forEach(name=>dropZone.addEventListener(name,event=>{event.preventDefault();dropZone.classList.remove('dragover');}));dropZone.addEventListener('drop',event=>setVoice(event.dataTransfer.files[0]));
$('#use-published-voice').addEventListener('click',loadPublishedVoice);
$('#remove-voice').addEventListener('click',async()=>{try{await voiceDB('delete');}catch{}$('#voice-file').value='';await loadPublishedVoice();duckMusic();});
async function restoreVoice(){
 try{const version=localStorage.getItem('worldheart-voice-version');if(version===narration.version&&localStorage.getItem('worldheart-voice-choice')==='private'){const saved=await voiceDB('get');if(saved?.blob){await setVoice(new File([saved.blob],saved.name||'Your saved narration',{type:saved.blob.type}),{persist:false});return;}}}catch{}
 await loadPublishedVoice();
}
const voiceReady=restoreVoice();

// The voice's media clock is the master: pause, buffering and seeking stay in sync.
const film=$('#film-dialog');let filmPosition=0,filmStart=0,filmPlaying=false,filmChapter=-1,filmFrame=0,beforeFilm=null,captionIndex=-1,captionsOn=true,playGeneration=0;
function chapterStart(index){return chapters[index].start*(voiceKind==='private'?duration/narration.duration:1);}
function currentFilmTime(){if(filmPlaying&&hasVoice&&Number.isFinite(voice.currentTime))return Math.min(duration,voice.currentTime);return Math.min(duration,filmPlaying?filmPosition+(performance.now()-filmStart)/1000:filmPosition);}
function renderFilm(){
 const time=currentFilmTime();let index=chapters.findLastIndex((_,i)=>time>=chapterStart(i));if(index<0)index=0;
 if(index!==filmChapter){filmChapter=index;const item=chapters[index];$('#film-image').src=`/images/${item.image}.webp`;$('#film-image').alt=item.alt;$('#film-date').textContent=item.date.toUpperCase();$('#film-title').textContent=item.title;$('#film-description').textContent=item.description;$$('[data-film-chapter]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));}
 if(voiceKind==='published'&&time<narration.introEnd){$('#film-date').textContent='THE HERO WHO REBUILT A BROKEN WORLD';$('#film-title').textContent='STEVE — THE LAST BUILDER';}
 else{$('#film-date').textContent=chapters[index].date.toUpperCase();$('#film-title').textContent=chapters[index].title;}
 if(voiceKind==='published'&&captionsOn){const cue=narration.captions.findLastIndex(item=>time>=item.start&&time<item.end);if(cue!==captionIndex){captionIndex=cue;$('#film-caption').textContent=cue>=0?narration.captions[cue].text:'';}}
 else{$('#film-caption').textContent='';captionIndex=-1;}
 $('#film-time').textContent=`${timecode(time)} / ${timecode(duration)}`;$('#film-seek').value=String(time);
 if(time>=duration-.03&&filmPlaying){finishFilm();return;}
 if(filmPlaying)filmFrame=requestAnimationFrame(renderFilm);
}
function syncMusic(time){const musicDuration=Number.isFinite(music.duration)?music.duration:narration.duration;music.currentTime=time%Math.max(1,musicDuration);}
async function playFilm(){
 const generation=++playGeneration;if(filmPosition>=duration-.03)filmPosition=0;
 $('#film-play').disabled=true;$('#film-play').setAttribute('aria-label','Starting cinematic story');
 try{
  if(hasVoice)voice.currentTime=Math.min(filmPosition,duration);
  syncMusic(filmPosition);
  // Start both elements inside the same interaction, including on mobile Safari.
  music.play().catch(error=>{if(generation===playGeneration&&film.open&&error.name!=='AbortError')toast('The score could not play. Your narration is still available.');});
  if(hasVoice)await voice.play();
  if(generation!==playGeneration||!film.open)return;
  filmStart=performance.now();filmPlaying=true;duckMusic();$('#film-play').textContent='Ⅱ';$('#film-play').setAttribute('aria-label','Pause cinematic story');cancelAnimationFrame(filmFrame);renderFilm();
 }catch(error){if(generation!==playGeneration||error.name==='AbortError')return;filmPlaying=false;music.pause();toast('The narration could not play. Please try again.');$('#film-play').textContent='▶';$('#film-play').setAttribute('aria-label','Resume cinematic story');}
 finally{if(generation===playGeneration)$('#film-play').disabled=false;}
}
function pauseFilm(){filmPosition=currentFilmTime();filmPlaying=false;++playGeneration;cancelAnimationFrame(filmFrame);music.pause();voice.pause();$('#film-play').disabled=false;$('#film-play').textContent='▶';$('#film-play').setAttribute('aria-label','Resume cinematic story');}
function finishFilm(){pauseFilm();filmPosition=duration;$('#film-play').textContent='↻';$('#film-play').setAttribute('aria-label','Replay cinematic story');$('#film-caption').textContent='A world is never lost while someone is willing to build.';}
async function openFilm(startChapter=null){
 if(film.open)return;await voiceReady;refreshDuration();beforeFilm={playing:!music.paused,time:music.currentTime};voice.pause();filmPosition=startChapter===null?0:chapterStart(startChapter);filmChapter=-1;film.showModal();
 $('#film-voice-label').textContent=hasVoice?(voiceKind==='private'?'YOUR PRIVATE VOICE PREVIEW':'CREATOR’S VOICE · MONSTER EDITION'):'ORIGINAL INSTRUMENTAL';$('#film-captions').disabled=voiceKind!=='published';$('#film-captions').title=voiceKind==='published'?'English captions':'Captions match the published narration';renderFilm();await playFilm();
}
$('#watch-film').addEventListener('click',()=>openFilm());$('#preview-narration').addEventListener('click',()=>openFilm());$('#listen-chapter').addEventListener('click',()=>openFilm(chapter));$('#film-play').addEventListener('click',()=>filmPlaying?pauseFilm():playFilm());
function seekFilm(time){const wasPlaying=filmPlaying;pauseFilm();filmPosition=Math.max(0,Math.min(duration,time));if(hasVoice)voice.currentTime=filmPosition;syncMusic(filmPosition);renderFilm();if(filmPosition>=duration-.03){finishFilm();return;}if(wasPlaying)playFilm();}
$('#film-seek').addEventListener('input',event=>seekFilm(Number(event.target.value)));
$('#film-captions').addEventListener('click',()=>{captionsOn=!captionsOn;$('#film-captions').setAttribute('aria-pressed',String(captionsOn));captionIndex=-1;cancelAnimationFrame(filmFrame);renderFilm();});
for(let i=0;i<chapters.length;i++){const button=document.createElement('button');button.type='button';button.textContent=String(i+1).padStart(2,'0');button.dataset.filmChapter=String(i);button.setAttribute('aria-label',`Jump to ${chapters[i].title}`);button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>seekFilm(chapterStart(i)));$('.film-chapters').append(button);}
$('#film-fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(film.requestFullscreen)await film.requestFullscreen();else toast('Fullscreen is unavailable in this browser.');}catch{toast('Fullscreen is unavailable in this browser.');}});
voice.addEventListener('ended',()=>{if(film.open)finishFilm();});
film.addEventListener('close',()=>{pauseFilm();if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});if(beforeFilm){music.currentTime=beforeFilm.time;if(beforeFilm.playing)music.play().catch(()=>{});}duckMusic();});
film.addEventListener('keydown',event=>{if(event.code==='Space'&&event.target.tagName!=='INPUT'&&event.target.tagName!=='BUTTON'){event.preventDefault();filmPlaying?pauseFilm():playFilm();}});
refreshDuration();selectChapter(0);


// Motion remains optional: reduced-motion visitors get the complete static page.
document.documentElement.classList.add('js-ready');
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});$$('.reveal').forEach(element=>observer.observe(element));
const waveform=$('.waveform');for(let i=0;i<55;i++){const bar=document.createElement('i');bar.style.height=`${8+Math.abs(Math.sin(i*.7)*Math.cos(i*.17))*42}px`;waveform.append(bar);}
$$('.avatar-card').forEach(card=>{card.addEventListener('pointermove',event=>{if(reducedMotion.matches||event.pointerType==='touch')return;const rect=card.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width-.5;const y=(event.clientY-rect.top)/rect.height-.5;card.style.transform=`rotateY(${x*11}deg) rotateX(${-y*9}deg) translateZ(10px)`;});card.addEventListener('pointerleave',()=>card.style.transform='');});
const hero=$('.hero');hero.addEventListener('pointermove',event=>{if(reducedMotion.matches||event.pointerType==='touch')return;const rect=hero.getBoundingClientRect();$('.hero-art').style.transform=`translate(${(event.clientX/rect.width-.5)*10}px,${(event.clientY/rect.height-.5)*8}px) scale(1.015)`;});hero.addEventListener('pointerleave',()=>$('.hero-art').style.transform='');
function progress(){const total=document.documentElement.scrollHeight-innerHeight;$('.reading-progress').style.width=`${total>0?scrollY/total*100:0}%`;}addEventListener('scroll',progress,{passive:true});progress();
const canvas=$('#aura'),context=canvas.getContext('2d');let particles=[],width=0,height=0,particleFrame=0,auraVisible=true,lastParticleTime=0;
function sizeAura(){const rect=hero.getBoundingClientRect();width=rect.width;height=rect.height;const scale=Math.min(devicePixelRatio,1.5);canvas.width=width*scale;canvas.height=height*scale;context.setTransform(scale,0,0,scale,0,0);particles=Array.from({length:innerWidth<760?28:60},()=>({x:Math.random()*width,y:Math.random()*height,s:.5+Math.random()*1.8,speed:.1+Math.random()*.4,phase:Math.random()*7}));}
function drawAura(now){particleFrame=0;if(reducedMotion.matches||document.hidden||!auraVisible)return;const delta=Math.min(2,(now-lastParticleTime)/16.7||1);lastParticleTime=now;context.clearRect(0,0,width,height);for(const p of particles){p.y-=p.speed*delta;p.x+=Math.sin(now*.0003+p.phase)*.1*delta;if(p.y<0)p.y=height;context.globalAlpha=.2+(Math.sin(now*.001+p.phase)+1)*.25;context.fillStyle='#85fff5';context.shadowBlur=7;context.shadowColor='#40eaff';context.fillRect(p.x,p.y,p.s,p.s);}particleFrame=requestAnimationFrame(drawAura);}
function resumeAura(){if(!particleFrame&&!reducedMotion.matches&&!document.hidden&&auraVisible)particleFrame=requestAnimationFrame(drawAura);}
new IntersectionObserver(entries=>{auraVisible=entries[0].isIntersecting;resumeAura();}).observe(hero);document.addEventListener('visibilitychange',resumeAura);reducedMotion.addEventListener('change',resumeAura);addEventListener('resize',sizeAura);sizeAura();resumeAura();
