<template>
  <div class="container">
    <nav-header></nav-header>
    <nuxt />
  </div>
</template>
<script>
import NavHeader from "~/components/NavHeader.vue";
export default {
  components: {
    NavHeader
  }
};
</script>
<style>
* {
  box-sizing: border-box;
}

*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-size: 16px;
  word-spacing: 1px;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: left;
  background-color: #fff;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.container {
  padding-top: 70px;
}

[tabindex="-1"]:focus:not(:focus-visible) {
  outline: 0 !important;
}

ol,
ul {
  margin-top: 0;
  margin-bottom: 10px;
  padding-left: 0;
  list-style: none;
}

p {
  margin-top: 0;
  margin-bottom: 1rem;
}

a {
  color: #444;
  text-decoration: none;
  background-color: transparent;
}

img {
  vertical-align: middle;
  border-style: none;
}

pre, code {
  font-family: Consolas, "Courier New", monospace;
}
</style>
