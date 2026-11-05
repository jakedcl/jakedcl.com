'use client'

import {Box} from '@sanity/ui'
import {useEffect, type ComponentType} from 'react'
import {type DocumentLayoutProps} from 'sanity'
import {useDocumentPane, usePaneRouter} from 'sanity/structure'

import {
  SETTINGS_FIELD_GROUPS,
  SETTINGS_PANE_FIELD_GROUP,
} from '../settingsFieldGroups'

const ROOT_PATH: [] = []

function SettingsFieldGroupSync() {
  const {groupIndex, siblingIndex, routerPanesState} = usePaneRouter()
  const {documentType, onSetActiveFieldGroup} = useDocumentPane()

  useEffect(() => {
    if (documentType !== 'settings') return

    const paneId =
      routerPanesState[groupIndex]?.[siblingIndex]?.id ?? undefined
    const group =
      (paneId && SETTINGS_PANE_FIELD_GROUP[paneId]) ||
      SETTINGS_FIELD_GROUPS.homepage

    onSetActiveFieldGroup(ROOT_PATH, group)
  }, [
    documentType,
    groupIndex,
    onSetActiveFieldGroup,
    routerPanesState,
    siblingIndex,
  ])

  return null
}

export const SettingsStudioLayout: ComponentType<DocumentLayoutProps> = (
  props,
) => {
  if (props.documentType !== 'settings') {
    return props.renderDefault(props)
  }

  return (
    <Box
      data-settings-studio-page=""
      style={{
        minHeight: '100%',
      }}
    >
      <SettingsFieldGroupSync />
      <style>{`
        [data-settings-studio-page] [data-testid='field-group-tabs'],
        [data-settings-studio-page] [data-testid='field-group-select'] {
          display: none !important;
        }
      `}</style>
      {props.renderDefault(props)}
    </Box>
  )
}
