<template>
  <b-container fluid class="p-0 main">
    <HeaderComponent />

    <b-container fluid class="wapper_login">
      <div class="title_login">ログイン画面</div>

      <b-row class="justify-content-center">
        <b-form>
          <b-form-group
            label="ID"
            label-for="shainCd"
          >
            <b-form-input
              id="shainCd"
              type="text"
              placeholder="ID"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label="Password"
            label-for="password"
          >
            <b-form-input
              id="password"
              type="password"
              placeholder="Password"
            ></b-form-input>
          </b-form-group>

          <b-form-group>
            <b-form-checkbox-group class="float-right">
              <b-form-checkbox value="accepted">ログイン情報を保存する</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>

          <b-button type="submit" class="btn_submit_login">ログイン</b-button>
        </b-form>
      </b-row>

    </b-container>
  </b-container>
</template>

<script>
import HeaderComponent from '@/components/header/HeaderComponent';

export default {
  name: "Login",
  data() {
    return {}
  },
  components: {
    HeaderComponent
  }
}
</script>

<style lang="scss">

@import "@/assets/scss/login.scss";

</style>