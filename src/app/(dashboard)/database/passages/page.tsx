// src/app/(dashboard)/database/passages/page.tsx

import { P } from "@/components/ui/Typography"
import { Card } from "@/components/ui/Card"

export default function BooksPage() {
  return (
    <div className="space-y-6">
      {/* H1 dihapus karena Tab sudah menjelaskannya */}
      <Card className="p-6">
        <P>Ini adalah placeholder untuk area konten <strong>Passages</strong>.</P>
        <P>Nantinya tabel data buku akan kita letakkan di sini.</P>
      </Card>
    </div>
  )
}
