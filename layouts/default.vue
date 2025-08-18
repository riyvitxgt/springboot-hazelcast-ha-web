<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
    >
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          :title="user?.username"
          :subtitle="user?.email"
        >
          <template v-slot:append>
            <v-btn
              icon="mdi-logout"
              variant="text"
              @click="handleLogout"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav>
        <template v-for="item in menuItems" :key="item.title">
          <v-list-group v-if="item.children" :value="item.title">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="item.icon"
                :title="item.title"
              ></v-list-item>
            </template>

            <v-list-item
              v-for="child in item.children"
              :key="child.title"
              :prepend-icon="child.icon"
              :title="child.title"
              :to="child.to"
              exact
            ></v-list-item>
          </v-list-group>

          <v-list-item
            v-else
            :prepend-icon="item.icon"
            :title="item.title"
            :to="item.to"
            exact
          ></v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>管理系统</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-avatar size="32">
              <img src="https://randomuser.me/api/portraits/women/85.jpg" alt="avatar">
            </v-avatar>
          </v-btn>
        </template>
        
        <v-list>
          <v-list-item>
            <v-list-item-title>{{ user?.username }}</v-list-item-title>
            <v-list-item-subtitle>{{ user?.email }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="navigateTo('/profile')">
            <v-list-item-title>个人资料</v-list-item-title>
            <template v-slot:prepend>
              <v-icon>mdi-account</v-icon>
            </template>
          </v-list-item>
          <v-list-item @click="handleLogout">
            <v-list-item-title>退出登录</v-list-item-title>
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <!-- 如果是 Nuxt 3，使用 NuxtPage -->
        <NuxtPage />
        <!-- 如果是普通 Vue Router，使用 router-view -->
        <!-- <router-view /> -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const { user, signOut } = useAuthExtended()
const { showError } = useSnackbar()
const { menuItems } = useMenu()
const router = useRouter()

const drawer = ref(false)

const handleLogout = async () => {
  try {
    await signOut()
    router.push('/login')
  } catch (error) {
    showError(error.message || 'Logout failed')
    console.error('Logout error:', error)
  }
}
</script>