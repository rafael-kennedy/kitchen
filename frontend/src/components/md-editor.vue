<template>
  <div>
    <div :editor="editor" v-if="editor">
      <el-space>
        <el-button-group>
          <el-button
            plain
            round
            size="small"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          >
            h1
          </el-button>
          <el-button
            plain
            round
            size="small"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          >
            h2
          </el-button>
          <el-button
            plain
            round
            size="small"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          >
            h3
          </el-button>
        </el-button-group>
      </el-space>
      <el-space>
        <el-button-group>
          <el-button
            plain
            round
            size="small"
            @click="editor.chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"
          >
            bold
          </el-button>
          <el-button
            plain
            round
            size="small"
            @click="editor.chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"
          >
            italic
          </el-button>
        </el-button-group>
      </el-space>
      <el-space>
        <el-button-group>
          <el-button
            plain
            size="small"
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor.isActive('bulletList') }"
          >
            bullet list
          </el-button>
          <el-button
            plain
            size="small"
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor.isActive('orderedList') }"
          >
            ordered list
          </el-button>
        </el-button-group>
      </el-space>
      <el-space>
        <el-button-group>
          <el-button
            plain
            size="small"
            @click="editor.chain().focus().undo().run()"
            >undo</el-button
          >
          <el-button
            plain
            size="small"
            @click="editor.chain().focus().redo().run()"
            >redo</el-button
          >
        </el-button-group>
      </el-space>
      <template v-if="images">
        <el-space>
          <el-button-group>
            <el-button
              plain
              :disabled="!images.length"
              :icon="PictureFilled"
              size="small"
              @click="drawerIsOpen = true"
              :class="{ 'is-active': editor.isActive('orderedList') }"
            >
            </el-button>
          </el-button-group>
        </el-space>
      </template>
    </div>

    <editor-content :editor="editor"></editor-content>
    <el-drawer
      v-if="images.length"
      v-model="drawerIsOpen"
      title="Choose an image below, or click on the X to close"
      direction="rtl"
    >
      <el-scrollbar>
        <el-space>
          <el-image
            v-for="image in images"
            :src="image.thumbUrl"
            fit="contain"
            :style="{
              cursor: 'pointer',
              height: '75px',
              width: '75px',
            }"
            @click="chooseImage(image.publicUrl)"
            class="thumbnail"
          >
          </el-image>
        </el-space>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script setup>
import { Editor, EditorContent } from "@tiptap/vue-3";
import Image from "@tiptap/extension-image";
import { PictureFilled } from "@element-plus/icons-vue";
import StarterKit from "@tiptap/starter-kit";
import { createMarkdownEditor } from "tiptap-markdown";
import { ref, watch } from "vue";

const props = defineProps({
  images: { type: Array, default: [] },
  initialContent: {
    type: String,
    default: `# Enter a description of your facility.

This will be what potential clients see if they click into your profile. We recommend including a summary of the space, what you offer, and what customers can expect. Use the image button above to sprinkle some of the images into your description.
`,
  },
});
const emit = defineEmits(["input"]);
const MarkdownEditor = createMarkdownEditor(Editor);
const editor = ref(
  new MarkdownEditor({
    content: props.initialContent,
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "wysiwyg-image",
        },
      }),
    ],
  })
);

watch(
  () => editor.value.getMarkdown(),
  (v) => {
    emit("input", v);
  }
);
const drawerIsOpen = ref(false);
function chooseImage(url) {
  drawerIsOpen.value = false;
  editor.value.chain().focus().setImage({ src: url }).run();
}
</script>

<style scoped>
:deep(.wysiwyg-image) {
  max-height: 20rem;
  object-fit: contain;
}
.thumbnail {
}
</style>
