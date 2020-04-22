<template>
  <div class="main-nav" :class="{ 'main-border': activeNum == 1 }">
    <div
      class="homeNav"
      :class="{ active: activeNum == 1 }"
      @click="activeNum = 1"
    >
      <div><i class="fas fa-home"></i></div>
      <p class="my-0">ホーム</p>
    </div>
    <div
      class="request"
      :class="{ active: activeNum == 2 }"
      @click="activeNum = 2"
    >
      <i class="fas fa-money-bill-wave"></i>請求
    </div>
    <div
      class="main-nav_function"
      :class="{ active: activeNum == 3 }"
      @click="activeNum = 3"
    >
      申請一覧
    </div>
    <div
      class="main-nav_function"
      :class="{ active: activeNum == 4 }"
      @click="activeNum = 4"
    >
      作成する
    </div>
    <div
      class="main-nav_function"
      :class="{ active: activeNum == 5 }"
      @click="activeNum = 5"
    >
      確認する
    </div>
    <div
      class="main-nav_function"
      :class="{ active: activeNum == 6 }"
      @click="activeNum = 6"
    >
      申請する
    </div>
    <div
      class="main-nav_function"
      :class="{ active: activeNum == 7 }"
      @click="activeNum = 7"
    >
      承認する
    </div>
    <button
      type="button"
      class="collapsebtn"
      @click="isShowSidebar()"
    >
      <i v-if="!hasCollpase" class="fas fa-arrow-left"></i>
      <i v-if="hasCollpase" class="fas fa-arrow-right"></i>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNum: 1
    }
  },
  props: [ 'hasCollpase' ],
  methods: {
    isShowSidebar() {
      this.$emit('is-show-sidebar', !this.hasCollpase)
    }
  }
}
</script>