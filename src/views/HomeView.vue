<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home-container">
    <!-- Uvodna (Hero) sekcija -->
    <section class="hero">
      <h1 class="hero-title"> Pixel Art! 🎨</h1>
      <p class="hero-subtitle">
      </p>
      <div class="hero-buttons">
        <RouterLink to="/drawing" class="btn primary">Nov crtez ✏️</RouterLink>
        <RouterLink to="/gallery" class="btn secondary">Pogledaj galeriju (uskoro...) 🖼️</RouterLink>
      </div>
    </section>

    <!-- Sekcija sa karticama (funkcionalnosti) -->
    <section class="features">
      <div class="feature-card">
        <h3>Jako lako</h3>
        <p>Intuitivna tabla za crtanje sa izborom boja i alatima</p>
      </div>
      <div class="feature-card">
        <h3>Deljenje sa drugima</h3>
        <p>Sačuvaj svoje radove i podeli ih sa drugima u javnoj galeriji. (uskoro...)</p>
      </div>
      <div class="feature-card">
        <h3>Kolaboracija</h3>
        <p>Radi na zajedničkim projektima. (uskoro...)</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 2rem 1rem;
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}

.hero-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 800;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: #6c757d;
  max-width: 650px;
  margin: 0 auto 2rem auto;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
}

.btn.primary {
  background-color: #42b883;
  color: white;
  box-shadow: 0 4px 10px rgba(66, 184, 131, 0.3);
}

.btn.primary:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
}

.btn.secondary {
  background-color: #ffffff;
  color: #495057;
  border: 1px solid #ced4da;
}

.btn.secondary:hover {
  background-color: #f1f3f5;
  transform: translateY(-2px);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #eaeaea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.feature-card p {
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}
</style>
