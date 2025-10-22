// 요소들 가져오기
const elements = [
  document.getElementById("heros"), // hero
  document.querySelector(".monsters1"),
  document.querySelector(".monsters2"),
  document.querySelector(".monsters3"),
  document.querySelector(".monsters4"),
  document.querySelector("#gameTitle"),
];

// 각 요소 시작 위치(top)와 최종 위치
const positions = [
  { start: 610, target: 300 }, // hero
  { start: 610, target: 200 }, // monsters 첫번째
  { start: 610, target: 200 }, // monsters1 두번째
  { start: 610, target: 200 }, // monsters2 세번째
  { start: 610, target: -30 }, // monsters3 대빵
  { start: 610, target: 100 }, // monsters4 첫번째
];

// 사운드 파일 (첫 번째는 비워두고 두 번째부터 실제 재생)
const sounds = [
  new Audio("sound/spinned1.mp3"), // hero (첫 사운드 비워)
  new Audio("sound/spinned2.mp3"),
  new Audio("sound/spinned3.mp3"),
  new Audio("sound/spinned4.mp3"),
  new Audio("sound/spinned5.mp3"),
  new Audio("sound/spinned6.mp3"),
];

// 볼륨 설정
sounds.forEach((audio, idx) => {
  if (audio.src) audio.volume = 0.8;
});

const bounceAmplitude = 15; // 위아래 흔들림 정도
const duration = 800; // 애니메이션 시간(ms)

async function popUpSequence() {
  for (let i = 0; i < elements.length; i++) {
    await animateBounce(
      elements[i],
      positions[i].start,
      positions[i].target,
      sounds[i]
    );
    // 다음 요소를 잠시 기다린 후 등장
    await new Promise((r) => setTimeout(r, 300));
  }
}

// 위아래 튀어오르는 애니메이션 함수
function animateBounce(el, startTop, targetTop, audio) {
  if (audio.src) {
    audio.currentTime = 0;
    audio.play().catch((err) => console.log("사운드 재생 실패:", err));
  }

  return new Promise((resolve) => {
    const startTime = performance.now();

    function animate(time) {
      let t = (time - startTime) / duration;
      if (t > 1) t = 1;

      // easeOutCubic
      const ease = 1 - Math.pow(1 - t, 3);

      // sine으로 위아래 튀기기
      const bounce = Math.sin(t * Math.PI * 4) * bounceAmplitude * (1 - t);

      el.style.top = startTop - (startTop - targetTop) * ease - bounce + "px";

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        el.style.top = targetTop + "px";
        resolve();
      }
    }

    requestAnimationFrame(animate);
  });
}

// 페이지 로드 시 자동 실행
window.addEventListener("load", () => {
  setTimeout(popUpSequence, 500);
});

setTimeout(() => {
  const menu = document.getElementById("menu");
  menu.style.display = "block";
  menu.classList.add("show"); // opacity 1로 부드럽게
}, 7000);

const startBtn = document.getElementById("start");
const transition = document.getElementById("pageTransition");
const sound = new Audio("sound/Bboing.mp3"); // 원하는 사운드 파일

startBtn.addEventListener("click", () => {
  // 1️⃣ 사운드 재생
  sound.currentTime = 0; // 시작 위치 초기화
  sound.play().catch((err) => console.log("사운드 재생 실패:", err));

  // 2️⃣ 중앙에서 펼치기 시작
  transition.classList.add("active");

  // 3️⃣ 애니메이션 끝난 후 페이지 이동
  setTimeout(() => {
    window.location.href = "index.html";
  }, 800); // CSS transition 시간과 동일
});

const loadTap = document.querySelector("#loadTap");
const close = document.querySelector("#close");

load.addEventListener("click", () => {
  loadTap.style.display = "flex"; // 먼저 보이게
  setTimeout(() => {
    loadTap.classList.add("show"); // scale 1, opacity 1로
  }, 50); // 브라우저 렌더링 시간
});

close.addEventListener("click", () => {
  loadTap.classList.remove("show"); // 다시 가운데로 모여 사라짐
  setTimeout(() => {
    loadTap.style.display = "none"; // 완료 후 display none
  }, 500); // 트랜지션 시간과 맞춤
});
