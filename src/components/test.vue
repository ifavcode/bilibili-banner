<script setup>
const route = useRoute()

const es = new WebSocket('ws://localhost:8080/test/' + route.params.id)
es.onopen = function (e) {
  console.log('连接成功', e);
}
es.onerror = function (e) {
  console.log('连接失败', e);
}
es.onclose = function (e) {
  console.log('连接关闭', e);
}
es.onmessage = function (e) {
  msgList.value.push(JSON.parse(e.data))
}

const inputValue = ref('')
const toValue = ref('')

const send = () => {
  es.send(JSON.stringify({
    from: route.params.id,
    to: toValue.value,
    content: inputValue.value
  }))
  inputValue.value = ''
}

const close = () => {
  es.close()
}

const msgList = ref([])

</script>

<template>
  <div class="h-64">
    <p>收到消息：</p>
    <p v-for="msg in msgList">{{ msg.from }}说：{{ msg.content }}</p>
  </div>
  <a-space>
    <a-input v-model:value="inputValue" @keydown.enter="send" placeholder="发送内容"></a-input>
    <a-input class="w-20" v-model:value="toValue" placeholder="发送目标"></a-input>
    <a-button type="primary" @click="send">发送</a-button>
    <a-button type="primary" @click="close">关闭</a-button>
  </a-space>
</template>