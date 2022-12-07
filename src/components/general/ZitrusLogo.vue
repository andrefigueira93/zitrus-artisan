<template>
  <v-img
    :src="require('../../assets/zitrus.jpeg')"
    responsive
    class="rounded-circle"
  />
</template>

<script lang="ts">
export default {
  name: "ZitrusLogo",
  props: {
    size: {
      type: Number,
      default: 100,
      required: false,
    },
  },
};
</script>
