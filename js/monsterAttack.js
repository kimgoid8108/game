document.addEventListener("DOMContentLoaded", () => {
  const hero = document.getElementById("Hero");
  if (!hero) return;

  const hpDisplay = document.getElementById("HP");
  const goldDisplay = document.getElementById("gold");
  const expDisplay = document.getElementById("EXP");
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
  if (levelDisplay) {
    levelDisplay.textContent = playerLevel;
  }

  // ⭐ 모든 몬스터 초기화
  const monsterIds = ["GreenMonster"]; // "Monster", "blueMonster", "BigBossMonster" 주석처리
  const monsters = {};
  const monsterAIs = {};
  const monsterHpLabels = {};
  const monsterHpBars = {};

  monsterIds.forEach(id => {
    const monster = document.getElementById(id);
    if (!monster) return;

    monsters[id] = {
      element: monster,
      hp: parseInt(monster.dataset.hp) || 0,
      maxHp: parseInt(monster.dataset.maxHp) || 0,
      attack: parseInt(monster.dataset.attack) || 15,
      gold: parseInt(monster.dataset.gold) || 50,
      exp: parseInt(monster.dataset.exp) || 30,
      name: monster.dataset.name || "몬스터"
    };

    // 각 몬스터마다 AI 객체 생성
    monsterAIs[id] = {
      detectionRange: id === "BigBossMonster" ? 300 : 200,
      attackRange: id === "BigBossMonster" ? 250 : 180,
      moveSpeed: id === "BigBossMonster" ? 2 : 1.5,
      attackCooldown: id === "BigBossMonster" ? 800 : 1000,
      lastAttackTime: 0,
      isDead: false
    };

    // 각 몬스터마다 HP 바와 레이블 생성
    const hpLabel = document.createElement("div");
    hpLabel.className = "monster-hp-label";
    hpLabel.id = `${id}-hp-label`;
    hpLabel.textContent = `HP: ${monsters[id].hp}/${monsters[id].maxHp}`;
    hpLabel.style.fontFamily = '"NeoDonggeunmo", sans-serif';
    hpLabel.style.fontSize = "14px";
    hpLabel.style.fontWeight = "bold";
    document.querySelector("#dungeon").appendChild(hpLabel);
    monsterHpLabels[id] = hpLabel;

    const hpBar = document.createElement("div");
    hpBar.className = "monster-hp-bar";
    hpBar.id = `${id}-hp-bar`;
    hpBar.style.width = id === "BigBossMonster" ? "80px" : "60px";
    document.querySelector("#dungeon").appendChild(hpBar);
    monsterHpBars[id] = hpBar;
  });

  // 전역으로 노출
  window.monsterAIs = monsterAIs;

  // 사운드 미리 로드
  const heroHitSound = new Audio("sound/HitSound.mp3");
  heroHitSound.volume = 0.5;

  // ⭐ 골드/경험치 획득 알림 박스 표시 함수
  window.showRewardNotification = function(gold, exp, monsterName) {
    const killNotification = document.createElement("div");
    killNotification.className = "reward-notification";
    killNotification.style.top = "40%";
    killNotification.innerHTML = `<div class="reward-content"><h3>💀 ${monsterName} 처치!</h3></div>`;
    document.body.appendChild(killNotification);

    const goldNotification = document.createElement("div");
    goldNotification.className = "reward-notification gold-notification";
    goldNotification.style.top = "50%";
    goldNotification.style.left = "35%";
    goldNotification.innerHTML = `<div class="reward-content"><p>💰 골드 +${gold}G</p></div>`;
    document.body.appendChild(goldNotification);

    const expNotification = document.createElement("div");
    expNotification.className = "reward-notification exp-notification";
    expNotification.style.top = "50%";
    expNotification.style.left = "65%";
    expNotification.innerHTML = `<div class="reward-content"><p>⭐ 경험치 +${exp}EXP</p></div>`;
    document.body.appendChild(expNotification);

    setTimeout(() => {
      killNotification.classList.add("show");
      goldNotification.classList.add("show");
      expNotification.classList.add("show");
    }, 10);

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
    notification.innerHTML = `<div class="reward-content"><h3>🎉 레벨업!</h3><p>레벨 ${level}이 되었습니다!</p></div>`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  };

  // 히어로 피격 효과
  function playHeroHitEffect() {
    heroHitSound.currentTime = 0;
    heroHitSound.play().catch((err) => console.log("피격 사운드 재생 실패:", err));
    hero.style.filter = "brightness(1.5) sepia(1) saturate(5) hue-rotate(-50deg)";
    setTimeout(() => {
      hero.style.filter = "brightness(100%)";
    }, 150);
  }

  // 💀 히어로 죽음 처리 및 부활 시스템
  function handleHeroDeath() {
    Object.keys(monsterAIs).forEach(id => {
      monsterAIs[id].isDead = true;
    });
    window.heroIsDead = true;
    hero.style.opacity = "0.3";
    hero.style.filter = "grayscale(100%)";

    const reviveModal = document.createElement("div");
    reviveModal.id = "reviveModal";
    reviveModal.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,.9);color:#fff;padding:30px;border-radius:15px;border:3px solid #ff4757;z-index:1000;text-align:center;font-family:"NeoDonggeunmo",sans-serif;min-width:300px`;
    reviveModal.innerHTML = `<h2 style="color:#ff4757;margin-bottom:20px;font-size:24px">💀 사망했습니다!</h2><p style="margin-bottom:20px;font-size:16px">부활하시겠습니까?</p><div style="display:flex;gap:15px;justify-content:center"><button id="reviveYes" style="padding:10px 20px;background:#2ed573;color:#fff;border:none;border-radius:5px;cursor:pointer;font-family:'NeoDonggeunmo',sans-serif;font-size:16px;font-weight:bold">부활하기</button><button id="reviveNo" style="padding:10px 20px;background:#ff4757;color:#fff;border:none;border-radius:5px;cursor:pointer;font-family:'NeoDonggeunmo',sans-serif;font-size:16px;font-weight:bold">게임 종료</button></div>`;
    document.body.appendChild(reviveModal);

    document.getElementById("reviveYes").addEventListener("click", () => {
      reviveHero();
      reviveModal.remove();
    });

    document.getElementById("reviveNo").addEventListener("click", () => {
      if (confirm("정말 게임을 종료하시겠습니까?")) {
        window.location.reload();
      }
    });
  }

  // ⭐ 히어로 부활 함수
  function reviveHero() {
    heroHp = 100;
    if (hpDisplay) {
      hpDisplay.textContent = 100;
    }
    hero.style.opacity = "1";
    hero.style.filter = "brightness(100%)";

    const villageMap = document.getElementById("village");
    const dungeonMap = document.getElementById("dungeon");
    if (villageMap && dungeonMap) {
      dungeonMap.classList.remove("active");
      villageMap.classList.add("active");
      villageMap.appendChild(hero);
      const heroWidth = hero.offsetWidth;
      const heroHeight = hero.offsetHeight;
      hero.style.left = `${villageMap.offsetWidth / 2 - heroWidth / 2}px`;
      hero.style.top = `${villageMap.offsetHeight / 2 - heroHeight / 2}px`;
    }

    // ⭐ 모든 몬스터 체력 리셋
    Object.keys(monsters).forEach(id => {
      const m = monsters[id];
      m.hp = m.maxHp;
      m.element.setAttribute("data-hp", m.hp);
      monsterAIs[id].isDead = false;
      monsterAIs[id].lastAttackTime = 0;
      updateMonsterUI(id);
    });

    window.heroIsDead = false;
    const reviveCost = Math.floor(playerGold * 0.1);
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

    Object.keys(monsterAIs).forEach(id => {
      updateMonsterAI(id);
    });
  }

  // ⭐ 장애물 충돌 체크 함수
  function isCollidingWithObstacles(x, y, width, height) {
    const activeMap = document.querySelector(".map.active");
    if (!activeMap) return false;
    const obstacles = activeMap.querySelectorAll(".obstacle");
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

      if (!(adjustedX + adjustedWidth <= ox || adjustedX >= ox + ow || adjustedY + adjustedHeight <= oy || adjustedY >= oy + oh)) {
        return true;
      }
    }
    return false;
  }

  // ⭐ 몬스터 HP 감소 함수 (히어로가 공격할 때 호출)
  window.damageMonster = function (damage, monsterId) {
    if (!monsters[monsterId] || monsterAIs[monsterId].isDead) return;

    const m = monsters[monsterId];
    m.hp -= damage;
    if (m.hp < 0) m.hp = 0;
    m.element.setAttribute("data-hp", m.hp);

    m.element.classList.add("hit");
    setTimeout(() => {
      m.element.classList.remove("hit");
    }, 200);

    if (m.hp <= 0) {
      killMonster(monsterId);
    }
  };

  // ⭐ 몬스터 처치 함수
  function killMonster(monsterId) {
    const m = monsters[monsterId];
    const ai = monsterAIs[monsterId];
    if (!m || ai.isDead) return;

    ai.isDead = true;

    playerGold += m.gold;
    localStorage.setItem("playerGold", playerGold);
    const goldAmount = document.getElementById("goldAmount");
    if (goldDisplay) {
      goldDisplay.textContent = `골드: ${playerGold}G`;
    }
    if (goldAmount) {
      goldAmount.textContent = playerGold;
    }

    playerExp += m.exp;
    localStorage.setItem("playerExp", playerExp);

    if (expDisplay) {
      const expNeeded = playerLevel * 100;
      expDisplay.textContent = playerExp;
      if (expMax) {
        expMax.textContent = expNeeded;
      }
    }
    if (levelDisplay) {
      levelDisplay.textContent = playerLevel;
    }

    if (typeof window.updateBottomUI === "function") {
      window.updateBottomUI();
    }

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
      if (levelDisplay) {
        levelDisplay.textContent = playerLevel;
      }

      if (typeof window.updateBottomUI === "function") {
        window.updateBottomUI();
      }

      if (typeof window.showLevelUpNotification === "function") {
        window.showLevelUpNotification(playerLevel);
      }
    }

    showRewardNotification(m.gold, m.exp, m.name);

    m.element.style.opacity = "0";
    m.element.style.transition = "opacity 0.5s";
    setTimeout(() => {
      m.element.style.display = "none";
      monsterHpLabels[monsterId].style.display = "none";
      monsterHpBars[monsterId].style.display = "none";
    }, 500);

    setTimeout(() => {
      if (m.element) {
        m.hp = m.maxHp;
        m.element.setAttribute("data-hp", m.hp);
        m.element.style.display = "block";
        m.element.style.opacity = "1";
        m.element.style.transition = "opacity 0.5s";
        ai.isDead = false;
        ai.lastAttackTime = 0;
        updateMonsterUI(monsterId);
        updateMonsterAI(monsterId);
      }
    }, 10000);
  }

  // ⭐ 몬스터 HP 바와 텍스트 위치 업데이트
  window.updateMonsterUI = function(monsterId) {
    if (!monsterId) {
      Object.keys(monsters).forEach(id => updateMonsterUI(id));
      return;
    }

    const m = monsters[monsterId];
    const ai = monsterAIs[monsterId];
    const hpLabel = monsterHpLabels[monsterId];
    const hpBar = monsterHpBars[monsterId];

    if (!m || !m.element || m.element.style.display === "none" || ai.isDead) {
      if (hpBar) hpBar.style.display = "none";
      if (hpLabel) hpLabel.style.display = "none";
      return;
    }

    const monsterRect = m.element.getBoundingClientRect();
    const activeMap = document.querySelector(".map.active");
    if (!activeMap) return;
    const mapRect = activeMap.getBoundingClientRect();
    const monsterX = monsterRect.left - mapRect.left;
    const monsterY = monsterRect.top - mapRect.top;
    const monsterWidth = monsterRect.width;
    const barWidth = monsterId === "BigBossMonster" ? 80 : 60;

    if (hpBar) {
      hpBar.style.display = "block";
      hpBar.style.position = "absolute";
      hpBar.style.top = `${monsterY - 20}px`;
      hpBar.style.left = `${monsterX + monsterWidth / 2 - barWidth / 2}px`;
      hpBar.style.width = `${barWidth}px`;
      hpBar.style.transform = "none";

      const hpPercentage = (m.hp / m.maxHp) * 100;
      hpBar.style.setProperty("--hp-width", `${hpPercentage}%`);
    }

    if (hpLabel) {
      hpLabel.style.display = "block";
      hpLabel.style.position = "absolute";
      hpLabel.style.top = `${monsterY - 40}px`;
      hpLabel.style.left = `${monsterX + monsterWidth / 2}px`;
      hpLabel.style.transform = "translateX(-50%)";
      hpLabel.style.transformOrigin = "center";
      hpLabel.textContent = `HP: ${m.hp}/${m.maxHp}`;
    }
  };

  // 몬스터 추적 및 공격
  function updateMonsterAI(monsterId) {
    const m = monsters[monsterId];
    const ai = monsterAIs[monsterId];
    if (!hero || !m || !m.element || m.element.style.display === "none" || ai.isDead) return;

    const monsterX = m.element.offsetLeft;
    const monsterY = m.element.offsetTop;
    const heroX = hero.offsetLeft;
    const heroY = hero.offsetTop;
    const dx = heroX - monsterX;
    const dy = heroY - monsterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ai.detectionRange) {
      if (distance < ai.attackRange) {
        const currentTime = Date.now();
        if (currentTime - ai.lastAttackTime > ai.attackCooldown) {
          const currentHp = parseInt(hpDisplay.textContent) || 100;
          const damage = Math.floor(Math.random() * 5) + m.attack - 5;
          heroHp = Math.max(0, currentHp - damage);

          hpDisplay.textContent = heroHp;
          if (typeof window.updateBottomUI === "function") {
            window.updateBottomUI();
          }

          const currentTransform = m.element.style.transform;
          if (currentTransform.includes("scaleX(-1)")) {
            m.element.style.transform = "scaleX(-1) translateX(10px)";
            setTimeout(() => {
              m.element.style.transform = "scaleX(-1)";
            }, 150);
          } else {
            m.element.style.transform = "scaleX(1) translateX(-10px)";
            setTimeout(() => {
              m.element.style.transform = "scaleX(1)";
            }, 150);
          }

          playHeroHitEffect();
          ai.lastAttackTime = currentTime;

          if (heroHp <= 0) {
            handleHeroDeath();
            return;
          }
        }
      } else {
        const angle = Math.atan2(dy, dx);
        let newX = monsterX + Math.cos(angle) * ai.moveSpeed;
        let newY = monsterY + Math.sin(angle) * ai.moveSpeed;
        const monsterWidth = m.element.offsetWidth;
        const monsterHeight = m.element.offsetHeight;

        let canMoveX = true;
        let canMoveY = true;

        if (isCollidingWithObstacles(newX, monsterY, monsterWidth, monsterHeight)) {
          canMoveX = false;
        }
        if (isCollidingWithObstacles(monsterX, newY, monsterWidth, monsterHeight)) {
          canMoveY = false;
        }

        const map = document.querySelector("#dungeon");
        if (map) {
          newX = Math.max(0, Math.min(map.offsetWidth - monsterWidth, newX));
          newY = Math.max(0, Math.min(map.offsetHeight - monsterHeight, newY));
        }

        if (canMoveX) m.element.style.left = `${newX}px`;
        if (canMoveY) m.element.style.top = `${newY}px`;

        if (dx > 0) {
          m.element.style.transform = "scaleX(-1)";
        } else {
          m.element.style.transform = "scaleX(1)";
        }
      }
    }

    updateMonsterUI(monsterId);
    requestAnimationFrame(() => updateMonsterAI(monsterId));
  }

  // ⭐ 자연치유 시스템
  function naturalHealing() {
    if (!hero || !hpDisplay || window.heroIsDead) return;

    const activeMap = document.querySelector(".map.active");
    if (!activeMap) return;

    const isInDungeon = activeMap.id === "dungeon";
    let isInCombat = false;

    if (isInDungeon) {
      Object.keys(monsters).forEach(id => {
        const m = monsters[id];
        const ai = monsterAIs[id];
        if (m.element && m.element.style.display !== "none" && !ai.isDead) {
          const monsterX = m.element.offsetLeft;
          const monsterY = m.element.offsetTop;
          const heroX = hero.offsetLeft;
          const heroY = hero.offsetTop;
          const dx = heroX - monsterX;
          const dy = heroY - monsterY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < ai.attackRange) {
            isInCombat = true;
          }
        }
      });
    }

    if (!isInCombat) {
      const currentHp = parseInt(hpDisplay.textContent) || 100;
      const maxHp = 100;

      if (currentHp < maxHp) {
        const newHp = Math.min(maxHp, currentHp + 3);
        hpDisplay.textContent = newHp;
        heroHp = newHp;

        if (typeof window.updateBottomUI === "function") {
          window.updateBottomUI();
        }
      }
    }
  }

  setInterval(naturalHealing, 1000);

  // 모든 몬스터 AI 시작
  Object.keys(monsterAIs).forEach(id => {
    updateMonsterAI(id);
  });
});
