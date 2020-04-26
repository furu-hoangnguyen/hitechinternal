<template>
  <section>
    <div class="createAcount-header">
      <div class="createAcount-header_account">
        <div>販売未収金申請</div>
        <div>
          <label class="my-0">申請番号:</label>
          <label class="my-0">決済番号:</label>
        </div>
      </div>
      <div class="createAcount-header_status">
        <div class="createAcount-header_status_item">
          ステータス
        </div>
      </div>
    </div>

    <b-container fluid class="bv-example-row">
      <section>
        <b-row class="label_input_header p-1"
          ><b-col cols="auto" class="pl-0"
            >販促金管理項目 <i class="fas fa-angle-down"></i></b-col
        ></b-row>
        <b-row class="px-4 py-1">
          <b-col md="5" lg="4" class="pl-0">
            <b-form-group
              id="fieldset-horizontal"
              label="対象年"
              label-for="targetDate"
              class="label_input"
            >
              <b-form-input type="date" id="targetDate"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="5" lg="7">
            <b-form-group
              id="fieldset-horizontal"
              label="取引先名"
              label-for="input-horizontal"
              class="label_input"
            >
              <b-form-input id="input-horizontal"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="2" lg="1" class="p-0">
            <b-button variant="none" class="btn_grey">取引先名検索</b-button>
          </b-col>
        </b-row>
        <b-row class="px-4 py-1 mt-3">
          <b-col md="5" lg="4" class="pl-0">
            <b-form-group
              id="fieldset-horizontal"
              label="用途"
              label-for="use_other_input"
              class="label_input"
            >
              <b-form-select id="use_other_input"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="5" lg="5">
            <b-form-group
              id="fieldset-horizontal"
              label="内口銭/外口銭"
              label-for="internal_commission"
              class="label_input"
            >
              <b-form-select id="internal_commission"></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="px-4 py-1 mt-3">
          <b-col md="5" lg="4" class="pl-0">
            <b-form-group
              id="fieldset-horizontal"
              label="請求金額(円)"
              label-for="billing_amount"
              class="label_input"
            >
              <b-form-input type="number" id="billing_amount"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="5" lg="5">
            <b-form-group
              id="fieldset-horizontal"
              label="請求日"
              label-for="billing_date"
              class="label_input"
            >
              <b-form-input type="date" id="billing_date"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row class="px-4 py-1 mt-3">
          <b-col md="5" lg="4" class="pl-0">
            <b-form-group
              id="fieldset-horizontal"
              label="部門名"
              label-for="field1"
              class="label_input"
            >
              <b-form-input type="date" id="field1"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="5" lg="5">
            <b-form-group
              id="fieldset-horizontal"
              label="申請者名"
              label-for="field2"
              class="label_input"
            >
              <b-form-input type="date" id="field2"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="px-4 py-1 mt-3">
          <b-col md="12" lg="12" class="pl-0">
            <b-form-group
              id="fieldset-horizontal"
              label="備考"
              label-for="Remarks"
              class="label_input label_textarea pr-0"
            >
              <b-form-textarea
                id="textarea"
                placeholder="....."
                rows="3"
              ></b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="px-4 py-1 attachFile mt-3">
          <b-col md="3" lg="auto" class="attachFile_body px-2 border-0">
            <b-row>
              <b-col cols="12" class="p-0"><label>ファイル添付</label></b-col>
            </b-row>
          </b-col>
          <b-col md="12" lg="6" class="attachFile_filename">
            <b-row no-gutters>
              <b-col md="auto" class="px-3"
                ><i class="fas fa-file"></i> <a href="#">ファイル名</a></b-col
              >
            </b-row>
            <b-row no-gutters>
              <b-col md="auto" class="px-3"
                ><i class="fas fa-file"></i> <a href="#">ファイル名</a></b-col
              >
            </b-row>
          </b-col>
        </b-row>
      </section>
      <section>
        <b-row class="label_input_header p-1 mt-3"
          ><b-col cols="auto" class="pl-0"
            >支払金額 <i class="fas fa-angle-down"></i></b-col
        ></b-row>
      </section>
      <section>
        <b-row class="label_input_header p-1 mt-5"
          ><b-col cols="auto" class="pl-0"
            >販売未収条件 <i class="fas fa-angle-down"></i></b-col
        ></b-row>
        <AccountConfirmTable
          @showPopupComment="isShowPopupComment = !isShowPopupComment"
        />
        <b-row class="label_input_header p-1 mt-5"
          ><b-col cols="auto" class="pl-0"
            >税8%販促費 <i class="fas fa-angle-down"></i></b-col
        ></b-row>

        <b-row class="label_input_header p-1 mt-5"
          ><b-col cols="auto" class="pl-0"
            >税10%販促費 <i class="fas fa-angle-down"></i></b-col
        ></b-row>

        <b-row class="label_input_header p-1 mt-5"
          ><b-col cols="auto" class="pl-0"
            >物流費 <i class="fas fa-angle-down"></i></b-col
        ></b-row>
      </section>
      <b-sidebar
        :visible="isShowPopupComment"
        class="commentSidebar"
        right
        no-header
      >
        <b-row no-gutters class="commentSidebar-header px-3 pt-2">
          <b-col cols="12">販売未収条件 明細コメント </b-col>
          <b-col cols="8">
            <b-button tag="a" variant="none">@(1001)</b-button></b-col
          >
          <b-col cols="4" class="text-right"
            ><i
              class="fas fa-arrow-right"
              @click="isShowPopupComment = false"
            ></i
          ></b-col>
        </b-row>

        <b-row no-gutters class="commentSidebar-cotent mx-3 bg-light">
          <textarea rows="6" class="w-100"> </textarea>
          <b-col cols="12" class="mt-2 text-dark">
            <b-form-checkbox
              id="checkbox-1"
              name="checkbox-1"
              value="accepted"
              class="ml-2"
              unchecked-value="not_accepted"
            >
              I accept the terms and use
            </b-form-checkbox></b-col
          >

          <b-col cols="12" class="mt-2 text-dark">
            <b-form-checkbox
              id="checkbox-2"
              name="checkbox-2"
              value="accepted"
              class="ml-2"
              unchecked-value="not_accepted"
            >
              I accept the terms and use
            </b-form-checkbox>
          </b-col>
          <b-col cols="12" class="mt-2 text-dark">
            <b-form-checkbox
              id="checkbox-3"
              name="checkbox-3"
              value="accepted"
              unchecked-value="not_accepted"
              class="ml-2"
            >
              I accept the terms and use
            </b-form-checkbox>
          </b-col>
        </b-row>

        <b-row no-gutters class="commentSidebar_handle px-3 mt-2">
          <b-col cols="6" class="pr-1">
            <b-button variant="none" class="w-100 text-light"
              >過去のコメントを再利用ボタン</b-button
            >
          </b-col>
          <b-col cols="6" class="pl-2">
            <b-button variant="none" class="w-100 text-light"
              >入力するボタン</b-button
            >
          </b-col>
        </b-row>
        <b-row no-gutters class="commentSidebar_user px-3 mt-2">
          <b-col cols="12">
            a
          </b-col>
          <b-col cols="12">
            b
          </b-col>
          <b-col cols="12">
            c
          </b-col>
        </b-row>
      </b-sidebar>
    </b-container>
  </section>
</template>

<script>
export default {
  name: "RequestAccountConfirmPage",
  data() {
    return {
      isShowPopupComment: false,
    };
  },
  created() {},
};
</script>

<style></style>
