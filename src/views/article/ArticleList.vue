<template>
    <div class="article-list-container">
        <h2>文章列表管理</h2>

        <!-- 搜索栏 -->
        <div class="search-bar bg-white p-4 mb-4 rounded shadow-sm">
            <el-form :model="queryParams" ref="queryForm" :inline="true">
                <el-form-item label="文章标题">
                    <el-input
                        v-model="queryParams.title"
                        placeholder="请输入文章标题"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
                    <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 操作按钮区 -->
        <div class="operation-bar mb-4">
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增文章</el-button>
            <el-button
                type="danger"
                :icon="Delete"
                :disabled="selectedIds.length === 0"
                @click="handleBatchDelete"
            >
                批量删除
            </el-button>
            <el-button
                type="warning"
                :icon="Upload"
                @click="handleImport"
            >
                导入文章
            </el-button>
            <el-button
                type="success"
                :icon="Download"
                @click="handleExport"
            >
                导出文章
            </el-button>
        </div>

        <!-- 文章列表表格 -->
        <el-card shadow="hover">
            <el-table
                v-loading="loading"
                :data="articleList"
                @selection-change="handleSelectionChange"
                empty-text="暂无数据"
                :row-key="row => row.id"
                :key="tableKey"
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="标题" prop="articleTitle" min-width="200" show-overflow-tooltip>
                    <template #default="{ row }">
                        <div class="article-title">
                            <el-tag v-if="row.isTop === 1" type="danger" effect="dark" size="small">置顶</el-tag>
                            <el-tag v-if="row.isRecommend === 1" type="success" effect="dark" size="small">推荐</el-tag>
                            {{ row.articleTitle }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime" width="180" align="center">
                    <template #default="{ row }">
                        {{ row.createTime }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="280" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button-group>
                            <el-button
                                link
                                type="primary"
                                :icon="Edit"
                                @click="handleEdit(row)"
                            >
                                编辑
                            </el-button>
                            <el-button
                                link
                                type="primary"
                                :icon="View"
                                @click="handlePreview(row)"
                            >
                                预览
                            </el-button>
                            <el-dropdown trigger="click">
                                <el-button link type="primary" :icon="More">
                                    更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="handleTop(row)">
                                            {{ row.isTop ? '取消置顶' : '置顶' }}
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="handleRecommend(row)">
                                            {{ row.isRecommend ? '取消推荐' : '推荐' }}
                                        </el-dropdown-item>
                                        <el-dropdown-item divided @click="handleDelete(row)">
                                            删除
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination
                    v-model:current-page="queryParams.pageNum"
                    v-model:page-size="queryParams.pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    Search,
    Refresh,
    Plus,
    Delete,
    Upload,
    Download,
    Edit,
    View,
    More,
    ArrowDown
} from '@element-plus/icons-vue'
import {
    listArticleBack,
    deleteArticle,
    recycleArticle,
    recommendArticle,
    topArticle
} from '@/api/article/article'

const router = useRouter()
const loading = ref(false)
const articleList = ref([])
const total = ref(0)
const selectedIds = ref([])
const queryForm = ref(null)
const tableKey = ref(0)  // 用于强制更新表格视图

// 查询参数
const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    title: undefined, // 使用 title 而不是 keyword
    isDelete: 0,
    articleType: undefined
})

// 获取文章列表
const getList = async () => {
    try {
        loading.value = true
        console.log('查询参数:', queryParams.value)
        const { data } = await listArticleBack(queryParams.value)
        console.log('获取到的数据:', data)
        // 修改以下行以匹配后端返回的数据格式
        articleList.value = data.recordList || []
        total.value = data.count || 0
        // 强制触发视图更新
        tableKey.value++
        console.log('处理后的文章列表:', articleList.value)
    } catch (error) {
        console.error('获取文章列表失败:', error)
        ElMessage.error('获取文章列表失败')
    } finally {
        loading.value = false
        console.log('loading 状态:', loading.value)
    }
}

// 格式化时间
const formatDateTime = (time) => {
    if (!time) return ''
    return time // 直接返回时间字符串
}

// 查询
const handleQuery = () => {
    queryParams.value.pageNum = 1
    getList()
}

// 重置查询
const resetQuery = () => {
    queryForm.value?.resetFields()
    queryParams.value = {
        pageNum: 1,
        pageSize: 10,
        title: undefined
    }
    handleQuery()
}

// 新增文章
const handleAdd = () => {
    router.push('/article/edit')
}

// 编辑文章
const handleEdit = (row) => {
    router.push(`/article/edit/${row.id}`)
}

// 预览文章
const handlePreview = (row) => {
    window.open(`/article/preview/${row.id}`, '_blank')
}

// 删除文章
const handleDelete = async (row) => {
    try {
        await ElMessageBox.confirm('确认要删除该文章吗？', '提示', {
            type: 'warning'
        })
        await deleteArticle([row.id])
        ElMessage.success('删除成功')
        getList()
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除文章失败:', error)
            ElMessage.error('删除文章失败')
        }
    }
}

// 批量删除
const handleBatchDelete = async () => {
    if (selectedIds.value.length === 0) {
        ElMessage.warning('请选择要删除的文章')
        return
    }
    try {
        await ElMessageBox.confirm('确认要删除选中的文章吗？', '提示', {
            type: 'warning'
        })
        await deleteArticle(selectedIds.value)
        ElMessage.success('批量删除成功')
        getList()
    } catch (error) {
        if (error !== 'cancel') {
            console.error('批量删除文章失败:', error)
            ElMessage.error('批量删除文章失败')
        }
    }
}

// 导入文章
const handleImport = () => {
    ElMessage.info('导入功能开发中...')
}

// 导出文章
const handleExport = () => {
    ElMessage.info('导出功能开发中...')
}
// 置顶/取消置顶
const handleTop = async (row) => {
    try {
        await topArticle({
            articleId: row.id,
            isTop: row.isTop === 1 ? 0 : 1  // 修改判断逻辑
        })
        ElMessage.success(row.isTop === 1 ? '取消置顶成功' : '置顶成功')
        getList()
    } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败')
    }
}

// 推荐/取消推荐
const handleRecommend = async (row) => {
    try {
        await recommendArticle({
            articleId: row.id,
            isRecommend: row.isRecommend === 1 ? 0 : 1  // 修改判断逻辑
        })
        ElMessage.success(row.isRecommend === 1 ? '取消推荐成功' : '推荐成功')
        getList()
    } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败')
    }
}

// 表格选择改变
const handleSelectionChange = (selection) => {
    selectedIds.value = selection.map(item => item.id)
    console.log('当前选中的文章ID:', selectedIds.value)
}

// 每页条数改变
const handleSizeChange = (val) => {
    queryParams.value.pageSize = val
    console.log('每页条数更改为:', val)
    getList()
}

// 页码改变
const handleCurrentChange = (val) => {
    queryParams.value.pageNum = val
    console.log('当前页码更改为:', val)
    getList()
}

onMounted(() => {
    getList()
})
</script>

<style scoped>
.article-list-container {
    padding: 20px;
}

.search-bar {
    margin-bottom: 20px;
}

.operation-bar {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
}

.article-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

:deep(.el-card__body) {
    padding: 20px;
}

:deep(.el-table .cell) {
    white-space: nowrap;
}
</style>
