/**
 * @description:
 * @path: D:\备份\自己用的测试\my-vue\src\api\article\article.js
 * @author: yu_wei
 * @create: 2024/11/24 15:16
 */

import request from '@/utils/request';

/**
 * 获取后台文章列表
 * @param {Object} queryParams 文章查询参数
 * @returns {Promise}
 */
export function listArticleBack(queryParams) {
    return request({
        url: '/admin/article/list',
        method: 'get',
        params: queryParams,
    });
}

/**
 * 添加文章
 * @param {Object} article 文章信息
 * @returns {Promise}
 */
export function addArticle(article) {
    return request({
        url: '/admin/article/add',
        method: 'post',
        data: article,
    });
}

/**
 * 删除文章
 * @param {Array} articleIdList 文章ID集合
 * @returns {Promise}
 */
export function deleteArticle(articleIdList) {
    return request({
        url: '/admin/article/delete',
        method: 'delete',
        data: articleIdList,
    });
}

/**
 * 回收或恢复文章
 * @param {Object} deleteReq 逻辑删除请求体
 * @returns {Promise}
 */
export function recycleArticle(deleteReq) {
    return request({
        url: '/admin/article/recycle',
        method: 'put',
        data: deleteReq,
    });
}

/**
 * 修改文章
 * @param {Object} article 文章信息
 * @returns {Promise}
 */
export function updateArticle(article) {
    return request({
        url: '/admin/article/update',
        method: 'put',
        data: article,
    });
}

/**
 * 根据ID查看文章
 * @param {Number} articleId 文章ID
 * @returns {Promise}
 */
export function getArticleById(articleId) {
    return request({
        url: `/admin/article/edit/${articleId}`,
        method: 'get',
    });
}

/**
 * 上传文章图片/封面
 * @param {File} file 文件
 * @returns {Promise}
 */
export function uploadArticleImage(file) {
    let formData = new FormData();
    formData.append('file', file);
    return request({
        url: '/admin/article/upload',
        method: 'post',
        data: formData,
    });
}

/**
 * 置顶文章
 * @param {Object} topReq 置顶请求体
 * @returns {Promise}
 */
export function topArticle(topReq) {
    return request({
        url: '/admin/article/top',
        method: 'put',
        data: topReq,
    });
}

/**
 * 推荐文章
 * @param {Object} recommendReq 推荐请求体
 * @returns {Promise}
 */
export function recommendArticle(recommendReq) {
    return request({
        url: '/admin/article/recommend',
        method: 'put',
        data: recommendReq,
    });
}

/**
 * 点赞文章
 * @param {Number} articleId 文章ID
 * @returns {Promise}
 */
export function likeArticle(articleId) {
    return request({
        url: `/article/${articleId}/like`,
        method: 'post',
    });
}

/**
 * 搜索文章
 * @param {String} keyword 搜索关键字
 * @returns {Promise}
 */
export function searchArticles(keyword) {
    return request({
        url: '/article/search',
        method: 'get',
        params: { keyword },
    });
}

/**
 * 获取首页文章列表
 * @param {Object} queryParams 分页参数
 * @returns {Promise}
 */
export function listArticleHome(queryParams) {
    return request({
        url: '/article/list',
        method: 'get',
        params: queryParams,
    });
}

/**
 * 根据ID查看文章具体信息
 * @param {Number} articleId 文章ID
 * @returns {Promise}
 */
export function getArticleHomeById(articleId) {
    return request({
        url: `/article/${articleId}`,
        method: 'get',
    });
}

/**
 * 获取推荐文章列表
 * @returns {Promise}
 */
export function listRecommendedArticles() {
    return request({
        url: '/article/recommend',
        method: 'get',
    });
}

/**
 * 获取文章归档列表
 * @param {Object} queryParams 分页参数
 * @returns {Promise}
 */
export function listArchivedArticles(queryParams) {
    return request({
        url: '/archives/list',
        method: 'get',
        params: queryParams,
    });
}


/**
 * 取消点赞文章
 * @param {Number} articleId 文章ID
 * @returns {Promise}
 */
export function unlikeArticle(articleId) {
    return request({
        url: `/article/${articleId}/unlike`,
        method: 'post',
    });
}


