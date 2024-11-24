<template>
  <div class="editor-container">
    <div class="top-bar">
      <el-input v-model="title" placeholder="请输入文章标题" size="large" class="title-input" />
      <el-button type="danger" @click="publishArticle">发布文章</el-button>
    </div>

    <div class="editor-wrapper">
      <div class="toolbar-horizontal">
        <el-button-group>
          <el-button @click="execCommand('bold')" title="加粗">
            <i class="el-icon-bold"></i> 加粗
          </el-button>
          <el-button @click="execCommand('italic')" title="斜体">
            <i class="el-icon-italic"></i> 斜体
          </el-button>
          <el-button @click="execCommand('underline')" title="下划线">
            <i class="el-icon-underline"></i> 下划线
          </el-button>
          <el-button @click="execCommand('strikeThrough')" title="删除线">
            <i class="el-icon-minus"></i> 删除线
          </el-button>
        </el-button-group>

        <el-divider direction="vertical" />

        <el-dropdown @command="handleHeading" trigger="click">
          <el-button>
            <i class="el-icon-font-size"></i> 标题
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="i in 6" :key="i" :command="'h'+i">
                H{{ i }} 标题 {{ i }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-button-group>
          <el-button @click="execCommand('insertUnorderedList')" title="无序列表">
            <i class="el-icon-menu"></i> 无序列表
          </el-button>
          <el-button @click="execCommand('insertOrderedList')" title="有序列表">
            <i class="el-icon-sort"></i> 有序列表
          </el-button>
        </el-button-group>

        <el-divider direction="vertical" />

        <el-button-group>
          <el-button @click="insertInlineCode()" title="行内代码">
            <i class="el-icon-code"></i> 行内代码
          </el-button>
          <el-button @click="insertCodeBlock()" title="代码块">
            <i class="el-icon-document"></i> 代码块
          </el-button>
        </el-button-group>

        <el-divider direction="vertical" />

        <el-button-group>
          <el-button @click="openLinkModal()" title="链接">
            <i class="el-icon-link"></i> 链接
          </el-button>
          <el-button @click="openImageModal()" title="图片">
            <i class="el-icon-picture"></i> 图片
          </el-button>
          <el-button @click="insertTable()" title="表格">
            <i class="el-icon-table"></i> 表格
          </el-button>
        </el-button-group>

        <el-divider direction="vertical" />

        <el-button-group>
          <el-button @click="insertMermaid()" title="Mermaid图">
            <i class="el-icon-share"></i> Mermaid图
          </el-button>
          <el-button @click="insertKatex()" title="KaTeX公式">
            <i class="el-icon-edit-outline"></i> KaTeX公式
          </el-button>
        </el-button-group>

        <el-divider direction="vertical" />

        <el-button-group>
          <el-button @click="undo()" title="后退">
            <i class="el-icon-refresh-left"></i> 后退
          </el-button>
          <el-button @click="redo()" title="前进">
            <i class="el-icon-refresh-right"></i> 前进
          </el-button>
        </el-button-group>

        <el-button-group>
          <el-button @click="formatContent()" title="美化">
            <i class="el-icon-magic-stick"></i> 美化
          </el-button>
          <el-button @click="togglePageFullscreen()" title="浏览器全屏">
            <i class="el-icon-full-screen"></i> 浏览器全屏
          </el-button>
          <el-button @click="toggleFullscreen()" title="屏幕全屏">
            <i class="el-icon-full-screen"></i> 屏幕全屏
          </el-button>
        </el-button-group>
      </div>

      <div class="main-content">
        <div class="editor-area full-height">
          <div class="visual-editor full-height"
               contenteditable="true"
               ref="editorRef"
               @input="updateContent"
               @paste="handlePaste">
            <!-- 可视化编辑器 -->
          </div>

          <div class="code-editor full-height">
            <textarea v-model="content" class="code-textarea" placeholder="源代码编辑器"></textarea>
          </div>
        </div>

        <div v-show="showCatalog" class="catalog-panel">
          <div class="catalog-title">目录</div>
          <div class="catalog-content" v-html="catalogHtml"></div>
        </div>
      </div>

      <div class="editor-footer">
        <div class="left">
          <span class="word-count">字数: {{ wordCount }}</span>
        </div>
        <div class="right">
          <el-switch v-model="syncScroll" active-text="同步滚动" />
        </div>
      </div>
    </div>

    <!-- 链接/图片对话框 -->
    <el-dialog
      v-model="showLinkModal"
      :title="linkModalType === 'link' ? '添加链接' : '添加图片'"
      width="500px"
    >
      <el-form :model="linkForm" label-width="100px">
        <el-form-item :label="linkModalType === 'link' ? '链接描述：' : '图片描述：'">
          <el-input v-model="linkForm.desc" placeholder="请输入描述..." />
        </el-form-item>
        <el-form-item :label="linkModalType === 'link' ? '链接地址：' : '图片地址：'">
          <el-input v-model="linkForm.url" placeholder="请输入链接..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showLinkModal = false">取消</el-button>
        <el-button type="primary" @click="insertLink">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';
import { marked } from 'marked';
import prettier from 'prettier';
import 'katex/dist/katex.min.css';
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';

// 状态变量
const title = ref('');
const editorRef = ref(null);
const content = ref('');
const wordCount = ref(0);
const showPreview = ref(false);
const showCatalog = ref(false);
const syncScroll = ref(true);
const isFullscreen = ref(false);
const isPageFullscreen = ref(false);

// 链接/图片对话框
const showLinkModal = ref(false);
const linkModalType = ref('link');
const linkForm = ref({
  desc: '',
  url: ''
});

// 历史记录
const history = [];
const historyIndex = ref(-1);

// 渲染后的内容
const renderedContent = computed(() => {
  return marked(content.value, {
    gfm: true,
    breaks: true
  });
});

// 目录HTML
const catalogHtml = computed(() => {
  // 此处用于生成目录，当前程序中未实现，可以根据需要实现目录生成
  return '';
});

// 更新内容
const updateContent = () => {
  if (editorRef.value) {
    const html = editorRef.value.innerHTML;
    content.value = html;
    wordCount.value = editorRef.value.innerText.length;

    // 添加到历史记录
    if (historyIndex.value < history.length - 1) {
      history.splice(historyIndex.value + 1);
    }
    history.push(html);
    historyIndex.value = history.length - 1;
  }
};

// 执行编辑命令
const execCommand = (command, value = null) => {
  document.execCommand(command, false, value);
  editorRef.value?.focus();
};

// 处理标题
const handleHeading = (level) => {
  execCommand('formatBlock', `<${level}>`);
};

// 插入块引用
const insertBlockquote = () => {
  execCommand('formatBlock', '<blockquote>');
};

// 插入任务列表
const insertTaskList = () => {
  const html = '<ul class="task-list"><li><input type="checkbox"> 任务项</li></ul>';
  execCommand('insertHTML', html);
};

// 插入行内代码
const insertInlineCode = () => {
  const selection = window.getSelection();
  const text = selection.toString();
  const code = `<code>${text || '代码'}</code>`;
  execCommand('insertHTML', code);
};

// 插入代码块
const insertCodeBlock = () => {
  const html = '<pre><code class="language-javascript">// 代码块\n</code></pre>';
  execCommand('insertHTML', html);
};

// 打开链接对话框
const openLinkModal = () => {
  linkModalType.value = 'link';
  showLinkModal.value = true;
};

// 打开图片对话框
const openImageModal = () => {
  linkModalType.value = 'image';
  showLinkModal.value = true;
};

// 插入链接或图片
const insertLink = () => {
  if (!linkForm.value.url) {
    ElMessage.warning('请输入链接地址');
    return;
  }

  const html = linkModalType.value === 'link'
    ? `<a href="${linkForm.value.url}">${linkForm.value.desc || linkForm.value.url}</a>`
    : `<img src="${linkForm.value.url}" alt="${linkForm.value.desc || ''}">`;

  execCommand('insertHTML', html);
  showLinkModal.value = false;
  linkForm.value = { desc: '', url: '' };
};

// 插入表格
const insertTable = () => {
  const html = `
    <table>
      <thead>
        <tr>
          <th>表头1</th>
          <th>表头2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>内容1</td>
          <td>内容2</td>
        </tr>
      </tbody>
    </table>
  `;
  execCommand('insertHTML', html);
};

// 插入Mermaid图
const insertMermaid = () => {
  const html = `
    <pre class="mermaid">
graph TD
    A[开始] --> B[流程]
    B --> C[结束]
    </pre>
  `;
  execCommand('insertHTML', html);
};

// 插入KaTeX公式
const insertKatex = () => {
  const html = `<span class="katex">E = mc^2</span>`;
  execCommand('insertHTML', html);
};

// 撤销
const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--;
    editorRef.value.innerHTML = history[historyIndex.value];
  }
};

