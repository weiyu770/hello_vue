<template>
  <div class="top-bar">
    <!-- 标题输入框 -->
    <el-input
      v-model="title"
      placeholder="请输入文章标题"
      size="large"
      class="title-input"
    />
    <!-- 发布按钮 -->
    <el-button type="danger" size="large" class="publish-btn" @click="publishArticle">
      发布文章
    </el-button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";

// 标题数据
const title = ref("");

// 发布文章
const publishArticle = () => {
  if (!title.value.trim()) {
    ElMessage.error("文章标题不能为空！");
    return;
  }
  ElMessage.success(`文章《${title.value}》发布成功！`);
};
</script>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e4e7ed;
  position: sticky; /* 置顶效果 */
  top: 0;
  z-index: 1000;
}

.title-input {
  flex: 1;
  margin-right: 20px;
}

.publish-btn {
  flex-shrink: 0;
}
</style>
