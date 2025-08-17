<template>
  <NuxtLayout name="auth">
    <v-card class="mx-auto" max-width="400" elevation="8">
      <v-card-title class="text-h5 text-center pa-6">
        <v-icon size="48" class="mb-4">mdi-shield-account</v-icon>
        <div>管理系统登录</div>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleLogin" ref="formRef">
          <v-text-field
            v-model="form.username"
            label="用户名"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            :rules="usernameRules"
            required
          ></v-text-field>

          <v-text-field
            v-model="form.password"
            label="密码"
            type="password"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
            :rules="passwordRules"
            required
          ></v-text-field>

          <v-checkbox
            v-model="form.remember"
            label="记住我"
            color="primary"
          ></v-checkbox>

          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            :loading="loading"
            class="mt-4"
          >
            登录
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'guest'
})

const { signIn } = useAuthExtended()
const router = useRouter()
const formRef = ref()

const loading = ref(false)
const form = ref({
  username: '',
  password: '',
  remember: false
})

const usernameRules = [
  (v: string) => !!v || '请输入用户名',
  (v: string) => v.length >= 3 || '用户名至少3个字符'
]

const passwordRules = [
  (v: string) => !!v || '请输入密码',
  (v: string) => v.length >= 6 || '密码至少6个字符'
]

const handleLogin = async () => {
  const { valid } = await formRef.value.validate()
  const { showError } = useSnackbar()
  if (!valid) return

  loading.value = true
  try {
    const result = await signIn({
      username: form.value.username,
      password: form.value.password
    }, {callbackUrl: '/'})
  } catch (error: any) {
    console.error('Login error:', error)
    // 显示错误消息
    showError(error.message || 'Login failed');
  } finally {
    loading.value = false
  }
}
</script>