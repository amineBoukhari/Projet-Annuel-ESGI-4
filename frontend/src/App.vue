<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
<h1>Welcome to Your Vue.js App 7</h1>

</template>

<script>
fetch('http://localhost:3000/')
  .then(response => response.text())
  .then(data => console.log(data));
</script>

