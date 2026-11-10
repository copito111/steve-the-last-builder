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

// Original locally hosted score: no third-party music service or autoplay.
const music=$('#music');const voice=$('#voice');
let musicLevel=.35, hasVoice=false, voiceKind='none', objectUrl=null;
music.volume=musicLevel;
function updateSoundUI(){const playing=!music.paused;$('#music-toggle').textContent=playing?'Ⅱ':'▶';$('#music-toggle').setAttribute('aria-label',playing?'Pause background music':'Play background music');$('#music-toggle').setAttribute('aria-pressed',String(playing));$('#header-sound').setAttribute('aria-pressed',String(playing));$('#header-sound').lastElementChild.textContent=playing?'Sound on':'Sound off';$('.audio-dock').classList.toggle('playing',playing);}
function duckMusic(){music.volume=musicLevel*(hasVoice&&!voice.paused?.32:1);}
async function toggleMusic(){if(!music.paused)music.pause();else try{await music.play();}catch{toast('The soundtrack could not play. Try again in a moment.');}}
$('#music-toggle').addEventListener('click',toggleMusic);$('#header-sound').addEventListener('click',toggleMusic);
music.addEventListener('play',updateSoundUI);music.addEventListener('pause',updateSoundUI);music.addEventListener('error',()=>toast('The soundtrack could not load. Please refresh the page.'));
$('#music-volume').addEventListener('input',event=>{musicLevel=Number(event.target.value);duckMusic();});
['play','pause','ended'].forEach(event=>voice.addEventListener(event,duckMusic));

// Private voice uploads persist in IndexedDB, never leave the visitor's browser.
async function voiceDB(action,value){return new Promise((resolve,reject)=>{const request=indexedDB.open('worldheart-voice',1);request.onupgradeneeded=()=>request.result.createObjectStore('recordings');request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result;const tx=db.transaction('recordings',action==='get'?'readonly':'readwrite');const store=tx.objectStore('recordings');const operation=action==='get'?store.get('narration'):action==='put'?store.put(value,'narration'):store.delete('narration');operation.onsuccess=()=>resolve(operation.result);tx.oncomplete=()=>db.close();tx.onerror=()=>reject(tx.error);};});}
async function setVoice(file,{persist=true,restored=false}={}) {
 if(!file)return;
 if(file.size>50*1024*1024){toast('Please choose an audio file smaller than 50 MB.');return;}
 if(!file.type.startsWith('audio/')&&!/\.(mp3|wav|m4a|ogg|webm|aac|flac)$/i.test(file.name||'')){toast('Please choose a supported audio file.');return;}
 if($('#film-dialog').open)$('#film-dialog').close();
 const oldUrl=objectUrl;objectUrl=URL.createObjectURL(file);voice.pause();voice.src=objectUrl;voice.load();
 try{await new Promise((resolve,reject)=>{voice.addEventListener('loadedmetadata',resolve,{once:true});voice.addEventListener('error',reject,{once:true});});}
 catch{URL.revokeObjectURL(objectUrl);objectUrl=null;hasVoice=false;voice.hidden=true;$('#remove-voice').hidden=true;toast('This recording could not be decoded. Try MP3 or WAV.');$('#voice-status').textContent='Unsupported audio. Choose another recording.';return;}
 if(oldUrl)URL.revokeObjectURL(oldUrl);hasVoice=true;voiceKind='private';voice.hidden=false;$('#remove-voice').hidden=false;$('#voice-file-label').textContent=file.name||'Your narration';
 $('#voice-status').textContent=restored?'Your saved recording is ready. It stays private in this browser.':'Your recording is ready. It stays private in this browser.';
 if(persist)try{await voiceDB('put',{blob:file,name:file.name});}catch{$('#voice-status').textContent='Recording ready for this visit. This browser could not save it for later.';}
}
$('#voice-file').addEventListener('change',event=>setVoice(event.target.files[0]));
const dropZone=$('#drop-zone');['dragenter','dragover'].forEach(name=>dropZone.addEventListener(name,event=>{event.preventDefault();dropZone.classList.add('dragover');}));['dragleave','drop'].forEach(name=>dropZone.addEventListener(name,event=>{event.preventDefault();dropZone.classList.remove('dragover');}));dropZone.addEventListener('drop',event=>setVoice(event.dataTransfer.files[0]));
$('#remove-voice').addEventListener('click',async()=>{if($('#film-dialog').open)$('#film-dialog').close();voice.pause();voice.removeAttribute('src');voice.load();voice.hidden=true;hasVoice=false;voiceKind='none';if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=null;$('#remove-voice').hidden=true;$('#voice-file').value='';$('#voice-file-label').textContent='Choose your narration';$('#voice-status').textContent='Recording removed from this browser.';try{await voiceDB('delete');}catch{}await loadPublishedVoice();duckMusic();});
async function loadPublishedVoice(){try{const response=await fetch('/audio/narration.mp3',{method:'HEAD'});if(response.ok&&response.headers.get('content-type')?.startsWith('audio/')){voice.src='/audio/narration.mp3';voice.load();hasVoice=true;voiceKind='published';voice.hidden=false;$('#voice-status').textContent='The creator’s narration is ready. You can also preview your own recording.';}}catch{}}
async function restoreVoice(){try{const saved=await voiceDB('get');if(saved?.blob){const file=new File([saved.blob],saved.name||'Your saved narration',{type:saved.blob.type});await setVoice(file,{persist:false,restored:true});return;}}catch{}await loadPublishedVoice();}restoreVoice();

