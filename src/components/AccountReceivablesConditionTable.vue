<template>
  <b-table :fields="fields" :items="items">
    <template v-slot:cell(name)="data">
      {{ data.value.first }} {{ data.value.last }}
    </template>

    <!-- A custom formatted header cell for field 'name' -->
    <template v-slot:head(name)="data">
      <span class="text-info">{{ data.label.toUpperCase() }}</span>
    </template>

    <!-- A custom formatted footer cell for field 'name' -->
    <template v-slot:foot(name)="data">
      <span class="text-danger">{{ data.label }}</span>
    </template>
  </b-table>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      fields: [
        // A column that needs custom formatting
        { key: "name", label: "Full Name" },
        // A regular column
        "age",
        // A regular column
        "sex",
      ],
      items: [
        { name: { first: "John", last: "Doe" }, sex: "Male", age: 42 },
        { name: { first: "Jane", last: "Doe" }, sex: "Female", age: 36 },
        { name: { first: "Rubin", last: "Kincade" }, sex: "Male", age: 73 },
        {
          name: { first: "Shirley", last: "Partridge" },
          sex: "Female",
          age: 62,
        },
      ],
    };
  },
};
</script>

<style></style>
