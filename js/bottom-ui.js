// 메이플스토리 스타일 하단 UI 관리

document.addEventListener("DOMContentLoaded", () => {
  // 캐릭터 정보 업데이트 함수
  function updateCharacterInfo() {
    const playerNickname = localStorage.getItem("playerNickname") || "플레이어";
    const heroHp = parseInt(document.getElementById("HP")?.textContent) || 100;
    const maxHp = 100;
    const playerLevel = parseInt(localStorage.getItem("playerLevel")) || 1;
    const playerExp = parseInt(localStorage.getItem("playerExp")) || 0;
    const expNeeded = playerLevel * 100;
    const playerGold = parseInt(localStorage.getItem("playerGold")) || 0;

    // 닉네임 표시
    const charNameDisplay = document.getElementById("charNameDisplay");
    if (charNameDisplay) {
      charNameDisplay.textContent = playerNickname;
    }

    // HP 바 업데이트
    const hpBarFill = document.getElementById("hpBarFill");
    const hpText = document.getElementById("hpText");
    if (hpBarFill && hpText) {
      const hpPercentage = (heroHp / maxHp) * 100;
      hpBarFill.style.width = `${hpPercentage}%`;
      hpText.textContent = `${heroHp}/${maxHp}`;
    }

    // 경험치 바 업데이트
    const expBarFill = document.getElementById("expBarFill");
    const expText = document.getElementById("expText");
    if (expBarFill && expText) {
      const expPercentage = (playerExp / expNeeded) * 100;
      expBarFill.style.width = `${expPercentage}%`;
      expText.textContent = `${playerExp}/${expNeeded}`;
    }

    // 레벨 및 골드 표시
    const levelDisplay = document.getElementById("levelDisplay");
    const goldDisplay = document.getElementById("goldDisplay");
    if (levelDisplay) {
      levelDisplay.textContent = playerLevel;
    }
    if (goldDisplay) {
      goldDisplay.textContent = playerGold;
    }
  }

  // 퀵슬롯 업데이트 함수 (전역으로 노출)
  window.updateQuickSlots = function() {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || {};
    const quickSlots = JSON.parse(localStorage.getItem("quickSlots")) || {};

    // 퀵슬롯에 저장된 아이템 표시
    for (let i = 0; i < 5; i++) {
      const slot = document.querySelector(`.quick-slot[data-slot="${i}"]`);
      if (slot) {
        const slotContent = slot.querySelector(".slot-content");
        const itemName = quickSlots[i];

        if (itemName && inventory[itemName] > 0) {
          // 아이템 이모지 매핑
          const itemEmoji = {
            "작은 포션🧪": "🧪",
            "철검🗡️": "🗡️",
            "총🔫": "🔫"
          };
          slotContent.textContent = itemEmoji[itemName] || "?";
          slotContent.setAttribute("data-item", itemName);
          slot.classList.add("has-item");
        } else {
          slotContent.textContent = "";
          slotContent.removeAttribute("data-item");
          slot.classList.remove("has-item");
        }
      }
    }
  };

  // 퀵슬롯 클릭 이벤트
  document.querySelectorAll(".quick-slot").forEach((slot, index) => {
    slot.addEventListener("click", () => {
      const slotContent = slot.querySelector(".slot-content");
      const itemName = slotContent.getAttribute("data-item");

      if (itemName) {
        // 아이템 사용
        if (typeof useItem === "function") {
          useItem(itemName);
        }
      } else {
        // 인벤토리 열기 (아이템 설정용)
        const inventory = document.getElementById("inventory");
        if (inventory) {
          inventory.classList.add("active");
          if (typeof updateInventoryUI === "function") {
            updateInventoryUI();
          }

          // 인벤토리 아이템 클릭 시 퀵슬롯에 등록
          setTimeout(() => {
            const inventoryItems = document.querySelectorAll("#inventory-items li");
            inventoryItems.forEach((item) => {
              item.addEventListener("click", function setQuickSlot() {
                const itemText = this.textContent;
                const itemName = itemText.split(" x")[0];

                // 퀵슬롯에 저장
                const quickSlots = JSON.parse(localStorage.getItem("quickSlots")) || {};
                quickSlots[index] = itemName;
                localStorage.setItem("quickSlots", JSON.stringify(quickSlots));

                if (typeof window.updateQuickSlots === "function") {
                  window.updateQuickSlots();
                }
                this.removeEventListener("click", setQuickSlot);
              });
            });
          }, 100);
        }
      }
    });
  });

  // 무기 전환 슬롯 업데이트 함수 (전역으로 노출)
  window.updateWeaponSlots = function() {
    const equippedWeapon = localStorage.getItem("equippedWeapon") || "총🔫";
    const gunSlot = document.getElementById("weaponGun");
    const swordSlot = document.getElementById("weaponSword");

    if (gunSlot && swordSlot) {
      // 모든 무기 슬롯에서 equipped 클래스 제거
      gunSlot.classList.remove("equipped");
      swordSlot.classList.remove("equipped");

      // 현재 장착된 무기에 equipped 클래스 추가
      if (equippedWeapon === "총🔫") {
        gunSlot.classList.add("equipped");
      } else if (equippedWeapon === "철검🗡️") {
        swordSlot.classList.add("equipped");
      }
    }
  };

  // 무기 전환 함수
  function switchWeapon(weaponName) {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || {};

    // 인벤토리에 해당 무기가 있는지 확인
    if (!inventory[weaponName] || inventory[weaponName] <= 0) {
      if (typeof showItemNotification === "function") {
        showItemNotification("알림", `${weaponName}이(가) 인벤토리에 없습니다!`);
      }
      return;
    }

    // 무기 장착
    localStorage.setItem("equippedWeapon", weaponName);

    // 히어로 이미지 변경
    const heroElement = document.getElementById("Hero");
    const heroInfoPhoto = document.querySelector("#Heroinfo .photo");

    if (weaponName === "철검🗡️") {
      if (heroElement) {
        heroElement.style.backgroundImage = "url('image/Swordhero.png')";
      }
      if (heroInfoPhoto) {
        heroInfoPhoto.src = "image/Swordhero.png";
      }
    } else if (weaponName === "총🔫") {
      if (heroElement) {
        heroElement.style.backgroundImage = "url('image/hero.png')";
      }
      if (heroInfoPhoto) {
        heroInfoPhoto.src = "image/hero.png";
      }
    }

    // 무기 슬롯 업데이트
    updateWeaponSlots();

    // 알림 표시
    if (typeof showItemNotification === "function") {
      showItemNotification("무기 전환", `${weaponName}으로 전환했습니다!`);
    }
  }

  // 무기 슬롯 클릭 이벤트
  document.querySelectorAll(".weapon-slot").forEach((slot) => {
    slot.addEventListener("click", () => {
      const weaponName = slot.getAttribute("data-weapon");
      switchWeapon(weaponName);
    });
  });

  // 무기 전환 키보드 단축키 (Q: 총, E: 검)
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "q") {
      e.preventDefault();
      switchWeapon("총🔫");
    } else if (e.key.toLowerCase() === "e") {
      e.preventDefault();
      switchWeapon("철검🗡️");
    }
  });

  // 스킬 슬롯 클릭 이벤트
  document.querySelectorAll(".skill-slot").forEach((slot) => {
    slot.addEventListener("click", () => {
      const skill = slot.getAttribute("data-skill");
      if (skill === "attack") {
        // 공격 키 시뮬레이션
        const attackEvent = new KeyboardEvent("keydown", {
          key: "z",
          code: "KeyZ"
        });
        window.dispatchEvent(attackEvent);
      }
    });
  });

  // 인벤토리 버튼 클릭 이벤트
  const inventoryBtn = document.getElementById("inventoryBtn");
  if (inventoryBtn) {
    inventoryBtn.addEventListener("click", () => {
      const inventory = document.getElementById("inventory");
      if (inventory) {
        inventory.classList.toggle("active");
        if (inventory.classList.contains("active")) {
          if (typeof updateInventoryUI === "function") {
            updateInventoryUI();
          }
        }
      }
    });
  }

  // 퀵슬롯 키보드 단축키 (1-5)
  window.addEventListener("keydown", (e) => {
    const keyNum = parseInt(e.key);
    if (keyNum >= 1 && keyNum <= 5) {
      const slotIndex = keyNum - 1;
      const slot = document.querySelector(`.quick-slot[data-slot="${slotIndex}"]`);
      if (slot) {
        const slotContent = slot.querySelector(".slot-content");
        const itemName = slotContent.getAttribute("data-item");

        if (itemName && typeof useItem === "function") {
          useItem(itemName);
        }
      }
    }
  });

  // 주기적으로 UI 업데이트
  setInterval(() => {
    updateCharacterInfo();
    updateWeaponSlots();
    if (typeof window.updateQuickSlots === "function") {
      window.updateQuickSlots();
    }
  }, 500);

  // 초기 업데이트
  updateCharacterInfo();
  updateWeaponSlots();
  if (typeof window.updateQuickSlots === "function") {
    window.updateQuickSlots();
  }
});

