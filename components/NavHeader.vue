<template>
  <div class="navbar">
    <div class="navbar-header">
      <a class="navbar-brand" href="/">
        <img src="/images/iBlog2_logo.png" />
        <span>iBlog</span>
      </a>
    </div>
    <div class="navbar-collapse">
      <ul>
        <li>
          <nuxt-link to="/">
            <font-awesome-icon :icon="['fas', 'pen-nib']"></font-awesome-icon>博客
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/guestbook">
            <font-awesome-icon :icon="['fas', 'comment-dots']"></font-awesome-icon>留言
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/about">
            <font-awesome-icon :icon="['fas', 'user']"></font-awesome-icon>关于
          </nuxt-link>
        </li>
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
  display: inline-block;
  height: 70px;
  line-height: 70px;
  color: #2b2b2b;
  padding: 0 15px;
  font-size: 18px;
}

.navbar .navbar-brand img {
  height: 46px;
  display: inline-block;
  margin-top: -4px;
  margin-right: 6px;
}

.navbar-collapse ul {
  display: flex;
}

.navbar-collapse a {
  font-size: 16px;
  line-height: 69px;
  padding: 0 13px;
  border-bottom: 1px solid transparent;
  color: #333;
  -ms-opacity: 0.8;
  opacity: 0.8;
}

.navbar-collapse a:hover {
  -ms-opacity: 1;
  opacity: 1;
}

.navbar-collapse svg {
  margin-right: 4px;
}
</style>