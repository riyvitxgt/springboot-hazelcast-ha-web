<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">用户管理</h1>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              label="搜索用户"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="text-right">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="showUserDialog = true"
              v-if="hasPermission('user:create')"
            >
              新增用户
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        :loading="loading"
        item-key="id"
      >
        <template v-slot:item.roles="{ item }">
          <v-chip-group>
            <v-chip
              v-for="role in item.roles"
              :key="role.id"
              size="small"
              color="primary"
            >
              {{ role.name }}
            </v-chip>
          </v-chip-group>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.enabled ? 'success' : 'error'"
            size="small"
          >
            {{ item.enabled ? '启用' : '禁用' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click="editUser(item)"
            v-if="hasPermission('user:update')"
          ></v-btn>
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            @click="deleteUser(item)"
            v-if="hasPermission('user:delete')"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- 用户编辑对话框 -->
    <v-dialog v-model="showUserDialog" max-width="600px">
      <v-card>
        <v-card-title>{{ editingUser ? '编辑用户' : '新增用户' }}</v-card-title>
        <v-card-text>
          <v-form ref="userFormRef">
            <v-text-field
              v-model="userForm.username"
              label="用户名"
              :rules="usernameRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="userForm.email"
              label="邮箱"
              type="email"
              :rules="emailRules"
              required
            ></v-text-field>

            <v-text-field
              v-if="!editingUser"
              v-model="userForm.password"
              label="密码"
              type="password"
              :rules="passwordRules"
              required
            ></v-text-field>

            <v-select
              v-model="userForm.roleIds"
              :items="availableRoles"
              item-title="name"
              item-value="id"
              label="角色"
              multiple
              chips
            ></v-select>

            <v-checkbox
              v-model="userForm.enabled"
              label="启用"
            ></v-checkbox>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeUserDialog">取消</v-btn>
          <v-btn
            color="primary"
            @click="saveUser"
            :loading="saving"
          >
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'permission'],
  permission: 'user:read'
})

const { api } = useApi()
const { hasPermission } = useAuthExtended()

const search = ref('')
const loading = ref(false)
const saving = ref(false)
const showUserDialog = ref(false)
const editingUser = ref(null)
const userFormRef = ref()

const users = ref([])
const availableRoles = ref([])

const userForm = ref({
  username: '',
  email: '',
  password: '',
  roleIds: [],
  enabled: true
})

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: '用户名', key: 'username', sortable: true },
  { title: '邮箱', key: 'email', sortable: true },
  { title: '角色', key: 'roles', sortable: false },
  { title: '状态', key: 'status', sortable: true },
  { title: '创建时间', key: 'createdAt', sortable: true },
  { title: '操作', key: 'actions', sortable: false }
]

const usernameRules = [
  (v: string) => !!v || '请输入用户名',
  (v: string) => v.length >= 3 || '用户名至少3个字符'
]

const emailRules = [
  (v: string) => !!v || '请输入邮箱',
  (v: string) => /.+@.+\..+/.test(v) || '请输入有效的邮箱地址'
]

const passwordRules = [
  (v: string) => !!v || '请输入密码',
  (v: string) => v.length >= 6 || '密码至少6个字符'
]

const loadUsers = async () => {
  loading.value = true
  try {
    const response = await api('/users')
    users.value = response.data
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    loading.value = false
  }
}

const loadRoles = async () => {
  try {
    const response = await api('/roles')
    availableRoles.value = response.data
  } catch (error) {
    console.error('Failed to load roles:', error)
  }
}

const editUser = (user: any) => {
  editingUser.value = user
  userForm.value = {
    username: user.username,
    email: user.email,
    password: '',
    roleIds: user.roles.map((r: any) => r.id),
    enabled: user.enabled
  }
  showUserDialog.value = true
}

const deleteUser = async (user: any) => {
  if (confirm(`确定要删除用户 ${user.username} 吗？`)) {
    try {
      await api(`/users/${user.id}`, { method: 'DELETE' })
      loadUsers()
      
      const globalState = useState('app')
      globalState.value.snackbar = {
        show: true,
        text: '用户删除成功',
        color: 'success'
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }
}

const saveUser = async () => {
  const { valid } = await userFormRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (editingUser.value) {
      await api(`/users/${editingUser.value.id}`, {
        method: 'PUT',
        body: userForm.value
      })
    } else {
      await api('/users', {
        method: 'POST',
        body: userForm.value
      })
    }
    
    loadUsers()
    closeUserDialog()
    
    const globalState = useState('app')
    globalState.value.snackbar = {
      show: true,
      text: editingUser.value ? '用户更新成功' : '用户创建成功',
      color: 'success'
    }
  } catch (error: any) {
    console.error('Failed to save user:', error)
    const globalState = useState('app')
    globalState.value.snackbar = {
      show: true,
      text: error.message || '保存失败',
      color: 'error'
    }
  } finally {
    saving.value = false
  }
}

const closeUserDialog = () => {
  showUserDialog.value = false
  editingUser.value = null
  userForm.value = {
    username: '',
    email: '',
    password: '',
    roleIds: [],
    enabled: true
  }
}

onMounted(() => {
  loadUsers()
  loadRoles()
})
</script>