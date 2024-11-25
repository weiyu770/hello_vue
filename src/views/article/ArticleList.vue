我会为你提供完整的代码实现。我将修改之前的文章列表组件，添加点赞功能。



```vue
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
            <el-button type="warning" :icon="Upload" @click="handleImport">
                导入文章
            </el-button>
            <el-button type="success" :icon="Download" @click="handleExport">
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
                <el-table-column label="点赞数" prop="likeCount" width="100" align="center">
                    <template #default="{ row }">
                        {{ row.likeCount || 0 }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="500" align="center" fixed="right">
                    <template #default="{ row }">

                        <el-button
                            link
                            type="primary"
                            @click="handleLike(row)"
                            :disabled="row.liked"
                        >
                            {{ row.liked ? '已点赞' : '点赞' }} ({{ row.likeCount || 0 }})
                        </el-button>
                        <el-button
                            link
                            :type="row.liked ? 'danger' : 'info'"
                            @click="handleLikeToggle(row)"
                            :disabled="!row.liked"
                        >
                            {{ row.liked ? '取消点赞' : '取消点赞' }} ({{ row.likeCount || 0 }})
                        </el-button>

                        <el-button
                            link
                            type="primary"
                            @click="handleTop(row)"
                        >
                            {{ row.isTop ? '取消置顶' : '置顶' }}
                        </el-button>
                        <el-button
                            link
                            type="primary"
                            @click="handleRecommend(row)"
                        >
                            {{ row.isRecommend ? '取消推荐' : '推荐' }}
                        </el-button>
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
                        <el-button
                            link
                            type="danger"
                            :icon="Delete"
                            @click="handleDelete(row)"
                        >
                            删除
                        </el-button>
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
    More
} from '@element-plus/icons-vue'
import {
    listArticleBack,
    deleteArticle,
    recommendArticle,
    topArticle,
    likeArticle, // 点赞 API
    unlikeArticle  // 取消点赞 API
} from '@/api/article/article'

const router = useRouter()
const loading = ref(false)
const articleList = ref([])
const total = ref(0)
const selectedIds = ref([])
const queryForm = ref(null)
const tableKey = ref(0)

// 查询参数
const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    title: undefined,
    isDelete: 0,
    articleType: undefined
})

// 获取文章列表
const getList = async () => {
    try {
        loading.value = true
        const { data } = await listArticleBack(queryParams.value)
        articleList.value = data.recordList || []
        total.value = data.count || 0
        tableKey.value++
    } catch (error) {
        console.error('获取文章列表失败:', error)
        ElMessage.error('获取文章列表失败')
    } finally {
        loading.value = false
    }
}

// 点赞功能
const handleLike = async (row) => {
    try {
        await likeArticle(row.id)
        // 直接更新当前行的点赞数和状态
        row.likeCount = (row.likeCount || 0) + 1
        row.liked = true
        ElMessage.success('点赞成功')
    } catch (error) {
        console.error('点赞失败:', error)
        ElMessage.error('点赞失败')
    }
}

// 点赞/取消点赞功能
const handleLikeToggle = async (row) => {
    try {
        if (row.liked) {
            // 取消点赞
            await unlikeArticle(row.id)
            row.likeCount = Math.max(0, (row.likeCount || 1) - 1)
            row.liked = false
            ElMessage.success('已取消点赞')
        } else {
            // 点赞
            await likeArticle(row.id)
            row.likeCount = (row.likeCount || 0) + 1
            row.liked = true
            ElMessage.success('点赞成功')
        }
    } catch (error) {
        console.error('点赞/取消点赞失败:', error)
        ElMessage.error('操作失败')
    }
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
    router.push('/article/manage/post-article')
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
            id: row.id,
            isTop: row.isTop === 1 ? 0 : 1
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
            id: row.id,
            isRecommend: row.isRecommend === 1 ? 0 : 1
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
}

// 每页条数改变
const handleSizeChange = (val) => {
    queryParams.value.pageSize = val
    getList()
}

// 页码改变
const handleCurrentChange = (val) => {
    queryParams.value.pageNum = val
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

