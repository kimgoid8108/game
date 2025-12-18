// 몬스터 요소 가져오기
const monster = document.getElementById("GreenMonster");
if (!monster) {
  // 몬스터가 없으면 종료
  console.warn("GreenMonster를 찾을 수 없습니다.");
}

let monsterHp = monster ? parseInt(monster.getAttribute("data-hp")) : 0;
let monsterMaxHp = monster ? parseInt(monster.getAttribute("data-max-hp")) : 0;
let heroAttack = 5;

let canAttack = true;

// ⭐ 몬스터 데이터 가져오기 (골드/경험치용)
let monsterGold = monster ? parseInt(monster.getAttribute("data-gold")) || 50 : 50;
let monsterExp = monster ? parseInt(monster.getAttribute("data-exp")) || 30 : 30;
let monsterName = monster ? monster.getAttribute("data-name") || "몬스터" : "몬스터";

// ⭐ HP 바는 monsterAttack.js에서 관리하므로 여기서는 생성하지 않음

// ⭐ 몬스터 처치 함수
function handleMonsterKill() {
  if (!monster) return;

  // 골드 획득
  let playerGold = parseInt(localStorage.getItem("playerGold")) || 0;
  playerGold += monsterGold;
  localStorage.setItem("playerGold", playerGold);

  const goldDisplay = document.getElementById("gold");
  const goldAmount = document.getElementById("goldAmount");
  if (goldDisplay) {
    goldDisplay.textContent = `골드: ${playerGold}G`;
  }
  if (goldAmount) {
    goldAmount.textContent = playerGold;
  }

  // 경험치 획득
  let playerExp = parseInt(localStorage.getItem("playerExp")) || 0;
  let playerLevel = parseInt(localStorage.getItem("playerLevel")) || 1;
  playerExp += monsterExp;
  localStorage.setItem("playerExp", playerExp);

  const expDisplay = document.getElementById("EXP");
  const expMax = document.getElementById("expMax");
  const levelDisplay = document.getElementById("level");
  if (expDisplay) {
    const expNeeded = playerLevel * 100;
    expDisplay.textContent = playerExp;
    if (expMax) {
      expMax.textContent = expNeeded;
    }
  }
  // ⭐ 레벨 표시 업데이트
  if (levelDisplay) {
    levelDisplay.textContent = playerLevel;
  }

  // 레벨업 체크
  const expNeeded = playerLevel * 100;
  if (playerExp >= expNeeded) {
    playerLevel++;
    playerExp -= expNeeded;
    localStorage.setItem("playerLevel", playerLevel);
    localStorage.setItem("playerExp", playerExp);

    if (expDisplay) {
      const newExpNeeded = playerLevel * 100;
      expDisplay.textContent = playerExp;
      if (expMax) {
        expMax.textContent = newExpNeeded;
      }
    }
    // ⭐ 레벨 표시 업데이트
    if (levelDisplay) {
      levelDisplay.textContent = playerLevel;
    }

    // 하단 UI 업데이트
    if (typeof window.updateBottomUI === "function") {
      window.updateBottomUI();
    }

    if (typeof window.showLevelUpNotification === "function") {
      window.showLevelUpNotification(playerLevel);
    }
  }

  // 알림 메시지 (박스 형식)
  if (typeof window.showRewardNotification === "function") {
    window.showRewardNotification(monsterGold, monsterExp, monsterName);
  }

  // 사운드 재생
  const deathSound = new Audio("sound/monsterDeath.mp3");
  deathSound.currentTime = 0;
  deathSound.play().catch((err) => console.log("사운드 재생 실패:", err));

  // 몬스터 사라짐 효과
  if (monster) {
    monster.style.opacity = "0";
    monster.style.transition = "opacity 0.5s";

    setTimeout(() => {
      monster.style.display = "none";
    }, 500);
  }

  // 10초 후 몬스터 리젠
  setTimeout(() => {
    if (monster) {
      monsterHp = monsterMaxHp;
      monster.setAttribute("data-hp", monsterHp);
      monster.style.display = "block";
      monster.style.opacity = "1";

      // monsterAttack.js의 monsterAI.isDead를 false로 설정하여 HP 바가 다시 나타나도록 함
      if (window.monsterAI) {
        window.monsterAI.isDead = false;
      }

      // HP 바 업데이트 강제 실행
      if (typeof window.updateMonsterUI === "function") {
        window.updateMonsterUI();
      }
    }
  }, 10000);
}

