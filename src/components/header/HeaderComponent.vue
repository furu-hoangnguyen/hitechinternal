<template>
  <b-row no-gutters class="main-header" align-h="between">
    <b-col cols="auto" align-v="center">
      <p class="my-0">
        未収金 <br />
        処理システム
      </p>
    </b-col>
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
</template>