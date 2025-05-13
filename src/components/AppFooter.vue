<template>
  <section>
    <div class="img_footer">
      <div>
        <img src="./icons/TOMSK.svg">
      </div>
    </div>
    <div class="footer">
      <div class="nav">
        <div class="links_footer">
          <a>Длительная аренда</a>
          <a>Недвижимость посуточно</a>
          <a>Политика конфиденциальности</a>
        </div>
        <div class="icons">
          <img src="./icons/icon_telegram.svg">
          <img src="./icons/icon_vk.svg">
        </div>
      </div>
      <div class="footer_contacts">
        <div class="footer_email">TomskZone@mail.com</div>
        <div class="footer_phone">8 (800) 111-11-11</div>
      </div>
      <div class="idk">© 2011—2025 TomskZone</div>
    </div>
  </section>
</template>

<script setup>

</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(17, 17, 17, 1);
  padding-top: 50px;
  transition: padding 0.3s ease;
}

.img_footer {
  margin: 0 160px;
  width: 100%;
  max-width: 1600px;
  text-align: center;
  padding-bottom: 20px;
}

.img_footer img {
  max-width: 100%;
  height: auto;
}

.footer {
  width: 100%;
  max-width: 1600px;
  margin: 0 160px 1% 160px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 5px;
  padding: 20px;
  box-sizing: border-box;
  min-height: 217px;
  transition: all 0.3s ease;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  flex-wrap: wrap;
}

.links_footer {
  display: flex;
  justify-content: space-around;
  width: 700px;
  font-size: 16px;
  gap: 20px;
  flex-wrap: wrap;
}

.links_footer a {
  color: black;
  text-decoration: none;
  transition: color 0.3s ease;
}

.links_footer a:hover {
  color: #FF4A2B;
}

.icons {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icons > img {
  width: 32px;
  height: auto;
  transition: transform 0.3s ease;
}

.icons > img:hover {
  transform: scale(1.1);
}

.footer_contacts {
  font-size: 45px;
  display: flex;
  justify-content: space-between;
  padding: 20px 24px;
  flex-wrap: wrap;
  gap: 15px;
}

.footer_email,
.footer_phone {
  color: black;
}

.idk {
  display: flex;
  justify-content: center;
  font-size: 16px;
  padding-bottom: 16px;
  color: #666;
}

/* Адаптивные стили */
@media (max-width: 1366px) {
  section {
    padding-top: 30px;
  }

  .img_footer {
    margin: 0 40px;
  }

  .footer {
    margin: 0 40px 1% 40px;
    min-height: 180px;
  }

  .nav {
    padding: 0 20px;
  }

  .links_footer {
    width: 60%;
    font-size: 14px;
    gap: 15px;
  }

  .icons > img {
    width: 28px;
  }

  .footer_contacts {
    font-size: 32px;
    padding: 15px 20px;
  }

  .idk {
    font-size: 14px;
    padding-bottom: 12px;
  }
}

@media (max-width: 768px) {
  .img_footer {
    margin: 0 20px;
  }

  .footer {
    margin: 0 20px 1% 20px;
    padding: 15px;
  }

  .nav {
    flex-direction: column;
    gap: 15px;
    padding: 0 15px;
  }

  .links_footer {
    width: 100%;
    justify-content: center;
    font-size: 13px;
    gap: 10px;
  }

  .footer_contacts {
    font-size: 24px;
    padding: 10px 15px;
  }
}

@media (max-width: 360px) {
  section {
    padding-top: 20px;
  }

  .img_footer {
    margin: 0 10px;
    padding-bottom: 15px;
  }

  .img_footer img {
    max-width: 200px;
  }

  .footer {
    margin: 0 10px 1% 10px;
    padding: 10px;
    min-height: unset;
  }

  .nav {
    gap: 10px;
  }

  .links_footer {
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    gap: 8px;
  }

  .icons {
    gap: 15px;
  }

  .icons > img {
    width: 24px;
  }

  .footer_contacts {
    flex-direction: column;
    align-items: center;
    font-size: 20px;
    padding: 10px;
    gap: 8px;
  }

  .idk {
    font-size: 12px;
    padding-bottom: 10px;
  }
}
</style>