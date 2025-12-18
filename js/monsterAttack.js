document.addEventListener("DOMContentLoaded", () => {
  const hero = document.getElementById("Hero");
  const monster = document.getElementById("GreenMonster");

  if (!hero || !monster) return;

  const hpDisplay = document.getElementById("HP");
  const goldDisplay = document.getElementById("gold");
  const expDisplay = document.getElementById("EXP"); // ⭐ 경험치 표시 추가
  let heroHp = 100;

  // ⭐ 골드와 경험치 초기화
  let playerGold = parseInt(localStorage.getItem("playerGold")) || 0;
  let playerExp = parseInt(localStorage.getItem("playerExp")) || 0;
  let playerLevel = parseInt(localStorage.getItem("playerLevel")) || 1;

  // ⭐ 처음 시작할 때 기본 무기(총) 설정
  if (!localStorage.getItem("equippedWeapon")) {
    localStorage.setItem("equippedWeapon", "총🔫");
  }

  // 골드 표시 업데이트
  const goldAmount = document.getElementById("goldAmount");
  if (goldDisplay) {
    goldDisplay.textContent = `골드: ${playerGold}G`;
  }
  if (goldAmount) {
    goldAmount.textContent = playerGold;
  }

  // ⭐ 경험치 표시 업데이트
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
  monsterHpLabel.style.fontFamily = '"NeoDonggeunmo", sans-serif';
  monsterHpLabel.style.fontSize = "14px";
  monsterHpLabel.style.fontWeight = "bold";
  document.querySelector("#dungeon").appendChild(monsterHpLabel);

  // ⭐ 몬스터 HP 바 생성
  const monsterHpBar = document.createElement("div");
  monsterHpBar.className = "monster-hp-bar";
  monsterHpBar.style.width = "60px";
  document.querySelector("#dungeon").appendChild(monsterHpBar);

  // ⭐ 골드/경험치 획득 알림 박스 표시 함수 (따로 표시)
  window.showRewardNotification = function(gold, exp, monsterName) {
    // 몬스터 처치 알림
    const killNotification = document.createElement("div");
    killNotification.className = "reward-notification";
    killNotification.style.top = "40%";
    killNotification.innerHTML = `
      <div class="reward-content">
        <h3>💀 ${monsterName} 처치!</h3>
      </div>
    `;
    document.body.appendChild(killNotification);

    // 골드 획득 알림 (왼쪽)
    const goldNotification = document.createElement("div");
    goldNotification.className = "reward-notification gold-notification";
    goldNotification.style.top = "50%";
    goldNotification.style.left = "35%";
    goldNotification.innerHTML = `
      <div class="reward-content">
        <p>💰 골드 +${gold}G</p>
      </div>
    `;
    document.body.appendChild(goldNotification);

    // 경험치 획득 알림 (오른쪽)
    const expNotification = document.createElement("div");
    expNotification.className = "reward-notification exp-notification";
    expNotification.style.top = "50%";
    expNotification.style.left = "65%";
    expNotification.innerHTML = `
      <div class="reward-content">
        <p>⭐ 경험치 +${exp}EXP</p>
      </div>
    `;
    document.body.appendChild(expNotification);

    // 애니메이션으로 나타남
    setTimeout(() => {
      killNotification.classList.add("show");
      goldNotification.classList.add("show");
      expNotification.classList.add("show");
    }, 10);

    // 3초 후 사라짐
    setTimeout(() => {
      killNotification.classList.remove("show");
      goldNotification.classList.remove("show");
      expNotification.classList.remove("show");
      setTimeout(() => {
        killNotification.remove();
        goldNotification.remove();
        expNotification.remove();
      }, 300);
    }, 3000);
  };

  // ⭐ 레벨업 알림 박스 표시 함수
  window.showLevelUpNotification = function(level) {
    const notification = document.createElement("div");
    notification.className = "reward-notification levelup";
    notification.innerHTML = `
      <div class="reward-content">
        <h3>🎉 레벨업!</h3>
        <p>레벨 ${level}이 되었습니다!</p>
      </div>
    `;
    document.body.appendChild(notification);

    // 애니메이션으로 나타남
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    // 3초 후 사라짐
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  };

  // 몬스터 AI 설정 (전역으로 노출하여 다른 파일에서 접근 가능하도록)
  const monsterAI = {
    detectionRange: 200,
    attackRange: 180,
    moveSpeed: 1.5,
    attackCooldown: 1000,
    lastAttackTime: 0,
    isDead: false,
  };
  window.monsterAI = monsterAI; // 전역으로 노출
  window.updateMonsterUI = updateMonsterUI; // 함수도 전역으로 노출

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

  // 💀 히어로 죽음 처리 및 부활 시스템
  function handleHeroDeath() {
    // 몬스터 AI 중지
    monsterAI.isDead = true;

    // ⭐ 전역 플래그 설정 (다른 파일에서 접근 가능하도록)
    window.heroIsDead = true;

    // 히어로 투명하게 만들기
    hero.style.opacity = "0.3";
    hero.style.filter = "grayscale(100%)";

    // 부활 모달 생성
    const reviveModal = document.createElement("div");
    reviveModal.id = "reviveModal";
    reviveModal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 30px;
      border-radius: 15px;
      border: 3px solid #ff4757;
      z-index: 1000;
      text-align: center;
      font-family: "NeoDonggeunmo", sans-serif;
      min-width: 300px;
    `;

    reviveModal.innerHTML = `
      <h2 style="color: #ff4757; margin-bottom: 20px; font-size: 24px;">💀 사망했습니다!</h2>
      <p style="margin-bottom: 20px; font-size: 16px;">부활하시겠습니까?</p>
      <div style="display: flex; gap: 15px; justify-content: center;">
        <button id="reviveYes" style="
          padding: 10px 20px;
          background: #2ed573;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-family: 'NeoDonggeunmo', sans-serif;
          font-size: 16px;
          font-weight: bold;
        ">부활하기</button>
        <button id="reviveNo" style="
          padding: 10px 20px;
          background: #ff4757;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-family: 'NeoDonggeunmo', sans-serif;
          font-size: 16px;
          font-weight: bold;
        ">게임 종료</button>
      </div>
    `;

    document.body.appendChild(reviveModal);

    // 부활 버튼 클릭
    document.getElementById("reviveYes").addEventListener("click", () => {
      reviveHero();
      reviveModal.remove();
    });

    // 게임 종료 버튼 클릭
    document.getElementById("reviveNo").addEventListener("click", () => {
      if (confirm("정말 게임을 종료하시겠습니까?")) {
        window.location.reload();
      }
    });
  }

  // ⭐ 히어로 부활 함수
  function reviveHero() {
    // HP 회복
    heroHp = 100;
    if (hpDisplay) {
      // span 요소에는 숫자만 설정
      hpDisplay.textContent = `100`;
    }

    // 히어로 상태 복구
    hero.style.opacity = "1";
    hero.style.filter = "brightness(100%)";

    // 빌리지로 이동
    const villageMap = document.getElementById("village");
    const dungeonMap = document.getElementById("dungeon");

    if (villageMap && dungeonMap) {
      dungeonMap.classList.remove("active");
      villageMap.classList.add("active");
      villageMap.appendChild(hero);

      // 빌리지 중앙으로 이동
      const heroWidth = hero.offsetWidth;
      const heroHeight = hero.offsetHeight;
      hero.style.left = `${villageMap.offsetWidth / 2 - heroWidth / 2}px`;
      hero.style.top = `${villageMap.offsetHeight / 2 - heroHeight / 2}px`;
    }

    // ⭐ 몬스터 체력 리셋
    if (monster) {
      monsterHp = monsterMaxHp;
      monster.setAttribute("data-hp", monsterHp);
      monster.dataset.hp = monsterHp;

      // 몬스터 HP 바 업데이트
      if (typeof updateMonsterUI === "function") {
        updateMonsterUI();
      }
    }

    // 몬스터 AI 재시작
    monsterAI.isDead = false;
    monsterAI.lastAttackTime = 0;

    // ⭐ 전역 플래그 해제
    window.heroIsDead = false;

    // 골드 일부 차감 (부활 비용)
    const reviveCost = Math.floor(playerGold * 0.1); // 골드의 10% 차감
    playerGold = Math.max(0, playerGold - reviveCost);
    localStorage.setItem("playerGold", playerGold);
    if (goldDisplay) {
      goldDisplay.textContent = `골드: ${playerGold}G`;
    }

    if (reviveCost > 0) {
      alert(`부활했습니다! 부활 비용으로 ${reviveCost}G가 차감되었습니다.`);
    } else {
      alert("부활했습니다!");
    }

    // 몬스터 AI 재시작
    updateMonsterAI();
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
    const goldAmount = document.getElementById("goldAmount");
    if (goldDisplay) {
      goldDisplay.textContent = `골드: ${playerGold}G`;
    }
    if (goldAmount) {
      goldAmount.textContent = playerGold;
    }

    // 경험치 획득
    playerExp += monsterExp;
    localStorage.setItem("playerExp", playerExp);

    // ⭐ 경험치 표시 업데이트
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

    // 하단 UI 업데이트
    if (typeof window.updateBottomUI === "function") {
      window.updateBottomUI();
    }

    // 레벨업 체크 (예: 100 경험치마다 레벨업)
    const expNeeded = playerLevel * 100;
    if (playerExp >= expNeeded) {
      playerLevel++;
      playerExp -= expNeeded;
      localStorage.setItem("playerLevel", playerLevel);
      localStorage.setItem("playerExp", playerExp);

      // ⭐ 레벨업 후 경험치 표시 업데이트
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

      // 하단 UI 업데이트
      if (typeof window.updateBottomUI === "function") {
        window.updateBottomUI();
      }

      if (typeof window.showLevelUpNotification === "function") {
        window.showLevelUpNotification(playerLevel);
      }
    }

    // 알림 메시지 (박스 형식)
    showRewardNotification(monsterGold, monsterExp, monsterName);

    // 몬스터 사라짐 효과
    monster.style.opacity = "0";
    monster.style.transition = "opacity 0.5s";

    setTimeout(() => {
      monster.style.display = "none";
      monsterHpLabel.style.display = "none";
      monsterHpBar.style.display = "none";
    }, 500);

    // 10초 후 몬스터 리젠
    setTimeout(() => {
      if (monster) {
        monsterHp = monsterMaxHp;
        monster.setAttribute("data-hp", monsterHp);
        monster.style.display = "block";
        monster.style.opacity = "1";
        monster.style.transition = "opacity 0.5s";

        // 몬스터 AI 재활성화
        monsterAI.isDead = false;
        monsterAI.lastAttackTime = 0;

        // HP 바와 레이블 다시 표시
        updateMonsterUI();

        // 몬스터 AI 재시작
        updateMonsterAI();
      }
    }, 10000);
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

    // 몬스터의 실제 위치 계산 (getBoundingClientRect 사용)
    const monsterRect = monster.getBoundingClientRect();
    const dungeonRect = document.querySelector("#dungeon").getBoundingClientRect();

    // 던전 기준 상대 위치
    const monsterX = monsterRect.left - dungeonRect.left;
    const monsterY = monsterRect.top - dungeonRect.top;
    const monsterWidth = monsterRect.width;
    const monsterHeight = monsterRect.height;

    const isFlipped = monster.style.transform.includes("scaleX(-1)");

    // HP 바 표시 - 몬스터 위 중앙에 배치
    monsterHpBar.style.display = "block";
    monsterHpBar.style.position = "absolute";
    monsterHpBar.style.top = `${monsterY - 20}px`;
    monsterHpBar.style.left = `${monsterX + monsterWidth / 2 - 30}px`; // 중앙 정렬 (60px 너비의 절반)
    monsterHpBar.style.width = "60px";
    monsterHpBar.style.transform = "none"; // transform 초기화

    const hpPercentage = (monsterHp / monsterMaxHp) * 100;
    // CSS 변수로 HP 바 너비 업데이트
    monsterHpBar.style.setProperty("--hp-width", `${hpPercentage}%`);

    // HP 텍스트 표시 - HP 바 위에 배치
    monsterHpLabel.style.display = "block";
    monsterHpLabel.style.position = "absolute";
    monsterHpLabel.style.top = `${monsterY - 40}px`;
    monsterHpLabel.style.left = `${monsterX + monsterWidth / 2}px`;
    monsterHpLabel.style.transform = "translateX(-50%)"; // 중앙 정렬
    monsterHpLabel.style.transformOrigin = "center";
    monsterHpLabel.textContent = `HP: ${monsterHp}/${monsterMaxHp}`;
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

          // span 요소에는 숫자만 설정
          hpDisplay.textContent = heroHp;
          // 하단 UI 업데이트
          if (typeof window.updateBottomUI === "function") {
            window.updateBottomUI();
          }

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
            // 💀 죽음 처리 - 부활 옵션 제공
            handleHeroDeath();
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
