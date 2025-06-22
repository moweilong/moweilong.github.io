// 返回顶部挂件
<template>
    <div class="back_to_top" ref="toTop" :style="{
        top: top + 'px',
    }" @click="topTop"></div>
</template>
<script setup lang="ts" name="BackToTop">
import { useRoute } from "vitepress";
import { nextTick, onUnmounted, ref, watch } from "vue";
import { TkMessage } from "vitepress-theme-teek";

const route = useRoute();
const toTop = ref();
const top = ref<number>(-900);
const offsetHeight = ref<number>(0);

const topTop = () => {
    top.value = -900;
    window.scrollTo({
        top: 0,
        behavior: "smooth",
        // @ts-ignore Safari兼容
        ...(typeof CSS !== 'undefined' && CSS.supports('scroll-behavior', 'smooth') ? {} : { left: 0 })
    });
    TkMessage.success({
        message: '已达到顶部🎉',
        duration: 3000
    });
};

let animationFrame: number | null = null;

const backToTop = () => {
    if (!animationFrame) {
        animationFrame = requestAnimationFrame(() => {
            offsetHeight.value = document.documentElement.offsetHeight;
            const scrollTop = document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (scrollTop < 100) {
                top.value = -900;
            } else {
                // 计算实际可滚动距离
                const scrollableDistance = documentHeight - windowHeight;
                // 根据实际滚动比例计算小猫位置
                const scrollPercentage = Math.min(scrollTop / scrollableDistance, 1);
                top.value = (900 * scrollPercentage) - 900;
            }
            animationFrame = null;
        });
    }
};

window.addEventListener("scroll", backToTop);

onUnmounted(() => {
    window.removeEventListener("scroll", backToTop);
});

watch(
    () => route.path,
    () => {
        nextTick(() => {
            offsetHeight.value = document.querySelector("html")!.offsetHeight;
        });
    }
);
</script>
<style lang="scss" scoped>
@keyframes float {
    0% {
        -webkit-transform: translateY(0);
        -ms-transform: translateY(0);
        transform: translateY(0);
    }

    50% {
        -webkit-transform: translateY(-10px);
        -ms-transform: translateY(-10px);
        transform: translateY(-10px);
    }

    100% {
        -webkit-transform: translateY(0);
        -ms-transform: translateY(0);
        transform: translateY(0);
    }
}

.back_to_top {
    cursor: pointer;
    position: fixed;
    right: 40px;
    top: -900px;
    z-index: 1000;
    width: 70px;
    height: 900px;
    background: url("/backToTop/scroll.gif");
    transition: all 0.5s ease-in-out;
    opacity: 1;

    // 新增移动端隐藏
    @media (max-width: 768px) {
        background: none;
        pointer-events: none;
        width: 0;
        height: 0;
    }

    &:hover {
        animation: float 2s linear infinite;
    }
}
</style>