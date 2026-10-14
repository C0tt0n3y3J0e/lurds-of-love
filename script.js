const tracks = [
  {
    title: "Deja Que Salga la Luna",
    artist: "Pedro Infante",
    cover: "assets/PedroInfante.jpg",
    audio: "assets/Pedro Infante - Deja Que Salga la Luna.mp3",
    dedication: "Cuando estoy entre tus brazos, siempre me pregunto yo; ¿Cúanto me debía el destino, que contigo, me pagó?",
    coverClass: "cover-art--one"
  },
  {
    title: "Contigo",
    artist: "Los Panchos",
    cover: "assets/Los_Panchos.jpg",
    audio: "assets/Los Panchos - Contigo.mp3",
    dedication: "Te puedo yo jurar ante un altar, que si te quiero; a todo mundo le puedes contar, que si te quiero.",
    coverClass: "cover-art--two"
  },
  {
    title: "Fix You",
    artist: "Coldplay",
    cover: "assets/Coldplay_–_X&Y_(cover).jpg",
    audio: "assets/Coldplay - Fix You.mp3",
    dedication: "Lights will guide you home, and ignite your bones, and I will try to fix you.",
    coverClass: "cover-art--three"
  },
  {
    title: "You're Pretty as a Picture",
    artist: "Al Bowlly",
    cover: "assets/Al_Bowlly.jpg",
    audio: "assets/Al Bowlly - You're as Pretty as a Picture - (256 Kbps).mp3",
    dedication: "You're the image of an angel from above. And you were just meant for me to adore.",
    coverClass: "cover-art--four"
  }
];

const letter = `Mi amor:

Si has llegado hasta aquí, quiero que sepas que cada canción de esta pequeña colección es apenas un intento de expresar algo que, por mucho que lo piense, nunca consigo explicar del todo.

A veces me pregunto cómo puede una persona llegar a significar tanto para otra. Cómo una conversación, una mirada o un instante compartido pueden quedarse en la memoria mucho después de haber terminado. Y entonces pienso en ti, y comprendo que hay sentimientos que no necesitan una explicación perfecta para ser verdaderos.

Te amo por lo que eres, por tu manera de mirar el mundo, por tu carácter, por esa firmeza que te hace ser tú y por todas esas pequeñas cosas que quizá ni siquiera imaginas que admiro. No quiero quererte solamente en los días sencillos, cuando todo parece hermoso, sino también en aquellos en los que la vida pesa un poco más y necesitamos paciencia, comprensión y compañía.

No pretendo que unas cuantas palabras puedan abarcar lo que siento por ti. Tampoco quiero que esta carta sea una promesa vacía de perfección. Prefiero ofrecerte algo más honesto: mi deseo de seguir conociéndote, escuchándote, respetándote y construyendo contigo recuerdos que algún día podamos mirar con ternura.

Si cada canción tiene una duración, un comienzo y un final, quisiera que lo nuestro no se midiera de esa manera. Quisiera que cada día nos encontrara con nuevas historias que contar, nuevos lugares por descubrir y nuevas razones para elegirnos libremente.

Por eso hice esta pequeña colección. Porque hay canciones que no sé dedicar sin pensar en ti, palabras que guardo demasiado tiempo y sentimientos que merecen salir de mi silencio, aunque sea por medio de una página hecha con mis propias manos.

Y si alguna vez vuelves a escuchar una de estas melodías, espero que recuerdes esto: en algún lugar de este mundo hay alguien que sonríe al pensar en ti, que agradece haberte encontrado y que encuentra en tu presencia una razón para hacer más bellos incluso los días ordinarios.

Con todo mi amor,

Daniel.`;

