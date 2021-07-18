import React from 'react'
import { Accordion } from 'semantic-ui-react'

const TermsAndCondition = () => {
  const panels = [
    {
      key: `panel-0`,
      title: 'Terms',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, consectetur. Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, consectetur. Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, consectetur. Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, conse-ctetur.Lorem ipsum dolor sit amet, consectetur adipis- icng elit, sit amet, consectetur. Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, consectetur.Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, consectetur.',
    },
    {
      key: `panel-1`,
      title: 'Use Licenses',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, consectetur. Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, consectetur. Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, consectetur. Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, conse-ctetur.Lorem ipsum dolor sit amet, consectetur adipis- icng elit, sit amet, consectetur. Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, consectetur.Lorem ipsum dolor sit amet, consectetur adipisicng elit, sit amet, consectetur.',
    },
  ]

  return (
    <div className="tnc-tab">
      <Accordion
        defaultActiveIndex={[0, 1]}
        exclusive={false}
        panels={panels}
        fluid
      />
    </div>
  )
}

export default TermsAndCondition
