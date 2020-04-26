<template>
  <b-container fluid class="bv-example-row p-0 main">
    <b-row no-gutters class="main-header" align-h="between">
      <b-row cols="auto" align-v="center">
        <b-col cols="auto"
          ><i class="fas fa-home"></i>
          <p class="my-0">
            未収金 <br />
            処理システム
          </p></b-col
        >
        <b-col class="main-nav_function" cols="auto">
          承認する <span class="main-nav_count">5</span>
        </b-col>
      </b-row>
      <b-col cols="auto" align-v="center" class="mr-5">
        <b-dropdown no-caret variant="none">
          <template v-slot:button-content>
            <i class="far fa-user iconUser"></i>
            <span class="mx-4">画面名機</span>
            <i class="fas fa-angle-down"></i>
          </template>
          <b-dropdown-item href="#">ユーザ情報を見る</b-dropdown-item>
          <b-dropdown-item href="#">マスタメニューを見る</b-dropdown-item>
          <b-dropdown-item href="#">ログアウトする</b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>
    <div class="main-body" :class="{ collapseNav: hascollpase }">
      <div
        class="main-nav"
        v-if="!isTabletDevice"
        :class="{ 'main-border': activeNum == 1 }"
      >
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
          作成する <span class="main-nav_count">2</span>
        </div>
        <div
          class="main-nav_function"
          :class="{ active: activeNum == 5 }"
          @click="activeNum = 5"
        >
          確認する <span class="main-nav_count">3</span>
        </div>
        <div
          class="main-nav_function"
          :class="{ active: activeNum == 6 }"
          @click="activeNum = 6"
        >
          申請する <span class="main-nav_count">4</span>
        </div>
        <div
          class="main-nav_function"
          :class="{ active: activeNum == 7 }"
          @click="activeNum = 7"
        >
          承認する <span class="main-nav_count">5</span>
        </div>
        <button
          type="button"
          class="collapsebtn"
          @click="hascollpase = !hascollpase"
        >
          <i v-if="!hascollpase" class="fas fa-arrow-left"></i>
          <i v-if="hascollpase" class="fas fa-arrow-right"></i>
        </button>
      </div>
      <div class="main-content">
        <slot />
      </div>
    </div>
  </b-container>
</template>

<script>
import isTablet from "@/helper/isTabletDevice";
export default {
  name: "LayoutSskf",
  data() {
    return {
      hascollpase: false,
      activeNum: 1,
    };
  },
  computed: {
    isTabletDevice() {
      return isTablet();
    },
  },
  created() {
    console.log(isTablet());
  },
};
</script>

<style lang="scss" scoped></style>
