<script setup lang='ts'>
import { AxiosProgressEvent } from 'axios';
import { clear } from 'console';
import { request } from '~/utils/request';


const curFile = ref<File | null>(null)
const percentageList = ref<number[]>([0])
let cancelControllerList: AbortController[] = []
let completeSet = new Set()
let fileChunkList: any[] = []
const totalProgressRef = ref(0)

const totalProgress = () => {
  totalProgressRef.value = Math.max(totalProgressRef.value, Math.ceil(percentageList.value.reduce((acc, cur) => (acc + cur), 0) / percentageList.value.length))
}

const handleChange = (e: any) => {
  const [file]: [File] = e.target.files;
  if (!file) return
  curFile.value = file
}

const createFileChunk = (size = 1024 * 1024 * 10) => {
  fileChunkList = []
  let cur = 0
  let cnt = 0
  while (cur < curFile.value!.size) {
    fileChunkList.push({ file: curFile.value!.slice(cur, cur + size) })
    cur += size
    cnt += 1
  }
  percentageList.value = Array.from({ length: cnt }, () => 0)
  cancelControllerList = Array.from({ length: cnt }, () => new AbortController())
  return fileChunkList
}

let key:NodeJS.Timeout | null = null
const handleUpload = async () => {
  if (!curFile.value) return
  fileChunkList = createFileChunk(Math.max(Math.floor(curFile.value!.size / 3 / 1024) * 1024, 1024 * 1024))
  // 上传
  const requestList: Promise<any>[] = fileChunkList.map(({ file }, index) => {
    const formData: FormData = new FormData()
    formData.append('file', file)
    formData.append('index', curFile.value!.name + '-' + index.toString())
    return formData
  })
    .map((formData: FormData, _index: number) => {
      return request('/upload/image', {
        method: 'POST',
        data: formData,
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const { progress } = progressEvent
          percentageList.value[_index] = progress as number * 100
          totalProgress()
        },
        signal: cancelControllerList[_index].signal
      }, () => {
        percentageList.value[_index] = 100
        totalProgress()
        completeSet.add(_index)
      })
    })
  await Promise.all(requestList)
  key = setTimeout(() => {
    percentageList.value.map(v => {
      v = 100
    })
  }, 500);
}

const handleMerge = async () => {
  const res = await request<any>('/upload/merge')
  console.log(res);
}

const handleClear = async () => {
  await request('/upload/clear')
  percentageList.value = [0]
}

const cancelUpload = () => {
  cancelControllerList.forEach((cancelController, index) => {
    if (completeSet.has(index)) return
    cancelController.abort()
  })
}

const continueUpload = async () => {
  clearTimeout(key as NodeJS.Timeout)
  const res: any = await request('/upload/progress')
  completeSet.clear()
  res.data.data.forEach((v: string, _i: number) => {
    completeSet.add(parseInt(v.charAt(v.length - 1)))
  })
  // 没有完成的继续上传
  cancelControllerList = Array.from({ length: 10 }, () => new AbortController())
  const requestList: Promise<any>[] = fileChunkList.map(({ file }, index) => {
    if (!completeSet.has(index)) {
      const formData: FormData = new FormData()
      formData.append('file', file)
      formData.append('index', curFile.value!.name + '-' + index.toString())
      return formData
    }
    return null
  }).filter(v => v != null)
    .map((formData: FormData | null, _index: number) => {
      console.log(formData);

      return request('/upload/image', {
        method: 'POST',
        data: formData,
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const { progress } = progressEvent
          percentageList.value[_index] = progress as number * 100
          totalProgress()
        },
        signal: cancelControllerList[_index].signal
      }, () => {
        percentageList.value[_index] = 100
        totalProgress()
        completeSet.add(_index)
      })
    })

  await Promise.all(requestList)
  setTimeout(() => {
    percentageList.value.map(v => {
      v = 100
      return v
    })
  }, 500);
}

</script>

<template>
  <div>
    <a-progress :percent="totalProgressRef" />
    <input type="file" @change="handleChange" />
  </div>

  <div class="mt-6">
    <a-space>
      <a-button type="primary" @click="handleUpload">上传</a-button>
      <a-button type="primary" @click="handleClear">清除</a-button>
      <a-button type="primary" @click="handleMerge">完成</a-button>
    </a-space>
    <br />
    <br />
    <a-space>
      <a-button @click="cancelUpload">暂停</a-button>
      <a-button @click="continueUpload">继续</a-button>
    </a-space>
  </div>
</template>

<style lang='scss' scoped>
div {
  h1 {
    color: #000;
  }
}
</style>