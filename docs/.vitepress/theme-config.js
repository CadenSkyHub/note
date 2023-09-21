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
    outline: [2,3],
    // 搜索
    search: {
      provider: 'local'
    }
}