// 전역 함수로 노출 (다른 파일에서 호출 가능)
window.updateBottomUI = function() {
  const playerNickname = localStorage.getItem("playerNickname") || "플레이어";
  const heroHp = parseInt(document.getElementById("HP")?.textContent) || 100;
  const maxHp = 100;
  const playerLevel = parseInt(localStorage.getItem("playerLevel")) || 1;
  const playerExp = parseInt(localStorage.getItem("playerExp")) || 0;
  const expNeeded = playerLevel * 100;
  const playerGold = parseInt(localStorage.getItem("playerGold")) || 0;

  const charNameDisplay = document.getElementById("charNameDisplay");
  if (charNameDisplay) {
    charNameDisplay.textContent = playerNickname;
  }

  const hpBarFill = document.getElementById("hpBarFill");
  const hpText = document.getElementById("hpText");
  if (hpBarFill && hpText) {
    const hpPercentage = (heroHp / maxHp) * 100;
    hpBarFill.style.width = `${hpPercentage}%`;
    hpText.textContent = `${heroHp}/${maxHp}`;
  }

  const expBarFill = document.getElementById("expBarFill");
  const expText = document.getElementById("expText");
  if (expBarFill && expText) {
    const expPercentage = (playerExp / expNeeded) * 100;
    expBarFill.style.width = `${expPercentage}%`;
    expText.textContent = `${playerExp}/${expNeeded}`;
  }

  const levelDisplay = document.getElementById("levelDisplay");
  const goldDisplay = document.getElementById("goldDisplay");
  if (levelDisplay) {
    levelDisplay.textContent = playerLevel;
  }
  if (goldDisplay) {
    goldDisplay.textContent = playerGold;
  }
};
