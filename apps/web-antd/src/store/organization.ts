import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import { getMyOrganizations, switchCurrentOrganization } from '#/api/system/organization';
import type { MyOrganizationItem } from '#/api/system/organization';

export const useOrganizationStore = defineStore(
  'organization',
  () => {
    const organizations = ref<MyOrganizationItem[]>([]);
    const currentOrganizationId = ref('');
    const loading = ref(false);

    const currentOrganization = computed(() => {
      return organizations.value.find(
        (item) => item.id === currentOrganizationId.value,
      );
    });

    async function loadMyOrganizations() {
      loading.value = true;
      try {
        const reply = await getMyOrganizations();
        organizations.value = reply.items;
        currentOrganizationId.value =
          reply.currentOrganizationId ||
          reply.items.find((item) => item.current)?.id ||
          reply.items[0]?.id ||
          '';
        markCurrentOrganization();
      } finally {
        loading.value = false;
      }
    }

    async function switchOrganization(organizationId: string) {
      if (!organizationId || organizationId === currentOrganizationId.value) {
        return;
      }
      const reply = await switchCurrentOrganization(organizationId);
      currentOrganizationId.value =
        reply.currentOrganizationId || organizationId;
      if (
        reply.current &&
        !organizations.value.some((item) => item.id === reply.current?.id)
      ) {
        organizations.value.push(reply.current);
      }
      markCurrentOrganization();
    }

    function markCurrentOrganization() {
      organizations.value = organizations.value.map((item) => ({
        ...item,
        current: item.id === currentOrganizationId.value,
      }));
    }

    function $reset() {
      organizations.value = [];
      currentOrganizationId.value = '';
      loading.value = false;
    }

    return {
      $reset,
      currentOrganization,
      currentOrganizationId,
      loadMyOrganizations,
      loading,
      organizations,
      switchOrganization,
    };
  },
  {
    persist: {
      pick: ['currentOrganizationId'],
    },
  },
);