// 重做
const redo = () => {
  if (historyIndex.value < history.length - 1) {
    historyIndex.value++;
    editorRef.value.innerHTML = history[historyIndex.value];
  }
};

// 格式化内容
const formatContent = () => {
  try {
    const formatted = prettier.format(content.value, {
      parser: 'html',
      printWidth: 80,
      tabWidth: 2
    });
    content.value = formatted;
    editorRef.value.innerHTML = formatted;
  } catch (err) {
    ElMessage.error('格式化失败');
  }
};

// 切换预览
const togglePreview = () => {
  showPreview.value = !showPreview.value;
};

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
};

// 切换页面全屏
const togglePageFullscreen = () => {
  isPageFullscreen.value = !isPageFullscreen.value;
  if (isPageFullscreen.value) {
    document.documentElement.style.overflow = 'hidden';
  } else {
    document.documentElement.style.overflow = '';
  }
};

// 粘贴处理
const handlePaste = (event) => {
  event.preventDefault();
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData('text/plain');
  execCommand('insertText', pastedData);
};

// 保存内容
const saveContent = () => {
  const savedData = {
    title: title.value,
    content: content.value
  };
  console.log('保存的内容：', savedData);
  ElMessage.success('内容已保存');
};

// 发布文章
const publishArticle = () => {
  if (!title.value.trim() || !content.value.trim()) {
    ElMessage.warning('标题和内容不能为空');
    return;
  }

  const postData = {
    title: title.value,
    content: content.value
  };

  console.log('发布的内容：', postData);
  ElMessage.success('文章已发布');
};

