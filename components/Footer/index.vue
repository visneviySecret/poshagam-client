<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4 class="footer-title">Документы</h4>
        <ul class="footer-links">
          <li>
            <a
              href="/documents/Публичная Оферта По Шагам.pdf"
              target="_blank"
              rel="noopener"
            >
              Публичная оферта
            </a>
          </li>
          <li>
            <a
              href="/documents/Политика конфденциальности.pdf"
              target="_blank"
              rel="noopener"
            >
              Политика конфиденциальности
            </a>
          </li>
          <li>
            <a
              href="/documents/Согласие на обработку ПД.pdf"
              target="_blank"
              rel="noopener"
            >
              Согласие на обработку ПД
            </a>
          </li>
          <li>
            <a
              href="/documents/Политика_возврата_и_обмена_товаров.pdf"
              target="_blank"
              rel="noopener"
            >
              Политика возврата и обмена
            </a>
          </li>
        </ul>
      </div>

      <div class="footer-section">
        <h4 class="footer-title">Контакты</h4>
        <ul class="footer-links">
          <li>
            <a href="mailto:poshagam.store@gmail.com"
              >poshagam.store@gmail.com</a
            >
          </li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} По Шагам. Все права защищены.</p>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped lang="scss">
.footer {
  box-sizing: border-box;
  width: 100%;
  max-width: 100vw;
  background: #1f2432;
  color: #ffffff;
  padding: 20px;
  margin-top: auto;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: space-between;
}

.footer-section {
  min-width: 200px;
}

.footer-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ffffff;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 10px;
  }

  a {
    color: #a0a5b1;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s ease;

    &:hover {
      color: #ffffff;
    }
  }
}

.footer-bottom {
  max-width: 1280px;
  margin: 30px auto 0;
  padding-top: 20px;
  border-top: 1px solid #3a3f4d;
  text-align: center;

  p {
    color: #797b86;
    font-size: 13px;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 30px;
  }

  .footer-section {
    width: 100%;
  }
}
</style>
