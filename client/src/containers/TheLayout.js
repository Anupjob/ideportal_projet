import React from 'react'
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader,
  TheHeaderNew
} from './index'

const TheLayout = () => {

  return (
    <div className="c-app c-default-layout">
      <TheSidebar />
      <div className="c-wrapper">

        <TheHeaderNew />
        <div className="c-body">
          <TheContent />
        </div>
        <TheFooter />
      </div>
    </div>
  )
}

export default TheLayout
