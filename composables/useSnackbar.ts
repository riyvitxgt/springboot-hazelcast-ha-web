export interface SnackbarState {
  show: boolean
  text: string
  color: 'success' | 'error' | 'warning' | 'info'
  timeout: number
}

export const useSnackbar = () => {
  const snackbarState = useState<SnackbarState>('snackbar', () => ({
    show: false,
    text: '',
    color: 'info',
    timeout: 3000
  }))

  const showSuccess = (text: string, timeout: number = 3000) => {
    snackbarState.value = {
      show: true,
      text,
      color: 'success',
      timeout
    }
  }

  const showError = (text: string, timeout: number = 5000) => {
    snackbarState.value = {
      show: true,
      text,
      color: 'error',
      timeout
    }
  }

  const showWarning = (text: string, timeout: number = 4000) => {
    snackbarState.value = {
      show: true,
      text,
      color: 'warning',
      timeout
    }
  }

  const showInfo = (text: string, timeout: number = 3000) => {
    snackbarState.value = {
      show: true,
      text,
      color: 'info',
      timeout
    }
  }

  const hideSnackbar = () => {
    snackbarState.value.show = false
  }

  const showSnackbar = (
    text: string, 
    color: SnackbarState['color'] = 'info',
    timeout: number = 3000
  ) => {
    snackbarState.value = {
      show: true,
      text,
      color,
      timeout
    }
  }

  return {
    snackbarState: snackbarState,
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideSnackbar
  }
}