<script setup lang='ts'>
import { request } from '~/utils/request';


const totalProgress = ref(0)
const curFile = ref<File | null>(null)

const handleChange = (e: any) => {
  const [file]: [File] = e.target.files;
  if (!file) return
  curFile.value = file
}

const handleUpload = async () => {
  const res = request('/s3/upload/file', {
    method: 'POST',
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: {
      file: curFile.value
    }
  })
}

const handleClear = () => {

}

const cancelUpload = () => {

}

const continueUpload = () => {
  request('/s3/upload/up/RTiS4_.PDKVHaNe_IcBejVZeNkp2BDprhX_J.fIcIHw6qic.BwWRjYJDq4B5ivrebyaijcxkOaZ_D5oL9BelyXUykncRqWZ3v7fhyAY_JLMSAhdtfVTHXKZKygzup.r3', {
    method: 'POST'
  })
}

const es = new EventSource('/api/s3/upload/conn/1')

es.onmessage = (e: any) => {
  if (e.data != '连接成功') {
    let sz = e.data
    totalProgress.value = sz * 1
  }
}

es.onopen = (e: any) => {
  console.log('connection');
}

es.onerror = (e: any) => {
  console.log('error');
}

const process = () => {
  request('/s3/upload/process', {
    method: 'POST'
  })
}

const ing = () => {
  request('/s3/upload/ing', {
  })
}

const getSize = () => {
}
  
onMounted(async () => {
  getSize()
})
</script>

<template>
  <div>
    <p class="text-base">嘻嘻嘻</p>
    <a-progress :percent="totalProgress" />
    <input type="file" @change="handleChange" />
  </div>

  <div class="mt-6">
    <a-space>
      <a-button type="primary" @click="handleUpload">上传</a-button>
      <a-button type="primary" @click="handleClear">清除</a-button>
    </a-space>
    <br />
    <br />
    <a-space>
      <a-button @click="cancelUpload">暂停</a-button>
      <a-button @click="continueUpload">继续</a-button>
      <a-button @click="ing">当前状况</a-button>

      <a-button @click="continueUpload">继续上传</a-button>

    </a-space>
  </div>

</template>