import request from "@/utils/request.js";


/**
 * 分页查询文章列表
 * @param {Object} queryParams 查询参数,包括 current（当前页码）和 size（每页大小）
 * @returns {Promise} 返回一个 Promise,表示请求结果
 */
export function listArticlesWithPagination(queryParams) {
    return request({
        url: '/article/paginated-list', // 请求的 URL 路径
        method: 'get', // 请求方法为 GET
        params: queryParams, // 请求的查询参数,传递给后台
    });
}

