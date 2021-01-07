<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'GoAdminGit',
  data() {
    return {
      url: 'https://github.com/lanyulei/fiy'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
