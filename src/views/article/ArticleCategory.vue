<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'

// 引入 Element Plus 消息框和消息组件
import { ElMessageBox, ElMessage } from 'element-plus';

// 引入接口服务
import {
    articleCategoryListService,
    articleCategoryAddService,
    articleCategoryUpdateService,
    articleCategoryDeleteService,
    articleCategoryDeleteByIdService
} from '@/api/category.js'

// 分类数据
const categorys = ref([]);
const selectedCategories = ref([]);

// 获取文章分类列表
const articleCategoryList = async () => {
    try {
        const result = await articleCategoryListService();
        if (result && result.data) {
            categorys.value = result.data;
        }
    } catch (error) {
        console.error('获取分类列表失败:', error);
    }
};
articleCategoryList();

// 控制弹窗
const dialogVisible = ref(false);

// 添加分类数据模型
const categoryModel = ref({
    categoryName: ''
});

// 添加分类表单校验规则
const rules = {
    categoryName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
    ]
};

// 展示编辑弹窗
const title = ref('');
const showDialog = (row) => {
    dialogVisible.value = true;
    title.value = '编辑分类';
    categoryModel.value = { ...row }; // 深拷贝数据
};

// 添加分类
const addCategory = async () => {
    try {
        const result = await articleCategoryAddService(categoryModel.value);
        ElMessage.success(result.msg || '添加成功');
        articleCategoryList();
        dialogVisible.value = false;
    } catch (error) {
        console.error('添加分类失败:', error);
        ElMessage.error('添加分类失败，请重试');
    }
};

// 编辑分类
const updateCategory = async () => {
    try {
        const result = await articleCategoryUpdateService(categoryModel.value);
        ElMessage.success(result.msg || '修改成功');
        articleCategoryList();
        dialogVisible.value = false;
    } catch (error) {
        console.error('修改分类失败:', error);
        ElMessage.error('修改分类失败，请重试');
    }
};

// 清空数据
const clearData = () => {
    categoryModel.value = { categoryName: '' };
};

// 删除单个分类
const deleteCategory = (row) => {
    ElMessageBox.confirm(
        '你确认要删除该分类信息吗?', // 提示内容
        '温馨提示', // 标题
        {
            confirmButtonText: '确认', // 确认按钮文本
            cancelButtonText: '取消', // 取消按钮文本
            type: 'warning', // 消息类型 控制图标样式
        }
    )
        .then(async () => {
            // 用户点击了“确认”按钮，这里是执行删除逻辑
            try {
                const result = await articleCategoryDeleteByIdService(row.id);
                ElMessage.success(result.msg || '删除成功'); // 删除成功提示
                articleCategoryList(); // 刷新分类列表
            } catch (error) {
                console.error('删除分类失败:', error);
                ElMessage.error('删除分类失败，请重试'); // 删除失败提示
            }
        })
        .catch(() => {
            // 用户点击了“取消”按钮或者关闭了对话框
            ElMessage.info('用户取消了删除'); // 显示取消提示
        });
};

// 批量删除分类
const deleteSelectedCategories = async () => {
    if (selectedCategories.value.length === 0) {
        ElMessage.warning('请先选择要删除的分类');
        return;
    }

    ElMessageBox.confirm(
        '你确认要删除选中的分类信息吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            try {
                const idsToDelete = selectedCategories.value.map(item => item.id);
                console.log('准备删除的分类ID：', idsToDelete); // 调试日志
                const result = await articleCategoryDeleteService(idsToDelete);
                ElMessage.success(result.msg || '批量删除成功');
                articleCategoryList();
                selectedCategories.value = [];
            } catch (error) {
                console.error('批量删除失败:', error);
                ElMessage.error('批量删除失败，请重试');
            }
        })
        .catch(() => {
            ElMessage.info('用户取消了删除');
        });
};
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章分类</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true; title = '添加分类'; clearData()">添加分类</el-button>
                    <el-button type="danger" @click="deleteSelectedCategories" :disabled="selectedCategories.length === 0">
                        批量删除
                    </el-button>
                </div>
            </div>
        </template>
        <el-table
            :data="categorys"
            style="width: 100%"
            @selection-change="selectedCategories = $event"
        >
            <!-- 勾选框列 -->
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="序号" width="100" type="index"></el-table-column>
            <el-table-column label="分类名称" prop="categoryName"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- 添加分类弹窗 -->
        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="分类名称" prop="categoryName">
                    <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="title === '添加分类' ? addCategory() : updateCategory()"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
