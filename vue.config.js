/*
 * @,@Description: ,: 
 * @,@Version: ,: 1.0.0
 * @,@Author: ,: perfect
 * @,@Date: ,: 2021-02-09 09:26:03
 * @,@LastEditors: ,: perfect
 * @,@LastEditTime: ,: 2021-02-09 18:31:22
 */
module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    // 代理服务
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        //跳过host检查
        //disableHostCheck: true
    },
    //网页标签图标
    pwa: {
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico',
        }
    },
}
