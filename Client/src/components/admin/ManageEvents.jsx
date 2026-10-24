import React from 'react'
import { Page, PageHeader, EmptyState } from '../ui/Page'

function ManageEvents() {
  return (
    <Page className="max-w-5xl">
      <PageHeader title="Manage Events" subtitle="Approve and moderate submitted events" />
      <EmptyState title="Coming soon" text="Event approvals will appear here." />
    </Page>
  )
}

export default ManageEvents
