document.addEventListener("DOMContentLoaded", () => {
  const hero = document.getElementById("Hero");
  const monster = document.getElementById("GreenMonster");

  const hpDisplay = document.getElementById("Hp");
  let heroHp = 100;

  // 🔥 몬스터 공격 주기 (2초마다)
  const attackInterval = setInterval(() => {
    if (!hero || !monster) return;

    // 히어로와 몬스터 거리 계산
    const heroRect = hero.getBoundingClientRect();
    const monsterRect = monster.getBoundingClientRect();
    const distance = Math.abs(heroRect.left - monsterRect.left);

    // 일정 거리 안에 들어오면 공격!
    if (distance < 100) {
      const damage = Math.floor(Math.random() * 10) + 5; // 5~15 랜덤 대미지
      heroHp -= damage;
      if (heroHp < 0) heroHp = 0;

      hpDisplay.textContent = heroHp;

      // ⚔️ 공격 애니메이션 효과 (잠깐 흔들림)
      monster.style.transform = "translateX(-10px)";
      setTimeout(() => {
        monster.style.transform = "translateX(0)";
      }, 150);

      // 💥 히어로 피격 효과
      hero.style.filter =
        "brightness(1.5) sepia(1) saturate(5) hue-rotate(-50deg)";
      setTimeout(() => {
        hero.style.filter = "brightness(100%)";
      }, 150);

      // HP가 0 이하 → 게임오버
      if (heroHp <= 0) {
        clearInterval(attackInterval);
        alert("💀 Game Over! 몬스터에게 패배했습니다.");
      }
    }
  }, 1000); // 2초마다 공격
});

  const hpDisplay = document.getElementById("HP");
  const goldDisplay = document.getElementById("gold");
  const expDisplay = document.getElementById("EXP"); // ⭐ 경험치 표시 추가
  let heroHp = 100;

  // ⭐ 골드와 경험치 초기화
  let playerGold = parseInt(localStorage.getItem("playerGold")) || 0;
  let playerExp = parseInt(localStorage.getItem("playerExp")) || 0;
  let playerLevel = parseInt(localStorage.getItem("playerLevel")) || 1;

  // 골드 표시 업데이트
  if (goldDisplay) {
    goldDisplay.textContent = `골드: ${playerGold}G`;
  }

  // ⭐ 경험치 표시 업데이트
  if (expDisplay) {
    expDisplay.textContent = playerExp;
  }

  // ⭐ 몬스터 데이터 가져오기
  let monsterHp = parseInt(monster.dataset.hp);
  const monsterMaxHp = parseInt(monster.dataset.maxHp);
  const monsterName = monster.dataset.name;
  const monsterAttack = parseInt(monster.dataset.attack);
  const monsterGold = parseInt(monster.dataset.gold);
  const monsterExp = parseInt(monster.dataset.exp);

  // 사운드 미리 로드
  const heroHitSound = new Audio("sound/HitSound.mp3");
  heroHitSound.volume = 0.5;

  // ⭐ 몬스터 HP 텍스트 생성
  const monsterHpLabel = document.createElement("div");
  monsterHpLabel.className = "monster-hp-label";
  monsterHpLabel.textContent = `HP: ${monsterHp}/${monsterMaxHp}`;
  document.querySelector("#dungeon").appendChild(monsterHpLabel);

  // ⭐ 몬스터 HP 바 생성
  const monsterHpBar = document.createElement("div");
  monsterHpBar.className = "monster-hp-bar";
  monsterHpBar.style.width = "60px";
  document.querySelector("#dungeon").appendChild(monsterHpBar);

  // 몬스터 AI 설정
  const monsterAI = {
    detectionRange: 200,
    attackRange: 180,
    moveSpeed: 1.5,
    attackCooldown: 1000,
    lastAttackTime: 0,
    isDead: false,
  };

  // 히어로 피격 효과
  function playHeroHitEffect() {
    heroHitSound.currentTime = 0;
    heroHitSound
      .play()
      .catch((err) => console.log("피격 사운드 재생 실패:", err));

    hero.style.filter =
      "brightness(1.5) sepia(1) saturate(5) hue-rotate(-50deg)";
    setTimeout(() => {
      hero.style.filter = "brightness(100%)";
    }, 150);
  }

  // ⭐ 장애물 충돌 체크 함수 (범위 축소)
  function isCollidingWithObstacles(x, y, width, height) {
    const obstacles = document.querySelectorAll("#dungeon .obstacle");

    // ⭐ 각 면에서 15px씩 안쪽으로 축소
    const margin = 15;

    const adjustedX = x + margin;
    const adjustedY = y + margin;
    const adjustedWidth = width - margin * 2;
    const adjustedHeight = height - margin * 2;

    for (let obstacle of obstacles) {
      const ox = obstacle.offsetLeft;
      const oy = obstacle.offsetTop;
      const ow = obstacle.offsetWidth;
      const oh = obstacle.offsetHeight;

      if (
        !(
          adjustedX + adjustedWidth <= ox ||
          adjustedX >= ox + ow ||
          adjustedY + adjustedHeight <= oy ||
          adjustedY >= oy + oh
        )
      ) {
        return true;
      }
    }
    return false;
  }

  // ⭐ 몬스터 처치 함수
  function killMonster() {
    monsterAI.isDead = true;

    // 골드 획득
    playerGold += monsterGold;
    localStorage.setItem("playerGold", playerGold);
    if (goldDisplay) {
      goldDisplay.textContent = `골드: ${playerGold}G`;
    }

    // 경험치 획득
    playerExp += monsterExp;
    localStorage.setItem("playerExp", playerExp);

    // ⭐ 경험치 표시 업데이트
    if (expDisplay) {
      expDisplay.textContent = playerExp;
    }

    // 레벨업 체크 (예: 100 경험치마다 레벨업)
    const expNeeded = playerLevel * 100;
    if (playerExp >= expNeeded) {
      playerLevel++;
      playerExp -= expNeeded;
      localStorage.setItem("playerLevel", playerLevel);
      localStorage.setItem("playerExp", playerExp);

      // ⭐ 레벨업 후 경험치 표시 업데이트
      if (expDisplay) {
        expDisplay.textContent = playerExp;
      }

      alert(`🎉 레벨업! 레벨 ${playerLevel}이 되었습니다!`);
    }

    // 알림 메시지
    alert(
      `💀 ${monsterName} 처치!\n💰 골드 +${monsterGold}G\n⭐ 경험치 +${monsterExp}EXP`
    );

    // 몬스터 사라짐 효과
    monster.style.opacity = "0";
    monster.style.transition = "opacity 0.5s";

    setTimeout(() => {
      monster.style.display = "none";
      monsterHpLabel.style.display = "none";
      monsterHpBar.style.display = "none";
    }, 500);
  }

  // ⭐ 몬스터 HP 감소 함수 (히어로가 공격할 때 호출)
  window.damageMonster = function (damage) {
    if (monsterAI.isDead) return;

    monsterHp -= damage;
    if (monsterHp < 0) monsterHp = 0;

    // 몬스터 데이터 업데이트
    monster.dataset.hp = monsterHp;

    // 몬스터 피격 효과
    monster.classList.add("hit");
    setTimeout(() => {
      monster.classList.remove("hit");
    }, 200);

    console.log(`몬스터 HP: ${monsterHp}/${monsterMaxHp}`);

    // 몬스터 사망 체크
    if (monsterHp <= 0) {
      killMonster();
    }
  };

  // ⭐ 몬스터 HP 바와 텍스트 위치 업데이트
  function updateMonsterUI() {
    if (!monster || monster.style.display === "none" || monsterAI.isDead) {
      monsterHpBar.style.display = "none";
      monsterHpLabel.style.display = "none";
      return;
    }

    const monsterX = monster.offsetLeft;
    const monsterY = monster.offsetTop;
    const monsterWidth = monster.offsetWidth;

    const isFlipped = monster.style.transform.includes("scaleX(-1)");

    // HP 바 표시
    monsterHpBar.style.display = "block";
    monsterHpBar.style.top = `${monsterY - 15}px`;
    const hpPercentage = (monsterHp / monsterMaxHp) * 60;
    monsterHpBar.style.width = `${hpPercentage}px`;

    // HP 텍스트 표시
    monsterHpLabel.style.display = "block";
    monsterHpLabel.style.top = `${monsterY - 35}px`;
    monsterHpLabel.textContent = `HP: ${monsterHp}/${monsterMaxHp}`;

    if (isFlipped) {
      monsterHpBar.style.left = `${monsterX + monsterWidth}px`;
      monsterHpBar.style.transform = "scaleX(-1)";

      monsterHpLabel.style.left = `${monsterX + monsterWidth}px`;
      monsterHpLabel.style.transform = "scaleX(-1)";
      monsterHpLabel.style.transformOrigin = "left center";
    } else {
      monsterHpBar.style.left = `${monsterX}px`;
      monsterHpBar.style.transform = "scaleX(1)";

      monsterHpLabel.style.left = `${monsterX}px`;
      monsterHpLabel.style.transform = "scaleX(1)";
    }
  }

  // 몬스터 추적 및 공격
  function updateMonsterAI() {
    if (
      !hero ||
      !monster ||
      monster.style.display === "none" ||
      monsterAI.isDead
    )
      return;

    const monsterX = monster.offsetLeft;
    const monsterY = monster.offsetTop;
    const heroX = hero.offsetLeft;
    const heroY = hero.offsetTop;

    const dx = heroX - monsterX;
    const dy = heroY - monsterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < monsterAI.detectionRange) {
      if (distance < monsterAI.attackRange) {
        const currentTime = Date.now();
        if (currentTime - monsterAI.lastAttackTime > monsterAI.attackCooldown) {
          const damage = Math.floor(Math.random() * 5) + monsterAttack - 5;
          heroHp -= damage;
          if (heroHp < 0) heroHp = 0;

          hpDisplay.textContent = heroHp;

          const currentTransform = monster.style.transform;
          if (currentTransform.includes("scaleX(-1)")) {
            monster.style.transform = "scaleX(-1) translateX(10px)";
            setTimeout(() => {
              monster.style.transform = "scaleX(-1)";
            }, 150);
          } else {
            monster.style.transform = "scaleX(1) translateX(-10px)";
            setTimeout(() => {
              monster.style.transform = "scaleX(1)";
            }, 150);
          }

          playHeroHitEffect();
          monsterAI.lastAttackTime = currentTime;

          if (heroHp <= 0) {
            alert("💀 Game Over! 몬스터에게 패배했습니다.");
            return;
          }
        }
      } else {
        const angle = Math.atan2(dy, dx);
        let newX = monsterX + Math.cos(angle) * monsterAI.moveSpeed;
        let newY = monsterY + Math.sin(angle) * monsterAI.moveSpeed;

        const monsterWidth = monster.offsetWidth;
        const monsterHeight = monster.offsetHeight;

        let canMoveX = true;
        let canMoveY = true;

        if (
          isCollidingWithObstacles(newX, monsterY, monsterWidth, monsterHeight)
        ) {
          canMoveX = false;
        }
        if (
          isCollidingWithObstacles(monsterX, newY, monsterWidth, monsterHeight)
        ) {
          canMoveY = false;
        }

        const map = document.querySelector("#dungeon");
        if (map) {
          newX = Math.max(0, Math.min(map.offsetWidth - monsterWidth, newX));
          newY = Math.max(0, Math.min(map.offsetHeight - monsterHeight, newY));
        }

        if (canMoveX) monster.style.left = `${newX}px`;
        if (canMoveY) monster.style.top = `${newY}px`;

        if (dx > 0) {
          monster.style.transform = "scaleX(-1)";
        } else {
          monster.style.transform = "scaleX(1)";
        }
      }
    }

    updateMonsterUI();
    requestAnimationFrame(updateMonsterAI);
  }

  updateMonsterAI();
});

