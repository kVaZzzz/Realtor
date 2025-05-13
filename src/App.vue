<template>
<AppHeader :class="{ 'custom-header': isCustomHeader }"></AppHeader>
<main>
  <router-view></router-view>
</main>
  <AppFooter v-if="showFooter" :class="{ 'custom-footer': isCustomFooter }" />
</template>

<script setup>
import axios from "axios";
import { thisUrl } from "./url.js";
import { ref, provide, watch } from 'vue';
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import { useRoute } from 'vue-router';
import '@/assets/fonts/fonts.css';

const route = useRoute();
const headerBackground = ref('');
const showFooter = ref(true);
const isCustomHeader = ref(false);
const isCustomFooter = ref( false)
watch(route, (newRoute) => {
  if (newRoute.path === '/filters-search') {
    headerBackground.value = 'black';
    isCustomHeader.value = true;
  } else if (newRoute.path === '/') {
    isCustomHeader.value = true;
  } else if(newRoute.path ==='/create_announ'){
    headerBackground.value = 'white';
    isCustomHeader.value = true;
    isCustomFooter.value = true;
  }
}, { iammediate: true });
watch(route, (newRoute) => {
  if (newRoute.path === '/') {
    isCustomHeader.value = true;
  }
}, { immediate: true });
</script>

<style scoped>
.custom-header {
  position: absolute;
}

body{
  margin: 0;
  font-family: 'NotoSans', sans-serif;
}
</style>

