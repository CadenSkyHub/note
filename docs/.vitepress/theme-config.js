import nav_bar from "../nav_bar";    // 导入导航栏
import side_bar from "../side_bar"; // 导入侧边栏

/*
* 主题配置
* */
export default {
    // 网站标题
    siteTitle: '< ~/ > & 笔记',
    // 导航栏
    nav: nav_bar,
    // 页面侧边栏
    sidebar: side_bar,
    // logo
    logo: '/logo.png',
    // onThisPage
    outlineTitle: '目录',
    // 上下页
    docFooter: {
        prev: '上一页',
        next: '下一页'
    },
    // 手机端 MENU
    sidebarMenuLabel: '菜单',
    // 主题切换按钮
    darkModeSwitchLabel: '暗黑模式',
    // 手机端返回顶部
    returnToTopLabel: '返回顶部',
    // 目录输出层级
    outline: [2, 3],
    // 搜索
    search: {
        provider: 'local'
    },
    // 在 github 编辑此页
    editLink: {
        pattern: 'https://github.com/watele0528/note/tree/main/docs/:path',
        text: '在 GitHub 上编辑此页'
    },
    // 上次更新时间
    lastUpdatedText: '更新时间',

    // 社交
    socialLinks: [
        {
            icon: {
                svg:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
                    '<title>Wechat</title>' +
                    '<path xmlns="http://www.w3.org/2000/svg" fill="currentColor" d="M15.85 8.14c.39 0 .77.03 1.14.08C16.31 5.25 13.19 3 9.44 3c-4.25 0-7.7 2.88-7.7 6.43c0 2.05 1.15 3.86 2.94 5.04L3.67 16.5l2.76-1.19c.59.21 1.21.38 1.87.47c-.09-.39-.14-.79-.14-1.21c-.01-3.54 3.44-6.43 7.69-6.43zM12 5.89a.96.96 0 1 1 0 1.92a.96.96 0 0 1 0-1.92zM6.87 7.82a.96.96 0 1 1 0-1.92a.96.96 0 0 1 0 1.92z"/>' +
                    '<path xmlns="http://www.w3.org/2000/svg" fill="currentColor" d="M22.26 14.57c0-2.84-2.87-5.14-6.41-5.14s-6.41 2.3-6.41 5.14s2.87 5.14 6.41 5.14c.58 0 1.14-.08 1.67-.2L20.98 21l-1.2-2.4c1.5-.94 2.48-2.38 2.48-4.03zm-8.34-.32a.96.96 0 1 1 .96-.96c.01.53-.43.96-.96.96zm3.85 0a.96.96 0 1 1 0-1.92a.96.96 0 0 1 0 1.92z"/>' +
                    '</svg>'
            },
            link: ''
        }
    ]
}