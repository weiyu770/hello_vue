import request from '@/utils/request';

// 获取后台分类列表（分页）
// 对应后端的 /admin/category/list
export const articleCategoryBackListService = (params) => {
    return request.get('/admin/category/list', { params });
};

// 添加分类
// 对应后端的 /admin/category/add
export const articleCategoryAddService = (categoryData) => {
    return request.post('/admin/category/add', categoryData);
};

// 批量删除分类
// 对应后端的 /admin/category/delete
export const articleCategoryDeleteService = (idList) => {
    return request.delete('/admin/category/delete', { data: idList });
};

// 修改分类
// 对应后端的 /admin/category/update
export const articleCategoryUpdateService = (categoryData) => {
    return request.put('/admin/category/update', categoryData);
};

// 获取分类选项（供下拉框使用）
// 对应后端的 /admin/category/option
export const categoryOptionListService = () => {
    return request.get('/admin/category/option');
};

// 获取前台分类列表
// 对应后端的 /category/list
export const articleCategoryListService = () => {
    return request.get('/category/list');
};

// 获取分类下的文章
// 对应后端的 /category/article
export const articleByCategoryService = (params) => {
    return request.get('/category/article', { params });
};


// 删除单个分类
// 对应后端的 /deleteCategory/{id}
export const articleCategoryDeleteByIdService = (id) => {
    return request.delete(`/deleteCategory/${id}`);
};