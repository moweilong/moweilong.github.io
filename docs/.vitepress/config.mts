// .vitepress/config.mts
import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";

import timeline from "vitepress-markdown-timeline"; // 导入时间线插件
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons"; // 导入代码组图标插件
import { La51Plugin } from "vitepress-plugin-51la"; //导入 51la统计
import { CommentData } from "./ConfigHyde/Comment"; //导入评论配置
import { Wallpaper } from "./ConfigHyde/Wallaper"; // 导入Wallaper模块

const description = [
  "欢迎来到 vitepress-theme-teek 使用文档",
  "Teek 是一个基于 VitePress 构建的主题，是在默认主题的基础上进行拓展，支持 VitePress 的所有功能、配置",
  "温故而知新，忘记了，就回来看看！",
].toString();

const CoverImgList = Wallpaper; // 获取壁纸列表

// Teek 主题配置
const teekConfig = defineTeekConfig({
  // 全局配置
  // https://vp.teek.top/reference/config/global-config.html#%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE
  teekTheme: true, // 是否启用主题
  teekHome: true, // 是否启用 Teek 的首页风格
  vpHome: false, // 是否启用 VitePress 首页风格
  homeCardListPosition: "left", // 首页卡片栏列表位置
  anchorScroll: true, // 是否启用锚点滚动功能，即阅读文章时，自动将 h1 ~ h6 标题添加到地址栏 # 后面。
  viewTransition: true, //深色、浅色模式切换时是否开启过渡动画。
  themeSize: "default",
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

  author: { name: "老莫想吃鱼了", link: "https://moweilong.com/" }, // 作者信息

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

    nav: [
      { text: "🏡首页", link: "/" },

      // 笔记
      {
        text: '🗃️笔记',
        items: [
          {
            // 分组标题1
            text: '运维',
            items: [
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/linux.svg" alt="" style="width: 16px; height: 16px;">
                    <span>Linux</span>
                  </div>
                  `,
                link: '/linux',
              },
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/nginx.png" alt="" style="width: 16px; height: 16px;">
                    <span>Nginx</span>
                  </div>
                  `,
                link: '/nginx',
              },
            ],
          },
          {
            // 分组标题2
            text: '前端',
            items: [
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/html.png" alt="" style="width: 16px; height: 16px;">
                    <span>Html</span>
                  </div>
                  `,
                link: '/html',
              },
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/css.png" alt="" style="width: 16px; height: 16px;">
                    <span>Css</span>
                  </div>
                  `,
                link: '/css',
              },
            ],
          },
        {
            // 分组标题3
            text: '编程',
            items: [
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/python.png" alt="" style="width: 16px; height: 16px;">
                    <span>Python</span>
                  </div>
                  `,
                link: '/python',
              },
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/go.svg" alt="" style="width: 16px; height: 16px;">
                    <span>Go</span>
                  </div>
                  `,
                link: '/go',
              },
            ],
          },
          {
            text: '专题',
            items: [
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/博客.svg" alt="" style="width: 16px; height: 16px;">
                    <span>博客搭建</span>
                  </div>
                  `,
                link: '/blog',
              },
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/前端demo.svg" alt="" style="width: 16px; height: 16px;">
                    <span>前端demo</span>
                  </div>
                  `,
                link: '/qianduan-demo',
              },
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/Git.svg" alt="" style="width: 16px; height: 16px;">
                    <span>Git</span>
                  </div>
                  `,
                link: '/git',
              },
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/面试.svg" alt="" style="width: 16px; height: 16px;">
                    <span>面试</span>
                  </div>
                  `,
                link: '/mianshi',
              },
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/NAS.svg" alt="" style="width: 16px; height: 16px;">
                    <span>NAS</span>
                  </div>
                  `,
                link: '/NAS',
              },
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/脚本.svg" alt="" style="width: 16px; height: 16px;">
                    <span>脚本</span>
                  </div>
                  `,
                link: '/jiaoben',
              },
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/工具.svg" alt="" style="width: 16px; height: 16px;">
                    <span>工具</span>
                  </div>
                  `,
                link: '/tools',
              },
            ],
          },
          {
            text: '开源项目',
            items: [
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/teek.svg" alt="" style="width: 16px; height: 16px;">
                    <span>Teek-one</span>
                  </div>
                  `,
                link: '/teek',
              },
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/Typora.svg" alt="" style="width: 16px; height: 16px;">
                    <span>Typora-one</span>
                  </div>
                  `,
                link: '/typora-theme-one',
              },
              
            ],
          },
        ],
      },  

      // 生活
      {
        text: '🏓生活',
        items: [
          {
            // 分组标题1
            text: '娱乐',
            items: [
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/相册.svg" alt="" style="width: 16px; height: 16px;">
                    <span>相册</span>
                  </div>
                  `,
                link: 'https://photo.onedayxyy.cn/',
              },
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/电影.svg" alt="" style="width: 16px; height: 16px;">
                    <span>电影</span>
                  </div>
                  `,
                link: '/movie',
              },
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/音乐.svg" alt="" style="width: 16px; height: 16px;">
                    <span>音乐</span>
                  </div>
                  `,
                link: '/music',
              },
            ],
          },
          {
            // 分组标题2
            text: '小屋',
            items: [
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/精神小屋.svg" alt="" style="width: 16px; height: 16px;">
                    <span>精神小屋</span>
                  </div>
                  `,
                link: '/love',
              },
              {
                text: `
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <img src="/img/nav/时间管理.svg" alt="" style="width: 16px; height: 16px;">
                    <span>时间管理</span>
                  </div>
                  `,
                link: '/time-plan',
              },
            ],
          },
        ],
      },  

      // 索引
      {
        text: '👏索引',
        items: [
          { text: '📃分类页', link: '/categories' },
          { text: '🔖标签页', link: '/tags' },
          {
            text: `
              <div style="display: flex; align-items: center; gap: 4px;">
                <img src="/img/nav/归档.svg" alt="" style="width: 16px; height: 16px;">
                <span>归档页</span>
              </div>
              `,
            link: '/archives',
          },
          {
            text: `
              <div style="display: flex; align-items: center; gap: 4px;">
                <img src="/img/nav/清单.svg" alt="" style="width: 16px; height: 16px;">
                <span>清单页</span>
              </div>
              `,
            link: '/articleOverview',
          },
          {
            text: `
              <div style="display: flex; align-items: center; gap: 4px;">
                <img src="/img/nav/登录.svg" alt="" style="width: 16px; height: 16px;">
                <span>登录页</span>
              </div>
              `,
            link: '/login',
          },
          {
            text: `
              <div style="display: flex; align-items: center; gap: 4px;">
                <img src="/img/nav/风险提示.svg" alt="" style="width: 16px; height: 16px;">
                <span>风险链接提示页</span>
              </div>
              `,
            link: '/risk-link?target=https://onedayxyy.cn/',
          },
        ],
      },  

      // 关于
      {
        text: '🍷关于',
        items: [
          { text: '👋关于我', link: '/about-me' },
          { text: '🎉关于本站', link: '/about-website' },
          { text: '🌐网站导航', link: '/websites' },          
          { text: "👂留言区", link: "/liuyanqu" },
          { text: "💡思考", link: "/thinking" },
          {
            text: `
              <div style="display: flex; align-items: center; gap: 4px;">
                <img src="/img/nav/时间轴.svg" alt="" style="width: 16px; height: 16px;">
                <span>时间轴</span>
              </div>
              `,
            link: 'https://onedayxyy.cn/time-line/',
          },
          {
            text: `
              <div style="display: flex; align-items: center; gap: 4px;">
                <img src="/img/nav/网站统计.svg" alt="" style="width: 16px; height: 16px;">
                <span>网站统计</span>
              </div>
              `,
            link: 'https://umami.onedayxyy.cn/share/DzS4g85V8JkxsNRk/onedayxyy.cn',
          },
          {
            text: `
              <div style="display: flex; align-items: center; gap: 4px;">
                <img src="/img/nav/站点监控.svg" alt="" style="width: 16px; height: 16px;">
                <span>站点监控</span>
              </div>
              `,
            link: 'https://status.onedayxyy.cn/status/monitor',
          },

        ],
      },       
    ],

    socialLinks: [{ icon: "gitee", link: "https://gitee.com/onlyonexl/vitepress-theme-teek-one-public" }],

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
    

      La51Plugin({
        id: "你id",
        ck: "你ck",
        apply: "build", //（默认）：仅在 生产环境（用户访问正式网站）时加载统计代码。
      }),      
    ],
    //其他配置项 
    build: {
      assetsInlineLimit: 4096, // 小于 4KB 的字体转为 base64
      chunkSizeWarningLimit: 35000, // 限制警告的块大小   
      rollupOptions: {
        external: ['**/_*.md'], // 忽略所有以下划线开头的 Markdown 文件
      },      
    },
  },    
})
