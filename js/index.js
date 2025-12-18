const inventory = document.getElementById("inventory");

window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "i") {
    // 대소문자 구분 없이
    e.preventDefault();
    if (inventory) {
      inventory.classList.toggle("active");
      if (inventory.classList.contains("active")) {
        // updateInventoryUI가 정의되어 있는지 확인
        if (typeof updateInventoryUI === "function") {
          updateInventoryUI();
        }
      }
    }
  }
});

window.addEventListener("load", () => {
  // ⭐ 처음 시작할 때 기본 무기(총) 설정
  if (!localStorage.getItem("equippedWeapon")) {
    localStorage.setItem("equippedWeapon", "총🔫");
  }

  // ⭐ 처음 시작할 때 철검 기본 제공
  const inventory = JSON.parse(localStorage.getItem("inventory")) || {};
  if (!inventory["철검🗡️"]) {
    inventory["철검🗡️"] = 1;
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }

  const transition = document.getElementById("pageTransition");

  if (!transition) return;

  // index1.html에서 온 경우 (이미 전환 애니메이션이 완료된 상태)
  // skipTransition 플래그를 확인하여 즉시 hidden으로 설정
  if (sessionStorage.getItem("skipTransition")) {
    // 즉시 hidden으로 설정하여 전환 애니메이션 건너뛰기
    transition.classList.add("hidden");
    // 플래그 제거 (다음 접속을 위해)
    sessionStorage.removeItem("skipTransition");
    return;
  }

  // 직접 index.html에 접속한 경우에만 전환 애니메이션 실행
  const sound = new Audio("sound/BboingTranform.mp3");
  sound.currentTime = 1;
  sound.play().catch((err) => console.log("사운드 재생 실패:", err));

  setTimeout(() => {
    transition.classList.add("hidden");
  }, 100);
});
