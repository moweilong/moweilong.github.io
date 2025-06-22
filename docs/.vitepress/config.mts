// .vitepress/config.mts
import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";

import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons"; // 导入代码组图标插件
import timeline from "vitepress-markdown-timeline"; // 导入时间线插件
import { La51Plugin } from "vitepress-plugin-51la"; //导入 51la统计
import { Nav } from "./ConfigHyde/Nav"; // 导入Nav模块
import type { HeadConfig } from "vitepress"; // 在文件顶部添加类型导入
import { HeadData } from "./ConfigHyde/Head"; // 导入 HeadData 导入和类型断言
import { SocialLinks } from "./ConfigHyde/SocialLinks"; //导入社交链接配置
import { CommentData } from "./ConfigHyde/Comment"; //导入评论配置
import { Wallpaper } from "./ConfigHyde/Wallaper"; // 导入Wallaper模块
import { visualizer } from "rollup-plugin-visualizer"; // 导入可视化分析插件
import viteImagemin from "vite-plugin-imagemin"; // 导入图片压缩插件
import llmstxt from "vitepress-plugin-llms"; // 导入llmstxt插件

const description = [
  "欢迎来到老莫想吃鱼知识库",
  "温故而知新，忘记了，就回来看看！",
].toString();

const CoverImgList = Wallpaper; // 获取壁纸列表

