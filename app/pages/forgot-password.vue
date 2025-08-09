<template>
  <section>
    <div class="card w-full p-8 md:p-10">
      <div class="mb-6">
        <h1 class="text-2xl font-bold" style="color: var(--text-primary);">Mot de passe oublié</h1>
        <p class="text-sm mt-1" style="color: var(--text-secondary);">Recevez un lien de réinitialisation par email.</p>
      </div>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <label class="block text-sm" style="color: var(--text-secondary);">Email</label>
        <input v-model="email" type="email" required placeholder="you@example.com" class="w-full input" />
        <button type="submit" class="w-full btn btn-primary mt-2">Envoyer le lien</button>
      </form>
      <div class="mt-4 text-sm" style="color: var(--text-secondary);">
        <NuxtLink to="/login">Retour à la connexion</NuxtLink>
      </div>
      <p v-if="message" class="mt-4 text-sm" style="color: var(--accent-primary);">{{ message }}</p>
      <p v-if="error" class="mt-2 text-sm" style="color: #fca5a5;">{{ error }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const { forgotPassword } = useAuth()
const email = ref('')
const error = ref('')
const message = ref('')

definePageMeta({ layout: 'auth' })

const onSubmit = async () => {
  error.value = ''
  message.value = ''
  try {
    await forgotPassword(email.value)
    message.value = 'Lien de réinitialisation envoyé !'
  } catch (e: any) {
    error.value = e?.message || "Erreur lors de l'envoi du lien"
  }
}
</script>
