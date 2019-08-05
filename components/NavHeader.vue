<template>
  <div class="navbar">
    <div class="navbar-header">
      <a class="navbar-brand" href="/">
        <img src="/images/iBlog2_logo.png" />
        <span>xxx</span>
      </a>
    </div>
    <div class="navbar-collapse">
      <ul>
        <li>a</li>
        <li>b</li>
        <li>c</li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 70px;
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
  z-index: 3;
}

.navbar .navbar-brand {
  height: 70px;
  line-height: 70px;
  color: #2b2b2b;
  padding: 15px 15px;
  font-size: 18px;
}

.navbar .navbar-brand img {
    height: 50px;
    display: inline-block;
    margin-top: -4px;
    margin-right: 6px;
}
</style>