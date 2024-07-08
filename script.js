const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const playlist = $(".playlist");
const thumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const cdWidth = cd.offsetWidth;
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");

const repeat = $(".btn-repeat");
const next = $(".btn-next");
const prev = $(".btn-prev");
const random = $(".btn-random");

const songBanner = $(".song");

const app = {
  isPlaying: false,
  isOnRandom: false,
  isOnRepeat: false,
  currentIndex: 0,
  songs: [
    {
      name: "Ổ Quỷ",
      singer: "DMT",
      path: "./mp3/OQuy.mp3",
      img: "./img/OQuy.jpg",
    },
    {
      name: "Có Em",
      singer: "Low G, Madihu",
      path: "./mp3/CoEm.mp3",
      img: "./img/CoEm.jpg",
    },
    {
      name: "Thủ dô Cypher",
      singer: "Low G, MCK, Orijin",
      path: "./mp3/ThuDoCypher.mp3",
      img: "./img/ThuDoCypher.jpg",
    },
    {
      name: "Thủ dô Cypher",
      singer: "Low G, MCK, Orijin",
      path: "./mp3/ThuDoCypher.mp3",
      img: "./img/ThuDoCypher.jpg",
    },
    {
      name: "Thủ dô Cypher",
      singer: "Low G, MCK, Orijin",
      path: "./mp3/ThuDoCypher.mp3",
      img: "./img/ThuDoCypher.jpg",
    },
    {
      name: "Thủ dô Cypher",
      singer: "Low G, MCK, Orijin",
      path: "./mp3/ThuDoCypher.mp3",
      img: "./img/ThuDoCypher.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index == this.currentIndex ? "active" : ""
            }" data-index = "${index}">
            <div class="thumb"
                style="background-image: url('${song.img}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `;
    });
    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: () => {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    //Rotate cd on play
    const cdThumbAnimate = thumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      { duration: 10000, iterations: Infinity }
    );
    cdThumbAnimate.pause();

    //Resize CD on scroll
    document.onscroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;
      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      cd.style.opacity = newWidth / cdWidth;
    };

    //Play Audio events
    playBtn.onclick = () => {
      if (!app.isPlaying) {
        audio.play();
        cdThumbAnimate.play();
      } else {
        audio.pause();
        cdThumbAnimate.pause();
      }
    };

    audio.onplay = () => {
      player.classList.add("playing");
      app.isPlaying = true;
    };

    audio.onpause = () => {
      player.classList.remove("playing");
      app.isPlaying = false;
    };

    audio.onended = () => {
      if (this.isOnRepeat) audio.play();
      else next.click();
    };

    //Progress Bar Interact Events
    audio.ontimeupdate = () => {
      if (audio.duration)
        progress.value = Math.floor((audio.currentTime / audio.duration) * 100);
    };

    progress.onchange = (e) => {
      audio.currentTime = (e.target.value * audio.duration) / 100;
    };

    //Repeat Event
    repeat.onclick = () => {
      this.isOnRepeat = !this.isOnRepeat;
      repeat.classList.toggle("active", this.isOnRepeat);
      if (this.isOnRepeat == true && this.isOnRandom == true) random.click();
    };

    next.onclick = () => {
      if (this.isOnRandom) this.randomSong();
      else this.nextSong();
      this.render();
      audio.play();
      this.scrollToActivatedSong();
    };

    prev.onclick = () => {
      if (this.isOnRandom) this.randomSong();
      else this.prevSong();
      this.render();
      audio.play();
      this.scrollToActivatedSong();
    };

    random.onclick = () => {
      this.isOnRandom = !this.isOnRandom;
      random.classList.toggle("active", this.isOnRandom);
      if (this.isOnRepeat == true && this.isOnRandom == true) repeat.click();
    };

    playlist.onclick = (e) => {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          //console.log(songNode.getAttribute('data-index')); 1 cach
          this.currentIndex = songNode.dataset.index;
          this.loadCurrentSong();
          this.render();
          audio.play();
        }
      }
    };
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    thumb.style.backgroundImage = `url('${this.currentSong.img}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    this.currentIndex >= this.songs.length
      ? (this.currentIndex = 0)
      : this.currentIndex;
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    this.currentIndex < 0
      ? (this.currentIndex = this.songs.length - 1)
      : this.currentIndex;
    this.loadCurrentSong();
  },

  randomSong: function () {
    var newIndex = Math.floor(Math.random() * this.songs.length);
    while (newIndex == this.currentIndex) {
      console.log(newIndex);
      newIndex = Math.floor(Math.random() * this.songs.length);
    }
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  scrollToActivatedSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 400);
  },

  start: function () {
    //Định nghĩa thuộc tính
    this.defineProperties();

    //Quản lý sự kiện
    this.handleEvents();

    //Load bài hát hiện tại
    this.loadCurrentSong();

    this.scrollToActivatedSong();

    //Render UI
    this.render();
    console.log(songBanner);
  },
};

app.start();
