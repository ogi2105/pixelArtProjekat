<template>
  <nav class="navbar">
    <RouterLink to="/">Pocetna</RouterLink>
    <RouterLink to="/gallery">Galerija</RouterLink>
    <RouterLink to="/drawing">Nov ctrez</RouterLink>
    <RouterLink to="/login">Prijava</RouterLink>
    <RouterLink to="/register">Registracija</RouterLink>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  gap: 15px;
  align-items: center;
}

.navbar a {
  text-decoration: none;
  color: #495057;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
}

.navbar a:hover {
  color: #42b883;
  background-color: #f1f3f5;
}

.navbar a.router-link-exact-active {
  color: #ffffff;
  background-color: #42b883;
  font-weight: bold;
}
</style>