// 监听按键快捷键
const handleKeydown = (event) => {
  if (event.ctrlKey && event.key === 'z') {
    undo();
  } else if (event.ctrlKey && event.key === 'y') {
    redo();
  }
};

// 组件挂载时
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

// 组件卸载时
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style>
.editor-container {
  padding: 16px;
  background: #f0f2f5;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  background: #ffffff;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.editor-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
}

.toolbar-horizontal {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  background: #ffffff;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.toolbar-horizontal .el-button {
  margin-right: 4px;
  font-size: 14px;
}

.main-content {
  flex-grow: 1;
  display: flex;
  position: relative;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: calc(100% - 150px);
}

.editor-area {
  display: flex;
  width: 100%;
  height: 100%;
}

.visual-editor {
  width: 50%;
  border: 1px solid #ddd;
  padding: 16px;
  overflow-y: auto;
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.6;
  border-radius: 8px;
  height: 100%;
}

.code-editor {
  width: 50%;
  padding: 16px;
  border-left: 1px solid #ddd;
  height: 100%;
}

.code-textarea {
}

.code-editor.full-height {
  height: 100%;
}

.code-textarea {
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.6;
}

.catalog-panel {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 200px;
  background: #fff;
  border-left: 1px solid #ddd;
  padding: 16px;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid #ddd;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.word-count {
  font-weight: bold;
}

.el-button {
  background-color: #409EFF;
  color: white;
  border-radius: 8px;
}
</style>