window.addEventListener("keydown", (e) => {
  const activeMap = document.querySelector(".map.active");
  const hero = document.getElementById("Hero");
  if (!activeMap || !hero) return;
  activeMap.appendChild(hero);
  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------
  // 방향키로 방향 전환
  if (e.key == "ArrowLeft" || e.key == "a") {
    hero.classList.remove("facing-right");
    hero.style.transform = "translate(-50%, -50%) scaleX(1)"; // 왼쪽 보기
  } else if (e.key == "ArrowRight" || e.key == "d") {
    hero.classList.add("facing-right");
    hero.style.transform = "translate(-50%, -50%) scaleX(-1)"; // 오른쪽 보기 (이미지가 기본적으로 왼쪽을 보고 있음)
  }

  // 공격 ([방향키 이동시]Z 또는 [WASD 이동시] J 키)
  if (e.key.toLowerCase() === "z" || e.key.toLowerCase() === "j") {
    // ⭐ 죽었을 때 공격 불가능
    const hpElement = document.getElementById("HP");
    if (hpElement) {
      const currentHp = parseInt(hpElement.textContent) || 100;
      if (currentHp <= 0) {
        return; // HP가 0 이하면 공격 불가
      }
    }

    // 전역 플래그 확인 (monsterAttack.js에서 설정)
    if (window.heroIsDead === true) {
      return; // 히어로가 죽었으면 공격 불가
    }

    // 쿨타임 체크
    if (!canAttack) return;
    canAttack = false;

    // 현재 장착된 무기 확인 (기본값: 총)
    const equippedWeapon = localStorage.getItem("equippedWeapon") || "총🔫";
    const isSwordEquipped = equippedWeapon === "철검🗡️";
    const isGunEquipped = equippedWeapon === "총🔫" || !equippedWeapon;

    // 현재 방향 확인 (왼쪽이면 -1, 오른쪽이면 1)
    const currentScale = hero.classList.contains("facing-right") ? 1 : -1;
    const isFacingRight = hero.classList.contains("facing-right");

    if (isSwordEquipped) {
      // ⚔️ 검 공격 - 휘두르는 이펙트
      // 현재 transform 값 저장 (방향 정보)
      const currentTransform = hero.style.transform || "";
      const isFlipped = currentTransform.includes("scaleX(-1)");
      hero.style.setProperty("--hero-scale", isFacingRight ? "-1" : "1");
      hero.classList.add("sword-swing");

      // 검 휘두르는 사운드 (총알 사운드 대신)
      const swordSound = new Audio("sound/gunSound.mp3"); // 임시로 같은 사운드 사용
      swordSound.currentTime = 0;
      swordSound.play().catch((err) => console.log("사운드 재생 실패:", err));

      // 검 휘두르는 애니메이션
      const swordEffect = document.createElement("div");
      swordEffect.className = "sword-effect";
      swordEffect.style.position = "absolute";
      swordEffect.style.width = "80px";
      swordEffect.style.height = "80px";
      swordEffect.style.background = "linear-gradient(45deg, rgba(255,255,255,0.8), rgba(200,200,200,0.6))";
      swordEffect.style.borderRadius = "50%";
      swordEffect.style.pointerEvents = "none";
      swordEffect.style.zIndex = "15";
      swordEffect.style.transformOrigin = "center";

      const heroRect = hero.getBoundingClientRect();
      const containerRect = hero.parentElement.getBoundingClientRect();

      const startX = heroRect.left - containerRect.left + heroRect.width / 2;
      const startY = heroRect.top - containerRect.top + heroRect.height / 2;

      swordEffect.style.left = startX + (isFacingRight ? 20 : -100) + "px";
      swordEffect.style.top = startY - 40 + "px";

      hero.parentElement.appendChild(swordEffect);

      // 검 이펙트 애니메이션
      let angle = isFacingRight ? -45 : 45;
      let scale = 1;
      const swingInterval = setInterval(() => {
        angle += isFacingRight ? 15 : -15;
        scale -= 0.05;
        swordEffect.style.transform = `rotate(${angle}deg) scale(${scale})`;
        swordEffect.style.opacity = scale;

        if (scale <= 0) {
          clearInterval(swingInterval);
          swordEffect.remove();
        }
      }, 20);

      // 검 공격 범위 체크 (원형 범위)
      setTimeout(() => {
        const monsterRect = monster.getBoundingClientRect();
        const heroRect = hero.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow(monsterRect.left + monsterRect.width / 2 - (heroRect.left + heroRect.width / 2), 2) +
          Math.pow(monsterRect.top + monsterRect.height / 2 - (heroRect.top + heroRect.height / 2), 2)
        );

        if (distance < 80 && monster) { // 검 공격 범위
          // 몬스터 hp 감소
          monsterHp -= heroAttack * 2; // 검은 공격력 2배
          if (monsterHp < 0) monsterHp = 0;

          // 몬스터 데이터 업데이트
          monster.setAttribute("data-hp", monsterHp);

          // monsterAttack.js의 damageMonster 함수 호출 (HP 바 업데이트용)
          if (typeof window.damageMonster === "function") {
            window.damageMonster(heroAttack * 2);
          }

          const originalfilter = monster.style.filter;
          monster.style.filter =
            "brightness(1.5) sepia(1) saturate(5) hue-rotate(-50deg)";

          setTimeout(() => {
            monster.style.filter = originalfilter;
          }, 200);

          if (monsterHp <= 0) {
            // 몬스터 처치 - 골드/경험치 지급
            handleMonsterKill();
          }
        }
      }, 100);

      // 애니메이션 제거
      setTimeout(() => {
        hero.classList.remove("sword-swing");
      }, 300);

      // 0.5초 쿨타임 (검은 더 느림)
      setTimeout(() => {
        canAttack = true;
      }, 500);
    } else if (isGunEquipped || !isSwordEquipped) {
      // 🔫 총 공격 - 총알 발사
      const shootSound = new Audio("sound/gunSound.mp3");
      shootSound.currentTime = 0;
      shootSound.play().catch((err) => console.log("사운드 재생 실패:", err));

      // 0.3초 쿨타임
      setTimeout(() => {
        canAttack = true;
      }, 300);

      // 총알
      const projectile = document.createElement("div");
      projectile.textContent = "⏺︎";
      projectile.style.position = "absolute";
      projectile.style.fontSize = "10px";

      // 히어로 위치에서 시작
      const heroRect = hero.getBoundingClientRect();
      const containerRect = hero.parentElement.getBoundingClientRect();

      projectile.style.left =
        heroRect.left - containerRect.left + heroRect.width / 2 + "px";
      projectile.style.top =
        heroRect.top - containerRect.top + heroRect.height / 3.2 + "px";

      hero.parentElement.appendChild(projectile);

      // 공격하면서 이동
      let projectileX = heroRect.left - containerRect.left + heroRect.width / 2;
      const startX = projectileX; // 시작 위치 저장

      const moveInterval = setInterval(() => {
        projectileX += 10 * currentScale; // 방향에 따라 이동
        projectile.style.left = projectileX + "px";

        // 히어로 공격 범위 설정
        if (Math.abs(projectileX - startX) > 100) {
          clearInterval(moveInterval);
          projectile.remove();
          return;
        }
        // -----------------------------------------------------------------------

        // -----------------------------------------------------------------------
        // 몬스터 히트박스 설정
        const monsterRect = monster.getBoundingClientRect();
        const projectileRect = projectile.getBoundingClientRect();

        const hitboxPadding = 1;

        if (
          projectileRect.left < monsterRect.right - hitboxPadding &&
          projectileRect.right > monsterRect.left + hitboxPadding &&
          projectileRect.top < monsterRect.bottom - hitboxPadding &&
          projectileRect.bottom > monsterRect.top + hitboxPadding
        ) {
          // 몬스터 hp 감소
          monsterHp -= heroAttack;
          if (monsterHp < 0) monsterHp = 0;

          // 몬스터 데이터 업데이트
          if (monster) {
            monster.setAttribute("data-hp", monsterHp);
          }

          // monsterAttack.js의 damageMonster 함수 호출 (HP 바 업데이트용)
          if (typeof window.damageMonster === "function") {
            window.damageMonster(heroAttack);
          }

          const originalfilter = monster ? monster.style.filter : "";
          if (monster) {
            monster.style.filter =
              "brightness(1.5) sepia(1) saturate(5) hue-rotate(-50deg)";

            setTimeout(() => {
              monster.style.filter = originalfilter;
            }, 200);
          }

          if (monsterHp <= 0) {
            // 몬스터 처치 - 골드/경험치 지급
            handleMonsterKill();
          }

          // 발사체 제거
          clearInterval(moveInterval);
          projectile.remove();
        }
      }, 20);
    }
  }
});
