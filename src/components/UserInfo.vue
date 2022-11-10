<template>
  <div class="user-info-parent">
    <div class="user-info">
      <div class="img">
        <span>UN</span>
      </div>

      <div class="info">
        <p>User Name</p>
        <p>mail@test.test</p>
      </div>
    </div>

    <!-- <div ref="searchContainer" class="search" :class="{active: toggleBorderClass}">
      <input @blur="toggleBorder" @click="toggleBorder" placeholder="Search" type="search" name="" id="">
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'user-info',
  data() {
    return {
      toggleBorderClass: false
    }
  },
  methods: {
    toggleBorder() {
      this.toggleBorderClass = !this.toggleBorderClass
    }
  }
}
</script>