<script setup>
defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  color: { type: String, default: 'primary' },
})
</script>

<template>
  <section class="module-header">
    <div class="module-header__main">
      <div class="module-header__identity">
        <VAvatar :color="color" variant="tonal" size="44" class="module-header__icon">
          <VIcon :icon="icon" size="23" />
        </VAvatar>
        <div class="module-header__copy">
          <h2>{{ title }}</h2>
          <p v-if="subtitle">{{ subtitle }}</p>
        </div>
      </div>
      <div v-if="$slots.actions" class="module-header__actions">
        <slot name="actions" />
      </div>
    </div>
    <div v-if="$slots.controls" class="module-header__controls">
      <slot name="controls" />
    </div>
  </section>
</template>

<style scoped>
.module-header {
  margin-bottom: 16px;
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-primary), .14);
  border-radius: 16px;
  background: linear-gradient(120deg, rgba(var(--v-theme-primary), .065), rgba(var(--v-theme-secondary), .025));
}
.module-header__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 76px;
  padding: 16px 20px;
}
.module-header__identity {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}
.module-header__icon { flex: 0 0 auto; }
.module-header__copy { min-width: 0; }
.module-header__copy h2 {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 600;
  line-height: 1.35;
}
.module-header__copy p {
  margin: 3px 0 0;
  color: rgba(var(--v-theme-on-surface), .62);
  font-size: .82rem;
  line-height: 1.45;
}
.module-header__actions,
.module-header__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 16px;
}
.module-header__actions { justify-content: flex-end; }
.module-header__controls {
  min-height: 54px;
  padding: 9px 20px;
  border-top: 1px solid rgba(var(--v-theme-primary), .09);
  background: rgba(var(--v-theme-surface), .32);
}
.module-header__controls :deep(.v-input) { flex: 0 0 auto; }

@media (max-width: 760px) {
  .module-header__main { align-items: stretch; flex-direction: column; gap: 12px; padding: 15px 16px; }
  .module-header__actions { justify-content: flex-start; width: 100%; }
  .module-header__controls { padding: 9px 16px; }
}
</style>
