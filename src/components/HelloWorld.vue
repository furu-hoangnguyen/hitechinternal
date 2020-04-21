<template>
  <HitechLayout>
   <h1>{{ msg }}</h1>
  </HitechLayout>
</template>

<script>
import HitechLayout from '../layout/HitechLayout'
export default {  
  name: 'HelloWorld',
  components:{HitechLayout},
  props: {
    msg: String
  }
}
</script>
<style lang="scss" scoped>
  h1{
    color: aquamarine;
  }
</style>
