<template>
  <router-view v-slot="{ Component, route }">
    <!-- Use any custom transition and  to `fade` -->
    <transition :name="route.meta.transitionName || 'fade'">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
export default {};
</script>
