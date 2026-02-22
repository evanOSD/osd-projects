// src/app/(dashboard)/database/stories/page.tsx

import { P } from "@/components/ui/Typography"
import { Card } from "@/components/ui/Card"

export default function StoriesPage() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <P>Ini adalah placeholder untuk area konten <strong>Stories</strong>.</P>
        <P>Data cerita dari database akan dimuat pada tabel di halaman ini.</P>
      </Card>
    </div>
  )
}
