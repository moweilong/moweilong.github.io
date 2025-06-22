<script setup lang="ts" name="TeekLayoutProvider">
import type { TeekConfig } from "vitepress-theme-teek";
import Teek, { teekConfigContext, clockIcon } from "vitepress-theme-teek";
import { useData } from "vitepress";
import { watch, nextTick, ref, provide } from "vue";
import { teekBlogCardConfig } from "../config/teekConfig";
import { useRibbon } from "../composables/useRibbon";
import { useRuntime } from "../composables/useRuntime";
// @ts-ignore
import ConfigSwitch from "./ConfigSwitch.vue";
// @ts-ignore
import ContributeChart from "./ContributeChart.vue";
// @ts-ignore
import NoticeContent from "./NoticeContent.vue"; //导入公告组件
// @ts-ignore
import BannerImgArrow from "./BannerImgArrow.vue"; //导入横幅图片箭头组件
// @ts-ignore
import NotFound from "./NotFound.vue";//导入404组件
// @ts-ignore
import GlobalGreet from "./GlobalGreet.vue";  //导入全局问候组件
// @ts-ignore
import TitleChange from "./TitleChange.vue" //导入网页标题变化
// @ts-ignore
import OhMyLive2D from "./OhMyLive2D.vue"  //导入看板娘组件
// @ts-ignore
import ScrollProgressBar from "./ScrollProgressBar.vue" //导入顶部滚动条组件
// @ts-ignore
import BackToTop from "./BackToTop.vue";  //导入返回顶部组件

const ns = "layout-provider";
const { frontmatter } = useData();

// 默认卡片风
const currentStyle = ref("blog-card");
const teekConfig = ref(teekBlogCardConfig);
provide(teekConfigContext, teekConfig);
// const currentStyle = ref("doc");
// const teekConfig = ref(teekDocConfig);
// provide(teekConfigContext, teekConfig);

// 彩带背景
const { start: startRibbon, stop: stopRibbon } = useRibbon({ immediate: false, clickReRender: true });
// 页脚运行时间
const { start: startRuntime, stop: stopRuntime } = useRuntime("2025-03-14 00:00:00", {
  prefix: `<span style="width: 16px; display: inline-block; vertical-align: -3px; margin-right: 3px;">${clockIcon}</span>本站已在地球上苟活了`,
});

const watchRuntimeAndRibbon = async (layout: string, style: string) => {
  const isHome = layout === "home";
  const isDoc = [undefined, "doc"].includes(layout);
  const isBlog = style.startsWith("blog");

  // 博客类风格的首页显示运行时间
  await nextTick();
  if (isHome && isBlog) startRuntime();
  else stopRuntime();
  // startRuntime();

  // 博客类风格的首页显示彩带 & 设置了 pageStyle 的文章页显示彩带
  if ((isHome && isBlog && style !== "blog-body") || (isDoc && teekConfig.value.pageStyle)) startRibbon();
  else stopRibbon();
};

watch(frontmatter, async newVal => watchRuntimeAndRibbon(newVal.layout, currentStyle.value), { immediate: true });

const handleConfigSwitch = (config: TeekConfig, style: string) => {
  teekConfig.value = config;

  watchRuntimeAndRibbon(frontmatter.value.layout, style);
};
</script>

<template>
  <Teek.Layout>
    <template #layout-top>
      <!-- 全局问候组件 -->
      <GlobalGreet />
      <!-- 看板娘组件 -->
      <OhMyLive2D />
      <!-- 顶部滚动条组件 -->
      <ScrollProgressBar />
      <!--网页标题切换组件  -->
      <TitleChange />
      <!-- 返回顶部组件 -->
      <BackToTop />
    </template>
    <template #teek-theme-enhance-bottom>
      <div :class="[ns, 'flx-align-center']">
        <ConfigSwitch v-model="currentStyle" @switch="handleConfigSwitch" />
      </div>
    </template>

    <template #nav-screen-content-after>
      <ConfigSwitch v-model="currentStyle" @switch="handleConfigSwitch" />
    </template>

    <template #teek-archives-top-before>
      <ContributeChart />
    </template>

    <template #not-found>
      <NotFound />
    </template>

    <template #teek-notice-content>
      <!-- 公告组件 -->
      <NoticeContent />
    </template>

    <template #teek-home-banner-feature-after>
      <!-- 横幅图片箭头组件 -->
      <BannerImgArrow />
    </template>
  </Teek.Layout>
</template>

<style lang="scss">
.tk-my.is-circle-bg {
  // margin-bottom: 15px;

  .tk-my__avatar.circle-rotate {
    margin-top: 90px;
  }
}
</style>
