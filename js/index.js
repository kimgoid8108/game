const inventory = document.getElementById("inventory");

window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "i") {
    // 대소문자 구분 없이
    e.preventDefault();
    inventory.classList.toggle("active");
    if (inventory.classList.contains("active")) {
      updateInventoryUI();
    }
  }
});

window.addEventListener("load", () => {
  const transition = document.getElementById("pageTransition");

  // 사운드 파일 경로 수정 (예시)
  const sound = new Audio("sound/BboingTranform.mp3");
  sound.currentTime = 1;
  sound.play().catch((err) => console.log("사운드 재생 실패:", err));

  setTimeout(() => {
    transition.classList.add("hidden");
  }, 100);
});
