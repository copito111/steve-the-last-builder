"""Recreate the original procedural score. Optional: Python, NumPy and FFmpeg.
No samples, third-party recordings or music APIs are used.
"""
from pathlib import Path
import numpy as np
import wave, subprocess, tempfile

SR=22050
DURATION=116
rng=np.random.default_rng(12042025)
mix=np.zeros((SR*DURATION,2),dtype=np.float64)
def note(midi):return 440*2**((midi-69)/12)
def add(sound,start,volume=.1,pan=0):
    offset=int(start*SR)
    if offset<0:return
    length=min(len(sound),len(mix)-offset)
    if length<=0:return
    left=np.sqrt((1-pan)/2);right=np.sqrt((1+pan)/2)
    mix[offset:offset+length,0]+=sound[:length]*volume*left
    mix[offset:offset+length,1]+=sound[:length]*volume*right
def pad(midi,seconds):
    t=np.arange(int(seconds*SR))/SR;f=note(midi)
    sound=sum(np.sin(2*np.pi*f*(1+d)*t+p)*a for d,p,a in [(-.002,0,.4),(.002,.7,.4),(0,1.1,.3)])
    sound+=.12*np.sin(4*np.pi*f*t)
    envelope=np.minimum(t/1.5,1)*np.minimum((seconds-t)/2.3,1)
    return sound*np.maximum(envelope,0)*(.9+.1*np.sin(t*.6))
def piano(midi,seconds=4):
    t=np.arange(int(seconds*SR))/SR;f=note(midi)
    return (np.sin(2*np.pi*f*t)*np.exp(-t*1.1)+.3*np.sin(4*np.pi*f*t)*np.exp(-t*2)+.09*np.sin(6*np.pi*f*t)*np.exp(-t*4))*np.minimum(t/.008,1)
def bell(midi,seconds=2):
    t=np.arange(int(seconds*SR))/SR;f=note(midi)
    return (np.sin(2*np.pi*f*t)+.16*np.sin(2*np.pi*f*2.003*t))*np.exp(-t*2)*np.minimum(t/.005,1)
def kick():
    t=np.arange(int(.65*SR))/SR
    return np.sin(2*np.pi*(42*t+60*.025*(1-np.exp(-t/.025))))*np.exp(-t*9)
def hit():
    n=rng.normal(0,1,int(.45*SR));t=np.arange(len(n))/SR
    return np.convolve(n,np.ones(7)/7,mode='same')*np.exp(-t*16)

# D minor / B-flat / F / C; the final section opens into F major.
progression=[[50,57,62,65],[46,53,58,62],[41,53,57,60],[48,55,60,64]]
for start in np.arange(0,96,8):
    chord=progression[int(start/8)%4]
    energy=.65 if start<24 else .9 if start<61 else 1.25 if start<95 else .8
    for i,midi in enumerate(chord):add(pad(midi,11),float(start),.035*energy,(i-1.5)*.36)
    add(pad(chord[0]-12,10),float(start),.055*energy,0)
for start,chord in [(96,[41,53,57,60]),(104,[46,53,58,62]),(110,[41,53,57,60,65])]:
    for i,midi in enumerate(chord):add(pad(midi,min(10,116-start)),start,.035,(i-2)*.3)

# Four-note ascending signature, first tentative, then clear and hopeful.
for start in [3,15,31,43,55,67,79,87,98,108]:
    motif=[62,65,69,74] if start<96 else [65,69,72,77]
    for i,midi in enumerate(motif):add(piano(midi,5),start+i*.85,.1 if start<61 else .13,(i-1.5)*.2)

beat=60/112
for start in np.arange(32,95,beat/2):
    chord=progression[min(int(start/8),11)%4]
    step=int((start-32)/(beat/2))
    midi=chord[step%4]+12
    intensity=.024 if start<61 else .047 if start<77 else .07
    add(bell(midi,1.8),float(start),intensity,(-1 if step%2 else 1)*.45)
for start in np.arange(24,95,beat):
    intensity=.07 if start<61 else .13 if start<77 else .19
    add(kick(),float(start),intensity)
    if int((start-24)/beat)%2:add(hit(),float(start),intensity*.36,.15)
for start in [61,77,85,94]:
    t=np.arange(int(3*SR))/SR
    n=rng.normal(0,1,len(t));low=np.convolve(n,np.ones(40)/40,mode='same')
    add(low*np.exp(-t*1.4),start,.25,-.2)

# Diffuse stereo echoes, followed by a gentle final fade.
dry=mix.copy()
for seconds,gain in [(.19,.13),(.37,.1),(.59,.07),(.83,.05), (1.13,.04)]:
    delay=int(seconds*SR);mix[delay:]+=dry[:-delay,::-1]*gain
fade=np.minimum(np.arange(len(mix))/SR/3,1)*np.minimum((DURATION-np.arange(len(mix))/SR)/5,1)
mix*=np.maximum(0,fade[:,None]);mix=np.tanh(mix*1.6)
mix*=.87/max(np.max(np.abs(mix)),.01)
pcm=(mix*32767).astype('<i2')
target=Path(__file__).resolve().parent.parent/'public/audio/worldheart-original.mp3'
with tempfile.TemporaryDirectory(prefix='worldheart-score-') as temp:
    wav=Path(temp)/'score.wav'
    with wave.open(str(wav),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes(pcm.tobytes())
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','160k','-metadata','title=Worldheart - Rise of the Builder','-metadata','artist=STEVE: The Last Builder','-metadata','comment=Original procedural instrumental; no third-party samples.',str(target)],check=True)
print('Created original 116-second instrumental:',target)