const welcome = document.querySelector("#welcome");
const collection = document.querySelector("#collection");
const letterSection = document.querySelector("#letterSection");
const enterButton = document.querySelector("#enterButton");
const showLetterButton = document.querySelector("#showLetterButton");
const backToCollectionButton = document.querySelector("#backToCollectionButton");
const revealLetterButton = document.querySelector("#revealLetterButton");
const trackList = document.querySelector("#trackList");
const audioPlayer = document.querySelector("#audioPlayer");
const vinyl = document.querySelector("#vinyl");
const tonearm = document.querySelector("#tonearm");
const recordLabel = document.querySelector("#recordLabel");
const statusMessage = document.querySelector("#statusMessage");
const currentNumber = document.querySelector("#currentNumber");
const currentTitle = document.querySelector("#currentTitle");
const currentArtist = document.querySelector("#currentArtist");
const playButton = document.querySelector("#playButton");
const pauseButton = document.querySelector("#pauseButton");
const previousButton = document.querySelector("#previousButton");
const nextButton = document.querySelector("#nextButton");
const progressBar = document.querySelector("#progressBar");
const elapsedTime = document.querySelector("#elapsedTime");
const durationTime = document.querySelector("#durationTime");
const volumeControl = document.querySelector("#volumeControl");
const dedicationText = document.querySelector("#dedicationText");
const listenedCounter = document.querySelector("#listenedCounter");
const effectsToggle = document.querySelector("#effectsToggle");
const letterText = document.querySelector("#letterText");

let currentTrackIndex = 0;
let listenedTracks = new Set();
let letterTimer = null;
let audioContext = null;

function formatTrackNumber(index) {
  return `Pista ${String(index + 1).padStart(2, "0")}`;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function playUiSound() {
  if (!effectsToggle.checked) {
    return;
  }

  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) {
    return;
  }

  audioContext = audioContext || new AudioEngine();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(520, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(260, audioContext.currentTime + 0.08);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.12);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.14);
}

function renderTracks() {
  const fragment = document.createDocumentFragment();

  tracks.forEach((track, index) => {
    const card = document.createElement("button");
    card.className = "track-card";
    card.type = "button";
    card.setAttribute("aria-label", `Seleccionar ${track.title}`);
    card.innerHTML = `
      <div class="cover-art ${track.coverClass}">
        <span>${track.title}</span>
      </div>
      <div class="track-meta">
        <span class="track-number">${formatTrackNumber(index)}</span>
        <h3>${track.title}</h3>
        <p>${track.artist}</p>
        <p>${track.dedication}</p>
      </div>
    `;
    card.addEventListener("click", () => selectTrack(index));
    fragment.appendChild(card);
  });

  trackList.appendChild(fragment);
}

function updateTrackCards() {
  const cards = trackList.querySelectorAll(".track-card");
  cards.forEach((card, index) => {
    card.classList.toggle("is-active", index === currentTrackIndex);
  });
}

function updateTrackView() {
  const track = tracks[currentTrackIndex];
  currentNumber.textContent = formatTrackNumber(currentTrackIndex);
  currentTitle.textContent = track.title;
  currentArtist.textContent = track.artist;
  recordLabel.textContent = track.title;
  dedicationText.textContent = track.dedication;
  progressBar.value = 0;
  elapsedTime.textContent = "0:00";
  durationTime.textContent = "0:00";
  audioPlayer.src = track.audio;
  audioPlayer.load();
  updateTrackCards();
}

function selectTrack(index, shouldPlay = false) {
  currentTrackIndex = index;
  audioPlayer.pause();
  setPlayingState(false);
  updateTrackView();
  statusMessage.textContent = `Has seleccionado "${tracks[index].title}".`;
  playUiSound();

  if (shouldPlay) {
    playCurrentTrack();
  }
}

function setPlayingState(isPlaying) {
  vinyl.classList.toggle("is-playing", isPlaying);
  tonearm.classList.toggle("is-lowered", isPlaying);
  playButton.setAttribute("aria-label", isPlaying ? "Reproduciendo" : "Reproducir");
}

async function playCurrentTrack() {
  const track = tracks[currentTrackIndex];

  try {
    await audioPlayer.play();
    setPlayingState(true);
    statusMessage.textContent = `Reproduciendo "${track.title}".`;
    listenedTracks.add(currentTrackIndex);
    updateListenedCounter();
    playUiSound();

    if (currentTrackIndex === tracks.length - 1) {
      statusMessage.textContent = "Gracias por escuchar esta pequeña parte de mi mundo.";
    }
  } catch (error) {
    setPlayingState(false);
    statusMessage.textContent = `Todavía debes añadir el archivo de audio para "${track.title}" en ${track.audio}.`;
  }
}

