<template>
  <div class="my-links-container">
    <!-- 页面主标题区域 -->
    <div class="my-links-title">
      <h1>{{ title }}</h1>
    </div>

    <!-- 友链分组列表，每个分组包含标题、描述和友链列表 -->
    <div v-for="(group, index) in linksData" :key="index" class="my-links-group">
      <!-- 分组标题容器 -->
      <div class="title-wrapper">
        <h3>{{ group.title }}</h3>
      </div>

      <!-- 分组描述文本 -->
      <p class="group-desc">{{ group.desc }}</p>

      <!-- 友链列表容器 -->
      <div class="links-grid">
        <!-- 每个友链项使用LinkItem子组件展示，通过:data传递友链信息 -->
        <div v-for="link in group.list" :key="link.link" class="links-grid__item">
          <LinkItem :data="link" />
        </div>
      </div>
    </div>

    <!-- 留言/评论区域，默认显示，可通过frontmatter隐藏 -->

    <div v-if="shouldShow" class="my-message-section">
      <div class="title-wrapper">
        <h3>留链吗</h3>
      </div>
      <p>留恋的小伙伴，想要和我做友链 💞</p>

      <!-- 留言卡片容器 -->
      <div class="message-card">
        <p>欢迎在评论区留言，格式如下：</p>
        <!-- 示例格式 -->
        <pre>
名称: One
链接: https://onedayxyy.cn/
头像: https://img.onedayxyy.cn/images/Teekwebsite/xyy-logo.webp
站点截图：https://img.onedayxyy.cn/images/image-20250502073710566.png
描述: 明心静性，爱自己</pre>
        <!-- 评论区插槽 -->
        <!-- 默认为Twikoo评论组件，可通过插槽自定义其他评论系统 -->
        <slot name="comments">
          <Twikoo />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>

import { useData } from "vitepress";
import LinkItem from "./LinkItem.vue";
// 导入Twikoo评论组件
// import Twikoo from "../Twikoo.vue";
import { computed } from 'vue'

/**
 * 单个友链的数据结构定义
 * @typedef {Object} Link
 * @property {string} name - 友链网站名称
 * @property {string} link - 友链网站URL地址
 * @property {string} avatar - 友链网站头像/Logo的图片URL
 * @property {string} descr - 友链网站的简短描述
 * @property {boolean} [irregular] - 可选参数，默认值为false，为false时将把头像处理为圆形
 */

/**
 * 友链分组的数据结构定义
 * @typedef {Object} LinkGroup
 * @property {string} title - 分组标题
 * @property {string} desc - 分组描述文字
 * @property {Link[]} list - 该分组下的友链列表数组
 */

// 从页面frontmatter中获取配置数据
const { frontmatter } = useData();

// 从frontmatter中读取links字段，如果未定义则使用空数组
const linksData = computed(() => frontmatter.value.links || []);

// 从frontmatter中读取title字段，默认值为"我的友链"
const title = computed(() => frontmatter.value.title || '我的友链');

// 当frontmatter中comments为false时隐藏，默认显示
const shouldShow = computed(() => frontmatter.value.comments !== false);
</script>

<style scoped>
/* 主容器样式 */
/* 限制最大宽度并居中显示，添加内边距和字体设置 */
.my-links-container {
  max-width: 1500px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

/* 标题区域样式 */
.my-links-title {
  margin-bottom: 50px;
}

/* 主标题样式 */
.my-links-title h1 {
  font-size: 2rem;
  font-weight: 600;
  background: -webkit-linear-gradient(10deg, #bd34fe 5%, #e43498 15%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  line-height: 1.2;
  display: inline-block;
}

/* 分组标题装饰线样式，实现带中线的标题效果，标题文字悬浮在中线上 */
.title-wrapper {
  position: relative;
  margin: 40px 0;
  height: 1px;
  background: #ddd;
  transition: 0.3s;
}

/* 分组标题文字样式，绝对定位使标题居中显示在装饰线上方，添加背景色覆盖装饰线 */
.title-wrapper h3 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: var(--vp-c-bg);
  padding: 0 20px;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  z-index: 1;
}

/* 分组描述文字样式，居中显示，使用次要文本色，调整间距 */
.group-desc {
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  margin-bottom: 30px;
}

/* 友链网格布局核心样式，采用flex布局实现响应式网格，支持自动换行和居中对齐 */
.links-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  margin-bottom: 60px;
  padding: 0 8px;
}

/* 友链项容器样式，控制每个友链卡片的宽度，实现响应式布局 */
.links-grid__item {
  flex: 1;
  min-width: 200px;
  /* 电脑端最大4列：25%宽度减去均分的gap间距 */
  max-width: calc(25% - 18px);
  break-inside: avoid;
}

/* 响应式布局调整，根据屏幕宽度动态调整每行显示的友链数量 */
@media (max-width: 991px) {

  /* 平板端（768-991px）：最大2列布局 */
  .links-grid__item {
    max-width: calc(50% - 12px);
  }
}

@media (max-width: 767px) {

  /* 手机端（≤767px）：单列布局，卡片占满宽度 */
  .links-grid__item {
    max-width: 100%;
    min-width: 100%;
  }
}

/* 留言区样式 */
.my-message-section {
  text-align: center;
  margin-top: 20px;
}

/* 留言卡片样式，带阴影的卡片设计，使用主题色变量保持风格统一 */
.message-card {
  width: 100%;
  max-width: 1500px;
  margin: 30px auto;
  padding: 32px;
  border-radius: 12px;
  background: var(--vp-c-bg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  /* 轻微阴影效果 */
  border: 1px solid var(--vp-c-divider);
  text-align: left;
  transition: all 0.2s ease;
}

/* 移动端留言卡片适配 */
@media (max-width: 768px) {
  .message-card {
    padding: 24px;
    margin: 24px auto;
  }
}

/* 示例格式代码块样式 */
.message-card pre {
  background: var(--vp-code-block-bg);
  padding: 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid var(--vp-c-divider);
  line-height: 1.5;
}

/* 留言卡片悬停效果 */
.message-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
}
</style>