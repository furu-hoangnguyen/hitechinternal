<template>
  <b-container fluid class="p-0 main">
    <HeaderComponent />

    <div
      class="main-body"
      :class="{ collapseNav: hasCollpase }"
      v-if="sreenWidth > 1023"
    >
      <SidebarComponent 
        v-bind:has-collpase="hasCollpase" 
        v-on:is-show-sidebar="isShowSidebar" />

      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </b-container>
</template>

<script>
import HeaderComponent from '@/components/header/HeaderComponent';
import SidebarComponent from '@/components/sidebar/SidebarComponent';

export default {
  name: "HitechLayout",
  data() {
    return {
      hasCollpase: false,
    };
  },
  components: {
    HeaderComponent,
    SidebarComponent
  },
  computed: {
    sreenWidth() {
      return window.innerWidth;
    },
  },
  mounted() {
    console.log(this.sreenWidth);
  },
  methods: {
    isShowSidebar(hasCollpase) {
      this.hasCollpase = hasCollpase;
    }
  }
};
</script>

<style lang="scss" scoped></style>