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

pre code {
  font-size: 14px;
  font-family: Hack;
}

.pre-header {
  display: flex;
  justify-content: space-between;
  height: 36px;
}

.pre-header-left div {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  display: inline-block;
}

.pre-header-left div:nth-of-type(1) {
  background: rgb(255, 95, 86);
}

.pre-header-left div:nth-of-type(2) {
  background: rgb(255, 189, 46);
}

.pre-header-left div:nth-of-type(3) {
  background: rgb(39, 201, 63);
}

.pre-header-right {
  font-family: Hack;
  font-size: 12px;
  color: #777;
  -webkit-user-select: none;
  user-select: none;
}
</style>
