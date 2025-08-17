<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">仪表盘</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card color="primary" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="48" class="mr-4">mdi-account-group</v-icon>
              <div>
                <div class="text-h5">{{ stats.userCount }}</div>
                <div class="text-caption">用户总数</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card color="success" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="48" class="mr-4">mdi-account-key</v-icon>
              <div>
                <div class="text-h5">{{ stats.roleCount }}</div>
                <div class="text-caption">角色总数</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card color="info" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="48" class="mr-4">mdi-shield-account</v-icon>
              <div>
                <div class="text-h5">{{ stats.permissionCount }}</div>
                <div class="text-caption">权限总数</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card color="warning" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="48" class="mr-4">mdi-login</v-icon>
              <div>
                <div class="text-h5">{{ stats.onlineCount }}</div>
                <div class="text-caption">在线用户</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-chart-line</v-icon>
            访问统计
          </v-card-title>
          <v-card-text>
            <!-- 这里可以添加图表组件 -->
            <div class="text-center py-8">
              <v-icon size="64" color="grey-lighten-1">mdi-chart-line</v-icon>
              <p class="text-grey-lighten-1 mt-2">访问统计图表</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-account-clock</v-icon>
            最近登录用户
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="user in recentUsers"
                :key="user.id"
                :prepend-avatar="user.avatar"
                :title="user.username"
                :subtitle="user.lastLogin"
              >
                <template v-slot:append>
                  <v-chip
                    :color="user.isOnline ? 'success' : 'grey'"
                    size="small"
                  >
                    {{ user.isOnline ? '在线' : '离线' }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'permission'],
  permission: 'dashboard:read'
})

const { api } = useApi()

const stats = ref({
  userCount: 0,
  roleCount: 0,
  permissionCount: 0,
  onlineCount: 0
})

const recentUsers = ref([
  {
    id: 1,
    username: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    lastLogin: '2024-01-15 10:30:00',
    isOnline: true
  },
  {
    id: 2,
    username: 'user1',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    lastLogin: '2024-01-15 09:15:00',
    isOnline: false
  }
])

const loadStats = async () => {
  try {
    const response = await api('/dashboard/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>