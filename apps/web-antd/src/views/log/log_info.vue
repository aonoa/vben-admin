<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { JsonViewer, Page } from '@vben/common-ui';

import { Card, message } from 'ant-design-vue';

import { GetSysLogInfo } from '#/api/system/log';

const route = useRoute();
const index = computed(() => String(route.params?.id ?? -1));

const title = computed(() => `日志详情: ${index.value}`);

const logInfo = ref<any>(null);
const loading = ref(false);

const fetchLogInfo = async () => {
  loading.value = true;
  try {
    logInfo.value = await GetSysLogInfo(index.value);
    if (logInfo.value.get_params === '{}') {
      logInfo.value.get_params = undefined;
    }
  } catch (error) {
    message.error('获取日志详情失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLogInfo();
});

function parseJson(jsonString: string): Record<string, any> | string {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON 解析失败:', error);
    return jsonString; // 解析失败返回原字符串
  }
}
</script>

<template>
  <Page auto-content-height>
    <Card :title="title" class="mb-2.5">
      <p v-if="loading">加载中...</p>
      <p v-else-if="!logInfo">未找到日志信息</p>
      <div v-else>
        <a-descriptions>
          <a-descriptions-item label="请求方式">
            {{ logInfo?.method }}
          </a-descriptions-item>
          <a-descriptions-item label="请求地址">
            {{ logInfo?.path }}
          </a-descriptions-item>
          <a-descriptions-item label="请求耗时">
            {{ logInfo?.latency }} ms
          </a-descriptions-item>
          <a-descriptions-item label="访问IP">
            {{ logInfo?.ip_address }}
          </a-descriptions-item>
          <a-descriptions-item label="IP归属地">
            {{ logInfo?.ip_location }}
          </a-descriptions-item>
          <a-descriptions-item label="会话ID">
            {{ logInfo?.session_id }}
          </a-descriptions-item>
          <a-descriptions-item label="操作系统">
            {{ logInfo?.os }}
          </a-descriptions-item>
          <a-descriptions-item label="浏览器版本">
            {{ logInfo?.browser }}
          </a-descriptions-item>
          <a-descriptions-item label="用户ID">
            {{ logInfo?.user_id }}
          </a-descriptions-item>
          <a-descriptions-item label="请求时间">
            {{ logInfo?.request_time }}
          </a-descriptions-item>
          <a-descriptions-item label="响应时间">
            {{ logInfo?.create_time }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </Card>

    <Card title="访问代理" class="mb-2.5">
      <p v-if="loading">加载中...</p>
      <p v-else>{{ logInfo?.user_agent || '无' }}</p>
    </Card>

    <Card title="报错信息" class="mb-2.5">
      <p v-if="loading">加载中...</p>
      <div v-else>
        <div v-if="logInfo?.res_code">
          <a-descriptions>
            <a-descriptions-item label="状态码">
              {{ logInfo?.res_code }}
            </a-descriptions-item>
            <a-descriptions-item label="错误提示">
              {{ logInfo?.reason || '操作成功' }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <pre v-else>{{ logInfo?.res_code || '无报错信息' }}</pre>
      </div>
    </Card>

    <Card title="堆栈打印" class="mb-2.5">
      <p v-if="loading">加载中...</p>
      <pre v-else>{{ logInfo?.stack || '无堆栈信息' }}</pre>
    </Card>

    <Card title="Header请求头" class="mb-2.5">
      <p v-if="loading">加载中...</p>
      <!--      <pre v-if="logInfo?.header">{{ JSON.stringify(parseJson(logInfo.header), null, 2) }}</pre>-->
      <pre v-if="logInfo?.header">
        <JsonViewer
          :value="parseJson(logInfo.header)"
          :expand-depth="3"
          copyable
          :sort="false"
          boxed
          :show-array-index="false"
        />
      </pre>
      <p v-else>无请求头信息</p>
    </Card>

    <Card title="Get参数" class="mb-2.5">
      <p v-if="loading">加载中...</p>
      <pre v-if="logInfo?.get_params">{{
        JSON.stringify(parseJson(logInfo.get_params), null, 2)
      }}</pre>
      <pre v-else>{{ logInfo?.get_params || '无' }}</pre>
    </Card>

    <Card title="Post参数" class="mb-2.5">
      <p v-if="loading">加载中...</p>
      <pre v-if="logInfo?.post_data">
        <JsonViewer
          :value="parseJson(logInfo.post_data)"
          copyable
          preview-mode
          boxed
          :show-array-index="false"
        />
      </pre>
      <pre v-else>{{ logInfo?.post_data || '无' }}</pre>
    </Card>
  </Page>
</template>
