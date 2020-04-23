<template>
  <HitechLayout>
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
          >販促金管理項目 <i class="fas fa-angle-down"></i
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
              <b-form-input type="text" id="use_other_input"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="5" lg="5">
            <b-form-group
              id="fieldset-horizontal"
              label="内口銭/外口銭"
              label-for="internal_commission"
              class="label_input"
            >
              <b-form-input type="text" id="internal_commission"></b-form-input>
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
              label-for="billing_amount"
              class="label_input"
            >
              <b-form-select></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="5" lg="5">
            <b-form-group
              id="fieldset-horizontal"
              label="申請者名"
              label-for="billing_date"
              class="label_input"
            >
              <b-form-select></b-form-select>
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
          <b-col md="12" lg="6" class="attachFile_body px-2">
            <b-row>
              <b-col cols="3" class="p-0"><label>ファイル添付</label></b-col>
              <b-col cols="4">
                <b-button variant="none">ファイルを選択する</b-button>
              </b-col>
              <b-col cols="5">5</b-col>
            </b-row>
          </b-col>
          <b-col md="12" lg="6" class="attachFile_filename">
            <b-row no-gutters>
              <b-col md="auto" class="px-3"
                ><i class="fas fa-file"></i> <a href="#">ファイル名</a></b-col
              >
              <b-col md="6"><i class="fas fa-minus-circle"></i></b-col>
            </b-row>
            <b-row no-gutters>
              <b-col md="auto" class="px-3"
                ><i class="fas fa-file"></i> <a href="#">ファイル名</a></b-col
              >
              <b-col md="6"><i class="fas fa-minus-circle"></i></b-col>
            </b-row>
          </b-col>
        </b-row>
      </section>
      <section>
        <b-row class="label_input_header p-1 mt-3"
          >販促金管理項目 <i class="fas fa-angle-down"></i
        ></b-row>
        <b-row class="px-4 py-1 mt-3">
          <b-col md="5" lg="4" class="pl-0">
            <b-form-group
              label="支払場所"
              label-for="payment_place"
              class="label_input"
            >
              <b-form-select id="payment_place"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="5" lg="5">
            <b-form-group
              label="支払い方法"
              label-for="billing_date"
              class="label_input"
            >
              <b-form-select id="payment_method"></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="px-4 py-1 mt-3">
          <b-col md="5" lg="4" class="pl-0">
            <b-form-group
              id="fieldset-horizontal"
              label="支払予定日"
              label-for="payment_scheduled_date"
              class="label_input"
            >
              <b-form-input
                type="date"
                id="payment_scheduled_date"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="5" lg="5">
            <b-form-group
              id="fieldset-horizontal"
              label="支払日"
              label-for="payment_date"
              class="label_input"
            >
              <b-form-input type="date" id="payment_date"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="px-4 py-1 mt-3">
          <b-col md="7" lg="7" class="pl-0">
            <b-form-group
              label="支払先"
              label-for="payment_destination"
              class="label_input"
            >
              <b-form-input type="text" id="payment_destination"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="5" lg="5">
            <b-form-group
              label="銀行名"
              label-for="account_number"
              class="label_input"
            >
              <b-form-input type="text" id="account_number"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row class="px-4 py-1 mt-3">
          <b-col md="10" class="pl-0">
            <table class="table_payment">
              <tr>
                <th>支払金額</th>
                <th>8%対象品目(円)</th>
                <th>10%対象品目(円)</th>
                <th>合計金額(円)</th>
              </tr>
              <tr>
                <td>支払金額</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
              </tr>
              <tr>
                <td>品目</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
              </tr>
              <tr>
                <td>消費税</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
              </tr>
              <tr>
                <td>合計金額</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
              </tr>
            </table>
          </b-col>
        </b-row>
      </section>
      <section>
        <b-row class="label_input_header p-1 mt-3"
          >販売未収条件 <i class="fas fa-angle-down"></i
        ></b-row>

        <b-row class="px-4 py-1 mt-3 account_receivables_condition">
          <b-col md="10" class="pl-0 account_receivables_condition_table">
            <b-table
              :items="account_receivables_condition_items"
              :fields="account_receivables_condition_fields"
            >
              <template v-slot:table-caption>This is a table caption.</template>
            </b-table>
          </b-col>
          <b-col md="2" class="pl-0 account_receivables_condition_action">
            <i class="fas fa-plus-circle"></i>
            <i class="fas fa-copy"></i>
            <i class="fas fa-minus-circle"></i>
          </b-col>
        </b-row>
      </section>
    </b-container>
  </HitechLayout>
</template>

<script>
import HitechLayout from "../layout/HitechLayout";
export default {
  name: "CreatePage",
  components: { HitechLayout },
  data() {
    return {
      account_receivables_condition_items: [],
    };
  },
};
</script>

<style></style>
