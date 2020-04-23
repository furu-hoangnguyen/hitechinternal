<template>
  <b-container fluid class="p-0 main">
    <HeaderComponent />

    <b-container fluid class="wapper_login">
      <div class="title_login">ログイン画面</div>
      <div v-if="!submitted">
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
              v-model="user.id"
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
              v-model="user.password"
            ></b-form-input>
          </b-form-group>

          <b-form-group>
            <b-form-checkbox-group class="float-right">
              <b-form-checkbox value="accepted">ログイン情報を保存する</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>

          <b-button @click="authentication" class="btn_submit_login">ログイン</b-button>
        </b-form>
      </b-row>
      </div>
    </b-container>
  </b-container>
</template>

<script>
import HeaderComponent from '@/components/header/HeaderComponent';
import LoginService from "../services/LoginService";
export default {
  name: "Login",
  data() {
    return {
      user: {
        id: null,
        password: ""
      },
      submitted: false
    };
  },
  methods: {
    authentication() {
      var data = {
        username: this.user.id,
        password: this.user.password
      };

      LoginService.login(data)
              .then(response => {
                console.log(response.data);
                this.$router.push('/home')
              })
              .catch(e => {
                console.log(e);
              });
    }
  },
  components: {
    HeaderComponent
  }
}
</script>

<style lang="scss">
  @import "./src/assets/scss/login";
</style>