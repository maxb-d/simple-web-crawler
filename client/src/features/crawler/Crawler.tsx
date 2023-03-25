import { useState } from "react"

import SearchBar from "../../components/SearchBar"

import API from '@/lib/axiosApi'

type Props = {}

const Crawler = (props: Props) => {
    const [url, setUrl] = useState("")

    const crawl = () => {
        console.log(url)
        API.get()
    }

  return (
    <div>
        {/* FORM */}
        <div className="p-12 flex justify-center w-4/6">
            <SearchBar urlString={url} setUrl={setUrl} crawl={crawl} />
        </div>
    </div>
  )
}

export default Crawler