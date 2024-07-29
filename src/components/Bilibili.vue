<script lang="ts" setup>
function getAssetsImages(name: string) {
  return new URL(`/src/assets/${name}`, import.meta.url).href;
}

const eleRef = ref()
const bgList = ref([
  {
    url: getAssetsImages('bg2.webp'),
    offsetThreshold: 10,
  },
  {
    url: getAssetsImages('bg7.webp'),
    offsetThreshold: 90,
  },
  {
    url: getAssetsImages('bg11.webp'),
    offsetThreshold: 95,
  },
  {
    url: getAssetsImages('bg14.webp'),
    offsetThreshold: 80,
  },
  {
    url: getAssetsImages('bg9.webp'),
    offsetThreshold: 50,
  },
  {
    url: getAssetsImages('bg1.webp'),
    offsetThreshold: 90,
  },
])

const imgList = ref([
  {
    url: getAssetsImages('bg15.webp'),
    offsetThreshold: 70,
  },
  {
    url: getAssetsImages('bg16.webp'),
    offsetThreshold: 90,
  },
  {
    url: getAssetsImages('bg17.webp'),
    offsetThreshold: 30,
  },
  {
    url: getAssetsImages('bg3.webp'),
    offsetThreshold: 150,
  },
  {
    url: getAssetsImages('bg4.webp'),
    offsetThreshold: 50,
  },
  {
    url: getAssetsImages('bg5.webp'),
    offsetThreshold: 60,
  },
  {
    url: getAssetsImages('bg6.webp'),
    offsetThreshold: 100,
  },
  {
    url: getAssetsImages('bg8.webp'),
    offsetThreshold: 80,
  },
  {
    url: getAssetsImages('bg10.webp'),
    offsetThreshold: 60,
  },
  {
    url: getAssetsImages('bg12.webp'),
    offsetThreshold: 20,
  },
  {
    url: getAssetsImages('bg13.webp'),
    offsetThreshold: 10,
  },
  {
    url: getAssetsImages('bg18.webp'),
    offsetThreshold: 30,
  },
])
const bgTransform = ref<string[]>([])
const imgTransform = ref<string[]>([])
const isEnter = ref<boolean>(false) // 鼠标是否移入
let enterX = 0

const mouseEnter = (e: MouseEvent) => {
  initPosition()
  isEnter.value = true
  enterX = e.x
}

const mouseLeave = (e: MouseEvent) => {
  isEnter.value = false
  initPosition()
}


const mouseMove = (e: MouseEvent) => {
  // 背景移动
  const xOffset = (e.x - enterX) / eleRef.value.clientWidth * 100
  
  for (let i = 0; i < bgList.value.length; i++) {
    let v = xOffset * (bgList.value[i].offsetThreshold / 100)
    bgTransform.value[i] = `translateX(${-100 + v}px)` // 初始偏移量为 100，这样设置可以在[-200,0]之间移动
  }

  // 装饰物移动
  for (let i = 0; i < imgList.value.length; i++) {
    let v = xOffset * (imgList.value[i].offsetThreshold / 100)
    imgTransform.value[i] = `translateX(${v}px)`
  }
}

const initPosition = () => {
  bgTransform.value = new Array(bgList.value.length).fill('translateX(-100px)')
  imgTransform.value = new Array(imgList.value.length).fill('translateX(0px)')
}

</script>

<template>
  <div ref="eleRef" class="relative w-screen max-w-[2480px] h-[155px] overflow-hidden" @mouseenter="mouseEnter"
    @mouseleave="mouseLeave" @mousemove="mouseMove">
    <div :class="isEnter ? '' : 'transition-transform duration-200'" class="absolute left-0 top-0 translate-x-[-100px]"
      :style="{ transform: bgTransform[idx], width: eleRef ? eleRef.clientWidth + 200 + 'px' : '100%' }"
      v-for="(img, idx) in bgList" :key="idx">
      <img class="w-full object-cover" :src="img.url" alt="">
    </div>
    <div :class="isEnter ? '' : 'transition-transform duration-200'" class="absolute left-0 top-0"
      :style="{ transform: imgTransform[idx] }" v-for="(img, idx) in imgList" :key="idx + bgList.length">
      <img :src="img.url" alt="">
    </div>
  </div>
</template>

<style scoped></style>