function pauseCurrentTrack() {
  audioPlayer.pause();
  setPlayingState(false);
  statusMessage.textContent = "La canción está en pausa.";
  playUiSound();
}

function goToTrack(direction) {
  const nextIndex = (currentTrackIndex + direction + tracks.length) % tracks.length;
  const wasPlaying = !audioPlayer.paused && !audioPlayer.ended;
  selectTrack(nextIndex, wasPlaying);
}

function updateProgress() {
  if (!Number.isFinite(audioPlayer.duration) || audioPlayer.duration === 0) {
    return;
  }

  progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  elapsedTime.textContent = formatTime(audioPlayer.currentTime);
  durationTime.textContent = formatTime(audioPlayer.duration);
}

function seekTrack() {
  if (!Number.isFinite(audioPlayer.duration) || audioPlayer.duration === 0) {
    progressBar.value = 0;
    return;
  }

  audioPlayer.currentTime = (Number(progressBar.value) / 100) * audioPlayer.duration;
}

function updateListenedCounter() {
  const count = listenedTracks.size;
  listenedCounter.textContent = count === 1 ? "1 pista escuchada" : `${count} pistas escuchadas`;
}

function showCollection() {
  welcome.hidden = true;
  collection.hidden = false;
  collection.scrollIntoView({ behavior: "smooth", block: "start" });
  playUiSound();
}

function startLetterAnimation() {
  clearInterval(letterTimer);
  letterText.textContent = "";
  letterText.classList.remove("is-complete");
  revealLetterButton.hidden = false;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    revealFullLetter();
    return;
  }

  let index = 0;
  letterTimer = setInterval(() => {
    letterText.textContent += letter[index] || "";
    index += 1;

    if (index >= letter.length) {
      clearInterval(letterTimer);
      letterText.classList.add("is-complete");
      revealLetterButton.hidden = true;
    }
  }, 18);
}

function revealFullLetter() {
  clearInterval(letterTimer);
  letterText.textContent = letter;
  letterText.classList.add("is-complete");
  revealLetterButton.hidden = true;
}

function showLetter() {
  audioPlayer.pause();
  setPlayingState(false);
  collection.hidden = true;
  letterSection.hidden = false;
  letterSection.scrollIntoView({ behavior: "smooth", block: "start" });
  startLetterAnimation();
  playUiSound();
}

function backToCollection() {
  clearInterval(letterTimer);
  letterSection.hidden = true;
  collection.hidden = false;
  collection.scrollIntoView({ behavior: "smooth", block: "start" });
  playUiSound();
}

enterButton.addEventListener("click", showCollection);
playButton.addEventListener("click", playCurrentTrack);
pauseButton.addEventListener("click", pauseCurrentTrack);
previousButton.addEventListener("click", () => goToTrack(-1));
nextButton.addEventListener("click", () => goToTrack(1));
progressBar.addEventListener("input", seekTrack);
volumeControl.addEventListener("input", () => {
  audioPlayer.volume = Number(volumeControl.value);
});
showLetterButton.addEventListener("click", showLetter);
backToCollectionButton.addEventListener("click", backToCollection);
revealLetterButton.addEventListener("click", revealFullLetter);

audioPlayer.addEventListener("timeupdate", updateProgress);
audioPlayer.addEventListener("loadedmetadata", updateProgress);
audioPlayer.addEventListener("pause", () => setPlayingState(false));
audioPlayer.addEventListener("play", () => setPlayingState(true));
audioPlayer.addEventListener("ended", () => {
  setPlayingState(false);
  goToTrack(1);
});
audioPlayer.addEventListener("error", () => {
  setPlayingState(false);
  statusMessage.textContent = `Todavía debes añadir el archivo de audio para "${tracks[currentTrackIndex].title}" en ${tracks[currentTrackIndex].audio}.`;
});

renderTracks();
updateTrackView();
audioPlayer.volume = Number(volumeControl.value);
