import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Pagination from './pagination'
import React from 'react'

describe('Pagination', () => {
  vi.mock('next/navigation', () => ({
    useRouter() {
      return {
        prefetch: () => null,
      }
    },

    usePathname() {
      return ''
    },
    useSearchParams() {
      const url = new URL('http:localhost:3000')
      url.searchParams.append('page', '1')
      return new URLSearchParams(url.searchParams)
    },
  }))

  //0 case is not necessary since the pagination is attached to the table and when there's 0 records it doesn't render.

 it('renders the correct number of page buttons', () => {
    const records = 50;
    render(<Pagination totalRecords={records} />)
    for(let i = 0; i < records / 5; i++){
        const pageButton = screen.getByTestId(`test-id-${i}`);
        
        if(records > 25){
            screen.getByTestId(`test-id-4`)
            return expect(pageButton).toBeDefined()
        }

        expect(pageButton).toBeDefined()
    }

  })
 
})
