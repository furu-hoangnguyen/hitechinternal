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
                @click="item['function']"
              >
                <i v-if="item.icon" :class="item.icon"></i>{{ item.name }}
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
export default {
  name: "AccountPromotionTable",
  data() {
    return {
      fields: [
        "明細番号",
        "コメント",
        "店舗グループ名",
        "担当者名",
        "部門名",
        "販促費目",
        "入力タイプ",
        "区分",
        "ブランド区分",
        "カテゴリ",
        "",
        "品目コード",
        "品目略称",
        "荷姿",
        "未収金額(円)",
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
          icon: "fas fa-comment-medical",
          function: this.showmess,
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
          class: "size_lg",
        },
        {
          type: "select",
          value: "",
          options: [{ value: "a", text: "This is First option" }],
          class: "size_xl",
        },
        {
          type: "select",
          value: "",
          options: [{ value: "a", text: "This is First option" }],
          class: "size_md",
        },
        {
          type: "select",
          value: "",
          options: [{ value: "a", text: "This is First option" }],
          class: "size_lg",
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
          class: "size_sm",
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
          class: "size_lg",
        },
        {
          type: "text",
          value: "",
          class: "size_md",
        },
      ],
      list: [],
    };
  },
  methods: {
    addItem() {
      this.list.push(this.items);
    },
    removeITem() {
      if (this.list.length > 1) {
        this.list.pop();
      }
    },
    showmess() {
      alert("111");
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
