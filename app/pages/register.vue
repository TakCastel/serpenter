<template>
  <section>
    <div class="card w-full p-8 md:p-10">
      <div class="mb-6">
        <h1 class="text-2xl font-bold" style="color: var(--text-primary);">Créer un compte</h1>
        <p class="text-sm mt-1" style="color: var(--text-secondary);">Rejoignez Serpenter et préparez vos déploiements sereinement.</p>
      </div>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <label class="block text-sm" style="color: var(--text-secondary);">Email</label>
        <input v-model="email" type="email" required placeholder="you@example.com" class="w-full input" />
        <label class="block text-sm mt-2" style="color: var(--text-secondary);">Mot de passe</label>
        <div class="relative">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" required placeholder="••••••••" class="w-full input pr-14" />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-2 my-auto w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            :title="showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'"
            :aria-label="showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'"
            style="background-color: transparent;"
          >
            <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-5 h-5" :style="{ color: 'var(--text-primary)' }" />
          </button>
        </div>
        <button type="submit" class="w-full btn btn-primary mt-2">S'inscrire</button>
      </form>
      <div class="my-4 flex items-center gap-3">
        <div class="h-px flex-1" style="background-color: var(--bg-border);"></div>
        <span class="text-xs" style="color: var(--text-muted);">ou</span>
        <div class="h-px flex-1" style="background-color: var(--bg-border);"></div>
      </div>
      <button @click="onGoogle" class="w-full px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-3" style="background-color: var(--bg-primary); border: 1px solid var(--bg-border); color: var(--text-primary);">
        <Icon name="logos:google-icon" class="w-5 h-5" aria-hidden="true" />
        <span>Continuer avec Google</span>
      </button>
      <div class="mt-4 text-sm" style="color: var(--text-secondary);">
        <NuxtLink to="/login">Déjà un compte ? Se connecter</NuxtLink>
      </div>
      <p v-if="error" class="mt-4 text-sm" style="color: #fca5a5;">{{ error }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const { register, loginWithGoogle } = useAuth()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')

definePageMeta({ layout: 'auth' })

const onSubmit = async () => {
  error.value = ''
  try {
    await register(email.value, password.value)
    navigateTo('/dashboard')
  } catch (e: any) {
    error.value = e?.message || "Erreur lors de l'inscription"
  }
}

const onGoogle = async () => {
  error.value = ''
  try {
    await loginWithGoogle()
    navigateTo('/dashboard')
  } catch (e: any) {
    error.value = e?.message || "Erreur avec Google"
  }
}
</script>
