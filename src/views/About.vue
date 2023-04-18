<template>
  <div class="about">
    <h1>This is an about page</h1>
    <AnotherVue/>
  </div>
</template>
<script>
import AnotherVue from '../components/Another.vue'
export default {
  components: {
    AnotherVue
  }
}
</script>