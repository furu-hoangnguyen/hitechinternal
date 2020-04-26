<template>
  <b-row class="px-4 py-1 mt-3 account_receivables_condition">
    <b-col md="10" class="pl-0 account_receivables_condition_table">
      <b-table-simple responsive>
        <b-thead>
          <b-tr>
            <b-th v-for="(item, index) in fields" :key="index">{{ item }}</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="(_item, _index) in list" :key="_index">
            <b-td v-for="(item, index) in _item" :key="index" align="center">
              <b-input
                v-if="item.type !== 'button' && item.type !== 'select'"
                :type="item.type"
                v-model="item.value"
                :plaintext="item.plaintext"
                :readonly="item.readonly"
                :class="item.class"
              ></b-input>
              <button
                v-if="item.type == 'button'"
                :class="item.class"
                :disabled="item.disabled"
                @click="item['function'](_index, index)"
              >
                <i
                  v-if="item.icon"
                  :class="[
                    item.icon,
                    {
                      color_red: item.hascomment == 0,
                      color_blue: item.hascomment == 1,
                      color_grey: item.hascomment == 2,
                    },
                  ]"
                ></i
                >{{ item.name }}
              </button>
              <b-form-select
                v-if="item.type == 'select'"
                v-model="item.value"
                :options="item.options"
                :class="item.class"
              ></b-form-select>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-col>
    <b-col md="2" class="pl-0 account_receivables_condition_action">
      <i class="fas fa-plus-circle" @click="addItem()"></i>
      <i class="fas fa-copy"></i>
      <i class="fas fa-minus-circle" @click="removeITem()"></i>
    </b-col>
  </b-row>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "AccountConfirmTable",
  data() {
    return {
      fields: [
        "明細番号",
        "",
        "明細",
        "コメント",
        "店舗グループ名",
        "担当者名",
        "部門名",
        "項目名",
        "",
        "品目コード",
        "品目略称",
        "容量",
        "入数",
        "生産者価格(円)",
        "口銭(%)",
        "c/s引条件(円)",
        "伝票NET(円)",
        "未収単価(円)",
        "最終手取単価(円)",
        "標準原価(営業)(円)",
        "販売本数",
        "未収金額(円)",
        "売上金額(円",
        "最終限界利益額(円)",
        "最終限界利益率(%)",
      ],
      items: [
        {
          type: "text",
          value: "",
          plaintext: true,
        },
        {
          type: "button",
          name: "",
          icon: "fas fa-exclamation color_red",
          function: "",
          disabled: true,
        },
        {
          type: "button",
          name: "",
          hascomment: 0,
          icon: "fas fa-check-circle",
          function: this.checkGoComment,
        },
        {
          type: "button",
          name: "",
          hascomment: 2,
          disabled: true,
          icon: "fas fa-comment-medical",
          function: this.showPopupComnent,
        },
        {
          type: "select",
          value: "",
          options: [{ value: "a", text: "This is First option" }],
          class: "size_xl",
        },
        {
          type: "text",
          value: "",
        },
        {
          type: "text",
          value: "",
        },
        {
          type: "select",
          value: "",
          options: [{ value: "a", text: "This is First option" }],
          class: "size_xl",
        },
        {
          type: "button",
          name: "商品検索",
          icon: null,
          function: this.showmess,
          class: "searchproduct size_md",
        },
        {
          type: "text",
          value: "",
        },
        {
          type: "text",
          value: "",
          readonly: true,
          class: "size_xl",
        },
        {
          type: "text",
          value: "",
          readonly: true,
          class: "size_md",
        },
        {
          type: "number",
          value: "",
        },
        {
          type: "number",
          value: "",
          class: "size_lg",
        },
        {
          type: "number",
          value: "",
          class: "size_sm",
        },
        {
          type: "number",
          value: "",
          class: "size_lg",
        },
        {
          type: "number",
          value: "",
          readonly: true,
          class: "size_lg",
        },
        {
          type: "number",
          value: "",
          class: "size_md",
        },
        {
          type: "number",
          value: "",
          readonly: true,
          class: "size_lg",
        },
        {
          type: "number",
          value: "",
          class: "size_md",
        },
        {
          type: "number",
          value: "",
          readonly: true,
          class: "size_lg",
        },
        {
          type: "number",
          value: "",
          readonly: true,
          class: "size_lg",
        },
        {
          type: "number",
          value: "",
          readonly: true,
          class: "size_lg",
        },
        {
          type: "number",
          value: "",
          readonly: true,
          class: "size_lg",
        },
        {
          type: "number",
          value: "",
          readonly: true,
          class: "size_lg",
        },
      ],
      list: [],
    };
  },
  methods: {
    addItem() {
      this.list.push(cloneDeep(this.items));
    },
    removeITem() {
      if (this.list.length > 1) {
        this.list.pop();
      }
    },
    checkGoComment(row, col) {
      if (this.list[row][col].hascomment) {
        this.list[row][col].hascomment = 0;
        this.list[row][col + 1].hascomment = 2;
        this.list[row][col + 1].disabled = true;
      } else {
        this.list[row][col].hascomment = 1;
        this.list[row][col + 1].hascomment = 0;
        this.list[row][col + 1].disabled = false;
      }
    },
    showPopupComnent() {
      this.$emit("showPopupComment");
    },
    showmess() {
      alert("...");
    },
  },
  created() {
    if (!this.list.length) {
      this.list.push(this.items);
    }
  },
};
</script>

<style></style>