// The cinematic player is a timed still-image documentary, with optional voice.
const film=$('#film-dialog');let filmPosition=0,filmStart=0,filmPlaying=false,filmChapter=-1,filmFrame=0,beforeFilm=null;
const duration=116;
const timecode=seconds=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
function currentFilmTime(){return Math.min(duration,filmPlaying?filmPosition+(performance.now()-filmStart)/1000:filmPosition);}
function renderFilm(){const time=currentFilmTime();let index=chapters.findLastIndex(item=>time>=item.start);if(index<0)index=0;if(index!==filmChapter){filmChapter=index;const item=chapters[index];$('#film-image').src=`/images/${item.image}.webp`;$('#film-image').alt=item.alt;$('#film-date').textContent=item.date.toUpperCase();$('#film-title').textContent=item.title;$('#film-description').textContent=item.description;}$('#film-time').textContent=`${timecode(time)} / 01:56`;$('#film-seek').value=String(time);if(time>=duration&&filmPlaying){pauseFilm();$('#film-play').setAttribute('aria-label','Replay cinematic story');$('#film-play').textContent='↻';}if(filmPlaying)filmFrame=requestAnimationFrame(renderFilm);}
async function playFilm(){if(filmPosition>=duration)filmPosition=0;filmStart=performance.now();filmPlaying=true;$('#film-play').textContent='Ⅱ';$('#film-play').setAttribute('aria-label','Pause cinematic story');music.currentTime=filmPosition%Math.max(1,music.duration||duration);try{await music.play();}catch{toast('Tap Sound on to enable the soundtrack.');}if(hasVoice&&filmPosition<(voice.duration||Infinity)){voice.currentTime=filmPosition;try{await voice.play();}catch{toast('Your recording could not play. Try another audio format.');}}duckMusic();cancelAnimationFrame(filmFrame);renderFilm();}
function pauseFilm(){filmPosition=currentFilmTime();filmPlaying=false;cancelAnimationFrame(filmFrame);music.pause();voice.pause();$('#film-play').textContent='▶';$('#film-play').setAttribute('aria-label','Resume cinematic story');}
function openFilm(){if(film.open)return;beforeFilm={playing:!music.paused,time:music.currentTime};voice.pause();filmPosition=0;filmChapter=-1;film.showModal();$('#film-voice-label').textContent=hasVoice?(voiceKind==='private'?'YOUR VOICE + ORIGINAL SCORE':'CREATOR NARRATION + ORIGINAL SCORE'):'INSTRUMENTAL · ADD YOUR VOICE BELOW';playFilm();}
$('#watch-film').addEventListener('click',openFilm);$('#preview-narration').addEventListener('click',openFilm);$('#film-play').addEventListener('click',()=>filmPlaying?pauseFilm():playFilm());
$('#film-seek').addEventListener('input',event=>{const wasPlaying=filmPlaying;pauseFilm();filmPosition=Number(event.target.value);renderFilm();if(wasPlaying)playFilm();else{music.currentTime=filmPosition;if(hasVoice)voice.currentTime=Math.min(filmPosition,voice.duration||0);}});
$('#film-fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(film.requestFullscreen)await film.requestFullscreen();else toast('Fullscreen is unavailable in this browser.');}catch{toast('Fullscreen is unavailable in this browser.');}});
film.addEventListener('close',()=>{pauseFilm();if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});if(beforeFilm){music.currentTime=beforeFilm.time;if(beforeFilm.playing)music.play().catch(()=>{});}duckMusic();});
film.addEventListener('keydown',event=>{if(event.code==='Space'&&event.target.tagName!=='INPUT'&&event.target.tagName!=='BUTTON'){event.preventDefault();filmPlaying?pauseFilm():playFilm();}});

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
