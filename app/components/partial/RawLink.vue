<script setup lang="ts">
const props = defineProps<{ to?: string }>()

// 使用 safego 外链安全跳转
const { transformLink, isExternal } = useSafego()

// 判断是否是邮箱链接
const isEmail = computed(() => props.to && props.to.includes('@') && !props.to.includes(':'))

// 判断是否是外部链接
const external = computed(() => isExtLink(props.to))

// 转换后的链接（如果是外链则通过 safego 转换）
const transformedTo = computed(() => {
	if (isEmail.value) {
		return `mailto:${props.to}`
	}
	if (external.value && isExternal(props.to)) {
		return transformLink(props.to)
	}
	return props.to
})

// 判断是否使用普通 <a> 标签
const useAnchor = computed(() => {
	return props.to === '#' || isEmail.value
})
</script>

<template>
<a v-if="useAnchor" :href="transformedTo" :target="isEmail ? undefined : '_blank'" :rel="external ? 'external nofollow noopener noreferrer' : undefined">
	<slot :external />
</a>
<span v-else-if="to === undefined"><slot /></span>
<NuxtLink v-else :to="transformedTo" :target="external ? '_blank' : undefined" :rel="external ? 'external nofollow noopener noreferrer' : undefined">
	<slot :external />
</NuxtLink>
</template>
