import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getBranding,
  getBrandingAssetRules,
  removeBrandingAsset,
  updateBranding,
  uploadBrandingAsset,
} from '../api/branding'
import { brandingKeys } from '../api/brandingKeys'
import type { Branding } from '../types/branding.types'

export function useBranding() {
  return useQuery({
    queryKey: brandingKeys.detail(),
    queryFn: getBranding,
    // Branding changes rarely; every mutation below refreshes the cache straight away.
    staleTime: 5 * 60_000,
  })
}

export function useBrandingAssetRules() {
  return useQuery({ queryKey: brandingKeys.assetRules(), queryFn: getBrandingAssetRules, staleTime: Infinity })
}

/** Every branding endpoint returns the whole branding, so the cache is replaced, not refetched. */
function useStoreBranding() {
  const queryClient = useQueryClient()
  return (branding: Branding) => {
    queryClient.setQueryData(brandingKeys.detail(), branding)
  }
}

export function useUpdateBranding() {
  const store = useStoreBranding()
  return useMutation({ mutationFn: updateBranding, onSuccess: store })
}

export function useUploadBrandingAsset() {
  const store = useStoreBranding()
  return useMutation({ mutationFn: uploadBrandingAsset, onSuccess: store })
}

export function useRemoveBrandingAsset() {
  const store = useStoreBranding()
  return useMutation({ mutationFn: removeBrandingAsset, onSuccess: store })
}
