<template>
  <v-main class="grey lighten-5">
    <router-view v-slot="{ Component, route }">
      <!-- Use any custom transition and  to `fade` -->
      <transition :name="route.meta.transitionName || 'fade'">
        <component :is="Component" />
      </transition>
    </router-view>
  </v-main>
</template>

<script>
export default {};
</script>
