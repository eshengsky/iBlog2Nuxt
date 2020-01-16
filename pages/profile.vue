<template>
  <div>
    <div class="profile-container">
      <div class="avatar-wrap">
        <svg
          id="Layer_1"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 617.094 565.81"
          enable-background="new 0 0 617.094 565.81"
          xml:space="preserve"
        >
          <linearGradient
            id="SVGID_1_"
            gradientUnits="userSpaceOnUse"
            x1="116.2168"
            y1="278.7119"
            x2="587.2197"
            y2="278.7119"
          >
            <stop offset="0" style="stop-color:#CCE0F4" />
            <stop offset="0.0641" style="stop-color:#C3DCF2" />
            <stop offset="0.1706" style="stop-color:#A9D2EE" />
            <stop offset="0.3066" style="stop-color:#80C2E7" />
            <stop offset="0.4649" style="stop-color:#47ACDE" />
            <stop offset="0.5674" style="stop-color:#1E9CD7" />
            <stop offset="0.8652" style="stop-color:#0075BE" />
            <stop offset="0.9944" style="stop-color:#005B97" />
          </linearGradient>
          <path
            opacity="0.1"
            fill="url(#SVGID_1_)"
            d="M159.541,19.531c0,0,92.449-10.828,179.903,25.819c0,0,70.796,24.987,166.579,97.448
  c0,0,79.958,64.965,80.79,120.769c0,0,4.164,44.976-14.159,75.793c0,0-66.631,135.761-238.207,175.739
  c0,0-130.763,29.984-174.906,23.321S89.579,77.507,159.541,19.531z"
          />
          <g>
            <defs>
              <path
                id="XMLID_1_"
                d="M166.854,13.457c0,0,28.206-2.564,94.872,19.658c0,0,77.777,24.787,185.47,106.838
    c0,0,39.315,27.35,68.376,76.923c0,0,14.529,24.783,16.239,55.554c0,0,1.71,29.916-14.529,61.54c0,0-23.933,57.266-113.676,114.53
    c0,0-77.025,55.555-170.991,86.324c0,0-52.086,13.675-87.128,7.692c0,0-21.367-0.854-51.282-19.657
    c0,0-31.625-20.514-48.718-60.685c0,0-70.94-173.508,0-364.106C45.487,98.068,68.563,15.169,166.854,13.457z"
              />
            </defs>
            <use xlink:href="#XMLID_1_" overflow="visible" fill="#FFFFFF" />
            <clipPath id="XMLID_3_">
              <use xlink:href="#XMLID_1_" overflow="visible" />
            </clipPath>
            <g transform="matrix(1 0 0 1 1.436543e-006 5.325755e-007)" clip-path="url(#XMLID_3_)">

              <image id="svg_changing_id" overflow="visible" width="550" height="550" xlink:href="/assets/img/hero/svg3_1.jpg" />
            </g>
          </g>
        </svg>
      </div>
      <div class="desc-wrap">
        <div class="full-name">
          <span>Sky.Sun</span>
          <span>孙正华</span>
        </div>
        <div class="job-title">
          前端开发工程师
        </div>
        <div class="intro-me">
          毕业于某不知名二本院校软件工程专业，熟练掌握C#、ASP.NET、JavaScript、Node.js、div+css、MongoDB等语言或技术，具备Web全栈独立开发能力。
          爱好上网和游戏，完美主义者，细节控。
        </div>
        <div class="contact-me">
          <a href="https://github.com/eshengsky" title="Github">https://github.com/eshengsky</a>
          <div>
            eshengsky@163.com
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
export default Vue.extend({});
</script>
<style>
.profile-container {
  display: flex;

}

.avatar-wrap {
      width: 50%;
    text-align: right;
}

.desc-wrap {
  width: 50%;
}

.avatar-wrap svg {
  width: 100%;
      max-width: 400px;
}
</style>
