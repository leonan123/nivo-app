import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'

interface IPaginationProps {
  pages: number
  items: number
  currentPage: number
}

export function Pagination({ pages, items, currentPage }: IPaginationProps) {
  const [, setSearchParams] = useSearchParams()

  function firstPage() {
    setSearchParams((params) => {
      params.set('page', '1')
      return params
    })
  }

  function prevPage() {
    if (currentPage - 1 <= 0) return

    setSearchParams((params) => {
      params.set('page', String(currentPage - 1))
      return params
    })
  }
  function nextPage() {
    if (currentPage + 1 > pages) return

    setSearchParams((params) => {
      params.set('page', String(currentPage + 1))
      return params
    })
  }

  function lastPage() {
    setSearchParams({ page: String(pages) })
  }

  return (
    <div className="flex items-center justify-between text-sm text-zinc-500">
      <span>Showing 10 of {items} items</span>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>

          <Select defaultValue="10">
            <SelectTrigger aria-label="Page" />
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span>
          Page {currentPage} of {pages}
        </span>

        <div className="space-x-1.5">
          <Button
            size="icon"
            onClick={firstPage}
            disabled={currentPage - 1 <= 0}
          >
            <ChevronsLeft className="size-4" />
            <span className="sr-only">First page</span>
          </Button>

          <Button
            size="icon"
            onClick={prevPage}
            disabled={currentPage - 1 <= 0}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          <Button
            size="icon"
            onClick={nextPage}
            disabled={currentPage >= pages}
          >
            <ChevronRight className="size-4" />
            <span className="sr-only">Next page</span>
          </Button>

          <Button
            size="icon"
            onClick={lastPage}
            disabled={currentPage >= pages}
          >
            <ChevronsRight className="size-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