// Teek 主题配置
const teekConfig = defineTeekConfig({
  // 全局配置
  // https://vp.teek.top/reference/config/global-config.html#%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE
  // 转到配置文件 docs/.vitepress/theme/config/teekConfig.ts 
  // teekTheme: true, // 是否启用主题
  // teekHome: true, // 是否启用 Teek 的首页风格
  // vpHome: false, // 是否启用 VitePress 首页风格
  backTopDone: TkMessage => TkMessage.success({
    message:"已达到顶部🎉",
    duration: 3000,
  }),
  toCommentDone: TkMessage => TkMessage.success({
    message: "已达到评论区✨",
    duration: 3000,
  }),
  // 新版代码块配置
  codeBlock: {
    disabled: false, // 是否禁用新版代码块
    collapseHeight: 700, // 超出高度后自动折叠，设置 true 则默认折叠，false 则默认不折叠
    copiedDone: (TkMessage) => TkMessage.success("代码已复制 🎉"),
  },

  page: {
    pageSize: 16, // 每页显示的文章数量
  },
  post: {
    coverImgMode: "full", // 封面图模式，default 为默认，full 为全图
    showMore: true, // 是否显示更多按钮
  },

  // author: { name: "老莫想吃鱼了", link: "https://wiki.moweilong.com/" }, // 作者信息

  articleAnalyze: {
    imageViewer: { hideOnClickModal: true }, // 图片预览是否点击遮罩层关闭}
    showIcon: true, // 作者、日期、分类、标签、字数、阅读时长、浏览量等文章信息的图标是否显示
    // dateFormat: "yyyy-MM-dd hh:mm:ss", // 文章日期格式，首页和文章页解析日期时使用
    dateFormat: "yyyy-MM-dd", // 文章日期格式，首页和文章页解析日期时使用
    showInfo: true, // 是否展示作者、日期、分类、标签、字数、阅读时长、浏览量等文章信息，分别作用于首页和文章页
    showAuthor: true, // 是否展示作者
    showCreateDate: true, // 是否展示创建日期
    showUpdateDate: true, // 是否展示更新日期，是否展示更新时间，仅在文章页显示
    showCategory: true, // 是否展示分类
    showTag: true, // 是否展示标签
    // 将文章信息传到一级标题下面
    teleport: {
      selector: "h1",
      position: "after",
      className: "h1-bottom-info",
    },
  },

  // 超过半年的文章自动提示文章内容可能已过时
  articleTopTip: (frontmatter) => {
    const tip: Record<string, string> = {
      type: "warning",
      text: "文章发布较早，内容可能过时，阅读注意甄别。",
    };

    // 大于半年，添加提示
    const longTime = 6 * 30 * 24 * 60 * 60 * 1000;
    if (
      frontmatter.date &&
      Date.now() - new Date(frontmatter.date).getTime() > longTime
    )
      return tip;
  },

  // 评论配置
  comment: {
    provider: "twikoo",
    options: CommentData,
  },

  // 公告
  notice: {
    enabled: true, // 是否启用公告功能
    title: "公告", // 公告标题，支持函数式：需要和国际化搭配使用，根据不同语言环境返回不同标题
    initOpen: true,
    duration: 3000, // 弹框定时自动关闭，0 不自动消失
    mobileMinify: false, // 移动端自动最小化
    reopen: true, // 关闭公告弹框后，是否支持重新打开，如果为 false，则代表公告只显示一次
    useStorage: false, // 是否使用 localStorage 存储公告状态，如：当打开公告弹框后，下次进来则自动打开弹框
    twinkle: true, // 公告图标是否打开闪烁提示
    position: "center", // 公告弹框出现位置
  },

  vitePlugins: {
    sidebarOption: {
      // initItems: false, //这条命令注释后，才会让文档和目录的样式保持一致
      collapsed: true, //打开侧边栏自动收缩功能
      // ignoreList: ["nav"], //忽略的文件夹和文件
      ignoreWarn: true, // 忽略警告
    },
    autoFrontmatter: true, // 自动生成 frontmatter
    permalinkOption: {
      notFoundDelayLoad: 1000, // 1秒后加载
    },

    autoFrontmatterOption: {
      exclude: { title: true, date: true }, // 排除自动生成字段
      transform: (frontmatter) => {
        // 如果文件本身存在了 coverImg，则不生成
        if (frontmatter.coverImg) return; // 随机获取 coverImg

        const list = CoverImgList;

        const coverImg = list[Math.floor(Math.random() * list.length)];

        const transformResult = { ...frontmatter, coverImg };

        return Object.keys(transformResult).length
          ? transformResult
          : undefined;
      },
    },
  },

  markdown: {
    config: md => {
      md.use(timeline); //时间线插件
      md.use(groupIconMdPlugin); // 代码组图标插件
    },
  },

  // 站点分析
  siteAnalytics: [
    {
      provider: "google",
      options: {
        id: "G-YDTSLB09YH",
      },
    },
    // {
    //   provider: "baidu",
    //   options: {
    //     id: "******",
    //   },
    // },
    // {
    //   provider: "umami",
    //   options: {
    //     id: "******",
    //     src: "**",
    //   },
    // },
  ],

  // 赞赏在文章下方
  appreciation: {
    position: "doc-after",
    options: {
      // buttonHtml: `<button>测试按钮</button>`,
      icon: "weChatPay", // 赞赏图标，内置 weChatPay 和 alipay
      expandTitle: "打赏支持", // 展开标题，支持 HTML
      collapseTitle: "下次一定", // 折叠标题，支持 HTML
      content: `<img src='/img/alipay/1.png'><img src='/img/alipay/2.png'>`, // 赞赏内容，支持 HTML
      expand: false, // 是否默认展开，默认 false
    },
  },
  // 赞赏在 文章导航栏下侧
  // appreciation: {
  //   position: "aside-bottom",
  //   options: {
  //     title: `<span style="color: var(--tk-theme-color)">欢迎打赏支持</span>`, // 赞赏标题，支持 HTML
  //     content: `<img src='/appreciation/WeChatPay.jpg'><img src='/appreciation/Alipay.jpg'>`, // 赞赏内容，支持 HTML
  //   },
  // },

  articleShare: { enabled: true }, // 文章分享

  // 分类卡片
  category: {
    enabled: true, // 是否启用分类卡片
    limit: 8, // 一页显示的数量
    autoPage: false, // 是否自动翻页
    pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
  },  
  // 标签卡片
  tag: {
    enabled: true, // 是否启用标签卡片
    limit: 21, // 一页显示的数量
    autoPage: false, // 是否自动翻页
    pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
  },

  // 精选文章卡片
  topArticle: {
    enabled: true, // 是否启用精选文章卡片
    limit: 5, // 一页显示的数量
    autoPage: false, // 是否自动翻页
    pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
    dateFormat: "yyyy-MM-dd hh:mm:ss", // 精选文章的日期格式
  },

  // 布蒜子统计分析
  docAnalysis: {
    createTime: "2021-10-19",
    statistics: {
      provider: "busuanzi",
    },
    wordCount: true,
    readingTime: true,
    // overrideInfo: [
    //   { key: "lastActiveTime", value: (_, currentValue) => `${currentValue}前` },
    //   { key: "totalPosts", label: "文章总数目" },
    // ],
    appendInfo: [{ key: "index", label: "序号", value: "One" }],
  },

  // 风险链接提示页
  riskLink: {
    enabled: true, //是否启用风险链接提示功能
    whitelist: ["https://onedayxyy.cn/", "https://vp.teek.top/", "https://teek.seasir.top/", /https:\/\/github.com/, /https:\/\/giee.com/], // 白名单，匹配到的链接不提示风险
    blacklist: [], // 黑名单，匹配到的链接提示风险
  },

  articleBottomTip: () => {
    return {
      type: "tip",
      title: "声明",
      text: `<p>作者：老莫想吃鱼了</p>
             <p>版权：此文章版权归 老莫想吃鱼了 所有，如有转载，请注明出处!</p>
             <p style="margin-bottom: 0">链接：可点击右上角分享此页面复制文章链接</p>
            `,
    };
  },

});

