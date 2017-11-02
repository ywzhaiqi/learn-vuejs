<template>
  <div id="app">
    <p>
      <router-link to="/learn">参考文档</router-link>
      <router-link :to="{ name: 'user', params: { userId: 123 }}">Go to User 123</router-link>
      <router-link to="/user/123">Go to User 123</router-link>
      <router-link to="/speech">Speech Example</router-link>
    </p>

    <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

