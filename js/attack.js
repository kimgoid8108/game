// ⭐ 모든 몬스터 요소 가져오기
const monsterIds = ["GreenMonster"]; // "Monster", "blueMonster", "BigBossMonster" 주석처리
let monsters = {};
monsterIds.forEach(id => {
  const m = document.getElementById(id);
  if (m) {
    monsters[id] = {
      element: m,
      hp: parseInt(m.getAttribute("data-hp")) || 0,
      maxHp: parseInt(m.getAttribute("data-max-hp")) || 0,
      gold: parseInt(m.getAttribute("data-gold")) || 50,
      exp: parseInt(m.getAttribute("data-exp")) || 30,
      name: m.getAttribute("data-name") || "몬스터"
    };
  }
});

let heroAttack = 5;
let canAttack = true;

// ⭐ 가장 가까운 몬스터 찾기 함수
function findNearestMonster(heroRect) {
  let nearestMonster = null;
  let minDistance = Infinity;

  Object.keys(monsters).forEach(id => {
    const m = monsters[id];
    if (!m.element || m.element.style.display === "none" || m.hp <= 0) return;

    const monsterRect = m.element.getBoundingClientRect();
    const distance = Math.sqrt(
      Math.pow(monsterRect.left + monsterRect.width / 2 - (heroRect.left + heroRect.width / 2), 2) +
      Math.pow(monsterRect.top + monsterRect.height / 2 - (heroRect.top + heroRect.height / 2), 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestMonster = m;
      nearestMonster.id = id;
    }
  });

  return nearestMonster;
}

// ⭐ HP 바는 monsterAttack.js에서 관리하므로 여기서는 생성하지 않음

// ⭐ 몬스터 처치 함수
function handleMonsterKill(monsterData) {
  if (!monsterData) return;

  // 골드 획득
  let playerGold = parseInt(localStorage.getItem("playerGold")) || 0;
  playerGold += monsterData.gold;
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
  playerExp += monsterData.exp;
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
    window.showRewardNotification(monsterData.gold, monsterData.exp, monsterData.name);
  }

  // 사운드 재생
  const deathSound = new Audio("sound/monsterDeath.mp3");
  deathSound.currentTime = 0;
  deathSound.play().catch((err) => console.log("사운드 재생 실패:", err));

  // 몬스터 사라짐 효과
  if (monsterData.element) {
    monsterData.element.style.opacity = "0";
    monsterData.element.style.transition = "opacity 0.5s";

    setTimeout(() => {
      monsterData.element.style.display = "none";
    }, 500);
  }

  // 10초 후 몬스터 리젠
  setTimeout(() => {
    if (monsterData.element) {
      monsterData.hp = monsterData.maxHp;
      monsterData.element.setAttribute("data-hp", monsterData.hp);
      monsterData.element.style.display = "block";
      monsterData.element.style.opacity = "1";

      // monsterAttack.js의 해당 몬스터 AI 재시작
      if (window.monsterAIs && window.monsterAIs[monsterData.id]) {
        window.monsterAIs[monsterData.id].isDead = false;
      }

      // HP 바 업데이트 강제 실행
      if (typeof window.updateMonsterUI === "function") {
        window.updateMonsterUI(monsterData.id);
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
        const heroRect = hero.getBoundingClientRect();
        const nearestMonster = findNearestMonster(heroRect);

        if (nearestMonster && nearestMonster.element) {
          const monsterRect = nearestMonster.element.getBoundingClientRect();
          // Monster(레드 슬라임)의 경우 히트박스를 더 작게 계산
          const hitboxReduction = nearestMonster.id === "Monster" ? 50 : 0;
          const adjustedMonsterWidth = monsterRect.width - hitboxReduction;
          const adjustedMonsterHeight = monsterRect.height - hitboxReduction;
          const monsterCenterX = monsterRect.left + monsterRect.width / 2;
          const monsterCenterY = monsterRect.top + monsterRect.height / 2;
          const heroCenterX = heroRect.left + heroRect.width / 2;
          const heroCenterY = heroRect.top + heroRect.height / 2;

          const distance = Math.sqrt(
            Math.pow(monsterCenterX - heroCenterX, 2) +
            Math.pow(monsterCenterY - heroCenterY, 2)
          );

          // Monster의 경우 더 작은 히트박스로 계산
          const effectiveRadius = nearestMonster.id === "Monster"
            ? Math.min(adjustedMonsterWidth, adjustedMonsterHeight) / 2 + 20
            : 150; // 검 공격 범위 증가 (80 -> 150)

          if (distance < effectiveRadius) { // 검 공격 범위
            // 몬스터 hp 감소
            nearestMonster.hp -= heroAttack * 2; // 검은 공격력 2배
            if (nearestMonster.hp < 0) nearestMonster.hp = 0;

            // 몬스터 데이터 업데이트
            nearestMonster.element.setAttribute("data-hp", nearestMonster.hp);

            // monsterAttack.js의 damageMonster 함수 호출 (HP 바 업데이트용)
            if (typeof window.damageMonster === "function") {
              window.damageMonster(heroAttack * 2, nearestMonster.id);
            }

            const originalfilter = nearestMonster.element.style.filter;
            nearestMonster.element.style.filter =
              "brightness(1.5) sepia(1) saturate(5) hue-rotate(-50deg)";

            setTimeout(() => {
              nearestMonster.element.style.filter = originalfilter;
            }, 200);

            if (nearestMonster.hp <= 0) {
              // 몬스터 처치 - 골드/경험치 지급
              handleMonsterKill(nearestMonster);
            }
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
        // 모든 몬스터와 충돌 체크
        const projectileRect = projectile.getBoundingClientRect();

        Object.keys(monsters).forEach(id => {
          const m = monsters[id];
          if (!m.element || m.element.style.display === "none" || m.hp <= 0) return;

          const monsterRect = m.element.getBoundingClientRect();
          // Monster(레드 슬라임)의 히트박스를 더 작게 설정
          const hitboxPadding = id === "Monster" ? 70 : 1;
          const hitboxMargin = id === "Monster" ? 40 : 0;

          if (
            projectileRect.left < monsterRect.right - hitboxPadding &&
            projectileRect.right > monsterRect.left + hitboxPadding + hitboxMargin &&
            projectileRect.top < monsterRect.bottom - hitboxPadding &&
            projectileRect.bottom > monsterRect.top + hitboxPadding + hitboxMargin
          ) {
            // 몬스터 hp 감소
            m.hp -= heroAttack;
            if (m.hp < 0) m.hp = 0;

            // 몬스터 데이터 업데이트
            m.element.setAttribute("data-hp", m.hp);

            // monsterAttack.js의 damageMonster 함수 호출 (HP 바 업데이트용)
            if (typeof window.damageMonster === "function") {
              window.damageMonster(heroAttack, id);
            }

            const originalfilter = m.element.style.filter;
            m.element.style.filter =
              "brightness(1.5) sepia(1) saturate(5) hue-rotate(-50deg)";

            setTimeout(() => {
              m.element.style.filter = originalfilter;
            }, 200);

            if (m.hp <= 0) {
              // 몬스터 처치 - 골드/경험치 지급
              m.id = id;
              handleMonsterKill(m);
            }

            // 발사체 제거
            clearInterval(moveInterval);
            projectile.remove();
          }
        });
      }, 20);
    }
  }
});
