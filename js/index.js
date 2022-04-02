const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
songName = wrapper.querySelector(".song-details .name"),
songArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");




let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;
window.addEventListener("load", ()=>{
  loadMusic(musicIndex);
  playingSong(); 
});

//load music function
function loadMusic(indexNumb) {
  songName.innerText = allMusic[indexNumb -1].name;
  songArtist.innerText = allMusic[indexNumb -1].artist;
  musicImg.src = `img/${allMusic[indexNumb -1].img}.jpg`;
  mainAudio.src = `music/${allMusic[indexNumb -1].src}.mp3`;
}

// music play function
function playMusic() {
  wrapper.classList.add("paused")
  playPauseBtn.innerHTML = (` <i   class="fas fa-pause-circle"></i>`)
  mainAudio.play()
}

//music pause function
function pauseMusic() {
  wrapper.classList.remove("paused")
  playPauseBtn.innerHTML = (` <i   class="fas fa-play-circle"></i>`)
  mainAudio.pause()
}

// next song function
function nextPlay() {
  musicIndex++;
  musicIndex > allMusic.length ? musicIndex = 1: musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
}

//previous song function
function prevPlay() {
  musicIndex--;
  musicIndex < 1 ? musicIndex = allMusic.length: musicIndex = musicIndex
  loadMusic(musicIndex);
  playMusic();
}

// music play pause btn event
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused")
  isMusicPaused ? pauseMusic(): playMusic()
});

// next music btn event
nextBtn.addEventListener("click", () => {
  nextPlay();
})

//prev music btn event
prevBtn.addEventListener("click", () => {
  prevPlay();
})

// update music bar
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime //current time
  const duration = e.target.duration //total duration
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`
  let musicCurrentTime = wrapper.querySelector(".current")
  mainAudio.addEventListener("loadeddata", () => {

    let musicDuration = wrapper.querySelector(".duration")

    // updating total time
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60)
    let totalSec = Math.floor(audioDuration % 60)
    if (totalSec < 10) {
      `0${totalSec}`
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`
  });
  //updating current time
  let currentMin = Math.floor(currentTime / 60)
  let currentSec = Math.floor(currentTime % 60)
  if (currentSec < 10) {
    `0${currentSec}`
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`
});

// seek song according to progress bar
progressArea.addEventListener("click", (e) => {
  let progressWidthval = progressArea.clientWidth
  let clickedOffSetX = e.offsetX
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * 100
  playMusic();
});

// loop btn
const repeatBtn = wrapper.querySelector("#prepeat");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case 'repeat':
      repeatBtn.innerText = "repeat_one"
      repeatBtn.setAttribute("title", "song looped")
      break;
    case 'repeat_one':
      repeatBtn.innerText = "shuffle"
      repeatBtn.setAttribute("title", "playback shuffled")
      break;
    case 'shuffle':
      repeatBtn.innerText = "repeat"
      repeatBtn.setAttribute("title", "playlist looped")
      break;
  }
});

//loop function
mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case 'repeat':
      nextPlay();
      break;
    case 'repeat_one':
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case 'shuffle':
      let randIndex = Math.floor((Math.random() * allMusic.length) +1)
      do {
        randIndex = Math.floor((Math.random() * allMusic.length) +1)
      } while (musicIndex == randIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      break;
  }
});
// show hide functions
moreMusicBtn.addEventListener("click", ()=> {
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", ()=> {
  moreMusicBtn.click();
});
const ulTag = wrapper.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {
  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
  <div class="row">
  <span>${allMusic[i].name}</span>
  <p>${allMusic[i].artist}</p>
  </div>
  <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
  <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
  </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);
  
  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
  });
}
function playingSong(){
  const allLiTag = ulTag.querySelectorAll("li");
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }
    //if the li tag index is equal to the musicIndex then add playing class in it
    if(allLiTag[j].getAttribute("li-index") == musicIndex){
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }
    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}
//particular li clicked function
function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //updating current song index with clicked li index
  loadMusic(musicIndex);
  playMusic();
  playingSong();
};

 