// VitePress 配置
// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: teekConfig,
  title: "老莫想吃鱼了",
  description: description,
  cleanUrls: true,
  lastUpdated: true,
  lang: "zh-CN",

  markdown: {
    // 开启行号
    lineNumbers: true,
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true,
    },
    // 更改容器默认值标题
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },

  // sitemap: {
  //   hostname: "https://vp.teek.top",
  //   transformItems: items => {
  //     const permalinkItemBak: typeof items = [];
  //     // 使用永久链接生成 sitemap
  //     const permalinks = (globalThis as any).VITEPRESS_CONFIG.site.themeConfig.permalinks;
  //     items.forEach(item => {
  //       const permalink = permalinks?.map[item.url];
  //       if (permalink) permalinkItemBak.push({ url: permalink, lastmod: item.lastmod });
  //     });
  //     return [...items, ...permalinkItemBak];
  //   },
  // },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/favicon.ico",
    darkModeSwitchLabel: "主题",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    lastUpdatedText: "上次更新时间",
    outline: {
      level: [2, 4],
      label: "本页导航",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    nav: Nav, // 导航栏配置

    socialLinks: SocialLinks, // 社交链接配置

    search: {
      provider: "local",
    },
    // editLink: {
    //   text: "在 GitHub 上编辑此页",
    //   pattern: "https://github.com/Kele-Bingtang/vitepress-theme-teek/edit/master/docs/:path",
    // },
  },

  // 运行后自动打开网页
  vite: {
    server: {
      open: true
    },
    plugins: [
      groupIconVitePlugin(), //代码组图标
      viteImagemin({
        gifsicle: { optimizationLevel: 7 },
        mozjpeg: { quality: 70 },
        pngquant: { quality: [0.7, 0.8] },
        svgo: {
          plugins: [
            { name: "removeViewBox" },
            { name: "removeEmptyAttrs", active: false },
          ],
        },
      }),
      llmstxt(), // 插入llmstxt

      La51Plugin({
        id: "你id",
        ck: "你ck",
        apply: "build", //（默认）：仅在 生产环境（用户访问正式网站）时加载统计代码。
      }),      
    ],
    //其他配置项 
    build: {
      chunkSizeWarningLimit: 35000, // 限制警告的块大小
      assetsInlineLimit: 4096, // 小于 4KB 的字体转为 base64
      minify: "terser", // 使用 Terser 进行代码压缩
      rollupOptions: {
        plugins: [
          visualizer({
            filename: "./stats.html", // 修改为当前目录下的相对路径
            open: false, // 打包后自动打开报告
            gzipSize: true, // 压缩大小
            brotliSize: true,
          }),
        ],
        output: {
          manualChunks: {
            theme: ["vitepress-theme-teek"],
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: true, // 移除所有 console.* 调用（生产环境建议开启）
          drop_debugger: true, // 移除 debugger 语句（生产环境必备）
          pure_funcs: ["console.info"], // 保留 console.info 调用（白名单机制）
          dead_code: true, // 移除不可达代码（消除死代码）
          arrows: true, // 将 function 转换为箭头函数（优化代码体积）
          unused: true, // 移除未使用的变量/函数（需确保不影响程序逻辑）
          join_vars: true, // 合并连续 var 声明（优化作用域）
          collapse_vars: true, // 内联单次使用的变量（体积优化）
        },
        format: {
          comments: false, // 移除所有注释（保留版权声明需使用正则表达式）
          beautify: false, // 禁用代码美化（进一步减小体积）
          preamble: "/* 项目版本 1.0.0 */", // 文件头部添加版权声明（需遵守 MIT 协议）
        },
        mangle: {
          toplevel: true, // 混淆顶级作用域变量名（保留 class/function 名称）
          properties: false, // 保留对象属性名（防止破坏 DOM 属性绑定）
        },
      },
    },
  },    
})
